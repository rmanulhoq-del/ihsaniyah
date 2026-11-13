import { AppLang } from '../types/language';
import bukhariCoverImg from '../assets/images/hadith_bukhari_cover_1794580128447.jpg';
import muslimCoverImg from '../assets/images/hadith_muslim_cover_1794580128363.jpg';
import abudawudCoverImg from '../assets/images/hadith_abudawud_cover_1794580129217.jpg';
import tirmidhiCoverImg from '../assets/images/hadith_tirmidhi_cover_1794580128399.jpg';
import nasaiCoverImg from '../assets/images/hadith_nasai_cover_1794580129705.jpg';
import ibnmajahCoverImg from '../assets/images/hadith_ibnmajah_cover_1794580130610.jpg';
import malikCoverImg from '../assets/images/hadith_malik_cover_1794580130508.jpg';

export interface HadithBookMeta {
  id: string;
  nameBn: string;
  nameEn: string;
  compilerBn: string;
  compilerEn: string;
  totalEstimate: string;
  totalEstimateEn: string;
  descriptionBn: string;
  descriptionEn: string;
  coverImage: string;
}

export const HADITH_BOOKS: HadithBookMeta[] = [
  {
    id: 'bukhari',
    nameBn: 'সহীহ আল-বুখারী',
    nameEn: 'Sahih al-Bukhari',
    compilerBn: 'ইমাম মুহাম্মদ ইবনে ইসমাইল আল-বুখারী (রহ.)',
    compilerEn: 'Imam Muhammad ibn Ismail al-Bukhari',
    totalEstimate: 'কেবল সহীহ হাদিস',
    totalEstimateEn: 'Sahih Only',
    descriptionBn: 'আল-কুরআনের পর সর্বাধিক বিশুদ্ধ ও প্রামাণ্য হাদিস গ্রন্থ।',
    descriptionEn: 'The most authentic collection of Prophetic traditions after the Holy Quran.',
    coverImage: bukhariCoverImg,
  },
  {
    id: 'muslim',
    nameBn: 'সহীহ মুসলিম',
    nameEn: 'Sahih Muslim',
    compilerBn: 'ইমাম মুসলিম ইবনুল হাজ্জাজ (রহ.)',
    compilerEn: 'Imam Muslim ibn al-Hajjaj',
    totalEstimate: 'কেবল সহীহ হাদিস',
    totalEstimateEn: 'Sahih Only',
    descriptionBn: 'সনদ ও বিন্যাসের বিচারে দ্বিতীয় সর্বাধিক প্রামাণ্য সহীহ হাদিস সংকলন।',
    descriptionEn: 'Universally recognized as the second most authentic Sahih Hadith collection.',
    coverImage: muslimCoverImg,
  },
  {
    id: 'abudawud',
    nameBn: 'সুনানে আবু দাউদ',
    nameEn: 'Sunan Abi Dawud',
    compilerBn: 'ইমাম আবু দাউদ সুলাইমান আস-সিজিস্তানী (রহ.)',
    compilerEn: 'Imam Abu Dawud al-Sijistani',
    totalEstimate: 'কেবল সহীহ হাদিস',
    totalEstimateEn: 'Sahih Filtered',
    descriptionBn: 'ফিকহ ও শরীয়তের আহকাম বিষয়ক গ্রন্থ (দুর্বল/অ-সহীহ বাদ দিয়ে কেবল সহীহ হাদিস প্রদর্শিত)।',
    descriptionEn: 'Jurisprudence-focused Sunan collection filtered strictly to verified Sahih narrations.',
    coverImage: abudawudCoverImg,
  },
  {
    id: 'tirmidhi',
    nameBn: 'জামে আত-তিরমিযী',
    nameEn: 'Jami at-Tirmidhi',
    compilerBn: 'ইমাম আবু ঈসা মুহাম্মদ আত-তিরমিযী (রহ.)',
    compilerEn: 'Imam Abu Isa at-Tirmidhi',
    totalEstimate: 'কেবল সহীহ হাদিস',
    totalEstimateEn: 'Sahih Filtered',
    descriptionBn: 'হাদিসের মান ও ফিকহী মতামত সমৃদ্ধ সংকলন (কেবল সহীহ হাদিসসমূহ প্রদর্শিত)।',
    descriptionEn: 'Renowned Sunan with scholarly gradings, filtered strictly to Sahih narrations.',
    coverImage: tirmidhiCoverImg,
  },
  {
    id: 'nasai',
    nameBn: 'সুনানে আন-নাসায়ী',
    nameEn: "Sunan an-Nasa'i",
    compilerBn: 'ইমাম আহমদ ইবনে শুআইব আন-নাসায়ী (রহ.)',
    compilerEn: "Imam Ahmad an-Nasa'i",
    totalEstimate: 'কেবল সহীহ হাদিস',
    totalEstimateEn: 'Sahih Filtered',
    descriptionBn: 'রাবীদের যাচাই-বাছাইয়ে অত্যন্ত সূক্ষ্ম সুনান গ্রন্থ (কেবল সহীহ সনদযুক্ত হাদিস প্রদর্শিত)।',
    descriptionEn: 'Known for rigorous narrator criticism, filtered strictly to Sahih narrations.',
    coverImage: nasaiCoverImg,
  },
  {
    id: 'ibnmajah',
    nameBn: 'সুনানে ইবনে মাজাহ',
    nameEn: 'Sunan Ibn Majah',
    compilerBn: 'ইমাম মুহাম্মদ ইবনে ইয়াজিদ ইবনে মাজাহ (রহ.)',
    compilerEn: 'Imam Ibn Majah al-Qazwini',
    totalEstimate: 'কেবল সহীহ হাদিস',
    totalEstimateEn: 'Sahih Filtered',
    descriptionBn: 'সিহাহ সিত্তাহর ষষ্ঠ গ্রন্থ (দুর্বল/জঈফ বাদ দিয়ে কেবল সহীহ হাদিস প্রদর্শিত)।',
    descriptionEn: 'Sixth of the canonical collections, filtered strictly to Sahih narrations.',
    coverImage: ibnmajahCoverImg,
  },
  {
    id: 'malik',
    nameBn: 'মুয়াত্তা ইমাম মালিক',
    nameEn: 'Muwatta Imam Malik',
    compilerBn: 'ইমাম মালিক ইবনে আনাস (রহ.)',
    compilerEn: 'Imam Malik ibn Anas',
    totalEstimate: 'কেবল সহীহ হাদিস',
    totalEstimateEn: 'Sahih Filtered',
    descriptionBn: 'মদিনার প্রামাণ্য প্রাথমিক হাদিস ও ফিকহ সংকলন (কেবল সহীহ বর্ণনা প্রদর্শিত)।',
    descriptionEn: 'Early Madinan compilation of Hadith and practice, filtered strictly to Sahih.',
    coverImage: malikCoverImg,
  },
];

export interface HadithSectionInfo {
  sectionNumber: number;
  title: string;
  titleBn: string;
  hadithFirst: number;
  hadithLast: number;
}

const CHAPTER_BN_DICTIONARY: Array<[RegExp, string]> = [
  [/revelation/i, 'ওহীর সূচনা'],
  [/belief|faith|iman/i, 'ঈমান অধ্যায়'],
  [/knowledge/i, 'ইলম ও জ্ঞান'],
  [/ablution|wudu/i, 'অজু ও পবিত্রতা'],
  [/purification|taharah/i, 'পবিত্রতা (তাহারাত)'],
  [/bathing|ghusl/i, 'গোসল অধ্যায়'],
  [/menstruation|menses/i, 'হায়েয ও মাসিক'],
  [/tayammum|rubbing hands/i, 'তায়াম্মুম'],
  [/prayers?\s*\(salat\)|^prayer$|^salah$/i, 'সালাত (নামাজ)'],
  [/times of the prayers/i, 'নামাজের সময়সূচি'],
  [/call to prayers|adhan/i, 'আজান ও ইকামাত'],
  [/friday prayer|jumu/i, 'জুমুআ ও জুমার নামাজ'],
  [/fear prayer/i, 'ভীতিকালীন নামাজ'],
  [/two festivals|eid/i, 'দুই ঈদের নামাজ'],
  [/witr/i, 'বিতির নামাজ'],
  [/invoking allah for rain|istisqa/i, 'বৃষ্টির জন্য দুআ (ইসতিসকা)'],
  [/eclipse/i, 'সূর্য ও চন্দ্রগ্রহণের নামাজ'],
  [/prostration|sujood/i, 'তিলাওয়াতে সিজদা'],
  [/shortening.*prayer|travel/i, 'মুসাফিরের কসর নামাজ'],
  [/night prayer|tahajjud/i, 'তাহাজ্জুদ ও রাতের নামাজ'],
  [/virtues of prayer.*makkah.*madinah/i, 'মক্কা ও মদিনায় নামাজের ফজিলত'],
  [/funeral|janaiz/i, 'জানাযা ও দাফন'],
  [/zakat|alms|charity/i, 'যাকাত ও দান-সদকা'],
  [/hajj|pilgrimage/i, 'হজ্জ অধ্যায়'],
  [/umrah/i, 'উমরাহ অধ্যায়'],
  [/fasting|sawm|ramadan/i, 'সাওম (রোজা ও রমজান)'],
  [/tarawih/i, 'তারাবীহ নামাজ'],
  [/i'tikaf|itikaf/i, 'ইতিকাফ'],
  [/sales|trade|bargaining|business/i, 'ক্রয়-বিক্রয় ও ব্যবসা'],
  [/salam|peace/i, 'সালাম ও সম্ভাষণ'],
  [/renting|hiring|ijarah/i, 'ভাড়া ও মজুরি'],
  [/mortgage|pawnbroking/i, 'বন্ধক অধ্যায়'],
  [/agriculture|farming/i, 'কৃষি ও চাষাবাদ'],
  [/distribution of water/i, 'পানি বণ্টন ও সেচ'],
  [/loans|debt|bankruptcy/i, 'ঋণ ও পরিশোধ'],
  [/lost.*found|luqatah/i, 'হারানো ও কুড়িয়ে পাওয়া বস্তু'],
  [/oppression|zulm/i, 'জুলুম ও অন্যায়'],
  [/partnership/i, 'অংশীদারিত্ব ব্যবসা'],
  [/manumission|slaves/i, 'দাসমুক্তি'],
  [/gifts|hiba/i, 'উপহার ও হাদিয়া'],
  [/witnesses/i, 'সাক্ষ্য অধ্যায়'],
  [/peacemaking|reconciliation/i, 'সন্ধি ও মীমাংসা'],
  [/conditions/i, 'শর্তাবলী'],
  [/wills|testament|wasaya/i, 'অসিয়ত অধ্যায়'],
  [/fighting for the cause|jihad/i, 'জিহাদ ও রাষ্ট্রীয় প্রতিরক্ষা'],
  [/one-fifth|booty|khums/i, 'গনীমত ও খুমুস'],
  [/jizyah|tribute/i, 'জিযিয়া ও সন্ধিচুক্তি'],
  [/beginning of creation/i, 'সৃষ্টির সূচনা'],
  [/prophets/i, 'নবী-রাসূলগণের বৃত্তান্ত'],
  [/virtues.*merits.*prophet|companions/i, 'সাহাবায়ে কেরামের মর্যাদা'],
  [/expeditions|maghazi/i, 'নবীজীর ﷺ অভিযানসমূহ'],
  [/commentary|tafsir/i, 'কুরআনের তাফসীর'],
  [/virtues of the qur/i, 'আল-কুরআনের ফজিলত'],
  [/marriage|wedlock|nikah/i, 'বিবাহ (নিকাহ)'],
  [/divorce|talaq/i, 'তালাক অধ্যায়'],
  [/supporting the family|maintenance/i, 'পরিবারের ভরণপোষণ'],
  [/food|meals/i, 'খাদ্য ও পানীয়'],
  [/sacrifice.*aqeeqah|aqiqah/i, 'আকীকা অধ্যায়'],
  [/hunting|slaughtering/i, 'শিকার ও জবাই'],
  [/al-adha|sacrifices/i, 'কুরবানি অধ্যায়'],
  [/drinks/i, 'পানীয় ও হালাল-হারাম'],
  [/patients|sick/i, 'রোগী ও অসুস্থতা'],
  [/medicine/i, 'চিকিৎসা ও ঔষধ'],
  [/dress|clothing/i, 'পোশাক-পরিচ্ছদ'],
  [/good manners|adab/i, 'আদব, শিষ্টাচার ও চরিত্র'],
  [/asking permission/i, 'অনুমতি গ্রহণ'],
  [/invocations|supplications|dua/i, 'দুআ ও জিকির'],
  [/heart.*softening|riqaq/i, 'কোমল হৃদয় ও আখিরাত স্মরণ'],
  [/divine will|qadar/i, 'তাকদীর (ভাগ্য)'],
  [/oaths and vows/i, 'শপথ ও মানত'],
  [/expiation/i, 'কাফফারা অধ্যায়'],
  [/inheritance|faraid/i, 'উত্তরাধিকার (ফারায়েয)'],
  [/limits.*punishments|hudud/i, 'শরয়ী দণ্ডবিধি (হুদুদ)'],
  [/blood money|diyat/i, 'দিয়াত ও হত্যা সম্পর্কিত বিধান'],
  [/apostates/i, 'মুরতাদ সম্পর্কিত বিধান'],
  [/coercion/i, 'জবরদস্তি ও বাধ্যবাধকতা'],
  [/tricks/i, 'কৌশল ও হীলা'],
  [/interpretation of dreams/i, 'স্বপ্নের ব্যাখ্যা'],
  [/afflictions|fitan/i, 'ফিতনা ও শেষ যুগ'],
  [/judgments|ahkam/i, 'বিচার ও শাসনব্যবস্থা'],
  [/wishes/i, 'আশা-আকাঙ্ক্ষা'],
  [/truthful|single person/i, 'খবরে ওয়াহিদ (একক বর্ণনা)'],
  [/holding fast.*qur|sunnah/i, 'কুরআন ও সুন্নাহ আঁকড়ে ধরা'],
  [/oneness|tawhid|monotheism/i, 'তাওহীদ (আল্লাহর একত্ববাদ)'],
  [/general|introduction/i, 'ভূমিকা ও প্রাথমিক অধ্যায়'],
];

export function translateChapterTitleBn(title: string): string {
  const clean = title.trim();
  for (const [pattern, bn] of CHAPTER_BN_DICTIONARY) {
    if (pattern.test(clean)) {
      return `${bn} (${clean})`;
    }
  }
  return clean;
}

export interface HadithItem {
  hadithnumber: number;
  arabicnumber?: number;
  textBn: string;
  textAr: string;
  grades: Array<{ name: string; grade: string }>;
  reference?: { book: number; hadith: number };
}

export interface SectionHadithResult {
  sectionTitleBn: string;
  hadiths: HadithItem[];
  totalInSection: number;
  excludedNonSahihCount: number;
}

/**
 * Strict Sahih-only verification:
 * - Sahih al-Bukhari and Sahih Muslim are universally accepted Sahih collections.
 * - For Sunan & Muwatta books, requires explicit Sahih grading from all listed Muhaddithin
 *   and strictly excludes any Hadith marked Daif, Weak, Shadh, Mawdu, Munkar, Batil, Mursal, or pure Hasan without Sahih.
 */
export function isStrictlySahihHadith(
  bookId: string,
  grades?: Array<{ name?: string; grade?: string }>
): boolean {
  if (bookId === 'bukhari' || bookId === 'muslim') {
    if (!Array.isArray(grades) || grades.length === 0) return true;
    const rejectInSahihayn = /\b(daif|weak|mawdu|maudu|munkar|shadh|batil)\b/i;
    return !grades.some((g) => rejectInSahihayn.test(g.grade || ''));
  }

  if (!Array.isArray(grades) || grades.length === 0) {
    return false;
  }

  const rejectPattern = /\b(daif|weak|mawdu|maudu|munkar|shadh|batil|matruk|mursal|munqati)\b/i;
  const sahihPattern = /\b(sahih|agreed upon|bukhari|muslim)\b/i;

  const hasAnyRejection = grades.some((g) => rejectPattern.test(g.grade || ''));
  if (hasAnyRejection) return false;

  return grades.every((g) => sahihPattern.test(g.grade || ''));
}

let cachedBookSectionsMap: Record<string, HadithSectionInfo[]> | null = null;
const sectionHadithsCache = new Map<string, SectionHadithResult>();

export async function fetchAllBooksSections(): Promise<Record<string, HadithSectionInfo[]>> {
  if (cachedBookSectionsMap) {
    return cachedBookSectionsMap;
  }

  const infoRes = await fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/info.json');
  if (!infoRes.ok) {
    throw new Error('হাদিস গ্রন্থের অধ্যায় তালিকা লোড করা যায়নি।');
  }
  const infoData = await infoRes.json();

  const resultMap: Record<string, HadithSectionInfo[]> = {};
  for (const book of HADITH_BOOKS) {
    const bookEntry = infoData[book.id];
    const meta = bookEntry?.metadata;
    if (meta?.sections && meta?.section_details) {
      const list: HadithSectionInfo[] = [];
      for (const [secKey, secTitle] of Object.entries(meta.sections)) {
        const secNum = Number(secKey);
        if (secNum === 0 || !secTitle) continue;
        const det = meta.section_details[secKey] || {};
        const rawTitle = String(secTitle);
        list.push({
          sectionNumber: secNum,
          title: rawTitle,
          titleBn: translateChapterTitleBn(rawTitle),
          hadithFirst: det.hadithnumber_first || 0,
          hadithLast: det.hadithnumber_last || 0,
        });
      }
      resultMap[book.id] = list;
    }
  }
  cachedBookSectionsMap = resultMap;
  return resultMap;
}

export async function fetchHadithSectionsForBook(bookId: string): Promise<HadithSectionInfo[]> {
  const all = await fetchAllBooksSections();
  return all[bookId] || [];
}

export async function fetchHadithsBySection(
  bookId: string,
  sectionNumber: number,
  lang: AppLang = 'bn'
): Promise<SectionHadithResult> {
  const editionPrefix = lang === 'en' ? 'eng' : 'ben';
  const cacheKey = `${editionPrefix}:${bookId}:${sectionNumber}`;
  const cached = sectionHadithsCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const textUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${editionPrefix}-${bookId}/sections/${sectionNumber}.min.json`;
  const araUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-${bookId}/sections/${sectionNumber}.min.json`;

  const [textRes, araRes] = await Promise.all([
    fetch(textUrl),
    fetch(araUrl).catch(() => null),
  ]);

  if (!textRes.ok) {
    throw new Error(
      lang === 'en'
        ? 'Failed to load Hadiths for this chapter.'
        : 'এই অধ্যায়ের বাংলা হাদিস লোড করা যায়নি।'
    );
  }

  const textData = await textRes.json();
  let araData: any = null;
  if (araRes && araRes.ok) {
    araData = await araRes.json();
  }

  const araMap = new Map<number, string>();
  if (Array.isArray(araData?.hadiths)) {
    for (const h of araData.hadiths) {
      if (h.hadithnumber && h.text) {
        araMap.set(h.hadithnumber, h.text);
      }
    }
  }

  const sectionTitleBn =
    textData?.metadata?.section?.[String(sectionNumber)] || '';

  const rawHadiths: any[] = Array.isArray(textData?.hadiths) ? textData.hadiths : [];
  const sahihOnlyHadiths: HadithItem[] = rawHadiths
    .filter((h) => isStrictlySahihHadith(bookId, h.grades) && String(h.text || '').trim().length > 0)
    .map((h: any) => ({
      hadithnumber: h.hadithnumber,
      arabicnumber: h.arabicnumber,
      textBn: h.text || '',
      textAr: araMap.get(h.hadithnumber) || '',
      grades: Array.isArray(h.grades) ? h.grades : [],
      reference: h.reference,
    }));

  const result: SectionHadithResult = {
    sectionTitleBn,
    hadiths: sahihOnlyHadiths,
    totalInSection: rawHadiths.length,
    excludedNonSahihCount: Math.max(0, rawHadiths.length - sahihOnlyHadiths.length),
  };

  sectionHadithsCache.set(cacheKey, result);
  return result;
}

export interface NawawiResult {
  hadiths: HadithItem[];
  excludedCount: number;
}

const cachedNawawiByLang = new Map<AppLang, NawawiResult>();

const NAWAWI_NON_SAHIH_NUMBERS = new Set<number>([12, 18, 27, 30, 33, 39, 41, 42]);

export async function fetchSahihNawawiHadiths(lang: AppLang = 'bn'): Promise<NawawiResult> {
  const existing = cachedNawawiByLang.get(lang);
  if (existing) return existing;

  const editionPrefix = lang === 'en' ? 'eng' : 'ben';
  const [textRes, araRes] = await Promise.all([
    fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${editionPrefix}-nawawi.min.json`),
    fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-nawawi.min.json').catch(() => null),
  ]);

  if (!textRes.ok) {
    throw new Error(
      lang === 'en'
        ? "Failed to load Imam Nawawi's Forty Hadith."
        : 'ইমাম নববীর চল্লিশ হাদিস লোড করা যায়নি।'
    );
  }

  const textData = await textRes.json();
  const araData = araRes && araRes.ok ? await araRes.json() : null;

  const araMap = new Map<number, string>();
  if (Array.isArray(araData?.hadiths)) {
    for (const h of araData.hadiths) {
      if (h.hadithnumber && h.text) {
        araMap.set(Number(h.hadithnumber), h.text);
      }
    }
  }

  const raw: any[] = Array.isArray(textData?.hadiths) ? textData.hadiths : [];
  const filtered: HadithItem[] = raw
    .filter((h) => !NAWAWI_NON_SAHIH_NUMBERS.has(Number(h.hadithnumber)) && String(h.text || '').trim().length > 0)
    .map((h) => ({
      hadithnumber: Number(h.hadithnumber),
      textBn: h.text || '',
      textAr: araMap.get(Number(h.hadithnumber)) || '',
      grades: [{ name: lang === 'en' ? 'Verification' : 'তাহকীক', grade: 'Sahih' }],
    }));

  const result: NawawiResult = {
    hadiths: filtered,
    excludedCount: raw.length - filtered.length,
  };
  cachedNawawiByLang.set(lang, result);
  return result;
}
