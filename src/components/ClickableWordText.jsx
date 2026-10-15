import React from 'react';
import { useWordLookup } from '../context/WordLookupContext';

export default function ClickableWordText({ 
  text = '', 
  choiceLetter = null, 
  onSelectChoice = null, 
  className = '' 
}) {
  const { isLookupEnabled, openLookup } = useWordLookup();

  if (!text || typeof text !== 'string') {
    return <span className={className}>{text}</span>;
  }

  // If lookup mode is disabled, render standard plain text
  if (!isLookupEnabled) {
    return <span className={className}>{text}</span>;
  }

  // Tokenize text into words and non-words (preserves whitespace and punctuation)
  const tokens = text.split(/([a-zA-Z0-9'’-]+|[^a-zA-Z0-9'’-]+)/).filter(Boolean);

  const handleWordClick = (word, e) => {
    e.stopPropagation(); // Prevent triggering parent choice selection immediately
    const rect = e.currentTarget.getBoundingClientRect();
    openLookup(word, {
      rect,
      choiceLetter,
      onSelectChoice
    });
  };

  return (
    <span className={className}>
      {tokens.map((token, idx) => {
        const isWord = /^[a-zA-Z0-9'’-]+$/.test(token) && /[a-zA-Z]/.test(token);

        if (isWord) {
          return (
            <span
              key={idx}
              onClick={(e) => handleWordClick(token, e)}
              className="cursor-pointer hover:bg-amber-200/70 hover:text-amber-950 rounded-sm px-0.5 transition-colors duration-150 underline decoration-indigo-300/40 hover:decoration-amber-600 decoration-1 underline-offset-2"
              title={`คลิกเพื่อดูความหมายและฟังเสียง: "${token}"`}
            >
              {token}
            </span>
          );
        }

        // Return whitespace and punctuation as normal text
        return <span key={idx}>{token}</span>;
      })}
    </span>
  );
}
