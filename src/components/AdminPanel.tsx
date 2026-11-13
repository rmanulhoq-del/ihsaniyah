import { useMemo, useRef, useState } from 'react';
import {
  Check,
  Download,
  Edit3,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plus,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Unlock,
  Upload,
  UserCheck,
  X,
} from 'lucide-react';
import { toLocalizedDigits } from '../data/islamicKnowledgeEn';
import { SURAH_INDEX_114 } from '../data/surahNamesBn';
import { AppLang } from '../types/language';

export interface SiteConfig {
  noticeBn: string;
  noticeEn: string;
  spotlightSurah: number;
  showFirstRevelation: boolean;
  showEcosystem: boolean;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  noticeBn: '',
  noticeEn: '',
  spotlightSurah: 96,
  showFirstRevelation: true,
  showEcosystem: true,
};

export type CustomEntryCategory = 'masala' | 'article' | 'amal' | 'hadith_note';

export interface CustomEntry {
  id: string;
  category: CustomEntryCategory;
  titleBn: string;
  titleEn: string;
  arabicText?: string;
  contentBn: string;
  contentEn: string;
  referenceBn: string;
  referenceEn: string;
  updatedAt: string;
}

interface AdminPanelProps {
  lang: AppLang;
  siteConfig: SiteConfig;
  onUpdateSiteConfig: (next: SiteConfig) => void;
  customEntries: CustomEntry[];
  onUpdateCustomEntries: (next: CustomEntry[]) => void;
}

const EMPTY_FORM: Omit<CustomEntry, 'id' | 'updatedAt'> = {
  category: 'masala',
  titleBn: '',
  titleEn: '',
  arabicText: '',
  contentBn: '',
  contentEn: '',
  referenceBn: '',
  referenceEn: '',
};

const CATEGORY_LABELS: Record<CustomEntryCategory, { bn: string; en: string }> = {
  masala: { bn: 'মাসআলা ও প্রশ্নোত্তর', en: 'Masail & Q&A' },
  article: { bn: 'ইসলামিক প্রবন্ধ ও নসীহত', en: 'Article & Reminder' },
  amal: { bn: 'দৈনিক আমল ও দুআ', en: 'Daily Amal & Dua' },
  hadith_note: { bn: 'কুরআন ও হাদিস নোট', en: 'Quran & Hadith Note' },
};

export function AdminPanel({
  lang,
  siteConfig,
  onUpdateSiteConfig,
  customEntries,
  onUpdateCustomEntries,
}: AdminPanelProps) {
  const isEn = lang === 'en';
  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);

  const [storedPin, setStoredPin] = useState<string>(() => {
    try {
      return localStorage.getItem('ihsaniyah_admin_pin') || '7860';
    } catch {
      return '7860';
    }
  });

  const [draftConfig, setDraftConfig] = useState<SiteConfig>(siteConfig);
  const [newPin, setNewPin] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Content Editor (Add / Edit) state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [entryForm, setEntryForm] = useState(EMPTY_FORM);
  const [entryFeedback, setEntryFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stats = useMemo(() => {
    let bookmarksCount = 0;
    let practicesCount = 0;
    let tasbihTotal = 0;
    try {
      const bm = JSON.parse(localStorage.getItem('ihsaniyah_quran_bookmarks') || '[]');
      if (Array.isArray(bm)) bookmarksCount = bm.length;
      const pr = JSON.parse(localStorage.getItem('ihsaniyah_daily_amal') || '[]');
      if (Array.isArray(pr)) practicesCount = pr.length;
      tasbihTotal = Number(localStorage.getItem('ihsaniyah_tasbih_total') || '0') || 0;
    } catch {
      // ignore
    }
    return { bookmarksCount, practicesCount, tasbihTotal };
  }, [isUnlocked]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === storedPin) {
      setIsUnlocked(true);
      setPinError(false);
      setDraftConfig(siteConfig);
    } else {
      setPinError(true);
    }
  };

  const handleSaveConfig = () => {
    onUpdateSiteConfig(draftConfig);
    if (newPin.trim().length >= 4) {
      try {
        localStorage.setItem('ihsaniyah_admin_pin', newPin.trim());
        setStoredPin(newPin.trim());
        setNewPin('');
      } catch {
        // ignore
      }
    }
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleResetConfig = () => {
    setDraftConfig(DEFAULT_SITE_CONFIG);
    onUpdateSiteConfig(DEFAULT_SITE_CONFIG);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryForm.titleBn.trim() && !entryForm.titleEn.trim()) return;
    if (!entryForm.contentBn.trim() && !entryForm.contentEn.trim()) return;

    const now = new Date().toISOString().slice(0, 10);
    if (editingId) {
      const updated = customEntries.map((item) =>
        item.id === editingId
          ? {
              ...item,
              ...entryForm,
              titleBn: entryForm.titleBn.trim() || entryForm.titleEn.trim(),
              titleEn: entryForm.titleEn.trim() || entryForm.titleBn.trim(),
              contentBn: entryForm.contentBn.trim() || entryForm.contentEn.trim(),
              contentEn: entryForm.contentEn.trim() || entryForm.contentBn.trim(),
              updatedAt: now,
            }
          : item
      );
      onUpdateCustomEntries(updated);
      setEditingId(null);
      setEntryFeedback(isEn ? 'Entry updated!' : 'তথ্যটি আপডেট হয়েছে!');
    } else {
      const created: CustomEntry = {
        id: `entry_${Date.now()}`,
        category: entryForm.category,
        titleBn: entryForm.titleBn.trim() || entryForm.titleEn.trim(),
        titleEn: entryForm.titleEn.trim() || entryForm.titleBn.trim(),
        arabicText: entryForm.arabicText?.trim() || '',
        contentBn: entryForm.contentBn.trim() || entryForm.contentEn.trim(),
        contentEn: entryForm.contentEn.trim() || entryForm.contentBn.trim(),
        referenceBn: entryForm.referenceBn.trim(),
        referenceEn: entryForm.referenceEn.trim() || entryForm.referenceBn.trim(),
        updatedAt: now,
      };
      onUpdateCustomEntries([created, ...customEntries]);
      setEntryFeedback(isEn ? 'Published on Home!' : 'নতুন তথ্য হোম পেজে যুক্ত হয়েছে!');
    }

    setEntryForm(EMPTY_FORM);
    setTimeout(() => setEntryFeedback(null), 2500);
  };

  const startEditEntry = (entry: CustomEntry) => {
    setEditingId(entry.id);
    setEntryForm({
      category: entry.category,
      titleBn: entry.titleBn,
      titleEn: entry.titleEn,
      arabicText: entry.arabicText || '',
      contentBn: entry.contentBn,
      contentEn: entry.contentEn,
      referenceBn: entry.referenceBn,
      referenceEn: entry.referenceEn,
    });
  };

  const deleteEntry = (id: string) => {
    onUpdateCustomEntries(customEntries.filter((e) => e.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEntryForm(EMPTY_FORM);
    }
  };

  const exportBackup = () => {
    try {
      const payload = {
        exportedAt: new Date().toISOString(),
        administrator: 'Mohammad Armanul Hoque (ynanx.com / Ihsaniyah)',
        siteConfig,
        customEntries,
        quranBookmarks: JSON.parse(localStorage.getItem('ihsaniyah_quran_bookmarks') || '[]'),
        dailyCompletedPractices: JSON.parse(localStorage.getItem('ihsaniyah_daily_amal') || '[]'),
        tasbihLifetimeTotal: Number(localStorage.getItem('ihsaniyah_tasbih_total') || '0'),
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ihsaniyah-backup.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  };

  const importBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        if (parsed.siteConfig) {
          const nextConf = { ...DEFAULT_SITE_CONFIG, ...parsed.siteConfig };
          setDraftConfig(nextConf);
          onUpdateSiteConfig(nextConf);
        }
        if (Array.isArray(parsed.customEntries)) {
          onUpdateCustomEntries(parsed.customEntries);
        }
        setEntryFeedback(isEn ? 'Backup imported!' : 'ব্যাকআপ ফাইল রিস্টোর হয়েছে!');
        setTimeout(() => setEntryFeedback(null), 2500);
      } catch {
        setEntryFeedback(isEn ? 'Invalid backup file' : 'ব্যাকআপ ফাইল সঠিক নয়');
        setTimeout(() => setEntryFeedback(null), 2500);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Masthead */}
      <div className="pb-6 border-b border-[#E3DCCB] dark:border-[#1F3254] flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-wider text-[#8B5E2A] dark:text-[#D4AF6A] mb-2">
            {isEn
              ? 'Editorial Stewardship & Content Editor · ynanx.com'
              : 'পরিচালনা পর্ষদ, কনটেন্ট এডিটর ও এডমিন প্যানেল · ynanx.com'}
          </p>
          <h2 className="text-3xl sm:text-4xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9] text-balance">
            {isEn
              ? 'Founder Profile, Content Editor & Admin Panel'
              : 'প্রতিষ্ঠাতা পরিচিতি, কনটেন্ট এডিটর ও এডমিন প্যানেল'}
          </h2>
        </div>
        <p className="text-sm text-[#57534E] dark:text-[#9BAAC4] max-w-md leading-relaxed">
          {isEn
            ? 'Add or edit Masail, articles, reminders, announcements, and platform settings anytime.'
            : 'এখান থেকে সাইটে যেকোনো সময় নতুন মাসআলা, প্রবন্ধ, আমল, নোটিশ যোগ বা এডিট করতে পারবেন।'}
        </p>
      </div>

      {/* Founder & Chief Administrator Profile Card */}
      <div className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 mb-6 border-b border-[#E3DCCB] dark:border-[#1F3254]">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#EAF4ED] dark:bg-[#132E3E] border border-[#C6E0CD] dark:border-[#245369] flex items-center justify-center shrink-0">
              <UserCheck className="w-7 h-7 text-[#14532D] dark:text-[#34D399]" />
            </div>
            <div>
              <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A] mb-1">
                {isEn
                  ? 'Founder, Publisher & Chief Administrator'
                  : 'প্রতিষ্ঠাতা, প্রকাশক ও প্রধান এডমিন'}
              </div>
              <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-[#1C1917] dark:text-[#EDF2F9]">
                {isEn ? 'Mohammad Armanul Hoque' : 'মোহাম্মদ আরমানুল হক'}
              </h3>
              <p className="text-xs text-[#57534E] dark:text-[#9BAAC4] mt-1">
                {isEn
                  ? 'Ihsaniyah (ইহসানিয়াহ) · Ynanx Labs · Black Box News · ynanx.com'
                  : 'ইহসানিয়াহ (Ihsaniyah) · Ynanx Labs · ব্ল্যাক বক্স নিউজ · ynanx.com'}
              </p>
            </div>
          </div>

          <div className="text-xs text-[#14532D] dark:text-[#34D399] font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{isEn ? 'Verified Platform Steward' : 'অনুমোদিত প্ল্যাটফর্ম পরিচালক'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B5E2A] dark:text-[#D4AF6A]">
              <MapPin className="w-3.5 h-3.5" />
              <span>{isEn ? 'Address' : 'ঠিকানা'}</span>
            </div>
            <p className="text-sm font-medium text-[#1C1917] dark:text-[#EDF2F9] leading-relaxed">
              {isEn
                ? 'Napora, Banshkhali, Chattogram, Bangladesh'
                : 'নাপোড়া, বাঁশখালী, চট্টগ্রাম, বাংলাদেশ'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B5E2A] dark:text-[#D4AF6A]">
              <Phone className="w-3.5 h-3.5" />
              <span>{isEn ? 'Mobile / Contact' : 'মোবাইল যোগাযোগ'}</span>
            </div>
            <a
              href="tel:+8801850180708"
              className="block text-sm font-semibold tabular-nums text-[#14532D] dark:text-[#34D399] hover:underline"
            >
              +8801850180708
            </a>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B5E2A] dark:text-[#D4AF6A]">
              <Mail className="w-3.5 h-3.5" />
              <span>{isEn ? 'Email' : 'ইমেইল'}</span>
            </div>
            <a
              href="mailto:rmanulhoq@gmail.com"
              className="block text-sm font-semibold text-[#14532D] dark:text-[#34D399] hover:underline break-all"
            >
              rmanulhoq@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Admin Workspace Lock / Controls */}
      <div className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-6 sm:p-8">
        {!isUnlocked ? (
          <div className="max-w-md mx-auto text-center space-y-5 py-4">
            <div className="w-12 h-12 rounded-xl bg-[#EFEAE0] dark:bg-[#16233B] flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5 text-[#8B5E2A] dark:text-[#D4AF6A]" />
            </div>
            <div>
              <h3 className="text-xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9] mb-1">
                {isEn ? 'Unlock Admin & Content Editor' : 'এডমিন ও কনটেন্ট এডিটর আনলক করুন'}
              </h3>
              <p className="text-xs text-[#57534E] dark:text-[#9BAAC4] leading-relaxed">
                {isEn
                  ? 'Enter your admin PIN (default: 7860) to add/edit posts, Masail, notices, spotlight Surah, and section settings.'
                  : 'নতুন প্রবন্ধ, মাসআলা, আমল ও নোটিশ যোগ বা এডিট করতে এডমিন পিন দিন (ডিফল্ট পিন: 7860)।'}
              </p>
            </div>

            <form onSubmit={handleUnlock} className="flex items-center gap-2 max-w-xs mx-auto">
              <label htmlFor="admin-pin-input" className="sr-only">
                {isEn ? 'Admin PIN' : 'এডমিন পিন'}
              </label>
              <input
                id="admin-pin-input"
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder={isEn ? 'Enter PIN (7860)' : 'পিন লিখুন (7860)'}
                className="flex-1 px-3 py-2 text-sm tabular-nums bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] dark:focus-visible:ring-[#34D399]"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#14532D] dark:bg-[#34D399] text-white dark:text-[#080E1A] cursor-pointer whitespace-nowrap"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>{isEn ? 'Unlock' : 'প্রবেশ করুন'}</span>
              </button>
            </form>

            {pinError && (
              <p className="text-xs text-[#9A3412] dark:text-[#FDBA74]">
                {isEn ? 'Incorrect PIN. Please try again.' : 'পিন সঠিক নয়। অনুগ্রহ করে আবার চেষ্টা করুন।'}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E3DCCB] dark:border-[#1F3254]">
              <div>
                <div className="text-xs text-[#14532D] dark:text-[#34D399] font-medium mb-0.5">
                  {isEn ? 'Admin Session Active' : 'এডমিন সেশন সক্রিয়'}
                </div>
                <h3 className="text-xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                  {isEn ? 'Platform Controls & Content Manager' : 'প্ল্যাটফর্ম নিয়ন্ত্রণ ও কনটেন্ট এডিটর'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsUnlocked(false);
                  setPinInput('');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E3DCCB] dark:border-[#1F3254] text-[#57534E] dark:text-[#9BAAC4] hover:text-[#1C1917] dark:hover:text-[#EDF2F9] cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isEn ? 'Lock Panel' : 'লক করুন'}</span>
              </button>
            </div>

            {/* Real Local User Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254]">
                <div className="text-xs text-[#57534E] dark:text-[#9BAAC4] mb-1">
                  {isEn ? 'Added Custom Entries' : 'যুক্ত করা নতুন কনটেন্ট'}
                </div>
                <div className="text-2xl font-editorial font-bold tabular-nums text-[#14532D] dark:text-[#34D399]">
                  {toLocalizedDigits(customEntries.length, lang)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254]">
                <div className="text-xs text-[#57534E] dark:text-[#9BAAC4] mb-1">
                  {isEn ? 'Saved Quran Ayah Bookmarks' : 'সংরক্ষিত কুরআন আয়াত'}
                </div>
                <div className="text-2xl font-editorial font-bold tabular-nums text-[#14532D] dark:text-[#34D399]">
                  {toLocalizedDigits(stats.bookmarksCount, lang)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254]">
                <div className="text-xs text-[#57534E] dark:text-[#9BAAC4] mb-1">
                  {isEn ? 'Daily Practices Checked' : 'সম্পন্ন দৈনিক আমল'}
                </div>
                <div className="text-2xl font-editorial font-bold tabular-nums text-[#14532D] dark:text-[#34D399]">
                  {toLocalizedDigits(stats.practicesCount, lang)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254]">
                <div className="text-xs text-[#57534E] dark:text-[#9BAAC4] mb-1">
                  {isEn ? 'Total Tasbih Dhikr Count' : 'মোট তসবিহ গণনা'}
                </div>
                <div className="text-2xl font-editorial font-bold tabular-nums text-[#14532D] dark:text-[#34D399]">
                  {toLocalizedDigits(stats.tasbihTotal, lang)}
                </div>
              </div>
            </div>

            {/* Part A: Add / Edit Custom Content (Masail, Articles, Amals, Notes) */}
            <div className="p-5 sm:p-6 rounded-xl bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-lg font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                    {editingId
                      ? isEn
                        ? 'Edit Published Entry'
                        : 'তথ্য এডিট / সংশোধন করুন'
                      : isEn
                        ? 'Add New Content (Masail, Article, Amal or Note)'
                        : 'নতুন তথ্য যোগ করুন (মাসআলা, প্রবন্ধ, আমল বা নোট)'}
                  </h4>
                  <p className="text-xs text-[#57534E] dark:text-[#9BAAC4]">
                    {isEn
                      ? 'Published items immediately appear in the “Latest Additions” section on the Home page.'
                      : 'এখানে যুক্ত বা এডিট করা প্রতিটি লেখা তাৎক্ষণিকভাবে হোম পেজের “নতুন সংযোজন ও আপডেটস” বিভাগে প্রদর্শিত হবে।'}
                  </p>
                </div>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setEntryForm(EMPTY_FORM);
                    }}
                    className="inline-flex items-center gap-1 text-xs text-[#8B5E2A] dark:text-[#D4AF6A] hover:underline cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Cancel Edit' : 'এডিট বাতিল'}</span>
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveEntry} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="entry-cat" className="block text-xs font-medium text-[#57534E] dark:text-[#9BAAC4] mb-1">
                      {isEn ? 'Category' : 'বিভাগ'}
                    </label>
                    <select
                      id="entry-cat"
                      value={entryForm.category}
                      onChange={(e) =>
                        setEntryForm({
                          ...entryForm,
                          category: e.target.value as CustomEntryCategory,
                        })
                      }
                      className="w-full px-3 py-2 text-sm bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9]"
                    >
                      {(Object.keys(CATEGORY_LABELS) as CustomEntryCategory[]).map((cat) => (
                        <option key={cat} value={cat}>
                          {isEn ? CATEGORY_LABELS[cat].en : CATEGORY_LABELS[cat].bn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="entry-title-bn" className="block text-xs font-medium text-[#57534E] dark:text-[#9BAAC4] mb-1">
                      {isEn ? 'Title (Bangla)' : 'শিরোনাম (বাংলা) *'}
                    </label>
                    <input
                      id="entry-title-bn"
                      type="text"
                      value={entryForm.titleBn}
                      onChange={(e) => setEntryForm({ ...entryForm, titleBn: e.target.value })}
                      placeholder="যেমন: তাহাজ্জুদ নামাজের ফজিলত"
                      className="w-full px-3 py-2 text-sm bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9]"
                    />
                  </div>

                  <div>
                    <label htmlFor="entry-title-en" className="block text-xs font-medium text-[#57534E] dark:text-[#9BAAC4] mb-1">
                      {isEn ? 'Title (English)' : 'শিরোনাম (ইংরেজি - ঐচ্ছিক)'}
                    </label>
                    <input
                      id="entry-title-en"
                      type="text"
                      value={entryForm.titleEn}
                      onChange={(e) => setEntryForm({ ...entryForm, titleEn: e.target.value })}
                      placeholder="e.g., Virtues of Tahajjud Prayer"
                      className="w-full px-3 py-2 text-sm bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="entry-arabic" className="block text-xs font-medium text-[#57534E] dark:text-[#9BAAC4] mb-1">
                    {isEn ? 'Arabic Ayah / Dua (optional)' : 'আরবি আয়াত বা দুআ (ঐচ্ছিক)'}
                  </label>
                  <input
                    id="entry-arabic"
                    type="text"
                    dir="rtl"
                    value={entryForm.arabicText}
                    onChange={(e) => setEntryForm({ ...entryForm, arabicText: e.target.value })}
                    placeholder="আরবি পাঠ লিখুন (প্রয়োজনে)..."
                    className="w-full px-3 py-2 text-base font-arabic bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="entry-content-bn" className="block text-xs font-medium text-[#57534E] dark:text-[#9BAAC4] mb-1">
                      {isEn ? 'Detailed Content (Bangla)' : 'বিস্তারিত বিবরণ (বাংলা) *'}
                    </label>
                    <textarea
                      id="entry-content-bn"
                      rows={3}
                      value={entryForm.contentBn}
                      onChange={(e) => setEntryForm({ ...entryForm, contentBn: e.target.value })}
                      placeholder="বিস্তারিত আলোচনা, মাসআলা বা নসীহত লিখুন..."
                      className="w-full px-3 py-2 text-sm bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9]"
                    />
                  </div>

                  <div>
                    <label htmlFor="entry-content-en" className="block text-xs font-medium text-[#57534E] dark:text-[#9BAAC4] mb-1">
                      {isEn ? 'Detailed Content (English)' : 'বিস্তারিত বিবরণ (ইংরেজি - ঐচ্ছিক)'}
                    </label>
                    <textarea
                      id="entry-content-en"
                      rows={3}
                      value={entryForm.contentEn}
                      onChange={(e) => setEntryForm({ ...entryForm, contentEn: e.target.value })}
                      placeholder="English description or translation (optional)..."
                      className="w-full px-3 py-2 text-sm bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="entry-ref-bn" className="block text-xs font-medium text-[#57534E] dark:text-[#9BAAC4] mb-1">
                      {isEn ? 'Reference / Source (Bangla)' : 'দলিল / রেফারেন্স (যেমন: সহীহ বুখারী ১১২০)'}
                    </label>
                    <input
                      id="entry-ref-bn"
                      type="text"
                      value={entryForm.referenceBn}
                      onChange={(e) => setEntryForm({ ...entryForm, referenceBn: e.target.value })}
                      placeholder="কুরআন বা সহীহ হাদিসের সূত্র..."
                      className="w-full px-3 py-2 text-sm bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9]"
                    />
                  </div>
                  <div>
                    <label htmlFor="entry-ref-en" className="block text-xs font-medium text-[#57534E] dark:text-[#9BAAC4] mb-1">
                      {isEn ? 'Reference / Source (English)' : 'দলিল / রেফারেন্স (ইংরেজি - ঐচ্ছিক)'}
                    </label>
                    <input
                      id="entry-ref-en"
                      type="text"
                      value={entryForm.referenceEn}
                      onChange={(e) => setEntryForm({ ...entryForm, referenceEn: e.target.value })}
                      placeholder="e.g., Sahih al-Bukhari 1120"
                      className="w-full px-3 py-2 text-sm bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#14532D] dark:bg-[#34D399] text-white dark:text-[#080E1A] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>
                      {editingId
                        ? isEn
                          ? 'Update Entry'
                          : 'আপডেট সংরক্ষণ করুন'
                        : isEn
                          ? 'Publish New Entry'
                          : 'সাইটে যুক্ত করুন'}
                    </span>
                  </button>

                  {entryFeedback && (
                    <span className="text-xs font-medium text-[#14532D] dark:text-[#34D399]">
                      {entryFeedback}
                    </span>
                  )}
                </div>
              </form>

              {/* List of Added Entries with Edit / Delete buttons */}
              {customEntries.length > 0 && (
                <div className="pt-5 border-t border-[#E3DCCB] dark:border-[#1F3254] space-y-3">
                  <div className="text-xs font-semibold text-[#8B5E2A] dark:text-[#D4AF6A]">
                    {isEn
                      ? `Published Custom Entries (${customEntries.length})`
                      : `যুক্তকৃত তথ্যসমূহ (${toLocalizedDigits(customEntries.length, lang)})`}
                  </div>
                  <div className="space-y-2.5">
                    {customEntries.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="text-[11px] text-[#8B5E2A] dark:text-[#D4AF6A]">
                            {isEn
                              ? CATEGORY_LABELS[item.category].en
                              : CATEGORY_LABELS[item.category].bn}{' '}
                            · {item.updatedAt}
                          </div>
                          <div className="text-sm font-semibold text-[#1C1917] dark:text-[#EDF2F9] truncate">
                            {isEn ? item.titleEn : item.titleBn}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditEntry(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md border border-[#E3DCCB] dark:border-[#1F3254] text-[#14532D] dark:text-[#34D399] hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>{isEn ? 'Edit' : 'এডিট'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteEntry(item.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md border border-[#E3DCCB] dark:border-[#1F3254] text-[#9A3412] dark:text-[#FDBA74] hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>{isEn ? 'Delete' : 'মুছুন'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Part B: Editable Site Configuration */}
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="admin-notice-bn" className="block text-xs font-medium text-[#57534E] dark:text-[#9BAAC4] mb-1.5">
                    {isEn ? 'Admin Announcement Banner (Bangla)' : 'হোম পেজ নোটিশ / ঘোষণা (বাংলা)'}
                  </label>
                  <input
                    id="admin-notice-bn"
                    type="text"
                    value={draftConfig.noticeBn}
                    onChange={(e) => setDraftConfig({ ...draftConfig, noticeBn: e.target.value })}
                    placeholder="যেমন: প্রতি শুক্রবার বাদ আসর কুরআন তাফসীর প্রকাশিত হয়।"
                    className="w-full px-3 py-2 text-sm bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] dark:focus-visible:ring-[#34D399]"
                  />
                </div>

                <div>
                  <label htmlFor="admin-notice-en" className="block text-xs font-medium text-[#57534E] dark:text-[#9BAAC4] mb-1.5">
                    {isEn ? 'Admin Announcement Banner (English)' : 'হোম পেজ নোটিশ / ঘোষণা (ইংরেজি)'}
                  </label>
                  <input
                    id="admin-notice-en"
                    type="text"
                    value={draftConfig.noticeEn}
                    onChange={(e) => setDraftConfig({ ...draftConfig, noticeEn: e.target.value })}
                    placeholder="e.g., Weekly Tafsir lecture updates on Ynanx Islamic Channel."
                    className="w-full px-3 py-2 text-sm bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] dark:focus-visible:ring-[#34D399]"
                  />
                </div>

                <div>
                  <label htmlFor="admin-spotlight-surah" className="block text-xs font-medium text-[#57534E] dark:text-[#9BAAC4] mb-1.5">
                    {isEn ? 'Spotlight Surah on Home' : 'হোম পেজে স্পটলাইট সূরা নির্বাচন'}
                  </label>
                  <select
                    id="admin-spotlight-surah"
                    value={draftConfig.spotlightSurah}
                    onChange={(e) =>
                      setDraftConfig({ ...draftConfig, spotlightSurah: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-sm bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9]"
                  >
                    {SURAH_INDEX_114.map((s) => (
                      <option key={s.number} value={s.number} className="bg-[#FCFBF7] dark:bg-[#0E1729]">
                        {s.number}. {isEn ? s.nameEn : s.nameBn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="admin-new-pin" className="block text-xs font-medium text-[#57534E] dark:text-[#9BAAC4] mb-1.5">
                    {isEn ? 'Change Admin PIN (optional, 4+ chars)' : 'নতুন এডমিন পিন সেট করুন (ঐচ্ছিক, ৪+ অক্ষর)'}
                  </label>
                  <input
                    id="admin-new-pin"
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder={isEn ? 'Leave empty to keep current PIN' : 'পরিবর্তন না চাইলে খালি রাখুন'}
                    className="w-full px-3 py-2 text-sm bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs text-[#1C1917] dark:text-[#EDF2F9]">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draftConfig.showFirstRevelation}
                    onChange={(e) =>
                      setDraftConfig({ ...draftConfig, showFirstRevelation: e.target.checked })
                    }
                    className="rounded border-[#E3DCCB]"
                  />
                  <span>
                    {isEn
                      ? 'Show First Revelation (Surah Al-Alaq) on Home'
                      : 'হোম পেজে প্রথম ওহী (সূরা আল-আলাক) প্রদর্শন করুন'}
                  </span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draftConfig.showEcosystem}
                    onChange={(e) =>
                      setDraftConfig({ ...draftConfig, showEcosystem: e.target.checked })
                    }
                    className="rounded border-[#E3DCCB]"
                  />
                  <span>
                    {isEn
                      ? 'Show ynanx.com & Black Box Ecosystem Strip'
                      : 'ynanx.com ও ব্ল্যাক বক্স ইকোসিস্টেম সেকশন দেখান'}
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#E3DCCB] dark:border-[#1F3254] flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSaveConfig}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#14532D] dark:bg-[#34D399] text-white dark:text-[#080E1A] cursor-pointer"
                  >
                    {savedFeedback ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>
                      {savedFeedback
                        ? isEn
                          ? 'Saved!'
                          : 'সংরক্ষিত হয়েছে!'
                        : isEn
                          ? 'Save Admin Settings'
                          : 'সেটিংস সংরক্ষণ করুন'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetConfig}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-[#E3DCCB] dark:border-[#1F3254] text-[#57534E] dark:text-[#9BAAC4] hover:text-[#1C1917] dark:hover:text-[#EDF2F9] cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Reset Defaults' : 'ডিফল্ট রিসেট'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json"
                    onChange={importBackup}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-[#E3DCCB] dark:border-[#1F3254] text-[#8B5E2A] dark:text-[#D4AF6A] hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Import Backup' : 'ব্যাকআপ ইম্পোর্ট'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={exportBackup}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-[#E3DCCB] dark:border-[#1F3254] text-[#14532D] dark:text-[#34D399] hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Export Backup (JSON)' : 'ডেটা ব্যাকআপ ডাউনলোড'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
