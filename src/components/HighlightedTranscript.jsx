import React, { useMemo, useEffect, useRef } from 'react';

export default function HighlightedTranscript({ 
  text = '', 
  charIndex = -1, 
  charLength = 0, 
  isSpeaking = false, 
  currentSpeakingText = '',
  autoScroll = true,
  className = ''
}) {
  const activeWordRef = useRef(null);

  // Parse text into individual word tokens with start and end positions
  const tokens = useMemo(() => {
    if (!text) return [];
    const result = [];
    // Regex matches non-whitespace sequence followed by any trailing spaces or newlines
    const regex = /(\S+)(\s*)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      result.push({
        word: match[1],
        space: match[2],
        start: match.index,
        end: match.index + match[1].length
      });
    }
    return result;
  }, [text]);

  // Relaxed check: is this transcript currently being spoken?
  const isTargetText = isSpeaking && charIndex >= 0 && (
    !currentSpeakingText ||
    currentSpeakingText.trim() === text.trim() ||
    currentSpeakingText.slice(0, 30) === text.slice(0, 30) ||
    text.slice(0, 30) === currentSpeakingText.slice(0, 30)
  );

  // Automatically scroll the active highlighted word into view
  useEffect(() => {
    if (isTargetText && autoScroll && activeWordRef.current) {
      activeWordRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [charIndex, isTargetText, autoScroll]);

  if (!tokens.length) {
    return <span className={className}>{text}</span>;
  }

  // Find the active token index
  let activeTokenIndex = -1;
  if (isTargetText && charIndex >= 0) {
    activeTokenIndex = tokens.findIndex((token, idx) => {
      // Direct hit within token bounds
      if (charIndex >= token.start && charIndex < token.end) return true;
      // If charIndex is between this token and the next token's start
      const nextToken = tokens[idx + 1];
      if (nextToken && charIndex >= token.start && charIndex < nextToken.start) return true;
      return false;
    });

    // Fallback: if charIndex is past the last token, mark the last token
    if (activeTokenIndex === -1 && charIndex >= tokens[tokens.length - 1].start) {
      activeTokenIndex = tokens.length - 1;
    }
  }

  return (
    <div className={`leading-relaxed text-sm select-text ${className}`}>
      {tokens.map((token, idx) => {
        const isCurrentWord = isTargetText && idx === activeTokenIndex;
        const isPastWord = isTargetText && activeTokenIndex !== -1 && idx < activeTokenIndex;

        return (
          <React.Fragment key={idx}>
            <span
              ref={isCurrentWord ? activeWordRef : null}
              className={`transition-all duration-75 ${
                isCurrentWord
                  ? 'bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-md shadow-md scale-110 inline-block mx-0.5 ring-2 ring-amber-300 ring-offset-1 ring-offset-slate-950 z-10'
                  : isPastWord
                    ? 'text-slate-100 font-medium'
                    : isTargetText
                      ? 'text-slate-400'
                      : 'text-slate-200'
              }`}
            >
              {token.word}
            </span>
            {token.space}
          </React.Fragment>
        );
      })}
    </div>
  );
}
