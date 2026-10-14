import React, { useState } from 'react';
import { soundEffects } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Briefcase, 
  ArrowRight, 
  Volume2, 
  CheckCircle2, 
  XCircle,
  AlertCircle, 
  Building2, 
  MessageSquare, 
  PenTool, 
  Headphones, 
  FileCode2, 
  Mail,
  Sparkles,
  ChevronRight,
  Zap,
  Award
} from 'lucide-react';

const UNIT_CHECKPOINTS = {
  unit5: {
    q: 'วุฒิระดับ Associate Degree โดยทั่วไปต้องเรียนสะสมประมาณกี่หน่วยกิต (Credit Hours)?',
    choices: [
      '30 หน่วยกิต (1 ปี)',
      '60 หน่วยกิต (2 ปี)',
      '120 หน่วยกิต (4 ปี)',
      '180 หน่วยกิต (5 ปี)'
    ],
    answer: 1,
    explanation: 'วุฒิอนุปริญญา (Associate Degree) เรียนประมาณ 2 ปี สะสม 60 หน่วยกิต ส่วนปริญญาตรี (Bachelor’s Degree) เรียน 4 ปี สะสม 120 หน่วยกิต'
  },
  unit6: {
    q: 'Marie Curie และ Pierre Curie สกัดแร่ Pitchblende หลายตันจนค้นพบ 2 ธาตุกัมมันตรังสีใด?',
    choices: [
      'Uranium และ Plutonium',
      'Polonium และ Radium',
      'Radium และ Cobalt',
      'Thorium และ Lead'
    ],
    answer: 1,
    explanation: 'Marie Curie ค้นพบธาตุ Polonium (ตั้งชื่อเป็นเกียรติแก่โปแลนด์บ้านเกิด) และธาตุ Radium ในปี 1898'
  },
  unit7: {
    q: 'ตามบทความ Activity 29 คำว่า "disrupted" มีความหมายตรงกับคำใดมากที่สุด?',
    choices: [
      'improved greatly (พัฒนาขึ้น)',
      'upset or interrupted (ทำให้สะดุด/เสียระบบ)',
      'celebrated widely (เฉลิมฉลอง)',
      'delayed indefinitely (เลื่อนไม่มีกำหนด)'
    ],
    answer: 1,
    explanation: 'คำว่า disrupted ในบทความหมายถึง การทำให้วิถีชีวิตดั้งเดิมของช่างฝีมือสะดุดหรือพังทลายลง (upset or interrupted)'
  },
  unit8: {
    q: 'ตามกฎไวยากรณ์ TOEIC ข้อใดใช้คำเชื่อม "Despite" ได้ถูกต้องตามหลักแกรมม่า?',
    choices: [
      'Despite it was raining heavily, we went out.',
      'Despite the severe traffic delay, he arrived on time.',
      'Despite of the problem, they succeeded.',
      'Despite he worked hard, he was dismissed.'
    ],
    answer: 1,
    explanation: 'Despite ต้องตามหลังด้วย Noun Phrase เสมอ (ห้ามตามด้วยประโยค S+V และห้ามมี of) ข้อ 2 ตามด้วย "the severe traffic delay" จึงถูกต้องสมบูรณ์'
  }
};

export default function LessonsTab({ 
  onStartUnitQuiz, 
  speakText, 
  initialUnit = 'unit5',
  soundEnabled = true,
  onAddXp
}) {
  const [selectedUnit, setSelectedUnit] = useState(initialUnit);
  const [checkpointAnswers, setCheckpointAnswers] = useState({});

  React.useEffect(() => {
    if (initialUnit) {
      setSelectedUnit(initialUnit);
    }
  }, [initialUnit]);

  const units = [
    { id: 'unit5', label: 'Unit 5: Study Opportunities', icon: GraduationCap, color: 'blue', questions: 'Q1–Q20 (20 ข้อ)' },
    { id: 'unit6', label: 'Unit 6: IELTS Masterclass', icon: BookOpen, color: 'indigo', questions: 'Q21–Q40 (20 ข้อ)' },
    { id: 'unit7', label: 'Unit 7: TOEFL Masterclass', icon: ShieldCheck, color: 'purple', questions: 'Q41–Q60 (20 ข้อ)' },
    { id: 'unit8', label: 'Unit 8: TOEIC Masterclass', icon: Briefcase, color: 'emerald', questions: 'Q61–Q80 (20 ข้อ)' },
  ];

  const jobs = [
    { title: "1. Site Manager", type: "Permanent", req: "Large global org, travel to international sites, very high salary" },
    { title: "2. Building Laborers", type: "Entry-level", req: "No formal qualifications, previous employer references vouching for work ethic" },
    { title: "3. Safety Manager", type: "Part-time (3 days/wk)", req: "Workplace safety background, enforce site safety measures" },
    { title: "4. Carpenter", type: "Temporary (fixed end date)", req: "Remote location, dorms provided on site, Certificate 3 in carpentry" },
    { title: "5. Heavy Machinery Operator", type: "Full-time", req: "Strong mechanical knowledge, at least 2 years prior experience" },
    { title: "6. Purchasing Coordinator", type: "Full-time", req: "Lively culture, degree in business administration / finance" },
  ];

  const grammarRules = [
    { title: "1. Despite vs Although", formula: "Despite + Noun Phrase | Although + S + V", ex: "Despite the unexpected delay, the team finished before the deadline." },
    { title: "2. Since + Present Perfect", formula: "S + has/have + V.3 + since + Past Simple", ex: "Ms. Singha has worked here since she graduated from Maejo University." },
    { title: "3. Noun Collocation", formula: "Noun ขยาย Noun เช่น application form", ex: "All applicants must submit a completed application form by 5:00 PM." },
    { title: "4. Adverb Placement (-ly)", formula: "Verb + Adverb หรือ Adverb + Adjective", ex: "The enterprise has grown rapidly throughout Southeast Asia." },
    { title: "5. Neither A nor B", formula: "กริยาผันตามประธาน B (ตัวหลัง)", ex: "Neither the supervisor nor the engineers were willing to sign." },
    { title: "6. Third Conditional", formula: "If + had + V.3, S + would have + V.3", ex: "If they had dispatched the parts, the issue would have been resolved." },
  ];

  const handleAnswerCheckpoint = (unitKey, choiceIdx) => {
    if (checkpointAnswers[unitKey] !== undefined) return;
    const cp = UNIT_CHECKPOINTS[unitKey];
    setCheckpointAnswers(prev => ({ ...prev, [unitKey]: choiceIdx }));

    if (choiceIdx === cp.answer) {
      soundEffects.playCorrect(soundEnabled);
      if (onAddXp) onAddXp(25, `ตอบถูกในแบบทดสอบสรุป ${unitKey.toUpperCase()}`);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      soundEffects.playWrong(soundEnabled);
    }
  };

  const renderCheckpoint = (unitKey, targetQuizUnit) => {
    const cp = UNIT_CHECKPOINTS[unitKey];
    const userAns = checkpointAnswers[unitKey];
    const isAns = userAns !== undefined;
    const isCor = isAns && userAns === cp.answer;

    return (
      <div className="bg-slate-50 p-5 rounded-2xl border-2 border-dashed border-blue-300 space-y-3.5 mt-5">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-400 text-slate-950 font-black">
              <Zap className="w-3.5 h-3.5 fill-current" />
            </span>
            <strong className="text-xs font-black text-slate-900">
              ⚡ เช็คความเข้าใจประจำบทเรียน (Quick Checkpoint)
            </strong>
          </div>
          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            +25 XP
          </span>
        </div>

        <p className="text-xs font-bold text-slate-800 leading-snug">
          {cp.q}
        </p>

        <div className="grid sm:grid-cols-2 gap-2 text-xs">
          {cp.choices.map((c, idx) => {
            const isSelected = userAns === idx;
            const showCorrect = isAns && idx === cp.answer;
            const showWrong = isAns && isSelected && idx !== cp.answer;

            return (
              <button
                key={idx}
                onClick={() => handleAnswerCheckpoint(unitKey, idx)}
                disabled={isAns}
                className={`p-3 rounded-xl border text-left font-semibold transition flex items-start gap-2 ${
                  showCorrect
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-500 font-bold ring-1 ring-emerald-300'
                    : showWrong
                      ? 'bg-rose-50 text-rose-950 border-rose-500 font-bold'
                      : isSelected
                        ? 'bg-blue-50 text-blue-900 border-blue-400'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border ${
                  showCorrect
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : showWrong
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="pt-0.5 leading-snug">{c}</span>
              </button>
            );
          })}
        </div>

        {isAns && (
          <div className={`p-3 rounded-xl text-xs space-y-1 animate-fadeIn border ${
            isCor ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-center gap-1 font-bold">
              {isCor ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
              <span>{isCor ? 'ยอดเยี่ยม! ตอบถูกต้อง (+25 XP)' : `ยังไม่ถูก คำตอบที่ถูกคือข้อ ${String.fromCharCode(65 + cp.answer)}`}</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-sarabun">
              <strong>คำอธิบาย:</strong> {cp.explanation}
            </p>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => onStartUnitQuiz(targetQuizUnit)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-xs"
          >
            <span>ทำข้อสอบจำลอง {targetQuizUnit} (20 ข้อ)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Course Unit Selector Sub-Nav */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="text-xs font-bold text-slate-500 mb-2 px-2 flex items-center justify-between">
          <span>เลือกบทเรียนที่ต้องการศึกษา (Units 5–8):</span>
          <span className="text-[11px] text-blue-600 font-semibold">สรุปกระชับ ตรงจุดข้อสอบ 100%</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {units.map((u) => {
            const Icon = u.icon;
            const isSelected = selectedUnit === u.id;
            return (
              <button
                key={u.id}
                onClick={() => setSelectedUnit(u.id)}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between space-y-1.5 ${
                  isSelected 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md font-bold' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-700'
                  }`}>
                    {u.questions}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-bold leading-tight">{u.label}</h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* UNIT 5 CONTENT */}
      {selectedUnit === 'unit5' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">UNIT 5 STUDY GUIDE</span>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                <span>Unit 5: Study Opportunities (แนวข้อสอบ ข้อ 1–20)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">สรุประดับปริญญา, การเขียนตัวพิมพ์เล็ก-ใหญ่, ตำแหน่งอาจารย์ และเกณฑ์ค่าธรรมเนียม</p>
            </div>
            <button
              onClick={() => onStartUnitQuiz('Unit 5')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition self-start sm:self-auto shadow-xs"
            >
              <span>ทำข้อสอบ Unit 5</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 Degree Levels Comparison Grid */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>1. ลำดับขั้นของปริญญาในระบบอุดมศึกษา (Degree Levels Hierarchy)</span>
            </h3>
            <div className="grid md:grid-cols-4 gap-3 text-xs">
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-2">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">ระดับที่ 1</span>
                <h4 className="font-bold text-blue-950 text-sm">Associate Degree</h4>
                <p className="text-slate-600 leading-relaxed">• อนุปริญญา / ปวส.<br />• ระยะเวลา 2 ปี<br />• สะสมประมาณ <strong>60 หน่วยกิต</strong></p>
              </div>

              <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200 space-y-2">
                <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">ระดับที่ 2</span>
                <h4 className="font-bold text-indigo-950 text-sm">Bachelor's Degree</h4>
                <p className="text-slate-600 leading-relaxed">• ปริญญาตรี (Undergraduate)<br />• ระยะเวลา 4 ปี<br />• สะสมประมาณ <strong>120 หน่วยกิต</strong></p>
              </div>

              <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 space-y-2">
                <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">ระดับที่ 3</span>
                <h4 className="font-bold text-purple-950 text-sm">Master's Degree</h4>
                <p className="text-slate-600 leading-relaxed">• ปริญญาโท (Graduate)<br />• ระยะเวลา 1–2 ปี<br />• เน้นการวิจัยเฉพาะทาง (Thesis)</p>
              </div>

              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
                <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">ระดับสูงสุด</span>
                <h4 className="font-bold text-amber-950 text-sm">Doctoral (Ph.D.)</h4>
                <p className="text-slate-600 leading-relaxed">• ปริญญาเอก (Terminal degree)<br />• ระยะเวลา 3–5 ปี<br />• ทำดุษฎีนิพนธ์ (Dissertation)</p>
              </div>
            </div>
          </div>

          {/* Grammar & Terminology Cards */}
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-300 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-950 text-sm">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>จุดเน้นข้อสอบ: กฎตัวพิมพ์เล็ก-พิมพ์ใหญ่ (Capitalization Rule)</span>
              </div>
              <div className="text-slate-700 space-y-1.5 leading-relaxed">
                <p>
                  • คำว่า <strong>bachelor's degree</strong> และ <strong>master's degree</strong> ต้องเขียนด้วย <strong>ตัวพิมพ์เล็ก (lowercase)</strong> เสมอ เพราะถือเป็นคำนามทั่วไป (common noun)
                </p>
                <div className="bg-white/80 p-2 rounded-xl border border-amber-200/60 font-mono text-[11px]">
                  ✅ ถูก: "I completed my <strong className="text-emerald-700">bachelor's degree</strong> in biology."<br />
                  ❌ ผิด: "I completed my <strong className="text-red-600">Bachelor's Degree</strong> in biology."
                </div>
                <p>
                  • จะใช้ตัวพิมพ์ใหญ่ (Capitalize) เมื่อเป็น <strong>ชื่อเฉพาะของหลักสูตรเต็ม</strong> เช่น "She is enrolled in the <strong>Master of Science</strong> program."
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-300 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>ตำแหน่งทางวิชาการ & มหาวิทยาลัย (Academic Terminology)</span>
              </div>
              <div className="text-slate-700 space-y-1.5 leading-relaxed">
                <p>• <strong>Double Degree:</strong> การได้ 2 ปริญญาในการสมัครเรียนครั้งเดียว (2 degrees in 1 enrolment)</p>
                <p>• <strong>ความหมายของ Faculty:</strong> มี 2 ความหมาย 1) คณะวิชา (Department/Division) 2) คณาจารย์ผู้สอนทั้งหมด (Academic staff)</p>
                <p>• <strong>Professor (US vs UK):</strong> ใน US เรียกอาจารย์มหาวิทยาลัยทุกคนว่า Professor แต่ใน UK อาจารย์ทั่วไปเรียก <strong>Lecturer</strong> และสงวนคำว่า <strong>Professor</strong> สำหรับตำแหน่งสูงสุด</p>
                <p>• <strong>ลำดับตำแหน่ง:</strong> Assistant Professor (ผศ.) → Associate Professor (รศ.) → Professor (ศ.)</p>
              </div>
            </div>
          </div>

          {/* Unit 5 Checkpoint */}
          {renderCheckpoint('unit5', 'Unit 5')}
        </div>
      )}

      {/* UNIT 6 CONTENT */}
      {selectedUnit === 'unit6' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">UNIT 6 STUDY GUIDE</span>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-600" />
                <span>Unit 6: English Proficiency Test: IELTS (แนวข้อสอบ ข้อ 21–40)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">สรุปประวัติ Marie Curie, 6 ตำแหน่งงานก่อสร้าง, และคำศัพท์สำคัญในพาร์ทต่างๆ</p>
            </div>
            <button
              onClick={() => onStartUnitQuiz('Unit 6')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition self-start sm:self-auto shadow-xs"
            >
              <span>ทำข้อสอบ Unit 6</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Marie Curie Breakdown Box */}
          <div className="bg-indigo-50/60 p-5 rounded-2xl border border-indigo-200 space-y-3">
            <h3 className="font-bold text-indigo-950 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>6.1 เจาะลึกบทความประวัติ Marie Curie (หัวใจของ Reading ข้อ 21–25)</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-indigo-100 space-y-1.5">
                <strong className="text-indigo-900 font-bold block">1. ชีวิตช่วงต้น & การต่อสู้</strong>
                <p className="text-slate-600 leading-relaxed">
                  เกิดที่วอร์ซอ โปแลนด์ ผู้หญิงถูกห้ามเรียนมหาวิทยาลัย จึงแอบเรียนที่ <strong>Floating University</strong> ลับๆ และทำงานเป็นครูพี่เลี้ยง (governess) ส่งพี่สาวเรียนแพทย์ก่อน
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-indigo-100 space-y-1.5">
                <strong className="text-indigo-900 font-bold block">2. การศึกษา & การค้นพบ</strong>
                <p className="text-slate-600 leading-relaxed">
                  จบเกียรตินิยมอันดับ 1 ฟิสิกส์ ม.ซอร์บอนน์ สกัดแร่ pitchblende หลายตัน จนค้นพบ 2 ธาตุใหม่คือ <strong>Polonium</strong> (ตั้งชื่อตามโปแลนด์) และ <strong>Radium</strong>
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-indigo-100 space-y-1.5">
                <strong className="text-indigo-900 font-bold block">3. เกียรติยศ & การอุทิศตน</strong>
                <p className="text-slate-600 leading-relaxed">
                  ได้รางวัลโนเบล 2 ครั้ง (ฟิสิกส์ 1903 ร่วมกับสามี, เคมี 1911 เดี่ยว) ในสงครามโลกครั้งที่ 1 อุทิศรถเอกซเรย์ <strong>Petite Curies</strong> ช่วยทหารกว่าล้านคน
                </p>
              </div>
            </div>
          </div>

          {/* 6 Construction Jobs Breakdown */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>6.2 ตารางสรุป 6 ตำแหน่งงาน BuildRight Recruitment (Listening ข้อ 26–30)</span>
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {jobs.map((job, idx) => (
                <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{job.title}</span>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {job.type}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{job.req}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Speaking & Writing */}
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 font-bold text-sm flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>6.3 IELTS Speaking: Visiting a Village</span>
              </strong>
              <p className="text-slate-700 leading-relaxed">
                • <strong>Cue Card:</strong> ไปเยือนหมู่บ้าน Dharampur ซุกตัวอยู่ในเทือกเขา Aravalli หลีกหนีความเร่งรีบ (<strong>hustle and bustle</strong>)<br />
                • ช่วยลุง Dr. John Simpson กรอกแบบฟอร์มให้ชาวบ้านที่ไม่รู้หนังสือในโครงการฉีดวัคซีนไข้ทรพิษ ได้บทเรียนเรื่อง <strong>selfless service</strong> (การบริการชุมชนโดยไม่หวังผล)
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 font-bold text-sm flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-indigo-600" />
                <span>6.4 IELTS Writing: Brick Process & Task 2</span>
              </strong>
              <p className="text-slate-700 leading-relaxed">
                • <strong>Task 1 กระบวนการทำอิฐ:</strong> ขุดดินเหนียว (Clay digger) → ผ่านตะแกรง (Metal grid) → ผสมทรายและน้ำ → ใส่แม่พิมพ์หรือใช้ลวดตัด (Wire cutter) → อบแห้ง 24–48 ชม. → เผาในเตา Kiln (ร้อนปานกลางถึงร้อนจัด) → เข้าห้องหล่อเย็น (Cooling chamber) → บรรจุและจัดส่ง
              </p>
            </div>
          </div>

          {/* Unit 6 Checkpoint */}
          {renderCheckpoint('unit6', 'Unit 6')}
        </div>
      )}

      {/* UNIT 7 CONTENT */}
      {selectedUnit === 'unit7' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">UNIT 7 STUDY GUIDE</span>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-purple-600" />
                <span>Unit 7: English Proficiency Test: TOEFL (แนวข้อสอบ ข้อ 41–60)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">สรุปบทความช่างฝีมือ vs เครื่องจักร, โครงการ Work-Study, และข้อสอบนิยามเครื่องมือของสัตว์</p>
            </div>
            <button
              onClick={() => onStartUnitQuiz('Unit 7')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition self-start sm:self-auto shadow-xs"
            >
              <span>ทำข้อสอบ Unit 7</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reading Summary: Artisans to Industrialization */}
          <div className="bg-purple-50/70 p-5 rounded-2xl border border-purple-200 space-y-3">
            <h3 className="font-bold text-purple-950 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>7.1 Reading Activity 29: From Artisans to Industrial Workers</span>
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              • <strong>ยุคก่อนอุตสาหกรรม (Pre-industrial):</strong> ช่างฝีมือ (Artisans) ผลิตสินค้าชิ้นเอกตั้งแต่ต้นจนจบ มีความภาคภูมิใจ มีอิสระในการกำหนดเวลาทำงาน<br />
              • <strong>ยุคอุตสาหกรรม (Industrialization):</strong> โรงงานนำเครื่องจักรไอน้ำมาใช้ แบ่งงานออกเป็นขั้นตอนซอยย่อย (Division of labor) แรงงานกลายเป็นผู้คุมเครื่องจักรที่ทำงานซ้ำซาก ขาดความอิสระ สูญเสีย <strong>pride of craftsmanship</strong> และถูกเปรียบเปรยว่าเป็น "Living Machines"<br />
              • <strong>คำศัพท์ออกบ่อย:</strong> <strong>disrupted</strong> = <em>upset / interrupted</em> (ทำให้ระบบสะดุดหรือเสียระเบียบ)
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 font-bold text-sm block">7.2 Listening: Student Loans & Shakespeare TA</strong>
              <p className="text-slate-700 leading-relaxed">
                • <strong>Work-Study:</strong> นักศึกษาปี 1 อยากทำ 20 ชม./สัปดาห์เพื่อหาเงินผ่อนหนี้เรียน (student loans) แต่อาจารย์เตือนว่าอาจเกรดตกจนหลุดทุน (lose scholarship) จึงให้ทำ 10 ชม. ก่อน<br />
                • <strong>Shakespeare TA John:</strong> นักศึกษาปีสองกังวลเรื่องงานอ่านวิชาเชกสเปียร์ John แนะนำให้ลงเรียนก่อนแล้วลอง 2 สัปดาห์ หากหนักเกินไปค่อยดรอป (drop the class)
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 font-bold text-sm block">7.3 Speaking: Sculpture Cancellation & Animal Tools</strong>
              <p className="text-slate-700 leading-relaxed">
                • <strong>ยกเลิกประติมากรรม:</strong> มหาวิทยาลัยอ้างเด็กไม่สนใจ แต่นักศึกษาชี้แจงว่าวิชาบังคับวาดรูปกินเวลาหมด เสนอให้จ้างอาจารย์พาร์ตไทม์แทน<br />
                • <strong>นิยามเครื่องมือสัตว์:</strong> <em>Narrow definition (นิยามแคบ)</em> = ต้องดัดแปลงรูปทรง (ชิมแปนซีเหลากิ่งไม้) / <em>Broad definition (นิยามกว้าง)</em> = วัตถุใดๆ ที่ใช้ทำงานโดยไม่ต้องดัดแปลง (ช้างหยิบกิ่งไม้เกาหลัง)
              </p>
            </div>
          </div>

          {/* Unit 7 Checkpoint */}
          {renderCheckpoint('unit7', 'Unit 7')}
        </div>
      )}

      {/* UNIT 8 CONTENT */}
      {selectedUnit === 'unit8' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">UNIT 8 STUDY GUIDE</span>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-emerald-600" />
                <span>Unit 8: English Proficiency Test: TOEIC (แนวข้อสอบ ข้อ 61–80)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">สรุปเข้มไวยากรณ์ยอดฮิต Part 5, คำศัพท์ธุรกิจ, และตัวย่อในอีเมลการทำงาน</p>
            </div>
            <button
              onClick={() => onStartUnitQuiz('Unit 8')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition self-start sm:self-auto shadow-xs"
            >
              <span>ทำข้อสอบ Unit 8</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 6 Essential Grammar Formulas */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>8.1 สูตรไวยากรณ์ออกสอบบ่อยที่สุด 6 กฎหลัก (TOEIC Grammar Hacks)</span>
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {grammarRules.map((rule, idx) => (
                <div key={idx} className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-1.5">
                  <h4 className="font-bold text-emerald-950 text-sm">{rule.title}</h4>
                  <div className="bg-white/80 p-2 rounded-xl border border-emerald-300 font-mono text-[11px] text-emerald-900 font-semibold">
                    {rule.formula}
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed italic">
                    Ex: "{rule.ex}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Vocab & Acronyms */}
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 font-bold text-sm block">คำศัพท์ธุรกิจสำคัญ (Business Vocabulary)</strong>
              <ul className="text-slate-700 space-y-1.5 leading-relaxed">
                <li>• <strong>complimentary (adj.):</strong> ฟรี, ให้เป็นอภินันทนาการ (complimentary room upgrade / breakfast)</li>
                <li>• <strong>reimbursement (n.):</strong> การเบิกจ่ายเงินคืนสำหรับค่าใช้จ่ายที่จ่ายไปก่อน (expense reimbursement)</li>
                <li>• <strong>mandatory (adj.):</strong> บังคับ, จำเป็นต้องทำตามกฎ (compulsory)</li>
                <li>• <strong>itinerary (n.):</strong> กำหนดการเดินทางอย่างละเอียด</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 font-bold text-sm block">ตัวย่อในอีเมลการทำงาน (Workplace Acronyms)</strong>
              <ul className="text-slate-700 space-y-1.5 leading-relaxed">
                <li>• <strong>EOD:</strong> End of the Day (สิ้นสุดวันทำการ / ก่อนเวลาเลิกงาน)</li>
                <li>• <strong>ASAP:</strong> As Soon As Possible (เร็วที่สุดเท่าที่จะทำได้)</li>
                <li>• <strong>FYI:</strong> For Your Information (แจ้งเพื่อทราบ)</li>
                <li>• <strong>ETA:</strong> Estimated Time of Arrival (เวลาที่จะมาถึงโดยประมาณ)</li>
                <li>• <strong>CC vs BCC:</strong> CC ทุกคนเห็นอีเมลกัน / BCC ซ่อนอีเมลผู้รับเพื่อความเป็นส่วนตัว</li>
              </ul>
            </div>
          </div>

          {/* Unit 8 Checkpoint */}
          {renderCheckpoint('unit8', 'Unit 8')}
        </div>
      )}
    </div>
  );
}
