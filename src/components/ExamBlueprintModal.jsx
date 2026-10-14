import React from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  Award, 
  Sparkles, 
  ArrowRight, 
  Target, 
  Layers, 
  X,
  FileText
} from 'lucide-react';

export default function ExamBlueprintModal({ isOpen, onClose, onJumpToUnit }) {
  if (!isOpen) return null;

  const sections = [
    {
      unit: 'Unit 5',
      title: 'Study Opportunities & Social English',
      questions: 'ข้อ 1 – 20 (20 ข้อ)',
      weight: '6.25 คะแนน (25% ของข้อสอบ)',
      theme: 'from-blue-600 to-cyan-700',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      topics: [
        'Greetings & Professional Introductions',
        'Small Talk & Conversation Starters',
        'Academic Advising & University Inquiries',
        'Business Telephoning & Leaving Messages',
        'Dining Etiquette & Table Manners'
      ],
      examTips: 'เน้นบทสนทนาสถานการณ์จริง สังเกตความสุภาพ (Politeness) และรูปแบบคำพูดตอบรับที่เหมาะสม'
    },
    {
      unit: 'Unit 6',
      title: 'IELTS Examination Preparation',
      questions: 'ข้อ 21 – 40 (20 ข้อ)',
      weight: '6.25 คะแนน (25% ของข้อสอบ)',
      theme: 'from-indigo-600 to-blue-800',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      topics: [
        'IELTS Test Overview (4 Skills, Band 0-9.0)',
        'Academic Reading: Skimming for Main Ideas',
        'Academic Reading: Scanning for Specific Details',
        'True / False / Not Given Logic & traps',
        'Listening Strategies: Form & Note Completion'
      ],
      examTips: 'สังเกตความแตกต่างระหว่าง False (ขัดแย้งกับบทความโดยตรง) กับ Not Given (บทความไม่ได้กล่าวถึง)'
    },
    {
      unit: 'Unit 7',
      title: 'TOEFL Examination Preparation',
      questions: 'ข้อ 41 – 60 (20 ข้อ)',
      weight: '6.25 คะแนน (25% ของข้อสอบ)',
      theme: 'from-purple-600 to-indigo-800',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      topics: [
        'TOEFL iBT vs ITP Structure & Scoring',
        'Sentence Structure & Clause Connectors',
        'Inversion after Negative Adverbials (Rarely, Never...)',
        'Cause & Effect Markers (Due to, Because, Consequently)',
        'Passive Voice & Complex Academic Vocabulary'
      ],
      examTips: 'เน้นแม่นยำเรื่อง Subject-Verb Agreement, คำเชื่อม Clauses และไวยากรณ์ขั้นสูงแบบ Academic'
    },
    {
      unit: 'Unit 8',
      title: 'TOEIC Examination Preparation',
      questions: 'ข้อ 61 – 80 (20 ข้อ)',
      weight: '6.25 คะแนน (25% ของข้อสอบ)',
      theme: 'from-emerald-600 to-teal-800',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      topics: [
        'TOEIC L&R Overview (200 ข้อ 990 คะแนน)',
        'Business Correspondence: Emails, Memos & Letters',
        'Workplace Schedules, Flights, Invoices & Orders',
        'Job Announcements, Interviews & Qualifications',
        'Business Phrasal Verbs & Office Jargon'
      ],
      examTips: 'เน้นคำศัพท์บริบทสำนักงาน การอ่านประกาศด่วน จดหมายเวียน และการอนุมานข้อมูลจากตารางเวลา'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-5 md:p-6 flex items-start justify-between relative shrink-0">
          <div className="space-y-1.5 pr-8">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-blue-500/30 text-blue-300 border border-blue-400/30 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                10700320 English for Further Studies
              </span>
              <span className="bg-amber-400 text-slate-950 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-current" />
                <span>Final Exam Blueprint</span>
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              ผังโครงสร้างข้อสอบปลายภาค 80 ข้อ (Exam Blueprint)
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              สัดส่วนคะแนนเก็บจริง 25 คะแนน (25% ของเกรดปลายภาค) แบ่งออกเป็น 4 ตอนเท่าๆ กัน ตอนละ 20 ข้อ (6.25 คะแนน)
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 4 Unit Blueprint Cards */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {sections.map((sec, idx) => (
              <div 
                key={idx}
                className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-4 md:p-5 transition-all shadow-xs hover:shadow-md space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${sec.badgeColor}`}>
                      {sec.unit}
                    </span>
                    <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                      {sec.weight}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 leading-snug">
                    {sec.title}
                  </h3>

                  <div className="text-xs text-blue-700 font-semibold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>ขอบเขต: {sec.questions}</span>
                  </div>

                  {/* Topic checklist */}
                  <div className="space-y-1.5 pt-1">
                    <strong className="text-[11px] uppercase tracking-wider text-slate-400 block font-bold">
                      หัวข้อสำคัญที่ออกสอบ:
                    </strong>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {sec.topics.map((t, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exam Tip */}
                  <div className="p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                    💡 <strong>คำแนะนำพิชิตคะแนน:</strong> {sec.examTips}
                  </div>
                </div>

                {/* Jump Button */}
                <button
                  onClick={() => {
                    onClose();
                    if (onJumpToUnit) onJumpToUnit(sec.unit);
                  }}
                  className="w-full mt-2 bg-white hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-300 hover:border-blue-600 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <span>กระโดดไปทำข้อสอบส่วนนี้ทันที ({sec.unit})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Exam Summary Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 text-xs text-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-slate-900 text-sm">
                🎯 เกณฑ์คะแนนตัดเกรดปลายภาค (Final Grade Scale):
              </h4>
              <p className="text-slate-600">
                คะแนนรวม 25.00 คะแนน คิดจาก 80 ข้อ (ข้อละ 0.3125 คะแนนจริง) • ตอบถูก ≥64 ข้อ ได้เกรด A
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs shrink-0 transition shadow-xs"
            >
              เข้าใจแล้ว เริ่มฝึกทำข้อสอบ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
