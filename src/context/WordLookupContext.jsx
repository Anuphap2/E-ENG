import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { lookupWord, fetchLiveTranslation } from '../utils/dictionary';

const WordLookupContext = createContext(null);

export function WordLookupProvider({ children, speech }) {
  const [isLookupEnabled, setIsLookupEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('eng_lookup_enabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [lookupData, setLookupData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [targetRect, setTargetRect] = useState(null);
  const [choiceContext, setChoiceContext] = useState(null);

  // Toggle lookup mode and persist
  const toggleLookupEnabled = useCallback(() => {
    setIsLookupEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('eng_lookup_enabled', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // Open lookup modal for a specific word
  const openLookup = useCallback(async (rawWord, options = {}) => {
    if (!rawWord || typeof rawWord !== 'string') return;
    const clean = rawWord.trim().replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
    if (!clean) return;

    if (options.rect) {
      setTargetRect(options.rect);
    } else {
      setTargetRect(null);
    }

    if (options.choiceLetter && options.onSelectChoice) {
      setChoiceContext({
        choiceLetter: options.choiceLetter,
        onSelectChoice: options.onSelectChoice
      });
    } else {
      setChoiceContext(null);
    }

    // First check local dictionary
    const localResult = lookupWord(clean);
    if (localResult) {
      setLookupData(localResult);
      setIsLoading(false);
      return;
    }

    // Fallback to live translation
    setIsLoading(true);
    setLookupData({
      word: clean,
      pos: 'loading',
      thai: 'กำลังค้นหาความหมายคำศัพท์...',
      ipa: '',
      example: '',
      tip: 'กำลังดึงข้อมูลคำศัพท์'
    });

    try {
      const liveResult = await fetchLiveTranslation(clean);
      setLookupData(liveResult || {
        word: clean,
        pos: 'word',
        thai: `[คำศัพท์: ${clean}] สามารถกดปุ่มลำโพงเพื่อฟังการออกเสียงภาษาอังกฤษ`,
        ipa: '',
        example: '',
        tip: 'คำศัพท์ในข้อสอบ'
      });
    } catch {
      setLookupData({
        word: clean,
        pos: 'word',
        thai: `[คำศัพท์: ${clean}]`,
        ipa: '',
        example: '',
        tip: 'กดฟังเสียงอ่านภาษาอังกฤษ'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Close the popup
  const closeLookup = useCallback(() => {
    setLookupData(null);
    setTargetRect(null);
    setChoiceContext(null);
  }, []);

  // Global double-click / text selection listener
  useEffect(() => {
    const handleSelection = (e) => {
      // Don't trigger if inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const selectedText = selection.toString().trim();
      // If user selected 1-3 words, allow quick lookup
      if (selectedText && selectedText.length > 1 && selectedText.length < 50 && /^[a-zA-Z\s'-]+$/.test(selectedText)) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        // Only trigger if lookup is enabled
        if (isLookupEnabled) {
          openLookup(selectedText, { rect });
        }
      }
    };

    window.addEventListener('mouseup', handleSelection);
    return () => window.removeEventListener('mouseup', handleSelection);
  }, [isLookupEnabled, openLookup]);

  return (
    <WordLookupContext.Provider
      value={{
        isLookupEnabled,
        setIsLookupEnabled,
        toggleLookupEnabled,
        lookupData,
        isLoading,
        targetRect,
        choiceContext,
        openLookup,
        closeLookup,
        speech
      }}
    >
      {children}
    </WordLookupContext.Provider>
  );
}

export function useWordLookup() {
  const context = useContext(WordLookupContext);
  if (!context) {
    throw new Error('useWordLookup must be used within a WordLookupProvider');
  }
  return context;
}
