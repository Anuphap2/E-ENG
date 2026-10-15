import React, { useState, useEffect, useRef } from 'react';
import { questionsData } from '../data/questionsData';
import ScoreReportModal from './ScoreReportModal';
import HighlightedTranscript from './HighlightedTranscript';
import ExamBlueprintModal from './ExamBlueprintModal';
import ExamBriefingModal from './ExamBriefingModal';
import ClickableWordText from './ClickableWordText';
import { soundEffects } from '../utils/soundEffects';
import { 
  Award, 
  Clock, 
  RotateCcw, 
  Send, 
  Flag, 
  Volume2, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Sparkles,
  BookOpen,
  Filter,
  ChevronLeft,
  ChevronRight,
  LayoutList,
  Target,
  Grid,
  Lightbulb,
  Check,
  AlertTriangle,
  Play,
  Square,
  Flame,
  Zap,
  Scissors,
  Layers,
  FileText,
  Sliders,
  Type,
  ShieldCheck,
  CheckSquare
} from 'lucide-react';

export default function QuizTab({ 
  speech, 
  userAnswers = {}, 
  setUserAnswers, 
  flaggedQuestions = new Set(), 
  setFlaggedQuestions, 
  externalFilter = null, 
  onClearExternalFilter,
  initialQuestionId = null,
  soundEnabled = true,
  onAddXp,
  streak = 0,
  onRecordStreak
}) {
  // View mode: 'focus' (1 question at a time) or 'list' (all questions in scroll)
  const [viewMode, setViewMode] = useState('focus');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Exam vs Practice mode
  const [isExamMode, setIsExamMode] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(externalFilter || 'all');
  const [filterMistakesOnly, setFilterMistakesOnly] = useState(false);
  const [showResultCard, setShowResultCard] = useState(false);
  const [showPaletteDrawer, setShowPaletteDrawer] = useState(false);
  const [showTranscripts, setShowTranscripts] = useState({});

  // Professional CBT & Exam Prep Platform Features
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [targetGrade, setTargetGrade] = useState('A'); // 'A', 'B+', 'B', 'C+'
  const [fontSize, setFontSize] = useState('normal'); // 'normal', 'large', 'xl'
  const [audioSpeed, setAudioSpeed] = useState(1.0); // 0.8, 1.0, 1.2
  const [eliminatedOptions, setEliminatedOptions] = useState({}); // { [qId]: Set([0, 2]) }
  const [paletteFilter, setPaletteFilter] = useState('all'); // 'all', 'unanswered', 'flagged', 'mistakes'

  // 90 minutes exam timer
  const [examTime, setExamTime] = useState(90 * 60);
  const timerRef = useRef(null);

  // Sync external filter if passed from parent
  useEffect(() => {
    if (externalFilter) {
      setCurrentFilter(externalFilter);
      setCurrentIndex(0);
      if (onClearExternalFilter) onClearExternalFilter();
    }
  }, [externalFilter]);

  // Jump to initial question if passed
  useEffect(() => {
    if (initialQuestionId) {
      const targetIdx = displayedQuestions.findIndex(q => q.id === initialQuestionId);
      if (targetIdx !== -1) {
        setCurrentIndex(targetIdx);
      }
    }
  }, [initialQuestionId]);

  // Exam timer interval
  useEffect(() => {
    if (isExamMode) {
      timerRef.current = setInterval(() => {
        setExamTime(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitExam();
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

  // Keyboard navigation for Focus Mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (viewMode === 'focus') {
        if (e.key === 'ArrowLeft') {
          handlePrevQuestion();
        } else if (e.key === 'ArrowRight') {
          handleNextQuestion();
        } else if (['1', '2', '3', '4'].includes(e.key)) {
          const optIdx = parseInt(e.key, 10) - 1;
          const currentQ = displayedQuestions[safeCurrentIndex];
          if (currentQ) handleSelectOption(currentQ.id, optIdx);
        } else if (['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(e.key)) {
          const keyMap = { a: 0, b: 1, c: 2, d: 3, A: 0, B: 1, C: 2, D: 3 };
          const optIdx = keyMap[e.key];
          const currentQ = displayedQuestions[safeCurrentIndex];
          if (currentQ) handleSelectOption(currentQ.id, optIdx);
        } else if (e.key === 'f' || e.key === 'F') {
          const currentQ = displayedQuestions[safeCurrentIndex];
          if (currentQ) toggleFlag(currentQ.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentIndex, userAnswers, currentFilter, filterMistakesOnly]);

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

    const question = questionsData.find(q => q.id === qId);
    if (!question) return;

    if (!isExamMode) {
      const isCorrect = optionIdx === question.answer;
      if (isCorrect) {
        soundEffects.playCorrect(soundEnabled);
        if (onRecordStreak) onRecordStreak(true);
        if (onAddXp) onAddXp(15, 'ตอบข้อสอบถูกต้อง');
      } else {
        soundEffects.playWrong(soundEnabled);
        if (onRecordStreak) onRecordStreak(false);
      }
    } else {
      soundEffects.playClick(soundEnabled);
    }
  };

  // Option Elimination Toggle
  const toggleEliminateOption = (qId, optIdx, e) => {
    if (e) e.stopPropagation();
    setEliminatedOptions(prev => {
      const currentSet = new Set(prev[qId] || []);
      if (currentSet.has(optIdx)) {
        currentSet.delete(optIdx);
      } else {
        currentSet.add(optIdx);
      }
      return {
        ...prev,
        [qId]: currentSet
      };
    });
  };

  const handleJumpNextUnanswered = () => {
    const nextUnanswered = questionsData.find(q => userAnswers[q.id] === undefined);
    if (nextUnanswered) {
      jumpToQuestion(nextUnanswered.id);
    } else {
      alert('🎉 ยอดเยี่ยมมาก! คุณทำข้อสอบครบทั้ง 80 ข้อแล้ว');
    }
  };

  const toggleFlag = (qId) => {
    setFlaggedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const toggleTranscript = (qId) => {
    setShowTranscripts(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  // Filter questions
  let displayedQuestions = questionsData;
  if (filterMistakesOnly) {
    displayedQuestions = questionsData.filter(q => userAnswers[q.id] !== undefined && userAnswers[q.id] !== q.answer);
    if (displayedQuestions.length === 0) {
      displayedQuestions = questionsData;
    }
  } else if (currentFilter !== 'all') {
    displayedQuestions = questionsData.filter(q => q.unit === currentFilter);
  }

  // Safe Index bounds
  const safeCurrentIndex = Math.min(Math.max(currentIndex, 0), Math.max(displayedQuestions.length - 1, 0));
  const activeQuestion = displayedQuestions[safeCurrentIndex] || questionsData[0];

  const handlePrevQuestion = () => {
    if (safeCurrentIndex > 0) {
      setCurrentIndex(safeCurrentIndex - 1);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handleNextQuestion = () => {
    if (safeCurrentIndex < displayedQuestions.length - 1) {
      setCurrentIndex(safeCurrentIndex + 1);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const jumpToQuestion = (qId) => {
    const targetIdx = displayedQuestions.findIndex(q => q.id === qId);
    if (targetIdx !== -1) {
      setCurrentIndex(targetIdx);
      setShowPaletteDrawer(false);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    } else {
      // Question belongs to another filter
      setCurrentFilter('all');
      setFilterMistakesOnly(false);
      setTimeout(() => {
        const fullIdx = questionsData.findIndex(q => q.id === qId);
        if (fullIdx !== -1) {
          setCurrentIndex(fullIdx);
          setShowPaletteDrawer(false);
          window.scrollTo({ top: 180, behavior: 'smooth' });
        }
      }, 50);
    }
  };

  const calculateScore = () => {
    let score = 0;
    const unitScores = { 'Unit 5': 0, 'Unit 6': 0, 'Unit 7': 0, 'Unit 8': 0 };

    questionsData.forEach(q => {
      if (userAnswers[q.id] === q.answer) {
        score++;
        unitScores[q.unit] = (unitScores[q.unit] || 0) + 1;
      }
    });

    return { score, unitScores };
  };

  const handleStartExamFromBriefing = () => {
    setIsExamMode(true);
    setShowResultCard(false);
    setExamTime(90 * 60);
    setCurrentIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitExam = () => {
    setIsExamMode(false);
    setShowResultCard(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetAll = () => {
    if (confirm('คุณต้องการรีเซ็ตคำตอบทั้งหมดและเริ่มฝึกใหม่ใช่หรือไม่?')) {
      setUserAnswers({});
      setFlaggedQuestions(new Set());
      setEliminatedOptions({});
      setShowResultCard(false);
      setFilterMistakesOnly(false);
      setIsExamMode(false);
      setExamTime(90 * 60);
      setCurrentIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const { score: currentScore, unitScores } = calculateScore();
  const answeredCount = Object.keys(userAnswers).length;
  const mistakesCount = questionsData.filter(q => userAnswers[q.id] !== undefined && userAnswers[q.id] !== q.answer).length;
  const weightedScore = ((currentScore / questionsData.length) * 25).toFixed(2);

  // Target Grade Calculation
  const targetThresholds = {
    'A': { target: 64, pts: '20.00' },
    'B+': { target: 56, pts: '17.50' },
    'B': { target: 48, pts: '15.00' },
    'C+': { target: 40, pts: '12.50' }
  };
  const currentThreshold = targetThresholds[targetGrade] || targetThresholds['A'];
  const neededForTarget = Math.max(0, currentThreshold.target - currentScore);

  // Exam Readiness Index (0 - 100%)
  const accuracyRate = answeredCount > 0 ? (currentScore / answeredCount) : 0;
  const completionRate = answeredCount / questionsData.length;
  const readinessIndex = Math.min(100, Math.round((completionRate * 45) + (accuracyRate * 55)));

  // Active question state
  const currentQId = activeQuestion.id;
  const currentAnswer = userAnswers[currentQId];
  const isCurrentAnswered = currentAnswer !== undefined;
  const isCurrentCorrect = isCurrentAnswered && currentAnswer === activeQuestion.answer;
  const isCurrentFlagged = flaggedQuestions.has(currentQId);

  // Unit color themes
  const unitColors = {
    'Unit 5': { badge: 'bg-blue-100 text-blue-800 border-blue-200', text: 'text-blue-700', active: 'bg-blue-600' },
    'Unit 6': { badge: 'bg-indigo-100 text-indigo-800 border-indigo-200', text: 'text-indigo-700', active: 'bg-indigo-600' },
    'Unit 7': { badge: 'bg-purple-100 text-purple-800 border-purple-200', text: 'text-purple-700', active: 'bg-purple-600' },
    'Unit 8': { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', text: 'text-emerald-700', active: 'bg-emerald-600' },
  };

  // Font size classes
  const fontSizes = {
    normal: { q: 'text-base md:text-lg', opt: 'text-xs md:text-sm', pass: 'text-xs md:text-sm' },
    large: { q: 'text-lg md:text-xl', opt: 'text-sm md:text-base', pass: 'text-sm md:text-base' },
    xl: { q: 'text-xl md:text-2xl', opt: 'text-base md:text-lg', pass: 'text-base md:text-lg' }
  };
  const curFont = fontSizes[fontSize] || fontSizes.normal;

  return (
    <div className="space-y-5">
      {/* ========================================================
          EXAM COMMAND CENTER & READINESS DASHBOARD
         ======================================================== */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-5 md:p-6 shadow-md border border-slate-700/60 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                10700320 CBT Final Exam Simulator
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                isExamMode ? 'bg-amber-400 text-slate-950 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
              }`}>
                {isExamMode ? '⏱️ ห้องสอบจริง (จับเวลา 90 นาที)' : '💡 ศูนย์ฝึกซ้อมข้อสอบ (เฉลย & วิเคราะห์ทันที)'}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              <span>คลังข้อสอบปลายภาค 80 ข้อ (Comprehensive 80 Questions)</span>
            </h1>
            <p className="text-xs text-slate-300">
              สัดส่วนคะแนนจริง 25.00 คะแนน (25% ของเกรดปลายภาค) • ครอบคลุม Unit 5, 6 (IELTS), 7 (TOEFL), 8 (TOEIC)
            </p>
          </div>

          {/* Real Exam Timer / Live Score Pod */}
          <div className="flex items-center gap-3 shrink-0">
            {isExamMode ? (
              <div className="bg-slate-950/80 border border-amber-400/40 p-3 px-4 rounded-2xl flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                <div>
                  <span className="text-[10px] text-amber-300/80 block uppercase font-bold tracking-wider">เวลาสอบที่เหลือ</span>
                  <span className={`text-2xl font-black font-mono tracking-tight ${examTime < 600 ? 'text-red-400 animate-pulse' : 'text-amber-300'}`}>
                    {formatTimer(examTime)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/80 border border-slate-700/80 p-3 px-4 rounded-2xl flex items-center gap-3">
                <Award className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">คะแนนสอบสะสม (25%)</span>
                  <span className="text-xl font-black text-emerald-400 font-mono tracking-tight">
                    {weightedScore} <span className="text-xs text-slate-400 font-normal">/ 25.00</span>
                  </span>
                </div>
              </div>
            )}

            {/* Submit or Toggle Mode */}
            {isExamMode ? (
              <button
                onClick={() => {
                  const unanswered = questionsData.length - answeredCount;
                  if (unanswered > 0) {
                    if (!confirm(`คุณยังทำข้อสอบไม่ครบ (เหลืออีก ${unanswered} ข้อ)\nต้องการยืนยันส่งข้อสอบเพื่อดูผลคะแนนเลยหรือไม่?`)) return;
                  }
                  handleSubmitExam();
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-4 py-3 rounded-2xl text-xs transition shadow-md flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>ส่งข้อสอบ</span>
              </button>
            ) : (
              <button
                onClick={() => setIsBriefingOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-3 rounded-2xl text-xs transition shadow-md flex items-center gap-2 border border-blue-400/30"
              >
                <Clock className="w-4 h-4 text-amber-300" />
                <span>จำลองสอบจริง (90 นาที)</span>
              </button>
            )}
          </div>
        </div>

        {/* Readiness Index & Target Grade Bar */}
        <div className="pt-3 border-t border-slate-700/60 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Readiness Meter */}
          <div className="bg-slate-950/50 p-2.5 px-3 rounded-xl border border-slate-700/50 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span>ดัชนีความพร้อมสอบ (Readiness):</span>
              <strong className="text-white font-bold">{readinessIndex}%</strong>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 rounded-full ${
                  readinessIndex >= 80 ? 'bg-emerald-400' : readinessIndex >= 50 ? 'bg-amber-400' : 'bg-blue-400'
                }`}
                style={{ width: `${readinessIndex}%` }}
              />
            </div>
          </div>

          {/* Target Grade Selector */}
          <div className="bg-slate-950/50 p-2.5 px-3 rounded-xl border border-slate-700/50 flex items-center justify-between gap-2">
            <div className="text-[11px]">
              <span className="text-slate-400 block">เป้าหมายเกรดที่ตั้งไว้:</span>
              <span className="font-bold text-amber-300">
                เกรด {targetGrade} ({currentThreshold.pts} pts)
              </span>
            </div>
            <select
              value={targetGrade}
              onChange={(e) => setTargetGrade(e.target.value)}
              className="bg-slate-800 text-white text-xs font-bold rounded-lg px-2 py-1 border border-slate-600 focus:outline-hidden"
            >
              <option value="A">เกรด A (≥20 pts)</option>
              <option value="B+">เกรด B+ (≥17.5 pts)</option>
              <option value="B">เกรด B (≥15 pts)</option>
              <option value="C+">เกรด C+ (≥12.5 pts)</option>
            </select>
          </div>

          {/* Remaining for Target */}
          <div className="bg-slate-950/50 p-2.5 px-3 rounded-xl border border-slate-700/50 flex items-center justify-between">
            <div className="text-[11px]">
              <span className="text-slate-400 block">ระยะห่างสู่เกรด {targetGrade}:</span>
              <span className="font-bold text-white">
                {neededForTarget === 0 ? '🎉 บรรลุเป้าหมายแล้ว!' : `ต้องการอีก ${neededForTarget} ข้อ`}
              </span>
            </div>
            <Target className="w-4 h-4 text-amber-400 shrink-0" />
          </div>

          {/* Blueprint Modal Button */}
          <button
            onClick={() => setIsBlueprintOpen(true)}
            className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 text-blue-200 font-bold p-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition text-[11px]"
          >
            <FileText className="w-3.5 h-3.5 text-blue-300" />
            <span>ดูผังโครงสร้างข้อสอบ 80 ข้อ (Blueprint)</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          CBT TOOLBAR (Filters, Font Size, View Toggle, Palette)
         ======================================================== */}
      <div className="bg-white p-3.5 md:p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Unit Filters */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>ส่วนข้อสอบ:</span>
            </span>

            {[
              { id: 'all', label: 'ทั้งหมด (80 ข้อ)' },
              { id: 'Unit 5', label: 'Unit 5 (Q1–20)' },
              { id: 'Unit 6', label: 'Unit 6: IELTS (Q21–40)' },
              { id: 'Unit 7', label: 'Unit 7: TOEFL (Q41–60)' },
              { id: 'Unit 8', label: 'Unit 8: TOEIC (Q61–80)' },
            ].map(tab => {
              const isActive = currentFilter === tab.id && !filterMistakesOnly;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCurrentFilter(tab.id);
                    setFilterMistakesOnly(false);
                    setCurrentIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.label}
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

          {/* Right Toolbar Controls: Text Size, View Mode, Palette */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Font Size Adjuster */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold px-1.5">ขนาดอักษร:</span>
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition ${
                  fontSize === 'normal' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="ขนาดปกติ"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded-md text-[12px] font-bold transition ${
                  fontSize === 'large' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="ขนาดใหญ่"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xl')}
                className={`px-2 py-1 rounded-md text-[13px] font-bold transition ${
                  fontSize === 'xl' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="ขนาดใหญ่พิเศษ"
              >
                A++
              </button>
            </div>

            {/* View Mode (Focus vs List) */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
              <button
                onClick={() => setViewMode('focus')}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                  viewMode === 'focus' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>โฟกัส</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                  viewMode === 'list' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>ดูทั้งหมด</span>
              </button>
            </div>

            {/* Question Palette Drawer Trigger */}
            <button
              onClick={() => setShowPaletteDrawer(!showPaletteDrawer)}
              className="bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold px-3 py-1.5 rounded-xl border border-blue-200 flex items-center gap-1.5 transition"
            >
              <Grid className="w-3.5 h-3.5 text-blue-600" />
              <span>ผัง 80 ข้อ ({answeredCount}/80)</span>
            </button>

            {/* Reset */}
            <button
              onClick={handleResetAll}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1.5 rounded-xl border border-slate-200 transition"
              title="รีเซ็ตคำตอบทั้งหมด"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Question Grid Drawer */}
      {showPaletteDrawer && (
        <div className="bg-white p-5 rounded-3xl border-2 border-blue-500 shadow-xl space-y-3 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-blue-600" />
              <strong className="text-sm font-black text-slate-900">
                ผังกระดานเลือกข้อสอบ 1–80 (Question Palette)
              </strong>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-200 border"></span> ยังไม่ตอบ ({80 - answeredCount})</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-600"></span> ตอบแล้ว ({answeredCount})</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-400"></span> ปักหมุด ({flaggedQuestions.size})</span>
              {!isExamMode && (
                <>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-600"></span> ถูก ({currentScore})</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-500"></span> ผิด ({mistakesCount})</span>
                </>
              )}
              <button 
                onClick={() => setShowPaletteDrawer(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold px-2 py-0.5 rounded-md hover:bg-slate-100"
              >
                ✕ ปิด
              </button>
            </div>
          </div>

          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-16 lg:grid-cols-20 gap-1.5 p-3 bg-slate-50 rounded-2xl border border-slate-200 max-h-56 overflow-y-auto">
            {questionsData.map(q => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isFlagged = flaggedQuestions.has(q.id);
              const isCorrect = isAnswered && userAnswers[q.id] === q.answer;
              const isCurrent = activeQuestion && activeQuestion.id === q.id;

              let btnStyle = "bg-white text-slate-700 border-slate-200 hover:bg-slate-100";
              if (isFlagged) {
                btnStyle = "bg-amber-400 text-slate-950 font-black border-amber-500";
              } else if (isAnswered) {
                if (isExamMode) {
                  btnStyle = "bg-blue-600 text-white font-bold border-blue-700";
                } else {
                  btnStyle = isCorrect ? "bg-emerald-600 text-white font-bold" : "bg-red-500 text-white font-bold";
                }
              }

              return (
                <button
                  key={q.id}
                  onClick={() => jumpToQuestion(q.id)}
                  className={`h-8 w-full rounded-lg text-xs font-semibold transition flex items-center justify-center relative border ${btnStyle} ${
                    isCurrent ? 'ring-2 ring-blue-600 ring-offset-1 font-black scale-105 shadow-xs' : ''
                  }`}
                  title={`ข้อที่ ${q.id} (${q.unit}: ${q.topic})`}
                >
                  {q.id}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      <ExamBlueprintModal
        isOpen={isBlueprintOpen}
        onClose={() => setIsBlueprintOpen(false)}
        onJumpToUnit={(unit) => {
          setCurrentFilter(unit);
          setFilterMistakesOnly(false);
          setCurrentIndex(0);
        }}
      />

      <ExamBriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
        onConfirmStart={handleStartExamFromBriefing}
      />

      {/* Score Report Modal (if submitted) */}
      {showResultCard && (
        <ScoreReportModal
          totalScore={currentScore}
          totalQuestions={questionsData.length}
          unitScores={unitScores}
          onClose={() => setShowResultCard(false)}
          onViewMistakes={() => {
            setFilterMistakesOnly(true);
            setShowResultCard(false);
          }}
          onReset={handleResetAll}
        />
      )}

      {/* ========================================================
          FOCUS MODE (1 Question at a Time - Primary Learning UX)
         ======================================================== */}
      {viewMode === 'focus' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Question Card (8 Cols on PC Desktop) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6 animate-fadeIn">
            {/* Combo Streak Alert */}
            {!isExamMode && streak > 1 && (
              <div className="flex items-center gap-2 p-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-900 font-bold text-xs animate-pulse">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>🔥 COMBO x{streak}! ตอบถูกต่อเนื่อง (+15 XP ต่อข้อ)</span>
              </div>
            )}

            {/* Question Header & Meta */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-600 text-white shadow-xs">
                    ข้อที่ {activeQuestion.id} / 80
                  </span>

                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${
                    unitColors[activeQuestion.unit]?.badge || 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}>
                    {activeQuestion.unit}
                  </span>

                  <span className="text-xs text-slate-500 hidden sm:inline font-medium">
                    • {activeQuestion.topic}
                  </span>
                </div>

                {/* Action Buttons: Flag, Elimination Tool */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFlag(currentQId)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 border ${
                      isCurrentFlagged
                        ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                    }`}
                    title="ปักหมุดข้อที่ต้องการกลับมาทบทวน (คีย์ลัด: F)"
                  >
                    <Flag className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'fill-current text-amber-600' : ''}`} />
                    <span>{isCurrentFlagged ? 'ปักหมุดแล้ว' : 'ปักหมุด'}</span>
                  </button>
                </div>
              </div>

              {/* Question Progress Bar within current filter */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>ลำดับข้อ: {safeCurrentIndex + 1} จาก {displayedQuestions.length} ในส่วนนี้</span>
                  <span>ตอบแล้ว: {isCurrentAnswered ? '✅ ตอบแล้ว' : '⚪ ยังไม่ตอบ'}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${((safeCurrentIndex + 1) / displayedQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Context / Reading Passage (if present) */}
            {activeQuestion.passage && (
              <div className={`p-5 bg-slate-50/90 rounded-2xl border border-slate-200 text-slate-800 leading-relaxed space-y-2 font-inter ${curFont.pass}`}>
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                  <div className="flex items-center gap-2 font-sarabun font-bold text-slate-900 text-xs uppercase tracking-wide">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>บทความ / บริบทประกอบข้อสอบ (แตะคำศัพท์เพื่อดูคำแปล):</span>
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

            {/* Audio Player Bar (if question has audio) */}
            {activeQuestion.hasAudio && (
              <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-2xs">
                      <Volume2 className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="text-xs md:text-sm font-bold text-indigo-950">
                        {activeQuestion.audioTitle || 'คลิปเสียงข้อสอบข้อนี้ (Audio Prompt)'}
                      </h4>
                      <p className="text-[11px] text-indigo-700">
                        ฟังเสียงจำลองข้อสอบจริง • ปรับความเร็วเสียงตามต้องการ
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {/* Speed Selector */}
                    <div className="bg-white/90 p-0.5 rounded-lg border border-indigo-200 flex items-center text-[10px] font-bold text-indigo-900">
                      {[0.8, 1.0, 1.2].map(speed => (
                        <button
                          key={speed}
                          onClick={() => setAudioSpeed(speed)}
                          className={`px-1.5 py-0.5 rounded ${audioSpeed === speed ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-50'}`}
                          title={`ความเร็ว ${speed}x`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        if (speech.isSpeaking && speech.currentText === activeQuestion.audioText) {
                          speech.stop();
                        } else {
                          speech.speak(activeQuestion.audioText, speech.accent, audioSpeed);
                          setShowTranscripts(prev => ({ ...prev, [currentQId]: true }));
                        }
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-2xs"
                    >
                      {speech.isSpeaking && speech.currentText === activeQuestion.audioText ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>หยุดเสียง</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>กดฟังเสียง</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => toggleTranscript(currentQId)}
                      className="bg-white hover:bg-slate-100 text-indigo-800 border border-indigo-300 px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      {showTranscripts[currentQId] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showTranscripts[currentQId] ? 'ซ่อนสคริปต์' : 'ดูสคริปต์'}</span>
                    </button>
                  </div>
                </div>

                {/* Collapsible Highlighted Transcript */}
                {showTranscripts[currentQId] && (
                  <div className="p-3.5 bg-slate-900 text-slate-100 rounded-xl text-xs font-inter leading-relaxed mt-2 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-amber-400 font-bold font-sarabun text-xs">
                      <span>สคริปต์คำพูด (ไฮไลต์คำที่กำลังพูดแบบ Real-Time):</span>
                      {speech.isSpeaking && speech.currentText === activeQuestion.audioText && (
                        <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-mono animate-pulse">
                          ● Real-Time
                        </span>
                      )}
                    </div>
                    <HighlightedTranscript
                      text={activeQuestion.audioText}
                      charIndex={speech.charIndex}
                      charLength={speech.charLength}
                      isSpeaking={speech.isSpeaking}
                      currentSpeakingText={speech.currentText}
                      className="block leading-relaxed"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Question Text */}
            <div className={`font-bold text-slate-900 leading-snug ${curFont.q}`}>
              <ClickableWordText text={activeQuestion.q} />
            </div>

            {/* Elimination Tip Banner */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>เลือกคำตอบที่ถูกต้องที่สุด (แตะคำศัพท์เพื่อดูความหมาย หรือกด <Scissors className="w-3 h-3 inline text-slate-500" /> เพื่อขีดฆ่าตัดช้อยส์)</span>
              <span className="hidden sm:inline">กด A-D หรือ 1-4 บนคีย์บอร์ดเพื่อเลือก</span>
            </div>

            {/* Options Grid (A, B, C, D) with Strikethrough Tool */}
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
                    btnStyle = "bg-blue-50 border-blue-600 font-bold text-blue-900 shadow-2xs ring-2 ring-blue-500";
                    badgeStyle = "bg-blue-600 text-white border-blue-600";
                  }
                } else {
                  if (isCurrentAnswered) {
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
                const optClean = opt.substring(3);

                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQId, optIdx)}
                    className={`p-4 rounded-2xl border-2 transition flex items-start gap-3 relative cursor-pointer group ${btnStyle} ${curFont.opt}`}
                  >
                    <span className={`w-7 h-7 rounded-lg border text-xs font-black flex items-center justify-center shrink-0 mt-0.5 ${badgeStyle}`}>
                      {choiceLetter}
                    </span>
                    <span className="leading-relaxed flex-grow pt-0.5">
                      <ClickableWordText
                        text={optClean}
                        choiceLetter={choiceLetter}
                        onSelectChoice={() => handleSelectOption(currentQId, optIdx)}
                        className="leading-relaxed block"
                      />
                    </span>

                    {/* Right action indicators */}
                    <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                      {/* Elimination button */}
                      <button
                        type="button"
                        onClick={(e) => toggleEliminateOption(currentQId, optIdx, e)}
                        className={`p-1 rounded-md transition ${
                          isEliminated 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'opacity-0 group-hover:opacity-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700'
                        }`}
                        title={isEliminated ? "ยกเลิกการตัดช้อยส์นี้" : "ตัดช้อยส์นี้ (ขีดฆ่า)"}
                      >
                        <Scissors className="w-3.5 h-3.5" />
                      </button>

                      {/* Correct / Incorrect indicator */}
                      {(!isExamMode && isCurrentAnswered) && (
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

            {/* Explanation Box (Visible in Practice Mode immediately once answered) */}
            {(!isExamMode && isCurrentAnswered) && (
              <div className={`p-5 rounded-2xl text-xs md:text-sm space-y-3 border-2 animate-fadeIn ${
                isCurrentCorrect 
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' 
                  : 'bg-red-50/80 border-red-300 text-red-950'
              }`}>
                <div className="flex items-center gap-2 font-black text-sm md:text-base">
                  {isCurrentCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>ถูกต้องยอดเยี่ยม! (เฉลยข้อ {String.fromCharCode(65 + activeQuestion.answer)})</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      <span>ยังไม่ถูกต้อง (คุณตอบข้อ {String.fromCharCode(65 + currentAnswer)} • คำตอบที่ถูกต้องคือข้อ {String.fromCharCode(65 + activeQuestion.answer)})</span>
                    </>
                  )}
                </div>

                <p className="leading-relaxed text-slate-800">
                  <strong className="text-slate-900 block mb-0.5">คำอธิบายเฉลยอย่างละเอียด:</strong> 
                  {activeQuestion.explanation}
                </p>

                {activeQuestion.tip && (
                  <div className="p-3 bg-white rounded-xl border border-amber-300/80 text-amber-950 text-xs leading-relaxed flex items-start gap-2 shadow-2xs">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-900 font-bold">💡 จุดสังเกต & เทคนิคการจำ (Exam Tip):</strong> {activeQuestion.tip}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Focus Mode Navigation Footer */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Prev button */}
              <button
                onClick={handlePrevQuestion}
                disabled={safeCurrentIndex === 0}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 border transition ${
                  safeCurrentIndex === 0
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-2xs'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>ข้อก่อนหน้า (Previous)</span>
              </button>

              {/* Keyboard shortcut tip */}
              <span className="text-[11px] text-slate-400 hidden md:inline">
                คีย์ลัด: [←] ก่อนหน้า | [→] ถัดไป | [1-4 / A-D] เลือกข้อ | [F] ปักหมุด
              </span>

              {/* Next or Finish button */}
              {safeCurrentIndex < displayedQuestions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs md:text-sm flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <span>ข้อถัดไป (Next)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitExam}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs md:text-sm flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <Award className="w-4 h-4" />
                  <span>เสร็จสิ้นข้อสอบ & ดูผลคะแนน</span>
                </button>
              )}
            </div>
          </div>

          {/* Sticky Question Palette & Control Sidebar (4 Cols on PC Desktop) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-20 space-y-3.5">
            {/* Live Score / Exam Timer Capsule */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-sm space-y-2.5 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {isExamMode ? '⏱️ เวลาที่เหลือ' : '📊 คะแนนสะสม (25%)'}
                </span>
                {isExamMode ? (
                  <span className={`text-base font-mono font-black ${examTime < 600 ? 'text-red-400 animate-pulse' : 'text-amber-300'}`}>
                    {formatTimer(examTime)}
                  </span>
                ) : (
                  <span className="text-sm font-bold text-emerald-400">
                    {currentScore} / 80 ({weightedScore} pts)
                  </span>
                )}
              </div>

              {/* Quick Jump to Unanswered Button */}
              <button
                onClick={handleJumpNextUnanswered}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-2xs"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>ข้ามไปข้อถัดไปที่ยังไม่ตอบ</span>
              </button>
            </div>

            {/* Desktop Question Grid 1-80 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <Grid className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">ผังข้อสอบ (1–80):</span>
                </div>
                <span className="text-[11px] text-slate-500 font-semibold">
                  ตอบแล้ว {answeredCount}/80
                </span>
              </div>

              {/* Palette filter pills */}
              <div className="flex items-center gap-1 text-[10px] pb-1">
                {[
                  { id: 'all', label: 'ทั้งหมด' },
                  { id: 'unanswered', label: `ยังไม่ทำ (${80 - answeredCount})` },
                  { id: 'flagged', label: `ปักหมุด (${flaggedQuestions.size})` },
                ].map(pf => (
                  <button
                    key={pf.id}
                    onClick={() => setPaletteFilter(pf.id)}
                    className={`px-2 py-0.5 rounded font-medium transition ${
                      paletteFilter === pf.id ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {pf.label}
                  </button>
                ))}
              </div>

              {/* Compact 8x10 Grid */}
              <div className="grid grid-cols-8 gap-1.5 p-1.5 bg-slate-50/70 rounded-xl border border-slate-200/80 max-h-[340px] overflow-y-auto">
                {questionsData.map(q => {
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isFlagged = flaggedQuestions.has(q.id);
                  const isCorrect = isAnswered && userAnswers[q.id] === q.answer;
                  const isCurrent = activeQuestion && activeQuestion.id === q.id;

                  // Filter check
                  let matchesFilter = true;
                  if (paletteFilter === 'unanswered') matchesFilter = !isAnswered;
                  if (paletteFilter === 'flagged') matchesFilter = isFlagged;

                  let btnStyle = "bg-white text-slate-700 border-slate-200 hover:bg-slate-100";
                  if (isFlagged) {
                    btnStyle = "bg-amber-400 text-slate-950 font-black border-amber-500";
                  } else if (isAnswered) {
                    if (isExamMode) {
                      btnStyle = "bg-blue-600 text-white font-bold border-blue-700";
                    } else {
                      btnStyle = isCorrect ? "bg-emerald-600 text-white font-bold border-emerald-700" : "bg-red-500 text-white font-bold border-red-600";
                    }
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => jumpToQuestion(q.id)}
                      className={`h-7 rounded-lg text-[10px] font-bold transition flex items-center justify-center border ${btnStyle} ${
                        isCurrent ? 'ring-2 ring-blue-600 ring-offset-1 font-black scale-105 shadow-xs' : ''
                      } ${!matchesFilter ? 'opacity-20 hover:opacity-100' : ''}`}
                      title={`ข้อ ${q.id} (${q.unit}: ${q.topic})`}
                    >
                      {q.id}
                    </button>
                  );
                })}
              </div>

              {/* Status Legend */}
              <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-600 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-slate-200 border"></span> ยังไม่ตอบ
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-amber-400"></span> ปักหมุด
                </span>
                {!isExamMode && (
                  <>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-600"></span> ตอบถูก
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-red-500"></span> ตอบผิด
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Desktop Keyboard Helper Card */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-600">
              <span className="font-bold text-slate-800 text-[11px] block">⌨️ แป้นพิมพ์ลัดบนคอมพิวเตอร์ (PC):</span>
              <ul className="space-y-1 text-[11px] text-slate-500">
                <li><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono text-slate-800">1</kbd>–<kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono text-slate-800">4</kbd> หรือ <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono text-slate-800">A</kbd>–<kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono text-slate-800">D</kbd>: เลือกคำตอบ</li>
                <li><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono text-slate-800">←</kbd> / <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono text-slate-800">→</kbd>: ข้อก่อนหน้า / ถัดไป</li>
                <li><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono text-slate-800">F</kbd>: ปักหมุดทบทวน</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================
            LIST VIEW (All Questions in Scroll - For Skimming)
           ======================================================== */
        <div className="space-y-4">
          {displayedQuestions.map((q, idx) => {
            const qId = q.id;
            const userAnswer = userAnswers[qId];
            const isAnswered = userAnswer !== undefined;
            const isFlagged = flaggedQuestions.has(qId);
            const isCorrect = isAnswered && userAnswer === q.answer;

            return (
              <div
                key={qId}
                id={`qcard-${qId}`}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4 transition"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-1 rounded-md bg-blue-600 text-white">
                      ข้อที่ {qId}
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      [{q.unit}] {q.topic}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFlag(qId)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition flex items-center gap-1 ${
                        isFlagged 
                          ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' 
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current text-amber-600' : ''}`} />
                      <span>{isFlagged ? 'ปักหมุดแล้ว' : 'ปักหมุด'}</span>
                    </button>
                  </div>
                </div>

                {/* Passage (if present) */}
                {q.passage && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-inter">
                    <strong className="block text-slate-900 font-bold mb-1 font-sarabun">บทความประกอบ (แตะคำศัพท์เพื่อแปล):</strong>
                    <p className="whitespace-pre-line leading-relaxed">
                      <ClickableWordText text={q.passage} />
                    </p>
                  </div>
                )}

                {/* Question */}
                <div className={`font-bold text-slate-900 leading-snug ${curFont.q}`}>
                  <ClickableWordText text={q.q} />
                </div>

                {/* Options */}
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    let btnStyle = "bg-white border-slate-300 hover:bg-blue-50/60 text-slate-800";

                    if (isExamMode) {
                      if (userAnswer === optIdx) {
                        btnStyle = "bg-blue-100 border-blue-500 font-bold text-blue-900 shadow-2xs";
                      }
                    } else {
                      if (isAnswered) {
                        if (optIdx === q.answer) {
                          btnStyle = "bg-emerald-100 border-emerald-500 font-bold text-emerald-950";
                        } else if (userAnswer === optIdx) {
                          btnStyle = "bg-red-100 border-red-500 font-bold text-red-950";
                        } else {
                          btnStyle = "bg-white border-slate-200 text-slate-400 opacity-60";
                        }
                      }
                    }

                    const choiceLetter = String.fromCharCode(65 + optIdx);
                    const optClean = opt.substring(3);

                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(qId, optIdx)}
                        className={`text-left p-3.5 rounded-xl border text-xs md:text-sm transition flex items-start gap-2.5 cursor-pointer ${btnStyle}`}
                      >
                        <span className="w-6 h-6 rounded-full bg-slate-100 border text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {choiceLetter}
                        </span>
                        <span className="leading-relaxed flex-grow">
                          <ClickableWordText
                            text={optClean}
                            choiceLetter={choiceLetter}
                            onSelectChoice={() => handleSelectOption(qId, optIdx)}
                            className="leading-relaxed block"
                          />
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {(!isExamMode && isAnswered) && (
                  <div className={`p-4 rounded-xl text-xs space-y-2 border ${
                    isCorrect 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                      : 'bg-red-50 border-red-200 text-red-950'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold text-sm">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>ถูกต้องยอดเยี่ยม! (เฉลยข้อ {String.fromCharCode(65 + q.answer)})</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span>ยังไม่ถูกต้อง (คุณตอบ {String.fromCharCode(65 + userAnswer)} | เฉลยข้อ {String.fromCharCode(65 + q.answer)})</span>
                        </>
                      )}
                    </div>

                    <p className="leading-relaxed">
                      <strong>คำอธิบายเฉลย:</strong> {q.explanation}
                    </p>

                    {q.tip && (
                      <div className="p-2.5 bg-white/70 rounded-lg border border-current text-[11px] leading-relaxed">
                        💡 <strong>เทคนิคจำ & จุดสังเกต:</strong> {q.tip}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
