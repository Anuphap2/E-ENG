import { useState, useEffect, useRef, useCallback } from 'react';
import { splitIntoSentences, tokenizeSentence } from '../utils/sentenceSplitter';

export function useTrackPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(-1);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [sentences, setSentences] = useState([]);
  const [accent, setAccent] = useState('en-GB'); // default British for IELTS/UK tracks or en-US
  const [rate, setRate] = useState(1.0);
  const [voices, setVoices] = useState([]);

  const sentencesRef = useRef([]);
  const tokenizedSentencesRef = useRef([]);
  const activeUtteranceRef = useRef(null);
  const pacerTimerRef = useRef(null);
  const nextSentenceTimerRef = useRef(null);
  const startTimeRef = useRef(0);
  const hasBoundaryRef = useRef(false);
  const isPlayingAllRef = useRef(false);
  const accentRef = useRef(accent);
  const rateRef = useRef(rate);
  const voicesRef = useRef([]);

  // Keep refs in sync
  useEffect(() => {
    accentRef.current = accent;
  }, [accent]);

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  // Load voices on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const avail = window.speechSynthesis.getVoices();
      if (avail && avail.length > 0) {
        setVoices(avail);
        voicesRef.current = avail;
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      stop();
    };
  }, []);

  // Stop playback cleanly
  const stop = useCallback(() => {
    if (nextSentenceTimerRef.current) {
      clearTimeout(nextSentenceTimerRef.current);
      nextSentenceTimerRef.current = null;
    }
    if (pacerTimerRef.current) {
      clearInterval(pacerTimerRef.current);
      pacerTimerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isPlayingAllRef.current = false;
    setIsPlaying(false);
    setIsPlayingAll(false);
    setActiveSentenceIndex(-1);
    setActiveWordIndex(-1);
    activeUtteranceRef.current = null;
  }, []);

  // Set new track text and split into sentences
  const setTrackText = useCallback((text) => {
    stop();
    const parsedSentences = splitIntoSentences(text);
    const tokenized = parsedSentences.map(s => tokenizeSentence(s));

    sentencesRef.current = parsedSentences;
    tokenizedSentencesRef.current = tokenized;
    setSentences(parsedSentences);
  }, [stop]);

  // Play a specific sentence by index
  const playSentence = useCallback((index, overridePlayingAll = null) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('ขออภัย เบราว์เซอร์ของคุณยังไม่รองรับ Web Speech API');
      return;
    }

    if (overridePlayingAll !== null) {
      isPlayingAllRef.current = overridePlayingAll;
      setIsPlayingAll(overridePlayingAll);
    }

    // Clear ongoing timers
    if (nextSentenceTimerRef.current) {
      clearTimeout(nextSentenceTimerRef.current);
      nextSentenceTimerRef.current = null;
    }
    if (pacerTimerRef.current) {
      clearInterval(pacerTimerRef.current);
      pacerTimerRef.current = null;
    }
    window.speechSynthesis.cancel();

    const sentenceList = sentencesRef.current;
    if (!sentenceList || index < 0 || index >= sentenceList.length) {
      stop();
      return;
    }

    const sentenceText = sentenceList[index];
    const sentenceTokens = tokenizedSentencesRef.current[index]?.tokens || [];
    const targetAccent = accentRef.current;
    const targetRate = rateRef.current;

    setActiveSentenceIndex(index);
    setActiveWordIndex(0);
    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(sentenceText);
    utterance.lang = targetAccent;
    utterance.rate = targetRate;

    // Pick best matching voice
    const currentVoices = voicesRef.current;
    if (currentVoices.length > 0) {
      const match = currentVoices.find(v => 
        v.lang.replace('_', '-').startsWith(targetAccent) &&
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online') || v.name.includes('Siri'))
      ) || currentVoices.find(v => v.lang.replace('_', '-').startsWith(targetAccent.substring(0, 2)));

      if (match) utterance.voice = match;
    }

    hasBoundaryRef.current = false;

    utterance.onstart = () => {
      startTimeRef.current = performance.now();

      // Intra-sentence pacer timer
      // Calculates expected duration per word in this short sentence
      const totalSentenceWeight = tokenizedSentencesRef.current[index]?.totalWeight || 1000;
      
      pacerTimerRef.current = setInterval(() => {
        if (hasBoundaryRef.current) return;

        const elapsed = (performance.now() - startTimeRef.current) * targetRate;
        let cumulative = 0;
        let matchedWordIdx = 0;

        for (let i = 0; i < sentenceTokens.length; i++) {
          cumulative += sentenceTokens[i].weight;
          if (elapsed < cumulative) {
            matchedWordIdx = i;
            break;
          }
          matchedWordIdx = i;
        }

        setActiveWordIndex(matchedWordIdx);
      }, 30);
    };

    // Native word boundary support
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        hasBoundaryRef.current = true;
        const charIdx = event.charIndex;

        // Find which token covers this charIdx
        const foundIdx = sentenceTokens.findIndex(t => charIdx >= t.start && charIdx <= t.end);
        if (foundIdx !== -1) {
          setActiveWordIndex(foundIdx);
        }
      }
    };

    const handleSentenceEnd = () => {
      if (pacerTimerRef.current) {
        clearInterval(pacerTimerRef.current);
        pacerTimerRef.current = null;
      }

      if (isPlayingAllRef.current && index < sentenceList.length - 1) {
        // Natural 200ms breath pause between sentences
        nextSentenceTimerRef.current = setTimeout(() => {
          playSentence(index + 1);
        }, 220);
      } else {
        // Reached end of playback
        stop();
      }
    };

    utterance.onend = handleSentenceEnd;
    utterance.onerror = handleSentenceEnd;

    activeUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [stop]);

  // Play entire track sequentially from start (or from current sentence)
  const playAll = useCallback((startIndex = 0) => {
    stop();
    isPlayingAllRef.current = true;
    setIsPlayingAll(true);
    playSentence(startIndex, true);
  }, [stop, playSentence]);

  // Toggle play/pause
  const togglePlayAll = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      const startAt = activeSentenceIndex >= 0 ? activeSentenceIndex : 0;
      playAll(startAt);
    }
  }, [isPlaying, activeSentenceIndex, playAll, stop]);

  return {
    isPlaying,
    isPlayingAll,
    activeSentenceIndex,
    activeWordIndex,
    sentences,
    tokenizedSentences: tokenizedSentencesRef.current,
    setTrackText,
    playSentence,
    playAll,
    togglePlayAll,
    stop,
    accent,
    setAccent,
    rate,
    setRate
  };
}
