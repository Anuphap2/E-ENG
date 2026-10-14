import React, { useState, useEffect } from 'react';
import { vocabData } from '../data/vocabData';
import confetti from 'canvas-confetti';
import { 
  Bookmark, 
  Search, 
  Volume2, 
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
  Check
} from 'lucide-react';

export default function VocabTab({ speech }) {
  // Mode: 'single' (flashcard deck 1 by 1) or 'grid' (browse all cards)
  const [mode, setMode] = useState('single');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [masteredWords, setMasteredWords] = useState(new Set());
  const [filterNeedsReview, setFilterNeedsReview] = useState(false);
  const [deck, setDeck] = useState(vocabData);
  const [isFinished, setIsFinished] = useState(false);

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
    setIsFinished(false);
  }, [searchTerm, selectedUnit, filterNeedsReview, masteredWords]);

  // Keyboard navigation for single flashcard mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (mode === 'single' && !isFinished) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          setIsFlipped(prev => !prev);
        } else if (e.key === 'ArrowLeft') {
          handlePrev();
        } else if (e.key === 'ArrowRight') {
          handleNext();
        } else if (e.key === '1') {
          handleMarkReview();
        } else if (e.key === '2') {
          handleMarkMastered();
        } else if (e.key === 's' || e.key === 'S') {
          const currentWord = deck[currentIndex];
          if (currentWord) speech.speak(currentWord.word);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, currentIndex, isFlipped, deck, isFinished]);

  const currentItem = deck[currentIndex] || deck[0] || vocabData[0];
  const isMastered = masteredWords.has(currentItem.word);

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleMarkMastered = () => {
    setMasteredWords(prev => {
      const next = new Set(prev);
      next.add(currentItem.word);
      return next;
    });
    handleNext();
  };

  const handleMarkReview = () => {
    setMasteredWords(prev => {
      const next = new Set(prev);
      next.delete(currentItem.word);
      return next;
    });
    handleNext();
  };

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
  };

  const percentMastered = Math.round((masteredWords.size / vocabData.length) * 100);

  return (
    <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">ACADEMIC & BUSINESS VOCABULARY</span>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-0.5 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-blue-600" />
            <span>คลังคำศัพท์สำคัญ & Flashcards (50 คำ)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ฝึกจำคำศัพท์ทีละใบ (Spaced Repetition) พร้อมเสียงอ่านตัวอย่างประโยค และตัวเช็คความแม่นยำ
          </p>
        </div>

        {/* Vocab Progress Tracker */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-4 text-xs">
          <div>
            <div className="flex items-center justify-between gap-3 font-bold text-slate-700 mb-1">
              <span>ความแม่นยำรวม:</span>
              <span className="text-emerald-700 font-black">{masteredWords.size} / {vocabData.length} คำ ({percentMastered}%)</span>
            </div>
            <div className="w-36 md:w-48 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${percentMastered}%` }}
              />
            </div>
          </div>
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
              className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none w-36 sm:w-48"
            />
          </div>

          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">ทุก Unit (50 คำ)</option>
            <option value="Unit 5">Unit 5: Study (15 คำ)</option>
            <option value="Unit 6">Unit 6: IELTS (12 คำ)</option>
            <option value="Unit 7">Unit 7: TOEFL (11 คำ)</option>
            <option value="Unit 8">Unit 8: TOEIC (12 คำ)</option>
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

        {/* Right Mode Switch: Single Deck vs Grid Table */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setMode('single')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
              mode === 'single'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>สำรับทีละใบ (Flashcard)</span>
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
          MODE 1: SINGLE FLASHCARD POP-UP DECK (Requested by User)
         ======================================================== */}
      {mode === 'single' ? (
        <div className="max-w-xl mx-auto space-y-4 py-2">
          {!isFinished ? (
            <>
              {/* Deck Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>ใบที่ <strong className="text-slate-900 font-bold">{currentIndex + 1}</strong> จาก {deck.length} ใบ</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> แม่น: {masteredWords.size}
                    </span>
                    <span>•</span>
                    <button
                      onClick={handleShuffle}
                      className="hover:text-blue-600 flex items-center gap-1 text-[11px]"
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
                className={`cursor-pointer min-h-[300px] p-6 md:p-8 rounded-3xl border-2 transition-all duration-300 transform flex flex-col justify-between relative shadow-sm hover:shadow-md select-none ${
                  isFlipped 
                    ? 'bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white border-indigo-700' 
                    : isMastered
                      ? 'bg-gradient-to-br from-emerald-50/40 via-white to-slate-50 border-emerald-300 hover:border-emerald-400'
                      : 'bg-gradient-to-br from-white via-slate-50 to-blue-50/30 border-slate-300 hover:border-blue-400'
                }`}
              >
                {/* Top Card Meta */}
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                    isFlipped 
                      ? 'bg-white/20 text-blue-200' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {currentItem.unit}
                  </span>

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
                <div className="text-center py-6 space-y-3">
                  {!isFlipped ? (
                    /* FRONT OF CARD (English Word) */
                    <div className="space-y-2 animate-fadeIn">
                      <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                        {currentItem.word}
                      </h3>
                      <span className="inline-block text-sm font-semibold italic text-slate-500 bg-slate-100 px-3 py-0.5 rounded-full font-inter">
                        {currentItem.pos}
                      </span>
                      <p className="text-xs text-slate-400 pt-2 font-medium">
                        (แตะที่การ์ดเพื่อดูคำแปลภาษาไทยและตัวอย่าง)
                      </p>
                    </div>
                  ) : (
                    /* BACK OF CARD (Thai Meaning & Example) */
                    <div className="space-y-3 animate-fadeIn">
                      <div className="text-xs text-blue-300 font-bold tracking-wider uppercase">
                        {currentItem.word} ({currentItem.pos})
                      </div>
                      <h4 className="text-xl md:text-2xl font-black text-amber-300 leading-snug">
                        {currentItem.thai}
                      </h4>
                      <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 text-xs md:text-sm text-blue-100 italic font-inter leading-relaxed max-w-md mx-auto">
                        <span className="text-amber-400 font-bold block mb-1 font-sarabun not-italic text-xs">ตัวอย่างประโยค:</span>
                        "{currentItem.example}"
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Card Footer with Pronounce Button */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100/20 text-xs">
                  <span className={`text-[11px] ${isFlipped ? 'text-slate-400' : 'text-slate-400'}`}>
                    กด Spacebar เพื่อพลิกการ์ด
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
                    title="ออกเสียงคำศัพท์"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>ฟังเสียงอ่าน</span>
                  </button>
                </div>
              </div>

              {/* Action Decision Buttons (Mastered vs Need Review) */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleMarkReview}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-300 font-bold py-3 px-4 rounded-2xl text-xs md:text-sm transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <XCircle className="w-4 h-4 text-amber-600" />
                  <span>ยังไม่แม่น (ทบทวนอีก) [1]</span>
                </button>

                <button
                  onClick={handleMarkMastered}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-2xl text-xs md:text-sm transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>จำได้แล้ว! (ถัดไป) [2]</span>
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
              <span className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <Sparkles className="w-6 h-6" />
              </span>

              <h3 className="text-xl md:text-2xl font-black text-slate-900">
                🎉 ยอดเยี่ยมมาก! คุณทบทวนคำศัพท์ครบสำรับแล้ว
              </h3>

              <p className="text-xs md:text-sm text-slate-600 max-w-md mx-auto">
                ทบทวนสำเร็จไปทั้งสิ้น {deck.length} คำ โดยมีคำที่จำได้แล้วจำนวน{' '}
                <strong className="text-emerald-700 font-bold">{masteredWords.size} คำ</strong>
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs md:text-sm transition flex items-center gap-2 shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>เริ่มทบทวนรอบใหม่อีกครั้ง</span>
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
      ) : (
        /* ========================================================
            MODE 2: GRID / TABLE OF ALL CARDS (Browse & Search)
           ======================================================== */
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
                        if (next.has(item.word)) next.delete(item.word);
                        else next.add(item.word);
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
      )}
    </div>
  );
}
