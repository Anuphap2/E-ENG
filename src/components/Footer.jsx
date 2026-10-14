import React from 'react';
import { ArrowUp, Award } from 'lucide-react';

export default function Footer({ onGoToQuiz }) {
  return (
    <>
      {/* Sticky Bottom Bar */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-200 py-2.5 px-4 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">10700320 Final Exam (1/2026)</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 hidden sm:inline">80 Items (25%) Multiple Choices</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>บนสุด</span>
            </button>

            <button
              onClick={onGoToQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-1.5 rounded-lg transition flex items-center gap-1 shadow-sm"
            >
              <Award className="w-3.5 h-3.5" />
              <span>ทำข้อสอบ 80 ข้อ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 px-4 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-white text-sm">Course 10700320: English for Further Studies and Future Careers</p>
            <p className="text-slate-400 mt-0.5">Final Examination Preparation System (Semester 1/2026) • All 80 Practice Items & Explanations</p>
          </div>
          <div className="flex flex-wrap gap-4 text-slate-400 text-[11px]">
            <span>Unit 5: Study Opportunities (Q1–20)</span>
            <span>Unit 6: IELTS (Q21–40)</span>
            <span>Unit 7: TOEFL (Q41–60)</span>
            <span>Unit 8: TOEIC (Q61–80)</span>
          </div>
        </div>
      </footer>
    </>
  );
}
