/**
 * Text normalization, tokenization, pagination, and citation matching algorithms.
 */

/**
 * Normalizes input text by removing null/undefined stringified artifacts and standardizing line breaks.
 *
 * @param {string} raw
 * @returns {string}
 */
export function normalizeText(raw = "") {
  if (!raw) return "";
  const cleaned = String(raw).replace(/\b(null|undefined)\b/gi, "");
  return cleaned
    .normalize("NFC")
    .replace(/\r\n|\r/g, "\n");
}

/**
 * Tokenizes text into individual words with exact character offset boundaries.
 *
 * @param {string} text
 * @returns {Array<{ value: string, startChar: number, endChar: number }>}
 */
export function tokenize(text) {
  const tokens = [];
  const re = /\S+/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    tokens.push({
      value: m[0],
      startChar: m.index,
      endChar: m.index + m[0].length - 1,
    });
  }
  return tokens;
}

/**
 * Splits token list into page segments based on words-per-page target.
 *
 * @param {Array<{ value: string, startChar: number, endChar: number }>} tokens
 * @param {number|number[]} wordsPerPageArray
 * @returns {Array<{ startWord: number, endWord: number, wordCount: number }>}
 */
export function paginate(tokens, wordsPerPageArray) {
  const pages = [];
  let currentIndex = 0;

  if (typeof wordsPerPageArray === "number") {
    while (currentIndex < tokens.length) {
      const endWord = Math.min(currentIndex + wordsPerPageArray, tokens.length);
      pages.push({
        startWord: currentIndex,
        endWord: endWord,
        wordCount: endWord - currentIndex,
      });
      currentIndex = endWord;
    }
  } else if (Array.isArray(wordsPerPageArray)) {
    for (let i = 0; i < wordsPerPageArray.length && currentIndex < tokens.length; i++) {
      const wordsInThisPage = wordsPerPageArray[i];
      const endWord = Math.min(currentIndex + wordsInThisPage, tokens.length);
      pages.push({
        startWord: currentIndex,
        endWord: endWord,
        wordCount: endWord - currentIndex,
      });
      currentIndex = endWord;
    }

    if (currentIndex < tokens.length && wordsPerPageArray.length > 0) {
      const lastWordsPerPage = wordsPerPageArray[wordsPerPageArray.length - 1];
      while (currentIndex < tokens.length) {
        const endWord = Math.min(currentIndex + lastWordsPerPage, tokens.length);
        pages.push({
          startWord: currentIndex,
          endWord: endWord,
          wordCount: endWord - currentIndex,
        });
        currentIndex = endWord;
      }
    }
  }

  return pages;
}

/**
 * Normalizes an Arabic or multilingual word token by stripping diacritics,
 * kashida, unifying alef/yaa/taa marbuta, and removing non-alphanumeric punctuation.
 *
 * @param {string} word
 * @returns {string} Clean base token
 */
export function normalizeArabicWord(word) {
  if (!word || typeof word !== "string") return "";
  return word
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/\u0640/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/[ىي]/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toLowerCase()
    .trim();
}

/**
 * Robust token-sequence locator for verbatim citations.
 * Performs multi-tiered matching across parsed book word tokens:
 * 1. Exact normalized token sequence matching
 * 2. Sliding sub-sequence matching with bidirectional expansion
 * 3. Fuzzy window matching (best score >= 65% for transcription variances)
 *
 * @param {Array<{ value: string, startChar: number, endChar: number }>} tokens
 * @param {string} rawSnippet
 * @returns {{ startTokenIdx: number, endTokenIdx: number } | null}
 */
export function findSnippetTokenRange(tokens, rawSnippet) {
  if (!tokens?.length || !rawSnippet || typeof rawSnippet !== "string") return null;

  const snippetWords = rawSnippet
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (snippetWords.length === 0) return null;

  const normSnippet = snippetWords.map(normalizeArabicWord).filter(Boolean);
  if (normSnippet.length === 0) return null;

  const totalTokens = tokens.length;
  const normTokens = new Array(totalTokens);
  for (let i = 0; i < totalTokens; i++) {
    normTokens[i] = normalizeArabicWord(tokens[i].value);
  }

  const k = normSnippet.length;

  // 1. Exact sequence matching across all tokens
  for (let i = 0; i <= totalTokens - k; i++) {
    let match = true;
    for (let j = 0; j < k; j++) {
      if (normTokens[i + j] !== normSnippet[j]) {
        match = false;
        break;
      }
    }
    if (match) {
      return { startTokenIdx: i, endTokenIdx: i + k - 1 };
    }
  }

  // 2. Sliding sub-sequence anchor match (anchor length >= 4 tokens)
  const anchorLen = Math.min(Math.max(4, Math.floor(k * 0.5)), k);
  if (anchorLen < k) {
    for (let startOffset = 0; startOffset <= k - anchorLen; startOffset += Math.max(1, Math.floor(anchorLen / 2))) {
      const anchor = normSnippet.slice(startOffset, startOffset + anchorLen);
      for (let i = 0; i <= totalTokens - anchorLen; i++) {
        let match = true;
        for (let j = 0; j < anchorLen; j++) {
          if (normTokens[i + j] !== anchor[j]) {
            match = false;
            break;
          }
        }
        if (match) {
          const matchStartInTokens = Math.max(0, i - startOffset);
          const matchEndInTokens = Math.min(totalTokens - 1, matchStartInTokens + k - 1);
          return { startTokenIdx: matchStartInTokens, endTokenIdx: matchEndInTokens };
        }
      }
    }
  }

  // 3. Fallback: Fuzzy window scoring (best match ratio >= 0.65)
  const windowSize = k;
  let bestScore = 0;
  let bestIdx = -1;

  for (let i = 0; i <= totalTokens - windowSize; i += Math.max(1, Math.floor(windowSize / 4))) {
    let hits = 0;
    for (let j = 0; j < windowSize; j++) {
      if (normTokens[i + j] && normTokens[i + j] === normSnippet[j]) {
        hits++;
      }
    }
    const score = hits / windowSize;
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }

  if (bestScore >= 0.65 && bestIdx !== -1) {
    return { startTokenIdx: bestIdx, endTokenIdx: Math.min(totalTokens - 1, bestIdx + windowSize - 1) };
  }

  return null;
}
