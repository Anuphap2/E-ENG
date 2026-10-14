import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, XCircle, RotateCcw, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

export default function ScoreReportModal({ 
  totalScore, 
  totalQuestions, 
  unitScores, 
  onClose, 
  onViewMistakes, 
  onReset 
}) {
  const percentage = ((totalScore / totalQuestions) * 100).toFixed(1);
  const weightedScore = ((totalScore / totalQuestions) * 25).toFixed(2);

  let gradeLetter = 'A';
  let gradeColor = 'text-emerald-600';
  let gradeText = 'ยอดเยี่ยมมาก! มีความพร้อมในการสอบสูงสุด';

  if (percentage < 50) {
    gradeLetter = 'F';
    gradeColor = 'text-red-600';
    gradeText = 'ควรทบทวนเนื้อหาและฝึกทำโจทย์เพิ่มเติมอีกครั้ง';
  } else if (percentage < 60) {
    gradeLetter = 'D';
    gradeColor = 'text-amber-600';
    gradeText = 'ผ่านเกณฑ์ขั้นต่ำ ควรศึกษาเฉลยและจุดที่ตอบผิด';
  } else if (percentage < 70) {
    gradeLetter = 'C';
    gradeColor = 'text-blue-600';
    gradeText = 'ผ่านเกณฑ์ระดับมาตรฐาน ทำได้ดีในหลายส่วน';
  } else if (percentage < 80) {
    gradeLetter = 'B';
    gradeColor = 'text-indigo-600';
    gradeText = 'ผลการเรียนระดับดีมาก มีความเข้าใจโครงสร้างข้อสอบดี';
  }

  useEffect(() => {
    if (percentage >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [percentage]);

  const units = [
    { name: "Unit 5: Study Opps", score: unitScores['Unit 5'] || 0, total: 20, color: "bg-blue-600" },
    { name: "Unit 6: IELTS", score: unitScores['Unit 6'] || 0, total: 20, color: "bg-indigo-600" },
    { name: "Unit 7: TOEFL", score: unitScores['Unit 7'] || 0, total: 20, color: "bg-purple-600" },
    { name: "Unit 8: TOEIC", score: unitScores['Unit 8'] || 0, total: 20, color: "bg-emerald-600" },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border-2 border-emerald-500 shadow-xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="text-center md:text-left space-y-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ใบรายงานผลคะแนนสอบปลายภาค (Score Report)</span>
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900">
            คะแนนรวม: <span className="text-blue-600">{totalScore}</span> / {totalQuestions} ข้อ
          </h3>
          <p className={`text-sm font-bold ${gradeColor}`}>
            เกรดประเมิน: {gradeLetter} ({percentage}%) — {gradeText}
          </p>
        </div>

        {/* Real Exam Weight Box */}
        <div className="bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 text-white p-4 px-6 rounded-2xl text-center shadow-md min-w-[220px]">
          <span className="text-xs text-blue-200 block uppercase font-bold tracking-wider">
            คะแนนสอบจริงตามสัดส่วน (25%)
          </span>
          <div className="text-4xl font-black mt-0.5 text-amber-300">
            {weightedScore}
          </div>
          <span className="text-xs text-blue-200 block mt-0.5">
            / 25.00 คะแนนเต็ม
          </span>
        </div>
      </div>

      {/* 4 Units Performance Breakdown */}
      <div className="space-y-2">
        <h4 className="font-bold text-slate-900 text-sm">📊 วิเคราะห์คะแนนแยกตาม Unit (Unit Breakdown):</h4>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {units.map((u, idx) => {
            const pct = Math.round((u.score / u.total) * 100);
            return (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-slate-700">
                  <span>{u.name}</span>
                  <span className="font-bold text-slate-900">{u.score} / {u.total}</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className={`${u.color} h-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                </div>
                <div className="text-[10px] text-right text-slate-500 font-semibold">{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-wrap gap-2.5 justify-end border-t border-slate-100">
        <button
          onClick={onViewMistakes}
          className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5"
        >
          <XCircle className="w-4 h-4" />
          <span>ดูเฉพาะข้อที่ตอบผิด ({totalQuestions - totalScore} ข้อ)</span>
        </button>

        <button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition shadow-sm flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>ตรวจดูเฉลยทั้ง 80 ข้อ</span>
        </button>

        <button
          onClick={onReset}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>รีเซ็ตทำใหม่</span>
        </button>
      </div>
    </div>
  );
}
