import { useMemo, useState } from 'react';
import {
  BookOpen,
  Calculator,
  CheckCircle2,
  Circle,
  HeartHandshake,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { DAILY_PRACTICES, FIVE_PILLARS, PracticeCategory } from '../data/islamicKnowledge';
import {
  DAILY_PRACTICES_EN,
  FIVE_PILLARS_EN,
  toLocalizedDigits,
} from '../data/islamicKnowledgeEn';
import { toBengaliDigits } from '../data/surahNamesBn';
import {
  SALAH_HADITH_REFS,
  SALAH_QURAN_VERSES,
  TASBIH_PRESETS,
  VIRTUOUS_DEEDS_GUIDE,
} from '../data/worshipExpanded';
import { AppLang } from '../types/language';

type WorshipTab = 'daily' | 'tasbih' | 'salah-proofs' | 'deeds' | 'pillars';

export function WorshipAndPillars({
  lang = 'bn',
  initialTab = 'daily',
}: {
  lang?: AppLang;
  initialTab?: WorshipTab;
}) {
  const isEn = lang === 'en';
  const [activeTab, setActiveTab] = useState<WorshipTab>(initialTab);
  const [practiceFilter, setPracticeFilter] = useState<'all' | PracticeCategory>('all');
  const [selectedPillarId, setSelectedPillarId] = useState<string>(FIVE_PILLARS[0].id);

  // Daily Amal Checklist
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ihsaniyah_daily_amal');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Digital Tasbih Counter State
  const [selectedTasbihId, setSelectedTasbihId] = useState<string>(TASBIH_PRESETS[0].id);
  const [customTasbihText, setCustomTasbihText] = useState<string>('');
  const [tasbihTarget, setTasbihTarget] = useState<number>(TASBIH_PRESETS[0].defaultTarget);
  const [tasbihCount, setTasbihCount] = useState<number>(0);
  const [tasbihRounds, setTasbihRounds] = useState<number>(0);
  const [tasbihLifetimeTotal, setTasbihLifetimeTotal] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('ihsaniyah_tasbih_total') || '0') || 0;
    } catch {
      return 0;
    }
  });

  // Zakat Calculator state
  const [cash, setCash] = useState<string>('');
  const [goldSilver, setGoldSilver] = useState<string>('');
  const [businessAssets, setBusinessAssets] = useState<string>('');
  const [debts, setDebts] = useState<string>('');
  const [nisabThreshold, setNisabThreshold] = useState<string>('115000');

  const toggleCompleted = (id: string) => {
    setCompletedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('ihsaniyah_daily_amal', JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const resetChecklist = () => {
    setCompletedIds([]);
    try {
      localStorage.removeItem('ihsaniyah_daily_amal');
    } catch {
      // ignore
    }
  };

  const activeTasbih = useMemo(
    () => TASBIH_PRESETS.find((t) => t.id === selectedTasbihId) || TASBIH_PRESETS[0],
    [selectedTasbihId]
  );

  const selectTasbihPreset = (id: string) => {
    setSelectedTasbihId(id);
    const preset = TASBIH_PRESETS.find((t) => t.id === id);
    if (preset) {
      setTasbihTarget(preset.defaultTarget);
    }
    setTasbihCount(0);
    setTasbihRounds(0);
  };

  const incrementTasbih = () => {
    setTasbihCount((prev) => {
      const next = prev + 1;
      if (tasbihTarget > 0 && next >= tasbihTarget) {
        setTasbihRounds((r) => r + 1);
        return 0;
      }
      return next;
    });
    setTasbihLifetimeTotal((prev) => {
      const updated = prev + 1;
      try {
        localStorage.setItem('ihsaniyah_tasbih_total', String(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const decrementTasbih = () => {
    if (tasbihCount <= 0) return;
    setTasbihCount((prev) => Math.max(0, prev - 1));
    setTasbihLifetimeTotal((prev) => {
      const updated = Math.max(0, prev - 1);
      try {
        localStorage.setItem('ihsaniyah_tasbih_total', String(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const resetCurrentTasbih = () => {
    setTasbihCount(0);
    setTasbihRounds(0);
  };

  const filteredPractices = useMemo(() => {
    if (practiceFilter === 'all') return DAILY_PRACTICES;
    return DAILY_PRACTICES.filter((item) => item.category === practiceFilter);
  }, [practiceFilter]);

  const activePillar = useMemo(
    () => FIVE_PILLARS.find((p) => p.id === selectedPillarId) || FIVE_PILLARS[0],
    [selectedPillarId]
  );
  const activePillarEn = FIVE_PILLARS_EN[activePillar.id];

  const zakatCalc = useMemo(() => {
    const totalAssets =
      (Number(cash) || 0) + (Number(goldSilver) || 0) + (Number(businessAssets) || 0);
    const totalDebts = Number(debts) || 0;
    const netWealth = Math.max(0, totalAssets - totalDebts);
    const nisab = Number(nisabThreshold) || 0;
    const isObligatory = netWealth > 0 && netWealth >= nisab;
    const payable = isObligatory ? Math.round(netWealth * 0.025) : 0;
    return { totalAssets, totalDebts, netWealth, nisab, isObligatory, payable };
  }, [cash, goldSilver, businessAssets, debts, nisabThreshold]);

  const tabs: Array<{ id: WorshipTab; labelBn: string; labelEn: string }> = [
    { id: 'daily', labelBn: 'দৈনিক ফরজ-ওয়াজিব-সুন্নত', labelEn: 'Daily Practices' },
    { id: 'tasbih', labelBn: 'তসবিহ পাঠ ও গণনা', labelEn: 'Tasbih Counter' },
    { id: 'salah-proofs', labelBn: 'কুরআন ও হাদিসে সালাত', labelEn: 'Salah in Quran & Hadith' },
    { id: 'deeds', labelBn: 'জানাজা, ঈদ, দান ও কবর জিয়ারত', labelEn: 'Deeds, Eid & Graves' },
    { id: 'pillars', labelBn: 'পঞ্চস্তম্ভ ও যাকাত হিসাব', labelEn: '5 Pillars & Zakat' },
  ];

  const tasbihProgressPct =
    tasbihTarget > 0 ? Math.min(100, Math.round((tasbihCount / tasbihTarget) * 100)) : 100;

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Section Masthead */}
      <div className="pb-6 border-b border-[#E3DCCB] dark:border-[#1F3254] flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-wider text-[#8B5E2A] dark:text-[#D4AF6A] mb-2">
            {isEn
              ? 'Worship, Salah Evidences, Righteous Deeds & Tasbih'
              : 'ইবাদত, সালাতের দলিল, পুণ্যময় আমল ও তসবিহ'}
          </p>
          <h2 className="text-3xl sm:text-4xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9] text-balance">
            {isEn
              ? 'Complete Guide to Islamic Worship & Daily Righteousness'
              : 'ইসলামিক ইবাদত, পুণ্য অর্জন ও দৈনিক আমলের পূর্ণাঙ্গ নির্দেশিকা'}
          </h2>
        </div>

        <p className="text-sm text-[#57534E] dark:text-[#9BAAC4] max-w-md leading-relaxed">
          {isEn
            ? 'Daily obligations, interactive Tasbih counter, Quranic mentions & Hadith references on Salah, Janazah, Eid, Charity, Visiting Graves, and the Five Pillars.'
            : 'দৈনিক ফরজ-ওয়াজিব-সুন্নত, ডিজিটাল তসবিহ গণনা, কুরআন ও হাদিসে সালাত, জানাজা-ঈদ-জুমা, দান-আমানত, কবর জিয়ারত ও পঞ্চস্তম্ভ।'}
        </p>
      </div>

      {/* Organized Section Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#EFEAE0] dark:bg-[#16233B] rounded-xl w-fit">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#FCFBF7] dark:bg-[#0E1729] text-[#14532D] dark:text-[#34D399] shadow-xs'
                  : 'text-[#57534E] dark:text-[#9BAAC4] hover:text-[#1C1917] dark:hover:text-[#EDF2F9]'
              }`}
            >
              {isEn ? tab.labelEn : tab.labelBn}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Daily Farz, Wajib, Sunnah, Nafl */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EFEAE0] dark:bg-[#16233B] rounded-lg w-fit">
              {(
                [
                  { id: 'all', label: isEn ? 'All Practices' : 'সকল আমল' },
                  { id: 'farz', label: isEn ? 'Farz' : 'ফরজ' },
                  { id: 'wajib', label: isEn ? 'Wajib' : 'ওয়াজিব' },
                  { id: 'sunnah', label: isEn ? 'Sunnah' : 'সুন্নত' },
                  { id: 'nafl', label: isEn ? 'Nafl' : 'নফল' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPracticeFilter(tab.id)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    practiceFilter === tab.id
                      ? 'bg-[#FCFBF7] dark:bg-[#0E1729] text-[#14532D] dark:text-[#34D399] shadow-xs'
                      : 'text-[#57534E] dark:text-[#9BAAC4] hover:text-[#1C1917] dark:hover:text-[#EDF2F9]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs text-[#57534E] dark:text-[#9BAAC4] tabular-nums">
              <span>
                {isEn
                  ? `Completed Today: ${completedIds.length} / ${DAILY_PRACTICES.length}`
                  : `আজকের সম্পন্ন আমল: ${toBengaliDigits(completedIds.length)} / ${toBengaliDigits(DAILY_PRACTICES.length)}`}
              </span>
              {completedIds.length > 0 && (
                <button
                  type="button"
                  onClick={resetChecklist}
                  className="inline-flex items-center gap-1 text-[#8B5E2A] dark:text-[#D4AF6A] hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  {isEn ? 'Reset' : 'রিসেট'}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPractices.map((item) => {
              const done = completedIds.includes(item.id);
              const en = DAILY_PRACTICES_EN[item.id];
              return (
                <article
                  key={item.id}
                  className={`rounded-xl p-5 sm:p-6 border transition-colors ${
                    done
                      ? 'bg-[#EFEAE0]/70 dark:bg-[#16233B] border-[#14532D]/50 dark:border-[#34D399]/50'
                      : 'bg-[#FCFBF7] dark:bg-[#0E1729] border-[#E3DCCB] dark:border-[#1F3254]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A]">
                      {isEn && en ? `${en.categoryEn} · ${en.timingEn}` : `${item.categoryBn} · ${item.timingBn}`}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleCompleted(item.id)}
                      aria-label={
                        isEn
                          ? done
                            ? 'Mark incomplete'
                            : 'Mark completed'
                          : done
                            ? 'অসম্পন্ন হিসেবে চিহ্নিত করুন'
                            : 'সম্পন্ন হিসেবে চিহ্নিত করুন'
                      }
                      className="inline-flex items-center gap-1.5 text-xs text-[#57534E] dark:text-[#9BAAC4] hover:text-[#14532D] dark:hover:text-[#34D399] shrink-0 cursor-pointer"
                    >
                      {done ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#14532D] dark:text-[#34D399]" />
                          <span className="text-[#14532D] dark:text-[#34D399] font-medium">
                            {isEn ? 'Done' : 'সম্পন্ন'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4" />
                          <span>{isEn ? 'Mark Done' : 'চিহ্নিত করুন'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="text-lg font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9] mb-2">
                    {isEn && en ? en.titleEn : item.titleBn}
                  </h3>

                  {item.arabicDua && (
                    <p className="font-arabic text-xl text-right text-[#14532D] dark:text-[#6EE7B7] py-2">
                      {item.arabicDua}
                    </p>
                  )}

                  <p className="text-sm text-[#57534E] dark:text-[#9BAAC4] leading-relaxed mb-3">
                    {isEn && en ? en.detailEn : item.detailBn}
                  </p>

                  <div className="pt-3 border-t border-[#E3DCCB]/60 dark:border-[#1F3254]/60 text-xs text-[#57534E] dark:text-[#9BAAC4]">
                    {isEn && en ? `Source: ${en.referenceEn}` : `সূত্র: ${item.reference}`}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Interactive Digital Tasbih Counter */}
      {activeTab === 'tasbih' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Presets selector */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-semibold text-[#8B5E2A] dark:text-[#D4AF6A]">
              {isEn ? 'Select Authentic Dhikr or Tasbih' : 'মাসনূন তসবিহ ও যিকির নির্বাচন করুন'}
            </div>
            <div className="space-y-2.5">
              {TASBIH_PRESETS.map((preset) => {
                const active = selectedTasbihId === preset.id && !customTasbihText.trim();
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setCustomTasbihText('');
                      selectTasbihPreset(preset.id);
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#EAF4ED] dark:bg-[#122C3D] border-[#14532D] dark:border-[#34D399]'
                        : 'bg-[#FCFBF7] dark:bg-[#0E1729] border-[#E3DCCB] dark:border-[#1F3254] hover:border-[#8B5E2A]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="text-sm font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                        {isEn ? preset.labelEn : preset.labelBn}
                      </span>
                      <span className="text-xs tabular-nums text-[#8B5E2A] dark:text-[#D4AF6A]">
                        {toLocalizedDigits(preset.defaultTarget, lang)}x
                      </span>
                    </div>
                    <p className="font-arabic text-lg text-right text-[#14532D] dark:text-[#6EE7B7]">
                      {preset.arabic}
                    </p>
                  </button>
                );
              })}

              {/* Custom Dhikr Input */}
              <div className="p-4 rounded-xl bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] space-y-2">
                <label htmlFor="custom-tasbih-input" className="block text-xs font-medium text-[#57534E] dark:text-[#9BAAC4]">
                  {isEn ? 'Or type your own Dhikr / Salawat:' : 'অথবা নিজের পছন্দের যিকির / দরূদ লিখুন:'}
                </label>
                <input
                  id="custom-tasbih-input"
                  type="text"
                  value={customTasbihText}
                  onChange={(e) => setCustomTasbihText(e.target.value)}
                  placeholder={isEn ? 'e.g., Ya Hayyu Ya Qayyum' : 'যেমন: ইয়া হাইয়্যু ইয়া কাইয়্যুম'}
                  className="w-full px-3 py-2 text-sm bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] dark:focus-visible:ring-[#34D399]"
                />
              </div>
            </div>
          </div>

          {/* Right: Tactile Counter Pad */}
          <div className="lg:col-span-7 bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E3DCCB] dark:border-[#1F3254]">
              <div>
                <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A]">
                  {isEn ? 'Digital Tasbih Counter' : 'ডিজিটাল তসবিহ গণনাযন্ত্র'}
                </div>
                <h3 className="text-xl sm:text-2xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                  {customTasbihText.trim()
                    ? customTasbihText.trim()
                    : isEn
                      ? activeTasbih.labelEn
                      : activeTasbih.labelBn}
                </h3>
              </div>

              <div className="text-right tabular-nums">
                <div className="text-xs text-[#57534E] dark:text-[#9BAAC4]">
                  {isEn ? 'Lifetime Count' : 'মোট সংরক্ষিত গণনা'}
                </div>
                <div className="text-lg font-editorial font-bold text-[#14532D] dark:text-[#34D399]">
                  {toLocalizedDigits(tasbihLifetimeTotal, lang)}
                </div>
              </div>
            </div>

            {!customTasbihText.trim() && (
              <div className="p-4 rounded-xl bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] space-y-2 text-center">
                <p className="font-arabic text-2xl sm:text-3xl leading-[2.1] text-[#14532D] dark:text-[#6EE7B7]">
                  {activeTasbih.arabic}
                </p>
                <p className="text-sm font-medium text-[#1C1917] dark:text-[#EDF2F9]">
                  {isEn ? activeTasbih.pronunciationEn : activeTasbih.pronunciationBn}
                </p>
                <p className="text-xs text-[#57534E] dark:text-[#9BAAC4]">
                  {isEn ? activeTasbih.meaningEn : activeTasbih.meaningBn}
                </p>
                <p className="text-[11px] text-[#8B5E2A] dark:text-[#D4AF6A] pt-1">
                  {isEn ? activeTasbih.virtueEn : activeTasbih.virtueBn}
                </p>
              </div>
            )}

            {/* Target Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[#57534E] dark:text-[#9BAAC4]">
                {isEn ? 'Target per round:' : 'প্রতি রাউন্ডের লক্ষ্য:'}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {[33, 34, 99, 100, 0].map((targetVal) => (
                  <button
                    key={targetVal}
                    type="button"
                    onClick={() => {
                      setTasbihTarget(targetVal);
                      setTasbihCount(0);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors cursor-pointer tabular-nums ${
                      tasbihTarget === targetVal
                        ? 'bg-[#14532D] dark:bg-[#34D399] border-[#14532D] dark:border-[#34D399] text-white dark:text-[#080E1A]'
                        : 'border-[#E3DCCB] dark:border-[#1F3254] text-[#57534E] dark:text-[#9BAAC4] hover:text-[#1C1917] dark:hover:text-[#EDF2F9]'
                    }`}
                  >
                    {targetVal === 0
                      ? isEn
                        ? 'Unlimited (∞)'
                        : 'অসীম (∞)'
                      : toLocalizedDigits(targetVal, lang)}
                  </button>
                ))}
              </div>
            </div>

            {/* Big Interactive Tap Pad */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={incrementTasbih}
                className="w-full py-10 px-6 rounded-2xl bg-[#EAF4ED] dark:bg-[#112B3B] border-2 border-[#14532D]/40 dark:border-[#34D399]/50 hover:border-[#14532D] dark:hover:border-[#34D399] active:scale-[0.99] transition-all flex flex-col items-center justify-center gap-2 cursor-pointer select-none"
              >
                <span className="text-xs font-medium text-[#14532D] dark:text-[#6EE7B7] inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isEn ? 'Tap Here to Count Dhikr' : 'তসবিহ গুনতে এখানে স্পর্শ / ক্লিক করুন'}
                </span>
                <span className="text-6xl sm:text-7xl font-editorial font-bold tabular-nums text-[#14532D] dark:text-[#34D399]">
                  {toLocalizedDigits(tasbihCount, lang)}
                </span>
                <span className="text-xs text-[#57534E] dark:text-[#D1FAE5] tabular-nums">
                  {tasbihTarget > 0
                    ? isEn
                      ? `Target: ${tasbihTarget} · Completed Rounds: ${tasbihRounds}`
                      : `লক্ষ্য: ${toBengaliDigits(tasbihTarget)} · পূর্ণ রাউন্ড: ${toBengaliDigits(tasbihRounds)}`
                    : isEn
                      ? 'Unlimited Mode'
                      : 'অসীম গণনা মোড'}
                </span>
              </button>

              {tasbihTarget > 0 && (
                <div className="w-full h-2 rounded-full bg-[#EFEAE0] dark:bg-[#16233B] overflow-hidden">
                  <div
                    className="h-full bg-[#14532D] dark:bg-[#34D399] transition-all duration-200"
                    style={{ width: `${tasbihProgressPct}%` }}
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={incrementTasbih}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#14532D] dark:bg-[#34D399] text-white dark:text-[#080E1A] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isEn ? '+1 Count' : '+১ গণনা'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={decrementTasbih}
                    disabled={tasbihCount === 0}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#E3DCCB] dark:border-[#1F3254] text-[#57534E] dark:text-[#9BAAC4] disabled:opacity-40 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>-১</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={resetCurrentTasbih}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-[#E3DCCB] dark:border-[#1F3254] text-[#8B5E2A] dark:text-[#D4AF6A] hover:bg-[#EFEAE0] dark:hover:bg-[#16233B] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Reset Round' : 'রাউন্ড রিসেট'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Salah Mentions in Quran & Hadith References Only */}
      {activeTab === 'salah-proofs' && (
        <div className="space-y-10">
          {/* Quantitative Quran Summary Card */}
          <div className="bg-[#EAF4ED] dark:bg-[#122C3D] border border-[#C6E0CD] dark:border-[#245369] rounded-xl p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-2">
                <div className="text-xs font-semibold text-[#14532D] dark:text-[#6EE7B7]">
                  {isEn
                    ? 'Quranic Frequency of Salah (Prayer)'
                    : 'পবিত্র আল-কুরআনে “সালাত (নামাজ)”-এর উল্লেখ সংখ্যা'}
                </div>
                <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-[#132A1C] dark:text-[#ECFDF5]">
                  {isEn
                    ? '67 Direct Mentions of As-Salah · 99 Root Occurrences (ص-ل-و)'
                    : 'সরাসরি “আস-সালাত” শব্দে ৬৭ বার এবং “ص-ل-و” মূলে মোট ৯৯ বার উল্লেখ'}
                </h3>
                <p className="text-sm text-[#1F3D2B] dark:text-[#D1FAE5] leading-relaxed">
                  {isEn
                    ? 'In the Holy Quran, the explicit noun As-Salah (الصَّلَاة / صَلَوَات) appears 67 times, while the full Arabic root (ص-ل-و — including commands to pray and Allah sending blessings) appears 99 times across Makki and Madani Surahs.'
                    : 'পবিত্র কুরআনুল কারীমে “সালাত / সালাওয়াত” (الصَّلَاة) শব্দটি সুস্পষ্টভাবে ৬৭ বার এবং ক্রিয়াপদ ও বহুবচনসহ (ص-ل-و ধাতু থেকে) সর্বমোট ৯৯ বার উল্লিখিত হয়েছে—যা ইসলামের ইবাদতসমূহে নামাজের সর্বোচ্চ মর্যাদার প্রমাণ।'}
                </p>
              </div>

              <div className="lg:col-span-4 grid grid-cols-2 gap-3 text-center">
                <div className="p-4 rounded-xl bg-[#FCFBF7] dark:bg-[#080E1A] border border-[#C6E0CD] dark:border-[#245369]">
                  <div className="text-3xl font-editorial font-bold tabular-nums text-[#14532D] dark:text-[#34D399]">
                    {toLocalizedDigits(67, lang)}
                  </div>
                  <div className="text-xs text-[#57534E] dark:text-[#9BAAC4] mt-1">
                    {isEn ? 'Explicit "Salah"' : 'সরাসরি “সালাত” উল্লেখ'}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#FCFBF7] dark:bg-[#080E1A] border border-[#C6E0CD] dark:border-[#245369]">
                  <div className="text-3xl font-editorial font-bold tabular-nums text-[#8B5E2A] dark:text-[#D4AF6A]">
                    {toLocalizedDigits(99, lang)}
                  </div>
                  <div className="text-xs text-[#57534E] dark:text-[#9BAAC4] mt-1">
                    {isEn ? 'Total Root (ص-ل-و)' : 'সর্বমোট ধাতুগত উল্লেখ'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Quranic Ayahs on Salah */}
          <div>
            <div className="mb-5 pb-3 border-b border-[#E3DCCB] dark:border-[#1F3254] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#14532D] dark:text-[#34D399]" />
              <h3 className="text-xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                {isEn
                  ? 'Key Quranic Verses Commanding & Explaining Salah'
                  : 'সালাত সম্পর্কিত আল-কুরআনের প্রধান আয়াতসমূহ'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SALAH_QURAN_VERSES.map((verse) => (
                <article
                  key={verse.surahAyah}
                  className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#8B5E2A] dark:text-[#D4AF6A]">
                    <span>
                      {isEn
                        ? `Surah ${verse.surahNameEn}`
                        : `সূরা ${verse.surahNameBn}`}
                    </span>
                    <span className="tabular-nums text-[#14532D] dark:text-[#34D399]">
                      {toLocalizedDigits(verse.surahAyah, lang)}
                    </span>
                  </div>
                  <p className="font-arabic text-xl leading-[2.1] text-right text-[#1C1917] dark:text-[#EDF2F9]">
                    {verse.arabic}
                  </p>
                  <p className="text-sm text-[#57534E] dark:text-[#9BAAC4] leading-relaxed">
                    {isEn ? verse.meaningEn : verse.meaningBn}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* Salah Hadith References Only (No duplicate full Hadith texts) */}
          <div>
            <div className="mb-5 pb-3 border-b border-[#E3DCCB] dark:border-[#1F3254]">
              <h3 className="text-xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9] mb-1">
                {isEn
                  ? 'Sahih Hadith References on Salah (Index)'
                  : 'সালাত সংক্রান্ত সহীহ হাদিসসমূহের রেফারেন্স তালিকা'}
              </h3>
              <p className="text-xs text-[#57534E] dark:text-[#9BAAC4]">
                {isEn
                  ? 'Concise reference numbers pointing to the full texts available in the Al-Hadith archive.'
                  : 'পূর্ণ হাদিসসমূহ আল-হাদিস বিভাগে সংযুক্ত থাকায় এখানে সহজ অনুসন্ধানের জন্য কেবল বিশুদ্ধ রেফারেন্সসমূহ দেওয়া হলো।'}
              </p>
            </div>

            <div className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl divide-y divide-[#E3DCCB] dark:divide-[#1F3254]">
              {SALAH_HADITH_REFS.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-2"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-semibold tabular-nums text-[#8B5E2A] dark:text-[#D4AF6A] mt-0.5">
                      {toLocalizedDigits(idx + 1, lang)}.
                    </span>
                    <span className="text-sm font-medium text-[#1C1917] dark:text-[#EDF2F9]">
                      {isEn ? item.topicEn : item.topicBn}
                    </span>
                  </div>
                  <div className="text-xs font-semibold tabular-nums text-[#14532D] dark:text-[#34D399] pl-6 md:pl-0 shrink-0">
                    {isEn ? item.refsEn : item.refsBn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Farz-e-Kifayah, Eid, Jumuah, Charity, Ethics, Sawm/Zakat/Hajj & Visiting Graves */}
      {activeTab === 'deeds' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs text-[#8B5E2A] dark:text-[#D4AF6A]">
            <HeartHandshake className="w-4 h-4" />
            <span>
              {isEn
                ? 'Pathways to Reward (Sawab) & Essential Communal/Personal Rulings'
                : 'মুমিনের সওয়াব অর্জনের পাথেয় · ফরজে কেফায়া, দুই ঈদ, জুমা, সাদাকা, আখলাক, রোজা-যাকাত-হজ্জ ও কবর জিয়ারত'}
            </span>
          </div>

          <div className="space-y-6">
            {VIRTUOUS_DEEDS_GUIDE.map((guide, idx) => (
              <article
                key={guide.id}
                className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-6 sm:p-7 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E3DCCB] dark:border-[#1F3254]">
                  <span className="text-xs font-semibold text-[#8B5E2A] dark:text-[#D4AF6A] tabular-nums">
                    {toLocalizedDigits(idx + 1, lang)}. {isEn ? guide.tagEn : guide.tagBn}
                  </span>
                  <span className="text-xs text-[#57534E] dark:text-[#9BAAC4]">
                    {isEn ? guide.refEn : guide.refBn}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                  {isEn ? guide.titleEn : guide.titleBn}
                </h3>

                <p className="text-sm sm:text-[15px] text-[#57534E] dark:text-[#9BAAC4] leading-relaxed">
                  {isEn ? guide.summaryEn : guide.summaryBn}
                </p>

                {guide.arabicText && (
                  <div className="p-4 sm:p-5 rounded-xl bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] space-y-2">
                    <p className="font-arabic text-xl sm:text-2xl leading-[2.1] text-right text-[#14532D] dark:text-[#6EE7B7]">
                      {guide.arabicText}
                    </p>
                    {(isEn ? guide.arabicMeaningEn : guide.arabicMeaningBn) && (
                      <p className="text-xs sm:text-sm text-[#1C1917] dark:text-[#EDF2F9] leading-relaxed">
                        {isEn ? guide.arabicMeaningEn : guide.arabicMeaningBn}
                      </p>
                    )}
                  </div>
                )}

                <ul className="space-y-2 pt-1">
                  {(isEn ? guide.pointsEn : guide.pointsBn).map((pt, pIdx) => (
                    <li
                      key={pIdx}
                      className="flex items-start gap-2.5 text-sm text-[#1C1917] dark:text-[#EDF2F9] leading-relaxed"
                    >
                      <span className="text-xs font-bold text-[#14532D] dark:text-[#34D399] tabular-nums mt-0.5">
                        {toLocalizedDigits(pIdx + 1, lang)}.
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Five Pillars + Practical Zakat Calculator */}
      {activeTab === 'pillars' && (
        <div className="space-y-12">
          <div>
            <div className="mb-6">
              <p className="text-xs tracking-wider text-[#8B5E2A] dark:text-[#D4AF6A] mb-1.5">
                {isEn
                  ? 'In the Light of Quran & Sahih Hadith · Foundations of Islam'
                  : 'কুরআন ও সহীহ হাদিসের আলোকে · ইসলামের মৌলিক ভিত্তি'}
              </p>
              <h3 className="text-2xl sm:text-3xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                {isEn
                  ? 'Iman, Salah, Sawm, Zakat & Hajj Explained'
                  : 'ঈমান, নামাজ, রোজা, যাকাত ও হজ্জের বিস্তারিত ব্যাখ্যা'}
              </h3>
            </div>

            {/* Pillar Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              {FIVE_PILLARS.map((p) => {
                const active = p.id === selectedPillarId;
                const pEn = FIVE_PILLARS_EN[p.id];
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPillarId(p.id)}
                    className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#14532D] dark:bg-[#34D399] border-[#14532D] dark:border-[#34D399] text-white dark:text-[#080E1A]'
                        : 'bg-[#FCFBF7] dark:bg-[#0E1729] border-[#E3DCCB] dark:border-[#1F3254] text-[#1C1917] dark:text-[#EDF2F9] hover:bg-[#EFEAE0] dark:hover:bg-[#16233B]'
                    }`}
                  >
                    <div className={`text-xs tabular-nums mb-1 ${active ? 'opacity-80' : 'text-[#8B5E2A] dark:text-[#D4AF6A]'}`}>
                      {isEn && pEn ? `Pillar ${pEn.indexEn}` : `স্তম্ভ ${p.index}`}
                    </div>
                    <div className="text-base font-editorial font-semibold whitespace-nowrap truncate">
                      {isEn && pEn ? pEn.titleEn : p.titleBn}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Pillar Deep Dive */}
            <div className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#E3DCCB] dark:border-[#1F3254]">
                <div>
                  <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A] mb-1">
                    {isEn && activePillarEn
                      ? `Five Pillars of Islam · Chapter ${activePillarEn.indexEn}`
                      : `ইসলামের পঞ্চস্তম্ভ · অধ্যায় ${activePillar.index}`}
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                    {isEn && activePillarEn ? activePillarEn.titleEn : activePillar.titleBn}
                  </h4>
                </div>
                <div className="font-arabic text-2xl sm:text-3xl text-[#14532D] dark:text-[#6EE7B7]">
                  {activePillar.arabicTitle}
                </div>
              </div>

              <p className="font-editorial text-base leading-[1.85] text-[#1C1917] dark:text-[#EDF2F9] mb-8 max-w-3xl">
                {isEn && activePillarEn ? activePillarEn.summaryEn : activePillar.summaryBn}
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Quranic Evidence */}
                <div className="p-5 rounded-xl bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254]">
                  <div className="text-xs font-semibold text-[#14532D] dark:text-[#34D399] mb-3">
                    {isEn && activePillarEn
                      ? `Quranic Evidence · ${activePillarEn.quranRefEn}`
                      : `আল-কুরআনের দলিল · ${activePillar.quranRef}`}
                  </div>
                  <p className="font-arabic text-xl leading-[2.2] text-right text-[#1C1917] dark:text-[#EDF2F9] mb-3">
                    {activePillar.quranVerseAr}
                  </p>
                  <p className="text-sm leading-relaxed text-[#57534E] dark:text-[#9BAAC4]">
                    “{isEn && activePillarEn ? activePillarEn.quranVerseEn : activePillar.quranVerseBn}”
                  </p>
                </div>

                {/* Hadith Evidence */}
                <div className="p-5 rounded-xl bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[#8B5E2A] dark:text-[#D4AF6A] mb-3">
                      {isEn && activePillarEn
                        ? `Sahih Hadith Proof · ${activePillarEn.hadithRefEn}`
                        : `সহীহ হাদিসের প্রমাণ · ${activePillar.hadithRef}`}
                    </div>
                    <p className="font-editorial text-base leading-[1.85] text-[#1C1917] dark:text-[#EDF2F9]">
                      “{isEn && activePillarEn ? activePillarEn.hadithEn : activePillar.hadithBn}”
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E3DCCB]/60 dark:border-[#1F3254]/60 text-xs text-[#57534E] dark:text-[#9BAAC4]">
                    {isEn && activePillarEn
                      ? `Source: ${activePillarEn.hadithRefEn}`
                      : `উৎস: ${activePillar.hadithRef}`}
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-[#1C1917] dark:text-[#EDF2F9] mb-3">
                  {isEn ? 'Core Rulings & Essential Guidelines:' : 'মৌলিক বিধিবিধান ও প্রয়োজনীয় দিকনির্দেশনা:'}
                </h5>
                <ul className="space-y-2.5">
                  {(isEn && activePillarEn ? activePillarEn.keyRulesEn : activePillar.keyRulesBn).map((rule, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-[#57534E] dark:text-[#9BAAC4] leading-relaxed"
                    >
                      <span className="text-xs font-semibold text-[#14532D] dark:text-[#34D399] tabular-nums mt-0.5">
                        {toLocalizedDigits(i + 1, lang)}.
                      </span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Practical Zakat Calculator */}
          <div className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#E3DCCB] dark:border-[#1F3254]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#EFEAE0] dark:bg-[#16233B] flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-[#14532D] dark:text-[#34D399]" />
                </div>
                <div>
                  <h4 className="text-xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                    {isEn ? 'Instant Zakat Calculator' : 'তাৎক্ষণিক যাকাত হিসাব ক্যালকুলেটর'}
                  </h4>
                  <p className="text-xs text-[#57534E] dark:text-[#9BAAC4]">
                    {isEn
                      ? 'Calculate 2.5% Zakat on net surplus wealth held for one full lunar year'
                      : 'পূর্ণ এক চান্দ্র বছর মালিকানাধীন উদ্বৃত্ত সম্পদের ২.৫% হিসাব নির্ণয় করুন'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="zakat-cash" className="block text-xs font-medium text-[#57534E] dark:text-[#9BAAC4] mb-1.5">
                    {isEn ? 'Cash & Bank Savings' : 'নগদ অর্থ ও ব্যাংক জমা (টাকা)'}
                  </label>
                  <input
                    id="zakat-cash"
                    type="number"
                    min="0"
                    value={cash}
                    onChange={(e) => setCash(e.target.value)}
                    placeholder={isEn ? 'e.g. 200000' : 'যেমন: 200000'}
                    className="w-full px-3 py-2 text-sm tabular-nums bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] dark:focus-visible:ring-[#34D399]"
                  />
                </div>

                <div>
                  <label htmlFor="zakat-gold" className="block text-xs font-medium text-[#57534E] dark:text-[#9BAAC4] mb-1.5">
                    {isEn ? 'Gold & Silver Market Value' : 'স্বর্ণ ও রৌপ্যের বাজারমূল্য (টাকা)'}
                  </label>
                  <input
                    id="zakat-gold"
                    type="number"
                    min="0"
                    value={goldSilver}
                    onChange={(e) => setGoldSilver(e.target.value)}
                    placeholder={isEn ? 'e.g. 150000' : 'যেমন: 150000'}
                    className="w-full px-3 py-2 text-sm tabular-nums bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] dark:focus-visible:ring-[#34D399]"
                  />
                </div>

                <div>
                  <label htmlFor="zakat-biz" className="block text-xs font-medium text-[#57534E] dark:text-[#9BAAC4] mb-1.5">
                    {isEn ? 'Business Goods & Investments' : 'ব্যবসায়িক পণ্য ও বিনিয়োগ (টাকা)'}
                  </label>
                  <input
                    id="zakat-biz"
                    type="number"
                    min="0"
                    value={businessAssets}
                    onChange={(e) => setBusinessAssets(e.target.value)}
                    placeholder={isEn ? 'e.g. 100000' : 'যেমন: 100000'}
                    className="w-full px-3 py-2 text-sm tabular-nums bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] dark:focus-visible:ring-[#34D399]"
                  />
                </div>

                <div>
                  <label htmlFor="zakat-debt" className="block text-xs font-medium text-[#57534E] dark:text-[#9BAAC4] mb-1.5">
                    {isEn ? 'Deductible Debts & Liabilities (-)' : 'পরিশোধযোগ্য ঋণ বা দায় (-)'}
                  </label>
                  <input
                    id="zakat-debt"
                    type="number"
                    min="0"
                    value={debts}
                    onChange={(e) => setDebts(e.target.value)}
                    placeholder={isEn ? 'e.g. 50000' : 'যেমন: 50000'}
                    className="w-full px-3 py-2 text-sm tabular-nums bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] dark:focus-visible:ring-[#34D399]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="zakat-nisab" className="block text-xs font-medium text-[#57534E] dark:text-[#9BAAC4] mb-1.5">
                    {isEn
                      ? 'Current Silver Nisab Threshold (612.36g silver value — editable)'
                      : 'বর্তমান রৌপ্য নিসাব সীমা (৫২.৫ তোলা রৌপ্যের আনুমানিক মূল্য — পরিবর্তনযোগ্য)'}
                  </label>
                  <input
                    id="zakat-nisab"
                    type="number"
                    min="0"
                    value={nisabThreshold}
                    onChange={(e) => setNisabThreshold(e.target.value)}
                    className="w-full px-3 py-2 text-sm tabular-nums bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] dark:focus-visible:ring-[#34D399]"
                  />
                </div>
              </div>

              <div className="lg:col-span-5 p-6 rounded-xl bg-[#F7F4EC] dark:bg-[#080E1A] border border-[#E3DCCB] dark:border-[#1F3254] space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#57534E] dark:text-[#9BAAC4]">
                    {isEn ? 'Total Assets:' : 'মোট সম্পদ:'}
                  </span>
                  <span className="font-semibold tabular-nums text-[#1C1917] dark:text-[#EDF2F9]">
                    {isEn ? '' : '৳ '}
                    {toLocalizedDigits(zakatCalc.totalAssets.toLocaleString('en-US'), lang)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#57534E] dark:text-[#9BAAC4]">
                    {isEn ? 'Net Zakatable Wealth:' : 'ঋণ বাদে নিট সম্পদ:'}
                  </span>
                  <span className="font-semibold tabular-nums text-[#1C1917] dark:text-[#EDF2F9]">
                    {isEn ? '' : '৳ '}
                    {toLocalizedDigits(zakatCalc.netWealth.toLocaleString('en-US'), lang)}
                  </span>
                </div>
                <div className="pt-4 border-t border-[#E3DCCB] dark:border-[#1F3254]">
                  <div className="text-xs text-[#57534E] dark:text-[#9BAAC4] mb-1">
                    {zakatCalc.isObligatory
                      ? isEn
                        ? 'Nisab met — Your Payable Zakat (2.5%):'
                        : 'নিসাব পূর্ণ হওয়ায় আপনার প্রদেয় যাকাত (২.৫%):'
                      : isEn
                        ? 'Below Nisab threshold based on current entries'
                        : 'বর্তমান হিসাব অনুযায়ী নিসাব সীমা পূর্ণ হয়নি'}
                  </div>
                  <div className="text-3xl font-editorial font-bold tabular-nums text-[#14532D] dark:text-[#34D399]">
                    {isEn ? '' : '৳ '}
                    {toLocalizedDigits(zakatCalc.payable.toLocaleString('en-US'), lang)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
