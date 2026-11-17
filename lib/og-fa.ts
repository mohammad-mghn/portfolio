/**
 * Persian text for share images.
 *
 * The image renderer (Satori) has no right-to-left layout and measures Arabic-script words by
 * their unjoined letter shapes, which leaves wide gaps. So this does the two jobs itself:
 *  1. shaping: each letter is replaced by its ready-made joined form (Unicode "presentation
 *     forms", which Vazirmatn contains), so every glyph has its real width;
 *  2. ordering: the line is emitted in visual order, left to right, with Latin words and numbers
 *     kept the right way round.
 * It handles what the site's copy uses (Persian letters, the هٔ mark, the half-space, digits,
 * embedded English names). It is not a full Unicode bidi implementation.
 */

// [isolated, final, initial, medial] for letters that join on both sides; [isolated, final] for
// letters that only join to the one before them. The Arabic block is laid out in order from U+FE80.
const FORMS = new Map<string, number[]>();
{
  let cp = 0xfe80;
  const add = (letters: string, counts: number[]) =>
    [...letters].forEach((letter, i) => {
      FORMS.set(letter, Array.from({ length: counts[i] }, (_, k) => cp + k));
      cp += counts[i];
    });
  add("ءآأؤإئابةتثجحخدذرزسشصضطظعغ", [1, 2, 2, 2, 2, 4, 2, 4, 2, 4, 4, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4]);
  add("فقكلمنهوىي", [4, 4, 4, 4, 4, 4, 4, 2, 2, 4]);
  // Persian letters live in a different block.
  for (const [letter, first, count] of [
    ["پ", 0xfb56, 4],
    ["چ", 0xfb7a, 4],
    ["ژ", 0xfb8a, 2],
    ["ک", 0xfb8e, 4],
    ["گ", 0xfb92, 4],
    ["ی", 0xfbfc, 4],
    ["ۀ", 0xfba4, 2],
  ] as const) {
    FORMS.set(letter, Array.from({ length: count }, (_, k) => first + k));
  }
}
/** لا and its variants are single glyphs: [isolated, final]. */
const LAM_ALEF: Record<string, [number, number]> = { آ: [0xfef5, 0xfef6], أ: [0xfef7, 0xfef8], إ: [0xfef9, 0xfefa], ا: [0xfefb, 0xfefc] };

const isMark = (c: string) => /[ً-ٰٟ]/.test(c);
const joinsBoth = (c: string) => (FORMS.get(c)?.length ?? 0) === 4;
const joinsPrev = (c: string) => (FORMS.get(c)?.length ?? 0) >= 2;
const LTR_RUN = /[A-Za-z0-9۰-۹٠-٩][A-Za-z0-9۰-۹٠-٩ .,٬٫+%:/#@&'’·-]*[A-Za-z0-9۰-۹٠-٩+%]|[A-Za-z0-9۰-۹٠-٩]/y;
const MIRROR: Record<string, string> = { "(": ")", ")": "(", "[": "]", "]": "[", "«": "»", "»": "«" };

/** One line of Persian text, shaped and in visual (left-to-right) order, ready to draw as plain text. */
export function shapeFa(text: string): string {
  const chars = [...text];
  // Units in logical order: a shaped letter with its marks, a whole Latin/number run, or one other character.
  const units: string[] = [];
  /** Whether the letter before position i (skipping marks) can join forward to it. */
  let prevJoins = false;

  for (let i = 0; i < chars.length; ) {
    const c = chars[i];

    LTR_RUN.lastIndex = chars.slice(0, i).join("").length;
    const run = FORMS.has(c) ? null : LTR_RUN.exec(text);
    if (run) {
      units.push(run[0]);
      i += [...run[0]].length;
      prevJoins = false;
      continue;
    }

    if (!FORMS.has(c)) {
      // The half-space (ZWNJ) only breaks joining; it draws nothing.
      if (c !== "‌") units.push(MIRROR[c] ?? c);
      prevJoins = false;
      i += 1;
      continue;
    }

    // Collect the letter's marks, and look at the next letter to decide the form.
    let j = i + 1;
    let marks = "";
    while (j < chars.length && isMark(chars[j])) marks += chars[j++];
    const next = chars[j];

    if (c === "ل" && next && LAM_ALEF[next]) {
      const [isolated, final] = LAM_ALEF[next];
      let k = j + 1;
      while (k < chars.length && isMark(chars[k])) marks += chars[k++];
      units.push(String.fromCodePoint(prevJoins ? final : isolated) + marks);
      prevJoins = false; // alef never joins forward
      i = k;
      continue;
    }

    const forms = FORMS.get(c)!;
    const joinNext = joinsBoth(c) && next !== undefined && joinsPrev(next);
    const joinPrev = prevJoins && joinsPrev(c);
    const form = joinPrev && joinNext ? forms[3] : joinPrev ? forms[1] : joinNext ? forms[2] : forms[0];
    units.push(String.fromCodePoint(form) + marks);
    prevJoins = joinNext;
    i = j;
  }

  return units.reverse().join("");
}

/** Breaks text into lines of at most `maxChars` characters at spaces, in reading order. */
export function wrapWords(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && [...candidate].length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}
