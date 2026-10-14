import React, { useState, useEffect, useRef } from 'react';
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
  Star
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
    }
  } catch (err) {
    // AudioContext blocked or not supported - ignore gracefully
  }
};

// Level Tiers for Gamification
const LEVEL_TIERS = [
  { level: 1, title: '🌱 Novice Hunter', minXp: 0, maxXp: 120 },
  { level: 2, title: '⚡ Word Explorer', minXp: 120, maxXp: 350 },
  { level: 3, title: '⚔️ Exam Scholar', minXp: 350, maxXp: 700 },
  { level: 4, title: '🏆 Vocab Slayer', minXp: 700, maxXp: 1200 },
  { level: 5, title: '👑 Master Linguist', minXp: 1200, maxXp: 1800 },
  { level: 6, title: '🌌 English Legend', minXp: 1800, maxXp: 999999 }
];

const getCurrentLevel = (xp) => {
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_TIERS[i].minXp) {
      return LEVEL_TIERS[i];
    }
  }
  return LEVEL_TIERS[0];
};

// Helper: Blank out target word in sentence for hint mode
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

export default function VocabTab({ speech }) {
  // Mode: 'single' (flashcards 1 by 1), 'match' (Speed Match mini-game), or 'grid' (browse all 160 cards)
  const [mode, setMode] = useState('single');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [masteredWords, setMasteredWords] = useState(new Set());
  const [filterNeedsReview, setFilterNeedsReview] = useState(false);
  const [deck, setDeck] = useState(vocabData);
  const [isFinished, setIsFinished] = useState(false);

  // Gamification state
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Speed Match Mini-game state
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

  // Load saved XP and mastered words from localStorage if available
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
    } catch (e) {
      // ignore
    }
  }, []);

  // Save XP and mastered words
  useEffect(() => {
    try {
      localStorage.setItem('eng_vocab_xp', xp.toString());
      localStorage.setItem('eng_vocab_mastered', JSON.stringify(Array.from(masteredWords)));
      if (bestMatchTime) localStorage.setItem('eng_vocab_best_match_time', bestMatchTime.toString());
    } catch (e) {
      // ignore
    }
  }, [xp, masteredWords, bestMatchTime]);

  // Sync deck when filter changes
  useEffect(() => {
    let filtered = vocabData.filter(item => {
      const matchesSearch = item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.thai.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.example.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesUnit = selectedUnit === 'all' || item.unit === selectedUnit;
      const matchesReview = filterNeedsReview ? !masteredWords.has(item.word) : true;

      return matchesSearch && matchesUnit && matchesReview;
    });

    if (filtered.length === 0) {
      filtered = vocabData;
    }

    setDeck(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setIsFinished(false);
  }, [searchTerm, selectedUnit, filterNeedsReview]);

  // Keyboard navigation for single flashcard mode
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, currentIndex, isFlipped, deck, isFinished, soundEnabled, streak]);

  // Speed Match timer effect
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

  // Initialize or reset Speed Match round
  const initMatchRound = () => {
    // Pick 6 random words from the current filtered deck (or all vocabData if deck < 6)
    const sourcePool = deck.length >= 6 ? deck : vocabData;
    const shuffled = [...sourcePool].sort(() => Math.random() - 0.5);
    const selectedSix = shuffled.slice(0, 6);

    const engList = selectedSix.map(item => ({ id: item.word, word: item.word, pos: item.pos }));
    const thaiList = selectedSix.map(item => ({ id: item.word, thai: item.thai }));

    // Shuffle independently
    setMatchCardsEng([...engList].sort(() => Math.random() - 0.5));
    setMatchCardsThai([...thaiList].sort(() => Math.random() - 0.5));

    setSelectedEng(null);
    setSelectedThai(null);
    setMatchedPairs(new Set());
    setMatchTimer(0);
    setIsMatchRunning(true);
    setIsMatchFinished(false);
  };

  // Switch to match mode
  useEffect(() => {
    if (mode === 'match') {
      initMatchRound();
    } else {
      setIsMatchRunning(false);
    }
  }, [mode, selectedUnit]);

  // Handle tile selection in Speed Match
  const handleSelectEngTile = (card) => {
    if (matchedPairs.has(card.id)) return;
    playSound('flip', soundEnabled);
    setSelectedEng(card);

    // If Thai is already selected, check match
    if (selectedThai) {
      checkMatch(card.id, selectedThai.id);
    }
  };

  const handleSelectThaiTile = (card) => {
    if (matchedPairs.has(card.id)) return;
    playSound('flip', soundEnabled);
    setSelectedThai(card);

    // If Eng is already selected, check match
    if (selectedEng) {
      checkMatch(selectedEng.id, card.id);
    }
  };

  const checkMatch = (engId, thaiId) => {
    if (engId === thaiId) {
      // MATCHED!
      playSound('match', soundEnabled);
      const nextMatched = new Set(matchedPairs);
      nextMatched.add(engId);
      setMatchedPairs(nextMatched);

      // Add to mastered
      setMasteredWords(prev => new Set(prev).add(engId));

      // XP Bonus
      setXp(x => x + 25);
      setStreak(s => {
        const next = s + 1;
        setBestStreak(b => Math.max(b, next));
        return next;
      });

      setSelectedEng(null);
      setSelectedThai(null);

      // Check if round completed (all 6 pairs matched)
      if (nextMatched.size === 6) {
        setIsMatchRunning(false);
        setIsMatchFinished(true);
        playSound('fanfare', soundEnabled);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setXp(x => x + 50); // Round completion bonus
        setBestMatchTime(prev => {
          const currentTime = parseFloat(matchTimer.toFixed(1));
          if (!prev || currentTime < prev) return currentTime;
          return prev;
        });
      }
    } else {
      // WRONG PAIR
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

  const currentItem = deck[currentIndex] || deck[0] || vocabData[0];
  const isMastered = masteredWords.has(currentItem.word);
  const currentLevel = getCurrentLevel(xp);
  const percentMastered = Math.round((masteredWords.size / vocabData.length) * 100);

  // Level progress percentage
  const xpInCurrentLevel = xp - currentLevel.minXp;
  const levelSpan = currentLevel.maxXp - currentLevel.minXp;
  const levelProgressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / levelSpan) * 100)));

  const handleFlip = () => {
    playSound('flip', soundEnabled);
    setIsFlipped(prev => !prev);
  };

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
      setShowHint(false);
    } else {
      setIsFinished(true);
      playSound('fanfare', soundEnabled);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  const handleMarkMastered = () => {
    const earnedXp = 10 + Math.min(streak * 2, 20);
    setXp(prev => prev + earnedXp);

    const nextStreak = streak + 1;
    setStreak(nextStreak);
    setBestStreak(b => Math.max(b, nextStreak));

    setMasteredWords(prev => {
      const next = new Set(prev);
      next.add(currentItem.word);
      return next;
    });

    if (nextStreak > 0 && nextStreak % 5 === 0) {
      playSound('fanfare', soundEnabled);
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 }
      });
    } else {
      playSound('correct', soundEnabled);
    }

    handleNext();
  };

  const handleMarkReview = () => {
    playSound('wrong', soundEnabled);
    setStreak(0);
    setMasteredWords(prev => {
      const next = new Set(prev);
      next.delete(currentItem.word);
      return next;
    });
    handleNext();
  };

  const handleShuffle = () => {
    playSound('flip', soundEnabled);
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
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

  return (
    <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      {/* Top Header & Gamification Status Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACADEMIC & BUSINESS VOCABULARY ARENA</span>
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-blue-600" />
            <span>คลังคำศัพท์สำคัญ & Flashcards (160 คำ)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ฝึกจำคำศัพท์ออกสอบบ่อย 4 Units พร้อมระบบสะสม XP, สตรีคต่อเนื่อง และมินิเกมจับคู่ประลองความเร็ว
          </p>
        </div>

        {/* Gamification Stats: Level, XP, Streak, Mastered & Sound */}
        <div className="flex flex-wrap items-center gap-3 bg-gradient-to-r from-slate-50 via-blue-50/40 to-indigo-50/40 p-3 rounded-2xl border border-slate-200 text-xs">
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
                {streak} {streak >= 3 && '🔥 Combo!'}
              </span>
            </div>
          </div>

          {/* Mastered Words Counter */}
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

          {/* Sound Toggle Button */}
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

      {/* Control & Mode Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Left Filter & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาศัพท์..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none w-36 sm:w-44"
            />
          </div>

          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
          >
            <option value="all">ทุก Unit (160 คำ)</option>
            <option value="Unit 5">Unit 5: Study (40 คำ)</option>
            <option value="Unit 6">Unit 6: IELTS (40 คำ)</option>
            <option value="Unit 7">Unit 7: TOEFL (40 คำ)</option>
            <option value="Unit 8">Unit 8: TOEIC (40 คำ)</option>
          </select>

          <button
            onClick={() => setFilterNeedsReview(!filterNeedsReview)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition border ${
              filterNeedsReview 
                ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' 
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span>เฉพาะคำที่ยังไม่แม่น</span>
          </button>
        </div>

        {/* Right 3-Way Mode Switch: Single Flashcard vs Speed Match vs Grid */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 self-start sm:self-auto gap-0.5">
          <button
            onClick={() => setMode('single')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
              mode === 'single'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>สำรับทีละใบ</span>
          </button>

          <button
            onClick={() => setMode('match')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
              mode === 'match'
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
            <span>Speed Match (จับคู่เร็ว)</span>
          </button>

          <button
            onClick={() => setMode('grid')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
              mode === 'grid'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>ตารางคำศัพท์ทั้งหมด</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          MODE 1: SINGLE FLASHCARD POP-UP DECK (Interactive Study)
         ======================================================== */}
      {mode === 'single' && (
        <div className="max-w-xl mx-auto space-y-4 py-2">
          {!isFinished ? (
            <>
              {/* Deck Progress & Streak Display */}
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
                      isFlipped 
                        ? 'bg-white/20 text-blue-200' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {currentItem.unit}
                    </span>

                    {/* Hint Button on Front */}
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
                        title="ดูประโยคบอกใบ้ซ่อนคำศัพท์ (Fill-in the blank)"
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
                    /* FRONT OF CARD (English Word & Hint) */
                    <div className="space-y-3 animate-fadeIn">
                      <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                        {currentItem.word}
                      </h3>
                      <span className="inline-block text-xs font-semibold italic text-slate-500 bg-slate-100 px-3 py-0.5 rounded-full font-inter">
                        {currentItem.pos}
                      </span>

                      {/* Interactive Hint Box */}
                      {showHint ? (
                        <div className="bg-amber-50/90 border border-amber-200 p-3.5 rounded-2xl max-w-md mx-auto text-left space-y-1 animate-fadeIn">
                          <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                            <span>ประโยคตัวอย่าง (ทายคำที่เว้นวรรค):</span>
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
                    /* BACK OF CARD (Thai Meaning & Full Example) */
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

                {/* Bottom Card Footer with Pronounce Button */}
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

              {/* Action Decision Buttons (Needs Review vs Mastered) */}
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

              {/* Card Navigation Controls */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition ${
                    currentIndex === 0 
                      ? 'text-slate-300 cursor-not-allowed' 
                      : 'hover:bg-slate-100 text-slate-700'
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
            /* FINISHED DECK CONGRATULATIONS SCREEN */
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
                  onClick={() => setMode('match')}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs md:text-sm transition flex items-center gap-2 shadow-sm"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>เล่นมินิเกม Speed Match</span>
                </button>

                <button
                  onClick={() => setMode('grid')}
                  className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-5 py-2.5 rounded-xl text-xs md:text-sm transition flex items-center gap-2 shadow-xs"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>ดูตารางคำศัพท์ทั้งหมด</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          MODE 2: SPEED MATCH MINI-GAME (High-Energy Vocabulary Arena)
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

          {!isMatchFinished ? (
            <div className="space-y-4">
              {/* Columns: English on Left, Thai on Right */}
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
                        className={`w-full text-left p-3.5 rounded-2xl font-bold transition duration-200 border-2 select-none flex items-center justify-between ${
                          isMatched 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 opacity-60 cursor-default' 
                            : isSelected 
                              ? wrongShake 
                                ? 'bg-rose-50 text-rose-800 border-rose-500 scale-[1.02] shadow-sm'
                                : 'bg-blue-50 text-blue-900 border-blue-500 shadow-md ring-2 ring-blue-300 scale-[1.02]' 
                              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs'
                        }`}
                      >
                        <div>
                          <span className="text-sm font-black block">{card.word}</span>
                          <span className="text-[10px] text-slate-500 italic font-inter font-normal">({card.pos})</span>
                        </div>
                        {isMatched ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
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
                        className={`w-full text-left p-3.5 rounded-2xl font-bold transition duration-200 border-2 select-none flex items-center justify-between ${
                          isMatched 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 opacity-60 cursor-default' 
                            : isSelected 
                              ? wrongShake 
                                ? 'bg-rose-50 text-rose-800 border-rose-500 scale-[1.02] shadow-sm'
                                : 'bg-indigo-50 text-indigo-900 border-indigo-500 shadow-md ring-2 ring-indigo-300 scale-[1.02]' 
                              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs'
                        }`}
                      >
                        <span className="text-xs md:text-sm font-semibold">{card.thai}</span>
                        {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reset / Reshuffle Match Round */}
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
          ) : (
            /* ROUND FINISHED CELEBRATION */
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl text-center space-y-4 border-2 border-amber-400 shadow-lg animate-fadeIn">
              <span className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center mx-auto shadow-md">
                <Trophy className="w-8 h-8" />
              </span>

              <h4 className="text-2xl font-black text-amber-300">
                🎉 ชนะแล้ว! จับคู่ครบทั้ง 6 คำ
              </h4>

              <div className="flex items-center justify-center gap-6 py-2 text-sm font-mono">
                <div className="bg-white/10 px-4 py-2 rounded-xl">
                  <span className="text-[10px] text-slate-300 block font-sarabun">เวลาที่ใช้</span>
                  <span className="text-xl font-black text-amber-300">{matchTimer.toFixed(1)} วินาที</span>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-xl">
                  <span className="text-[10px] text-slate-300 block font-sarabun">XP ที่ได้รับ</span>
                  <span className="text-xl font-black text-emerald-400">+200 XP</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                ความเร็วของคุณช่วยกระตุ้นความจำในระยะยาว (Active Recall) ได้ดีมากสำหรับการทำข้อสอบจริง!
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <button
                  onClick={initMatchRound}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3 rounded-xl text-xs md:text-sm transition flex items-center gap-2 shadow-md active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>เล่นรอบต่อไป (สุ่ม 6 คำใหม่)</span>
                </button>

                <button
                  onClick={() => setMode('single')}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-xl text-xs md:text-sm transition flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>กลับไปโหมดสำรับทีละใบ</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          MODE 3: GRID / TABLE OF ALL 160 CARDS (Browse & Search)
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
