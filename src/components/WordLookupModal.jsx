import React, { useEffect, useRef, useState } from 'react';
import { Volume2, X, CheckCircle2, Bookmark, Sparkles, ExternalLink, Globe } from 'lucide-react';
import { useWordLookup } from '../context/WordLookupContext';

export default function WordLookupModal() {
  const { 
    lookupData, 
    isLoading, 
    targetRect, 
    choiceContext, 
    closeLookup, 
    speech 
  } = useWordLookup();

  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ top: 100, left: 100, isMobile: false });

  // Compute smart floating position near targetRect or center
  useEffect(() => {
    if (!lookupData) return;

    const updatePosition = () => {
      const isMobile = window.innerWidth < 640;
      if (isMobile || !targetRect) {
        setCoords({ top: 0, left: 0, isMobile: true });
        return;
      }

      const cardWidth = 340;
      const cardHeight = cardRef.current?.offsetHeight || 260;
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      // Center horizontally on target word and clamp within viewport
      let left = targetRect.left + (targetRect.width / 2) - (cardWidth / 2);
      left = Math.max(12, Math.min(vw - cardWidth - 12, left));

      // Calculate space above and below relative to viewport
      const spaceBelow = vh - targetRect.bottom;
      const spaceAbove = targetRect.top;

      let top;
      // Prefer below the word if at least cardHeight + 12px available
      if (spaceBelow >= cardHeight + 12) {
        top = targetRect.bottom + 8;
      } 
      // Otherwise place above the word
      else if (spaceAbove >= cardHeight + 12) {
        top = targetRect.top - cardHeight - 8;
      } 
      // If cramped on both sides, place where there is more space
      else if (spaceBelow >= spaceAbove) {
        top = Math.min(targetRect.bottom + 8, vh - cardHeight - 12);
      } else {
        top = Math.max(12, targetRect.top - cardHeight - 8);
      }

      // Final boundary clamp to keep entirely on screen
      top = Math.max(12, Math.min(vh - cardHeight - 12, top));

      setCoords({ top, left, isMobile: false });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [lookupData, targetRect]);

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        closeLookup();
      }
    };
    if (lookupData) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [lookupData, closeLookup]);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLookup();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeLookup]);

  if (!lookupData) return null;

  const handleSpeak = (e) => {
    e.stopPropagation();
    if (speech && lookupData.word) {
      // Strip any extra explanation notes in parenthesis for clean speech
      const speakableWord = lookupData.word.replace(/\(.*?\)/g, '').trim();
      speech.speak(speakableWord, 'en-US');
    }
  };

  const handleSelectChoiceFromModal = (e) => {
    e.stopPropagation();
    if (choiceContext && choiceContext.onSelectChoice) {
      choiceContext.onSelectChoice();
      closeLookup();
    }
  };

  // Pos tag color mapping
  const getPosBadge = (pos = '') => {
    const p = pos.toLowerCase();
    if (p.includes('noun')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (p.includes('verb')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (p.includes('adj')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (p.includes('adv')) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className={`fixed inset-0 z-50 pointer-events-none ${coords.isMobile ? 'flex items-end sm:items-center justify-center p-3 bg-black/40 backdrop-blur-xs' : ''}`}>
      <div
        ref={cardRef}
        style={!coords.isMobile ? {
          position: 'fixed',
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          width: '350px'
        } : {}}
        className={`pointer-events-auto bg-white rounded-3xl border-2 border-indigo-500 shadow-2xl p-5 space-y-3.5 transition-all animate-fadeIn ${
          coords.isMobile ? 'w-full max-w-md max-h-[85vh] overflow-y-auto mb-2 ring-1 ring-slate-900/10' : ''
        }`}
      >
        {/* Header: Word, POS, Audio, Close */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-black text-slate-900 font-inter">
                {lookupData.word}
              </h3>
              {lookupData.pos && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPosBadge(lookupData.pos)}`}>
                  {lookupData.pos}
                </span>
              )}
            </div>

            {lookupData.ipa && (
              <span className="text-xs text-indigo-600 font-mono font-medium block">
                {lookupData.ipa}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Audio Button */}
            <button
              onClick={handleSpeak}
              className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition shadow-2xs group"
              title="ฟังเสียงอ่านคำศัพท์ (Pronounce)"
            >
              <Volume2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>

            {/* Close Button */}
            <button
              onClick={closeLookup}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              title="ปิด (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thai Definition */}
        <div className="space-y-1 bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-100">
          <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider block">
            🇹🇭 ความหมายภาษาไทย:
          </span>
          <p className="text-sm md:text-base font-bold text-slate-900 leading-snug">
            {lookupData.thai}
          </p>
        </div>

        {/* Context Example (if present) */}
        {lookupData.example && (
          <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold block">
              ตัวอย่างประโยคประกอบ:
            </span>
            <p className="font-inter italic text-slate-800">
              "{lookupData.example}"
            </p>
          </div>
        )}

        {/* Exam Tip / Note */}
        {lookupData.tip && (
          <div className="flex items-start gap-1.5 text-[11px] text-amber-800 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>{lookupData.tip}</span>
          </div>
        )}

        {/* Choice Selection Action (When opened from a multiple choice option) */}
        {choiceContext && choiceContext.choiceLetter && (
          <div className="pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={handleSelectChoiceFromModal}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs md:text-sm flex items-center justify-center gap-2 transition shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>ตอบข้อนี้ทันที (เลือกข้อ {choiceContext.choiceLetter})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
