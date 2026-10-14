import { useState, useEffect, useCallback, useRef } from 'react';

// Helper to precompute word timing weights for speech pacing fallback
function computeWordTokens(text) {
  const tokens = [];
  const regex = /(\S+)/g;
  let match;
  let totalDuration = 0;

  while ((match = regex.exec(text)) !== null) {
    const word = match[0];
    const start = match.index;
    const end = start + word.length;

    // Weight calculation based on English phonetics and syllable length
    let duration = 220 + Math.max(0, word.length - 3) * 26;
    if (/[,;:]$/.test(word)) {
      duration += 190;
    } else if (/[.!?]$/.test(word)) {
      duration += 340;
    }

    tokens.push({
      word,
      start,
      end,
      timeStart: totalDuration,
      timeEnd: totalDuration + duration,
      duration
    });

    totalDuration += duration;
  }

  return { tokens, totalDuration };
}

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [charIndex, setCharIndex] = useState(-1);
  const [charLength, setCharLength] = useState(0);
  const [accent, setAccent] = useState('en-US'); // 'en-US' or 'en-GB'
  const [rate, setRate] = useState(1.0);
  const [voices, setVoices] = useState([]);
  
  const activeUtteranceRef = useRef(null);
  const pacerTimerRef = useRef(null);
  const startTimeRef = useRef(0);
  const tokensRef = useRef([]);
  const hasReceivedBoundaryRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available && available.length > 0) {
        setVoices(available);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (pacerTimerRef.current) {
        clearInterval(pacerTimerRef.current);
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (pacerTimerRef.current) {
      clearInterval(pacerTimerRef.current);
      pacerTimerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCurrentText('');
    setCharIndex(-1);
    setCharLength(0);
    hasReceivedBoundaryRef.current = false;
    activeUtteranceRef.current = null;
  }, []);

  const speak = useCallback((text, customAccent = null, customRate = null, onEndCallback = null) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('ขออภัย เบราว์เซอร์ของคุณยังไม่รองรับระบบเสียง Web Speech API');
      return;
    }

    // Clear previous timer and ongoing audio
    if (pacerTimerRef.current) {
      clearInterval(pacerTimerRef.current);
      pacerTimerRef.current = null;
    }
    window.speechSynthesis.cancel();

    const cleanText = (text || '').replace(/\r\n/g, '\n').trim();
    const targetAccent = customAccent || accent;
    const targetRate = customRate !== null ? customRate : rate;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = targetAccent;
    utterance.rate = targetRate;

    // Pick best matching voice
    if (voices.length > 0) {
      const match = voices.find(v => 
        v.lang.replace('_', '-').startsWith(targetAccent) &&
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online') || v.name.includes('Siri'))
      ) || voices.find(v => v.lang.replace('_', '-').startsWith(targetAccent.substring(0, 2)));

      if (match) utterance.voice = match;
    }

    // Precompute tokens for pacer fallback
    const { tokens } = computeWordTokens(cleanText);
    tokensRef.current = tokens;
    hasReceivedBoundaryRef.current = false;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentText(cleanText);
      setCharIndex(0);
      setCharLength(tokens[0] ? tokens[0].word.length : 4);

      // Start hybrid pacer timer (fallback if browser emits no onboundary events)
      startTimeRef.current = performance.now();
      pacerTimerRef.current = setInterval(() => {
        // If browser fired native onboundary events, let native event handle tracking
        if (hasReceivedBoundaryRef.current) return;

        const elapsed = (performance.now() - startTimeRef.current) * targetRate;
        const currentToken = tokensRef.current.find(t => elapsed >= t.timeStart && elapsed < t.timeEnd);
        
        if (currentToken) {
          setCharIndex(currentToken.start);
          setCharLength(currentToken.word.length);
        }
      }, 35);
    };

    // Native boundary event listener
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        hasReceivedBoundaryRef.current = true;
        const cIndex = event.charIndex;
        let cLen = event.charLength;
        if (!cLen || cLen <= 0) {
          const match = cleanText.slice(cIndex).search(/[\s.,!?;:()\[\]"']/);
          cLen = match !== -1 ? match : cleanText.length - cIndex;
        }
        setCharIndex(cIndex);
        setCharLength(cLen);
      }
    };

    const handleEnd = () => {
      if (pacerTimerRef.current) {
        clearInterval(pacerTimerRef.current);
        pacerTimerRef.current = null;
      }
      setIsSpeaking(false);
      setCurrentText('');
      setCharIndex(-1);
      setCharLength(0);
      hasReceivedBoundaryRef.current = false;
      activeUtteranceRef.current = null;
      if (onEndCallback) onEndCallback();
    };

    utterance.onend = handleEnd;
    utterance.onerror = handleEnd;

    activeUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [accent, rate, voices]);

  return {
    isSpeaking,
    currentText,
    charIndex,
    charLength,
    accent,
    setAccent,
    rate,
    setRate,
    speak,
    stop,
    voices
  };
}
