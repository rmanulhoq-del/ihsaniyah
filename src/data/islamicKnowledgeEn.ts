import { AppLang } from '../types/language';
import { toBengaliDigits } from './surahNamesBn';

export function toLocalizedDigits(num: number | string, lang: AppLang): string {
  return lang === 'en' ? String(num) : toBengaliDigits(num);
}

export interface DailyPracticeEn {
  categoryEn: string;
  titleEn: string;
  timingEn: string;
  detailEn: string;
  referenceEn: string;
}

export const DAILY_PRACTICES_EN: Record<string, DailyPracticeEn> = {
  'farz-iman': {
    categoryEn: 'Farz (Obligatory)',
    titleEn: 'Steadfastness in Tawhid & Faith and Avoiding Shirk',
    timingEn: 'At all times',
    detailEn:
      'Believing in One Allah as the sole Lord and object of worship and following the guidance brought by Prophet Muhammad ﷺ is the foremost obligation in life.',
    referenceEn: 'Surah Al-Bayyinah 98:5 · Sahih al-Bukhari 8',
  },
  'farz-salah': {
    categoryEn: 'Farz (Obligatory)',
    titleEn: 'Performing the Five Daily Obligatory Prayers on Time',
    timingEn: 'Fajr, Dhuhr, Asr, Maghrib, Isha',
    detailEn:
      'Establishing the five daily prayers with ritual purity (Wudu/Ghusl), facing the Qiblah with humility and concentration—and in congregation for men.',
    referenceEn: 'Surah An-Nisa 4:103 · Surah Al-Baqarah 2:43',
  },
  'farz-halal': {
    categoryEn: 'Farz (Obligatory)',
    titleEn: 'Earning Halal Livelihood, Speaking Truth & Keeping Trusts',
    timingEn: 'Daily dealings & work',
    detailEn:
      'Avoiding interest (Riba), bribery, and deception; seeking lawful sustenance; and fulfilling the rights of others faithfully.',
    referenceEn: 'Surah Al-Baqarah 2:168 · Sahih Muslim 1015',
  },
  'farz-parents': {
    categoryEn: 'Farz (Obligatory)',
    titleEn: 'Kindness to Parents and Caring for Family Responsibilities',
    timingEn: 'Every day',
    detailEn:
      'Respecting and serving parents with gentle speech (in all lawful matters) and fulfilling the rightful needs of one’s dependents.',
    referenceEn: 'Surah Al-Isra 17:23–24',
  },
  'wajib-witr': {
    categoryEn: 'Wajib (Necessary)',
    titleEn: 'Performing the Witr Prayer After Isha',
    timingEn: 'After Isha until true dawn (Fajr)',
    detailEn:
      'The three-rakat Witr prayer is Wajib (in the Hanafi school) and an emphasized Sunnah across Islamic jurisprudence.',
    referenceEn: 'Sunan Abi Dawud 1418 · Jami at-Tirmidhi 452',
  },
  'wajib-salah-rules': {
    categoryEn: 'Wajib (Necessary)',
    titleEn: 'Reciting Al-Fatihah, Tranquility in Ruku/Sujud & Tashahhud',
    timingEn: 'In every prayer',
    detailEn:
      'Observing the essential pillars and calm posture (Ta’dil al-Arkan) in bowing, prostration, and sitting in Tashahhud.',
    referenceEn: 'Sahih al-Bukhari 757',
  },
  'wajib-waqf-promise': {
    categoryEn: 'Wajib (Necessary)',
    titleEn: 'Honoring Promises and Refraining from Backbiting',
    timingEn: 'Daily social conduct',
    detailEn:
      'Fulfilling lawful agreements and guarding the tongue from slander, gossip, and backbiting.',
    referenceEn: 'Surah Al-Ma’idah 5:1 · Surah Al-Hujurat 49:12',
  },
  'sunnah-muakkadah': {
    categoryEn: 'Sunnah',
    titleEn: 'Performing the 12 Daily Confirmed Sunnah (Rawatib) Prayers',
    timingEn: '2 before Fajr, 4+2 at Dhuhr, 2 after Maghrib, 2 after Isha',
    detailEn:
      'The Messenger of Allah ﷺ said: Whoever consistently prays 12 rakats of Sunnah day and night, Allah will build a house for them in Paradise.',
    referenceEn: 'Sahih Muslim 728',
  },
  'sunnah-miswak-azkar': {
    categoryEn: 'Sunnah',
    titleEn: 'Morning & Evening Adhkar, Salawat & Using Miswak',
    timingEn: 'After Fajr & Asr, and before Wudu',
    detailEn:
      'Using Miswak before ablution, beginning honorable acts from the right, and reciting Ayat al-Kursi and the three Quls morning and evening.',
    referenceEn: 'Sahih al-Bukhari 887 · Hisn al-Muslim',
  },
  'sunnah-food-sleep': {
    categoryEn: 'Sunnah',
    titleEn: 'Eating with Bismillah & Sleeping with Wudu on the Right Side',
    timingEn: 'Meals & bedtime',
    detailEn:
      'Eating with the right hand, avoiding waste, thanking Allah afterward, and sleeping in a state of Wudu with Prophetic supplications.',
    referenceEn: 'Sahih al-Bukhari 5376, 6312',
  },
  'nafl-tahajjud': {
    categoryEn: 'Nafl (Voluntary)',
    titleEn: 'Tahajjud (Night Vigil), Ishraq & Duha Prayers',
    timingEn: 'Last third of night & after sunrise',
    detailEn:
      'After the obligatory prayers, the best prayer is the night vigil (Tahajjud); Duha prayer fulfills daily gratitude for every joint of the body.',
    referenceEn: 'Sahih Muslim 1163, 720',
  },
  'nafl-quran-sadaqah': {
    categoryEn: 'Nafl (Voluntary)',
    titleEn: 'Daily Quran Recitation, Voluntary Fasting & Secret Charity',
    timingEn: 'Daily, and Mondays & Thursdays',
    detailEn:
      'Reciting the Quran daily with reflection, giving quiet charity according to one’s means, and fasting on Mondays and Thursdays.',
    referenceEn: 'Jami at-Tirmidhi 747, 2910',
  },
};

export interface PillarDetailEn {
  indexEn: string;
  titleEn: string;
  summaryEn: string;
  quranVerseEn: string;
  quranRefEn: string;
  hadithEn: string;
  hadithRefEn: string;
  keyRulesEn: string[];
}

export const FIVE_PILLARS_EN: Record<string, PillarDetailEn> = {
  iman: {
    indexEn: '01',
    titleEn: 'Iman & Tawhid',
    summaryEn:
      'The foundation of Islam is believing in the heart, affirming with the tongue, and living by the Oneness of Allah (Tawhid) and the Prophethood of Muhammad ﷺ.',
    quranVerseEn:
      'The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers. All of them have believed in Allah and His angels and His books and His messengers.',
    quranRefEn: 'Surah Al-Baqarah 2:285',
    hadithEn:
      'Faith is to believe in Allah, His angels, His books, His messengers, the Last Day, and to believe in divine decree—both its good and its hardship.',
    hadithRefEn: 'Sahih Muslim (Hadith of Jibril, 8)',
    keyRulesEn: [
      'Tawhid ar-Rububiyyah: Affirming that Allah alone is Creator, Sustainer, and Sovereign.',
      'Tawhid al-Uluhiyyah: Directing all worship, prayer, and supplication exclusively to Allah.',
      'Tawhid al-Asma was-Sifat: Affirming Allah’s Beautiful Names and Attributes without distortion.',
      'Accepting the Quran and authentic Sunnah as the ultimate guide for life.',
    ],
  },
  salah: {
    indexEn: '02',
    titleEn: 'Salah (Prayer)',
    summaryEn:
      'After faith, the most vital pillar of Islam is establishing the five daily prayers—a direct spiritual connection between the servant and the Creator.',
    quranVerseEn:
      'Indeed, prayer prohibits immorality and wrongdoing, and the remembrance of Allah is greater.',
    quranRefEn: 'Surah Al-Ankabut 29:45',
    hadithEn:
      'The very first deed a servant will be called to account for on the Day of Resurrection is Salah. If it is sound, the rest of his deeds will succeed.',
    hadithRefEn: 'Jami at-Tirmidhi 413 · Sunan Abi Dawud 864',
    keyRulesEn: [
      'Preconditions: Purity of body, garments, and place, covering Awrah, facing Qiblah, proper time, and intention.',
      'Integral Pillars: Opening Takbir, standing, Quran recitation, Ruku (bowing), two Sujud (prostrations), and final sitting.',
      'Khushu (serenity and presence of heart) is the living spirit of prayer.',
    ],
  },
  sawm: {
    indexEn: '03',
    titleEn: 'Sawm (Fasting)',
    summaryEn:
      'Abstaining from food, drink, and marital relations from dawn until sunset throughout the blessed month of Ramadan solely for Allah’s pleasure to cultivate Taqwa.',
    quranVerseEn:
      'O you who believe, fasting has been prescribed upon you as it was prescribed upon those before you, so that you may attain Taqwa (God-consciousness).',
    quranRefEn: 'Surah Al-Baqarah 2:183',
    hadithEn:
      'Whoever fasts during Ramadan out of sincere faith and hoping for Allah’s reward will have all his previous sins forgiven.',
    hadithRefEn: 'Sahih al-Bukhari 38 · Sahih Muslim 760',
    keyRulesEn: [
      'Core pillars: Sincere intention and abstaining from eating, drinking, and intimacy from dawn to sunset.',
      'Guarding the tongue and character from falsehood, backbiting, and harm.',
      'Travelers and the ill are granted ease to make up missed days later.',
    ],
  },
  zakat: {
    indexEn: '04',
    titleEn: 'Zakat (Charity)',
    summaryEn:
      'When eligible net wealth meets or exceeds the Nisab threshold for a full lunar year, 2.5% is given to the eight Quranic categories of eligible recipients to purify wealth and uplift society.',
    quranVerseEn:
      'Take from their wealth a charity (Zakat) by which you purify them and cause them increase.',
    quranRefEn: 'Surah At-Tawbah 9:103',
    hadithEn:
      'Charity never decreases wealth; rather, Allah increases the servant in honor and blessing through it.',
    hadithRefEn: 'Sahih Muslim 2588 · Surah At-Tawbah 9:60',
    keyRulesEn: [
      'Nisab Threshold: Equivalent value of 87.48g of gold or 612.36g of silver held for one lunar year.',
      'Rate: 2.5% of total zakatable assets (cash, bank savings, gold/silver, trade inventory, investments) minus immediate debts.',
      'Recipients: The poor, the needy, Zakat administrators, reconciliation of hearts, freeing captives, debtors, in Allah’s cause, and stranded travelers.',
    ],
  },
  hajj: {
    indexEn: '05',
    titleEn: 'Hajj (Pilgrimage)',
    summaryEn:
      'Every physically and financially able Muslim is obligated to perform the pilgrimage to the Sacred House (Ka’bah) in Makkah at least once in a lifetime during Dhul-Hijjah.',
    quranVerseEn:
      'And pilgrimage to the House is a duty owed to Allah by all people who are able to make the journey.',
    quranRefEn: 'Surah Ali Imran 3:97',
    hadithEn:
      'Whoever performs Hajj for Allah and refrains from obscenity and sin returns as pure as the day his mother bore him.',
    hadithRefEn: 'Sahih al-Bukhari 1521 · Sahih Muslim 1350',
    keyRulesEn: [
      'Three core pillars: Entering Ihram, standing at Arafah (9th Dhul-Hijjah), and Tawaf al-Ifadah.',
      'Essential rites: Stay at Muzdalifah, Sa’i between Safa and Marwah, Rami at Jamarat, sacrifice (Tamattu/Qiran), and shaving/trimming hair.',
      'Hajj embodies universal human brotherhood, humility, and pure Tawhid.',
    ],
  },
};

export interface ProphetBioEn {
  orderEn: string;
  nameEn: string;
  titleEn: string;
  eraEn: string;
  quranMentionsEn: string;
  summaryEn: string;
  keyLessonsEn: string[];
}

export const PROPHETS_BIO_EN: Record<string, ProphetBioEn> = {
  adam: {
    orderEn: '01',
    nameEn: 'Prophet Adam (AS)',
    titleEn: 'Abul Bashar — Father of Humanity & First Prophet',
    eraEn: 'Dawn of Creation',
    quranMentionsEn: 'Mentioned 25 times in the Quran',
    summaryEn:
      'Allah created Adam (AS) with His own hands from clay and taught him the names of all things. His story—the angels’ prostration, Iblis’s arrogance, descent from Paradise, and sincere repentance accepted by Allah—opens the spiritual history of humankind.',
    keyLessonsEn: [
      'Human dignity is rooted in knowledge, moral responsibility, and stewardship.',
      'When we err, turning back in sincere repentance (Adam’s way) defeats arrogance (Iblis’s way).',
    ],
  },
  nuh: {
    orderEn: '02',
    nameEn: 'Prophet Nuh (AS)',
    titleEn: 'Shaykh al-Anbiya — Emblem of Patience & Dawah',
    eraEn: 'Ancient Mesopotamia',
    quranMentionsEn: 'Dedicated Surah Nuh (71)',
    summaryEn:
      'For 950 years, Prophet Nuh (AS) called his people day and night, privately and publicly, to worship Allah alone. Despite mockery and rejection, he built the Ark by divine command and saved the believers from the Great Flood.',
    keyLessonsEn: [
      'Never lose patience or compassion when calling people to truth.',
      'Allah’s aid is certain for those who persevere upon faith.',
    ],
  },
  ibrahim: {
    orderEn: '03',
    nameEn: 'Prophet Ibrahim (AS)',
    titleEn: 'Khalilullah — Friend of Allah & Patriarch of Monotheism',
    eraEn: 'Ur, Levant & Makkah',
    quranMentionsEn: 'Mentioned 69 times; Surah Ibrahim (14)',
    summaryEn:
      'From challenging idol worship with reason and surviving Nimrod’s fire to settling Hajar and Ismail (AS) in Makkah, passing the ultimate trial of sacrifice, and rebuilding the Sacred Ka’bah—Ibrahim’s life defines pure submission to Allah.',
    keyLessonsEn: [
      'Uncompromising commitment to Tawhid above blind tradition.',
      'Readiness to sacrifice what is dearest for the pleasure of Allah.',
    ],
  },
  yusuf: {
    orderEn: '04',
    nameEn: 'Prophet Yusuf (AS)',
    titleEn: 'Ahsan al-Qasas — Moral Integrity & Forgiveness',
    eraEn: 'Canaan & Egypt',
    quranMentionsEn: 'Surah Yusuf (12) — Complete narrative',
    summaryEn:
      'Cast into a well by his brothers, sold into slavery, imprisoned for refusing sin, and eventually raised to lead Egypt’s treasury through wisdom and patience—his story is named by Allah “the best of stories.”',
    keyLessonsEn: [
      'Guard moral purity and trust Allah in every hardship.',
      'Respond to betrayal with forgiveness and magnanimity once given authority.',
    ],
  },
  musa: {
    orderEn: '05',
    nameEn: 'Prophet Musa (AS)',
    titleEn: 'Kalimullah — Messenger of the Torah',
    eraEn: 'Egypt & Sinai',
    quranMentionsEn: 'Mentioned 136 times in the Quran',
    summaryEn:
      'Raised in Pharaoh’s palace yet chosen to liberate the Children of Israel from tyranny, Musa (AS) spoke directly with Allah at Mount Tur, witnessed the parting of the sea, and received the Torah.',
    keyLessonsEn: [
      'Stand courageously for truth and justice before oppressive power.',
      'In moments of crisis say: "Indeed, my Lord is with me; He will guide me."',
    ],
  },
  isa: {
    orderEn: '06',
    nameEn: 'Prophet Isa (AS)',
    titleEn: 'Ruhullah & Al-Masih — Messenger of the Injil',
    eraEn: 'Jerusalem / Palestine',
    quranMentionsEn: 'Mentioned 25 times; Surah Maryam (19)',
    summaryEn:
      'Miraculously born without a father to the chaste Maryam (AS), Isa (AS) spoke from the cradle, healed the blind and lepers by Allah’s leave, preached pure monotheism, and foretold the coming of the Final Messenger Ahmad ﷺ.',
    keyLessonsEn: [
      'Isa (AS) is a noble servant and Messenger of Allah, calling solely to One God.',
      'His example teaches humility, spiritual devotion, and steadfastness.',
    ],
  },
  muhammad: {
    orderEn: '07',
    nameEn: 'Prophet Muhammad ﷺ',
    titleEn: 'Seal of the Prophets & Mercy to All Worlds',
    eraEn: '570 – 632 CE (Makkah & Madinah)',
    quranMentionsEn: 'Surah Muhammad (47) & the entire Quran',
    summaryEn:
      'Born in Makkah in 570 CE and renowned as Al-Amin (the Trustworthy), he received the First Revelation (Iqra) at age 40 in Cave Hira, endured 13 years of persecution in Makkah, established a just constitutional society in Madinah, and transformed humanity in 23 years.',
    keyLessonsEn: [
      'Embody supreme mercy, forgiveness, and noble character (Khuluqin Azim).',
      'His Seerah and Sunnah remain the living moral compass for humanity until the Last Day.',
    ],
  },
};

export interface CaliphBioEn {
  orderEn: string;
  nameEn: string;
  titleEn: string;
  reignEn: string;
  achievementsEn: string[];
  quoteEn: string;
}

export const KHULAFA_RASHIDEEN_EN: Record<string, CaliphBioEn> = {
  abubakr: {
    orderEn: '1st Caliph',
    nameEn: 'Abu Bakr as-Siddiq (RA)',
    titleEn: 'As-Siddiq — The Truthful & First Caliph',
    reignEn: '632 – 634 CE (11 – 13 AH)',
    achievementsEn: [
      'Unified the Muslim Ummah during the gravest crisis following the Prophet’s ﷺ passing.',
      'Defended the integrity of Islam and stabilized the young Islamic state.',
      'Ordered the first complete compilation of the Holy Quran into a single written codex under Zayd ibn Thabit (RA).',
    ],
    quoteEn:
      '"I have been given authority over you, though I am not the best among you. If I do well, assist me; if I err, correct me."',
  },
  umar: {
    orderEn: '2nd Caliph',
    nameEn: 'Umar ibn al-Khattab (RA)',
    titleEn: 'Al-Faruq — Exemplar of Justice & Governance',
    reignEn: '634 – 644 CE (13 – 23 AH)',
    achievementsEn: [
      'Established public administration, Bayt al-Mal (public treasury), independent judiciary, and the Hijri calendar.',
      'Extended just governance across Persia, the Levant, Egypt, and Jerusalem.',
      'Instituted welfare stipends and personally patrolled at night to check on citizens.',
    ],
    quoteEn:
      '"If a lost sheep were to starve on the banks of the Euphrates, Umar would fear being questioned by Allah for it."',
  },
  uthman: {
    orderEn: '3rd Caliph',
    nameEn: 'Uthman ibn Affan (RA)',
    titleEn: 'Dhun-Nurayn — Paragon of Modesty & Generosity',
    reignEn: '644 – 656 CE (23 – 35 AH)',
    achievementsEn: [
      'Standardized and distributed official Quran manuscripts (Mushaf Uthmani) across Muslim provinces.',
      'Established the first Islamic navy and expanded Masjid an-Nabawi.',
      'Dedicated vast personal wealth to public welfare, such as purchasing the Well of Rumah for free public access.',
    ],
    quoteEn: '"Worry for this world darkens the heart, while concern for the Hereafter illuminates it."',
  },
  ali: {
    orderEn: '4th Caliph',
    nameEn: 'Ali ibn Abi Talib (RA)',
    titleEn: 'Asadullah & Gate of Knowledge — Wisdom & Integrity',
    reignEn: '656 – 661 CE (35 – 40 AH)',
    achievementsEn: [
      'Deep mastery of Quranic exegesis, jurisprudence, justice, and laid foundations for Arabic grammar (Nahw).',
      'Lived in austere simplicity and guarded public funds with absolute integrity.',
      'Preserved Islamic scholarship and moral principle amid turbulent civil trials.',
    ],
    quoteEn: '"People are of two kinds: either your brother in faith or your equal in humanity."',
  },
};

export interface ScholarBioEn {
  eraTagEn: string;
  nameEn: string;
  lifespanEn: string;
  contributionEn: string;
}

export const SCHOLARS_AND_SAINTS_EN: Record<string, ScholarBioEn> = {
  'hasan-basri': {
    eraTagEn: "Tabi'i",
    nameEn: 'Imam Hasan al-Basri (RH)',
    lifespanEn: '642 – 728 CE (21 – 110 AH)',
    contributionEn:
      'Renowned scholar of the Tabi’in generation who learned from many Companions; celebrated for deep Taqwa, eloquence, and spiritual counsel.',
  },
  'umar-abdul-aziz': {
    eraTagEn: "Tabi'i & Caliph",
    nameEn: 'Umar ibn Abd al-Aziz (RH)',
    lifespanEn: '682 – 720 CE (61 – 101 AH)',
    contributionEn:
      'Often revered as the Fifth Rightly-Guided Caliph; restored social justice, ended tyranny, and commissioned the official state compilation of Hadith.',
  },
  'abu-hanifa': {
    eraTagEn: "Tabi'i & Mujtahid",
    nameEn: 'Imam Abu Hanifah (RH)',
    lifespanEn: '699 – 767 CE (80 – 150 AH)',
    contributionEn:
      'Founder of the Hanafi legal school; systematized Islamic jurisprudence through consultative scholarly assemblies grounded in Quran and Sunnah.',
  },
  'malik-shafii-ahmad': {
    eraTagEn: "Atba' at-Tabi'in",
    nameEn: 'Imams Malik, Shafi’i & Ahmad (RH)',
    lifespanEn: '711 – 855 CE',
    contributionEn:
      'Anchored Hadith preservation and legal methodology (Usul al-Fiqh) through Al-Muwatta, Ar-Risalah, and Al-Musnad.',
  },
  bukhari: {
    eraTagEn: 'Muhaddith',
    nameEn: 'Imam Muhammad ibn Ismail al-Bukhari (RH)',
    lifespanEn: '810 – 870 CE (194 – 256 AH)',
    contributionEn:
      'Spent 16 years examining 600,000 narrations with strict chain-of-transmission verification to compile Sahih al-Bukhari.',
  },
  'ghazali-jilani': {
    eraTagEn: 'Spiritual Reformers',
    nameEn: 'Imam al-Ghazali & Shaykh Abd al-Qadir al-Jilani (RH)',
    lifespanEn: '1058 – 1166 CE',
    contributionEn:
      'Harmonized sacred law, intellect, and heart purification through Ihya Ulum ad-Din and spiritual renewal across the Muslim world.',
  },
};

export interface MuslimScientistEn {
  fieldEn: string;
  nameEn: string;
  eraEn: string;
  discoveryEn: string;
  legacyEn: string;
}

export const MUSLIM_SCIENTISTS_EN: Record<string, MuslimScientistEn> = {
  khwarizmi: {
    fieldEn: 'Mathematics & Computing',
    nameEn: 'Muhammad ibn Musa al-Khwarizmi',
    eraEn: '780 – 850 CE',
    discoveryEn:
      'His treatise "Al-Jabr wal-Muqabala" gave birth to the word Algebra, and the Latinization of his name gave us Algorithm.',
    legacyEn:
      'Popularized Hindu-Arabic numerals and the use of zero, forming the bedrock of modern mathematics and computer science.',
  },
  'ibn-haytham': {
    fieldEn: 'Physics & Optics',
    nameEn: 'Hasan ibn al-Haytham (Alhazen)',
    eraEn: '965 – 1040 CE',
    discoveryEn:
      'Proved in his seven-volume "Book of Optics" that vision occurs when light reflects off objects and enters the eye.',
    legacyEn:
      'Pioneered the camera obscura and the modern experimental Scientific Method based on testable hypotheses.',
  },
  'ibn-sina': {
    fieldEn: 'Medicine & Philosophy',
    nameEn: 'Ibn Sina (Avicenna)',
    eraEn: '980 – 1037 CE',
    discoveryEn:
      'His encyclopedic "Canon of Medicine" (Al-Qanun fit-Tibb) served as a standard medical textbook in Europe for nearly 600 years.',
    legacyEn:
      'Advanced quarantine methods, clinical pharmacology, and systematic empirical medicine.',
  },
  jabir: {
    fieldEn: 'Chemistry',
    nameEn: 'Jabir ibn Hayyan',
    eraEn: '721 – 815 CE',
    discoveryEn:
      'Pioneered laboratory distillation, crystallization, and described mineral acids including hydrochloric and nitric acids.',
    legacyEn: 'Widely recognized as the father of early experimental chemistry.',
  },
  biruni: {
    fieldEn: 'Astronomy & Geodesy',
    nameEn: 'Abu Rayhan al-Biruni',
    eraEn: '973 – 1048 CE',
    discoveryEn:
      'Calculated the Earth’s radius using mountain elevation and trigonometry with over 99% accuracy relative to modern measurements.',
    legacyEn: 'Pioneered comparative religion, geology, and observational astronomy.',
  },
  'fatima-fihri': {
    fieldEn: 'Higher Education',
    nameEn: 'Fatima al-Fihri',
    eraEn: '800 – 880 CE',
    discoveryEn:
      'Founded Al-Qarawiyyin in Fez, Morocco in 859 CE as a vibrant center of religious and scientific learning.',
    legacyEn:
      'Recognized by UNESCO and Guinness World Records as the oldest continuously operating degree-granting university in the world.',
  },
};

export interface ThoughtArticleEn {
  kickerEn: string;
  titleEn: string;
  leadEn: string;
  points: Array<{ heading: string; body: string; ref: string }>;
}

export const THOUGHT_ARTICLES_EN: Record<string, ThoughtArticleEn> = {
  'why-islam': {
    kickerEn: 'Dawah & Worldview',
    titleEn: 'Why Come Under the Shade of Islam?',
    leadEn:
      'Islam is not merely a set of rituals; it is the natural harmony between Creator and creation, offering inner serenity, moral clarity, and a balanced way of life.',
    points: [
      {
        heading: 'Preserved Revelation & Direct Connection with God',
        body: 'Islam liberates humanity from servitude to creation and connects every soul directly to the One Creator, with no intermediaries needed between servant and Lord.',
        ref: 'Surah Al-Ikhlas 112:1–4 · Surah Al-Hijr 15:9',
      },
      {
        heading: 'Human Equality & Tranquility of the Heart',
        body: 'Human honor is measured by righteousness and character—never race, class, or wealth. Remembering Allah calms the restless heart.',
        ref: 'Surah Ar-Ra’d 13:28 · Surah Al-Hujurat 49:13',
      },
      {
        heading: 'Balance Between This World and the Hereafter',
        body: 'Islam rejects both harsh monasticism and heedless materialism, nurturing honest livelihood, strong families, and eternal accountability.',
        ref: 'Surah Al-Baqarah 2:201 · Surah Al-Qasas 28:77',
      },
    ],
  },
  'mystery-of-creation': {
    kickerEn: 'Quranic Reflection',
    titleEn: 'The Purpose of Human Creation',
    leadEn:
      'Are human beings an accidental spark in an indifferent universe, or honored stewards fashioned with purpose by an All-Wise Creator?',
    points: [
      {
        heading: 'Knowing and Worshipping the Creator',
        body: 'Allah declares: "I did not create jinn and mankind except to worship Me." Worship means loving, knowing, and aligning all of life with His wisdom.',
        ref: 'Surah Adh-Dhariyat 51:56',
      },
      {
        heading: 'Best of Stature & Moral Stewardship',
        body: 'Created in the finest form (Ahsan Taqwim) with intellect, conscience, and free will, humanity is entrusted to uphold justice and mercy on earth.',
        ref: 'Surah At-Tin 95:4 · Surah Al-Baqarah 2:30',
      },
      {
        heading: 'Life and Death: A Test of Excellence',
        body: 'Allah created life and death to test who among us is finest in deeds (Ahsanu Amala) and sincerity.',
        ref: 'Surah Al-Mulk 67:2',
      },
    ],
  },
  'islam-in-daily-life': {
    kickerEn: 'Islam in Daily Life',
    titleEn: 'A Complete Islamic Day from Waking to Sleep',
    leadEn:
      'The beauty of Islam is that every ordinary daily habit—work, family care, rest—becomes worship when anchored in sincere intention and Prophetic grace.',
    points: [
      {
        heading: 'A Grateful Dawn & Gentleness at Home',
        body: 'Awakening to Fajr with gratitude, purifying oneself with Wudu, praying calmly, and greeting family with warmth and kindness.',
        ref: 'Sahih al-Bukhari 6312 · Jami at-Tirmidhi 1956',
      },
      {
        heading: 'Integrity at Work & Digital Etiquette',
        body: 'Honoring trusts in business or employment, guarding time, avoiding idle gossip, and maintaining modesty online and offline.',
        ref: 'Surah An-Nur 24:30 · Surah Al-Mu’minun 23:3',
      },
      {
        heading: 'Nightly Self-Reflection (Muhasabah)',
        body: 'Reviewing the day before sleeping, seeking forgiveness for shortcomings, and letting go of grudges so the heart rests in peace.',
        ref: 'Surah Al-Hashr 59:18',
      },
    ],
  },
};

export interface MasalaItemEn {
  topicEn: string;
  questionEn: string;
  answerEn: string;
  referenceEn: string;
}

export const MASAIL_QA_EN: Record<string, MasalaItemEn> = {
  'masala-wudu-blood': {
    topicEn: 'Purification & Wudu',
    questionEn: 'What are the primary nullifiers of Wudu (ablution)?',
    answerEn:
      'Anything exiting the private passages, passing wind, deep sleep while lying down or leaning, loss of consciousness, and—according to the Hanafi school—flowing blood or a mouthful of vomit nullify Wudu.',
    referenceEn: 'Surah Al-Ma’idah 5:6 · Fiqh as-Sunnah & Al-Hidayah',
  },
  'masala-missed-rakat': {
    topicEn: 'Prayer (Salah)',
    questionEn: 'If I join the Imam while he is in Ruku, does that Rakat count?',
    answerEn:
      'Yes. According to the majority of jurists, if a follower says the opening Takbir and joins Ruku calmly before the Imam rises from bowing, he has caught that Rakat.',
    referenceEn: 'Sahih al-Bukhari 783 · Sunan Abi Dawud 893',
  },
  'masala-zakat-gold': {
    topicEn: 'Zakat',
    questionEn: 'Is Zakat obligatory on personal gold jewelry?',
    answerEn:
      'In the Hanafi school, Zakat is obligatory on gold jewelry if it meets the Nisab threshold (87.48 grams) or when combined with silver, cash, or trade goods equals the silver Nisab (612.36 grams).',
    referenceEn: 'Sunan Abi Dawud 1563 · Fatawa Alamgiriyyah',
  },
  'masala-fasting-forget': {
    topicEn: 'Fasting (Sawm)',
    questionEn: 'Does eating or drinking forgetfully break the fast?',
    answerEn:
      'No. If a fasting person eats or drinks out of genuine forgetfulness, the fast remains valid. Upon remembering, one stops immediately and completes the fast with no make-up or expiation required.',
    referenceEn: 'Sahih al-Bukhari 1933 · Sahih Muslim 1155',
  },
  'masala-qaza-prayer': {
    topicEn: 'Prayer (Salah)',
    questionEn: 'What should be done if an obligatory prayer is missed?',
    answerEn:
      'Deliberately neglecting prayer is a grave sin. If a prayer is missed due to oversleeping, forgetfulness, or valid excuse, one must make it up (Qaza) as soon as one remembers or becomes able.',
    referenceEn: 'Sahih Muslim 684',
  },
  'masala-halal-earnings': {
    topicEn: 'Transactions & Ethics',
    questionEn: 'What is the ruling on interest (Riba) and bribery in work or business?',
    answerEn:
      'Both Riba (usury/interest) and bribery are strictly forbidden and major sins in Islam. The Prophet ﷺ strongly warned against giving, taking, recording, or witnessing interest-based transactions or bribery.',
    referenceEn: 'Surah Al-Baqarah 2:275 · Sahih Muslim 1598',
  },
};
