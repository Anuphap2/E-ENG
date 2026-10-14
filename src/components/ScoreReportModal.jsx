import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles,
  TrendingUp,
  Brain,
  Layers,
  Printer
} from 'lucide-react';

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
  const mistakesCount = totalQuestions - totalScore;

  let gradeLetter = 'A';
  let gradeColor = 'text-emerald-600 bg-emerald-50 border-emerald-300';
  let gradeText = 'ยอดเยี่ยมระดับเกียรตินิยม! มีความพร้อมในการสอบปลายภาคระดับสูงสุด';
  let badgeTitle = '🌟 Exceptional Master';

  if (percentage < 50) {
    gradeLetter = 'F';
    gradeColor = 'text-red-600 bg-red-50 border-red-300';
    gradeText = 'ยังไม่ผ่านเกณฑ์ขั้นต่ำ ควรศึกษาเฉลยและทบทวนเนื้อหาโดยด่วน';
    badgeTitle = '⚠️ Need Urgent Revision';
  } else if (percentage < 60) {
    gradeLetter = 'D';
    gradeColor = 'text-amber-600 bg-amber-50 border-amber-300';
    gradeText = 'ผ่านเกณฑ์ขั้นต่ำ ควรทบทวนจุดที่ตอบผิดเพื่อเพิ่มเกรดให้ปลอดภัย';
    badgeTitle = '📈 Basic Passing';
  } else if (percentage < 70) {
    gradeLetter = 'C';
    gradeColor = 'text-blue-600 bg-blue-50 border-blue-300';
    gradeText = 'ผ่านเกณฑ์ระดับมาตรฐาน ทำได้ดีในหลายส่วน เสริมความมั่นใจอีกนิด';
    badgeTitle = '👍 Competent Standard';
  } else if (percentage < 80) {
    gradeLetter = 'B';
    gradeColor = 'text-indigo-600 bg-indigo-50 border-indigo-300';
    gradeText = 'ผลการเรียนระดับดีมาก มีความเข้าใจโครงสร้างข้อสอบดีเยี่ยม';
    badgeTitle = '🎯 High Proficiency';
  }

  useEffect(() => {
    if (percentage >= 70) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });
    }
  }, [percentage]);

  const units = [
    { name: "Unit 5: Study Opps", score: unitScores['Unit 5'] || 0, total: 20, color: "bg-blue-600", desc: "บทสนทนา & มารยาทสังคม" },
    { name: "Unit 6: IELTS", score: unitScores['Unit 6'] || 0, total: 20, color: "bg-indigo-600", desc: "Academic Reading & Skim/Scan" },
    { name: "Unit 7: TOEFL", score: unitScores['Unit 7'] || 0, total: 20, color: "bg-purple-600", desc: "Structure, Inversion & Clauses" },
    { name: "Unit 8: TOEIC", score: unitScores['Unit 8'] || 0, total: 20, color: "bg-emerald-600", desc: "Business Memos, Invoices & Jobs" },
  ];

  // Identify strengths and weaknesses
  const sortedUnits = [...units].sort((a, b) => (b.score / b.total) - (a.score / a.total));
  const strongestUnit = sortedUnits[0];
  const weakestUnit = sortedUnits[sortedUnits.length - 1];

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-emerald-500 shadow-2xl space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 border-b border-slate-100 pb-6">
        <div className="text-center lg:text-left space-y-2 flex-grow">
          <div className="flex items-center gap-2 justify-center lg:justify-start flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ใบรายงานผลการสอบอย่างเป็นทางการ (Official Score Report)</span>
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${gradeColor}`}>
              {badgeTitle}
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            คะแนนสอบรวม: <span className="text-blue-600">{totalScore}</span> / {totalQuestions} ข้อ
          </h3>
          <p className="text-sm font-bold text-slate-700">
            เกรดประเมิน: <span className="text-base font-black text-blue-600">{gradeLetter}</span> ({percentage}%) — {gradeText}
          </p>
        </div>

        {/* Real Exam Weight Box */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 text-white p-5 px-7 rounded-3xl text-center shadow-lg min-w-[240px] border border-blue-400/20 shrink-0">
          <span className="text-[11px] text-blue-200 block uppercase font-bold tracking-wider">
            คะแนนสอบจริงตามสัดส่วน (25%)
          </span>
          <div className="text-4xl md:text-5xl font-black mt-1 text-amber-300 font-mono tracking-tight">
            {weightedScore}
          </div>
          <span className="text-xs text-blue-200 block mt-1">
            เต็ม 25.00 คะแนน (สัดส่วน 25% ของเกรด)
          </span>
        </div>
      </div>

      {/* 4 Units Performance Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>วิเคราะห์ผลคะแนนรายส่วน (Unit-by-Unit Performance Analysis):</span>
          </h4>
          <span className="text-xs text-slate-500 font-medium">เกณฑ์ข้อละ 0.3125 คะแนน</span>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {units.map((u, idx) => {
            const pct = Math.round((u.score / u.total) * 100);
            return (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 hover:bg-white hover:border-blue-300 transition shadow-2xs">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>{u.name}</span>
                  <span className="text-sm font-black text-slate-900">{u.score} / {u.total}</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className={`${u.color} h-full transition-all duration-700 rounded-full`} style={{ width: `${pct}%` }}></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{u.desc}</span>
                  <span className="font-bold text-slate-700">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnostic & Prescription Box */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl space-y-2 text-xs">
        <h5 className="font-black text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wide">
          <Brain className="w-4 h-4 text-blue-700" />
          <span>ผลการวินิจฉัยและคำแนะนำเฉพาะบุคคล (Diagnostic Prescription):</span>
        </h5>
        <div className="grid md:grid-cols-2 gap-3 text-slate-700">
          <div className="bg-white p-3 rounded-xl border border-emerald-200/80 shadow-2xs">
            <strong className="text-emerald-800 font-bold block mb-0.5">✅ จุดแข็งของคุณ (Strength):</strong>
            <span>
              คุณทำคะแนนได้ดีที่สุดใน <strong>{strongestUnit.name}</strong> ({Math.round((strongestUnit.score / strongestUnit.total) * 100)}%) รักษาความแม่นยำในจุดนี้ไว้!
            </span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-amber-200/80 shadow-2xs">
            <strong className="text-amber-800 font-bold block mb-0.5">💡 จุดที่ควรเร่งทบทวน (Focus Area):</strong>
            <span>
              ควรเปิดอ่านทบทวนสรุปและทำซ้ำใน <strong>{weakestUnit.name}</strong> ({Math.round((weakestUnit.score / weakestUnit.total) * 100)}%) เพื่อดึงคะแนนขึ้นสู่เกรด A
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-wrap gap-2.5 justify-end border-t border-slate-100">
        {mistakesCount > 0 && (
          <button
            onClick={onViewMistakes}
            className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 shadow-2xs"
          >
            <XCircle className="w-4 h-4 text-red-600" />
            <span>เจาะลึกเฉพาะข้อที่ตอบผิด ({mistakesCount} ข้อ)</span>
          </button>
        )}

        <button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-sm flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>ไล่ตรวจดูเฉลยทั้ง 80 ข้อพร้อมคำอธิบาย</span>
        </button>

        <button
          onClick={onReset}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>รีเซ็ตเพื่อสอบใหม่</span>
        </button>
      </div>
    </div>
  );
}
