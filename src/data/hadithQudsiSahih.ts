export interface SahihQudsiItem {
  id: number;
  titleBn: string;
  titleEn: string;
  arabic: string;
  bengali: string;
  english: string;
  referenceBn: string;
  referenceEn: string;
}

/**
 * 100% Verified Sahih Hadith Qudsi exclusively from Sahih al-Bukhari and Sahih Muslim.
 */
export const SAHIH_HADITH_QUDSI: SahihQudsiItem[] = [
  {
    id: 1,
    titleBn: 'বান্দার ধারণার সাথে আল্লাহর আচরণ ও নৈকট্য',
    titleEn: "Allah's Closeness and Response to His Servant's Expectation",
    arabic:
      'أَنَا عِنْدَ ظَنِّ عَبْدِي بِي، وَأَنَا مَعَهُ إِذَا ذَكَرَنِي، فَإِنْ ذَكَرَنِي فِي نَفْسِهِ ذَكَرْتُهُ فِي نَفْسِي، وَإِنْ ذَكَرَنِي فِي مَلَإٍ ذَكَرْتُهُ فِي مَلَإٍ خَيْرٍ مِنْهُمْ، وَإِنْ تَقَرَّبَ إِلَيَّ بِشِبْرٍ تَقَرَّبْتُ إِلَيْهِ ذِرَاعًا',
    bengali:
      'মহান আল্লাহ বলেন: আমি আমার বান্দার ধারণার সাথে থাকি, যে ধারণা সে আমার প্রতি পোষণ করে। সে যখন আমাকে স্মরণ করে, আমি তার সাথে থাকি। সে যদি মনে মনে আমাকে স্মরণ করে, আমিও তাকে মনে মনে স্মরণ করি। সে যদি কোনো মজলিসে আমার কথা আলোচনা করে, তবে আমি তার চেয়েও উত্তম মজলিসে (ফেরেশতাদের মাঝে) তার আলোচনা করি। সে আমার দিকে এক বিঘত এগিয়ে এলে আমি তার দিকে এক হাত এগিয়ে যাই।',
    english:
      'Allah the Almighty says: "I am as My servant expects Me to be, and I am with him when he remembers Me. If he remembers Me in himself, I remember him in Myself; and if he remembers Me in an assembly, I remember him in an assembly better than it. And if he draws near to Me by a handspan, I draw near to him by an arm’s length."',
    referenceBn: 'সহীহ আল-বুখারী ৭৪০৫ · সহীহ মুসলিম ২৬৭৫',
    referenceEn: 'Sahih al-Bukhari 7405 · Sahih Muslim 2675',
  },
  {
    id: 2,
    titleBn: 'আল্লাহর ক্রোধের ওপর তাঁর রহমতের প্রাধান্য',
    titleEn: "Allah's Mercy Prevails Over His Wrath",
    arabic: 'لَمَّا قَضَى اللَّهُ الْخَلْقَ كَتَبَ فِي كِتَابِهِ فَهُوَ عِنْدَهُ فَوْقَ الْعَرْشِ: إِنَّ رَحْمَتِي غَلَبَتْ غَضَبِي',
    bengali:
      'রাসূলুল্লাহ ﷺ বলেছেন: আল্লাহ তাআলা যখন সৃষ্টিজগতের সৃষ্টি কাজ সমাপ্ত করেন, তখন তাঁর নিকট আরশের ওপর রক্ষিত কিতাবে লিখে রাখেন: “নিশ্চয়ই আমার রহমত আমার ক্রোধের ওপর প্রবল হয়ে রয়েছে।”',
    english:
      'The Messenger of Allah ﷺ said: "When Allah completed the creation, He wrote in His Book which is with Him above the Throne: My mercy prevails over My wrath."',
    referenceBn: 'সহীহ আল-বুখারী ৩১৯৪, ৭৫৫৩ · সহীহ মুসলিম ২৭৫১',
    referenceEn: 'Sahih al-Bukhari 3194, 7553 · Sahih Muslim 2751',
  },
  {
    id: 3,
    titleBn: 'জুলুম হারাম ও আল্লাহর ওপর পূর্ণ মুখাপেক্ষিতা',
    titleEn: 'Prohibition of Oppression and Complete Dependence on Allah',
    arabic:
      'يَا عِبَادِي إِنِّي حَرَّمْتُ الظُّلْمَ عَلَى نَفْسِي وَجَعَلْتُهُ بَيْنَكُمْ مُحَرَّمًا فَلَا تَظَالَمُوا، يَا عِبَادِي كُلُّكُمْ ضَالٌّ إِلَّا مَنْ هَدَيْتُهُ فَاسْتَهْدُونِي أَهْدِكُمْ، يَا عِبَادِي كُلُّكُمْ جَائِعٌ إِلَّا مَنْ أَطْعَمْتُهُ فَاسْتَطْعِمُونِي أُطْعِمْكُمْ',
    bengali:
      'মহান আল্লাহ বলেন: হে আমার বান্দাগণ! আমি নিজের ওপর জুলুম হারাম করেছি এবং তোমাদের মধ্যেও তা হারাম করে দিয়েছি। অতএব, তোমরা একে অপরের প্রতি জুলুম করো না। হে আমার বান্দাগণ! তোমরা সবাই পথভ্রষ্ট, কেবল যাকে আমি হেদায়াত দিই সে ব্যতীত; সুতরাং আমার কাছেই হেদায়াত চাও, আমি তোমাদের হেদায়াত দেব। হে আমার বান্দাগণ! তোমরা সবাই ক্ষুধার্ত, কেবল যাকে আমি আহার দিই সে ব্যতীত; অতএব আমার কাছেই রিজিক চাও, আমি তোমাদের আহার দেব।',
    english:
      'Allah says: "O My servants, I have forbidden oppression for Myself and have made it forbidden among you, so do not oppress one another. O My servants, all of you are astray except for those I have guided, so seek guidance from Me and I shall guide you. O My servants, all of you are hungry except for those I have fed, so seek food from Me and I shall feed you."',
    referenceBn: 'সহীহ মুসলিম ২৫৭৭',
    referenceEn: 'Sahih Muslim 2577',
  },
  {
    id: 4,
    titleBn: 'রোজার প্রতিদান স্বয়ং আল্লাহ দান করবেন',
    titleEn: 'Fasting Is Exclusively for Allah and He Rewards It',
    arabic:
      'كُلُّ عَمَلِ ابْنِ آدَمَ لَهُ إِلَّا الصِّيَامَ، فَإِنَّهُ لِي وَأَنَا أَجْزِي بِهِ، وَالصِّيَامُ جُنَّةٌ',
    bengali:
      'মহান আল্লাহ বলেন: আদম সন্তানের প্রতিটি আমল তার নিজের জন্য, কেবল রোজা ব্যতীত; কেননা রোজা আমারই জন্য এবং আমি নিজেই এর প্রতিদান দেব। আর রোজা হলো (জাহান্নাম ও গুনাহ থেকে) ঢালস্বরূপ।',
    english:
      'Allah says: "Every deed of the son of Adam is for him except fasting; it is for Me and I shall reward for it. And fasting is a shield."',
    referenceBn: 'সহীহ আল-বুখারী ১৯০৪, ৭৪৯২ · সহীহ মুসলিম ১১৫১',
    referenceEn: 'Sahih al-Bukhari 1904, 7492 · Sahih Muslim 1151',
  },
  {
    id: 5,
    titleBn: 'নেক বান্দাদের জন্য জান্নাতের অকল্পনীয় নিয়ামত',
    titleEn: 'Unimaginable Blessings Prepared for the Righteous',
    arabic:
      'أَعْدَدْتُ لِعِبَادِي الصَّالِحِينَ مَا لَا عَيْنٌ رَأَتْ، وَلَا أُذُنٌ سَمِعَتْ، وَلَا خَطَرَ عَلَى قَلْبِ بَشَرٍ',
    bengali:
      'মহান আল্লাহ বলেন: আমি আমার সৎকর্মশীল বান্দাদের জন্য এমন নিয়ামত প্রস্তুত করে রেখেছি, যা কোনো চোখ কখনো দেখেনি, কোনো কান কখনো শোনেনি এবং কোনো মানুষের হৃদয়ে কখনো কল্পনাও জাগেনি।',
    english:
      'Allah says: "I have prepared for My righteous servants what no eye has seen, no ear has heard, and what has never occurred to the heart of any human being."',
    referenceBn: 'সহীহ আল-বুখারী ৩২৪৪ · সহীহ মুসলিম ২৮২৪',
    referenceEn: 'Sahih al-Bukhari 3244 · Sahih Muslim 2824',
  },
  {
    id: 6,
    titleBn: 'আল্লাহর অলির মর্যাদা ও নফল ইবাদতের মাধ্যমে নৈকট্য',
    titleEn: 'Honoring the Friends of Allah and Drawing Near Through Voluntary Worship',
    arabic:
      'مَنْ عَادَى لِي وَلِيًّا فَقَدْ آذَنْتُهُ بِالْحَرْبِ، وَمَا تَقَرَّبَ إِلَيَّ عَبْدِي بِشَيْءٍ أَحَبَّ إِلَيَّ مِمَّا افْتَرَضْتُ عَلَيْهِ، وَمَا يَزَالُ عَبْدِي يَتَقَرَّبُ إِلَيَّ بِالنَّوَافِلِ حَتَّى أُحِبَّهُ',
    bengali:
      'মহান আল্লাহ বলেন: যে ব্যক্তি আমার কোনো অলির (প্রিয় বান্দার) সাথে শত্রুতা করে, আমি তার বিরুদ্ধে যুদ্ধ ঘোষণা করি। আমার বান্দা যেসব আমল দ্বারা আমার নৈকট্য লাভ করে, তার মধ্যে আমার কাছে সবচেয়ে প্রিয় হলো আমি তার ওপর যা ফরজ করেছি তা পালন করা। আর আমার বান্দা নফল ইবাদতের মাধ্যমে ক্রমাগত আমার নিকটবর্তী হতে থাকে, এমনকি আমি তাকে ভালোবেসে ফেলি।',
    english:
      'Allah says: "Whoever shows enmity to a friend of Mine, I have declared war upon him. My servant does not draw near to Me with anything more beloved to Me than the religious duties I have obligated upon him; and My servant continues to draw near to Me with voluntary deeds until I love him."',
    referenceBn: 'সহীহ আল-বুখারী ৬৫০২',
    referenceEn: 'Sahih al-Bukhari 6502',
  },
  {
    id: 7,
    titleBn: 'রাতের শেষ তৃতীয়াংশে আল্লাহর বিশেষ আহ্বান',
    titleEn: 'The Divine Call in the Last Third of the Night',
    arabic:
      'يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الْآخِرُ يَقُولُ: مَنْ يَدْعُونِي فَأَسْتَجِيبَ لَهُ، مَنْ يَسْأَلُنِي فَأُعْطِيَهُ، مَنْ يَسْتَغْفِرُنِي فَأَغْفِرَ لَهُ',
    bengali:
      'রাসূলুল্লাহ ﷺ বলেছেন: আমাদের বরকতময় মহান রব প্রতি রাতের শেষ তৃতীয়াংশ বাকি থাকতে দুনিয়ার আকাশে অবতরণ করেন এবং ঘোষণা করেন: কে আছো আমাকে ডাকবে? আমি তার ডাকে সাড়া দেব। কে আছো আমার কাছে চাইবে? আমি তাকে দান করব। কে আছো আমার কাছে ক্ষমা চাইবে? আমি তাকে ক্ষমা করে দেব।',
    english:
      'The Prophet ﷺ said: "Our Lord descends every night to the lowest heaven when one-third of the night remains, saying: Who will call upon Me, that I may answer him? Who will ask of Me, that I may give him? Who will seek My forgiveness, that I may forgive him?"',
    referenceBn: 'সহীহ আল-বুখারী ১১৪৫, ৭৪৯৪ · সহীহ মুসলিম ৭৫৮',
    referenceEn: 'Sahih al-Bukhari 1145, 7494 · Sahih Muslim 758',
  },
  {
    id: 8,
    titleBn: 'নেক নিয়তের মর্যাদা ও গুনাহের প্রতিদানে দয়া',
    titleEn: 'Reward for Good Intentions and Restraint from Evil',
    arabic:
      'إِنَّ اللَّهَ كَتَبَ الْحَسَنَاتِ وَالسَّيِّئَاتِ ثُمَّ بَيَّنَ ذَلِكَ، فَمَنْ هَمَّ بِحَسَنَةٍ فَلَمْ يَعْمَلْهَا كَتَبَهَا اللَّهُ لَهُ عِنْدَهُ حَسَنَةً كَامِلَةً، فَإِنْ هُوَ هَمَّ بِهَا فَعَمِلَهَا كَتَبَهَا اللَّهُ لَهُ عِنْدَهُ عَشْرَ حَسَنَاتٍ إِلَى سَبْعِ مِائَةِ ضِعْفٍ',
    bengali:
      'মহান আল্লাহ নেকী ও গুনাহসমূহ নির্ধারণ করে তা স্পষ্ট করে দিয়েছেন। যে ব্যক্তি কোনো নেক কাজের ইচ্ছা করে কিন্তু তা করতে পারেনি, আল্লাহ তার জন্য একটি পূর্ণ নেকী লিখে দেন। আর ইচ্ছা করার পর যদি সে কাজটি বাস্তবায়ন করে, তবে আল্লাহ তার জন্য দশ থেকে সাতশত গুণ, এমনকি তারও বহুগুণ নেকী লিখে দেন। আর যে ব্যক্তি গুনাহের ইচ্ছা করে কিন্তু (আল্লাহর ভয়ে) তা না করে, আল্লাহ তার জন্য একটি পূর্ণ নেকী লিখেন।',
    english:
      'Allah has recorded the good deeds and the evil deeds and then clarified them: "Whoever intends to do a good deed and does not do it, Allah records it for him as a complete good deed; and if he intends it and carries it out, Allah records it as ten good deeds up to seven hundred times or more."',
    referenceBn: 'সহীহ আল-বুখারী ৬৪৯১ · সহীহ মুসলিম ১৩১',
    referenceEn: 'Sahih al-Bukhari 6491 · Sahih Muslim 131',
  },
  {
    id: 9,
    titleBn: 'গুনাহগার বান্দার তাওবা ও আল্লাহর ক্ষমা',
    titleEn: 'Sincere Repentance and Allah’s Readiness to Forgive',
    arabic:
      'أَذْنَبَ عَبْدٌ ذَنْبًا فَقَالَ: اللَّهُمَّ اغْفِرْ لِي ذَنْبِي، فَقَالَ تَبَارَكَ وَتَعَالَى: أَذْنَبَ عَبْدِي ذَنْبًا فَعَلِمَ أَنَّ لَهُ رَبًّا يَغْفِرُ الذَّنْبَ وَيَأْخُذُ بِالذَّنْبِ، قَدْ غَفَرْتُ لِعَبْدِي',
    bengali:
      'এক বান্দা গুনাহ করে বলল: “হে আল্লাহ! আমার গুনাহ ক্ষমা করে দিন।” তখন মহান আল্লাহ বলেন: আমার বান্দা গুনাহ করেছে এবং জেনেছে যে তার একজন রব আছেন, যিনি গুনাহ ক্ষমা করেন ও গুনাহের কারণে পাকড়াও করেন—আমি আমার বান্দাকে ক্ষমা করে দিলাম। অতঃপর সে আবার গুনাহ করে ক্ষমা চাইলে আল্লাহ প্রতিবার তার অনুশোচনা ও ঈমানের কারণে তাকে ক্ষমা করে দেন।',
    english:
      'A servant committed a sin and said: "O Allah, forgive my sin." Allah the Almighty said: "My servant has committed a sin and knows that he has a Lord who forgives the sin and punishes for it; I have forgiven My servant."',
    referenceBn: 'সহীহ আল-বুখারী ৭৫০৭ · সহীহ মুসলিম ২৭৫৮',
    referenceEn: 'Sahih al-Bukhari 7507 · Sahih Muslim 2758',
  },
  {
    id: 10,
    titleBn: 'মানবসেবা ও সৃষ্টির প্রতি দয়ার মাধ্যমে আল্লাহর সন্তুষ্টি',
    titleEn: 'Serving Humanity and Caring for the Sick and Needy',
    arabic:
      'إِنَّ اللَّهَ عَزَّ وَجَلَّ يَقُولُ يَوْمَ الْقِيَامَةِ: يَا ابْنَ آدَمَ مَرِضْتُ فَلَمْ تَعُدْنِي، قَالَ: يَا رَبِّ كَيْفَ أَعُودُكَ وَأَنْتَ رَبُّ الْعَالَمِينَ؟ قَالَ: أَمَا عَلِمْتَ أَنَّ عَبْدِي فُلَانًا مَرِضَ فَلَمْ تَعُدْهُ، أَمَا عَلِمْتَ أَنَّكَ لَوْ عُدْتَهُ لَوَجَدْتَنِي عِنْدَهُ',
    bengali:
      'কেয়ামতের দিন মহান আল্লাহ বলবেন: হে আদম সন্তান! আমি অসুস্থ ছিলাম, তুমি আমাকে দেখতে যাওনি। বান্দা বলবে: হে আমার রব! আপনি তো জগতসমূহের প্রতিপালক, আমি আপনাকে কীভাবে দেখতে যাব? আল্লাহ বলবেন: তুমি কি জানতে না যে আমার অমুক বান্দা অসুস্থ ছিল, অথচ তুমি তার খোঁজ নাওনি? তুমি যদি তাকে দেখতে যেতে, তবে আমাকে সেখানেই (তাঁর অনুগ্রহ ও সন্তুষ্টি হিসেবে) পেতে।',
    english:
      'Allah will say on the Day of Resurrection: "O son of Adam, I fell ill and you did not visit Me." He will say: "O Lord, how could I visit You when You are the Lord of the worlds?" Allah will say: "Did you not know that My servant so-and-so fell ill and you did not visit him? Had you visited him, you would have found Me with him."',
    referenceBn: 'সহীহ মুসলিম ২৫৬৯',
    referenceEn: 'Sahih Muslim 2569',
  },
  {
    id: 11,
    titleBn: 'কালকে (সময়কে) গালি না দেওয়া—সময়ের মালিক আল্লাহ',
    titleEn: 'Do Not Curse Time—Allah Is the Controller of Time',
    arabic: 'قَالَ اللَّهُ عَزَّ وَجَلَّ: يُؤْذِينِي ابْنُ آدَمَ يَسُبُّ الدَّهْرَ وَأَنَا الدَّهْرُ، بِيَدِي الْأَمْرُ، أُقَلِّبُ اللَّيْلَ وَالنَّهَارَ',
    bengali:
      'মহান আল্লাহ বলেন: আদম সন্তান আমাকে কষ্ট দেয় যখন সে কাল বা সময়কে গালি দেয়; অথচ আমিই কাল (সময়ের স্রষ্টা ও নিয়ন্ত্রক)। সকল বিষয় আমারই হাতে; আমিই রাত ও দিনের পরিবর্তন ঘটাই।',
    english:
      'Allah says: "The son of Adam harms Me by abusing time, whereas I am the Controller of Time; in My hand are all affairs, and I alternate the night and the day."',
    referenceBn: 'সহীহ আল-বুখারী ৪৮২৬, ৭৪৯১ · সহীহ মুসলিম ২২৪৬',
    referenceEn: 'Sahih al-Bukhari 4826, 7491 · Sahih Muslim 2246',
  },
  {
    id: 12,
    titleBn: 'অর্থ ব্যয় ও দানশীলতায় আল্লাহর প্রশস্ত অনুগ্রহ',
    titleEn: 'Spend in Charity and Allah Will Spend Upon You',
    arabic: 'قَالَ اللَّهُ تَبَارَكَ وَتَعَالَى: يَا ابْنَ آدَمَ أَنْفِقْ أُنْفِقْ عَلَيْكَ',
    bengali:
      'মহান আল্লাহ বলেন: হে আদম সন্তান! তুমি (সৎপথে) ব্যয় করো, আমি তোমার ওপর (রিজিক ও বরকত) ব্যয় করব।',
    english:
      'Allah the Blessed and Exalted says: "O son of Adam, spend (in charity), and I shall spend upon you."',
    referenceBn: 'সহীহ আল-বুখারী ৫৩৫২ · সহীহ মুসলিম ৯৯৩',
    referenceEn: 'Sahih al-Bukhari 5352 · Sahih Muslim 993',
  },
];
