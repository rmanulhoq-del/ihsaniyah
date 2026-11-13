/**
 * Tajweed-aware Arabic Uthmani -> Bengali phonetic pronunciation engine.
 * Directly reads Arabic letters and Harakat (Fatha, Kasra, Damma, Sukun, Shadda,
 * Tanween, Dagger Alif, Hamzatul Wasl, Sun/Moon letters, and Muqatta'at).
 */

const FATHA = '\u064E';
const DAMMA = '\u064F';
const KASRA = '\u0650';
const FATHATAN = '\u064B';
const DAMMATAN = '\u064C';
const KASRATAN = '\u064D';
const OPEN_FATHATAN = '\u08F0';
const OPEN_DAMMATAN = '\u08F1';
const OPEN_KASRATAN = '\u08F2';
const SHADDA = '\u0651';
const SUKUN = '\u0652';
const UTHMANI_SUKUN = '\u06E1';
const DAGGER_ALIF = '\u0670';
const MADDAH = '\u0653';
const HAMZA_ABOVE = '\u0654';
const HAMZA_BELOW = '\u0655';
const ALIF_WASLA = '\u0671';

// Quranic pause/tajweed annotation marks to strip before transliterating
const STOP_MARKS_REGEX = /[\u0610-\u061A\u06D6-\u06DC\u06DF-\u06E0\u06E2-\u06ED\u06EA-\u06ED]/g;

const CONSONANT_BASE: Record<string, string> = {
  '\u0628': 'ব', // ب
  '\u062A': 'ত', // ت
  '\u062B': 'স', // ث
  '\u062C': 'জ', // ج
  '\u062D': 'হ', // ح
  '\u062E': 'খ', // خ
  '\u062F': 'দ', // د
  '\u0630': 'য', // ذ
  '\u0631': 'র', // ر
  '\u0632': 'য', // ز
  '\u0633': 'স', // س
  '\u0634': 'শ', // ش
  '\u0635': 'স', // ص
  '\u0636': 'দ', // ض
  '\u0637': 'ত', // ط
  '\u0638': 'য', // ظ
  '\u0639': 'আ', // ع
  '\u063A': 'গ', // غ
  '\u0641': 'ফ', // ف
  '\u0642': 'ক্ব', // ق
  '\u0643': 'ক', // ك
  '\u0644': 'ল', // ل
  '\u0645': 'ম', // م
  '\u0646': 'ন', // ن
  '\u0647': 'হ', // ه
  '\u0629': 'ত', // ة
  '\u0648': 'ওয়', // و
  '\u064A': 'ইয়', // ي
  '\u0649': '', // ى
};

const MUQATTAAT_MAP: Record<string, string> = {
  'الم': 'আলিফ-লা-ম-মী-ম',
  'المص': 'আলিফ-লা-ম-মী-ম-সা-দ',
  'الر': 'আলিফ-লা-ম-রা-',
  'المر': 'আলিফ-লা-ম-মী-ম-রা-',
  'كهيعص': 'কা-ফ-হা--ইয়া--আইন-সা-দ',
  'طه': 'ত্বা--হা-',
  'طسم': 'ত্বা--সী-ন-মী-ম',
  'طس': 'ত্বা--সী-ন',
  'يس': 'ইয়া--সী-ন',
  'ص': 'সা-দ',
  'حم': 'হা--মী-ম',
  'عسق': 'আইন-সী-ন-ক্বা-ফ',
  'ق': 'ক্বা-ফ',
  'ن': 'নূ-ন',
};

function isDiacritic(ch: string): boolean {
  const code = ch.charCodeAt(0);
  return (
    (code >= 0x064b && code <= 0x065f) ||
    code === 0x0670 ||
    code === 0x06e1 ||
    (code >= 0x08f0 && code <= 0x08f2)
  );
}

function hasFathatan(d: string): boolean {
  return d.includes(FATHATAN) || d.includes(OPEN_FATHATAN);
}

function hasKasratan(d: string): boolean {
  return d.includes(KASRATAN) || d.includes(OPEN_KASRATAN);
}

function hasDammatan(d: string): boolean {
  return d.includes(DAMMATAN) || d.includes(OPEN_DAMMATAN);
}

function isSukun(diacritics: string): boolean {
  return diacritics.includes(SUKUN) || diacritics.includes(UTHMANI_SUKUN);
}

function stripAllDiacritics(s: string): string {
  return s.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u08F0-\u08F2]/g, '');
}

interface ParsedUnit {
  letter: string;
  diacritics: string;
}

function parseArabicWord(word: string): ParsedUnit[] {
  const units: ParsedUnit[] = [];
  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    if (isDiacritic(ch)) {
      if (units.length > 0) {
        units[units.length - 1].diacritics += ch;
      }
      continue;
    }
    units.push({ letter: ch, diacritics: '' });
  }
  return units;
}

function hasShortVowel(d: string): boolean {
  return (
    d.includes(FATHA) ||
    d.includes(KASRA) ||
    d.includes(DAMMA) ||
    hasFathatan(d) ||
    hasKasratan(d) ||
    hasDammatan(d) ||
    d.includes(DAGGER_ALIF)
  );
}

function attachVowelToConsonant(
  cons: string,
  letter: string,
  diacritics: string,
  nextUnit?: ParsedUnit,
  isWordEnd?: boolean,
  isAyahEnd?: boolean
): { text: string; consumedNext: boolean } {
  const isShadda = diacritics.includes(SHADDA);
  const base =
    letter === '\u0648' && isSukun(diacritics)
      ? 'ও'
      : letter === '\u064A' && isSukun(diacritics)
        ? 'ই'
        : cons;

  const doubled = isShadda
    ? base === 'ক্ব'
      ? 'ক্ক্ব'
      : base === 'ওয়'
        ? 'ওয়্ওয়'
        : base === 'ইয়'
          ? 'ইয়্ইয়'
          : `${base}্${base}`
    : base;

  const isPureVowelCarrier =
    letter === '\u0623' ||
    letter === '\u0625' ||
    letter === '\u0621' ||
    letter === '\u0624' ||
    letter === '\u0626' ||
    letter === '\u0622' ||
    letter === '\u0627' ||
    letter === '\u0671';

  if (letter === '\u0622') {
    return { text: 'আ-', consumedNext: false };
  }

  if (isPureVowelCarrier) {
    if (diacritics.includes(FATHA)) {
      if (nextUnit && (nextUnit.letter === '\u0627' || nextUnit.letter === '\u0649') && !hasShortVowel(nextUnit.diacritics)) {
        return { text: 'আ-', consumedNext: true };
      }
      if (nextUnit && nextUnit.letter === '\u0648' && isSukun(nextUnit.diacritics)) {
        return { text: 'আও', consumedNext: true };
      }
      if (nextUnit && nextUnit.letter === '\u064A' && isSukun(nextUnit.diacritics)) {
        return { text: 'আই', consumedNext: true };
      }
      return { text: 'আ', consumedNext: false };
    }
    if (diacritics.includes(KASRA)) {
      if (nextUnit && nextUnit.letter === '\u064A' && !hasShortVowel(nextUnit.diacritics)) {
        return { text: 'ঈ', consumedNext: true };
      }
      return { text: 'ই', consumedNext: false };
    }
    if (diacritics.includes(DAMMA)) {
      if (nextUnit && nextUnit.letter === '\u0648' && !hasShortVowel(nextUnit.diacritics)) {
        return { text: 'ঊ', consumedNext: true };
      }
      return { text: 'উ', consumedNext: false };
    }
    if (hasFathatan(diacritics)) return { text: 'আন', consumedNext: false };
    if (hasKasratan(diacritics)) return { text: 'ইন', consumedNext: false };
    if (hasDammatan(diacritics)) return { text: 'উন', consumedNext: false };
    if (diacritics.includes(DAGGER_ALIF)) return { text: 'আ-', consumedNext: false };
    if (letter === '\u0621' || isSukun(diacritics)) return { text: '’', consumedNext: false };
    return { text: '', consumedNext: false };
  }

  // Handle ع ('ayn)
  if (letter === '\u0639') {
    const prefix = isShadda ? '’' : '';
    if (diacritics.includes(DAGGER_ALIF)) {
      return { text: prefix + 'আ-', consumedNext: false };
    }
    if (diacritics.includes(FATHA)) {
      if (nextUnit && (nextUnit.letter === '\u0627' || nextUnit.letter === '\u0649') && !hasShortVowel(nextUnit.diacritics)) {
        return { text: prefix + 'আ-', consumedNext: true };
      }
      if (nextUnit && nextUnit.letter === '\u0648' && isSukun(nextUnit.diacritics)) {
        return { text: prefix + 'আও', consumedNext: true };
      }
      if (nextUnit && nextUnit.letter === '\u064A' && isSukun(nextUnit.diacritics)) {
        return { text: prefix + 'আই', consumedNext: true };
      }
      return { text: prefix + 'আ', consumedNext: false };
    }
    if (diacritics.includes(KASRA)) {
      if (nextUnit && nextUnit.letter === '\u064A' && !hasShortVowel(nextUnit.diacritics)) {
        return { text: prefix + 'ঈ', consumedNext: true };
      }
      return { text: prefix + 'ই', consumedNext: false };
    }
    if (diacritics.includes(DAMMA)) {
      if (nextUnit && nextUnit.letter === '\u0648' && !hasShortVowel(nextUnit.diacritics)) {
        return { text: prefix + 'ঊ', consumedNext: true };
      }
      return { text: prefix + 'উ', consumedNext: false };
    }
    if (hasFathatan(diacritics)) return { text: prefix + 'আন', consumedNext: false };
    if (hasKasratan(diacritics)) return { text: prefix + 'ইন', consumedNext: false };
    if (hasDammatan(diacritics)) return { text: prefix + 'উন', consumedNext: false };
    return { text: '’', consumedNext: false };
  }

  // Waqf (pause at end of Ayah): drop final short vowel on the last consonant
  if (isAyahEnd && !hasFathatan(diacritics) && !diacritics.includes(DAGGER_ALIF)) {
    const hasSingleShort =
      (diacritics.includes(FATHA) ||
        diacritics.includes(KASRA) ||
        diacritics.includes(DAMMA) ||
        hasKasratan(diacritics) ||
        hasDammatan(diacritics)) &&
      (!nextUnit ||
        (nextUnit.letter !== '\u0627' &&
          nextUnit.letter !== '\u0648' &&
          nextUnit.letter !== '\u064A' &&
          nextUnit.letter !== '\u0649'));
    if (hasSingleShort) {
      if (letter === '\u0629') return { text: 'হ', consumedNext: false };
      return { text: doubled, consumedNext: false };
    }
  }

  // 1. Dagger Alif (খাড়া জবর)
  if (diacritics.includes(DAGGER_ALIF)) {
    return { text: `${doubled}া-`, consumedNext: false };
  }

  // 2. Fatha (জবর)
  if (diacritics.includes(FATHA)) {
    if (
      nextUnit &&
      (nextUnit.letter === '\u0627' || nextUnit.letter === '\u0649') &&
      !hasShortVowel(nextUnit.diacritics) &&
      !isSukun(nextUnit.diacritics)
    ) {
      return { text: `${doubled}া-`, consumedNext: true };
    }
    if (nextUnit && nextUnit.letter === '\u0648' && isSukun(nextUnit.diacritics)) {
      return { text: `${doubled}াও`, consumedNext: true };
    }
    if (nextUnit && nextUnit.letter === '\u064A' && isSukun(nextUnit.diacritics)) {
      return { text: `${doubled}াই`, consumedNext: true };
    }
    if (letter === '\u0648') {
      return { text: isShadda ? 'ওয়্ওয়া' : 'ওয়া', consumedNext: false };
    }
    if (letter === '\u064A') {
      return { text: isShadda ? 'ইয়্ইয়া' : 'ইয়া', consumedNext: false };
    }
    return { text: `${doubled}া`, consumedNext: false };
  }

  // 3. Kasra (যের)
  if (diacritics.includes(KASRA)) {
    if (
      nextUnit &&
      (nextUnit.letter === '\u064A' || nextUnit.letter === '\u0649') &&
      !hasShortVowel(nextUnit.diacritics)
    ) {
      if (letter === '\u0648') return { text: 'ওয়ী', consumedNext: true };
      if (letter === '\u064A') return { text: 'ইয়ী', consumedNext: true };
      return { text: `${doubled}ী`, consumedNext: true };
    }
    if (letter === '\u0648') return { text: 'ওয়ি', consumedNext: false };
    if (letter === '\u064A') return { text: 'ইয়ি', consumedNext: false };
    return { text: `${doubled}ি`, consumedNext: false };
  }

  // 4. Damma (পেশ)
  if (diacritics.includes(DAMMA)) {
    if (nextUnit && nextUnit.letter === '\u0648' && !hasShortVowel(nextUnit.diacritics)) {
      if (letter === '\u0648') return { text: 'উ', consumedNext: true };
      if (letter === '\u064A') return { text: 'ইয়ূ', consumedNext: true };
      return { text: `${doubled}ূ`, consumedNext: true };
    }
    if (letter === '\u0648') return { text: 'উ', consumedNext: false };
    if (letter === '\u064A') return { text: 'ইয়ু', consumedNext: false };
    return { text: `${doubled}ু`, consumedNext: false };
  }

  // 5. Tanween
  if (hasFathatan(diacritics)) {
    const tail =
      nextUnit &&
      (nextUnit.letter === '\u0627' || nextUnit.letter === '\u0649') &&
      !hasShortVowel(nextUnit.diacritics);
    const baseSyllable =
      letter === '\u0648' ? 'ওয়ান' : letter === '\u064A' ? 'ইয়ান' : `${doubled}ান`;
    return { text: baseSyllable, consumedNext: Boolean(tail) };
  }
  if (hasKasratan(diacritics)) {
    const baseSyllable =
      letter === '\u0648' ? 'ওয়িন' : letter === '\u064A' ? 'ইয়িন' : `${doubled}িন`;
    return { text: baseSyllable, consumedNext: false };
  }
  if (hasDammatan(diacritics)) {
    const baseSyllable =
      letter === '\u0648' ? 'উন' : letter === '\u064A' ? 'ইয়ুন' : `${doubled}ুন`;
    return { text: baseSyllable, consumedNext: false };
  }

  // 6. Sukun or bare consonant at end
  if (isSukun(diacritics) || isWordEnd) {
    if (letter === '\u0648') return { text: 'ও', consumedNext: false };
    if (letter === '\u064A') return { text: 'ই', consumedNext: false };
    if (letter === '\u0629') return { text: 'হ', consumedNext: false };
    return { text: doubled, consumedNext: false };
  }

  return { text: '', consumedNext: false };
}

function transliterateWordUnits(
  units: ParsedUnit[],
  isJoinedFromPrevious: boolean,
  isLastWordInAyah: boolean
): { text: string; bridgeConsonant?: string } {
  const bare = stripAllDiacritics(units.map((u) => u.letter).join(''));
  if (MUQATTAAT_MAP[bare]) {
    return { text: MUQATTAAT_MAP[bare] };
  }

  // Handle "ٱل..." (Hamzatul Wasl + Al-) joined from previous word cleanly with a bridge consonant!
  // Example: بِسْمِ ٱلرَّحْمَٰنِ -> bridge 'র' onto previous word (বিসমিল্লাহির), then 'রাহমা-নি'
  // Example: رَبِّ ٱلْعَٰلَمِينَ -> bridge 'ল' onto previous word (রাব্বিল), then 'আ-লামীন'
  if (
    isJoinedFromPrevious &&
    units[0]?.letter === ALIF_WASLA &&
    units[1]?.letter === '\u0644' &&
    units[2]
  ) {
    const third = units[2];
    const isSun = third.diacritics.includes(SHADDA) && third.letter !== '\u0644';
    const isMoon = isSukun(units[1].diacritics);

    if (isSun) {
      const bridge = CONSONANT_BASE[third.letter] || '';
      // Render from units[2] WITHOUT shadda (since first copy bridged onto previous word!)
      const cloned = units.slice(2).map((u, idx) =>
        idx === 0 ? { ...u, diacritics: u.diacritics.replace(SHADDA, '') } : u
      );
      const rest = transliterateSimpleUnits(cloned, isLastWordInAyah);
      return { text: rest, bridgeConsonant: bridge };
    }

    if (isMoon) {
      const rest = transliterateSimpleUnits(units.slice(2), isLastWordInAyah);
      return { text: rest, bridgeConsonant: 'ল' };
    }
  }

  return { text: transliterateSimpleUnits(units, isLastWordInAyah, isJoinedFromPrevious) };
}

function transliterateSimpleUnits(
  units: ParsedUnit[],
  isLastWordInAyah: boolean,
  skipInitialWasl: boolean = false
): string {
  let out = '';
  let i = 0;

  while (i < units.length) {
    const cur = units[i];
    const next = units[i + 1];
    const isEnd = i === units.length - 1;
    const isAyahEnd = isLastWordInAyah && isEnd;

    if (
      i === 0 &&
      skipInitialWasl &&
      (cur.letter === ALIF_WASLA || (cur.letter === '\u0627' && !hasShortVowel(cur.diacritics)))
    ) {
      i++;
      continue;
    }

    // Start of utterance "ٱل" / "ال"
    if (
      i === 0 &&
      !skipInitialWasl &&
      (cur.letter === ALIF_WASLA || (cur.letter === '\u0627' && !hasShortVowel(cur.diacritics)))
    ) {
      if (next && next.letter === '\u0644') {
        if (units[i + 2]?.diacritics.includes(SHADDA)) {
          out += 'আ';
          i++;
          continue;
        } else {
          out += 'আল-';
          i += 2;
          continue;
        }
      }
      if (cur.letter === ALIF_WASLA) {
        const thirdHasDamma = units[i + 2]?.diacritics.includes(DAMMA);
        out += thirdHasDamma ? 'উ' : 'ই';
        i++;
        continue;
      }
    }

    // Silent Alif in plural verbs (e.g. آمَنُوا۟)
    if (
      cur.letter === '\u0627' &&
      !hasShortVowel(cur.diacritics) &&
      !cur.diacritics.includes(HAMZA_ABOVE) &&
      !cur.diacritics.includes(HAMZA_BELOW)
    ) {
      i++;
      continue;
    }

    // Small Waw / Ya post-pronoun madd
    if ((cur.letter === '\u06E5' || cur.letter === '\u06E6') && !hasShortVowel(cur.diacritics)) {
      i++;
      continue;
    }

    const cons = CONSONANT_BASE[cur.letter] ?? '';
    const res = attachVowelToConsonant(cons, cur.letter, cur.diacritics, next, isEnd, isAyahEnd);
    out += res.text;
    i += res.consumedNext ? 2 : 1;
  }

  return out;
}

/**
 * Converts an entire Arabic Quranic Ayah (Uthmani script) into accurate,
 * readable Bengali pronunciation respecting Fatha (আ-কার), Mad, Shadda,
 * Sun/Moon Al- bridging, Idgham with Lam/Ra, and Hamzatul Wasl joining.
 */
export function ayahArabicToBengali(arabicText: string): string {
  const cleaned = arabicText
    .replace(/\u0640/g, '')
    .replace(STOP_MARKS_REGEX, '')
    .replace(/[\u06DD\u06DE\u06E9]/g, '')
    .replace(MADDAH, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return '';

  const rawWords = cleaned.split(' ').filter(Boolean);
  const resultParts: string[] = [];

  for (let wIdx = 0; wIdx < rawWords.length; wIdx++) {
    const word = rawWords[wIdx];
    const units = parseArabicWord(word);
    if (units.length === 0) continue;

    const isLastWord = wIdx === rawWords.length - 1;
    const startsWithWasl = wIdx > 0 && units[0].letter === ALIF_WASLA;
    const bare = stripAllDiacritics(word);

    // Handle Allah / Lillah
    if (bare === 'الله' || bare === 'ٱلله') {
      const lastChar = units[units.length - 1];
      const endVowel = isLastWord
        ? 'হ'
        : lastChar.diacritics.includes(DAMMA)
          ? 'হু'
          : lastChar.diacritics.includes(KASRA)
            ? 'হি'
            : lastChar.diacritics.includes(FATHA)
              ? 'হা'
              : 'হ';
      const prev = resultParts[resultParts.length - 1] || '';
      const canJoinPrev = wIdx > 0 && /[ািীুূেো]$/.test(prev);
      if ((startsWithWasl || canJoinPrev) && resultParts.length > 0) {
        const shortenedPrev = prev.replace(/ী$/, 'ি').replace(/ূ$/, 'ু').replace(/া-$/, 'া');
        resultParts[resultParts.length - 1] = `${shortenedPrev}ল্লা-${endVowel}`;
      } else {
        resultParts.push(`আল্লা-${endVowel}`);
      }
      continue;
    }

    if (bare === 'لله') {
      resultParts.push('লিল্লা-হি');
      continue;
    }

    const res = transliterateWordUnits(units, startsWithWasl, isLastWord);

    // Idgham bila ghunnah: Tanween ending in 'ন' before Lam (ل) or Ra (ر)
    let finalResText = res.text;
    if (resultParts.length > 0 && (units[0]?.letter === '\u0644' || units[0]?.letter === '\u0631')) {
      const prev = resultParts[resultParts.length - 1];
      const bridgeChar = units[0].letter === '\u0644' ? 'ল' : 'র';
      if (/[িুা]ন$/.test(prev)) {
        resultParts[resultParts.length - 1] = prev.slice(0, -1) + bridgeChar;
        finalResText = finalResText.replace(new RegExp(`^${bridgeChar}্${bridgeChar}`), bridgeChar);
      }
    }

    if (res.bridgeConsonant && resultParts.length > 0) {
      const prev = resultParts[resultParts.length - 1];
      const shortenedPrev = prev.replace(/ী$/, 'ি').replace(/ূ$/, 'ু').replace(/া-$/, 'া');
      resultParts[resultParts.length - 1] = shortenedPrev + res.bridgeConsonant;
      resultParts.push(finalResText);
    } else if (startsWithWasl && resultParts.length > 0) {
      const prev = resultParts[resultParts.length - 1];
      const shortenedPrev = prev.replace(/ী$/, 'ি').replace(/ূ$/, 'ু').replace(/া-$/, 'া');
      resultParts[resultParts.length - 1] = shortenedPrev + finalResText;
    } else {
      resultParts.push(finalResText);
    }
  }

  return resultParts.join(' ');
}
