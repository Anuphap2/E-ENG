import React, { useState, useEffect, useRef } from 'react';
import { questionsData } from '../data/questionsData';
import ScoreReportModal from './ScoreReportModal';
import HighlightedTranscript from './HighlightedTranscript';
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
  Square
} from 'lucide-react';

export default function QuizTab({ 
  speech, 
  userAnswers = {}, 
  setUserAnswers, 
  flaggedQuestions = new Set(), 
  setFlaggedQuestions, 
  externalFilter = null, 
  onClearExternalFilter,
  initialQuestionId = null
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
          const currentQ = displayedQuestions[currentIndex];
          if (currentQ) handleSelectOption(currentQ.id, optIdx);
        } else if (['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(e.key)) {
          const keyMap = { a: 0, b: 1, c: 2, d: 3, A: 0, B: 1, C: 2, D: 3 };
          const optIdx = keyMap[e.key];
          const currentQ = displayedQuestions[currentIndex];
          if (currentQ) handleSelectOption(currentQ.id, optIdx);
        } else if (e.key === 'f' || e.key === 'F') {
          const currentQ = displayedQuestions[currentIndex];
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

  const handleSubmitExam = () => {
    setIsExamMode(false);
    setShowResultCard(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetAll = () => {
    if (confirm('คุณต้องการรีเซ็ตคำตอบทั้งหมดและเริ่มฝึกใหม่ใช่หรือไม่?')) {
      setUserAnswers({});
      setFlaggedQuestions(new Set());
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

  return (
    <div className="space-y-5">
      {/* Top Controller & Mode Selector Bar */}
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Header titles */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                isExamMode 
                  ? 'bg-purple-100 text-purple-900 border border-purple-300' 
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
              }`}>
                {isExamMode ? '⏱️ โหมดจับเวลาสอบจริง (90 นาที)' : '💡 โหมดฝึกฝน (เฉลยและตรวจทันที)'}
              </span>

              {isExamMode && (
                <span className="bg-slate-900 text-amber-300 font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 shadow-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimer(examTime)}</span>
                </span>
              )}
            </div>

            <h2 className="text-lg md:text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
              <span>คลังข้อสอบ Final Exam 80 ข้อ (Questions 1–80)</span>
            </h2>
          </div>

          {/* Right Controller Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle (Focus vs List) */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('focus')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                  viewMode === 'focus' 
                    ? 'bg-white text-blue-700 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="ทำทีละข้อ สมาธิไม่หลุด (แนะนำสำหรับการเรียนรู้)"
              >
                <Target className="w-3.5 h-3.5" />
                <span>โฟกัสทีละข้อ</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-700 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="ดูข้อสอบทั้งหมดแบบเลื่อนหน้าจอ"
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>แสดงทุกข้อ</span>
              </button>
            </div>

            {/* Exam Mode Toggle */}
            <button
              onClick={() => {
                setIsExamMode(!isExamMode);
                setShowResultCard(false);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-xl text-xs transition border border-slate-300 flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{isExamMode ? 'สลับเป็นโหมดฝึกฝน' : 'สอบจริง (จับเวลา)'}</span>
            </button>

            {/* Question Matrix Drawer Button */}
            <button
              onClick={() => setShowPaletteDrawer(!showPaletteDrawer)}
              className="bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold px-3 py-1.5 rounded-xl text-xs transition border border-blue-200 flex items-center gap-1.5"
            >
              <Grid className="w-3.5 h-3.5 text-blue-600" />
              <span>กระดาน 80 ข้อ ({answeredCount}/80)</span>
            </button>

            {/* Submit Exam Button if in Exam Mode */}
            {isExamMode && (
              <button
                onClick={() => {
                  const unanswered = questionsData.length - answeredCount;
                  if (unanswered > 0) {
                    if (!confirm(`คุณยังทำข้อสอบไม่ครบ (เหลืออีก ${unanswered} ข้อ)\nต้องการยืนยันส่งข้อสอบเพื่อดูผลคะแนนเลยหรือไม่?`)) return;
                  }
                  handleSubmitExam();
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ส่งข้อสอบ</span>
              </button>
            )}

            {/* Reset */}
            <button
              onClick={handleResetAll}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1.5 rounded-xl text-xs transition flex items-center gap-1"
              title="ล้างคำตอบและเริ่มใหม่"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>เลือกส่วนข้อสอบ:</span>
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
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
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
                className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                  filterMistakesOnly 
                    ? 'bg-red-600 text-white shadow-xs' 
                    : 'bg-red-50 hover:bg-red-100 text-red-800 border border-red-200'
                }`}
              >
                <span>⚠️ ข้อที่ตอบผิด ({mistakesCount})</span>
              </button>
            )}
          </div>

          <div className="text-slate-600 text-xs flex items-center gap-2">
            <span>คะแนนปัจจุบัน: <strong className="text-emerald-700 font-bold">{currentScore}</strong>/80</span>
          </div>
        </div>
      </div>

      {/* Floating or Collapsible Question Grid Drawer */}
      {showPaletteDrawer && (
        <div className="bg-white p-4 rounded-2xl border-2 border-blue-500 shadow-md space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-blue-600" />
              <strong className="text-xs font-bold text-slate-900">
                กระดานเลือกข้อสอบ (Question Palette 1–80):
              </strong>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-200 border"></span> ยังไม่ตอบ</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-600"></span> ตอบแล้ว</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-400"></span> ปักหมุด</span>
              {!isExamMode && (
                <>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-600"></span> ถูก</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-500"></span> ผิด</span>
                </>
              )}
              <button 
                onClick={() => setShowPaletteDrawer(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold px-1"
              >
                ✕ ปิด
              </button>
            </div>
          </div>

          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-16 lg:grid-cols-20 gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200 max-h-48 overflow-y-auto">
            {questionsData.map(q => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isFlagged = flaggedQuestions.has(q.id);
              const isCorrect = isAnswered && userAnswers[q.id] === q.answer;
              const isCurrent = activeQuestion && activeQuestion.id === q.id;

              let btnStyle = "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100";
              if (isFlagged) {
                btnStyle = "bg-amber-400 text-slate-950 font-bold border-amber-500";
              } else if (isAnswered) {
                if (isExamMode) {
                  btnStyle = "bg-blue-600 text-white font-bold";
                } else {
                  btnStyle = isCorrect ? "bg-emerald-600 text-white font-bold" : "bg-red-500 text-white font-bold";
                }
              }

              return (
                <button
                  key={q.id}
                  onClick={() => jumpToQuestion(q.id)}
                  className={`h-7 w-full rounded text-[11px] font-semibold transition flex items-center justify-center relative ${btnStyle} ${
                    isCurrent ? 'ring-2 ring-blue-500 ring-offset-1 font-black scale-105' : ''
                  }`}
                  title={`ข้อที่ ${q.id} (${q.unit})`}
                >
                  {q.id}
                </button>
              );
            })}
          </div>
        </div>
      )}

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
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 md:p-8 space-y-6 animate-fadeIn">
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

              {/* Action Buttons: Flag & Sound */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFlag(currentQId)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 border ${
                    isCurrentFlagged
                      ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                  }`}
                  title="ปักหมุดข้อที่ต้องการกลับมาทบทวน"
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
            <div className="p-4 md:p-5 bg-slate-50/90 rounded-2xl border border-slate-200 text-xs md:text-sm text-slate-800 leading-relaxed space-y-1.5 font-inter">
              <div className="flex items-center gap-2 font-sarabun font-bold text-slate-900 text-xs uppercase tracking-wide">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>บทความ / บริบทประกอบข้อสอบ (Context Passage):</span>
              </div>
              <p className="whitespace-pre-line pl-1">{activeQuestion.passage}</p>
            </div>
          )}

          {/* Audio Player Bar (if question has audio) */}
          {activeQuestion.hasAudio && (
            <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
                    <Volume2 className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-indigo-950">
                      {activeQuestion.audioTitle || 'คลิปเสียงข้อสอบข้อนี้ (Audio Prompt)'}
                    </h4>
                    <p className="text-[11px] text-indigo-700">
                      กดฟังเสียงจำลองข้อสอบจริงเพื่อจับใจความในการเลือกคำตอบ
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      if (speech.isSpeaking && speech.currentText === activeQuestion.audioText) {
                        speech.stop();
                      } else {
                        speech.speak(activeQuestion.audioText, speech.accent, speech.rate);
                        setShowTranscripts(prev => ({ ...prev, [currentQId]: true }));
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-xs"
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
          <div className="text-base md:text-lg font-bold text-slate-900 leading-snug">
            {activeQuestion.q}
          </div>

          {/* Options Grid (A, B, C, D) */}
          <div className="grid sm:grid-cols-2 gap-3">
            {activeQuestion.options.map((opt, optIdx) => {
              let btnStyle = "bg-white border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-800";
              let badgeStyle = "bg-slate-100 text-slate-700 border-slate-300";

              if (isExamMode) {
                if (currentAnswer === optIdx) {
                  btnStyle = "bg-blue-50 border-blue-600 font-bold text-blue-900 shadow-xs ring-1 ring-blue-500";
                  badgeStyle = "bg-blue-600 text-white border-blue-600";
                }
              } else {
                if (isCurrentAnswered) {
                  if (optIdx === activeQuestion.answer) {
                    btnStyle = "bg-emerald-50 border-emerald-500 font-bold text-emerald-950 ring-1 ring-emerald-500";
                    badgeStyle = "bg-emerald-600 text-white border-emerald-600";
                  } else if (currentAnswer === optIdx) {
                    btnStyle = "bg-red-50 border-red-500 font-bold text-red-950 ring-1 ring-red-500";
                    badgeStyle = "bg-red-600 text-white border-red-600";
                  } else {
                    btnStyle = "bg-slate-50/60 border-slate-200 text-slate-400 opacity-60";
                    badgeStyle = "bg-slate-200 text-slate-500 border-slate-300";
                  }
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQId, optIdx)}
                  className={`text-left p-4 rounded-2xl border-2 text-xs md:text-sm transition flex items-start gap-3 relative ${btnStyle}`}
                >
                  <span className={`w-7 h-7 rounded-lg border text-xs font-black flex items-center justify-center shrink-0 mt-0.5 ${badgeStyle}`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="leading-relaxed flex-grow pt-0.5">
                    {opt.substring(3)}
                  </span>
                  {(!isExamMode && isCurrentAnswered) && (
                    optIdx === activeQuestion.answer ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : currentAnswer === optIdx ? (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    ) : null
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box (Visible in Practice Mode immediately once answered) */}
          {(!isExamMode && isCurrentAnswered) && (
            <div className={`p-5 rounded-2xl text-xs md:text-sm space-y-2.5 border-2 animate-fadeIn ${
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
                    <span>ยังไม่ถูกต้อง (คุณตอบข้อ {String.fromCharCode(65 + currentAnswer)} • คำตอบที่ถูกคือข้อ {String.fromCharCode(65 + activeQuestion.answer)})</span>
                  </>
                )}
              </div>

              <p className="leading-relaxed text-slate-800">
                <strong className="text-slate-900 block mb-0.5">คำอธิบายเฉลย:</strong> 
                {activeQuestion.explanation}
              </p>

              {activeQuestion.tip && (
                <div className="p-3 bg-white rounded-xl border border-amber-300/80 text-amber-950 text-xs leading-relaxed flex items-start gap-2 shadow-xs">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-900 font-bold">💡 จุดสังเกต & เทคนิคการจำ:</strong> {activeQuestion.tip}
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
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-xs'
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
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 transition"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
                      ข้อที่ {qId}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {q.unit}
                    </span>
                    <span className="text-[11px] text-slate-500 hidden sm:inline">
                      • {q.topic}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFlag(qId)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
                        isFlagged 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current text-amber-600' : ''}`} />
                      <span>{isFlagged ? 'ปักหมุดแล้ว' : 'ปักหมุด'}</span>
                    </button>
                  </div>
                </div>

                {/* Passage */}
                {q.passage && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-inter">
                    <strong className="text-slate-900 block mb-1 font-sarabun font-bold">📖 บทความ / บริบทประกอบข้อสอบ:</strong>
                    {q.passage}
                  </div>
                )}

                {/* Audio */}
                {q.hasAudio && (
                  <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-indigo-100 text-indigo-700">
                        <Volume2 className="w-4 h-4" />
                      </span>
                      <div>
                        <strong className="text-indigo-900 block font-bold">{q.audioTitle || 'คลิปเสียงข้อสอบข้อนี้'}</strong>
                        <span className="text-[11px] text-indigo-700">กดฟังเสียงบรรยายเพื่อจับใจความในการตอบ</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        onClick={() => {
                          if (speech.isSpeaking && speech.currentText === q.audioText) {
                            speech.stop();
                          } else {
                            speech.speak(q.audioText);
                            setShowTranscripts(prev => ({ ...prev, [qId]: true }));
                          }
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-xs"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{speech.isSpeaking && speech.currentText === q.audioText ? 'หยุด' : 'เล่นเสียง'}</span>
                      </button>
                      <button
                        onClick={() => toggleTranscript(qId)}
                        className="bg-white hover:bg-slate-100 text-indigo-800 border border-indigo-300 px-2.5 py-1.5 rounded-lg text-xs transition flex items-center gap-1"
                      >
                        {showTranscripts[qId] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>สคริปต์</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Collapsible Transcript with Word Highlighting */}
                {showTranscripts[qId] && (
                  <div className="p-3.5 bg-slate-900 text-slate-100 rounded-xl text-xs font-inter leading-relaxed space-y-1">
                    <div className="flex items-center justify-between text-amber-400 font-bold font-sarabun text-xs">
                      <span>สคริปต์เสียงบรรยาย:</span>
                      {speech.isSpeaking && speech.currentText === q.audioText && (
                        <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-mono animate-pulse">
                          ● Real-Time
                        </span>
                      )}
                    </div>
                    <HighlightedTranscript
                      text={q.audioText}
                      charIndex={speech.charIndex}
                      charLength={speech.charLength}
                      isSpeaking={speech.isSpeaking}
                      currentSpeakingText={speech.currentText}
                    />
                  </div>
                )}

                {/* Question */}
                <div className="text-sm md:text-base font-bold text-slate-900 leading-snug">
                  {q.q}
                </div>

                {/* Options */}
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    let btnStyle = "bg-white border-slate-300 hover:bg-blue-50/60 text-slate-800";

                    if (isExamMode) {
                      if (userAnswer === optIdx) {
                        btnStyle = "bg-blue-100 border-blue-500 font-bold text-blue-900 shadow-xs";
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

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(qId, optIdx)}
                        className={`text-left p-3.5 rounded-xl border text-xs md:text-sm transition flex items-start gap-2.5 ${btnStyle}`}
                      >
                        <span className="w-6 h-6 rounded-full bg-slate-100 border text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-relaxed">{opt.substring(3)}</span>
                      </button>
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
