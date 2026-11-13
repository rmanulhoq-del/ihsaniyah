import { ayahArabicToBengali } from '../data/arabicPronunciationBn';
import { stripHtmlTags } from '../data/surahNamesBn';

export interface QariOption {
  id: string;
  nameBn: string;
  nameEn: string;
  originBn: string;
  originEn: string;
  fullSurahBaseUrl: string;
}

export const QARI_LIST: QariOption[] = [
  {
    id: 'ar.alafasy',
    nameBn: 'শায়খ মিশারি রশিদ আল-আফাসি',
    nameEn: 'Sheikh Mishary Rashid Alafasy',
    originBn: 'কুয়েত',
    originEn: 'Kuwait',
    fullSurahBaseUrl: 'https://server8.mp3quran.net/afs',
  },
  {
    id: 'ar.abdulbasitmurattal',
    nameBn: 'কারী আব্দুল বাসিত আব্দুস সামাদ',
    nameEn: 'Qari Abdul Basit Abdus Samad',
    originBn: 'মিশর',
    originEn: 'Egypt',
    fullSurahBaseUrl: 'https://server7.mp3quran.net/basit',
  },
  {
    id: 'ar.husary',
    nameBn: 'শায়খ মাহমুদ খলিল আল-হুসারি',
    nameEn: 'Sheikh Mahmoud Khalil Al-Husary',
    originBn: 'মিশর',
    originEn: 'Egypt',
    fullSurahBaseUrl: 'https://server13.mp3quran.net/husr',
  },
  {
    id: 'ar.abdurrahmaansudais',
    nameBn: 'শায়খ আব্দুর রহমান আস-সুদাইস',
    nameEn: 'Sheikh Abdur-Rahman As-Sudais',
    originBn: 'মক্কা আল-মুকাররামাহ',
    originEn: 'Makkah al-Mukarramah',
    fullSurahBaseUrl: 'https://server11.mp3quran.net/sds',
  },
  {
    id: 'ar.mahermuaiqly',
    nameBn: 'শায়খ মাহের আল-মুআইকলি',
    nameEn: 'Sheikh Maher Al-Muaiqly',
    originBn: 'মক্কা আল-মুকাররামাহ',
    originEn: 'Makkah al-Mukarramah',
    fullSurahBaseUrl: 'https://server12.mp3quran.net/maher',
  },
  {
    id: 'ar.minshawi',
    nameBn: 'শায়খ মুহাম্মদ সিদ্দিক আল-মিনশাবি',
    nameEn: 'Sheikh Muhammad Siddiq al-Minshawi',
    originBn: 'মিশর',
    originEn: 'Egypt',
    fullSurahBaseUrl: 'https://server10.mp3quran.net/minsh',
  },
];

export function getFullSurahAudioUrl(qariId: string, surahNumber: number): string {
  const qari = QARI_LIST.find((q) => q.id === qariId) || QARI_LIST[0];
  const padded = String(surahNumber).padStart(3, '0');
  return `${qari.fullSurahBaseUrl}/${padded}.mp3`;
}

export interface AyahItem {
  number: number; // global ayah number
  numberInSurah: number;
  arabic: string;
  translitLatin: string;
  pronunciationBn: string;
  translationBn: string;
  translationEn: string;
  audioUrl: string;
  juz: number;
  page: number;
}

export interface SurahDetailData {
  number: number;
  ayahs: AyahItem[];
}

const surahCache = new Map<string, SurahDetailData>();

export async function fetchSurahDetail(
  surahNumber: number,
  qariId: string = 'ar.alafasy'
): Promise<SurahDetailData> {
  const cacheKey = `${surahNumber}:${qariId}`;
  const cached = surahCache.get(cacheKey);
  if (cached) return cached;

  const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.transliteration,bn.bengali,en.sahih,${qariId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('সূরার তথ্য লোড করা যায়নি। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।');
  }

  const payload = await response.json();
  if (payload.code !== 200 || !Array.isArray(payload.data) || payload.data.length < 5) {
    throw new Error('কুরআন API থেকে অপ্রত্যাশিত তথ্য পাওয়া গেছে।');
  }

  const [arabicEd, translitEd, bengaliEd, englishEd, audioEd] = payload.data;

  const ayahs: AyahItem[] = arabicEd.ayahs.map((arAyah: any, idx: number) => {
    const trAyah = translitEd.ayahs[idx];
    const bnAyah = bengaliEd.ayahs[idx];
    const enAyah = englishEd.ayahs[idx];
    const auAyah = audioEd.ayahs[idx];
    const latin = stripHtmlTags(trAyah?.text || '');

    return {
      number: arAyah.number,
      numberInSurah: arAyah.numberInSurah,
      arabic: arAyah.text,
      translitLatin: latin,
      pronunciationBn: ayahArabicToBengali(arAyah.text || ''),
      translationBn: bnAyah?.text || '',
      translationEn: enAyah?.text || '',
      audioUrl: auAyah?.audio || auAyah?.audioSecondary?.[0] || '',
      juz: arAyah.juz,
      page: arAyah.page,
    };
  });

  const result: SurahDetailData = {
    number: surahNumber,
    ayahs,
  };
  surahCache.set(cacheKey, result);
  return result;
}
