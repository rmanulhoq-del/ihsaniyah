import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  RotateCcw,
  Search,
} from 'lucide-react';
import { SAHIH_HADITH_QUDSI } from '../data/hadithQudsiSahih';
import { toLocalizedDigits } from '../data/islamicKnowledgeEn';
import { toBengaliDigits } from '../data/surahNamesBn';
import {
  HADITH_BOOKS,
  HadithItem,
  HadithSectionInfo,
  fetchAllBooksSections,
  fetchHadithsBySection,
  fetchSahihNawawiHadiths,
} from '../services/hadithApi';
import { AppLang } from '../types/language';
import { ResilientImage } from './ResilientImage';

const ITEMS_PER_PAGE = 10;

type HadithCategoryMode = 'books' | 'nawawi' | 'qudsi';

export function HadithPortal({
  lang = 'bn',
  initialBookId,
}: {
  lang?: AppLang;
  initialBookId?: string | null;
}) {
  const isEn = lang === 'en';
  const [categoryMode, setCategoryMode] = useState<HadithCategoryMode>('books');

  // 7 Books Sections State
  const [sectionsByBook, setSectionsByBook] = useState<Record<string, HadithSectionInfo[]>>({});
  const [loadingSections, setLoadingSections] = useState<boolean>(true);
  const [sectionsError, setSectionsError] = useState<string | null>(null);

  // Expanded book card dropdown (in Book+Dropdown picker mode)
  const [expandedBookId, setExpandedBookId] = useState<string | null>(initialBookId || 'bukhari');
  const [dropdownFilter, setDropdownFilter] = useState<string>('');

  useEffect(() => {
    if (initialBookId) {
      setCategoryMode('books');
      setActiveSelection(null);
      setExpandedBookId(initialBookId);
    }
  }, [initialBookId]);

  // Active chapter reader selection (null = browsing the 7 Book Cards with dropdowns)
  const [activeSelection, setActiveSelection] = useState<{
    bookId: string;
    sectionNumber: number;
  } | null>(null);

  // Loaded Hadiths for the active chapter
  const [sectionTitle, setSectionTitle] = useState<string>('');
  const [hadiths, setHadiths] = useState<HadithItem[]>([]);
  const [sectionCounts, setSectionCounts] = useState<{ total: number; excluded: number }>({
    total: 0,
    excluded: 0,
  });
  const [loadingHadiths, setLoadingHadiths] = useState<boolean>(false);
  const [hadithError, setHadithError] = useState<string | null>(null);

  // Nawawi's 40 State
  const [nawawiHadiths, setNawawiHadiths] = useState<HadithItem[]>([]);
  const [nawawiLoadedLang, setNawawiLoadedLang] = useState<AppLang | null>(null);
  const [nawawiExcluded, setNawawiExcluded] = useState<number>(0);
  const [loadingNawawi, setLoadingNawawi] = useState<boolean>(false);
  const [nawawiError, setNawawiError] = useState<string | null>(null);

  // Shared inclusive reading controls
  const [hadithSearch, setHadithSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showArabic, setShowArabic] = useState<boolean>(true);
  const [largeFont, setLargeFont] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const readerTopRef = useRef<HTMLDivElement | null>(null);

  const loadAllSections = async () => {
    setLoadingSections(true);
    setSectionsError(null);
    try {
      const data = await fetchAllBooksSections();
      setSectionsByBook(data);
    } catch (err: any) {
      setSectionsError(
        err?.message || (isEn ? 'Failed to load Hadith chapter index.' : 'অধ্যায় তালিকা লোড করা যায়নি।')
      );
    } finally {
      setLoadingSections(false);
    }
  };

  useEffect(() => {
    loadAllSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNawawi = async (targetLang: AppLang) => {
    setLoadingNawawi(true);
    setNawawiError(null);
    try {
      const res = await fetchSahihNawawiHadiths(targetLang);
      setNawawiHadiths(res.hadiths);
      setNawawiExcluded(res.excludedCount);
      setNawawiLoadedLang(targetLang);
    } catch (err: any) {
      setNawawiError(
        err?.message ||
          (targetLang === 'en'
            ? "Failed to load Imam Nawawi's Forty Hadith."
            : 'ইমাম নববীর চল্লিশ হাদিস লোড করা যায়নি।')
      );
    } finally {
      setLoadingNawawi(false);
    }
  };

  useEffect(() => {
    if (categoryMode === 'nawawi' && (nawawiLoadedLang !== lang || nawawiHadiths.length === 0) && !loadingNawawi) {
      loadNawawi(lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryMode, lang]);

  const loadSectionHadiths = async (bookId: string, secNum: number, targetLang: AppLang) => {
    setLoadingHadiths(true);
    setHadithError(null);
    setCurrentPage(1);
    setHadithSearch('');
    try {
      const res = await fetchHadithsBySection(bookId, secNum, targetLang);
      setSectionTitle(res.sectionTitleBn);
      setHadiths(res.hadiths);
      setSectionCounts({ total: res.totalInSection, excluded: res.excludedNonSahihCount });
    } catch (err: any) {
      setHadithError(
        err?.message ||
          (targetLang === 'en' ? 'Failed to load Hadiths.' : 'হাদিস লোড করতে সমস্যা হয়েছে।')
      );
    } finally {
      setLoadingHadiths(false);
    }
  };

  useEffect(() => {
    if (activeSelection) {
      loadSectionHadiths(activeSelection.bookId, activeSelection.sectionNumber, lang);
    }
  }, [activeSelection, lang]);

  const switchCategory = (mode: HadithCategoryMode) => {
    setCategoryMode(mode);
    setHadithSearch('');
    setCurrentPage(1);
    if (mode !== 'books') {
      setActiveSelection(null);
    }
  };

  const openChapter = (bookId: string, sectionNumber: number) => {
    setActiveSelection({ bookId, sectionNumber });
    setTimeout(() => {
      readerTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const activeBook = useMemo(() => {
    if (!activeSelection) return null;
    return HADITH_BOOKS.find((b) => b.id === activeSelection.bookId) || HADITH_BOOKS[0];
  }, [activeSelection]);

  const activeBookChapters = useMemo(() => {
    if (!activeSelection) return [];
    return sectionsByBook[activeSelection.bookId] || [];
  }, [activeSelection, sectionsByBook]);

  // Pagination & filtering for 7-books chapter view
  const filteredHadiths = useMemo(() => {
    const q = hadithSearch.trim().toLowerCase();
    if (!q) return hadiths;
    return hadiths.filter(
      (h) =>
        h.textBn.toLowerCase().includes(q) ||
        String(h.hadithnumber).includes(q) ||
        toBengaliDigits(h.hadithnumber).includes(q)
    );
  }, [hadiths, hadithSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredHadiths.length / ITEMS_PER_PAGE));

  const paginatedHadiths = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredHadiths.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredHadiths, currentPage, totalPages]);

  // Pagination & filtering for Nawawi's 40
  const filteredNawawi = useMemo(() => {
    const q = hadithSearch.trim().toLowerCase();
    if (!q) return nawawiHadiths;
    return nawawiHadiths.filter(
      (h) =>
        h.textBn.toLowerCase().includes(q) ||
        String(h.hadithnumber).includes(q) ||
        toBengaliDigits(h.hadithnumber).includes(q)
    );
  }, [nawawiHadiths, hadithSearch]);

  const nawawiTotalPages = Math.max(1, Math.ceil(filteredNawawi.length / ITEMS_PER_PAGE));

  const paginatedNawawi = useMemo(() => {
    const safePage = Math.min(currentPage, nawawiTotalPages);
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredNawawi.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredNawawi, currentPage, nawawiTotalPages]);

  // Filtering for Hadith Qudsi
  const filteredQudsi = useMemo(() => {
    const q = hadithSearch.trim().toLowerCase();
    if (!q) return SAHIH_HADITH_QUDSI;
    return SAHIH_HADITH_QUDSI.filter(
      (item) =>
        item.titleBn.toLowerCase().includes(q) ||
        item.titleEn.toLowerCase().includes(q) ||
        item.bengali.toLowerCase().includes(q) ||
        item.english.toLowerCase().includes(q) ||
        item.referenceBn.toLowerCase().includes(q) ||
        item.referenceEn.toLowerCase().includes(q)
    );
  }, [hadithSearch]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    readerTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const copyTextWithFeedback = (key: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <section ref={readerTopRef} className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
      {/* Masthead */}
      <div className="mb-6 pb-6 border-b border-[#E3DCCB] dark:border-[#1F3254] flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-wider text-[#8B5E2A] dark:text-[#D4AF6A] mb-2">
            {isEn
              ? 'Strictly Verified Sahih Only · Weak & Non-Sahih Excluded · Chapter-Based Reader'
              : 'কেবল সম্পূর্ণ সহীহ হাদিস · জঈফ ও অ-সহীহ বর্জিত · সহজ বিভাগভিত্তিক পাঠ'}
          </p>
          <h2 className="text-3xl sm:text-4xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9] text-balance">
            {isEn ? 'Sahih Al-Hadith & Sunnah Archive' : 'সহীহ আল-হাদিস ও সুন্নাহ আর্কাইভ'}
          </h2>
        </div>
        <p className="text-sm text-[#57534E] dark:text-[#9BAAC4] max-w-md leading-relaxed">
          {isEn
            ? "Click any of the 7 canonical Hadith books to view its cover and chapters, or browse Imam Nawawi's 40 & Hadith Qudsi."
            : '৭টি প্রধান হাদিস গ্রন্থের যেকোনোটিতে ক্লিক করলেই গ্রন্থের প্রচ্ছদ ও বিভাগসমূহ দেখতে পাবেন; এছাড়া নববীর চল্লিশ হাদিস ও হাদিসে কুদসী আলাদাভাবে রয়েছে।'}
        </p>
      </div>

      {/* Top Separate Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EFEAE0] dark:bg-[#16233B] rounded-lg">
          <button
            type="button"
            onClick={() => switchCategory('books')}
            className={`px-4 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              categoryMode === 'books'
                ? 'bg-[#FCFBF7] dark:bg-[#0E1729] text-[#14532D] dark:text-[#34D399] shadow-xs'
                : 'text-[#57534E] dark:text-[#9BAAC4] hover:text-[#1C1917] dark:hover:text-[#EDF2F9]'
            }`}
          >
            {isEn ? '7 Major Hadith Books' : 'প্রধান ৭টি হাদিস গ্রন্থ'}
          </button>
          <button
            type="button"
            onClick={() => switchCategory('nawawi')}
            className={`px-4 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              categoryMode === 'nawawi'
                ? 'bg-[#FCFBF7] dark:bg-[#0E1729] text-[#14532D] dark:text-[#34D399] shadow-xs'
                : 'text-[#57534E] dark:text-[#9BAAC4] hover:text-[#1C1917] dark:hover:text-[#EDF2F9]'
            }`}
          >
            {isEn ? "Imam Nawawi's 40 (Sahih)" : 'ইমাম নববীর চল্লিশ হাদিস (সহীহ)'}
          </button>
          <button
            type="button"
            onClick={() => switchCategory('qudsi')}
            className={`px-4 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              categoryMode === 'qudsi'
                ? 'bg-[#FCFBF7] dark:bg-[#0E1729] text-[#14532D] dark:text-[#34D399] shadow-xs'
                : 'text-[#57534E] dark:text-[#9BAAC4] hover:text-[#1C1917] dark:hover:text-[#EDF2F9]'
            }`}
          >
            {isEn ? 'Sahih Hadith Qudsi' : 'সহীহ হাদিসে কুদসী'}
          </button>
        </div>

        {/* Shared Reading Comfort Toggles when viewing Hadiths */}
        {(categoryMode !== 'books' || activeSelection) && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowArabic((v) => !v)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                showArabic
                  ? 'bg-[#EFEAE0] dark:bg-[#16233B] border-[#8B5E2A]/40 dark:border-[#D4AF6A]/40 text-[#1C1917] dark:text-[#EDF2F9]'
                  : 'border-[#E3DCCB] dark:border-[#1F3254] text-[#57534E] dark:text-[#9BAAC4]'
              }`}
            >
              {isEn
                ? showArabic
                  ? 'Arabic + English'
                  : 'English Only'
                : showArabic
                  ? 'আরবি + বাংলা'
                  : 'শুধু বাংলা'}
            </button>
            <button
              type="button"
              onClick={() => setLargeFont((v) => !v)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                largeFont
                  ? 'bg-[#EFEAE0] dark:bg-[#16233B] border-[#14532D]/40 dark:border-[#34D399]/40 text-[#14532D] dark:text-[#34D399] font-semibold'
                  : 'border-[#E3DCCB] dark:border-[#1F3254] text-[#57534E] dark:text-[#9BAAC4]'
              }`}
            >
              {isEn
                ? largeFont
                  ? 'Large Text On'
                  : 'Large Text'
                : largeFont
                  ? 'বড় লেখা চালু'
                  : 'বড় লেখা'}
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: 7 MAIN BOOKS (Card + Book Cover + Inline Chapter Dropdown) */}
      {categoryMode === 'books' && !activeSelection && (
        <div>
          {sectionsError && (
            <div className="mb-6 bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-6 text-center">
              <p className="text-sm text-[#9A3412] dark:text-[#FDBA74] mb-3">{sectionsError}</p>
              <button
                type="button"
                onClick={loadAllSections}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-[#14532D] dark:bg-[#34D399] text-white dark:text-[#080E1A]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isEn ? 'Try Again' : 'আবার চেষ্টা করুন'}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {HADITH_BOOKS.map((book, idx) => {
              const isExpanded = expandedBookId === book.id;
              const bookChapters = sectionsByBook[book.id] || [];
              const q = dropdownFilter.trim().toLowerCase();
              const visibleChapters =
                isExpanded && q
                  ? bookChapters.filter(
                      (c) =>
                        c.titleBn.toLowerCase().includes(q) ||
                        c.title.toLowerCase().includes(q) ||
                        String(c.sectionNumber).includes(q) ||
                        toBengaliDigits(c.sectionNumber).includes(q)
                    )
                  : bookChapters;

              return (
                <div
                  key={book.id}
                  className={`rounded-xl border transition-colors ${
                    isExpanded
                      ? 'bg-[#FCFBF7] dark:bg-[#0E1729] border-[#14532D] dark:border-[#34D399]'
                      : 'bg-[#FCFBF7] dark:bg-[#0E1729] border-[#E3DCCB] dark:border-[#1F3254]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedBookId(isExpanded ? null : book.id);
                      setDropdownFilter('');
                    }}
                    aria-expanded={isExpanded}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-[#EFEAE0]/35 dark:hover:bg-[#16233B]/35 transition-colors rounded-xl"
                  >
                    <div className="min-w-0">
                      <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A] mb-1 tabular-nums">
                        {isEn
                          ? `Book ${idx + 1} · ${book.totalEstimateEn}${bookChapters.length > 0 ? ` · ${bookChapters.length} Chapters` : ''}`
                          : `গ্রন্থ ${toBengaliDigits(idx + 1)} · ${book.totalEstimate}${bookChapters.length > 0 ? ` · ${toBengaliDigits(bookChapters.length)}টি বিভাগ` : ''}`}
                      </div>
                      <h3 className="text-xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9] mb-1">
                        {isEn ? book.nameEn : book.nameBn}
                      </h3>
                      <div className="text-xs text-[#57534E] dark:text-[#9BAAC4] mb-2">
                        {isEn ? book.compilerEn : book.compilerBn}
                      </div>
                      <p className="text-xs text-[#57534E] dark:text-[#9BAAC4] leading-relaxed">
                        {isEn ? book.descriptionEn : book.descriptionBn}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EFEAE0] dark:bg-[#16233B] text-xs font-medium text-[#14532D] dark:text-[#34D399] shrink-0 mt-1 whitespace-nowrap">
                      <span>
                        {isEn
                          ? isExpanded
                            ? 'Hide Chapters'
                            : 'View Chapters'
                          : isExpanded
                            ? 'বিভাগ বন্ধ করুন'
                            : 'বিভাগ দেখুন'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-4 border-t border-[#E3DCCB] dark:border-[#1F3254] space-y-4">
                      {/* Dedicated Book Cover Showcase when Card is Clicked */}
                      <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 p-3.5 rounded-xl bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB]/80 dark:border-[#1F3254]">
                        <div className="w-24 sm:w-28 aspect-[3/4] rounded-lg overflow-hidden border border-[#E3DCCB] dark:border-[#1F3254] shrink-0">
                          <ResilientImage
                            src={book.coverImage}
                            alt={isEn ? book.nameEn : book.nameBn}
                          />
                        </div>
                        <div className="flex flex-col justify-center text-center sm:text-left">
                          <div className="text-xs font-semibold text-[#14532D] dark:text-[#34D399] mb-1">
                            {isEn ? book.nameEn : book.nameBn}
                          </div>
                          <p className="text-xs text-[#57534E] dark:text-[#9BAAC4] leading-relaxed mb-2">
                            {isEn
                              ? `Select any chapter below to read verified Sahih Hadiths from ${book.nameEn}.`
                              : `${book.nameBn} থেকে সম্পূর্ণ সহীহ হাদিসসমূহ পড়তে নিচের যেকোনো বিভাগ নির্বাচন করুন।`}
                          </p>
                          <div className="text-[11px] text-[#8B5E2A] dark:text-[#D4AF6A]">
                            {isEn ? book.compilerEn : book.compilerBn}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor={`filter-${book.id}`} className="sr-only">
                          {isEn ? 'Search chapter' : 'বিভাগ খুঁজুন'}
                        </label>
                        <div className="relative">
                          <Search className="w-4 h-4 text-[#57534E] dark:text-[#9BAAC4] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            id={`filter-${book.id}`}
                            type="text"
                            value={dropdownFilter}
                            onChange={(e) => setDropdownFilter(e.target.value)}
                            placeholder={
                              isEn
                                ? 'Search chapter by name or number (e.g. Prayer, Fasting, Faith)...'
                                : 'বিভাগের নাম বা নম্বর খুঁজুন (যেমন: নামাজ, রোজা, ঈমান)...'
                            }
                            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9] placeholder:text-[#57534E]/70 dark:placeholder:text-[#9BAAC4]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] dark:focus-visible:ring-[#34D399]"
                          />
                        </div>
                      </div>

                      {loadingSections ? (
                        <div className="space-y-2 py-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="h-10 rounded-lg bg-[#EFEAE0] dark:bg-[#16233B] animate-pulse"
                            />
                          ))}
                        </div>
                      ) : visibleChapters.length === 0 ? (
                        <p className="py-6 text-center text-xs text-[#57534E] dark:text-[#9BAAC4]">
                          {isEn ? 'No chapter found.' : 'কোনো বিভাগ পাওয়া যায়নি।'}
                        </p>
                      ) : (
                        <div className="max-h-72 overflow-y-auto divide-y divide-[#E3DCCB]/60 dark:divide-[#1F3254]/60 pr-1">
                          {visibleChapters.map((sec) => (
                            <button
                              key={sec.sectionNumber}
                              type="button"
                              onClick={() => openChapter(book.id, sec.sectionNumber)}
                              className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] transition-colors flex items-center justify-between gap-3 cursor-pointer"
                            >
                              <div className="flex items-start gap-2.5 min-w-0">
                                <span className="px-2 py-0.5 text-xs font-medium rounded bg-[#EFEAE0] dark:bg-[#16233B] text-[#14532D] dark:text-[#34D399] tabular-nums shrink-0 mt-0.5">
                                  {toLocalizedDigits(sec.sectionNumber, lang)}
                                </span>
                                <span className="text-sm font-medium text-[#1C1917] dark:text-[#EDF2F9] leading-snug">
                                  {isEn ? sec.title : sec.titleBn}
                                </span>
                              </div>
                              <span className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A] shrink-0 whitespace-nowrap">
                                {isEn ? 'Read →' : 'পড়ুন →'}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 1 READER VIEW */}
      {categoryMode === 'books' && activeSelection && activeBook && (
        <div className="space-y-6">
          <div className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E3DCCB] dark:border-[#1F3254]">
              <button
                type="button"
                onClick={() => setActiveSelection(null)}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border border-[#E3DCCB] dark:border-[#1F3254] bg-[#F7F4EC] dark:bg-[#080E1A] text-[#1C1917] dark:text-[#EDF2F9] hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] transition-colors cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isEn ? 'Back to All Books & Chapters' : 'সকল গ্রন্থ ও বিভাগে ফিরুন'}</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-9 h-12 rounded overflow-hidden border border-[#E3DCCB] dark:border-[#1F3254] shrink-0">
                  <ResilientImage
                    src={activeBook.coverImage}
                    alt={isEn ? activeBook.nameEn : activeBook.nameBn}
                  />
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                    {isEn ? activeBook.nameEn : activeBook.nameBn}
                  </div>
                  <div className="text-[#8B5E2A] dark:text-[#D4AF6A]">
                    {isEn ? activeBook.compilerEn : activeBook.compilerBn}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-4">
                <label
                  htmlFor="hadith-book-select"
                  className="block text-xs text-[#57534E] dark:text-[#9BAAC4] mb-1"
                >
                  {isEn ? 'Select Hadith Book' : 'হাদিস গ্রন্থ নির্বাচন করুন'}
                </label>
                <select
                  id="hadith-book-select"
                  value={activeSelection.bookId}
                  onChange={(e) => {
                    const nextBookId = e.target.value;
                    const firstChap = sectionsByBook[nextBookId]?.[0]?.sectionNumber || 1;
                    setActiveSelection({ bookId: nextBookId, sectionNumber: firstChap });
                  }}
                  className="w-full px-3 py-2 text-sm bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] dark:focus-visible:ring-[#34D399]"
                >
                  {HADITH_BOOKS.map((b) => (
                    <option key={b.id} value={b.id} className="bg-[#FCFBF7] dark:bg-[#0E1729]">
                      {isEn ? b.nameEn : b.nameBn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-5">
                <label
                  htmlFor="hadith-chapter-select"
                  className="block text-xs text-[#57534E] dark:text-[#9BAAC4] mb-1"
                >
                  {isEn ? 'Select Chapter' : 'বিভাগ / অধ্যায় নির্বাচন করুন'}
                </label>
                <select
                  id="hadith-chapter-select"
                  value={activeSelection.sectionNumber}
                  onChange={(e) =>
                    setActiveSelection({
                      bookId: activeSelection.bookId,
                      sectionNumber: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] dark:focus-visible:ring-[#34D399]"
                >
                  {activeBookChapters.map((sec) => (
                    <option
                      key={sec.sectionNumber}
                      value={sec.sectionNumber}
                      className="bg-[#FCFBF7] dark:bg-[#0E1729]"
                    >
                      {isEn
                        ? `Chapter ${sec.sectionNumber}: ${sec.title}`
                        : `অধ্যায় ${toBengaliDigits(sec.sectionNumber)}: ${sec.titleBn}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <label htmlFor="hadith-search-box" className="sr-only">
                  {isEn ? 'Search Hadith' : 'হাদিস খুঁজুন'}
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-[#57534E] dark:text-[#9BAAC4] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="hadith-search-box"
                    type="text"
                    value={hadithSearch}
                    onChange={(e) => {
                      setHadithSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder={isEn ? 'Search keyword or number...' : 'শব্দ বা নম্বর খুঁজুন...'}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9] placeholder:text-[#57534E]/70 dark:placeholder:text-[#9BAAC4]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] dark:focus-visible:ring-[#34D399]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#57534E] dark:text-[#9BAAC4] tabular-nums">
              <div>
                <span className="font-semibold text-[#1C1917] dark:text-[#EDF2F9] text-sm mr-2">
                  {sectionTitle ||
                    (isEn
                      ? activeBookChapters.find((s) => s.sectionNumber === activeSelection.sectionNumber)?.title ||
                        'Selected Chapter'
                      : activeBookChapters.find((s) => s.sectionNumber === activeSelection.sectionNumber)?.titleBn ||
                        'নির্বাচিত বিভাগ')}
                </span>
                <span>
                  {isEn
                    ? `· Verified Sahih Hadiths: ${filteredHadiths.length}${sectionCounts.excluded > 0 ? ` (${sectionCounts.excluded} weak/non-Sahih excluded)` : ''}`
                    : `· সহীহ হাদিস: ${toBengaliDigits(filteredHadiths.length)}টি${sectionCounts.excluded > 0 ? ` (${toBengaliDigits(sectionCounts.excluded)}টি দুর্বল/অ-সহীহ বাদ দেওয়া হয়েছে)` : ''}`}
                </span>
              </div>
              {filteredHadiths.length > ITEMS_PER_PAGE && (
                <div>
                  {isEn
                    ? `Page ${currentPage} / ${totalPages}`
                    : `পৃষ্ঠা ${toBengaliDigits(currentPage)} / ${toBengaliDigits(totalPages)}`}
                </div>
              )}
            </div>
          </div>

          {loadingHadiths ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-6 animate-pulse"
                >
                  <div className="h-4 w-32 bg-[#EFEAE0] dark:bg-[#16233B] rounded mb-5" />
                  <div className="h-6 w-full bg-[#EFEAE0] dark:bg-[#16233B] rounded mb-3" />
                  <div className="h-4 w-5/6 bg-[#EFEAE0] dark:bg-[#16233B] rounded" />
                </div>
              ))}
            </div>
          ) : hadithError ? (
            <div className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-8 text-center">
              <p className="text-sm text-[#9A3412] dark:text-[#FDBA74] mb-4">{hadithError}</p>
              <button
                type="button"
                onClick={() =>
                  loadSectionHadiths(activeSelection.bookId, activeSelection.sectionNumber, lang)
                }
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-[#14532D] dark:bg-[#34D399] text-white dark:text-[#080E1A]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isEn ? 'Try Again' : 'পুনরায় চেষ্টা করুন'}
              </button>
            </div>
          ) : paginatedHadiths.length === 0 ? (
            <div className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-8 text-center text-sm text-[#57534E] dark:text-[#9BAAC4]">
              {hadiths.length === 0 && sectionCounts.excluded > 0
                ? isEn
                  ? 'No strictly verified Sahih Hadith found in this chapter (all weak/non-Sahih narrations were filtered out). Please choose another chapter from the dropdown above.'
                  : 'এই বিভাগে কোনো সম্পূর্ণ সহীহ হাদিস পাওয়া যায়নি (সকল দুর্বল/অ-সহীহ বর্ণনা বাদ দেওয়া হয়েছে)। ওপরের ড্রপডাউন থেকে অন্য বিভাগ বেছে নিন।'
                : isEn
                  ? 'No Sahih Hadith matched your search.'
                  : 'অনুসন্ধানের সাথে মিলে এমন কোনো সহীহ হাদিস পাওয়া যায়নি।'}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedHadiths.map((h, idx) => {
                const gradeSummary =
                  h.grades?.length > 0
                    ? h.grades.map((g) => `${g.name}: ${g.grade}`).join(' · ')
                    : '';
                const copyId = `book-${h.hadithnumber}-${idx}`;
                return (
                  <article
                    key={copyId}
                    className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-5 sm:p-7"
                  >
                    <div className="flex items-center justify-between gap-4 pb-3 mb-4 border-b border-[#E3DCCB]/60 dark:border-[#1F3254]/70">
                      <div className="text-xs text-[#57534E] dark:text-[#9BAAC4] tabular-nums">
                        {isEn
                          ? `${activeBook.nameEn} · Hadith #${h.hadithnumber} · `
                          : `${activeBook.nameBn} · হাদিস নং ${toBengaliDigits(h.hadithnumber)} · `}
                        <span className="text-[#14532D] dark:text-[#34D399] font-medium">
                          {isEn ? 'Grade: Strictly Sahih' : 'মান: সম্পূর্ণ সহীহ'}
                        </span>
                        {gradeSummary ? ` · ${gradeSummary}` : ''}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          copyTextWithFeedback(
                            copyId,
                            isEn
                              ? `${h.textAr ? h.textAr + '\n\n' : ''}${h.textBn}\n— ${activeBook.nameEn}, Hadith #${h.hadithnumber} (Grade: Sahih)`
                              : `${h.textAr ? h.textAr + '\n\n' : ''}${h.textBn}\n— ${activeBook.nameBn}, হাদিস নং ${toBengaliDigits(h.hadithnumber)} (মান: সহীহ)`
                          )
                        }
                        aria-label={isEn ? 'Copy Hadith' : 'হাদিস কপি করুন'}
                        className="p-1.5 rounded-md text-[#57534E] dark:text-[#9BAAC4] hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] hover:text-[#1C1917] dark:hover:text-[#EDF2F9] transition-colors cursor-pointer"
                      >
                        {copiedKey === copyId ? (
                          <Check className="w-4 h-4 text-[#14532D] dark:text-[#34D399]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {showArabic && h.textAr && (
                      <p
                        className={`font-arabic ${
                          largeFont ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                        } leading-[2.2] text-right text-[#1C1917] dark:text-[#EDF2F9] mb-5`}
                      >
                        {h.textAr}
                      </p>
                    )}

                    <p
                      className={`font-editorial ${
                        largeFont ? 'text-lg sm:text-xl leading-[1.95]' : 'text-[16px] leading-[1.85]'
                      } text-[#1C1917] dark:text-[#EDF2F9] whitespace-pre-line`}
                    >
                      {h.textBn}
                    </p>
                  </article>
                );
              })}

              {totalPages > 1 && (
                <div className="pt-4 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => goToPage(currentPage - 1)}
                    className="px-4 py-2 text-sm font-medium rounded-lg border border-[#E3DCCB] dark:border-[#1F3254] bg-[#FCFBF7] dark:bg-[#0E1729] text-[#1C1917] dark:text-[#EDF2F9] disabled:opacity-40 hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] transition-colors cursor-pointer"
                  >
                    {isEn ? '← Previous 10' : '← আগের ১০টি হাদিস'}
                  </button>

                  <span className="text-xs text-[#57534E] dark:text-[#9BAAC4] tabular-nums">
                    {isEn
                      ? `Page ${currentPage} / ${totalPages}`
                      : `পৃষ্ঠা ${toBengaliDigits(currentPage)} / ${toBengaliDigits(totalPages)}`}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                    className="px-4 py-2 text-sm font-medium rounded-lg border border-[#E3DCCB] dark:border-[#1F3254] bg-[#FCFBF7] dark:bg-[#0E1729] text-[#1C1917] dark:text-[#EDF2F9] disabled:opacity-40 hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] transition-colors cursor-pointer"
                  >
                    {isEn ? 'Next 10 →' : 'পরের ১০টি হাদিস →'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: IMAM NAWAWI'S FORTY HADITH */}
      {categoryMode === 'nawawi' && (
        <div className="space-y-6">
          <div className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A] mb-1 tabular-nums">
                {isEn
                  ? `Imam Yahya ibn Sharaf an-Nawawi (RH) · Verified Sahih Hadiths: ${filteredNawawi.length}${nawawiExcluded > 0 ? ` (${nawawiExcluded} weak/disputed excluded)` : ''}`
                  : `ইমাম মুহিউদ্দীন আন-নববী (রহ.) · প্রদর্শিত সহীহ হাদিস: ${toBengaliDigits(filteredNawawi.length)}টি${nawawiExcluded > 0 ? ` (${toBengaliDigits(nawawiExcluded)}টি অ-সহীহ/মতভেদপূর্ণ হাদিস বাদ দেওয়া হয়েছে)` : ''}`}
              </div>
              <h3 className="text-xl sm:text-2xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                {isEn
                  ? "Imam Nawawi's Forty Hadith (Verified Sahih Subset)"
                  : 'ইমাম নববীর চল্লিশ হাদিস (বাছাইকৃত সহীহ)'}
              </h3>
            </div>

            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-4 h-4 text-[#57534E] dark:text-[#9BAAC4] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={hadithSearch}
                onChange={(e) => {
                  setHadithSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={isEn ? 'Search Hadith...' : 'হাদিস খুঁজুন...'}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9] placeholder:text-[#57534E]/70 dark:placeholder:text-[#9BAAC4]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] dark:focus-visible:ring-[#34D399]"
              />
            </div>
          </div>

          {loadingNawawi ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-6 animate-pulse"
                >
                  <div className="h-4 w-32 bg-[#EFEAE0] dark:bg-[#16233B] rounded mb-5" />
                  <div className="h-6 w-full bg-[#EFEAE0] dark:bg-[#16233B] rounded mb-3" />
                  <div className="h-4 w-5/6 bg-[#EFEAE0] dark:bg-[#16233B] rounded" />
                </div>
              ))}
            </div>
          ) : nawawiError ? (
            <div className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-8 text-center">
              <p className="text-sm text-[#9A3412] dark:text-[#FDBA74] mb-4">{nawawiError}</p>
              <button
                type="button"
                onClick={() => loadNawawi(lang)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-[#14532D] dark:bg-[#34D399] text-white dark:text-[#080E1A]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isEn ? 'Try Again' : 'আবার চেষ্টা করুন'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedNawawi.map((h) => {
                const copyId = `nawawi-${h.hadithnumber}`;
                return (
                  <article
                    key={copyId}
                    className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-5 sm:p-7"
                  >
                    <div className="flex items-center justify-between gap-4 pb-3 mb-4 border-b border-[#E3DCCB]/60 dark:border-[#1F3254]/70">
                      <div className="text-xs text-[#57534E] dark:text-[#9BAAC4] tabular-nums">
                        {isEn
                          ? `Al-Arba'in an-Nawawiyyah · Hadith #${h.hadithnumber} · `
                          : `ইমাম নববীর চল্লিশ হাদিস · হাদিস নং ${toBengaliDigits(h.hadithnumber)} · `}
                        <span className="text-[#14532D] dark:text-[#34D399] font-medium">
                          {isEn ? 'Grade: Sahih' : 'মান: সহীহ'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          copyTextWithFeedback(
                            copyId,
                            isEn
                              ? `${h.textAr ? h.textAr + '\n\n' : ''}${h.textBn}\n— Imam Nawawi's Forty Hadith, #${h.hadithnumber}`
                              : `${h.textAr ? h.textAr + '\n\n' : ''}${h.textBn}\n— ইমাম নববীর চল্লিশ হাদিস, হাদিস নং ${toBengaliDigits(h.hadithnumber)}`
                          )
                        }
                        aria-label={isEn ? 'Copy Hadith' : 'হাদিস কপি করুন'}
                        className="p-1.5 rounded-md text-[#57534E] dark:text-[#9BAAC4] hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] hover:text-[#1C1917] dark:hover:text-[#EDF2F9] transition-colors cursor-pointer"
                      >
                        {copiedKey === copyId ? (
                          <Check className="w-4 h-4 text-[#14532D] dark:text-[#34D399]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {showArabic && h.textAr && (
                      <p
                        className={`font-arabic ${
                          largeFont ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                        } leading-[2.2] text-right text-[#1C1917] dark:text-[#EDF2F9] mb-5`}
                      >
                        {h.textAr}
                      </p>
                    )}

                    <p
                      className={`font-editorial ${
                        largeFont ? 'text-lg sm:text-xl leading-[1.95]' : 'text-[16px] leading-[1.85]'
                      } text-[#1C1917] dark:text-[#EDF2F9] whitespace-pre-line`}
                    >
                      {h.textBn}
                    </p>
                  </article>
                );
              })}

              {nawawiTotalPages > 1 && (
                <div className="pt-4 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => goToPage(currentPage - 1)}
                    className="px-4 py-2 text-sm font-medium rounded-lg border border-[#E3DCCB] dark:border-[#1F3254] bg-[#FCFBF7] dark:bg-[#0E1729] text-[#1C1917] dark:text-[#EDF2F9] disabled:opacity-40 hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] transition-colors cursor-pointer"
                  >
                    {isEn ? '← Previous 10' : '← আগের ১০টি হাদিস'}
                  </button>

                  <span className="text-xs text-[#57534E] dark:text-[#9BAAC4] tabular-nums">
                    {isEn
                      ? `Page ${currentPage} / ${nawawiTotalPages}`
                      : `পৃষ্ঠা ${toBengaliDigits(currentPage)} / ${toBengaliDigits(nawawiTotalPages)}`}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage >= nawawiTotalPages}
                    onClick={() => goToPage(currentPage + 1)}
                    className="px-4 py-2 text-sm font-medium rounded-lg border border-[#E3DCCB] dark:border-[#1F3254] bg-[#FCFBF7] dark:bg-[#0E1729] text-[#1C1917] dark:text-[#EDF2F9] disabled:opacity-40 hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] transition-colors cursor-pointer"
                  >
                    {isEn ? 'Next 10 →' : 'পরের ১০টি হাদিস →'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAHIH HADITH QUDSI */}
      {categoryMode === 'qudsi' && (
        <div className="space-y-6">
          <div className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A] mb-1 tabular-nums">
                {isEn
                  ? `Compiled exclusively from Sahih al-Bukhari & Sahih Muslim · ${filteredQudsi.length} Authentic Hadith Qudsi`
                  : `সহীহ বুখারী ও সহীহ মুসলিম থেকে সংকলিত · ${toBengaliDigits(filteredQudsi.length)}টি প্রামাণ্য হাদিসে কুদসী`}
              </div>
              <h3 className="text-xl sm:text-2xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                {isEn
                  ? 'Sahih Hadith Qudsi (Sacred Divine Narrations)'
                  : 'সহীহ হাদিসে কুদসী (মহান আল্লাহর বাণী)'}
              </h3>
            </div>

            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-4 h-4 text-[#57534E] dark:text-[#9BAAC4] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={hadithSearch}
                onChange={(e) => setHadithSearch(e.target.value)}
                placeholder={isEn ? 'Search Hadith Qudsi...' : 'হাদিসে কুদসী খুঁজুন...'}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9] placeholder:text-[#57534E]/70 dark:placeholder:text-[#9BAAC4]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] dark:focus-visible:ring-[#34D399]"
              />
            </div>
          </div>

          {filteredQudsi.length === 0 ? (
            <div className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-8 text-center text-sm text-[#57534E] dark:text-[#9BAAC4]">
              {isEn ? 'No Hadith Qudsi matched your search.' : 'অনুসন্ধানের সাথে মিলে এমন কোনো হাদিসে কুদসী পাওয়া যায়নি।'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQudsi.map((q) => {
                const copyId = `qudsi-${q.id}`;
                return (
                  <article
                    key={copyId}
                    className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-5 sm:p-7"
                  >
                    <div className="flex items-center justify-between gap-4 pb-3 mb-4 border-b border-[#E3DCCB]/60 dark:border-[#1F3254]/70">
                      <div className="text-xs text-[#57534E] dark:text-[#9BAAC4] tabular-nums">
                        {isEn ? `Hadith Qudsi #${q.id} · ` : `হাদিসে কুদসী নং ${toBengaliDigits(q.id)} · `}
                        <span className="text-[#14532D] dark:text-[#34D399] font-medium">
                          {isEn ? 'Grade: Sahih (Bukhari/Muslim)' : 'মান: মুত্তাফাকুন আলাইহি / সহীহ'}
                        </span>{' '}
                        · {isEn ? q.referenceEn : q.referenceBn}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          copyTextWithFeedback(
                            copyId,
                            isEn
                              ? `${q.arabic}\n\n${q.english}\n— ${q.referenceEn}`
                              : `${q.arabic}\n\n${q.bengali}\n— ${q.referenceBn}`
                          )
                        }
                        aria-label={isEn ? 'Copy Hadith' : 'হাদিস কপি করুন'}
                        className="p-1.5 rounded-md text-[#57534E] dark:text-[#9BAAC4] hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] hover:text-[#1C1917] dark:hover:text-[#EDF2F9] transition-colors cursor-pointer"
                      >
                        {copiedKey === copyId ? (
                          <Check className="w-4 h-4 text-[#14532D] dark:text-[#34D399]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <h4 className="text-lg font-editorial font-semibold text-[#8B5E2A] dark:text-[#D4AF6A] mb-3">
                      {isEn ? q.titleEn : q.titleBn}
                    </h4>

                    {showArabic && (
                      <p
                        className={`font-arabic ${
                          largeFont ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                        } leading-[2.2] text-right text-[#1C1917] dark:text-[#EDF2F9] mb-5`}
                      >
                        {q.arabic}
                      </p>
                    )}

                    <p
                      className={`font-editorial ${
                        largeFont ? 'text-lg sm:text-xl leading-[1.95]' : 'text-[16px] leading-[1.85]'
                      } text-[#1C1917] dark:text-[#EDF2F9]`}
                    >
                      {isEn ? q.english : q.bengali}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
