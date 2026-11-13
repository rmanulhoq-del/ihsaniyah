import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Menu,
  Moon,
  Pause,
  Play,
  ShieldCheck,
  SkipBack,
  SkipForward,
  Sun,
  X,
} from 'lucide-react';
import {
  AdminPanel,
  CustomEntry,
  DEFAULT_SITE_CONFIG,
  SiteConfig,
} from './components/AdminPanel';
import { HadithPortal } from './components/HadithPortal';
import { HistoryAndPhilosophy } from './components/HistoryAndPhilosophy';
import { QuranPortal } from './components/QuranPortal';
import { ResilientImage } from './components/ResilientImage';
import { WorshipAndPillars } from './components/WorshipAndPillars';
import { ayahArabicToBengali } from './data/arabicPronunciationBn';
import { toLocalizedDigits } from './data/islamicKnowledgeEn';
import { SURAH_INDEX_114, toBengaliDigits } from './data/surahNamesBn';
import { HADITH_BOOKS } from './services/hadithApi';
import { AppLang } from './types/language';
import quranAlaqMushafImg from './assets/images/quran_alaq_mushaf_1794580127661.jpg';

type ActiveSection = 'home' | 'quran' | 'hadith' | 'worship' | 'history' | 'admin';
type HistorySubTab = 'prophets' | 'caliphs' | 'scholars' | 'science' | 'philosophy';
type WorshipSubTab = 'daily' | 'tasbih' | 'salah-proofs' | 'deeds' | 'pillars';

interface ActiveAudioState {
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
}

const FIRST_REVELATION_AYAHS = [
  {
    ayah: 1,
    arabic: 'اِقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
    translitEn: "Iqra' bismi rabbikal-ladhi khalaq",
    meaningBn: 'পড়ো তোমার প্রতিপালকের নামে, যিনি সৃষ্টি করেছেন।',
    meaningEn: 'Recite in the name of your Lord who created—',
  },
  {
    ayah: 2,
    arabic: 'خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ',
    translitEn: "Khalaqal-insana min 'alaq",
    meaningBn: 'সৃষ্টি করেছেন মানুষকে জমাট রক্তপিণ্ড থেকে।',
    meaningEn: 'Created man from a clinging substance.',
  },
  {
    ayah: 3,
    arabic: 'اِقْرَأْ وَرَبُّكَ الْأَكْرَمُ',
    translitEn: "Iqra' wa rabbukal-akram",
    meaningBn: 'পড়ো, আর তোমার প্রতিপালক মহা মহিমান্বিত।',
    meaningEn: 'Recite, and your Lord is the Most Generous—',
  },
  {
    ayah: 4,
    arabic: 'الَّذِي عَلَّمَ بِالْقَلَمِ',
    translitEn: "Alladhi 'allama bil-qalam",
    meaningBn: 'যিনি কলমের মাধ্যমে শিক্ষা দিয়েছেন।',
    meaningEn: 'Who taught by the pen—',
  },
  {
    ayah: 5,
    arabic: 'عَلَّمَ الْإِنسَانَ مَا لَمْ يَعْلَمْ',
    translitEn: "'Allamal-insana ma lam ya'lam",
    meaningBn: 'শিক্ষা দিয়েছেন মানুষকে, যা সে জানতো না।',
    meaningEn: 'Taught man that which he knew not.',
  },
];

export default function App() {
  const [section, setSection] = useState<ActiveSection>('home');
  const [lang, setLang] = useState<AppLang>(() => {
    try {
      const saved = localStorage.getItem('ihsaniyah_lang');
      return saved === 'en' ? 'en' : 'bn';
    } catch {
      return 'bn';
    }
  });

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem('ihsaniyah_site_config');
      return saved ? { ...DEFAULT_SITE_CONFIG, ...JSON.parse(saved) } : DEFAULT_SITE_CONFIG;
    } catch {
      return DEFAULT_SITE_CONFIG;
    }
  });

  const [customEntries, setCustomEntries] = useState<CustomEntry[]>(() => {
    try {
      const saved = localStorage.getItem('ihsaniyah_custom_entries');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [lastReadSurah, setLastReadSurah] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ihsaniyah_last_surah');
      const num = saved ? Number(saved) : 1;
      return num >= 1 && num <= 114 ? num : 1;
    } catch {
      return 1;
    }
  });

  const [quranInitialSurah, setQuranInitialSurah] = useState<number | null>(null);
  const [selectedHadithBookId, setSelectedHadithBookId] = useState<string>(HADITH_BOOKS[0].id);
  const [historySubTab, setHistorySubTab] = useState<HistorySubTab>('prophets');
  const [worshipSubTab, setWorshipSubTab] = useState<WorshipSubTab>('daily');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeAudio, setActiveAudio] = useState<ActiveAudioState | null>(null);

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('ihsaniyah_theme', 'dark');
      } catch {
        // ignore
      }
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('ihsaniyah_theme', 'light');
      } catch {
        // ignore
      }
    }
  }, [isDark]);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('ihsaniyah_lang', lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const handleUpdateSiteConfig = (next: SiteConfig) => {
    setSiteConfig(next);
    try {
      localStorage.setItem('ihsaniyah_site_config', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleUpdateCustomEntries = (next: CustomEntry[]) => {
    setCustomEntries(next);
    try {
      localStorage.setItem('ihsaniyah_custom_entries', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const isEn = lang === 'en';

  const navigateTo = (target: ActiveSection, sub?: HistorySubTab) => {
    if (sub) setHistorySubTab(sub);
    if (target === 'quran') {
      setQuranInitialSurah(null);
    }
    setSection(target);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToWorship = (tab: WorshipSubTab) => {
    setWorshipSubTab(tab);
    setSection('worship');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openSurah = (surahNum: number) => {
    setLastReadSurah(surahNum);
    setQuranInitialSurah(surahNum);
    setSection('quran');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openHadithBook = (bookId: string) => {
    setSelectedHadithBookId(bookId);
    setSection('hadith');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems: Array<{ id: ActiveSection; label: string }> = isEn
    ? [
        { id: 'home', label: 'Home' },
        { id: 'quran', label: 'Al-Quran' },
        { id: 'hadith', label: 'Al-Hadith' },
        { id: 'worship', label: 'Worship & Pillars' },
        { id: 'history', label: 'History & Thought' },
      ]
    : [
        { id: 'home', label: 'হোম' },
        { id: 'quran', label: 'আল-কুরআন' },
        { id: 'hadith', label: 'আল-হাদিস' },
        { id: 'worship', label: 'ইবাদত ও আমল' },
        { id: 'history', label: 'ইতিহাস ও দর্শন' },
      ];

  const featuredSurahs = [
    {
      number: 1,
      nameBn: 'আল-ফাতিহা',
      nameEn: 'Al-Fatihah',
      descBn: '৭ আয়াত · কুরআনের সূচনা',
      descEn: '7 Ayahs · The Opening',
    },
    {
      number: 2,
      nameBn: 'আল-বাকারা',
      nameEn: 'Al-Baqarah',
      descBn: '২৮৬ আয়াত · আয়াতুল কুরসী সমৃদ্ধ',
      descEn: '286 Ayahs · Includes Ayat al-Kursi',
    },
    {
      number: 18,
      nameBn: 'আল-কাহফ',
      nameEn: 'Al-Kahf',
      descBn: '১১০ আয়াত · জুমুআ দিনের বিশেষ সূরা',
      descEn: '110 Ayahs · Friday Recitation',
    },
    {
      number: 36,
      nameBn: 'ইয়াসীন',
      nameEn: 'Ya-Sin',
      descBn: '৮৩ আয়াত · কুরআনের হৃদয়',
      descEn: '83 Ayahs · Heart of the Quran',
    },
    {
      number: 55,
      nameBn: 'আর-রাহমান',
      nameEn: 'Ar-Rahman',
      descBn: '৭৮ আয়াত · আল্লাহর অনুগ্রহের বর্ণনা',
      descEn: '78 Ayahs · The Most Merciful',
    },
    {
      number: 96,
      nameBn: 'আল-আলাক',
      nameEn: "Al-'Alaq",
      descBn: '১৯ আয়াত · সর্বপ্রথম ওহী নাজিলকৃত সূরা',
      descEn: '19 Ayahs · The First Revelation',
    },
  ];

  const spotlightMeta =
    SURAH_INDEX_114.find((s) => s.number === siteConfig.spotlightSurah) || SURAH_INDEX_114[95];

  const activeShowcaseBook =
    HADITH_BOOKS.find((b) => b.id === selectedHadithBookId) || HADITH_BOOKS[0];

  const activeNotice = isEn ? siteConfig.noticeEn.trim() : siteConfig.noticeBn.trim();

  return (
    <div className="min-h-screen ihsan-ambient-canvas text-[#1C1917] dark:text-[#EDF2F9] flex flex-col">
      {/* Ultra-subtle eye-comfort lattice background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none ihsan-lattice-overlay opacity-80"
      />

      {/* Top Navigation Bar (Strict 3-zone single-row contract · 9:10 Navy/Gold Palette) */}
      <header className="sticky top-0 z-40 border-b-2 border-[#E59E1B] dark:border-[#D4AF6A] bg-[#0B1B3B]/96 dark:bg-[#060B16]/96 backdrop-blur-md text-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Single-line Brand Wordmark + Golden Arabic Calligraphy */}
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="inline-flex items-baseline gap-2.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span className="text-xl sm:text-2xl font-editorial font-bold tracking-tight text-white">
              {isEn ? 'Ihsaniyah' : 'ইহসানিয়াহ'}
            </span>
            <span
              dir="rtl"
              lang="ar"
              className="font-arabic text-xl sm:text-2xl font-bold text-[#F5B02E] leading-none"
            >
              إحسانية
            </span>
          </button>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            aria-label={isEn ? 'Primary navigation' : 'প্রধান নেভিগেশন'}
            className="hidden md:flex items-center gap-6 text-sm font-medium"
          >
            {navItems.map((item) => {
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateTo(item.id)}
                  className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer border-b-2 ${
                    active
                      ? 'text-[#F5B02E] border-[#F5B02E]'
                      : 'text-[#CBD5E1] border-transparent hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Language Switcher + Eye-comfort Light/Dark Toggle + Mobile Drawer */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              role="group"
              aria-label={isEn ? 'Language switcher' : 'ভাষা পরিবর্তন করুন'}
              className="inline-flex items-center p-0.5 rounded-lg border border-[#223C70] dark:border-[#1F3254] bg-[#132954] dark:bg-[#0E1729] shrink-0"
            >
              <button
                type="button"
                onClick={() => setLang('bn')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  lang === 'bn'
                    ? 'bg-[#F5B02E] text-[#09152E] font-semibold shadow-xs'
                    : 'text-[#CBD5E1] hover:text-white'
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#F5B02E] text-[#09152E] font-semibold shadow-xs'
                    : 'text-[#CBD5E1] hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsDark((d) => !d)}
              aria-label={
                isEn
                  ? isDark
                    ? 'Switch to Light mode'
                    : 'Switch to Dark mode'
                  : isDark
                    ? 'লাইট মোড চালু করুন'
                    : 'ডার্ক মোড চালু করুন'
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#223C70] dark:border-[#1F3254] bg-[#132954] dark:bg-[#0E1729] text-[#F8FAFC] hover:bg-[#1B376E] dark:hover:bg-[#16233B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#F5B02E]" />
                  <span className="hidden sm:inline">{isEn ? 'Light' : 'লাইট'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#F5B02E]" />
                  <span className="hidden sm:inline">{isEn ? 'Dark' : 'ডার্ক'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={isEn ? 'Open navigation menu' : 'মেনু খুলুন'}
              className="md:hidden p-2 rounded-lg border border-[#223C70] dark:border-[#1F3254] bg-[#132954] dark:bg-[#0E1729] text-[#F8FAFC]"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#1D3566] dark:border-[#1F3254] bg-[#0B1B3B] dark:bg-[#060B16] px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateTo(item.id)}
                  className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? 'bg-[#132954] dark:bg-[#16233B] text-[#F5B02E]'
                      : 'text-[#CBD5E1] hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        {section === 'home' && (
          <>
            {/* Full-Width Hero Band (#1E3567 from reference image) */}
            <div className="bg-[#1E3567] dark:bg-[#0D1A36] border-b border-[#2D4B8C] dark:border-[#1F3254] text-white">
              <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
                {/* Optional Admin Notice Banner */}
                {activeNotice && (
                  <div className="rounded-xl px-5 py-3 bg-[#152852] dark:bg-[#09132B] border border-[#2F4F94] dark:border-[#1F3254] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                    <span className="text-white font-medium">{activeNotice}</span>
                    <button
                      type="button"
                      onClick={() => openSurah(spotlightMeta.number)}
                      className="text-xs font-semibold text-[#F5B02E] hover:underline cursor-pointer shrink-0"
                    >
                      {isEn
                        ? `Spotlight: Surah ${spotlightMeta.nameEn} →`
                        : `স্পটলাইট: সূরা ${spotlightMeta.nameBn} →`}
                    </button>
                  </div>
                )}

                {/* Opening Bismillah Banner Directly Below Top Navbar */}
                <section
                  aria-label={isEn ? 'Opening Bismillah' : 'শুরুতে বিসমিল্লাহির রাহমানির রাহীম'}
                  className="bg-[#162952]/85 dark:bg-[#0A152E]/85 border border-[#2F4D8F] dark:border-[#1F3254] rounded-xl px-6 py-5 sm:py-6 text-center space-y-1.5"
                >
                  <p className="font-arabic text-3xl sm:text-4xl text-[#F5B02E] leading-relaxed">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  <p className="text-base sm:text-lg font-editorial font-semibold text-white">
                    {isEn ? 'Bismillahir Rahmanir Rahim' : 'বিসমিল্লাহির রাহমানির রাহীম'}
                  </p>
                  <p className="text-xs sm:text-sm text-[#D6E2F5]">
                    {isEn
                      ? 'Meaning: In the name of Allah, the Most Compassionate, the Most Merciful.'
                      : 'অর্থ: পরম করুণাময়, অসীম দয়ালু আল্লাহর নামে।'}
                  </p>
                </section>

                {/* Editorial Asymmetric Hero with Compact Open Surah Al-Alaq Mushaf Image */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pb-2">
                  <div className="lg:col-span-7 flex flex-col justify-center py-1">
                    <p className="text-xs tracking-wider text-[#F5B02E] mb-2.5 font-medium">
                      {isEn
                        ? 'Ihsaniyah (إحسانية) · An Islamic Initiative by ynanx.com'
                        : 'ইহসানিয়াহ (إحسانية) · ynanx.com ইসলামিক উদ্যোগ'}
                    </p>

                    <h1 className="text-3xl sm:text-5xl font-editorial font-bold text-white leading-[1.2] text-balance mb-4">
                      {isEn
                        ? 'A Serene Archive of Quran, Sahih Sunnah & Islamic Wisdom'
                        : 'কুরআন, সুন্নাহ ও ইসলামী প্রজ্ঞার প্রশান্ত আর্কাইভ'}
                    </h1>

                    <p className="text-base sm:text-[17px] text-[#DCE6F7] leading-[1.8] mb-7 max-w-2xl">
                      {isEn
                        ? 'Explore all 114 Surahs with Uthmani Arabic, accurate pronunciation, Bangla & English meanings, and world-renowned Qari recitations; strictly verified Sahih Hadith; Salah in Quran & Sunnah, daily obligations, Tasbih counter, and biographies—crafted in eye-comfort Light & Dark modes.'
                        : '১১৪টি সূরার আরবি, বাংলা উচ্চারণ, তর্জমা ও বিশ্ববিখ্যাত ক্বারীদের পূর্ণ তেলাওয়াত; কেবল সম্পূর্ণ সহীহ হাদিস; কুরআন-হাদিসে সালাতের দলিল, জানাজা-ঈদ-সাদাকা-কবর জিয়ারত, ডিজিটাল তসবিহ এবং নবী-রাসূল ও খোলাফায়ে রাশেদীনের জীবনী—চোখের আরামদায়ক লাইট ও ডার্ক মোডে।'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3.5">
                      <button
                        type="button"
                        onClick={() => navigateTo('quran')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[#F5B02E] text-[#09152E] hover:bg-[#F7BD4A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>{isEn ? 'Browse 114 Surahs' : '১১৪ সূরা ও তেলাওয়াত'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateTo('hadith')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg border border-[#325194] dark:border-[#1F3254] bg-[#152852] dark:bg-[#0A152E] text-white hover:bg-[#1B3366] dark:hover:bg-[#142345] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Compass className="w-4 h-4 text-[#F5B02E]" />
                        <span>{isEn ? 'Sahih Hadith Library' : 'সহীহ হাদিস গ্রন্থাগার'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Compact First Hero Image: Open Al-Quran Showing Surah Al-Alaq */}
                  <div className="lg:col-span-5">
                    <div className="rounded-xl overflow-hidden border border-[#325194] dark:border-[#1F3254] bg-[#14254A] shadow-sm">
                      <button
                        type="button"
                        onClick={() => openSurah(96)}
                        className="block w-full h-[220px] sm:h-[250px] relative group cursor-pointer text-left"
                        aria-label={isEn ? 'Open Surah Al-Alaq' : 'সূরা আল-আলাক খুলুন'}
                      >
                        <ResilientImage
                          src={quranAlaqMushafImg}
                          alt={
                            isEn
                              ? 'Open Holy Quran page displaying Surah Al-Alaq (Iqra)'
                              : 'সূরা আল-আলাক পৃষ্ঠায় খোলা পবিত্র আল-কুরআন শরীফ'
                          }
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 via-black/45 to-transparent text-white">
                          <p className="font-arabic text-base text-right mb-0.5">
                            سُورَةُ الْعَلَقِ · اِقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
                          </p>
                          <p className="text-[11px] text-white/90 flex items-center justify-between gap-2">
                            <span>
                              {isEn
                                ? 'Open Mushaf · Surah Al-Alaq (96)'
                                : 'পবিত্র আল-কুরআন · সূরা আল-আলাক (৯৬)'}
                            </span>
                            <span className="font-semibold text-[#FDE68A] shrink-0">
                              {isEn ? 'Read →' : 'পড়ুন →'}
                            </span>
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-12">

            {/* First Revelation Section (Surah Al-Alaq 96:1-5) on Soft Light Green Background */}
            {siteConfig.showFirstRevelation && (
              <section
                aria-labelledby="first-revelation-heading"
                className="rounded-xl p-6 sm:p-8 bg-[#EDF7F0] dark:bg-[#0F2433] border border-[#C6E0CD] dark:border-[#1E445A]"
              >
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 mb-6 border-b border-[#C6E0CD] dark:border-[#1E445A]">
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-[#14532D] dark:text-[#6EE7B7] mb-1.5">
                      {isEn
                        ? 'The First Revelation from Allah to Prophet Muhammad ﷺ · Cave Hira · Surah Al-Alaq (96:1–5)'
                        : 'মহান আল্লাহর পক্ষ থেকে নবী মুহাম্মদ ﷺ-এর ওপর অবতীর্ণ সর্বপ্রথম ওহী · হেরা গুহা · সূরা আল-আলাক (৯৬:১–৫)'}
                    </p>
                    <h2
                      id="first-revelation-heading"
                      className="text-2xl sm:text-3xl font-editorial font-semibold text-[#132A1C] dark:text-[#ECFDF5]"
                    >
                      {isEn
                        ? 'Surah Al-Alaq — The Opening Call to Knowledge'
                        : 'সূরা আল-আলাক — জ্ঞানের প্রথম ঐশী আহ্বান'}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => openSurah(96)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#14532D] dark:bg-[#34D399] text-white dark:text-[#080E1A] hover:opacity-95 transition-opacity whitespace-nowrap shrink-0 cursor-pointer w-fit"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>
                      {isEn
                        ? 'Read & Listen Full Surah Al-Alaq (96)'
                        : 'সম্পূর্ণ সূরা আল-আলাক (৯৬) পড়ুন ও শুনুন'}
                    </span>
                  </button>
                </div>

                <div className="divide-y divide-[#C6E0CD]/80 dark:divide-[#1E445A]/80">
                  {FIRST_REVELATION_AYAHS.map((v) => (
                    <div key={v.ayah} className="py-4 first:pt-0 last:pb-0 space-y-2">
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-3">
                        <span className="text-xs font-semibold tabular-nums text-[#14532D] dark:text-[#6EE7B7] shrink-0">
                          {isEn ? `Ayah 96:${v.ayah}` : `আয়াত ৯৬:${toBengaliDigits(v.ayah)}`}
                        </span>
                        <p className="font-arabic text-2xl sm:text-3xl leading-[2.1] text-right text-[#132A1C] dark:text-[#ECFDF5]">
                          {v.arabic}
                        </p>
                      </div>

                      <p className="text-sm text-[#1F3D2B] dark:text-[#D1FAE5]">
                        <span className="text-xs font-semibold text-[#8B5E2A] dark:text-[#D4AF6A] mr-2">
                          {isEn ? 'Transliteration:' : 'উচ্চারণ:'}
                        </span>
                        <span className={isEn ? 'italic' : ''}>
                          {isEn ? v.translitEn : ayahArabicToBengali(v.arabic)}
                        </span>
                      </p>

                      <p className="font-editorial text-[15px] leading-relaxed text-[#132A1C] dark:text-[#ECFDF5]">
                        <span className="text-xs font-semibold text-[#14532D] dark:text-[#34D399] mr-2">
                          {isEn ? 'Meaning:' : 'অর্থ:'}
                        </span>
                        {isEn ? v.meaningEn : v.meaningBn}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Full-width 4-Column Archive Index Strip */}
            <section className="grid grid-cols-2 lg:grid-cols-4 border-y border-[#E3DCCB] dark:border-[#1F3254] divide-y lg:divide-y-0 lg:divide-x divide-[#E3DCCB] dark:divide-[#1F3254]">
              {(isEn
                ? [
                    { num: '114 Surahs', label: 'Arabic, pronunciation, BN/EN meaning & 6 Qaris' },
                    { num: '7 Books + 2', label: 'Canonical books, Nawawi 40 & Qudsi · Strictly Sahih' },
                    { num: '67 / 99x', label: 'Salah in Quran, Hadith refs & Digital Tasbih' },
                    { num: '2 Themes', label: 'Eye-comfort Mushaf Light & Nocturnal Dark' },
                  ]
                : [
                    { num: '১১৪ সূরা', label: 'আরবি, উচ্চারণ, তর্জমা ও ৬ ক্বারীর পূর্ণ তেলাওয়াত' },
                    { num: '৭টি গ্রন্থ + ২', label: 'বুখারী, মুসলিম, সুনান, মুয়াত্তা, নববী ও কুদসী · কেবল সহীহ' },
                    { num: '৬৭ ও ৯৯ বার', label: 'কুরআনে সালাতের উল্লেখ, হাদিস সূত্র ও ডিজিটাল তসবিহ' },
                    { num: '২টি থিম', label: 'চোখের সুরক্ষায় মুসহাফ লাইট ও নকটার্নাল ডার্ক' },
                  ]
              ).map((stat, i) => (
                <div key={i} className="py-5 px-4 sm:px-6">
                  <div className="text-2xl font-editorial font-bold tabular-nums text-[#14532D] dark:text-[#34D399] mb-1">
                    {stat.num}
                  </div>
                  <div className="text-xs text-[#57534E] dark:text-[#9BAAC4] leading-relaxed">
                    {stat.label}
                  </div>
                </div>
              ))}
            </section>

            {/* 2nd Visual Showcase (Interactive 7 Hadith Books Cover Viewer) + Featured Surahs */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Interactive 2nd Image Slot: Dynamic Per-Book Hadith Cover */}
              <div className="lg:col-span-5 bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-5 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A] font-medium">
                    {isEn
                      ? 'Sahih Hadith Archive · Select a Book to Preview Cover'
                      : 'সহীহ হাদিস সংকলন · গ্রন্থে ক্লিক করে প্রচ্ছদ দেখুন'}
                  </div>

                  {/* 7 Hadith Books Switcher */}
                  <div className="flex flex-wrap gap-1.5">
                    {HADITH_BOOKS.map((book) => {
                      const active = book.id === activeShowcaseBook.id;
                      return (
                        <button
                          key={book.id}
                          type="button"
                          onClick={() => setSelectedHadithBookId(book.id)}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                            active
                              ? 'bg-[#14532D] dark:bg-[#34D399] border-[#14532D] dark:border-[#34D399] text-white dark:text-[#080E1A]'
                              : 'bg-[#F7F4EC] dark:bg-[#080E1A] border-[#E3DCCB] dark:border-[#1F3254] text-[#57534E] dark:text-[#9BAAC4] hover:text-[#1C1917] dark:hover:text-[#EDF2F9]'
                          }`}
                        >
                          {isEn ? book.nameEn : book.nameBn}
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Book Cover Image + Info */}
                  <div className="grid grid-cols-12 gap-4 items-center pt-1">
                    <div className="col-span-5 h-[190px] sm:h-[210px] rounded-lg overflow-hidden border border-[#E3DCCB] dark:border-[#1F3254] bg-[#F7F4EC] dark:bg-[#080E1A]">
                      <ResilientImage
                        src={activeShowcaseBook.coverImage}
                        alt={isEn ? activeShowcaseBook.nameEn : activeShowcaseBook.nameBn}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="col-span-7 space-y-2">
                      <div className="text-[11px] font-semibold text-[#14532D] dark:text-[#34D399]">
                        {isEn
                          ? activeShowcaseBook.totalEstimateEn
                          : activeShowcaseBook.totalEstimate}
                      </div>
                      <h3 className="text-lg font-editorial font-bold text-[#1C1917] dark:text-[#EDF2F9] leading-snug">
                        {isEn ? activeShowcaseBook.nameEn : activeShowcaseBook.nameBn}
                      </h3>
                      <p className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A]">
                        {isEn ? activeShowcaseBook.compilerEn : activeShowcaseBook.compilerBn}
                      </p>
                      <p className="text-xs text-[#57534E] dark:text-[#9BAAC4] leading-relaxed">
                        {isEn ? activeShowcaseBook.descriptionEn : activeShowcaseBook.descriptionBn}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E3DCCB] dark:border-[#1F3254] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => openHadithBook(activeShowcaseBook.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#14532D] dark:text-[#34D399] hover:underline cursor-pointer"
                  >
                    <span>
                      {isEn
                        ? `Open ${activeShowcaseBook.nameEn} Chapters`
                        : `${activeShowcaseBook.nameBn}-এর অধ্যায় দেখুন`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Recitation · Featured Surahs */}
              <div className="lg:col-span-7 flex flex-col justify-between bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-6 sm:p-7">
                <div>
                  <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A] mb-2">
                    {isEn ? 'Quick Recitation · Select Surah' : 'দ্রুত তেলাওয়াত · সূরা বাছাই'}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9] mb-2">
                    {isEn
                      ? 'Start Reading Directly from Featured Surahs'
                      : 'পছন্দের সূরা থেকে সরাসরি তেলাওয়াত শুরু করুন'}
                  </h2>
                  <p className="text-sm text-[#57534E] dark:text-[#9BAAC4] mb-5">
                    {isEn
                      ? 'Select any Surah to open Uthmani Arabic, transliteration, translation, and continuous full-Surah Qari audio.'
                      : 'যেকোনো সূরায় ক্লিক করলে আরবি উসমানী পাঠ, বাংলা উচ্চারণ, তর্জমা ও পূর্ণ সূরার অডিও তেলাওয়াত খুলে যাবে।'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                    {featuredSurahs.map((s) => (
                      <button
                        key={s.number}
                        type="button"
                        onClick={() => openSurah(s.number)}
                        className="text-left p-3.5 rounded-lg border border-[#E3DCCB] dark:border-[#1F3254] bg-[#F7F4EC] dark:bg-[#080E1A] hover:border-[#14532D] dark:hover:border-[#34D399] transition-colors flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <div>
                          <div className="text-sm font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                            {isEn
                              ? `${s.number}. Surah ${s.nameEn}`
                              : `${toBengaliDigits(s.number)}. সূরা ${s.nameBn}`}
                          </div>
                          <div className="text-xs text-[#57534E] dark:text-[#9BAAC4]">
                            {isEn ? s.descEn : s.descBn}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#8B5E2A] dark:text-[#D4AF6A] shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E3DCCB] dark:border-[#1F3254] flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-[#57534E] dark:text-[#9BAAC4]">
                    {isEn
                      ? `Last read Surah #${lastReadSurah} · Spotlight: ${spotlightMeta.nameEn}`
                      : `সর্বশেষ পঠিত সূরা নং ${toBengaliDigits(lastReadSurah)} · স্পটলাইট: ${spotlightMeta.nameBn}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigateTo('quran')}
                    className="text-xs font-semibold text-[#14532D] dark:text-[#34D399] hover:underline cursor-pointer"
                  >
                    {isEn ? 'Browse All 114 Surahs →' : 'সকল ১১৪টি সূরার কার্ড দেখুন →'}
                  </button>
                </div>
              </div>
            </section>

            {/* Curated Knowledge Pillars Grid */}
            <section>
              <div className="mb-8 pb-4 border-b border-[#E3DCCB] dark:border-[#1F3254]">
                <p className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A] mb-1">
                  {isEn ? 'Complete Knowledge Compendium · All Sections' : 'সমৃদ্ধ জ্ঞানভাণ্ডার · সকল বিভাগ'}
                </p>
                <h2 className="text-2xl sm:text-3xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                  {isEn
                    ? 'Every Domain of Islamic Knowledge in One Place'
                    : 'ইসলামের প্রতিটি অধ্যায় এক প্ল্যাটফর্মে'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(isEn
                  ? [
                      {
                        kicker: 'Sunnah & Sahih Hadith',
                        title: 'Sahih Hadith, Nawawi 40 & Qudsi',
                        desc: '7 major Hadith books filtered strictly to verified Sahih narrations, plus Imam Nawawi’s 40 Hadith and Sahih Hadith Qudsi.',
                        actionLabel: 'Read Sahih Hadith',
                        onClick: () => navigateTo('hadith'),
                      },
                      {
                        kicker: 'Salah in Quran & Sunnah',
                        title: 'Salah Verses (67/99x) & Hadith Refs',
                        desc: 'How many times and in which Ayahs Allah mentioned Salah in the Quran, alongside concise Sahih Hadith reference numbers.',
                        actionLabel: 'Explore Salah Evidences',
                        onClick: () => navigateToWorship('salah-proofs'),
                      },
                      {
                        kicker: 'Tasbih & Dhikr',
                        title: 'Tasbih Guide & Digital Counter',
                        desc: 'Authentic Tasbih Fatimi, Istighfar, Tahlil, and Salawat with an interactive touch counter and saved total.',
                        actionLabel: 'Open Tasbih Counter',
                        onClick: () => navigateToWorship('tasbih'),
                      },
                      {
                        kicker: 'Pathways to Reward',
                        title: 'Janazah, Eid, Jumu’ah, Sadaqah & Graves',
                        desc: 'Farz-e-Kifayah, two Wajib Eid prayers, Khutbah etiquette, charity, promises/Amanah, Fasting/Zakat/Hajj details, and Ziyarat al-Quboor.',
                        actionLabel: 'Read Full Guide',
                        onClick: () => navigateToWorship('deeds'),
                      },
                      {
                        kicker: 'Prophethood & Golden Age',
                        title: 'Prophets, Caliphs & Muslim Scientists',
                        desc: 'Authentic biographies from Adam (AS) to Muhammad ﷺ, Khulafa-e-Rashideen, Tabi’in, and pioneers of science.',
                        actionLabel: 'Read Biographies',
                        onClick: () => navigateTo('history', 'prophets'),
                      },
                      {
                        kicker: 'Dawah, Pillars & Zakat',
                        title: 'Five Pillars, Zakat Calculator & Masail',
                        desc: 'Quran & Hadith foundations of the 5 Pillars, instant 2.5% Zakat calculator, and purpose of human creation.',
                        actionLabel: 'Pillars & Zakat',
                        onClick: () => navigateToWorship('pillars'),
                      },
                    ]
                  : [
                      {
                        kicker: 'সুন্নাহ ও সহীহ হাদিস',
                        title: 'সহীহ হাদিস, নববী ৪০ ও কুদসী',
                        desc: 'দুর্বল ও অ-সহীহ বাদ দিয়ে ৭টি প্রধান গ্রন্থের কেবল সহীহ হাদিস, ইমাম নববীর চল্লিশ হাদিস ও সহীহ হাদিসে কুদসী।',
                        actionLabel: 'সহীহ হাদিস পড়ুন',
                        onClick: () => navigateTo('hadith'),
                      },
                      {
                        kicker: 'সালাতের দলিল ও সূত্র',
                        title: 'কুরআনে সালাতের সংখ্যা ও হাদিস রেফারেন্স',
                        desc: 'আল-কুরআনে নামাজ কতবার (৬৭ ও ৯৯ বার) ও কোন আয়াতে উল্লেখ আছে এবং সালাত সংক্রান্ত বিশুদ্ধ হাদিস রেফারেন্স।',
                        actionLabel: 'সালাতের দলিল দেখুন',
                        onClick: () => navigateToWorship('salah-proofs'),
                      },
                      {
                        kicker: 'যিকির ও তসবিহ',
                        title: 'তসবিহ পাঠ ও ডিজিটাল গণনা',
                        desc: 'তসবিহে ফাতেমী, ইস্তিগফার, তাহলীল ও দরূদ শরীফের ফজিলত এবং স্থায়ী মোট হিসাবসহ সহজ ডিজিটাল তসবিহ কাউন্টার।',
                        actionLabel: 'তসবিহ গণনা খুলুন',
                        onClick: () => navigateToWorship('tasbih'),
                      },
                      {
                        kicker: 'পুণ্য ও সওয়াবের পাথেয়',
                        title: 'জানাজা, দুই ঈদ, জুমা, দান ও কবর জিয়ারত',
                        desc: 'ফরজে কেফায়া, দুই ঈদের ওয়াজিব সালাত, খুৎবা শ্রবণ, সাদাকা, ওয়াদা-আমানত, রোজা-যাকাত-হজ্জ ও কবর জিয়ারতের নিয়ম-দুআ।',
                        actionLabel: 'বিস্তারিত পড়ুন',
                        onClick: () => navigateToWorship('deeds'),
                      },
                      {
                        kicker: 'নবুওয়াত ও বিজ্ঞান',
                        title: 'নবী-রাসূল, খলিফা ও মুসলিম বিজ্ঞানীরা',
                        desc: 'হযরত আদম (আ.) থেকে মুহাম্মদ ﷺ, খোলাফায়ে রাশেদীন, তাবেঈন-বুজুর্গানে দ্বীন এবং বিজ্ঞানে মুসলিমদের অবদান।',
                        actionLabel: 'ইতিহাস ও জীবনী',
                        onClick: () => navigateTo('history', 'prophets'),
                      },
                      {
                        kicker: 'স্তম্ভ ও হিসাব',
                        title: 'পঞ্চস্তম্ভ, দৈনিক আমল ও যাকাত ক্যালকুলেটর',
                        desc: 'দৈনিক ফরজ-ওয়াজিব-সুন্নত-নফল চেকলিস্ট, ঈমান-নামাজ-রোজা-হজ্জ-যাকাত এবং তাৎক্ষণিক ২.৫% যাকাত হিসাব।',
                        actionLabel: 'হিসাব ও স্তম্ভ দেখুন',
                        onClick: () => navigateToWorship('pillars'),
                      },
                    ]
                ).map((card, idx) => (
                  <article
                    key={idx}
                    className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A] mb-2">
                        {card.kicker}
                      </div>
                      <h3 className="text-xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9] mb-2">
                        {card.title}
                      </h3>
                      <p className="text-sm text-[#57534E] dark:text-[#9BAAC4] leading-relaxed mb-6">
                        {card.desc}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={card.onClick}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#14532D] dark:text-[#34D399] hover:underline cursor-pointer w-fit"
                    >
                      <span>{card.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </article>
                ))}
              </div>
            </section>

            {/* Admin-Published Custom Knowledge & Updates (if any added via Content Editor) */}
            {customEntries.length > 0 && (
              <section className="space-y-5">
                <div className="pb-4 border-b border-[#E3DCCB] dark:border-[#1F3254] flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A] mb-1">
                      {isEn ? 'Latest Additions · Editorial Updates' : 'নতুন সংযোজন · এডমিন প্রকাশিত'}
                    </p>
                    <h2 className="text-2xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                      {isEn ? 'Added Masail, Articles & Islamic Notes' : 'নতুন যুক্ত মাসআলা, প্রবন্ধ ও আমল'}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateTo('admin')}
                    className="text-xs font-semibold text-[#14532D] dark:text-[#34D399] hover:underline cursor-pointer"
                  >
                    {isEn ? 'Add / Edit Content →' : 'নতুন যোগ বা এডিট করুন →'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {customEntries.map((entry) => (
                    <article
                      key={entry.id}
                      className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-6 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs text-[#8B5E2A] dark:text-[#D4AF6A]">
                        <span>
                          {entry.category === 'masala'
                            ? isEn
                              ? 'Masail & Q&A'
                              : 'মাসআলা ও প্রশ্নোত্তর'
                            : entry.category === 'article'
                              ? isEn
                                ? 'Article & Reminder'
                                : 'ইসলামিক প্রবন্ধ'
                              : entry.category === 'amal'
                                ? isEn
                                  ? 'Daily Amal & Dua'
                                  : 'দৈনিক আমল ও দুআ'
                                : isEn
                                  ? 'Quran & Hadith Note'
                                  : 'কুরআন ও হাদিস নোট'}
                        </span>
                        <span className="tabular-nums text-[#57534E] dark:text-[#9BAAC4]">
                          {entry.updatedAt}
                        </span>
                      </div>

                      <h3 className="text-lg font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                        {isEn ? entry.titleEn : entry.titleBn}
                      </h3>

                      {entry.arabicText && (
                        <p className="font-arabic text-xl leading-[2] text-right text-[#14532D] dark:text-[#6EE7B7]">
                          {entry.arabicText}
                        </p>
                      )}

                      <p className="text-sm text-[#57534E] dark:text-[#9BAAC4] leading-relaxed whitespace-pre-line">
                        {isEn ? entry.contentEn : entry.contentBn}
                      </p>

                      {(isEn ? entry.referenceEn : entry.referenceBn) && (
                        <div className="pt-2 border-t border-[#E3DCCB]/60 dark:border-[#1F3254]/60 text-xs text-[#8B5E2A] dark:text-[#D4AF6A]">
                          {isEn ? `Source: ${entry.referenceEn}` : `সূত্র: ${entry.referenceBn}`}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Ynanx.com Ecosystem Bridge */}
            {siteConfig.showEcosystem && (
              <section className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-6 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#E3DCCB] dark:border-[#1F3254]">
                  <div>
                    <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A] mb-1">
                      {isEn ? 'Connected Digital Ecosystem' : 'সম্মিলিত ডিজিটাল ইকোসিস্টেম'}
                    </div>
                    <h2 className="text-2xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                      {isEn
                        ? 'Platforms Connected Under ynanx.com & Ynanx Labs'
                        : 'ynanx.com ও Ynanx Labs-এর সংযুক্ত প্ল্যাটফর্মসমূহ'}
                    </h2>
                  </div>
                  <span className="text-xs text-[#57534E] dark:text-[#9BAAC4]">
                    {isEn ? 'Knowledge, Journalism & Technology — Unified' : 'জ্ঞান, সংবাদ ও প্রযুক্তি — এক ছায়ায়'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A]">
                      {isEn ? 'Core Laboratory' : 'মূল গবেষণাগার'}
                    </div>
                    <h3 className="text-base font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                      Ynanx Labs (ynanx.com)
                    </h3>
                    <p className="text-xs text-[#57534E] dark:text-[#9BAAC4] leading-relaxed">
                      {isEn
                        ? 'Central directory and showcase of websites and applications built under ynanx.com, featuring Ihsaniyah as a flagship Islamic portal.'
                        : 'সমস্ত নির্মিত ওয়েবসাইট ও অ্যাপ্লিকেশনের মূল ডিরেক্টরি ও ল্যাবরেটরি পোর্টাল, যার অধীনে “ইহসানিয়াহ” অন্যতম প্রধান প্রজেক্ট।'}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A]">
                      {isEn ? 'Video & Dawah' : 'ভিডিও ও দাওয়াহ'}
                    </div>
                    <h3 className="text-base font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                      {isEn ? 'Ynanx Islamic YouTube Channel' : 'Ynanx ইসলামিক ইউটিউব চ্যানেল'}
                    </h3>
                    <p className="text-xs text-[#57534E] dark:text-[#9BAAC4] leading-relaxed">
                      {isEn
                        ? 'Quranic reflections, Seerah series, and educational Islamic documentaries produced under the ynanx.com banner.'
                        : 'কুরআনের তাফসীর, সীরাত সিরিজ এবং সমসাময়িক ইসলামিক লেকচার ও ডকুমেন্টারি ভিডিও প্রকাশনা।'}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A]">
                      {isEn ? 'Independent Media' : 'স্বাধীন সংবাদ মাধ্যম'}
                    </div>
                    <h3 className="text-base font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                      {isEn ? 'Black Box News Portal' : 'ব্ল্যাক বক্স (Black Box News)'}
                    </h3>
                    <p className="text-xs text-[#57534E] dark:text-[#9BAAC4] leading-relaxed">
                      {isEn
                        ? 'Independent investigative and analytical news portal operating alongside Ihsaniyah within the ynanx.com network.'
                        : 'ynanx.com ইকোসিস্টেমের অন্তর্ভুক্ত নির্ভীক ও বিশ্লেষণধর্মী নিউজ পোর্টাল।'}
                    </p>
                  </div>
                </div>
              </section>
            )}
            </div>
          </>
        )}

        {section === 'quran' && (
          <QuranPortal
            lang={lang}
            initialSurah={quranInitialSurah}
            onActiveAudioChange={setActiveAudio}
          />
        )}

        {section === 'hadith' && (
          <HadithPortal lang={lang} initialBookId={selectedHadithBookId} />
        )}

        {section === 'worship' && (
          <WorshipAndPillars lang={lang} initialTab={worshipSubTab} />
        )}

        {section === 'history' && (
          <HistoryAndPhilosophy lang={lang} initialSubTab={historySubTab} />
        )}

        {section === 'admin' && (
          <AdminPanel
            lang={lang}
            siteConfig={siteConfig}
            onUpdateSiteConfig={handleUpdateSiteConfig}
            customEntries={customEntries}
            onUpdateCustomEntries={handleUpdateCustomEntries}
          />
        )}
      </main>

      {/* Compact Sticky Audio Mini-Player (Only when reciting) */}
      {activeAudio && (
        <div className="sticky bottom-0 z-40 border-t border-[#E3DCCB] dark:border-[#1F3254] bg-[#FCFBF7]/95 dark:bg-[#0E1729]/95 backdrop-blur-md">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-semibold text-[#1C1917] dark:text-[#EDF2F9] truncate">
                {activeAudio.ayahNumber === null
                  ? isEn
                    ? `Surah ${activeAudio.surahNameEn} · Full Surah Recitation`
                    : `সূরা ${activeAudio.surahNameBn} · সম্পূর্ণ সূরা তেলাওয়াত`
                  : isEn
                    ? `Surah ${activeAudio.surahNameEn} · Ayah ${activeAudio.ayahNumber}`
                    : `সূরা ${activeAudio.surahNameBn} · আয়াত ${toLocalizedDigits(activeAudio.ayahNumber, lang)}`}
              </div>
              <div className="text-[11px] text-[#57534E] dark:text-[#9BAAC4] truncate">
                {isEn ? activeAudio.qariNameEn : activeAudio.qariNameBn}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={activeAudio.onPrev}
                aria-label={isEn ? 'Previous' : 'পূর্ববর্তী'}
                className="p-2 rounded-lg text-[#57534E] dark:text-[#9BAAC4] hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] cursor-pointer"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={activeAudio.onToggle}
                aria-label={isEn ? (activeAudio.isPlaying ? 'Pause' : 'Play') : activeAudio.isPlaying ? 'বিরতি' : 'চালু করুন'}
                className="p-2.5 rounded-lg bg-[#14532D] dark:bg-[#34D399] text-white dark:text-[#080E1A] cursor-pointer"
              >
                {activeAudio.isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                onClick={activeAudio.onNext}
                aria-label={isEn ? 'Next' : 'পরবর্তী'}
                className="p-2 rounded-lg text-[#57534E] dark:text-[#9BAAC4] hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] cursor-pointer"
              >
                <SkipForward className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={activeAudio.onStop}
                aria-label={isEn ? 'Close player' : 'প্লেয়ার বন্ধ করুন'}
                className="p-2 rounded-lg text-[#57534E] dark:text-[#9BAAC4] hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clean Institutional Footer with Founder & Admin Ownership (Matches Top Navbar) */}
      <footer className="relative z-10 border-t-2 border-[#E59E1B] dark:border-[#D4AF6A] bg-[#0B1B3B]/96 dark:bg-[#060B16]/96 text-[#CBD5E1] mt-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-5 text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-editorial font-semibold text-sm text-white">
                {isEn ? 'Ihsaniyah (ইহসানিয়াহ)' : 'ইহসানিয়াহ (Ihsaniyah)'}
              </span>
              <span dir="rtl" lang="ar" className="font-arabic text-base text-[#F5B02E]">
                إحسانية
              </span>
              <span className="text-[#CBD5E1]">
                {isEn
                  ? '· An Islamic Knowledge Initiative by ynanx.com & Ynanx Labs'
                  : '· ynanx.com ও Ynanx Labs-এর একটি ইসলামিক জ্ঞানচর্চা প্ল্যাটফর্ম'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateTo(item.id)}
                  className={`transition-colors cursor-pointer whitespace-nowrap ${
                    section === item.id
                      ? 'text-[#F5B02E] font-semibold'
                      : 'text-[#CBD5E1] hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => navigateTo('admin')}
                className="inline-flex items-center gap-1 font-medium text-[#F5B02E] hover:underline transition-colors cursor-pointer whitespace-nowrap"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isEn ? 'Admin Panel' : 'এডমিন প্যানেল'}</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1D3566] dark:border-[#1F3254] flex flex-col md:flex-row md:items-center justify-between gap-2 text-[11px] text-[#CBD5E1]">
            <span>
              {isEn
                ? 'Founder & Chief Admin: Mohammad Armanul Hoque · Napora, Banshkhali, Chattogram, Bangladesh'
                : 'প্রতিষ্ঠাতা ও প্রধান এডমিন: মোহাম্মদ আরমানুল হক · নাপোড়া, বাঁশখালী, চট্টগ্রাম, বাংলাদেশ'}
            </span>
            <span className="tabular-nums">
              <a href="tel:+8801850180708" className="hover:text-white hover:underline">
                +8801850180708
              </a>
              {' · '}
              <a href="mailto:rmanulhoq@gmail.com" className="hover:text-white hover:underline">
                rmanulhoq@gmail.com
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
