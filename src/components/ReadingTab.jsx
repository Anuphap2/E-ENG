import React, { useState, useEffect } from 'react';
import { readingPassages } from '../data/readingData';
import confetti from 'canvas-confetti';
import { soundEffects } from '../utils/soundEffects';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  Search, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  Lightbulb, 
  Eye, 
  EyeOff, 
  Award, 
  FileText, 
  Check, 
  RotateCcw, 
  HelpCircle, 
  Clock, 
  Compass, 
  ZoomIn, 
  ZoomOut,
  Flame,
  Zap
} from 'lucide-react';
import ClickableWordText from './ClickableWordText';

export default function ReadingTab({ speech, onNavigateQuiz, soundEnabled = true, onAddXp }) {
  // Active selected passage
  const [selectedPassageId, setSelectedPassageId] = useState('curie');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('all');

  // Reading sub-tab: 'read' | 'strategies' | 'vocab'
  const [subTab, setSubTab] = useState('read');

  // Reader settings
  const [fontSize, setFontSize] = useState('md'); // 'sm' | 'md' | 'lg'
  const [showThaiTranslation, setShowThaiTranslation] = useState(false);
  const [highlightedParagraph, setHighlightedParagraph] = useState(null);

  // Question answering state per passage
  const [userAnswers, setUserAnswers] = useState({}); // { [passageId]: { [qId]: choiceIndex } }
  const [submittedPassages, setSubmittedPassages] = useState(new Set()); // Set of passage IDs submitted
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  // Filter passages
  const filteredPassages = readingPassages.filter(p => {
    if (selectedUnitFilter === 'all') return true;
    if (selectedUnitFilter === 'test2') return p.id.startsWith('test2');
    return p.unit === selectedUnitFilter;
  });

  const currentPassage = readingPassages.find(p => p.id === selectedPassageId) || readingPassages[0];

  // Current passage answers
  const currentAnswers = userAnswers[currentPassage.id] || {};
  const isCurrentSubmitted = submittedPassages.has(currentPassage.id);

  // Reset active question when switching passage
  useEffect(() => {
    setActiveQuestionIdx(0);
    setHighlightedParagraph(null);
  }, [selectedPassageId]);

  // Keyboard navigation on PC for Reading
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (subTab !== 'read') return;

      if (e.key === 'ArrowLeft') {
        if (activeQuestionIdx > 0) {
          setActiveQuestionIdx(prev => prev - 1);
        }
      } else if (e.key === 'ArrowRight') {
        if (activeQuestionIdx < currentPassage.questions.length - 1) {
          setActiveQuestionIdx(prev => prev + 1);
        }
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const choiceIdx = parseInt(e.key, 10) - 1;
        const q = currentPassage.questions[activeQuestionIdx];
        if (q) handleSelectAnswer(q.id, choiceIdx);
      } else if (['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(e.key)) {
        const keyMap = { a: 0, b: 1, c: 2, d: 3, A: 0, B: 1, C: 2, D: 3 };
        const choiceIdx = keyMap[e.key];
        const q = currentPassage.questions[activeQuestionIdx];
        if (q) handleSelectAnswer(q.id, choiceIdx);
      } else if (e.key === 't' || e.key === 'T') {
        setShowThaiTranslation(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [subTab, activeQuestionIdx, currentPassage, isCurrentSubmitted]);

  // Handle selecting an answer
  const handleSelectAnswer = (qId, choiceIdx) => {
    if (isCurrentSubmitted) return;
    soundEffects.playClick(soundEnabled);
    setUserAnswers(prev => ({
      ...prev,
      [currentPassage.id]: {
        ...(prev[currentPassage.id] || {}),
        [qId]: choiceIdx
      }
    }));
  };

  // Check answers for current passage
  const handleSubmitPassage = () => {
    setSubmittedPassages(prev => new Set(prev).add(currentPassage.id));
    
    // Check score
    let correct = 0;
    currentPassage.questions.forEach(q => {
      if (currentAnswers[q.id] === q.answer) correct++;
    });

    if (correct === currentPassage.questions.length) {
      soundEffects.playFanfare(soundEnabled);
      if (onAddXp) onAddXp(60, `ตอบถูกครบ 100% บทอ่าน ${currentPassage.title}`);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      soundEffects.playCorrect(soundEnabled);
      if (onAddXp) onAddXp(correct * 10, `ทำแบบฝึกหัดบทอ่าน ${currentPassage.title}`);
    }
  };

  // Reset passage test
  const handleResetPassage = () => {
    setSubmittedPassages(prev => {
      const next = new Set(prev);
      next.delete(currentPassage.id);
      return next;
    });
    setUserAnswers(prev => {
      const next = { ...prev };
      delete next[currentPassage.id];
      return next;
    });
    setActiveQuestionIdx(0);
  };

  // Count answered and correct
  const answeredCount = Object.keys(currentAnswers).length;
  let correctCount = 0;
  if (isCurrentSubmitted) {
    currentPassage.questions.forEach(q => {
      if (currentAnswers[q.id] === q.answer) correctCount++;
    });
  }

  // Active question object
  const activeQuestion = currentPassage.questions[activeQuestionIdx] || currentPassage.questions[0];

  // Font size classes
  const fontClasses = {
    sm: 'text-xs md:text-sm leading-relaxed',
    md: 'text-sm md:text-base leading-relaxed',
    lg: 'text-base md:text-lg leading-loose'
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>READING COMPREHENSION STUDIO • COURSE 10700320</span>
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>ห้องฝึกอ่านและวิเคราะห์บทอ่านข้อสอบ (Reading Studio)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ฝึกอ่านจับใจความบทความออกสอบจริง (IELTS Marie Curie, TOEFL Artisans Activity 29, TOEIC Invoices) พร้อมแปลไทยเทียบประโยคต่อประโยค
          </p>
        </div>

        {/* Sub-tab Pill Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs self-start lg:self-auto">
          <button
            onClick={() => setSubTab('read')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
              subTab === 'read' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>บทอ่าน & ข้อสอบ</span>
          </button>

          <button
            onClick={() => setSubTab('strategies')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
              subTab === 'strategies' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>สูตรลัด Skim/Scan</span>
          </button>

          <button
            onClick={() => setSubTab('vocab')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
              subTab === 'vocab' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>ศัพท์สำคัญประจำบท</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          SUB-TAB 1: MAIN READING & PRACTICE (Bilingual Split)
         ======================================================== */}
      {subTab === 'read' && (
        <div className="space-y-5">
          {/* Passage Selector Bar */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-bold text-slate-600">เลือกบทความที่ต้องการอ่าน:</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">กรองตามหน่วย:</span>
                <select
                  value={selectedUnitFilter}
                  onChange={(e) => setSelectedUnitFilter(e.target.value)}
                  className="border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-700 font-medium outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">บทความทั้งหมด ({readingPassages.length} เรื่อง)</option>
                  <option value="test2">🔥 ข้อสอบ Test 2 (บ่ายนี้ 4 ตอน)</option>
                  <option value="Unit 6">Unit 6: IELTS (Marie Curie)</option>
                  <option value="Unit 7">Unit 7: TOEFL (Artisans)</option>
                  <option value="Unit 8">Unit 8: TOEIC (Logistics / Email)</option>
                  <option value="Unit 5">Unit 5: Study (Degree Policy / Cyclists)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {filteredPassages.map((p) => {
                const isSelected = selectedPassageId === p.id;
                const isSub = submittedPassages.has(p.id);

                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPassageId(p.id)}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 ${
                      isSelected 
                        ? 'bg-blue-50/80 text-blue-950 border-blue-500 shadow-sm ring-2 ring-blue-300' 
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {p.unit}
                        </span>
                        {isSub && (
                          <span className="text-[10px] font-black text-emerald-700 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ตรวจแล้ว
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold line-clamp-2 leading-tight">
                        {p.title}
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {p.examType}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Passage Overview Card */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-3xl shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  {currentPassage.examType} • {currentPassage.unit}
                </span>
                <h3 className="text-lg md:text-xl font-black text-white mt-0.5">
                  {currentPassage.title}
                </h3>
                <p className="text-xs text-blue-200 mt-0.5">
                  {currentPassage.thaiTitle}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="bg-white/10 px-2.5 py-1 rounded-xl text-blue-100 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentPassage.readingTime}</span>
                </span>
                <span className="bg-white/10 px-2.5 py-1 rounded-xl text-blue-100 font-mono">
                  {currentPassage.wordCount} คำ
                </span>
              </div>
            </div>

            <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-light">
              <strong className="text-amber-400 font-bold">สรุปภาพรวมบทอ่าน:</strong> {currentPassage.summary}
            </p>
          </div>

          {/* Reader Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
            {/* Left: Font Size Controls */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium text-[11px]">ขนาดตัวอักษร:</span>
              <div className="bg-white border border-slate-200 rounded-xl p-0.5 flex items-center gap-0.5">
                <button
                  onClick={() => setFontSize('sm')}
                  className={`px-2 py-1 rounded-lg font-bold text-xs ${fontSize === 'sm' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  เล็ก
                </button>
                <button
                  onClick={() => setFontSize('md')}
                  className={`px-2 py-1 rounded-lg font-bold text-xs ${fontSize === 'md' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  กลาง
                </button>
                <button
                  onClick={() => setFontSize('lg')}
                  className={`px-2 py-1 rounded-lg font-bold text-xs ${fontSize === 'lg' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  ใหญ่
                </button>
              </div>
            </div>

            {/* Right: Bilingual Toggle & Audio Read Aloud */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowThaiTranslation(!showThaiTranslation)}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition border ${
                  showThaiTranslation 
                    ? 'bg-amber-100 text-amber-900 border-amber-300' 
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {showThaiTranslation ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
                <span>{showThaiTranslation ? 'ซ่อนคำแปลไทย' : '🇹🇭 แสดงคำแปลไทย'}</span>
              </button>

              <button
                onClick={() => {
                  const activeText = currentPassage.paragraphs.map(p => p.text).join(' ');
                  speech.speak(activeText);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition shadow-xs"
                title="ฟังเสียงอ่านทั้งบทความ"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>ฟังเสียงอ่าน</span>
              </button>
            </div>
          </div>

          {/* TWO-COLUMN LAYOUT: Passage on Left, Questions on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Passage Text (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-50/60 p-4 md:p-6 rounded-3xl border border-slate-200 space-y-5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-200 pb-2">
                  <span>เนื้อหาบทอ่าน (Reading Passage)</span>
                  <span className="text-blue-600">คลิกลำโพงเพื่อฟังทีละย่อหน้าได้</span>
                </div>

                <div className="space-y-6">
                  {currentPassage.paragraphs.map((p) => {
                    const isTargeted = highlightedParagraph === p.id || activeQuestion.paragraphRef === p.id;

                    return (
                      <div
                        key={p.id}
                        id={`paragraph-${p.id}`}
                        className={`p-4 md:p-5 rounded-2xl transition-all duration-300 border-2 space-y-3 ${
                          isTargeted 
                            ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-200 shadow-xs' 
                            : 'bg-white border-slate-200/80 shadow-2xs'
                        }`}
                      >
                        {/* Paragraph Meta Header */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-900 font-mono font-black flex items-center justify-center text-xs">
                              {p.id}
                            </span>
                            <span className="font-bold text-slate-700">{p.title || p.label}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isTargeted && (
                              <span className="text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                                📍 อ้างอิงข้อ {activeQuestionIdx + 1}
                              </span>
                            )}
                            <button
                              onClick={() => speech.speak(p.text)}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
                              title="ฟังเสียงอ่านย่อหน้านี้"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* English Text */}
                        <p className={`font-serif text-slate-900 tracking-normal ${fontClasses[fontSize]}`}>
                          <ClickableWordText text={p.text} />
                        </p>

                        {/* Thai Translation & Keypoints Box (Bilingual Toggle) */}
                        {showThaiTranslation && (
                          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-2 text-xs animate-fadeIn">
                            <span className="font-bold text-amber-950 flex items-center gap-1 text-[11px]">
                              <Sparkles className="w-3 h-3 text-amber-600" />
                              <span>แปลไทย:</span>
                            </span>
                            <p className="text-slate-800 leading-relaxed font-sarabun text-[13px]">
                              {p.thai}
                            </p>
                            {p.keyPoints && p.keyPoints.length > 0 && (
                              <div className="pt-1.5 border-t border-amber-200/60 space-y-1">
                                <span className="text-[11px] font-bold text-amber-900 block">จุดสำคัญที่ชอบออกสอบ:</span>
                                <ul className="list-disc list-inside text-slate-700 text-[11px] space-y-0.5">
                                  {p.keyPoints.map((kp, kidx) => (
                                    <li key={kidx}>{kp}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Exam Questions (5 Cols) */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
                {/* Questions Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                      READING COMPREHENSION TEST
                    </span>
                    <h4 className="text-sm md:text-base font-black text-slate-900">
                      แบบฝึกหัดท้ายบทอ่าน ({currentPassage.questions.length} ข้อ)
                    </h4>
                  </div>

                  {isCurrentSubmitted && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">คะแนน</span>
                      <span className="text-base font-black text-emerald-700">
                        {correctCount} / {currentPassage.questions.length}
                      </span>
                    </div>
                  )}
                </div>

                {/* Question Numbers Quick Navigation */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {currentPassage.questions.map((q, qIdx) => {
                    const isSelected = activeQuestionIdx === qIdx;
                    const isAnswered = currentAnswers[q.id] !== undefined;
                    const isCorrect = isCurrentSubmitted && currentAnswers[q.id] === q.answer;
                    const isWrong = isCurrentSubmitted && currentAnswers[q.id] !== undefined && currentAnswers[q.id] !== q.answer;

                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          setActiveQuestionIdx(qIdx);
                          setHighlightedParagraph(q.paragraphRef);
                        }}
                        className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition border ${
                          isCorrect 
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs' 
                            : isWrong 
                              ? 'bg-rose-600 text-white border-rose-700' 
                              : isSelected 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                                : isAnswered 
                                  ? 'bg-blue-100 text-blue-800 border-blue-300' 
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {qIdx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Active Question Box */}
                <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-700">ข้อที่ {activeQuestionIdx + 1} จาก {currentPassage.questions.length}</span>
                      {activeQuestion.paragraphRef && (
                        <button
                          onClick={() => {
                            setHighlightedParagraph(activeQuestion.paragraphRef);
                            const el = document.getElementById(`paragraph-${activeQuestion.paragraphRef}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }}
                          className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
                        >
                          <span>🔍 ดูย่อหน้า {activeQuestion.paragraphRef}</span>
                        </button>
                      )}
                    </div>
                    <h5 className="text-sm font-bold text-slate-900 leading-snug">
                      <ClickableWordText text={activeQuestion.question} />
                    </h5>
                  </div>

                  {/* Multiple Choices */}
                  <div className="space-y-2">
                    {activeQuestion.choices.map((choice, cIdx) => {
                      const isChosen = currentAnswers[activeQuestion.id] === cIdx;
                      const showCorrect = isCurrentSubmitted && cIdx === activeQuestion.answer;
                      const showWrong = isCurrentSubmitted && isChosen && cIdx !== activeQuestion.answer;
                      const choiceLetter = String.fromCharCode(65 + cIdx);

                      return (
                        <div
                          key={cIdx}
                          onClick={() => !isCurrentSubmitted && handleSelectAnswer(activeQuestion.id, cIdx)}
                          className={`w-full text-left p-3 rounded-xl text-xs font-semibold transition border-2 flex items-start gap-2.5 cursor-pointer ${
                            showCorrect 
                              ? 'bg-emerald-50 text-emerald-950 border-emerald-500 font-bold ring-1 ring-emerald-300' 
                              : showWrong 
                                ? 'bg-rose-50 text-rose-950 border-rose-500 font-bold' 
                                : isChosen 
                                  ? 'bg-blue-50 text-blue-950 border-blue-600 font-bold shadow-xs' 
                                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                          } ${isCurrentSubmitted ? 'cursor-default' : ''}`}
                        >
                          <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
                            showCorrect 
                              ? 'bg-emerald-600 text-white' 
                              : showWrong 
                                ? 'bg-rose-600 text-white' 
                                : isChosen 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-slate-100 text-slate-600'
                          }`}>
                            {choiceLetter}
                          </span>
                          <span className="leading-relaxed flex-grow">
                            <ClickableWordText
                              text={choice}
                              choiceLetter={choiceLetter}
                              onSelectChoice={() => !isCurrentSubmitted && handleSelectAnswer(activeQuestion.id, cIdx)}
                              className="leading-relaxed block"
                            />
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation (Shown when submitted) */}
                  {isCurrentSubmitted && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs animate-fadeIn">
                      <span className="font-bold text-slate-900 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>คำอธิบายเฉลย:</span>
                      </span>
                      <p className="text-slate-700 leading-relaxed font-sarabun text-[12px]">
                        {activeQuestion.explanation}
                      </p>
                    </div>
                  )}

                  {/* Question Prev / Next buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => {
                        if (activeQuestionIdx > 0) setActiveQuestionIdx(q => q - 1);
                      }}
                      disabled={activeQuestionIdx === 0}
                      className="px-2.5 py-1 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 font-medium"
                    >
                      ← ข้อก่อนหน้า
                    </button>

                    <button
                      onClick={() => {
                        if (activeQuestionIdx < currentPassage.questions.length - 1) {
                          setActiveQuestionIdx(q => q + 1);
                        }
                      }}
                      disabled={activeQuestionIdx === currentPassage.questions.length - 1}
                      className="px-2.5 py-1 rounded-lg text-blue-600 hover:bg-blue-50 disabled:opacity-30 font-bold"
                    >
                      ข้อถัดไป →
                    </button>
                  </div>
                </div>

                {/* Submit / Reset Actions */}
                <div className="pt-2">
                  {!isCurrentSubmitted ? (
                    <button
                      onClick={handleSubmitPassage}
                      disabled={answeredCount === 0}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold py-3 px-4 rounded-2xl text-xs md:text-sm transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      <span>ตรวจคำตอบบทอ่านนี้ ({answeredCount}/{currentPassage.questions.length} ข้อ)</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleResetPassage}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-4 rounded-2xl text-xs transition flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>ทำข้อสอบบทอ่านนี้ใหม่อีกครั้ง</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: READING STRATEGIES & HACKS
         ======================================================== */}
      {subTab === 'strategies' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-black text-slate-900">
              💡 คลังสูตรลัดและเทคนิคการทำข้อสอบ Reading (Units 5–8)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              รวมเทคนิคการกวาดสายตา Skimming, Scanning และการตอบคำถาม True/False/Not Given ไม่ให้โดนข้อสอบหลอก
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Strategy 1: Skimming vs Scanning */}
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
              <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black">
                01
              </span>
              <h4 className="text-base font-bold text-slate-900">
                Skimming vs. Scanning (กวาดสายตา vs. ค้นคำเจาะจง)
              </h4>
              <div className="space-y-2 text-xs text-slate-700 leading-relaxed font-sarabun">
                <p>
                  <strong className="text-blue-900">1. Skimming (อ่านจับใจความเร็ว):</strong> ให้อ่านเฉพาะ <strong>ประโยคแรก (Topic Sentence)</strong> และ <strong>ประโยคสุดท้าย (Concluding Sentence)</strong> ของแต่ละย่อหน้า จะช่วยให้รู้ Main Idea ของทั้งบทความได้ภายใน 45 วินาที โดยไม่ต้องแปลทุกคำ
                </p>
                <p>
                  <strong className="text-indigo-900">2. Scanning (ค้นคำเป้าหมาย):</strong> ใช้ตามล่าหา Keyword เฉพาะ เช่น วันที่ (1891, 1903, 1911), ตัวเลข, ชื่อเฉพาะ (Pierre Curie, Sorbonne, Panthéon, Warsaw) หรือคำศัพท์ในโจทย์ โดยใช้ตามองกวาดเป็นรูปตัว S ไม่ต้องพยายามอ่านทีละคำ
                </p>
              </div>
            </div>

            {/* Strategy 2: T/F/NG Master Formula */}
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
              <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black">
                02
              </span>
              <h4 className="text-base font-bold text-slate-900">
                สูตรเด็ด True / False / Not Given (IELTS Reading)
              </h4>
              <div className="space-y-2 text-xs text-slate-700 leading-relaxed font-sarabun">
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <strong className="text-emerald-900">TRUE:</strong> ข้อความในโจทย์มีความหมายตรงกับบทความ 100% (แม้จะใช้คำ Paraphrase ต่างกัน)
                </div>
                <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  <strong className="text-rose-900">FALSE:</strong> ข้อความในโจทย์ <strong>ขัดแย้งตรงกันข้าม</strong> กับสิ่งที่บทความระบุไว้ เช่น บทความบอกว่าเป็น "sole winner" แต่โจทย์บอกว่า "shared with her husband"
                </div>
                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  <strong className="text-amber-900">NOT GIVEN:</strong> ในบทความ <strong>ไม่ได้พูดถึงเลย หรือไม่มีข้อมูลยืนยัน</strong> ห้ามคิดไปเองโดยเด็ดขาด!
                </div>
              </div>
            </div>

            {/* Strategy 3: Context Clue Decoding */}
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">
                03
              </span>
              <h4 className="text-base font-bold text-slate-900">
                เดาศัพท์จาก Context Clues (บริบทแวดล้อม)
              </h4>
              <div className="space-y-2 text-xs text-slate-700 leading-relaxed font-sarabun">
                <p>
                  เมื่อเจอศัพท์ยาก เช่น <strong>"disrupted"</strong> หรือ <strong>"adversity"</strong> ให้มองหาคำเชื่อม:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Contrast Clues:</strong> <em>However, Despite, Although, In contrast</em> (ความหมายตรงข้ามกับประโยคข้างเคียง)</li>
                  <li><strong>Restatement Clues:</strong> <em>That is to say, In other words, Commas ( , ... , )</em> (เป็นการอธิบายความหมายซ้ำ)</li>
                  <li><strong>Cause & Effect:</strong> <em>Because, Due to, Therefore, As a result</em> (วิเคราะห์จากผลลัพธ์ที่เกิดขึ้น)</li>
                </ul>
              </div>
            </div>

            {/* Strategy 4: TOEIC Double Passage Cross-Referencing */}
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
              <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-black">
                04
              </span>
              <h4 className="text-base font-bold text-slate-900">
                การเชื่อมโยงเอกสารคู่ TOEIC Part 7 Double Passage
              </h4>
              <div className="space-y-2 text-xs text-slate-700 leading-relaxed font-sarabun">
                <p>
                  ในข้อสอบ TOEIC มักให้ <strong>เอกสารที่ 1 (Invoice / Schedule)</strong> และ <strong>เอกสารที่ 2 (Email / Complaint)</strong>:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>คำถามข้อที่ 3 หรือ 4 มักเป็น <strong>Cross-Reference Question</strong> ที่ต้องนำข้อมูลจากทั้ง 2 เอกสารมาคำนวณหรือเทียบกัน</li>
                  <li>เช่น ดูราคาสินค้าต่อหน่วยจาก Invoice ($120) แล้วมาคูณกับจำนวนสินค้าที่ขาดใน Email (15 ชิ้น) = ยอดเคลมเงินชดเชย $1,800</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 3: PASSAGE KEY VOCABULARY
         ======================================================== */}
      {subTab === 'vocab' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                📚 คลังคำศัพท์สำคัญประจำบทอ่าน: {currentPassage.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ศัพท์วิชาการที่พบบ่อยในบทความนี้ พร้อมคำแปล Part of Speech และตัวอย่างประโยค
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {currentPassage.vocabGlossary.map((vg, vidx) => (
              <div
                key={vidx}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-2.5 hover:shadow-xs transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-blue-950 font-inter">{vg.word}</span>
                    <span className="text-xs italic text-slate-500 font-inter">({vg.pos})</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-800 mt-1">{vg.thai}</h5>
                  <p className="text-[11px] text-slate-600 mt-2 bg-white p-2.5 rounded-xl border border-slate-200/80 leading-relaxed font-inter italic">
                    <strong className="text-blue-600 not-italic block mb-0.5 font-bold text-[10px]">ในบริบทบทความ:</strong>
                    "{vg.context}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-end">
                  <button
                    onClick={() => speech.speak(vg.word)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 transition"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>ฟังเสียง</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
