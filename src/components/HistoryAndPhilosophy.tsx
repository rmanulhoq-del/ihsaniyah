import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import {
  KHULAFA_RASHIDEEN,
  MASAIL_QA,
  MUSLIM_SCIENTISTS,
  PROPHETS_BIO,
  SCHOLARS_AND_SAINTS,
  THOUGHT_ARTICLES,
} from '../data/islamicKnowledge';
import {
  KHULAFA_RASHIDEEN_EN,
  MASAIL_QA_EN,
  MUSLIM_SCIENTISTS_EN,
  PROPHETS_BIO_EN,
  SCHOLARS_AND_SAINTS_EN,
  THOUGHT_ARTICLES_EN,
} from '../data/islamicKnowledgeEn';
import { AppLang } from '../types/language';
import { ResilientImage } from './ResilientImage';
import prophetDesertImg from '../assets/images/prophet_history_desert_1794573857098.jpg';
import scienceAstrolabeImg from '../assets/images/islamic_science_astrolabe_1794573856704.jpg';

type HistorySubTab = 'prophets' | 'caliphs' | 'scholars' | 'science' | 'philosophy';

export function HistoryAndPhilosophy({
  initialSubTab = 'prophets',
  lang = 'bn',
}: {
  initialSubTab?: HistorySubTab;
  lang?: AppLang;
}) {
  const isEn = lang === 'en';
  const [subTab, setSubTab] = useState<HistorySubTab>(initialSubTab);
  const [masalaSearch, setMasalaSearch] = useState('');
  const [openMasalaId, setOpenMasalaId] = useState<string | null>(MASAIL_QA[0].id);

  const filteredMasail = useMemo(() => {
    const q = masalaSearch.trim().toLowerCase();
    if (!q) return MASAIL_QA;
    return MASAIL_QA.filter((m) => {
      const en = MASAIL_QA_EN[m.id];
      return (
        m.questionBn.toLowerCase().includes(q) ||
        m.answerBn.toLowerCase().includes(q) ||
        m.topicBn.toLowerCase().includes(q) ||
        (en &&
          (en.questionEn.toLowerCase().includes(q) ||
            en.answerEn.toLowerCase().includes(q) ||
            en.topicEn.toLowerCase().includes(q)))
      );
    });
  }, [masalaSearch]);

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
      {/* Masthead */}
      <div className="mb-8 pb-6 border-b border-[#E3DCCB] dark:border-[#1F3254] flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-wider text-[#8B5E2A] dark:text-[#D4AF6A] mb-2">
            {isEn
              ? 'History, Luminaries & Worldview · Authentic Archive'
              : 'ইতিহাস, মনীষী ও জীবনদর্শন · প্রামাণ্য আর্কাইভ'}
          </p>
          <h2 className="text-3xl sm:text-4xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9] text-balance">
            {isEn
              ? 'Prophethood, Caliphate, Science & Islamic Thought'
              : 'নবুওয়াত, খেলাফত, বিজ্ঞান ও ইসলামী দর্শন'}
          </h2>
        </div>
        <p className="text-sm text-[#57534E] dark:text-[#9BAAC4] max-w-md leading-relaxed">
          {isEn
            ? 'From Adam (AS) to Prophet Muhammad ﷺ, the Rightly-Guided Caliphs, Tabi’in, Muslim scientists, and purpose of creation.'
            : 'আদম (আ.) থেকে শেষ নবী (ﷺ), খোলাফায়ে রাশেদীন, তাবেঈন, মুসলিম বিজ্ঞানী ও মানব সৃষ্টির রহস্য।'}
        </p>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EFEAE0] dark:bg-[#16233B] rounded-lg w-fit mb-10">
        {(
          [
            { id: 'prophets', label: isEn ? 'Prophets Biography' : 'নবী-রাসূলদের জীবনী' },
            { id: 'caliphs', label: isEn ? 'Khulafa-e-Rashideen' : 'খোলাফায়ে রাশেদীন' },
            { id: 'scholars', label: isEn ? "Tabi'in & Scholars" : 'তাবেঈন ও বুজুর্গানে দ্বীন' },
            { id: 'science', label: isEn ? 'Muslim Scientists' : 'বিজ্ঞানে মুসলিমগণ' },
            { id: 'philosophy', label: isEn ? 'Thought & Masail' : 'দর্শন ও মাসআলা' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSubTab(tab.id)}
            className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              subTab === tab.id
                ? 'bg-[#FCFBF7] dark:bg-[#0E1729] text-[#14532D] dark:text-[#34D399] shadow-xs'
                : 'text-[#57534E] dark:text-[#9BAAC4] hover:text-[#1C1917] dark:hover:text-[#EDF2F9]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Prophets Biography */}
      {subTab === 'prophets' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pb-8 border-b border-[#E3DCCB] dark:border-[#1F3254]">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A] mb-2">
                {isEn
                  ? 'From Prophet Adam (AS) to Prophet Muhammad ﷺ'
                  : 'হযরত আদম (আ.) থেকে হযরত মুহাম্মদ (ﷺ)'}
              </div>
              <h3 className="text-2xl sm:text-3xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9] mb-3">
                {isEn
                  ? 'The Golden Lineage of Prophethood & Universal Message'
                  : 'নবুওয়াতের সোনালি ধারা ও বিশ্বজনীন দাওয়াত'}
              </h3>
              <p className="font-editorial text-base leading-[1.85] text-[#57534E] dark:text-[#9BAAC4]">
                {isEn
                  ? 'From the dawn of humanity, Allah sent noble Prophets and Messengers to guide mankind. Their core message was always unified: worship the One Creator and uphold justice and mercy.'
                  : 'পৃথিবীর সূচনা থেকেই মানবজাতিকে সঠিক পথ দেখানোর জন্য মহান আল্লাহ যুগে যুগে নবী ও রাসূল প্রেরণ করেছেন। তাঁদের সবার মূল দাওয়াত ছিল এক ও অভিন্ন: এক আল্লাহর ইবাদত করা এবং মানবতার কল্যাণ সাধন।'}
              </p>
            </div>
            <div className="lg:col-span-5 h-60 lg:h-auto min-h-[220px] rounded-xl overflow-hidden border border-[#E3DCCB] dark:border-[#1F3254]">
              <ResilientImage
                src={prophetDesertImg}
                alt={isEn ? 'Dawn over historic Madinah valley' : 'মদিনা ও ঐতিহাসিক উপত্যকার প্রভাত'}
              />
            </div>
          </div>

          <div className="space-y-5">
            {PROPHETS_BIO.map((p) => {
              const en = PROPHETS_BIO_EN[p.id];
              return (
                <article
                  key={p.id}
                  className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-6 sm:p-7"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 mb-4 border-b border-[#E3DCCB]/60 dark:border-[#1F3254]/60">
                    <div>
                      <span className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A] tabular-nums mr-2">
                        {isEn && en ? en.orderEn : p.order}.
                      </span>
                      <h4 className="inline text-xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                        {isEn && en ? en.nameEn : p.nameBn}
                      </h4>
                    </div>
                    <div className="text-xs text-[#57534E] dark:text-[#9BAAC4]">
                      {isEn && en ? `${en.eraEn} · ${en.quranMentionsEn}` : `${p.eraBn} · ${p.quranMentions}`}
                    </div>
                  </div>

                  <div className="text-sm font-medium text-[#14532D] dark:text-[#34D399] mb-2">
                    {isEn && en ? en.titleEn : p.titleBn}
                  </div>
                  <p className="font-editorial text-[15px] leading-[1.85] text-[#1C1917] dark:text-[#EDF2F9] mb-4">
                    {isEn && en ? en.summaryEn : p.summaryBn}
                  </p>

                  <div className="pt-3 border-t border-[#E3DCCB]/50 dark:border-[#1F3254]/50 space-y-1.5">
                    {(isEn && en ? en.keyLessonsEn : p.keyLessonsBn).map((lesson, idx) => (
                      <div key={idx} className="text-xs text-[#57534E] dark:text-[#9BAAC4]">
                        {isEn ? `• Lesson: ${lesson}` : `• শিক্ষা: ${lesson}`}
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Khulafa-e-Rashideen */}
      {subTab === 'caliphs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {KHULAFA_RASHIDEEN.map((c) => {
            const en = KHULAFA_RASHIDEEN_EN[c.id];
            return (
              <article
                key={c.id}
                className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A] mb-1 tabular-nums">
                    {isEn && en ? `${en.orderEn} · ${en.reignEn}` : `${c.order} · ${c.reignBn}`}
                  </div>
                  <h3 className="text-2xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9] mb-1">
                    {isEn && en ? en.nameEn : c.nameBn}
                  </h3>
                  <div className="text-sm text-[#14532D] dark:text-[#34D399] mb-4">
                    {isEn && en ? en.titleEn : c.titleBn}
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {(isEn && en ? en.achievementsEn : c.achievementsBn).map((ach, i) => (
                      <li
                        key={i}
                        className="text-sm text-[#57534E] dark:text-[#9BAAC4] leading-relaxed"
                      >
                        • {ach}
                      </li>
                    ))}
                  </ul>
                </div>

                <blockquote className="pt-4 border-t border-[#E3DCCB] dark:border-[#1F3254] font-editorial italic text-sm text-[#1C1917] dark:text-[#EDF2F9] leading-relaxed">
                  {isEn && en ? en.quoteEn : c.quoteBn}
                </blockquote>
              </article>
            );
          })}
        </div>
      )}

      {/* 3. Tabi'in, Tabi-Tabi'in & Saints */}
      {subTab === 'scholars' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SCHOLARS_AND_SAINTS.map((s) => {
            const en = SCHOLARS_AND_SAINTS_EN[s.id];
            return (
              <article
                key={s.id}
                className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-6"
              >
                <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A] mb-2 tabular-nums">
                  {isEn && en ? `${en.eraTagEn} · ${en.lifespanEn}` : `${s.eraTag} · ${s.lifespan}`}
                </div>
                <h3 className="text-xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9] mb-3">
                  {isEn && en ? en.nameEn : s.nameBn}
                </h3>
                <p className="text-sm text-[#57534E] dark:text-[#9BAAC4] leading-relaxed">
                  {isEn && en ? en.contributionEn : s.contributionBn}
                </p>
              </article>
            );
          })}
        </div>
      )}

      {/* 4. Muslim Contributions to Science */}
      {subTab === 'science' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pb-8 border-b border-[#E3DCCB] dark:border-[#1F3254]">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A] mb-2">
                {isEn
                  ? 'Islamic Golden Age · House of Wisdom & Modern Science'
                  : 'ইসলামী স্বর্ণযুগ · বায়তুল হিকমাহ ও আধুনিক বিজ্ঞান'}
              </div>
              <h3 className="text-2xl sm:text-3xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9] mb-3">
                {isEn
                  ? 'Pioneering Muslim Contributions to Science & Learning'
                  : 'জ্ঞান-বিজ্ঞানে মুসলিম মনীষীদের যুগান্তকারী অবদান'}
              </h3>
              <p className="font-editorial text-base leading-[1.85] text-[#57534E] dark:text-[#9BAAC4]">
                {isEn
                  ? 'Inspired by the Quran’s First Revelation "Iqra" (Read) and its call to observe the cosmos, Muslim scholars laid enduring foundations in algebra, optics, medicine, chemistry, and astronomy.'
                  : 'আল-কুরআনের প্রথম ওহী “ইকরা” (পড়ো) এবং মহাবিশ্ব নিয়ে গবেষণার তাগিদ মুসলিম বিজ্ঞানীদের গণিত, চিকিৎসা, আলোকবিজ্ঞান, রসায়ন ও জ্যোতির্বিজ্ঞানে আধুনিক বিজ্ঞানের ভিত্তি রচনা করতে অনুপ্রাণিত করেছিল।'}
              </p>
            </div>
            <div className="lg:col-span-5 h-60 lg:h-auto min-h-[220px] rounded-xl overflow-hidden border border-[#E3DCCB] dark:border-[#1F3254]">
              <ResilientImage
                src={scienceAstrolabeImg}
                alt={
                  isEn
                    ? 'Classical Islamic brass astrolabe and geometry manuscripts'
                    : 'প্রাচীন মুসলিম জ্যোতির্বিজ্ঞান অ্যাস্ট্রোলেব ও জ্যামিতিক পাণ্ডুলিপি'
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MUSLIM_SCIENTISTS.map((sci) => {
              const en = MUSLIM_SCIENTISTS_EN[sci.id];
              return (
                <article
                  key={sci.id}
                  className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-6"
                >
                  <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A] mb-1.5 tabular-nums">
                    {isEn && en ? `${en.fieldEn} · ${en.eraEn}` : `${sci.fieldBn} · ${sci.era}`}
                  </div>
                  <h4 className="text-lg font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9] mb-3">
                    {isEn && en ? en.nameEn : sci.nameBn}
                  </h4>
                  <p className="text-sm text-[#1C1917] dark:text-[#D6D3CD] leading-relaxed mb-3">
                    {isEn && en ? en.discoveryEn : sci.discoveryBn}
                  </p>
                  <p className="text-xs text-[#57534E] dark:text-[#9BAAC4] pt-3 border-t border-[#E3DCCB]/60 dark:border-[#1F3254]/60 leading-relaxed">
                    {isEn && en ? `Legacy: ${en.legacyEn}` : `উত্তরাধিকার: ${sci.legacyBn}`}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Philosophy & Masail */}
      {subTab === 'philosophy' && (
        <div className="space-y-12">
          <div className="space-y-6">
            {THOUGHT_ARTICLES.map((art) => {
              const en = THOUGHT_ARTICLES_EN[art.id];
              return (
                <article
                  key={art.id}
                  className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl p-6 sm:p-8"
                >
                  <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A] mb-2">
                    {isEn && en ? en.kickerEn : art.kickerBn}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9] mb-3">
                    {isEn && en ? en.titleEn : art.titleBn}
                  </h3>
                  <p className="font-editorial text-base leading-[1.85] text-[#57534E] dark:text-[#9BAAC4] mb-6 max-w-3xl">
                    {isEn && en ? en.leadEn : art.leadBn}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6 border-t border-[#E3DCCB] dark:border-[#1F3254]">
                    {(isEn && en ? en.points : art.points).map((pt, i) => (
                      <div key={i} className="space-y-2">
                        <h4 className="text-sm font-semibold text-[#14532D] dark:text-[#34D399]">
                          {pt.heading}
                        </h4>
                        <p className="text-sm text-[#57534E] dark:text-[#9BAAC4] leading-relaxed">
                          {pt.body}
                        </p>
                        <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A]">{pt.ref}</div>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Searchable Masail-Masayel Q&A */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-[#E3DCCB] dark:border-[#1F3254]">
              <div>
                <h3 className="text-2xl font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                  {isEn ? 'Everyday Masail & Q&A' : 'দৈনন্দিন মাসআলা-মাসায়েল ও প্রশ্নোত্তর'}
                </h3>
                <p className="text-xs text-[#57534E] dark:text-[#9BAAC4] mt-1">
                  {isEn
                    ? 'Search questions or topics for authentic Islamic rulings'
                    : 'প্রশ্ন বা বিষয় লিখে প্রামাণ্য সমাধান খুঁজুন'}
                </p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#57534E] dark:text-[#9BAAC4] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={masalaSearch}
                  onChange={(e) => setMasalaSearch(e.target.value)}
                  placeholder={isEn ? 'Search rulings (e.g. Wudu, Zakat, Fasting)...' : 'মাসআলা খুঁজুন (যেমন: অজু, যাকাত, রোজা)...'}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-lg text-[#1C1917] dark:text-[#EDF2F9] placeholder:text-[#57534E]/70 dark:placeholder:text-[#9BAAC4]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] dark:focus-visible:ring-[#34D399]"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredMasail.map((m) => {
                const isOpen = openMasalaId === m.id;
                const en = MASAIL_QA_EN[m.id];
                return (
                  <div
                    key={m.id}
                    className="bg-[#FCFBF7] dark:bg-[#0E1729] border border-[#E3DCCB] dark:border-[#1F3254] rounded-xl overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenMasalaId(isOpen ? null : m.id)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-[#EFEAE0]/40 dark:hover:bg-[#16233B]/40 transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="text-xs text-[#8B5E2A] dark:text-[#D4AF6A] mb-1">
                          {isEn && en ? en.topicEn : m.topicBn}
                        </div>
                        <div className="text-base font-editorial font-semibold text-[#1C1917] dark:text-[#EDF2F9]">
                          {isEn && en ? en.questionEn : m.questionBn}
                        </div>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#57534E] dark:text-[#9BAAC4] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#57534E] dark:text-[#9BAAC4] shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-2 border-t border-[#E3DCCB]/60 dark:border-[#1F3254]/60">
                        <p className="text-sm leading-relaxed text-[#1C1917] dark:text-[#D6D3CD] mb-3">
                          {isEn && en ? en.answerEn : m.answerBn}
                        </p>
                        <div className="text-xs text-[#57534E] dark:text-[#9BAAC4]">
                          {isEn && en ? `Reference: ${en.referenceEn}` : `তথ্যসূত্র: ${m.referenceBn}`}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
