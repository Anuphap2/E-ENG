/**
 * Smart English Sentence Splitter
 * Preserves common academic & honorific abbreviations (Dr., Mr., Prof., etc.)
 * Splits cleanly on sentence endings for precise speech synchronization.
 */
export function splitIntoSentences(text) {
  if (!text) return [];

  let normalized = text.replace(/\r\n/g, '\n').trim();

  // Protect common abbreviations from being treated as sentence ends
  const abbrevs = [
    { regex: /\bMr\./gi, replace: 'Mr__DOT__' },
    { regex: /\bMrs\./gi, replace: 'Mrs__DOT__' },
    { regex: /\bMs\./gi, replace: 'Ms__DOT__' },
    { regex: /\bDr\./gi, replace: 'Dr__DOT__' },
    { regex: /\bProf\./gi, replace: 'Prof__DOT__' },
    { regex: /\bAssoc\.\s*Prof\./gi, replace: 'Assoc__DOT__ Prof__DOT__' },
    { regex: /\bvs\./gi, replace: 'vs__DOT__' },
    { regex: /\be\.g\./gi, replace: 'eg__DOT__' },
    { regex: /\bi\.e\./gi, replace: 'ie__DOT__' },
    { regex: /\betc\./gi, replace: 'etc__DOT__' },
    { regex: /\bNo\./gi, replace: 'No__DOT__' },
  ];

  for (const item of abbrevs) {
    normalized = normalized.replace(item.regex, item.replace);
  }

  // Split on dialogue line breaks first if present
  const lines = normalized.split('\n');
  const result = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Split on (. ! ?) followed by whitespace or quote and capitalized word
    const rawSentences = trimmedLine.split(/(?<=[.!?])(?:\s+)(?=[A-Z0-9"'])/);

    for (let part of rawSentences) {
      let s = part.trim();
      if (!s) continue;

      // Restore abbreviations
      s = s.replace(/Mr__DOT__/g, 'Mr.')
           .replace(/Mrs__DOT__/g, 'Mrs.')
           .replace(/Ms__DOT__/g, 'Ms.')
           .replace(/Dr__DOT__/g, 'Dr.')
           .replace(/Prof__DOT__/g, 'Prof.')
           .replace(/Assoc__DOT__/g, 'Assoc.')
           .replace(/vs__DOT__/g, 'vs.')
           .replace(/eg__DOT__/g, 'e.g.')
           .replace(/ie__DOT__/g, 'i.e.')
           .replace(/etc__DOT__/g, 'etc.')
           .replace(/No__DOT__/g, 'No.');

      result.push(s);
    }
  }

  return result.length > 0 ? result : [text];
}

/**
 * Splits a single sentence into words with timing weights
 */
export function tokenizeSentence(sentence) {
  const tokens = [];
  const regex = /(\S+)(\s*)/g;
  let match;
  let cumulativeWeight = 0;

  while ((match = regex.exec(sentence)) !== null) {
    const word = match[1];
    const space = match[2];

    // Character length base weight
    let weight = 180 + Math.max(0, word.length - 2) * 25;
    if (/[,;:]$/.test(word)) {
      weight += 150;
    } else if (/[.!?]$/.test(word)) {
      weight += 280;
    }

    tokens.push({
      word,
      space,
      weight,
      start: match.index,
      end: match.index + word.length
    });

    cumulativeWeight += weight;
  }

  return { tokens, totalWeight: cumulativeWeight };
}
