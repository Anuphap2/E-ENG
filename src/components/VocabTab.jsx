import React, { useState, useEffect, useMemo, useRef } from 'react';
import { vocabData } from '../data/vocabData';
import confetti from 'canvas-confetti';
import { 
  Bookmark, 
  Search, 
  Volume2, 
  VolumeX, 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  LayoutGrid,
  CreditCard,
  Circle,
  RotateCcw,
  BookOpen,
  Filter,
  Check,
  Flame,
  Zap,
  Trophy,
  Lightbulb,
  Gamepad2,
  Timer,
  Star,
  Clock,
  Type,
  FileText,
  Brain,
  ArrowRight
} from 'lucide-react';

// Web Audio API Sound Synthesizer (100% offline, zero latency, zero dependencies)
const playSound = (type, enabled = true) => {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'flip') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(560, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } else if (type === 'correct') {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const startTime = ctx.currentTime + idx * 0.045;
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.17);
      });
    } else if (type === 'wrong') {
      [220, 196].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        const startTime = ctx.currentTime + idx * 0.07;
        gain.gain.setValueAtTime(0.06, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.15);
      });
    } else if (type === 'match') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } else if (type === 'fanfare') {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const startTime = ctx.currentTime + idx * 0.055;
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.29);
      });
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }
  } catch (err) {
    // AudioContext blocked or unsupported - ignore gracefully
  }
};

// Level Tiers for Gamification
const LEVEL_TIERS = [
  { level: 1, title: '🌱 Novice Hunter', minXp: 0, maxXp: 150 },
  { level: 2, title: '⚡ Word Explorer', minXp: 150, maxXp: 400 },
  { level: 3, title: '⚔️ Exam Scholar', minXp: 400, maxXp: 800 },
  { level: 4, title: '🏆 Vocab Slayer', minXp: 800, maxXp: 1400 },
  { level: 5, title: '👑 Master Linguist', minXp: 1400, maxXp: 2200 },
  { level: 6, title: '🌌 English Legend', minXp: 2200, maxXp: 999999 }
];

const getCurrentLevel = (xp) => {
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_TIERS[i].minXp) {
      return LEVEL_TIERS[i];
    }
  }
  return LEVEL_TIERS[0];
};

// Helper: Blank out target word in sentence for hint / cloze mode
const getBlankedSentence = (sentence, word) => {
  if (!sentence || !word) return '';
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\w*\\b`, 'gi');
  if (regex.test(sentence)) {
    return sentence.replace(regex, '[ ________ ]');
  }
  const fallbackRegex = new RegExp(escaped, 'gi');
  return sentence.replace(fallbackRegex, '[ ________ ]');
};

export default function VocabTab({ speech, globalSoundEnabled = true, onAddGlobalXp }) {
  // Modes: 
  // 'single'   = Flashcards 1 by 1
  // 'rush'     = Speed Rush (4-Choice Rapid Fire with 60s countdown)
  // 'sentence' = Sentence Master (Exam Cloze fill-in-the-blank)
  // 'match'    = Speed Match (6 vs 6 matching arena)
  // 'scramble' = Word Scramble (Letter tile spelling decoder)
  // 'grid'     = Full 160-word searchable table
  const [mode, setMode] = useState('single');

  // Shared Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [masteredWords, setMasteredWords] = useState(new Set());
  const [filterNeedsReview, setFilterNeedsReview] = useState(false);
  const [reviewFilterSnapshot, setReviewFilterSnapshot] = useState(null);

  // Gamification Global State
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(globalSoundEnabled);

  useEffect(() => {
    setSoundEnabled(globalSoundEnabled);
  }, [globalSoundEnabled]);

  const addEarnedXp = (amount) => {
    setXp(prev => prev + amount);
    if (onAddGlobalXp) onAddGlobalXp(amount, 'ฝึกคำศัพท์');
  };

  // ----------------------------------------------------
  // DECK MANAGEMENT (Never remove words mid-session!)
  // ----------------------------------------------------
  const baseDeck = useMemo(() => {
    let filtered = vocabData.filter(item => {
      const matchesSearch = searchTerm.trim() === '' ||
        item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.thai.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.example.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesUnit = selectedUnit === 'all' || item.unit === selectedUnit;
      const matchesReview = filterNeedsReview && reviewFilterSnapshot 
        ? reviewFilterSnapshot.has(item.word) 
        : true;

      return matchesSearch && matchesUnit && matchesReview;
    });

    return filtered.length > 0 ? filtered : vocabData;
  }, [searchTerm, selectedUnit, filterNeedsReview, reviewFilterSnapshot]);

  // Custom ordered / shuffled deck
  const [customDeck, setCustomDeck] = useState(null);
  const deck = customDeck || baseDeck;

  // ----------------------------------------------------
  // MODE 1: SINGLE FLASHCARD STATE
  // ----------------------------------------------------
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // ----------------------------------------------------
  // MODE 2: SPEED RUSH (4-CHOICE 60S RAPID FIRE)
  // ----------------------------------------------------
  const [rushRunning, setRushRunning] = useState(false);
  const [rushTimeLeft, setRushTimeLeft] = useState(60);
  const [rushScore, setRushScore] = useState(0);
  const [rushCorrectCount, setRushCorrectCount] = useState(0);
  const [rushTotalCount, setRushTotalCount] = useState(0);
  const [rushCurrentWord, setRushCurrentWord] = useState(null);
  const [rushChoices, setRushChoices] = useState([]);
  const [rushSelectedChoice, setRushSelectedChoice] = useState(null);
  const [rushIsWrong, setRushIsWrong] = useState(false);
  const [rushFinished, setRushFinished] = useState(false);
  const [rushBestScore, setRushBestScore] = useState(0);
  const [rushDirection, setRushDirection] = useState('en-to-th');

  // ----------------------------------------------------
  // MODE 3: SENTENCE MASTER (CLOZE FILL-IN-THE-BLANK)
  // ----------------------------------------------------
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [sentenceChoices, setSentenceChoices] = useState([]);
  const [sentenceSelected, setSentenceSelected] = useState(null);
  const [sentenceAnswered, setSentenceAnswered] = useState(false);

  // ----------------------------------------------------
  // MODE 4: SPEED MATCH (6 vs 6 ARENA)
  // ----------------------------------------------------
  const [matchCardsEng, setMatchCardsEng] = useState([]);
  const [matchCardsThai, setMatchCardsThai] = useState([]);
  const [selectedEng, setSelectedEng] = useState(null);
  const [selectedThai, setSelectedThai] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState(new Set());
  const [wrongShake, setWrongShake] = useState(false);
  const [matchTimer, setMatchTimer] = useState(0);
  const [isMatchRunning, setIsMatchRunning] = useState(false);
  const [isMatchFinished, setIsMatchFinished] = useState(false);
  const [bestMatchTime, setBestMatchTime] = useState(null);

  // ----------------------------------------------------
  // MODE 5: WORD SCRAMBLE (SPELLING DECODER)
  // ----------------------------------------------------
  const [scrambleIndex, setScrambleIndex] = useState(0);
  const [scrambleLetters, setScrambleLetters] = useState([]);
  const [assembledLetters, setAssembledLetters] = useState([]);
  const [scrambleSolved, setScrambleSolved] = useState(false);
  const [scrambleShake, setScrambleShake] = useState(false);
  const [scrambleSolvedCount, setScrambleSolvedCount] = useState(0);

  // ----------------------------------------------------
  // PERSISTENCE & LOCALSTORAGE
  // ----------------------------------------------------
  useEffect(() => {
    try {
      const savedXp = localStorage.getItem('eng_vocab_xp');
      if (savedXp) setXp(parseInt(savedXp, 10) || 0);

      const savedMastered = localStorage.getItem('eng_vocab_mastered');
      if (savedMastered) {
        const arr = JSON.parse(savedMastered);
        if (Array.isArray(arr)) setMasteredWords(new Set(arr));
      }

      const savedBestTime = localStorage.getItem('eng_vocab_best_match_time');
      if (savedBestTime) setBestMatchTime(parseFloat(savedBestTime));

      const savedRushBest = localStorage.getItem('eng_vocab_best_rush');
      if (savedRushBest) setRushBestScore(parseInt(savedRushBest, 10) || 0);

      const savedScrambleCount = localStorage.getItem('eng_vocab_scramble_count');
      if (savedScrambleCount) setScrambleSolvedCount(parseInt(savedScrambleCount, 10) || 0);
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('eng_vocab_xp', xp.toString());
      localStorage.setItem('eng_vocab_mastered', JSON.stringify(Array.from(masteredWords)));
      if (bestMatchTime) localStorage.setItem('eng_vocab_best_match_time', bestMatchTime.toString());
      if (rushBestScore) localStorage.setItem('eng_vocab_best_rush', rushBestScore.toString());
      localStorage.setItem('eng_vocab_scramble_count', scrambleSolvedCount.toString());
    } catch (e) {
      // ignore
    }
  }, [xp, masteredWords, bestMatchTime, rushBestScore, scrambleSolvedCount]);

  // Filter Handlers
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCustomDeck(null);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setIsFinished(false);
    setSentenceIndex(0);
    setScrambleIndex(0);
  };

  const handleUnitChange = (value) => {
    setSelectedUnit(value);
    setCustomDeck(null);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setIsFinished(false);
    setSentenceIndex(0);
    setScrambleIndex(0);
  };

  const handleToggleFilterReview = () => {
    if (filterNeedsReview) {
      setFilterNeedsReview(false);
      setReviewFilterSnapshot(null);
    } else {
      setFilterNeedsReview(true);
      const unmastered = new Set(vocabData.filter(v => !masteredWords.has(v.word)).map(v => v.word));
      setReviewFilterSnapshot(unmastered);
    }
    setCustomDeck(null);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setIsFinished(false);
    setSentenceIndex(0);
    setScrambleIndex(0);
  };

  // ----------------------------------------------------
  // MODE 1: SINGLE FLASHCARD CONTROLS
  // ----------------------------------------------------
  const currentItem = deck[currentIndex] || deck[0] || vocabData[0];
  const isMastered = masteredWords.has(currentItem.word);
  const currentLevel = getCurrentLevel(xp);
  const percentMastered = Math.round((masteredWords.size / vocabData.length) * 100);

  const xpInCurrentLevel = xp - currentLevel.minXp;
  const levelSpan = currentLevel.maxXp - currentLevel.minXp;
  const levelProgressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / levelSpan) * 100)));

  const handleFlip = () => {
    playSound('flip', soundEnabled);
    setIsFlipped(prev => !prev);
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => {
      if (prevIndex < deck.length - 1) {
        setIsFlipped(false);
        setShowHint(false);
        return prevIndex + 1;
      } else {
        setIsFinished(true);
        playSound('fanfare', soundEnabled);
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        return prevIndex;
      }
    });
  };

  const handlePrev = () => {
    setCurrentIndex(prevIndex => {
      if (prevIndex > 0) {
        setIsFlipped(false);
        setShowHint(false);
        return prevIndex - 1;
      }
      return 0;
    });
  };

  const handleMarkMastered = () => {
    const earnedXp = 10 + Math.min(streak * 2, 20);
    addEarnedXp(earnedXp);

    const nextStreak = streak + 1;
    setStreak(nextStreak);
    setBestStreak(b => Math.max(b, nextStreak));

    if (currentItem && currentItem.word) {
      setMasteredWords(prev => {
        const next = new Set(prev);
        next.add(currentItem.word);
        return next;
      });
    }

    if (nextStreak > 0 && nextStreak % 5 === 0) {
      playSound('fanfare', soundEnabled);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    } else {
      playSound('correct', soundEnabled);
    }

    handleNext();
  };

  const handleMarkReview = () => {
    playSound('wrong', soundEnabled);
    setStreak(0);

    if (currentItem && currentItem.word) {
      setMasteredWords(prev => {
        const next = new Set(prev);
        next.delete(currentItem.word);
        return next;
      });
    }

    handleNext();
  };

  const handleShuffle = () => {
    playSound('flip', soundEnabled);
    const shuffled = [...baseDeck].sort(() => Math.random() - 0.5);
    setCustomDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setIsFinished(false);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setIsFinished(false);
  };

  // ----------------------------------------------------
  // MODE 2: SPEED RUSH
  // ----------------------------------------------------
  const generateRushQuestion = () => {
    const sourcePool = deck.length >= 4 ? deck : vocabData;
    const target = sourcePool[Math.floor(Math.random() * sourcePool.length)];
    
    const others = vocabData.filter(v => v.word.toLowerCase() !== target.word.toLowerCase());
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
    
    let choices = [];
    if (rushDirection === 'en-to-th') {
      choices = [
        { text: target.thai, isCorrect: true, word: target.word },
        ...shuffledOthers.map(o => ({ text: o.thai, isCorrect: false, word: o.word }))
      ].sort(() => Math.random() - 0.5);
    } else {
      choices = [
        { text: target.word, isCorrect: true, thai: target.thai, pos: target.pos },
        ...shuffledOthers.map(o => ({ text: o.word, isCorrect: false, thai: o.thai, pos: o.pos }))
      ].sort(() => Math.random() - 0.5);
    }

    setRushCurrentWord(target);
    setRushChoices(choices);
    setRushSelectedChoice(null);
    setRushIsWrong(false);
  };

  const startRushGame = () => {
    setRushRunning(true);
    setRushTimeLeft(60);
    setRushScore(0);
    setRushCorrectCount(0);
    setRushTotalCount(0);
    setRushFinished(false);
    generateRushQuestion();
  };

  useEffect(() => {
    let timer = null;
    if (rushRunning && rushTimeLeft > 0) {
      timer = setInterval(() => {
        setRushTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setRushRunning(false);
            setRushFinished(true);
            playSound('fanfare', soundEnabled);
            confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [rushRunning, rushTimeLeft, soundEnabled]);

  const handleRushAnswer = (choice) => {
    if (rushSelectedChoice !== null || !rushRunning) return;

    setRushSelectedChoice(choice);
    setRushTotalCount(prev => prev + 1);

    if (choice.isCorrect) {
      playSound('correct', soundEnabled);
      const earnedXp = 10 + Math.min(streak * 2, 20);
      setRushScore(prev => {
        const nextScore = prev + earnedXp;
        if (nextScore > rushBestScore) setRushBestScore(nextScore);
        return nextScore;
      });
      setXp(x => x + earnedXp);
      setRushCorrectCount(prev => prev + 1);
      setStreak(s => {
        const next = s + 1;
        setBestStreak(b => Math.max(b, next));
        return next;
      });

      setMasteredWords(prev => new Set(prev).add(rushCurrentWord.word));

      setTimeout(() => {
        if (rushRunning && rushTimeLeft > 0) {
          generateRushQuestion();
        }
      }, 300);
    } else {
      playSound('wrong', soundEnabled);
      setRushIsWrong(true);
      setStreak(0);

      setTimeout(() => {
        if (rushRunning && rushTimeLeft > 0) {
          generateRushQuestion();
        }
      }, 700);
    }
  };

  // ----------------------------------------------------
  // MODE 3: SENTENCE MASTER
  // ----------------------------------------------------
  const currentSentenceWord = deck[sentenceIndex] || deck[0] || vocabData[0];

  useEffect(() => {
    if (mode === 'sentence') {
      const target = currentSentenceWord;
      const others = vocabData.filter(v => v.word.toLowerCase() !== target.word.toLowerCase());
      const shuffledOthers = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
      
      const choices = [
        { word: target.word, isCorrect: true },
        ...shuffledOthers.map(o => ({ word: o.word, isCorrect: false }))
      ].sort(() => Math.random() - 0.5);

      setSentenceChoices(choices);
      setSentenceSelected(null);
      setSentenceAnswered(false);
    }
  }, [mode, sentenceIndex, selectedUnit, deck]);

  const handleSentenceChoice = (choice) => {
    if (sentenceAnswered) return;
    setSentenceSelected(choice);
    setSentenceAnswered(true);

    if (choice.isCorrect) {
      playSound('correct', soundEnabled);
      const earned = 20 + Math.min(streak * 2, 20);
      setXp(x => x + earned);
      setStreak(s => {
        const next = s + 1;
        setBestStreak(b => Math.max(b, next));
        return next;
      });
      setMasteredWords(prev => new Set(prev).add(currentSentenceWord.word));
    } else {
      playSound('wrong', soundEnabled);
      setStreak(0);
    }
  };

  const handleSentenceNext = () => {
    if (sentenceIndex < deck.length - 1) {
      setSentenceIndex(prev => prev + 1);
    } else {
      setSentenceIndex(0);
      confetti({ particleCount: 70, spread: 60 });
    }
  };

  // ----------------------------------------------------
  // MODE 4: SPEED MATCH (SHOWS WHAT MATCHED WITH WHAT!)
  // ----------------------------------------------------
  const initMatchRound = () => {
    const sourcePool = deck.length >= 6 ? deck : vocabData;
    const shuffled = [...sourcePool].sort(() => Math.random() - 0.5);
    const selectedSix = shuffled.slice(0, 6);

    const engList = selectedSix.map(item => ({ 
      id: item.word, 
      word: item.word, 
      pos: item.pos,
      thai: item.thai,
      example: item.example 
    }));
    const thaiList = selectedSix.map(item => ({ 
      id: item.word, 
      word: item.word, 
      pos: item.pos,
      thai: item.thai,
      example: item.example 
    }));

    setMatchCardsEng([...engList].sort(() => Math.random() - 0.5));
    setMatchCardsThai([...thaiList].sort(() => Math.random() - 0.5));

    setSelectedEng(null);
    setSelectedThai(null);
    setMatchedPairs(new Set());
    setMatchTimer(0);
    setIsMatchRunning(true);
    setIsMatchFinished(false);
  };

  useEffect(() => {
    let interval = null;
    if (mode === 'match' && isMatchRunning && !isMatchFinished) {
      interval = setInterval(() => {
        setMatchTimer(prev => prev + 0.1);
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode, isMatchRunning, isMatchFinished]);

  useEffect(() => {
    if (mode === 'match') {
      initMatchRound();
    } else {
      setIsMatchRunning(false);
    }
  }, [mode, selectedUnit]);

  const handleSelectEngTile = (card) => {
    if (matchedPairs.has(card.id)) return;
    playSound('flip', soundEnabled);
    setSelectedEng(card);
    if (selectedThai) checkMatch(card.id, selectedThai.id);
  };

  const handleSelectThaiTile = (card) => {
    if (matchedPairs.has(card.id)) return;
    playSound('flip', soundEnabled);
    setSelectedThai(card);
    if (selectedEng) checkMatch(selectedEng.id, card.id);
  };

  const checkMatch = (engId, thaiId) => {
    if (engId === thaiId) {
      playSound('match', soundEnabled);
      const nextMatched = new Set(matchedPairs);
      nextMatched.add(engId);
      setMatchedPairs(nextMatched);

      setMasteredWords(prev => new Set(prev).add(engId));
      setXp(x => x + 25);
      setStreak(s => {
        const next = s + 1;
        setBestStreak(b => Math.max(b, next));
        return next;
      });

      setSelectedEng(null);
      setSelectedThai(null);

      if (nextMatched.size === 6) {
        setIsMatchRunning(false);
        setIsMatchFinished(true);
        playSound('fanfare', soundEnabled);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setXp(x => x + 50);
        setBestMatchTime(prev => {
          const currentTime = parseFloat(matchTimer.toFixed(1));
          if (!prev || currentTime < prev) return currentTime;
          return prev;
        });
      }
    } else {
      playSound('wrong', soundEnabled);
      setWrongShake(true);
      setStreak(0);
      setTimeout(() => {
        setSelectedEng(null);
        setSelectedThai(null);
        setWrongShake(false);
      }, 450);
    }
  };

  // ----------------------------------------------------
  // MODE 5: WORD SCRAMBLE
  // ----------------------------------------------------
  const currentScrambleWord = deck[scrambleIndex] || deck[0] || vocabData[0];

  useEffect(() => {
    if (mode === 'scramble') {
      const word = currentScrambleWord.word.toUpperCase();
      const chars = word.split('').map((char, index) => ({
        id: index,
        char,
        used: false
      }));

      const scrambled = [...chars].sort(() => Math.random() - 0.5);
      setScrambleLetters(scrambled);
      setAssembledLetters([]);
      setScrambleSolved(false);
      setScrambleShake(false);
    }
  }, [mode, scrambleIndex, selectedUnit, deck]);

  const handleSelectScrambleChar = (letterObj) => {
    if (letterObj.used || scrambleSolved) return;
    playSound('click', soundEnabled);

    setScrambleLetters(prev => prev.map(l => l.id === letterObj.id ? { ...l, used: true } : l));
    const nextAssembled = [...assembledLetters, letterObj];
    setAssembledLetters(nextAssembled);

    const targetWord = currentScrambleWord.word.toUpperCase();
    if (nextAssembled.length === targetWord.length) {
      const assembledStr = nextAssembled.map(l => l.char).join('');
      if (assembledStr === targetWord) {
        playSound('fanfare', soundEnabled);
        confetti({ particleCount: 60, spread: 60 });
        setScrambleSolved(true);
        setXp(x => x + 25);
        setStreak(s => s + 1);
        setScrambleSolvedCount(c => c + 1);
        setMasteredWords(prev => new Set(prev).add(currentScrambleWord.word));
      } else {
        playSound('wrong', soundEnabled);
        setScrambleShake(true);
        setTimeout(() => setScrambleShake(false), 500);
      }
    }
  };

  const handleRemoveAssembledChar = (indexToRemove) => {
    if (scrambleSolved) return;
    playSound('click', soundEnabled);
    const removedItem = assembledLetters[indexToRemove];
    setAssembledLetters(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setScrambleLetters(prev => prev.map(l => l.id === removedItem.id ? { ...l, used: false } : l));
  };

  const handleClearScramble = () => {
    playSound('flip', soundEnabled);
    setAssembledLetters([]);
    setScrambleLetters(prev => prev.map(l => ({ ...l, used: false })));
  };

  const handleHintFirstLetter = () => {
    if (scrambleSolved || assembledLetters.length > 0) return;
    const firstChar = currentScrambleWord.word[0].toUpperCase();
    const available = scrambleLetters.find(l => !l.used && l.char === firstChar);
    if (available) {
      handleSelectScrambleChar(available);
    }
  };

  const handleScrambleNext = () => {
    if (scrambleIndex < deck.length - 1) {
      setScrambleIndex(prev => prev + 1);
    } else {
      setScrambleIndex(0);
      confetti({ particleCount: 80, spread: 70 });
    }
  };

  // ----------------------------------------------------
  // KEYBOARD SHORTCUTS
  // ----------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (mode === 'single' && !isFinished) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleFlip();
        } else if (e.key === 'ArrowLeft') {
          handlePrev();
        } else if (e.key === 'ArrowRight') {
          handleNext();
        } else if (e.key === '1') {
          handleMarkReview();
        } else if (e.key === '2') {
          handleMarkMastered();
        } else if (e.key === 'h' || e.key === 'H') {
          setShowHint(prev => !prev);
        } else if (e.key === 's' || e.key === 'S') {
          const currentWord = deck[currentIndex];
          if (currentWord) speech.speak(currentWord.word);
        }
      } else if (mode === 'rush' && rushRunning && rushChoices.length === 4) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (rushChoices[idx]) handleRushAnswer(rushChoices[idx]);
        }
      } else if (mode === 'sentence') {
        if (!sentenceAnswered && ['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (sentenceChoices[idx]) handleSentenceChoice(sentenceChoices[idx]);
        } else if (sentenceAnswered && e.key === 'Enter') {
          handleSentenceNext();
        }
      } else if (mode === 'scramble' && !scrambleSolved) {
        if (e.key === 'Backspace') {
          if (assembledLetters.length > 0) {
            handleRemoveAssembledChar(assembledLetters.length - 1);
          }
        } else if (/^[a-zA-Z]$/.test(e.key)) {
          const char = e.key.toUpperCase();
          const available = scrambleLetters.find(l => !l.used && l.char === char);
          if (available) handleSelectScrambleChar(available);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, currentIndex, isFlipped, deck, isFinished, soundEnabled, streak, rushRunning, rushChoices, sentenceAnswered, sentenceChoices, scrambleLetters, assembledLetters, scrambleSolved]);

  return (
    <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      {/* Top Header & Gamification Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>VOCABULARY TRAINING ARENA • 160 EXAM TERMS</span>
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-blue-600" />
            <span>คลังคำศัพท์ออกสอบ & เกมฝึกจำ (160 คำ)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            เลือกโหมดฝึกฝนตามสไตล์ที่คุณชอบ: การ์ดพลิก, สปีดควิซ 60 วิ, เติมคำในประโยคข้อสอบ, ถอดรหัสอักษร และจับคู่เร็ว
          </p>
        </div>

        {/* Gamification Stats: Level, XP, Streak, Mastered & Sound */}
        <div className="flex flex-wrap items-center gap-3 bg-gradient-to-r from-slate-50 via-blue-50/40 to-indigo-50/40 p-3 rounded-2xl border border-slate-200 text-xs shadow-xs">
          {/* Level & XP */}
          <div className="flex items-center gap-2.5 pr-2 border-r border-slate-200">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-xs text-xs">
              Lv.{currentLevel.level}
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <span>{currentLevel.title}</span>
                <span className="text-[10px] text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded font-black">{xp} XP</span>
              </div>
              <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Streak Indicator */}
          <div className="flex items-center gap-1.5 px-2 border-r border-slate-200">
            <span className={`p-1.5 rounded-lg ${streak > 0 ? 'bg-orange-100 text-orange-600 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
              <Flame className="w-4 h-4" />
            </span>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">STREAK</span>
              <span className={`font-black ${streak >= 3 ? 'text-orange-600 text-sm' : 'text-slate-700'}`}>
                {streak} {streak >= 3 && '🔥'}
              </span>
            </div>
          </div>

          {/* Mastered Counter */}
          <div className="px-2">
            <div className="flex items-center justify-between gap-2 font-bold text-slate-700 mb-1">
              <span className="text-[11px]">แม่นยำ:</span>
              <span className="text-emerald-700 font-black">{masteredWords.size}/160 ({percentMastered}%)</span>
            </div>
            <div className="w-24 md:w-32 bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${percentMastered}%` }}
              />
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl transition border ${
              soundEnabled 
                ? 'bg-blue-100 text-blue-700 border-blue-200' 
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
            title={soundEnabled ? 'ปิดเสียงเอฟเฟกต์' : 'เปิดเสียงเอฟเฟกต์'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Primary 6-Mode Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Unit & Search Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาศัพท์..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none w-36 sm:w-44"
            />
          </div>

          <select
            value={selectedUnit}
            onChange={(e) => handleUnitChange(e.target.value)}
            className="border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
          >
            <option value="all">ทุก Unit (160 คำ)</option>
            <option value="Unit 5">Unit 5: Study (40 คำ)</option>
            <option value="Unit 6">Unit 6: IELTS (40 คำ)</option>
            <option value="Unit 7">Unit 7: TOEFL (40 คำ)</option>
            <option value="Unit 8">Unit 8: TOEIC (40 คำ)</option>
          </select>

          <button
            onClick={handleToggleFilterReview}
            className={`px-3 py-1.5 rounded-xl font-semibold transition border ${
              filterNeedsReview 
                ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' 
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span>เฉพาะคำที่ยังไม่แม่น</span>
          </button>
        </div>

        {/* Mode Tabs Navigation */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setMode('single')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition text-xs ${
              mode === 'single'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>การ์ดพลิก</span>
          </button>

          <button
            onClick={() => {
              setMode('rush');
              if (!rushRunning && !rushFinished) startRushGame();
            }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition text-xs ${
              mode === 'rush'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Speed Rush 60s</span>
          </button>

          <button
            onClick={() => setMode('sentence')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition text-xs ${
              mode === 'sentence'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>เติมคำในประโยค</span>
          </button>

          <button
            onClick={() => setMode('scramble')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition text-xs ${
              mode === 'scramble'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>ถอดรหัสอักษร</span>
          </button>

          <button
            onClick={() => setMode('match')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition text-xs ${
              mode === 'match'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>จับคู่เร็ว</span>
          </button>

          <button
            onClick={() => setMode('grid')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition text-xs ${
              mode === 'grid'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>ตารางคำศัพท์</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          MODE 1: SINGLE FLASHCARD POP-UP DECK
         ======================================================== */}
      {mode === 'single' && (
        <div className="max-w-xl mx-auto space-y-4 py-2">
          {!isFinished ? (
            <>
              {/* Deck Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span>ใบที่ <strong className="text-slate-900 font-bold">{currentIndex + 1}</strong> จาก {deck.length} ใบ</span>
                    {streak >= 3 && (
                      <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-black text-[11px] animate-bounce">
                        <Flame className="w-3 h-3 fill-orange-500" />
                        {streak} Combo! (+{Math.min(streak * 2, 20)} Bonus XP)
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> แม่น: {masteredWords.size}
                    </span>
                    <span>•</span>
                    <button
                      onClick={handleShuffle}
                      className="hover:text-blue-600 flex items-center gap-1 text-[11px] font-semibold"
                      title="สุ่มลำดับคำศัพท์"
                    >
                      <Shuffle className="w-3 h-3" />
                      <span>สุ่มการ์ด</span>
                    </button>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* The Interactive Single Card */}
              <div
                onClick={handleFlip}
                className={`cursor-pointer min-h-[320px] p-6 md:p-8 rounded-3xl border-2 transition-all duration-300 transform flex flex-col justify-between relative shadow-sm hover:shadow-md select-none ${
                  isFlipped 
                    ? 'bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white border-indigo-700' 
                    : isMastered
                      ? 'bg-gradient-to-br from-emerald-50/40 via-white to-slate-50 border-emerald-300 hover:border-emerald-400'
                      : 'bg-gradient-to-br from-white via-slate-50 to-blue-50/30 border-slate-300 hover:border-blue-400'
                }`}
              >
                {/* Top Card Meta */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                      isFlipped ? 'bg-white/20 text-blue-200' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {currentItem.unit}
                    </span>

                    {!isFlipped && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHint(!showHint);
                        }}
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] flex items-center gap-1 transition ${
                          showHint 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                            : 'bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-800 border border-slate-200'
                        }`}
                        title="ดูประโยคบอกใบ้ซ่อนคำศัพท์ [H]"
                      >
                        <Lightbulb className="w-3 h-3 text-amber-500" />
                        <span>{showHint ? 'ซ่อนคำใบ้' : '💡 ดูคำใบ้ [H]'}</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isMastered && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isFlipped ? 'bg-emerald-500/30 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        <Check className="w-3 h-3" />
                        <span>จำได้แล้ว</span>
                      </span>
                    )}

                    <span className={`text-xs flex items-center gap-1 font-medium ${
                      isFlipped ? 'text-indigo-200' : 'text-slate-400'
                    }`}>
                      <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
                      <span>{isFlipped ? 'ด้านหลัง (ความหมาย)' : 'คลิกเพื่อพลิกการ์ด'}</span>
                    </span>
                  </div>
                </div>

                {/* Card Center Content */}
                <div className="text-center py-5 space-y-3">
                  {!isFlipped ? (
                    <div className="space-y-3 animate-fadeIn">
                      <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                        {currentItem.word}
                      </h3>
                      <span className="inline-block text-xs font-semibold italic text-slate-500 bg-slate-100 px-3 py-0.5 rounded-full font-inter">
                        {currentItem.pos}
                      </span>

                      {showHint ? (
                        <div className="bg-amber-50/90 border border-amber-200 p-3.5 rounded-2xl max-w-md mx-auto text-left space-y-1 animate-fadeIn">
                          <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                            <span>ประโยคตัวอย่างข้อสอบ (ทายคำที่เว้นวรรค):</span>
                          </span>
                          <p className="text-xs md:text-sm text-slate-800 italic font-inter leading-relaxed">
                            "{getBlankedSentence(currentItem.example, currentItem.word)}"
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 pt-1 font-medium">
                          (แตะที่การ์ดเพื่อดูคำแปลภาษาไทย หรือกด <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-600 font-mono">Space</kbd>)
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="text-xs text-blue-300 font-bold tracking-wider uppercase">
                        {currentItem.word} ({currentItem.pos})
                      </div>
                      <h4 className="text-xl md:text-2xl font-black text-amber-300 leading-snug">
                        {currentItem.thai}
                      </h4>
                      <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 text-xs md:text-sm text-blue-100 italic font-inter leading-relaxed max-w-md mx-auto text-left">
                        <span className="text-amber-400 font-bold block mb-1 font-sarabun not-italic text-xs">ตัวอย่างประโยคข้อสอบ:</span>
                        "{currentItem.example}"
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100/20 text-xs">
                  <span className={`text-[11px] ${isFlipped ? 'text-indigo-200' : 'text-slate-400'}`}>
                    กด Spacebar เพื่อพลิก | 1/2 เพื่อเช็ค
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speech.speak(currentItem.word);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition shadow-xs ${
                      isFlipped 
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    title="ออกเสียงคำศัพท์ [S]"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>ฟังเสียงอ่าน [S]</span>
                  </button>
                </div>
              </div>

              {/* Action Decision Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleMarkReview}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-300 font-bold py-3 px-4 rounded-2xl text-xs md:text-sm transition flex items-center justify-center gap-2 shadow-xs active:scale-[0.98]"
                >
                  <XCircle className="w-4 h-4 text-amber-600" />
                  <span>ยังไม่แม่น (ทบทวนอีก) [1]</span>
                </button>

                <button
                  onClick={handleMarkMastered}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-2xl text-xs md:text-sm transition flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>จำได้แล้ว! (+{10 + Math.min(streak * 2, 20)} XP) [2]</span>
                </button>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition ${
                    currentIndex === 0 ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>ย้อนกลับ [←]</span>
                </button>

                <button
                  onClick={handleFlip}
                  className="hover:text-blue-600 font-semibold flex items-center gap-1 text-slate-600"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>พลิกการ์ด [Space]</span>
                </button>

                <button
                  onClick={handleNext}
                  className="hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition"
                >
                  <span>ข้ามข้อ [→]</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            /* Finished screen */
            <div className="p-8 bg-slate-50 rounded-3xl border-2 border-emerald-400 text-center space-y-4 animate-fadeIn">
              <span className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <Trophy className="w-8 h-8" />
              </span>

              <h3 className="text-xl md:text-2xl font-black text-slate-900">
                🎉 ยอดเยี่ยมมาก! คุณทบทวนคำศัพท์ครบสำรับแล้ว
              </h3>

              <p className="text-xs md:text-sm text-slate-600 max-w-md mx-auto">
                ทบทวนสำเร็จไปทั้งสิ้น {deck.length} คำ โดยมีคำที่จำได้แล้วจำนวน{' '}
                <strong className="text-emerald-700 font-bold">{masteredWords.size} คำ</strong> (สถิติสตรีคสูงสุด: <strong>{bestStreak}</strong> ครั้งติด)
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <button
                  onClick={handleRestart}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs md:text-sm transition flex items-center gap-2 shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>เริ่มทบทวนรอบใหม่อีกครั้ง</span>
                </button>

                <button
                  onClick={() => {
                    setMode('rush');
                    startRushGame();
                  }}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs md:text-sm transition flex items-center gap-2 shadow-sm"
                >
                  <Timer className="w-4 h-4" />
                  <span>ท้าทายโหมด Speed Rush 60s</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          MODE 2: SPEED RUSH (60-SECOND RAPID 4-CHOICE FIRE)
         ======================================================== */}
      {mode === 'rush' && (
        <div className="max-w-xl mx-auto space-y-4 py-2">
          {/* Rush Arena Control Bar */}
          <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-indigo-950 text-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-sm ${
                rushTimeLeft <= 10 ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-400 text-slate-950'
              }`}>
                {rushTimeLeft}s
              </span>
              <div>
                <h3 className="font-black text-sm md:text-base text-amber-300 flex items-center gap-1.5">
                  <Timer className="w-4 h-4" />
                  <span>SPEED RUSH 60 SECONDS</span>
                </h3>
                <p className="text-[11px] text-slate-300">
                  ตอบให้ไวและแม่นยำที่สุดภายใน 60 วินาที!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-right">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">คะแนนรอบนี้</span>
                <span className="text-xl font-black text-emerald-400 font-mono">+{rushScore}</span>
              </div>
              {rushBestScore > 0 && (
                <div className="hidden sm:block border-l border-slate-700 pl-3">
                  <span className="text-[10px] text-slate-400 block uppercase">สถิติสูงสุด</span>
                  <span className="text-base font-black text-amber-400 font-mono">{rushBestScore}</span>
                </div>
              )}
            </div>
          </div>

          {!rushFinished && rushRunning && rushCurrentWord && (
            <div className="space-y-4">
              {/* Target Prompt Card */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 p-6 rounded-3xl border-2 border-blue-200 text-center relative shadow-xs">
                <span className="absolute top-3 left-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {rushCurrentWord.unit}
                </span>

                <div className="space-y-1 py-3">
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                    {rushDirection === 'en-to-th' ? rushCurrentWord.word : rushCurrentWord.thai}
                  </h3>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <span className="text-xs font-semibold italic text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 font-inter">
                      {rushCurrentWord.pos}
                    </span>
                    <button
                      onClick={() => speech.speak(rushCurrentWord.word)}
                      className="p-1 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
                      title="ฟังเสียง"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  ข้อที่ {rushTotalCount + 1} • ตอบถูก: {rushCorrectCount} ข้อ (กดปุ่ม 1-4 เพื่อเลือกคำตอบ)
                </div>
              </div>

              {/* 4 Choices Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {rushChoices.map((choice, idx) => {
                  const isSelected = rushSelectedChoice === choice;
                  const showSuccess = isSelected && choice.isCorrect;
                  const showWrong = isSelected && !choice.isCorrect;
                  const revealCorrect = rushIsWrong && choice.isCorrect;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleRushAnswer(choice)}
                      disabled={rushSelectedChoice !== null}
                      className={`p-4 rounded-2xl font-bold text-left text-xs md:text-sm transition-all border-2 flex items-center justify-between select-none active:scale-[0.98] ${
                        showSuccess 
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-500 shadow-md ring-2 ring-emerald-300' 
                          : showWrong 
                            ? 'bg-rose-50 text-rose-900 border-rose-500 shadow-md ring-2 ring-rose-300 animate-shake' 
                            : revealCorrect
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-400'
                              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <span>{choice.text}</span>
                      </div>
                      {showSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {showWrong && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rush Start / Instructions Screen */}
          {!rushRunning && !rushFinished && (
            <div className="bg-slate-50 p-8 rounded-3xl border-2 border-slate-200 text-center space-y-4">
              <span className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
                <Timer className="w-8 h-8" />
              </span>

              <h4 className="text-xl md:text-2xl font-black text-slate-900">
                พร้อมลงสนามประลอง Speed Rush 60 วิ หรือยัง?
              </h4>

              <p className="text-xs md:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                ระบบจะสุ่มคำศัพท์ออกสอบและตัวเลือก 4 ช้อยส์มาให้ตอบเร็วที่สุด สะสมคอมโบเพื่อรับตัวคูณ XP สูงสุด ยิ่งแม่นยิ่งได้คะแนนเยอะ!
              </p>

              {/* Mode Direction Toggle */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setRushDirection('en-to-th')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                    rushDirection === 'en-to-th' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  🇬🇧 อังกฤษ ➔ 🇹🇭 ไทย
                </button>
                <button
                  onClick={() => setRushDirection('th-to-en')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                    rushDirection === 'th-to-en' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  🇹🇭 ไทย ➔ 🇬🇧 อังกฤษ
                </button>
              </div>

              <div className="pt-3">
                <button
                  onClick={startRushGame}
                  className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black px-8 py-3 rounded-2xl text-sm transition shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2 mx-auto"
                >
                  <Timer className="w-4 h-4" />
                  <span>เริ่มการแข่งขัน (START 60s)</span>
                </button>
              </div>
            </div>
          )}

          {/* Rush Finished Screen */}
          {rushFinished && (
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl text-center space-y-4 border-2 border-amber-400 shadow-xl animate-fadeIn">
              <span className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center mx-auto shadow-md">
                <Trophy className="w-8 h-8" />
              </span>

              <h4 className="text-2xl font-black text-amber-300">
                หมดเวลา 60 วินาที! สรุปผลคะแนน
              </h4>

              <div className="grid grid-cols-3 gap-3 py-2 text-sm font-mono max-w-md mx-auto">
                <div className="bg-white/10 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-300 block font-sarabun">คะแนนรอบนี้</span>
                  <span className="text-xl font-black text-amber-300 font-mono">+{rushScore}</span>
                </div>
                <div className="bg-white/10 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-300 block font-sarabun">ตอบถูก/ทั้งหมด</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">{rushCorrectCount}/{rushTotalCount}</span>
                </div>
                <div className="bg-white/10 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-300 block font-sarabun">ความแม่นยำ</span>
                  <span className="text-xl font-black text-blue-300 font-mono">
                    {rushTotalCount > 0 ? Math.round((rushCorrectCount / rushTotalCount) * 100) : 0}%
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <button
                  onClick={startRushGame}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3 rounded-xl text-xs md:text-sm transition flex items-center gap-2 shadow-md active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>เล่นรอบใหม่อีกครั้ง</span>
                </button>

                <button
                  onClick={() => setMode('sentence')}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-xl text-xs md:text-sm transition flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>ไปโหมดเติมคำในประโยค</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          MODE 3: SENTENCE MASTER (CLOZE FILL-IN-THE-BLANK)
         ======================================================== */}
      {mode === 'sentence' && (
        <div className="max-w-xl mx-auto space-y-4 py-2">
          {/* Header Info */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>ประโยคที่ <strong className="text-slate-900 font-bold">{sentenceIndex + 1}</strong> จาก {deck.length} ประโยค</span>
            <span className="text-indigo-700 font-bold flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> จำลองรูปแบบข้อสอบจริง
            </span>
          </div>

          {/* Exam Sentence Card with Blank */}
          <div className="bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 p-6 md:p-8 rounded-3xl border-2 border-indigo-200 space-y-4 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-full">
                {currentSentenceWord.unit}
              </span>
              <span className="text-slate-400 font-medium text-[11px]">
                Part of Speech: <strong className="text-slate-700 font-inter">{currentSentenceWord.pos}</strong>
              </span>
            </div>

            <div className="py-2 space-y-2">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block">
                เลือกคำศัพท์ที่ถูกต้องมาเติมในช่องว่าง:
              </span>
              <p className="text-base md:text-lg font-serif italic text-slate-900 leading-relaxed bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs">
                "{getBlankedSentence(currentSentenceWord.example, currentSentenceWord.word)}"
              </p>
            </div>

            {/* 4 Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {sentenceChoices.map((choice, idx) => {
                const isSelected = sentenceSelected?.word === choice.word;
                const showCorrect = sentenceAnswered && choice.isCorrect;
                const showWrong = sentenceAnswered && isSelected && !choice.isCorrect;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSentenceChoice(choice)}
                    disabled={sentenceAnswered}
                    className={`p-3.5 rounded-2xl font-bold text-left text-xs md:text-sm transition-all border-2 flex items-center justify-between select-none ${
                      showCorrect 
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-2 ring-emerald-300' 
                        : showWrong 
                          ? 'bg-rose-50 text-rose-900 border-rose-500' 
                          : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-inter font-bold">{choice.word}</span>
                    </div>
                    {showCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    {showWrong && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation Box */}
            {sentenceAnswered && (
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2 animate-fadeIn text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>คำตอบที่ถูกต้องคือ: <strong className="text-blue-700 underline font-inter">{currentSentenceWord.word}</strong></span>
                  </span>
                  <button
                    onClick={() => speech.speak(currentSentenceWord.word)}
                    className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>ฟังเสียง</span>
                  </button>
                </div>
                <p className="text-slate-700">
                  <strong className="text-slate-900">ความหมายภาษาไทย:</strong> {currentSentenceWord.thai} ({currentSentenceWord.pos})
                </p>
                <p className="text-slate-600 text-[11px] italic font-inter">
                  <strong className="not-italic text-slate-800">ประโยคสมบูรณ์:</strong> "{currentSentenceWord.example}"
                </p>
              </div>
            )}
          </div>

          {/* Bottom Next / Action Bar */}
          <div className="flex items-center justify-between text-xs pt-2">
            <button
              onClick={() => {
                if (sentenceIndex > 0) setSentenceIndex(s => s - 1);
              }}
              disabled={sentenceIndex === 0}
              className="px-3 py-1.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30"
            >
              ← ประโยคก่อนหน้า
            </button>

            <button
              onClick={handleSentenceNext}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs md:text-sm transition flex items-center gap-2 shadow-xs"
            >
              <span>{sentenceAnswered ? 'ประโยคถัดไป [Enter]' : 'ข้ามข้อนี้'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          MODE 4: WORD SCRAMBLE (SPELLING DECODER)
         ======================================================== */}
      {mode === 'scramble' && (
        <div className="max-w-xl mx-auto space-y-4 py-2">
          {/* Header Info */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>คำที่ <strong className="text-slate-900 font-bold">{scrambleIndex + 1}</strong> จาก {deck.length} คำ</span>
            <span className="text-purple-700 font-bold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> ถอดรหัสสำเร็จ: {scrambleSolvedCount} คำ
            </span>
          </div>

          {/* Puzzle Card */}
          <div className="bg-gradient-to-br from-purple-50/50 via-white to-slate-50 p-6 md:p-8 rounded-3xl border-2 border-purple-200 text-center space-y-5 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full">
                {currentScrambleWord.unit}
              </span>
              <span className="text-slate-400 font-medium">
                Part of Speech: <strong className="text-slate-700 font-inter">{currentScrambleWord.pos}</strong>
              </span>
            </div>

            {/* Target Meaning & Hint */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block">
                คำแปลภาษาไทย:
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900">
                {currentScrambleWord.thai}
              </h3>
              <p className="text-xs text-slate-500 italic font-inter pt-1">
                "{getBlankedSentence(currentScrambleWord.example, currentScrambleWord.word)}"
              </p>
            </div>

            {/* Letter Assembled Slots */}
            <div className={`flex flex-wrap items-center justify-center gap-1.5 min-h-[50px] p-3 rounded-2xl bg-slate-100/80 border border-slate-200 transition ${
              scrambleShake ? 'ring-2 ring-rose-500 animate-shake' : scrambleSolved ? 'ring-2 ring-emerald-500 bg-emerald-50/50' : ''
            }`}>
              {Array.from({ length: currentScrambleWord.word.length }).map((_, idx) => {
                const item = assembledLetters[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => item && handleRemoveAssembledChar(idx)}
                    disabled={scrambleSolved}
                    className={`w-10 h-11 md:w-12 md:h-13 rounded-xl font-mono font-black text-lg md:text-xl flex items-center justify-center transition border-2 select-none ${
                      item 
                        ? scrambleSolved 
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                          : 'bg-white text-purple-950 border-purple-300 shadow-xs hover:border-rose-400'
                        : 'bg-white/60 text-slate-300 border-dashed border-slate-300'
                    }`}
                  >
                    {item ? item.char : '_'}
                  </button>
                );
              })}
            </div>

            {/* Scrambled Letter Bank */}
            {!scrambleSolved ? (
              <div className="space-y-3 pt-2">
                <span className="text-xs text-slate-400 font-medium block">
                  คลิกตัวอักษรเพื่อเรียงสะกดคำศัพท์ (หรือพิมพ์ด้วยแป้นพิมพ์ได้):
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-sm mx-auto">
                  {scrambleLetters.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => handleSelectScrambleChar(l)}
                      disabled={l.used}
                      className={`w-10 h-11 md:w-11 md:h-12 rounded-xl font-mono font-black text-base md:text-lg transition border-2 flex items-center justify-center select-none active:scale-95 ${
                        l.used 
                          ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-default opacity-40' 
                          : 'bg-purple-600 hover:bg-purple-700 text-white border-purple-700 shadow-xs hover:scale-105'
                      }`}
                    >
                      {l.char}
                    </button>
                  ))}
                </div>

                {/* Helper Buttons: Hint, Clear */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={handleHintFirstLetter}
                    disabled={assembledLetters.length > 0}
                    className="text-xs text-amber-700 hover:text-amber-900 font-bold bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1 transition disabled:opacity-40"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>ใบ้ตัวแรก</span>
                  </button>

                  <button
                    onClick={handleClearScramble}
                    disabled={assembledLetters.length === 0}
                    className="text-xs text-slate-600 hover:text-slate-900 font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition disabled:opacity-40"
                  >
                    ล้างทั้งหมด (Clear)
                  </button>
                </div>
              </div>
            ) : (
              /* Solved Celebration Box */
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-center gap-2 text-emerald-800 font-black text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>สะกดคำศัพท์ถูกต้อง! (+25 XP)</span>
                </div>
                <div className="text-xs text-slate-700">
                  <strong className="text-slate-900">{currentScrambleWord.word}</strong>: {currentScrambleWord.thai}
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={() => speech.speak(currentScrambleWord.word)}
                    className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>ฟังการออกเสียง</span>
                  </button>
                  <button
                    onClick={handleScrambleNext}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-xs"
                  >
                    <span>ถอดรหัสคำถัดไป</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <button
              onClick={() => {
                if (scrambleIndex > 0) setScrambleIndex(s => s - 1);
              }}
              disabled={scrambleIndex === 0}
              className="px-3 py-1.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30"
            >
              ← คำก่อนหน้า
            </button>

            <button
              onClick={handleScrambleNext}
              className="hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1"
            >
              <span>ข้ามคำนี้</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          MODE 5: SPEED MATCH MINI-GAME (SHOWS WHAT MATCHED WITH WHAT!)
         ======================================================== */}
      {mode === 'match' && (
        <div className="max-w-2xl mx-auto space-y-4 py-2">
          {/* Speed Match Header Stats */}
          <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black">
                <Zap className="w-5 h-5 fill-slate-950" />
              </span>
              <div>
                <h3 className="font-black text-sm md:text-base text-amber-300">
                  SPEED MATCH ARENA
                </h3>
                <p className="text-[11px] text-slate-300">
                  จับคู่คำศัพท์ภาษาอังกฤษกับความหมายไทยให้ครบ 6 คู่ให้เร็วที่สุด!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono font-bold">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-sarabun uppercase">เวลา:</span>
                <span className="text-amber-400 text-base font-black">{matchTimer.toFixed(1)}s</span>
              </div>

              {bestMatchTime && (
                <div className="text-right border-l border-slate-700 pl-4 hidden sm:block">
                  <span className="text-[10px] text-slate-400 block font-sarabun uppercase">สถิติดีสุด:</span>
                  <span className="text-emerald-400 text-base font-black">{bestMatchTime}s</span>
                </div>
              )}
            </div>
          </div>

          {/* Victory Banner (shown when all 6 pairs matched, while KEEPING the 6 cards visible below for study!) */}
          {isMatchFinished && (
            <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-indigo-950 text-white p-5 md:p-6 rounded-3xl border-2 border-emerald-400 shadow-lg animate-fadeIn text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <span className="p-1.5 rounded-xl bg-amber-400 text-slate-950">
                  <Trophy className="w-6 h-6" />
                </span>
                <h4 className="text-xl md:text-2xl font-black text-amber-300">
                  🎉 ยอดเยี่ยมมาก! จับคู่ครบทั้ง 6 คำ
                </h4>
              </div>

              <div className="flex items-center justify-center gap-6 py-1 text-sm font-mono">
                <div className="bg-white/10 px-4 py-1.5 rounded-xl">
                  <span className="text-[10px] text-slate-300 block font-sarabun">เวลาที่ใช้</span>
                  <span className="text-lg font-black text-amber-300">{matchTimer.toFixed(1)} วินาที</span>
                </div>
                <div className="bg-white/10 px-4 py-1.5 rounded-xl">
                  <span className="text-[10px] text-slate-300 block font-sarabun">XP ที่ได้รับ</span>
                  <span className="text-lg font-black text-emerald-400">+200 XP</span>
                </div>
              </div>

              <p className="text-xs text-slate-300">
                คุณสามารถตรวจดูคู่คำศัพท์ทั้ง 6 คู่ด้านล่าง และฟังการออกเสียงเพื่อทบทวนความจำได้เลยครับ!
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={initMatchRound}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs md:text-sm transition flex items-center gap-2 shadow-md active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>เล่นรอบต่อไป (สุ่ม 6 คำใหม่)</span>
                </button>

                <button
                  onClick={() => setMode('single')}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-2.5 rounded-xl text-xs md:text-sm transition flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>กลับไปโหมดการ์ดพลิก</span>
                </button>
              </div>
            </div>
          )}

          {/* Columns: English on Left, Thai on Right */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3.5">
              {/* English Column */}
              <div className="space-y-2">
                <span className="text-xs font-black text-blue-700 uppercase tracking-wider block px-1">
                  ENGLISH WORDS (6)
                </span>
                {matchCardsEng.map((card) => {
                  const isMatched = matchedPairs.has(card.id);
                  const isSelected = selectedEng?.id === card.id;

                  return (
                    <button
                      key={card.id}
                      onClick={() => handleSelectEngTile(card)}
                      disabled={isMatched}
                      className={`w-full text-left p-3.5 rounded-2xl font-bold transition-all duration-200 border-2 select-none shadow-xs ${
                        isMatched 
                          ? 'bg-gradient-to-r from-emerald-50 to-teal-50/70 text-emerald-950 border-emerald-400 ring-1 ring-emerald-300/80 cursor-default shadow-xs' 
                          : isSelected 
                            ? wrongShake 
                              ? 'bg-rose-50 text-rose-800 border-rose-500 scale-[1.02] shadow-sm'
                              : 'bg-blue-50 text-blue-900 border-blue-500 shadow-md ring-2 ring-blue-300 scale-[1.02]' 
                            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs hover:border-blue-300'
                      }`}
                    >
                      {isMatched ? (
                        <div className="w-full space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm md:text-base font-black text-emerald-950 font-inter">{card.word}</span>
                              <span className="text-[10px] text-emerald-700 italic font-inter font-semibold">({card.pos})</span>
                            </div>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                              <span>จับคู่ถูก</span>
                            </span>
                          </div>
                          <div className="pt-1.5 border-t border-emerald-200/70 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1 text-emerald-900">
                              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wide">คู่กับ:</span>
                              <span className="font-bold text-slate-900 bg-white/90 px-2 py-0.5 rounded-md border border-emerald-200 shadow-2xs">
                                "{card.thai}"
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                speech.speak(card.word);
                              }}
                              className="p-1 text-emerald-700 hover:text-emerald-950 rounded-lg hover:bg-emerald-100 transition"
                              title="ฟังเสียงอ่าน"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <span className="text-sm font-black block font-inter">{card.word}</span>
                            <span className="text-[10px] text-slate-500 italic font-inter font-normal">({card.pos})</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speech.speak(card.word);
                            }}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded-lg"
                            title="ฟังเสียง"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Thai Column */}
              <div className="space-y-2">
                <span className="text-xs font-black text-indigo-700 uppercase tracking-wider block px-1">
                  THAI MEANINGS (6)
                </span>
                {matchCardsThai.map((card) => {
                  const isMatched = matchedPairs.has(card.id);
                  const isSelected = selectedThai?.id === card.id;

                  return (
                    <button
                      key={card.id}
                      onClick={() => handleSelectThaiTile(card)}
                      disabled={isMatched}
                      className={`w-full text-left p-3.5 rounded-2xl font-bold transition-all duration-200 border-2 select-none shadow-xs ${
                        isMatched 
                          ? 'bg-gradient-to-r from-emerald-50 to-teal-50/70 text-emerald-950 border-emerald-400 ring-1 ring-emerald-300/80 cursor-default shadow-xs' 
                          : isSelected 
                            ? wrongShake 
                              ? 'bg-rose-50 text-rose-800 border-rose-500 scale-[1.02] shadow-sm'
                              : 'bg-indigo-50 text-indigo-900 border-indigo-500 shadow-md ring-2 ring-indigo-300 scale-[1.02]' 
                            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs hover:border-indigo-300'
                      }`}
                    >
                      {isMatched ? (
                        <div className="w-full space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-emerald-950">{card.thai}</span>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                              <span>จับคู่ถูก</span>
                            </span>
                          </div>
                          <div className="pt-1.5 border-t border-emerald-200/70 text-xs">
                            <div className="flex items-center gap-1 text-emerald-900">
                              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wide">คู่กับ:</span>
                              <span className="font-bold text-blue-950 font-inter bg-white/90 px-2 py-0.5 rounded-md border border-emerald-200 shadow-2xs">
                                "{card.word}"
                              </span>
                              <span className="text-[10px] text-slate-500 font-normal italic">({card.pos})</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs md:text-sm font-semibold">{card.thai}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-500 font-medium">
                จับคู่สำเร็จแล้ว: <strong className="text-emerald-700">{matchedPairs.size}</strong> / 6 คู่
              </span>
              <button
                onClick={initMatchRound}
                className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>สุ่ม 6 คำใหม่</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODE 6: GRID / TABLE OF ALL 160 CARDS
         ======================================================== */}
      {mode === 'grid' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium pb-1 border-b border-slate-100">
            <span>แสดงทั้งหมด <strong>{deck.length}</strong> คำจาก 160 คำ</span>
            <span className="text-emerald-700 font-bold">จำได้แล้ว {masteredWords.size} คำ</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {deck.map((item, index) => {
              const wordMastered = masteredWords.has(item.word);

              return (
                <div
                  key={index}
                  className={`p-4 rounded-2xl border transition flex flex-col justify-between space-y-2.5 ${
                    wordMastered 
                      ? 'bg-emerald-50/20 border-emerald-300' 
                      : 'bg-white hover:bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-blue-950">{item.word}</span>
                        <span className="text-xs italic text-slate-500 font-inter">({item.pos})</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">{item.unit}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 mt-1">{item.thai}</p>
                    <p className="text-[11px] text-slate-600 mt-2 bg-slate-50 p-2 rounded-xl border border-slate-200/60 leading-relaxed font-inter">
                      <span className="text-blue-600 font-bold">Ex:</span> "{item.example}"
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                    <button
                      onClick={() => {
                        setMasteredWords(prev => {
                          const next = new Set(prev);
                          if (next.has(item.word)) {
                            next.delete(item.word);
                          } else {
                            next.add(item.word);
                            setXp(x => x + 10);
                            playSound('correct', soundEnabled);
                          }
                          return next;
                        });
                      }}
                      className={`flex items-center gap-1 text-[11px] font-semibold transition ${
                        wordMastered ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {wordMastered ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Circle className="w-3.5 h-3.5" />}
                      <span>{wordMastered ? 'แม่นแล้ว' : 'ยังไม่แม่น'}</span>
                    </button>

                    <button
                      onClick={() => speech.speak(item.word)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>ออกเสียง</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
