import React, { useState, useEffect, useRef } from 'react';
import { test2Questions } from '../data/test2Data';
import { soundEffects } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Clock, 
  RotateCcw, 
  Send, 
  Flag, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  BookOpen, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Target, 
  Grid, 
  Lightbulb, 
  Scissors, 
  Zap, 
  Flame,
  FileText,
  Check,
  Layers,
  ArrowRight,
  Languages
} from 'lucide-react';
import ClickableWordText from './ClickableWordText';

export default function Test2Tab({ speech, soundEnabled = true, onAddXp }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [eliminatedOptions, setEliminatedOptions] = useState({});
  const [currentPartFilter, setCurrentPartFilter] = useState('all');
  const [isExamMode, setIsExamMode] = useState(false);
  const [examTime, setExamTime] = useState(50 * 60); // 50 mins for 40 questions
  const [showResultModal, setShowResultModal] = useState(false);
  const [showPaletteDrawer, setShowPaletteDrawer] = useState(false);
  const [filterMistakesOnly, setFilterMistakesOnly] = useState(false);
  const [showTricksModal, setShowTricksModal] = useState(false);
  const [activeTrickPart, setActiveTrickPart] = useState('all');
  const [showQuestionTranslations, setShowQuestionTranslations] = useState({});
  const [showChoiceTranslations, setShowChoiceTranslations] = useState({});

  const timerRef = useRef(null);

  // Timer interval for Exam Mode
  useEffect(() => {
    if (isExamMode) {
      timerRef.current = setInterval(() => {
        setExamTime(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isExamMode]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const optIdx = parseInt(e.key, 10) - 1;
        const currentQ = displayedQuestions[safeIndex];
        if (currentQ && optIdx < currentQ.options.length) {
          handleSelectOption(currentQ.id, optIdx);
        }
      } else if (['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(e.key)) {
        const keyMap = { a: 0, b: 1, c: 2, d: 3, A: 0, B: 1, C: 2, D: 3 };
        const optIdx = keyMap[e.key];
        const currentQ = displayedQuestions[safeIndex];
        if (currentQ && optIdx < currentQ.options.length) {
          handleSelectOption(currentQ.id, optIdx);
        }
      } else if (e.key === 'f' || e.key === 'F') {
        const currentQ = displayedQuestions[safeIndex];
        if (currentQ) toggleFlag(currentQ.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, userAnswers, currentPartFilter, filterMistakesOnly]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSelectOption = (qId, optionIdx) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));

    const question = test2Questions.find(q => q.id === qId);
    if (!question) return;

    if (!isExamMode) {
      const isCorrect = optionIdx === question.answer;
      if (isCorrect) {
        soundEffects.playCorrect(soundEnabled);
        if (onAddXp) onAddXp(15, 'ตอบ Test 2 ถูกต้อง');
      } else {
        soundEffects.playWrong(soundEnabled);
      }
    } else {
      soundEffects.playClick(soundEnabled);
    }
  };

  const toggleEliminateOption = (qId, optIdx, e) => {
    if (e) e.stopPropagation();
    setEliminatedOptions(prev => {
      const currentSet = new Set(prev[qId] || []);
      if (currentSet.has(optIdx)) currentSet.delete(optIdx);
      else currentSet.add(optIdx);
      return { ...prev, [qId]: currentSet };
    });
  };

  const toggleFlag = (qId) => {
    setFlaggedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  // Filter questions
  let displayedQuestions = test2Questions;
  if (filterMistakesOnly) {
    displayedQuestions = test2Questions.filter(q => userAnswers[q.id] !== undefined && userAnswers[q.id] !== q.answer);
    if (displayedQuestions.length === 0) displayedQuestions = test2Questions;
  } else if (currentPartFilter !== 'all') {
    displayedQuestions = test2Questions.filter(q => q.part === currentPartFilter);
  }

  const safeIndex = Math.min(Math.max(currentIndex, 0), Math.max(displayedQuestions.length - 1, 0));
  const activeQuestion = displayedQuestions[safeIndex] || test2Questions[0];
  const currentQId = activeQuestion.id;
  const currentAnswer = userAnswers[currentQId];
  const isAnswered = currentAnswer !== undefined;
  const isCorrect = isAnswered && currentAnswer === activeQuestion.answer;
  const isFlagged = flaggedQuestions.has(currentQId);

  const handlePrev = () => {
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (safeIndex < displayedQuestions.length - 1) {
      setCurrentIndex(safeIndex + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const jumpToQuestion = (qId) => {
    const targetIdx = displayedQuestions.findIndex(q => q.id === qId);
    if (targetIdx !== -1) {
      setCurrentIndex(targetIdx);
      setShowPaletteDrawer(false);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      setCurrentPartFilter('all');
      setFilterMistakesOnly(false);
      setTimeout(() => {
        const fullIdx = test2Questions.findIndex(q => q.id === qId);
        if (fullIdx !== -1) {
          setCurrentIndex(fullIdx);
          setShowPaletteDrawer(false);
          window.scrollTo({ top: 120, behavior: 'smooth' });
        }
      }, 50);
    }
  };

  const calculateScore = () => {
    let score = 0;
    const partScores = {};
    test2Questions.forEach(q => {
      if (userAnswers[q.id] === q.answer) {
        score++;
        partScores[q.part] = (partScores[q.part] || 0) + 1;
      }
    });
    return { score, partScores };
  };

  const { score: currentScore, partScores } = calculateScore();
  const answeredCount = Object.keys(userAnswers).length;
  const mistakesCount = test2Questions.filter(q => userAnswers[q.id] !== undefined && userAnswers[q.id] !== q.answer).length;
  const percentage = ((currentScore / test2Questions.length) * 100).toFixed(1);

  const handleSubmitTest = () => {
    setIsExamMode(false);
    setShowResultModal(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (percentage >= 70) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleResetAll = () => {
    if (confirm('คุณต้องการรีเซ็ตคำตอบทั้งหมดของ Test 2 และเริ่มฝึกใหม่ใช่หรือไม่?')) {
      setUserAnswers({});
      setFlaggedQuestions(new Set());
      setEliminatedOptions({});
      setShowResultModal(false);
      setFilterMistakesOnly(false);
      setIsExamMode(false);
      setExamTime(50 * 60);
      setCurrentIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const parts = [
    { id: 'all', label: 'ทั้งหมด (40 ข้อ)' },
    { id: 'Part 1: Marie Curie', label: 'Part 1: Marie Curie (Q1–10)' },
    { id: 'Part 2: Work-Study', label: 'Part 2: Work-Study T/F (Q11–20)' },
    { id: 'Part 3: Picture Description', label: 'Part 3: ภาพจักรยาน (Q21–26)' },
    { id: 'Part 4: Business Email', label: 'Part 4: Greenfield Email (Q27–32)' },
    { id: 'Part 5: Academic English', label: 'Part 5: Grammar & Dialogue (Q33–40)' }
  ];

  return (
    <div className="space-y-5">
      {/* ========================================================
          TOP HERO: TEST 2 EXAM CENTER
         ======================================================== */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 md:p-6 shadow-md border border-rose-700/50 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                🔥 TEST 2 (สอบบ่ายนี้)
              </span>
              <span className="text-xs text-rose-300 font-mono font-bold">
                10700320 • ข้อสอบปรนัย 40 ข้อ
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isExamMode ? 'bg-amber-400 text-slate-950 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
              }`}>
                {isExamMode ? '⏱️ โหมดจับเวลาสอบจริง (50 นาที)' : '💡 โหมดฝึกฝน (เฉลย & จุดสังเกตทันที)'}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-white">
              คลังข้อสอบเตรียมสอบ Test 2 ฉบับสมบูรณ์ (40 Questions)
            </h1>
            <p className="text-xs text-slate-300">
              แยกอิสระจาก Final 80 ข้อ • ครบทั้ง 5 ตอน (Marie Curie, Work-Study T/F, ภาพถนนจักรยาน, อีเมลช็อกโกแลต, ไวยากรณ์บทสนทนา)
            </p>
          </div>

          {/* Right Controller: Timer or Score + Start Exam Button */}
          <div className="flex items-center gap-3 shrink-0">
            {isExamMode ? (
              <div className="bg-slate-950/80 border border-amber-400/40 p-3 px-4 rounded-2xl flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                <div>
                  <span className="text-[10px] text-amber-300/80 block uppercase font-bold tracking-wider">เวลาสอบที่เหลือ</span>
                  <span className={`text-2xl font-black font-mono ${examTime < 300 ? 'text-red-400 animate-pulse' : 'text-amber-300'}`}>
                    {formatTimer(examTime)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/80 border border-slate-700/80 p-3 px-4 rounded-2xl flex items-center gap-3">
                <Award className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">คะแนน Test 2 ปัจจุบัน</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    {currentScore} <span className="text-xs text-slate-400 font-normal">/ 40 ข้อ ({percentage}%)</span>
                  </span>
                </div>
              </div>
            )}

            {isExamMode ? (
              <button
                onClick={handleSubmitTest}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-4 py-3 rounded-2xl text-xs transition shadow-md flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>ส่งข้อสอบ</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsExamMode(true);
                  setExamTime(50 * 60);
                  setShowResultModal(false);
                  setCurrentIndex(0);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold px-4 py-3 rounded-2xl text-xs transition shadow-md flex items-center gap-2 border border-rose-400/30"
              >
                <Clock className="w-4 h-4 text-amber-300" />
                <span>จำลองสอบจริง (50 นาที)</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress & Quick Stats */}
        <div className="pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">ความคืบหน้า:</span>
            <strong className="text-white font-bold">{answeredCount} / 40 ข้อ ({Math.round((answeredCount / 40) * 100)}%)</strong>
            <span className="text-slate-500">•</span>
            <span className="text-amber-300">ปักหมุดไว้: {flaggedQuestions.size} ข้อ</span>
            {mistakesCount > 0 && (
              <>
                <span className="text-slate-500">•</span>
                <span className="text-rose-400">ตอบผิด: {mistakesCount} ข้อ</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTricksModal(true)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-md animate-pulse hover:animate-none"
              title="เปิดดูสูตรลัด เทคนิคจำ และจุดหลอกของข้อสอบ Test 2 ทั้ง 5 ตอน"
            >
              <Lightbulb className="w-3.5 h-3.5 fill-current text-slate-950" />
              <span>💡 สูตรลัด & จุดหลอก (Hacks)</span>
            </button>
            <button
              onClick={() => setShowPaletteDrawer(!showPaletteDrawer)}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-1.5 rounded-xl border border-white/20 transition flex items-center gap-1.5"
            >
              <Grid className="w-3.5 h-3.5 text-amber-300" />
              <span>ผัง 40 ข้อ ({answeredCount}/40)</span>
            </button>
            <button
              onClick={handleResetAll}
              className="bg-white/10 hover:bg-white/20 text-slate-300 px-2.5 py-1.5 rounded-xl border border-white/20 transition"
              title="ล้างคำตอบและเริ่มใหม่"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Part Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>เลือกตอน:</span>
          </span>

          {parts.map(p => {
            const isActive = currentPartFilter === p.id && !filterMistakesOnly;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setCurrentPartFilter(p.id);
                  setFilterMistakesOnly(false);
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  isActive
                    ? 'bg-rose-600 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {p.label}
              </button>
            );
          })}

          {mistakesCount > 0 && (
            <button
              onClick={() => {
                setFilterMistakesOnly(!filterMistakesOnly);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
                filterMistakesOnly 
                  ? 'bg-red-600 text-white shadow-2xs' 
                  : 'bg-red-50 hover:bg-red-100 text-red-800 border border-red-200'
              }`}
            >
              <span>⚠️ ข้อที่ตอบผิด ({mistakesCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Palette Drawer */}
      {showPaletteDrawer && (
        <div className="bg-white p-5 rounded-3xl border-2 border-rose-500 shadow-xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <strong className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Grid className="w-4 h-4 text-rose-600" />
              <span>ผังกระดานเลือกข้อสอบ Test 2 (1–40):</span>
            </strong>
            <button
              onClick={() => setShowPaletteDrawer(false)}
              className="text-xs text-slate-400 hover:text-slate-700 font-bold"
            >
              ✕ ปิด
            </button>
          </div>

          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-20 gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200 max-h-48 overflow-y-auto">
            {test2Questions.map(q => {
              const ans = userAnswers[q.id] !== undefined;
              const flag = flaggedQuestions.has(q.id);
              const corr = ans && userAnswers[q.id] === q.answer;
              const cur = activeQuestion.id === q.id;

              let btnStyle = "bg-white text-slate-700 border-slate-200 hover:bg-slate-100";
              if (flag) btnStyle = "bg-amber-400 text-slate-950 font-bold border-amber-500";
              else if (ans) {
                if (isExamMode) btnStyle = "bg-blue-600 text-white font-bold";
                else btnStyle = corr ? "bg-emerald-600 text-white font-bold" : "bg-red-500 text-white font-bold";
              }

              return (
                <button
                  key={q.id}
                  onClick={() => jumpToQuestion(q.id)}
                  className={`h-7 rounded text-xs font-semibold transition border flex items-center justify-center ${btnStyle} ${
                    cur ? 'ring-2 ring-rose-500 ring-offset-1 font-black scale-105' : ''
                  }`}
                >
                  {q.id}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          QUESTION CARD & SIDEBAR (FOCUS MODE)
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Question Card (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-3 py-1 rounded-full bg-rose-600 text-white shadow-2xs">
                ข้อที่ {activeQuestion.id} / 40
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200">
                {activeQuestion.part}
              </span>
            </div>

            <button
              onClick={() => toggleFlag(currentQId)}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 border ${
                isFlagged 
                  ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current text-amber-600' : ''}`} />
              <span>{isFlagged ? 'ปักหมุดแล้ว' : 'ปักหมุด'}</span>
            </button>
          </div>

          {/* Context / Reading Passage */}
          {activeQuestion.passage && (
            <div className="p-4 md:p-5 bg-slate-50/90 rounded-2xl border border-slate-200 text-xs md:text-sm text-slate-800 leading-relaxed space-y-1.5 font-inter">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                <div className="flex items-center gap-2 font-sarabun font-bold text-slate-900 text-xs uppercase tracking-wide">
                  <BookOpen className="w-4 h-4 text-rose-600" />
                  <span>เนื้อหาประกอบโจทย์ (Passage Context - แตะคำศัพท์เพื่อดูคำแปล):</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">
                  แตะคำเพื่อฟังเสียง & ดูคำศัพท์
                </span>
              </div>
              <p className="whitespace-pre-line pl-1 leading-relaxed">
                <ClickableWordText text={activeQuestion.passage} />
              </p>
            </div>
          )}

          {/* Question Text with Quick Translate */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="text-base md:text-lg font-bold text-slate-900 leading-snug flex-grow">
                <ClickableWordText text={activeQuestion.q} />
              </div>

              {activeQuestion.qTh && (
                <button
                  type="button"
                  onClick={() => setShowQuestionTranslations(prev => ({ ...prev, [currentQId]: !prev[currentQId] }))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shrink-0 ${
                    showQuestionTranslations[currentQId]
                      ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
                  }`}
                  title="แปลโจทย์เป็นภาษาไทย"
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>{showQuestionTranslations[currentQId] ? 'ซ่อนแปลโจทย์' : 'แปลโจทย์'}</span>
                </button>
              )}
            </div>

            {/* Display Question Thai Translation */}
            {showQuestionTranslations[currentQId] && activeQuestion.qTh && (
              <div className="p-3 bg-rose-50/90 text-rose-950 font-bold text-xs md:text-sm rounded-xl border border-rose-200 animate-fadeIn flex items-center gap-2">
                <span className="text-xs bg-rose-200/80 text-rose-800 px-2 py-0.5 rounded-md font-black shrink-0">TH</span>
                <span>{activeQuestion.qTh}</span>
              </div>
            )}
          </div>

          {/* Quick Tip / Trick Banner for this question */}
          {activeQuestion.tip && !isExamMode && (
            <div className="p-3 bg-amber-50/90 rounded-2xl border border-amber-300/80 text-amber-950 text-xs leading-relaxed flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong className="text-amber-900 font-black">💡 Trick ข้อนี้:</strong> {activeQuestion.tip}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowTricksModal(true)}
                className="text-[11px] font-black text-rose-700 underline shrink-0 hover:text-rose-900"
              >
                เปิด Cheat Sheet ทุกตอน →
              </button>
            </div>
          )}

          {/* Options Header with Quick Translate All */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 border-t border-slate-100 pt-2">
            <span>แตะที่คำศัพท์ในช้อยส์เพื่อดูคำแปล หรือกด <Scissors className="w-3 h-3 inline text-slate-500" /> เพื่อตัดช้อยส์</span>
            {activeQuestion.optionsTh && (
              <button
                type="button"
                onClick={() => {
                  const allShown = [0, 1, 2, 3].every(idx => showChoiceTranslations[currentQId]?.[idx]);
                  setShowChoiceTranslations(prev => ({
                    ...prev,
                    [currentQId]: {
                      0: !allShown,
                      1: !allShown,
                      2: !allShown,
                      3: !allShown
                    }
                  }));
                }}
                className="text-rose-700 hover:text-rose-900 font-bold flex items-center gap-1 hover:underline cursor-pointer transition text-xs"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{[0, 1, 2, 3].every(idx => showChoiceTranslations[currentQId]?.[idx]) ? 'ซ่อนคำแปลช้อยส์' : '🌐 แปลทุกช้อยส์ (ไทย)'}</span>
              </button>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid sm:grid-cols-2 gap-3">
            {activeQuestion.options.map((opt, optIdx) => {
              const isEliminated = (eliminatedOptions[currentQId] || new Set()).has(optIdx);

              let btnStyle = "bg-white border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-800";
              let badgeStyle = "bg-slate-100 text-slate-700 border-slate-300";

              if (isEliminated) {
                btnStyle = "bg-slate-100/80 border-dashed border-slate-300 text-slate-400 line-through opacity-50";
                badgeStyle = "bg-slate-200 text-slate-400 border-slate-300";
              } else if (isExamMode) {
                if (currentAnswer === optIdx) {
                  btnStyle = "bg-rose-50 border-rose-600 font-bold text-rose-900 shadow-2xs ring-2 ring-rose-500";
                  badgeStyle = "bg-rose-600 text-white border-rose-600";
                }
              } else {
                if (isAnswered) {
                  if (optIdx === activeQuestion.answer) {
                    btnStyle = "bg-emerald-50 border-emerald-500 font-bold text-emerald-950 ring-2 ring-emerald-500";
                    badgeStyle = "bg-emerald-600 text-white border-emerald-600";
                  } else if (currentAnswer === optIdx) {
                    btnStyle = "bg-red-50 border-red-500 font-bold text-red-950 ring-2 ring-red-500";
                    badgeStyle = "bg-red-600 text-white border-red-600";
                  } else {
                    btnStyle = "bg-slate-50/60 border-slate-200 text-slate-400 opacity-60";
                    badgeStyle = "bg-slate-200 text-slate-500 border-slate-300";
                  }
                }
              }

              const choiceLetter = String.fromCharCode(65 + optIdx);
              const optClean = opt.startsWith('A. ') || opt.startsWith('B. ') || opt.startsWith('C. ') || opt.startsWith('D. ') 
                ? opt.substring(3) 
                : opt;

              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQId, optIdx)}
                  className={`p-4 rounded-2xl border-2 transition flex items-start gap-3 relative cursor-pointer group ${btnStyle}`}
                >
                  <span className={`w-7 h-7 rounded-lg border text-xs font-black flex items-center justify-center shrink-0 mt-0.5 ${badgeStyle}`}>
                    {choiceLetter}
                  </span>
                  
                  <div className="flex-grow space-y-1.5 pt-0.5">
                    <ClickableWordText
                      text={optClean}
                      choiceLetter={choiceLetter}
                      onSelectChoice={() => handleSelectOption(currentQId, optIdx)}
                      className="leading-relaxed block text-xs md:text-sm font-medium"
                    />

                    {/* Inline Full Choice Thai Translation */}
                    {showChoiceTranslations[currentQId]?.[optIdx] && activeQuestion.optionsTh?.[optIdx] && (
                      <div className="text-[11px] font-bold text-rose-900 bg-rose-50/90 p-2 rounded-xl border border-rose-200/80 animate-fadeIn flex items-center gap-1.5">
                        <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.2 rounded font-black shrink-0">TH</span>
                        <span>{activeQuestion.optionsTh[optIdx].replace(/^[A-D]\.\s*/, '')}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                    {/* Translate this choice button */}
                    {activeQuestion.optionsTh && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowChoiceTranslations(prev => ({
                            ...prev,
                            [currentQId]: {
                              ...(prev[currentQId] || {}),
                              [optIdx]: !prev[currentQId]?.[optIdx]
                            }
                          }));
                        }}
                        className={`p-1.5 rounded-lg transition ${
                          showChoiceTranslations[currentQId]?.[optIdx]
                            ? 'bg-rose-100 text-rose-800 font-bold'
                            : 'opacity-60 group-hover:opacity-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700'
                        }`}
                        title={showChoiceTranslations[currentQId]?.[optIdx] ? "ซ่อนคำแปลช้อยส์นี้" : "แปลช้อยส์นี้เป็นภาษาไทย"}
                      >
                        <Languages className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Eliminate button */}
                    <button
                      type="button"
                      onClick={(e) => toggleEliminateOption(currentQId, optIdx, e)}
                      className={`p-1.5 rounded-lg transition ${
                        isEliminated 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'opacity-60 group-hover:opacity-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700'
                      }`}
                      title={isEliminated ? "ยกเลิกการตัดช้อยส์นี้" : "ตัดช้อยส์นี้"}
                    >
                      <Scissors className="w-3.5 h-3.5" />
                    </button>

                    {(!isExamMode && isAnswered) && (
                      optIdx === activeQuestion.answer ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : currentAnswer === optIdx ? (
                        <XCircle className="w-5 h-5 text-red-600" />
                      ) : null
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation in Practice Mode */}
          {(!isExamMode && isAnswered) && (
            <div className={`p-5 rounded-2xl text-xs md:text-sm space-y-2.5 border-2 animate-fadeIn ${
              isCorrect ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' : 'bg-red-50/80 border-red-300 text-red-950'
            }`}>
              <div className="flex items-center gap-2 font-black text-sm">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>ถูกต้องยอดเยี่ยม! (เฉลยข้อ {String.fromCharCode(65 + activeQuestion.answer)})</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <span>ยังไม่ถูกต้อง (คุณตอบข้อ {String.fromCharCode(65 + currentAnswer)} • คำตอบที่ถูกคือข้อ {String.fromCharCode(65 + activeQuestion.answer)})</span>
                  </>
                )}
              </div>

              <p className="leading-relaxed text-slate-800">
                <strong className="text-slate-900 block mb-0.5">คำอธิบายเฉลย:</strong>
                {activeQuestion.explanation}
              </p>

              {activeQuestion.tip && (
                <div className="p-2.5 bg-white rounded-xl border border-amber-300/80 text-amber-950 text-xs leading-relaxed flex items-start gap-2 shadow-2xs">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-900 font-bold">💡 จุดสังเกต & เทคนิคการจำ:</strong> {activeQuestion.tip}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Navigation */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              disabled={safeIndex === 0}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 border transition ${
                safeIndex === 0
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-2xs'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>ข้อก่อนหน้า</span>
            </button>

            <span className="text-[11px] text-slate-400 hidden md:inline">
              คีย์ลัด: [←] ก่อนหน้า | [→] ถัดไป | [1-4 / A-D] เลือกข้อ | [F] ปักหมุด
            </span>

            {safeIndex < displayedQuestions.length - 1 ? (
              <button
                onClick={handleNext}
                className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs md:text-sm flex items-center justify-center gap-2 transition shadow-sm"
              >
                <span>ข้อถัดไป</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs md:text-sm flex items-center justify-center gap-2 transition shadow-sm"
              >
                <Award className="w-4 h-4" />
                <span>เสร็จสิ้น & ดูผลคะแนน</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Palette Sidebar (4 Cols) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-20 space-y-3.5">
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-sm space-y-2 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                {isExamMode ? '⏱️ เวลาที่เหลือ' : '📊 คะแนน Test 2'}
              </span>
              <span className="text-sm font-bold text-emerald-400">
                {currentScore} / 40 ({percentage}%)
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${(currentScore / 40) * 100}%` }}
              />
            </div>
          </div>

          {/* Desktop 40-item Matrix */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Grid className="w-4 h-4 text-rose-600" />
                <span>ผังข้อสอบ Test 2 (1–40):</span>
              </span>
              <span className="text-[11px] text-slate-500">ตอบ {answeredCount}/40</span>
            </div>

            <div className="grid grid-cols-8 gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-200/80 max-h-[300px] overflow-y-auto">
              {test2Questions.map(q => {
                const ans = userAnswers[q.id] !== undefined;
                const flag = flaggedQuestions.has(q.id);
                const corr = ans && userAnswers[q.id] === q.answer;
                const cur = activeQuestion.id === q.id;

                let btnStyle = "bg-white text-slate-700 border-slate-200 hover:bg-slate-100";
                if (flag) btnStyle = "bg-amber-400 text-slate-950 font-bold border-amber-500";
                else if (ans) {
                  if (isExamMode) btnStyle = "bg-blue-600 text-white font-bold border-blue-700";
                  else btnStyle = corr ? "bg-emerald-600 text-white font-bold border-emerald-700" : "bg-red-500 text-white font-bold border-red-600";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => jumpToQuestion(q.id)}
                    className={`h-7 rounded-lg text-[10px] font-bold transition flex items-center justify-center border ${btnStyle} ${
                      cur ? 'ring-2 ring-rose-500 ring-offset-1 font-black scale-105 shadow-xs' : ''
                    }`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white max-w-xl w-full rounded-3xl p-6 md:p-8 space-y-5 border-2 border-emerald-500 shadow-2xl">
            <div className="text-center space-y-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                🎉 สรุปผลคะแนน Test 2 (40 ข้อ)
              </span>
              <h3 className="text-3xl font-black text-slate-900">
                คุณได้ <span className="text-emerald-600">{currentScore}</span> / 40 คะแนน
              </h3>
              <p className="text-sm font-bold text-slate-600">
                คิดเป็น {percentage}% — {percentage >= 80 ? '🌟 ยอดเยี่ยมมาก พร้อมสอบบ่ายนี้!' : '👍 ผลการทดสอบอยู่ในเกณฑ์ดี ควรอ่านทบทวนข้อที่ผิด'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <strong className="block text-slate-900 font-bold">📊 ผลคะแนนแยกตามตอน:</strong>
              <div className="space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span>Part 1: Marie Curie (10 ข้อ)</span>
                  <strong>{partScores['Part 1: Marie Curie'] || 0} / 10</strong>
                </div>
                <div className="flex justify-between">
                  <span>Part 2: Work-Study T/F (10 ข้อ)</span>
                  <strong>{partScores['Part 2: Work-Study'] || 0} / 10</strong>
                </div>
                <div className="flex justify-between">
                  <span>Part 3: Picture Description (6 ข้อ)</span>
                  <strong>{partScores['Part 3: Picture Description'] || 0} / 6</strong>
                </div>
                <div className="flex justify-between">
                  <span>Part 4: Greenfield Email (6 ข้อ)</span>
                  <strong>{partScores['Part 4: Business Email'] || 0} / 6</strong>
                </div>
                <div className="flex justify-between">
                  <span>Part 5: Grammar & Dialogue (8 ข้อ)</span>
                  <strong>{partScores['Part 5: Academic English'] || 0} / 8</strong>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
              {mistakesCount > 0 && (
                <button
                  onClick={() => {
                    setFilterMistakesOnly(true);
                    setShowResultModal(false);
                  }}
                  className="bg-red-50 hover:bg-red-100 text-red-700 font-bold px-4 py-2 rounded-xl text-xs transition"
                >
                  ดูเฉพาะข้อที่ตอบผิด ({mistakesCount} ข้อ)
                </button>
              )}
              <button
                onClick={() => setShowResultModal(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2 rounded-xl text-xs transition"
              >
                ไล่ตรวจดูเฉลยทั้ง 40 ข้อ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test 2 Tricks & Hacks Cheat-Sheet Modal */}
      {showTricksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/75 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 via-rose-600 to-indigo-950 text-white p-5 md:p-6 flex items-start justify-between relative shrink-0">
              <div className="space-y-1 pr-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-slate-950/40 text-amber-300 font-mono text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    TEST 2 CHEAT SHEET & EXAM HACKS
                  </span>
                  <span className="bg-white text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full">
                    สอบบ่ายนี้
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white">
                  💡 รวมสูตรลัด เทคนิคจำ & จุดหลอกข้อสอบ Test 2 (40 ข้อ)
                </h2>
                <p className="text-xs text-amber-100">
                  ทบทวนคีย์เวิร์ดสำคัญ จุดดักคะแนน และสูตรโครงสร้างประโยคก่อนเข้าห้องสอบบ่ายนี้
                </p>
              </div>

              <button
                onClick={() => setShowTricksModal(false)}
                className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
                title="ปิดหน้าต่าง"
              >
                ✕ ปิด
              </button>
            </div>

            {/* Part Selector Pills */}
            <div className="bg-slate-100 p-3 px-5 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
              {[
                { id: 'all', label: 'รวมทุกตอน (All Hacks)' },
                { id: 'p1', label: 'Part 1: Marie Curie' },
                { id: 'p2', label: 'Part 2: Work-Study T/F' },
                { id: 'p3', label: 'Part 3: ภาพถนนจักรยาน' },
                { id: 'p4', label: 'Part 4: Greenfield Email' },
                { id: 'p5', label: 'Part 5: Grammar & Dialogue' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTrickPart(t.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                    activeTrickPart === t.id 
                      ? 'bg-rose-600 text-white shadow-2xs' 
                      : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Modal Body: Cards */}
            <div className="p-5 md:p-6 overflow-y-auto space-y-4 text-xs md:text-sm">
              {/* Part 1 Tricks */}
              {(activeTrickPart === 'all' || activeTrickPart === 'p1') && (
                <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-blue-950 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
                      <span>Part 1: The Life and Work of Marie Curie (ข้อ 1–10)</span>
                    </h3>
                    <span className="text-[11px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">10 ข้อ</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2.5 pt-1 text-slate-700 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                      <strong className="text-blue-900 block font-bold">🎯 ปีที่ได้รางวัลโนเบล (ห้ามจำสลับ!):</strong>
                      <ul className="space-y-0.5 pl-3 list-disc">
                        <li><strong>1903:</strong> ฟิสิกส์ (ได้ร่วมกับสามี Pierre และ Becquerel)</li>
                        <li><strong>1911:</strong> เคมี (ได้คนเดียว เดี่ยวๆ on her own)</li>
                        <li>ได้รับรางวัลโนเบลรวม <strong>2 ครั้ง (Two)</strong></li>
                      </ul>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                      <strong className="text-blue-900 block font-bold">🎯 คำศัพท์ & บุคลิกนิสัยที่ออกสอบ:</strong>
                      <ul className="space-y-0.5 pl-3 list-disc">
                        <li><strong>remarkable</strong> = <em>impressive</em> (ยอดเยี่ยม/น่าทึ่ง)</li>
                        <li><strong>devoted herself to studies</strong> = <em>dedicated to studies</em></li>
                        <li>นิสัย: <strong>determined and hardworking</strong> (มุ่งมั่นและขยัน)</li>
                        <li>ยอมเสียสละเพื่อการศึกษา (<em>valued education & made sacrifices</em>)</li>
                      </ul>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1 md:col-span-2">
                      <strong className="text-blue-900 block font-bold">🎯 ข้อเท็จจริงสำคัญ:</strong>
                      <span>
                        • โด่งดังจากงานวิจัย <strong>radioactivity</strong> (กัมมันตภาพรังสี)<br />
                        • เหตุผลที่ต้องทำงานเป็นครู: <strong>พ่อเสียเงินเก็บจากการลงทุน</strong> (<em>father lost his savings</em>) เพื่อส่งพี่สาว Bronia เรียนแพทย์<br />
                        • ย้ายไปเรียนที่ปารีสในปี 1891 ที่ <strong>The Sorbonne</strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Part 2 Tricks */}
              {(activeTrickPart === 'all' || activeTrickPart === 'p2') && (
                <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-indigo-950 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs">2</span>
                      <span>Part 2: Situation with Mr. Dan — Work-Study (ข้อ 11–20)</span>
                    </h3>
                    <span className="text-[11px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">10 ข้อ T/F</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2.5 pt-1 text-slate-700 text-xs">
                    <div className="bg-red-50 p-3 rounded-xl border border-red-200 space-y-1">
                      <strong className="text-red-900 block font-bold">⚠️ กับดักข้อที่ตอบ FALSE (จำ 3 ข้อนี้ให้แม่น!):</strong>
                      <ul className="space-y-1 pl-3 list-disc text-red-800">
                        <li><strong>ข้อ 12:</strong> บอกว่าอนุมัติ 20 ชม. ทันที 👉 <strong>FALSE</strong> (นาย Dan อนุมัติแค่ 10 ชม.)</li>
                        <li><strong>ข้อ 15:</strong> บอกให้นำแบบฟอร์มไปยื่นที่ห้องสมุด (library) 👉 <strong>FALSE</strong> (ต้องไปยื่นที่ job center)</li>
                        <li><strong>ข้อ 17:</strong> บอกว่านาย Dan คิดว่านักศึกษาไม่ขยัน 👉 <strong>FALSE</strong> (นาย Dan ชมว่าฉลาด)</li>
                      </ul>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 space-y-1">
                      <strong className="text-emerald-900 block font-bold">✅ ข้อที่เหลือตอบ TRUE ทั้งหมด (7 ข้อ):</strong>
                      <ul className="space-y-0.5 pl-3 list-disc text-emerald-800">
                        <li>ข้อ 11: กังวลเรื่องหนี้กู้ยืมเรียน (student loans) 👉 <strong>TRUE</strong></li>
                        <li>ข้อ 13: นักศึกษาเป็น Freshman ตารางเรียนเต็ม 👉 <strong>TRUE</strong></li>
                        <li>ข้อ 14: ทำงานมากไปกระทบทุน (scholarship) 👉 <strong>TRUE</strong></li>
                        <li>ข้อ 16: โครงการมีทั้งแบบ 10 และ 20 ชม. 👉 <strong>TRUE</strong></li>
                        <li>ข้อ 18: หลุดทุนจะยิ่งเพิ่มหนี้ 👉 <strong>TRUE</strong></li>
                        <li>ข้อ 19: เป็นโครงการของมหาวิทยาลัย 👉 <strong>TRUE</strong></li>
                        <li>ข้อ 20: จะกลับมาทบทวนเพิ่มชม. ให้ภายหลัง 👉 <strong>TRUE</strong></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Part 3 Tricks */}
              {(activeTrickPart === 'all' || activeTrickPart === 'p3') && (
                <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-teal-950 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs">3</span>
                      <span>Part 3: Street Scene & Cyclists Picture Description (ข้อ 21–26)</span>
                    </h3>
                    <span className="text-[11px] font-bold text-teal-700 bg-white px-2 py-0.5 rounded border border-teal-200">6 ข้อเติมคำ</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-teal-100 text-xs text-slate-700 space-y-1.5">
                    <strong className="text-teal-900 font-bold block">⚡ จำคำคู่ Collocation & ตัวพิมพ์ใหญ่เรียงตามข้อ:</strong>
                    <div className="grid sm:grid-cols-2 gap-2">
                      <div className="p-2 bg-slate-50 rounded-lg border">
                        <strong>ข้อ 21: numerous</strong> (adj + bicycles = จักรยานจำนวนมาก)
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border">
                        <strong>ข้อ 22: Some</strong> (ตัวพิมพ์ใหญ่ขึ้นต้นประโยค = นักปั่นบางคนมีตะกร้า)
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border">
                        <strong>ข้อ 23: transportation</strong> (means of transportation = การเดินทาง)
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border">
                        <strong>ข้อ 24: Cyclists</strong> (ตัวพิมพ์ใหญ่ขึ้นต้นประโยค เป็นประธานของ are riding)
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border">
                        <strong>ข้อ 25: destination</strong> (tourist destination = จุดหมายท่องเที่ยวยอดนิยม)
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border">
                        <strong>ข้อ 26: can be seen</strong> (Passive: can be + V.3 = สามารถมองเห็นตึกได้แต่ไกล)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Part 4 Tricks */}
              {(activeTrickPart === 'all' || activeTrickPart === 'p4') && (
                <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-amber-950 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs">4</span>
                      <span>Part 4: Greenfield Chocolate Factory Email (ข้อ 27–32)</span>
                    </h3>
                    <span className="text-[11px] font-bold text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-200">6 ข้อ</span>
                  </div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                      <strong className="text-amber-900 block font-bold">1. จัดงานเพื่ออะไร:</strong>
                      <span>ฉลองครบรอบ 50 ปี (<strong>50th anniversary</strong>)</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                      <strong className="text-amber-900 block font-bold">2. ลดราคากี่ %:</strong>
                      <span>ลดราคาสินค้า <strong>40%</strong></span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                      <strong className="text-amber-900 block font-bold">3. จัดงานช่วงไหน:</strong>
                      <span><strong>15–31 ต.ค. 2026</strong> (วันที่ 10 ต.ค. คือวันเขียนจดหมาย)</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                      <strong className="text-amber-900 block font-bold">4. รางวัลใหญ่:</strong>
                      <span>พัก 3 คืนบน <strong>เกาะภูเก็ต (Phuket Island)</strong></span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                      <strong className="text-amber-900 block font-bold">5. เงินค่าตั๋ว $15 นำไป:</strong>
                      <span>บริจาคการกุศลเพื่อเด็ก (<strong>children's charities</strong>)</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                      <strong className="text-amber-900 block font-bold">6. ซื้อตั๋วได้ที่ไหน:</strong>
                      <span>หน้า <strong>Facebook และ Website</strong></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Part 5 Tricks */}
              {(activeTrickPart === 'all' || activeTrickPart === 'p5') && (
                <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-purple-950 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs">5</span>
                      <span>Part 5: Academic Dialogue & Grammar in Context (ข้อ 33–40)</span>
                    </h3>
                    <span className="text-[11px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">8 ข้อ</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-purple-100 space-y-1">
                      <strong className="text-purple-900 font-bold block">⚡ บทสนทนา TA John (Activity 31):</strong>
                      <span>
                        • นศ. มาปรึกษาเรื่อง <strong>workload</strong> วิชา Shakespeare<br />
                        • TA John คิดว่าเป็นเด็กปี 1 เพราะมาลงเรียนวิชาพื้นฐาน Literature<br />
                        • ความจริง นศ. เป็นเด็กปี 2 (<strong>Sophomore</strong>) ที่ย้ายสาขา<br />
                        • คำแนะนำของ John: ลงเรียนดู <strong>2 สัปดาห์แรก</strong> ถ้าหนักไปค่อยดรอป (<em>drop the class</em>)
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-purple-100 space-y-1">
                      <strong className="text-purple-900 font-bold block">⚡ สูตรไวยากรณ์ & ศัพท์ออกสอบ:</strong>
                      <span>
                        • <strong>Inversion:</strong> <em>Rarely has she finished...</em> (กริยาช่วยมาก่อนประธาน)<br />
                        • <strong>บอกจุดประสงค์:</strong> <em>in order to + V.inf</em> (เพื่อที่จะ)<br />
                        • <strong>บอกความขัดแย้ง:</strong> <em>; nevertheless,</em> (อย่างไรก็ตาม)<br />
                        • <strong>Perseverance:</strong> ความเพียรพยายาม = <em>determination & persistence</em><br />
                        • <strong>Sophomore:</strong> นักศึกษาชั้นปีที่ 2 (Freshman = ปี 1)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">จำเทคนิคเหล่านี้ให้แม่นก่อนเข้าสอบบ่ายนี้!</span>
              <button
                onClick={() => setShowTricksModal(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2 rounded-xl transition"
              >
                เข้าใจแล้ว พร้อมทำข้อสอบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
