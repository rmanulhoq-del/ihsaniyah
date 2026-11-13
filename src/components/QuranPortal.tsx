import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Check,
  Copy,
  Eye,
  EyeOff,
  Pause,
  Play,
  RotateCcw,
  Search,
  Volume2,
} from 'lucide-react';
import { toLocalizedDigits } from '../data/islamicKnowledgeEn';
import { SURAH_INDEX_114, SurahIndexItem, toBengaliDigits } from '../data/surahNamesBn';
import {
  AyahItem,
  QARI_LIST,
  fetchSurahDetail,
  getFullSurahAudioUrl,
} from '../services/quranApi';
import { AppLang } from '../types/language';

const AYAHS_PER_PAGE = 15;

interface QuranPortalProps {
  lang?: AppLang;
  initialSurah?: number | null;
  onActiveAudioChange?: (state: {
    surahNumber: number;
    surahNameBn: string;
    surahNameEn: string;
    ayahNumber: number | null;
    qariNameBn: string;
    qariNameEn: string;
    isPlaying: boolean;
    onToggle: () => void;
    onNext: () => void;
    onPrev: () => void;
    onStop: () => void;
  } | null) => void;
}

function formatSeconds(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function QuranPortal({
  lang = 'bn',
  initialSurah = null,
  onActiveAudioChange,
}: QuranPortalProps) {
  const isEn = lang === 'en';
  const [selectedSurahNum, setSelectedSurahNum] = useState<number | null>(initialSurah);
  const [searchQuery, setSearchQuery] = useState('');
  const [revelationFilter, setRevelationFilter] = useState<'all' | 'মাক্কী' | 'মাদানী' | 'saved'>('all');
  const [qariId, setQariId] = useState<string>(QARI_LIST[0].id);

  const [ayahs, setAyahs] = useState<AyahItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination inside Surah Reader
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAllAyahs, setShowAllAyahs] = useState<boolean>(false);

  // Eye-comfort reading preferences
  const [showPronunciation, setShowPronunciation] = useState<boolean>(true);
  const [showAltGuide, setShowAltGuide] = useState<boolean>(false);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [arabicScale, setArabicScale] = useState<'sm' | 'md' | 'lg'>('md');
  const [khushuFocus, setKhushuFocus] = useState<boolean>(false);

  // Bookmarks & copy feedback
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ihsaniyah_quran_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Audio playback state (supports BOTH Full-Surah continuous MP3 & per-Ayah MP3)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingMode, setPlayingMode] = useState<'none' | 'surah' | 'ayah'>('none');
  const [playingSurahNum, setPlayingSurahNum] = useState<number | null>(null);
  const [playingAyahIdx, setPlayingAyahIdx] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<{ current: number; duration: number }>({
    current: 0,
    duration: 0,
  });

  const readerTopRef = useRef<HTMLDivElement | null>(null);
  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    setSelectedSurahNum(initialSurah);
  }, [initialSurah]);

  const currentSurahMeta: SurahIndexItem = useMemo(
    () =>
      SURAH_INDEX_114.find((s) => s.number === (selectedSurahNum ?? playingSurahNum ?? 1)) ||
      SURAH_INDEX_114[0],
    [selectedSurahNum, playingSurahNum]
  );

  const currentQari = useMemo(
    () => QARI_LIST.find((q) => q.id === qariId) || QARI_LIST[0],
    [qariId]
  );

  // Load Surah Ayahs whenever a Surah is opened
  const loadSurah = async (surahNum: number, qari: string) => {
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    try {
      const data = await fetchSurahDetail(surahNum, qari);
      setAyahs(data.ayahs);
      localStorage.setItem('ihsaniyah_last_surah', String(surahNum));
    } catch (err: any) {
      setError(
        err?.message ||
          (isEn ? 'Failed to load Surah. Please try again.' : 'সূরা লোড করতে সমস্যা হয়েছে।')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSurahNum !== null) {
      loadSurah(selectedSurahNum, qariId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSurahNum, qariId]);

  const ensureAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    return audioRef.current;
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setPlayingMode('none');
    setPlayingSurahNum(null);
    setPlayingAyahIdx(null);
    setIsPlaying(false);
    setAudioProgress({ current: 0, duration: 0 });
  };

  const playFullSurah = (surahNum: number, overrideQariId?: string) => {
    const targetQari = overrideQariId || qariId;
    const audio = ensureAudio();

    if (
      playingMode === 'surah' &&
      playingSurahNum === surahNum &&
      audio.src.includes(String(surahNum).padStart(3, '0') + '.mp3')
    ) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch(() => setIsPlaying(false));
        setIsPlaying(true);
      }
      return;
    }

    const url = getFullSurahAudioUrl(targetQari, surahNum);
    audio.src = url;
    audio.ontimeupdate = () => {
      setAudioProgress({
        current: audio.currentTime || 0,
        duration: audio.duration || 0,
      });
    };
    audio.onloadedmetadata = () => {
      setAudioProgress({
        current: audio.currentTime || 0,
        duration: audio.duration || 0,
      });
    };
    audio.onended = () => {
      if (surahNum < 114) {
        playFullSurah(surahNum + 1, targetQari);
      } else {
        stopPlayback();
      }
    };
    audio.onerror = () => {
      setIsPlaying(false);
    };

    audio.play().catch(() => setIsPlaying(false));
    setPlayingMode('surah');
    setPlayingSurahNum(surahNum);
    setPlayingAyahIdx(null);
    setIsPlaying(true);
  };

  const playAyahAtIndex = (index: number) => {
    const target = ayahs[index];
    if (!target || !target.audioUrl) return;
    const audio = ensureAudio();
    audio.src = target.audioUrl;
    audio.ontimeupdate = null;
    audio.onloadedmetadata = null;
    audio.onended = () => {
      if (index + 1 < ayahs.length) {
        playAyahAtIndex(index + 1);
      } else {
        stopPlayback();
      }
    };
    audio.onerror = () => {
      setIsPlaying(false);
    };

    audio.play().catch(() => setIsPlaying(false));
    setPlayingMode('ayah');
    setPlayingSurahNum(selectedSurahNum);
    setPlayingAyahIdx(index);
    setIsPlaying(true);

    // Ensure the page containing this ayah is active when playing
    if (!showAllAyahs) {
      const targetPage = Math.floor(index / AYAHS_PER_PAGE) + 1;
      if (targetPage !== currentPage) setCurrentPage(targetPage);
    }

    setTimeout(() => {
      const node = ayahRefs.current[index];
      if (node) {
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  };

  const togglePlayAyah = (index: number) => {
    if (playingMode === 'ayah' && playingAyahIdx === index && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }
    playAyahAtIndex(index);
  };

  // Switch full surah audio automatically if user switches Qari while playing
  useEffect(() => {
    if (playingMode === 'surah' && playingSurahNum !== null && isPlaying) {
      const audio = ensureAudio();
      audio.src = getFullSurahAudioUrl(qariId, playingSurahNum);
      audio.play().catch(() => setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qariId]);

  // Sync mini-player state to parent
  useEffect(() => {
    if (!onActiveAudioChange) return;
    if (playingMode === 'none' || playingSurahNum === null) {
      onActiveAudioChange(null);
      return;
    }
    const playingMeta =
      SURAH_INDEX_114.find((s) => s.number === playingSurahNum) || currentSurahMeta;
    const ayahNum =
      playingMode === 'ayah' && playingAyahIdx !== null && ayahs[playingAyahIdx]
        ? ayahs[playingAyahIdx].numberInSurah
        : null;

    onActiveAudioChange({
      surahNumber: playingMeta.number,
      surahNameBn: playingMeta.nameBn,
      surahNameEn: playingMeta.nameEn,
      ayahNumber: ayahNum,
      qariNameBn: currentQari.nameBn,
      qariNameEn: currentQari.nameEn,
      isPlaying,
      onToggle: () => {
        if (playingMode === 'surah') {
          playFullSurah(playingMeta.number);
        } else if (playingAyahIdx !== null) {
          togglePlayAyah(playingAyahIdx);
        }
      },
      onNext: () => {
        if (playingMode === 'ayah' && playingAyahIdx !== null && playingAyahIdx + 1 < ayahs.length) {
          playAyahAtIndex(playingAyahIdx + 1);
        } else if (playingMeta.number < 114) {
          playFullSurah(playingMeta.number + 1);
        }
      },
      onPrev: () => {
        if (playingMode === 'ayah' && playingAyahIdx !== null && playingAyahIdx - 1 >= 0) {
          playAyahAtIndex(playingAyahIdx - 1);
        } else if (playingMeta.number > 1) {
          playFullSurah(playingMeta.number - 1);
        }
      },
      onStop: stopPlayback,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playingMode, playingSurahNum, playingAyahIdx, isPlaying, currentQari.id, ayahs.length]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleBookmark = (surahNum: number, ayahNum: number) => {
    const key = `${surahNum}:${ayahNum}`;
    setBookmarkedAyahs((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      try {
        localStorage.setItem('ihsaniyah_quran_bookmarks', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const copyAyah = (ayah: AyahItem) => {
    const text = isEn
      ? `${ayah.arabic}\n\nTransliteration: ${ayah.translitLatin}\nTranslation: ${ayah.translationEn}\n— Surah ${currentSurahMeta.nameEn} (${currentSurahMeta.number}:${ayah.numberInSurah})`
      : `${ayah.arabic}\n\nউচ্চারণ: ${ayah.pronunciationBn}\nঅর্থ: ${ayah.translationBn}\n— সূরা ${currentSurahMeta.nameBn} (${toBengaliDigits(currentSurahMeta.number)}:${toBengaliDigits(ayah.numberInSurah)})`;
    navigator.clipboard?.writeText(text);
    const key = `${currentSurahMeta.number}:${ayah.numberInSurah}`;
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const bookmarkedSurahNumbers = useMemo(() => {
    const set = new Set<number>();
    for (const k of bookmarkedAyahs) {
      const [s] = k.split(':');
      if (s) set.add(Number(s));
    }
    return set;
  }, [bookmarkedAyahs]);

  const filteredSurahs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SURAH_INDEX_114.filter((s) => {
      if (revelationFilter === 'saved' && !bookmarkedSurahNumbers.has(s.number)) {
        return false;
      }
      if (
        (revelationFilter === 'মাক্কী' || revelationFilter === 'মাদানী') &&
        s.revelationType !== revelationFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        String(s.number) === q ||
        toBengaliDigits(s.number) === q ||
        s.nameBn.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.meaningBn.toLowerCase().includes(q) ||
        s.nameAr.includes(q)
      );
    });
  }, [searchQuery, revelationFilter, bookmarkedSurahNumbers]);

  // Ayah pagination inside active Surah
  const totalPages = Math.max(1, Math.ceil(ayahs.length / AYAHS_PER_PAGE));
  const displayedAyahs = useMemo(() => {
    if (showAllAyahs || ayahs.length <= AYAHS_PER_PAGE) {
      return ayahs.map((a, idx) => ({ ayah: a, globalIdx: idx }));
    }
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * AYAHS_PER_PAGE;
    return ayahs
      .slice(start, start + AYAHS_PER_PAGE)
      .map((a, i) => ({ ayah: a, globalIdx: start + i }));
  }, [ayahs, showAllAyahs, currentPage, totalPages]);

  const openSurahReader = (surahNum: number) => {
    setSelectedSurahNum(surahNum);
    setKhushuFocus(false);
    setTimeout(() => {
      readerTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const goToAyahPage = (page: number) => {
    setCurrentPage(page);
    readerTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const arabicTextSizeClass =
    arabicScale === 'sm'
      ? 'text-2xl sm:text-[1.75rem]'
      : arabicScale === 'lg'
        ? 'text-4xl sm:text-[2.65rem]'
        : 'text-3xl sm:text-[2.15rem]';

  const revLabel = (rev: 'মাক্কী' | 'মাদানী') =>
    isEn ? (rev === 'মাক্কী' ? 'Meccan' : 'Medinan') : rev;

  const isCurrentSurahAudioActive =
    playingMode === 'surah' && playingSurahNum === selectedSurahNum;

  return (
    <section ref={readerTopRef} className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
      {/* Section Masthead */}
      {!khushuFocus && (
        <div className="mb-8 pb-6 border-b border-[#E3DCCB] dark:border-[#1F3254] flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-wider text-[#8B5E2A] dark:text-[#D4AF6A] mb-2">
              {isEn
                ? 'The Noble Al-Quran · 114 Surahs · 6 Famous Qaris Full Audio · Arabic, Pronunciation & Translation'
                : 'পবিত্র আল-কুরআন · ১১৪টি সূরা · ৬ জন বিশ্ববিখ্যাত ক্বারীর সম্পূর্ণ তেলাওয়াত · আরবি, উচ্চারণ ও তর্জমা'}
            </p>
            <h2 className="text-3xl sm:text-4xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9] text-balance">
              {isEn ? 'Al-Quran Reading & Audio Recitation' : 'আল-কুরআনুল কারীম পাঠ ও তেলাওয়াত'}
            </h2>
          </div>
          <p className="text-sm text-[#57534E] dark:text-[#9BAAC4] max-w-md leading-relaxed">
            {isEn
              ? 'Organized like our Hadith archive: choose any Surah card to read page-by-page or listen continuously to famous Qaris.'
              : 'সহজ ও গোছানো কার্ড বিন্যাস: যেকোনো সূরা বাছাই করে পৃষ্ঠা অনুযায়ী পড়ুন অথবা বিশ্ববিখ্যাত ক্বারীদের কণ্ঠে পূর্ণ সূরার তেলাওয়াত শুনুন।'}
          </p>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 1: CLEAN 114 SURAH DIRECTORY CARDS (MATCHING HADITH PORTAL UX)  */}
      {/* ===================================================================== */}
      {selectedSurahNum === null && (
        <div className="space-y-6">
          {/* Top Search, Filter & Global Qari Selector */}
          <div className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-[#57534E] dark:text-[#9BAAC4] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isEn
                      ? 'Search Surah by name or number (1–114)...'
                      : 'সূরার নাম বা নম্বর খুঁজুন (১–১১৪)...'
                  }
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9] placeholder:text-[#57534E]/70 dark:placeholder:text-[#9BAAC4]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] dark:focus-visible:ring-[#34D399]"
                />
              </div>

              <div className="md:col-span-4 flex items-center gap-1 p-1 bg-[#EFEAE0] dark:bg-[#16233B] rounded-lg overflow-x-auto">
                {(
                  [
                    { id: 'all', label: isEn ? 'All (114)' : 'সকল (১১৪)' },
                    { id: 'মাক্কী', label: isEn ? 'Meccan' : 'মাক্কী' },
                    { id: 'মাদানী', label: isEn ? 'Medinan' : 'মাদানী' },
                    { id: 'saved', label: isEn ? 'Saved' : 'সংরক্ষিত' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setRevelationFilter(tab.id)}
                    className={`flex-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      revelationFilter === tab.id
                        ? 'bg-[#FCFBF7] dark:bg-[#0E1729] text-[#14532D] dark:text-[#34D399] shadow-xs'
                        : 'text-[#57534E] dark:text-[#9BAAC4] hover:text-[#1C1917] dark:hover:text-[#EDF2F9]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="md:col-span-3 inline-flex items-center gap-1.5 bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg px-2.5 py-2">
                <Volume2 className="w-4 h-4 text-[#8B5E2A] dark:text-[#D4AF6A] shrink-0" />
                <label htmlFor="dir-qari-select" className="sr-only">
                  {isEn ? 'Select Qari' : 'ক্বারী নির্বাচন করুন'}
                </label>
                <select
                  id="dir-qari-select"
                  value={qariId}
                  onChange={(e) => setQariId(e.target.value)}
                  className="bg-transparent text-xs text-[#1C1917] dark:text-[#EDF2F9] focus:outline-none w-full"
                >
                  {QARI_LIST.map((q) => (
                    <option key={q.id} value={q.id} className="bg-[#FCFBF7] dark:bg-[#0E1729]">
                      {isEn ? q.nameEn : q.nameBn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 3-Column Surah Cards Grid */}
          {filteredSurahs.length === 0 ? (
            <div className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-10 text-center text-sm text-[#57534E] dark:text-[#9BAAC4]">
              {isEn ? 'No Surah matched your filter.' : 'কোনো সূরা পাওয়া যায়নি।'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSurahs.map((s) => {
                const isSurahPlaying =
                  playingMode === 'surah' && playingSurahNum === s.number && isPlaying;
                return (
                  <article
                    key={s.number}
                    className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-[#14532D]/60 dark:hover:border-[#34D399]/60 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="w-9 h-9 rounded-lg bg-[#EFEAE0] dark:bg-[#16233B] text-[#14532D] dark:text-[#34D399] flex items-center justify-center text-xs font-bold tabular-nums shrink-0">
                          {toLocalizedDigits(s.number, lang)}
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-lg font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9] truncate">
                            {isEn ? s.nameEn : s.nameBn}
                          </h3>
                          <div className="text-xs text-[#57534E] dark:text-[#9BAAC4] truncate">
                            {isEn
                              ? `${s.nameBn} · ${s.ayahCount} Ayahs · ${revLabel(s.revelationType)}`
                              : `${s.meaningBn} · ${toBengaliDigits(s.ayahCount)} আয়াত · ${s.revelationType}`}
                          </div>
                        </div>
                      </div>
                      <span className="font-arabic text-2xl text-[#8B5E2A] dark:text-[#D4AF6A] shrink-0">
                        {s.nameAr}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-[#E3DCCB]/60 dark:border-[#1F3254]/60 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => playFullSurah(s.number)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                          isSurahPlaying
                            ? 'bg-[#14532D] dark:bg-[#34D399] border-[#14532D] dark:border-[#34D399] text-white dark:text-[#080E1A]'
                            : 'border-[#E3DCCB] dark:border-[#1F3254] text-[#57534E] dark:text-[#9BAAC4] hover:text-[#1C1917] dark:hover:text-[#EDF2F9] hover:bg-[#EFEAE0] dark:hover:bg-[#16233B]'
                        }`}
                      >
                        {isSurahPlaying ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {isEn
                            ? isSurahPlaying
                              ? 'Pause'
                              : 'Listen'
                            : isSurahPlaying
                              ? 'বিরতি'
                              : 'তেলাওয়াত শুনুন'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openSurahReader(s.number)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#14532D] dark:text-[#34D399] hover:underline cursor-pointer whitespace-nowrap"
                      >
                        <span>{isEn ? 'Read Surah →' : 'সূরা পড়ুন →'}</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 2: FOCUSED SURAH READER (FULL QARI AUDIO + 15/PAGE PAGINATION)   */}
      {/* ===================================================================== */}
      {selectedSurahNum !== null && (
        <div className={khushuFocus ? 'max-w-4xl mx-auto space-y-6' : 'space-y-6'}>
          {/* Reader Top Control Card */}
          <div className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-5 sm:p-6 space-y-5">
            {!khushuFocus && (
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E3DCCB] dark:border-[#1F3254]">
                <button
                  type="button"
                  onClick={() => setSelectedSurahNum(null)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border border-[#E3DCCB] dark:border-[#1F3254] bg-[#F7F4EC] dark:bg-[#080E1A] text-[#1C1917] dark:text-[#EDF2F9] hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Back to All 114 Surahs' : 'সকল ১১৪টি সূরায় ফিরুন'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <label htmlFor="reader-surah-switch" className="sr-only">
                    {isEn ? 'Switch Surah' : 'সূরা পরিবর্তন করুন'}
                  </label>
                  <select
                    id="reader-surah-switch"
                    value={selectedSurahNum}
                    onChange={(e) => openSurahReader(Number(e.target.value))}
                    className="px-3 py-1.5 text-xs bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9]"
                  >
                    {SURAH_INDEX_114.map((s) => (
                      <option key={s.number} value={s.number} className="bg-[#FCFBF7] dark:bg-[#0E1729]">
                        {isEn
                          ? `${s.number}. ${s.nameEn} (${s.ayahCount})`
                          : `${toBengaliDigits(s.number)}. ${s.nameBn} (${toBengaliDigits(s.ayahCount)})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Surah Title Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E3DCCB] dark:border-[#1F3254]">
              <div>
                <div className="text-xs text-[#57534E] dark:text-[#9BAAC4] mb-1 tabular-nums">
                  {isEn
                    ? `Surah ${currentSurahMeta.number} · ${revLabel(currentSurahMeta.revelationType)} · ${currentSurahMeta.ayahCount} Ayahs`
                    : `সূরা নং ${toBengaliDigits(currentSurahMeta.number)} · ${currentSurahMeta.revelationType} · ${toBengaliDigits(currentSurahMeta.ayahCount)} আয়াত`}
                </div>
                <div className="flex items-baseline gap-4 flex-wrap">
                  <h3 className="text-2xl sm:text-3xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                    {isEn ? currentSurahMeta.nameEn : currentSurahMeta.nameBn}
                  </h3>
                  <span className="text-sm text-[#8B5E2A] dark:text-[#D4AF6A]">
                    ({isEn ? currentSurahMeta.nameBn : currentSurahMeta.meaningBn})
                  </span>
                </div>
              </div>
              <div className="font-arabic text-3xl sm:text-4xl text-[#14532D] dark:text-[#6EE7B7]">
                {currentSurahMeta.nameAr}
              </div>
            </div>

            {/* Full-Surah Continuous Audio Player Bar */}
            <div className="p-4 rounded-xl bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => playFullSurah(currentSurahMeta.number)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#14532D] dark:bg-[#34D399] text-white dark:text-[#080E1A] hover:opacity-95 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {isCurrentSurahAudioActive && isPlaying ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {isEn
                        ? isCurrentSurahAudioActive && isPlaying
                          ? 'Pause Full Surah'
                          : 'Play Full Surah Audio'
                        : isCurrentSurahAudioActive && isPlaying
                          ? 'তেলাওয়াত বিরতি'
                          : 'সম্পূর্ণ সূরার তেলাওয়াত শুনুন'}
                    </span>
                  </button>

                  <div className="inline-flex items-center gap-1.5 bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg px-2.5 py-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-[#8B5E2A] dark:text-[#D4AF6A] shrink-0" />
                    <label htmlFor="qari-select" className="sr-only">
                      {isEn ? 'Select Qari' : 'ক্বারী নির্বাচন করুন'}
                    </label>
                    <select
                      id="qari-select"
                      value={qariId}
                      onChange={(e) => setQariId(e.target.value)}
                      className="bg-transparent text-xs text-[#1C1917] dark:text-[#EDF2F9] focus:outline-none max-w-[230px]"
                    >
                      {QARI_LIST.map((q) => (
                        <option key={q.id} value={q.id} className="bg-[#FCFBF7] dark:bg-[#0E1729]">
                          {isEn ? q.nameEn : q.nameBn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {isCurrentSurahAudioActive && audioProgress.duration > 0 && (
                  <div className="text-xs text-[#57534E] dark:text-[#9BAAC4] tabular-nums">
                    {formatSeconds(audioProgress.current)} / {formatSeconds(audioProgress.duration)}
                  </div>
                )}
              </div>

              {isCurrentSurahAudioActive && audioProgress.duration > 0 && (
                <input
                  type="range"
                  min={0}
                  max={audioProgress.duration || 100}
                  value={audioProgress.current}
                  onChange={(e) => {
                    const nextTime = Number(e.target.value);
                    if (audioRef.current) {
                      audioRef.current.currentTime = nextTime;
                      setAudioProgress((p) => ({ ...p, current: nextTime }));
                    }
                  }}
                  aria-label={isEn ? 'Seek Surah audio' : 'অডিও টাইমলাইন'}
                  className="w-full accent-[#14532D] dark:accent-[#34D399] cursor-pointer"
                />
              )}
            </div>

            {/* Eye-Comfort Reading Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPronunciation((v) => !v)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    showPronunciation
                      ? 'bg-[#EFEAE0] dark:bg-[#16233B] border-[#8B5E2A]/40 dark:border-[#D4AF6A]/40 text-[#1C1917] dark:text-[#EDF2F9]'
                      : 'border-[#E3DCCB] dark:border-[#1F3254] text-[#57534E] dark:text-[#9BAAC4]'
                  }`}
                >
                  {isEn ? 'Transliteration' : 'উচ্চারণ'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowTranslation((v) => !v)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    showTranslation
                      ? 'bg-[#EFEAE0] dark:bg-[#16233B] border-[#8B5E2A]/40 dark:border-[#D4AF6A]/40 text-[#1C1917] dark:text-[#EDF2F9]'
                      : 'border-[#E3DCCB] dark:border-[#1F3254] text-[#57534E] dark:text-[#9BAAC4]'
                  }`}
                >
                  {isEn ? 'Translation' : 'বাংলা তর্জমা'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAltGuide((v) => !v)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    showAltGuide
                      ? 'bg-[#EFEAE0] dark:bg-[#16233B] border-[#8B5E2A]/40 dark:border-[#D4AF6A]/40 text-[#1C1917] dark:text-[#EDF2F9]'
                      : 'border-[#E3DCCB] dark:border-[#1F3254] text-[#57534E] dark:text-[#9BAAC4]'
                  }`}
                >
                  {isEn ? 'Bangla Guide' : 'English'}
                </button>

                {ayahs.length > AYAHS_PER_PAGE && (
                  <button
                    type="button"
                    onClick={() => setShowAllAyahs((v) => !v)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      showAllAyahs
                        ? 'bg-[#EFEAE0] dark:bg-[#16233B] border-[#14532D]/40 dark:border-[#34D399]/40 text-[#14532D] dark:text-[#34D399]'
                        : 'border-[#E3DCCB] dark:border-[#1F3254] text-[#57534E] dark:text-[#9BAAC4]'
                    }`}
                  >
                    {isEn
                      ? showAllAyahs
                        ? 'Paginated (15/page)'
                        : 'Show All Ayahs'
                      : showAllAyahs
                        ? 'পৃষ্ঠা বিন্যাস (১৫/পৃষ্ঠা)'
                        : 'সব আয়াত একসাথে'}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg overflow-hidden">
                  {(
                    [
                      { id: 'sm', label: isEn ? 'A-' : 'অ-' },
                      { id: 'md', label: isEn ? 'A' : 'অ' },
                      { id: 'lg', label: isEn ? 'A+' : 'অ+' },
                    ] as const
                  ).map((sz) => (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => setArabicScale(sz.id)}
                      className={`px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                        arabicScale === sz.id
                          ? 'bg-[#EFEAE0] dark:bg-[#16233B] font-semibold text-[#1C1917] dark:text-[#EDF2F9]'
                          : 'text-[#57534E] dark:text-[#9BAAC4]'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setKhushuFocus((v) => !v)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-[#E3DCCB] dark:border-[#1F3254] text-[#57534E] dark:text-[#9BAAC4] hover:text-[#1C1917] dark:hover:text-[#EDF2F9] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {khushuFocus ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {isEn
                    ? khushuFocus
                      ? 'Exit Focus'
                      : 'Focus Mode'
                    : khushuFocus
                      ? 'সাধারণ ভিউ'
                      : 'খুশু মোড'}
                </button>
              </div>
            </div>
          </div>

          {/* Bismillah Header (except Surah 9 At-Tawbah and Surah 1) */}
          {currentSurahMeta.number !== 9 && currentSurahMeta.number !== 1 && (
            <div className="text-center py-6 border-y border-[#E3DCCB] dark:border-[#1F3254]">
              <p className="font-arabic text-2xl sm:text-3xl text-[#14532D] dark:text-[#6EE7B7]">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-xs text-[#57534E] dark:text-[#9BAAC4] mt-2">
                {isEn
                  ? 'Bismillahir Rahmanir Rahim · In the name of Allah, the Most Compassionate, the Most Merciful'
                  : 'বিসমিল্লাহির রাহমানির রাহীম · পরম করুণাময়, অসীম দয়ালু আল্লাহর নামে'}
              </p>
            </div>
          )}

          {/* Loading / Error / Paginated Ayahs */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((skeleton) => (
                <div
                  key={skeleton}
                  className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-6 animate-pulse"
                >
                  <div className="h-4 w-24 bg-[#EFEAE0] dark:bg-[#16233B] rounded mb-6" />
                  <div className="h-8 w-3/4 ml-auto bg-[#EFEAE0] dark:bg-[#16233B] rounded mb-4" />
                  <div className="h-4 w-5/6 bg-[#EFEAE0] dark:bg-[#16233B] rounded mb-2" />
                  <div className="h-4 w-2/3 bg-[#EFEAE0] dark:bg-[#16233B] rounded" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-8 text-center">
              <p className="text-sm text-[#9A3412] dark:text-[#FDBA74] mb-4">{error}</p>
              <button
                type="button"
                onClick={() => loadSurah(selectedSurahNum, qariId)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-[#14532D] dark:bg-[#34D399] text-white dark:text-[#080E1A]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isEn ? 'Try Again' : 'আবার চেষ্টা করুন'}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {displayedAyahs.map(({ ayah, globalIdx }) => {
                const isThisPlaying = playingMode === 'ayah' && playingAyahIdx === globalIdx;
                const bookmarkKey = `${currentSurahMeta.number}:${ayah.numberInSurah}`;
                const isBookmarked = bookmarkedAyahs.includes(bookmarkKey);
                const isCopied = copiedKey === bookmarkKey;

                return (
                  <article
                    key={ayah.number}
                    ref={(el) => {
                      ayahRefs.current[globalIdx] = el as HTMLDivElement | null;
                    }}
                    className={`rounded-xl p-5 sm:p-7 border transition-colors ${
                      isThisPlaying
                        ? 'bg-[#EFEAE0]/80 dark:bg-[#16233B] border-[#14532D] dark:border-[#34D399]'
                        : 'bg-[#FCFBF7] dark:bg-[#0E1729] border-[#E3DCCB] dark:border-[#1F3254]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 pb-4 mb-5 border-b border-[#E3DCCB]/60 dark:border-[#1F3254]/70">
                      <div className="text-xs text-[#57534E] dark:text-[#9BAAC4] tabular-nums">
                        {isEn
                          ? `Ayah ${currentSurahMeta.number}:${ayah.numberInSurah} · Juz ${ayah.juz} · Page ${ayah.page}`
                          : `আয়াত ${toBengaliDigits(currentSurahMeta.number)}:${toBengaliDigits(ayah.numberInSurah)} · পারা ${toBengaliDigits(ayah.juz)} · পৃষ্ঠা ${toBengaliDigits(ayah.page)}`}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => togglePlayAyah(globalIdx)}
                          aria-label={isEn ? 'Listen to Ayah' : 'আয়াত তেলাওয়াত শুনুন'}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                            isThisPlaying && isPlaying
                              ? 'bg-[#14532D] dark:bg-[#34D399] text-white dark:text-[#080E1A]'
                              : 'text-[#57534E] dark:text-[#9BAAC4] hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] hover:text-[#1C1917] dark:hover:text-[#EDF2F9]'
                          }`}
                        >
                          {isThisPlaying && isPlaying ? (
                            <Pause className="w-3.5 h-3.5" />
                          ) : (
                            <Play className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {isEn
                              ? isThisPlaying && isPlaying
                                ? 'Pause'
                                : 'Listen'
                              : isThisPlaying && isPlaying
                                ? 'বিরতি'
                                : 'শুনুন'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleBookmark(currentSurahMeta.number, ayah.numberInSurah)}
                          aria-label={isEn ? 'Bookmark Ayah' : 'আয়াত বুকমার্ক করুন'}
                          className="p-1.5 rounded-md text-[#57534E] dark:text-[#9BAAC4] hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] hover:text-[#8B5E2A] dark:hover:text-[#D4AF6A] transition-colors cursor-pointer"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-[#8B5E2A] dark:text-[#D4AF6A]" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => copyAyah(ayah)}
                          aria-label={isEn ? 'Copy Ayah' : 'আয়াত কপি করুন'}
                          className="p-1.5 rounded-md text-[#57534E] dark:text-[#9BAAC4] hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] hover:text-[#1C1917] dark:hover:text-[#EDF2F9] transition-colors cursor-pointer"
                        >
                          {isCopied ? (
                            <Check className="w-4 h-4 text-[#14532D] dark:text-[#34D399]" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <p
                      className={`font-arabic ${arabicTextSizeClass} leading-[2.3] text-right text-[#1C1917] dark:text-[#EDF2F9] mb-5`}
                    >
                      {ayah.arabic}
                    </p>

                    {showPronunciation && (
                      <div className="mb-3">
                        <span className="text-xs font-semibold text-[#8B5E2A] dark:text-[#D4AF6A] mr-2">
                          {isEn ? 'Transliteration:' : 'উচ্চারণ:'}
                        </span>
                        <span
                          className={`text-[15px] leading-relaxed ${
                            isEn
                              ? 'italic text-[#292524] dark:text-[#D6D3CD]'
                              : 'text-[#292524] dark:text-[#D6D3CD]'
                          }`}
                        >
                          {isEn ? ayah.translitLatin : ayah.pronunciationBn}
                        </span>
                      </div>
                    )}

                    {showTranslation && (
                      <div className="pt-3 border-t border-[#E3DCCB]/50 dark:border-[#1F3254]/60">
                        <span className="text-xs font-semibold text-[#14532D] dark:text-[#34D399] mr-2">
                          {isEn ? 'Translation:' : 'অর্থ ও তর্জমা:'}
                        </span>
                        <span className="font-editorial text-[16px] leading-[1.8] text-[#1C1917] dark:text-[#EDF2F9]">
                          {isEn ? ayah.translationEn : ayah.translationBn}
                        </span>
                      </div>
                    )}

                    {showAltGuide && (
                      <div className="mt-3 pt-3 border-t border-[#E3DCCB]/40 dark:border-[#1F3254]/40 space-y-1.5 text-sm text-[#57534E] dark:text-[#9BAAC4]">
                        {isEn ? (
                          <>
                            <div>
                              <span className="text-xs font-medium mr-2">উচ্চারণ:</span>
                              <span>{ayah.pronunciationBn}</span>
                            </div>
                            <div>
                              <span className="text-xs font-medium mr-2">বাংলা তর্জমা:</span>
                              <span>{ayah.translationBn}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <span className="text-xs font-medium mr-2">Phonetic:</span>
                              <span className="italic">{ayah.translitLatin}</span>
                            </div>
                            <div>
                              <span className="text-xs font-medium mr-2">English (Sahih Int.):</span>
                              <span>{ayah.translationEn}</span>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}

              {/* Ayah Pagination Controls */}
              {!showAllAyahs && totalPages > 1 && (
                <div className="pt-2 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => goToAyahPage(currentPage - 1)}
                    className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg border border-[#E3DCCB] dark:border-[#1F3254] bg-[#FCFBF7] dark:bg-[#0E1729] text-[#1C1917] dark:text-[#EDF2F9] disabled:opacity-40 hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] transition-colors cursor-pointer"
                  >
                    {isEn ? '← Previous 15 Ayahs' : '← আগের ১৫টি আয়াত'}
                  </button>

                  <span className="text-xs text-[#57534E] dark:text-[#9BAAC4] tabular-nums">
                    {isEn
                      ? `Page ${currentPage} / ${totalPages}`
                      : `পৃষ্ঠা ${toBengaliDigits(currentPage)} / ${toBengaliDigits(totalPages)}`}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => goToAyahPage(currentPage + 1)}
                    className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg border border-[#E3DCCB] dark:border-[#1F3254] bg-[#FCFBF7] dark:bg-[#0E1729] text-[#1C1917] dark:text-[#EDF2F9] disabled:opacity-40 hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] transition-colors cursor-pointer"
                  >
                    {isEn ? 'Next 15 Ayahs →' : 'পরের ১৫টি আয়াত →'}
                  </button>
                </div>
              )}

              {/* Surah Footer Navigation */}
              <div className="pt-4 border-t border-[#E3DCCB] dark:border-[#1F3254] flex items-center justify-between gap-4">
                <button
                  type="button"
                  disabled={selectedSurahNum <= 1}
                  onClick={() => openSurahReader(Math.max(1, selectedSurahNum - 1))}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-[#E3DCCB] dark:border-[#1F3254] bg-[#FCFBF7] dark:bg-[#0E1729] text-[#1C1917] dark:text-[#EDF2F9] disabled:opacity-40 hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] transition-colors cursor-pointer"
                >
                  {isEn ? '← Previous Surah' : '← পূর্ববর্তী সূরা'}
                </button>
                <button
                  type="button"
                  disabled={selectedSurahNum >= 114}
                  onClick={() => openSurahReader(Math.min(114, selectedSurahNum + 1))}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-[#E3DCCB] dark:border-[#1F3254] bg-[#FCFBF7] dark:bg-[#0E1729] text-[#1C1917] dark:text-[#EDF2F9] disabled:opacity-40 hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] transition-colors cursor-pointer"
                >
                  {isEn ? 'Next Surah →' : 'পরবর্তী সূরা →'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
