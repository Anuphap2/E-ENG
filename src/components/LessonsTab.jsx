import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Briefcase, 
  ArrowRight, 
  Volume2, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  MessageSquare, 
  PenTool, 
  Headphones, 
  FileCode2, 
  Mail,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function LessonsTab({ onStartUnitQuiz, speakText, initialUnit = 'unit5' }) {
  const [selectedUnit, setSelectedUnit] = useState(initialUnit);

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

  return (
    <div className="space-y-6">
      {/* Course Unit Selector Sub-Nav */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="text-xs font-bold text-slate-500 mb-2 px-2 flex items-center justify-between">
          <span>เลือกบทเรียนที่ต้องการศึกษา (Units 5–8):</span>
          <span className="text-[11px] text-blue-600 font-semibold">สรุปกระชับ ตรงจุดข้อสอบ 100%</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {units.map((u) => {
            const Icon = u.icon;
            const isSelected = selectedUnit === u.id;
            return (
              <button
                key={u.id}
                onClick={() => setSelectedUnit(u.id)}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between space-y-1.5 ${
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
              <p className="text-xs text-slate-500 mt-1">ความพร้อมการศึกษาต่อ, ระดับปริญญาตรี-โท-เอก, ตำแหน่งวิชาการ, และกฎไวยากรณ์</p>
            </div>

            <button
              onClick={() => onStartUnitQuiz('Unit 5')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <span>ทำข้อสอบ Unit 5 (Q1–20)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3 Degree Levels Grid */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>ระดับการศึกษาและคุณวุฒิปริญญา (Degrees & Qualifications)</span>
            </h3>

            <div className="grid md:grid-cols-3 gap-4 text-xs">
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200/80 space-y-2">
                <div className="flex items-center justify-between font-bold text-blue-900 text-sm">
                  <span>1. Bachelor’s Degree (ป.ตรี)</span>
                  <span className="text-[10px] bg-blue-200/60 px-2 py-0.5 rounded-full">3–4 ปี</span>
                </div>
                <ul className="text-slate-700 space-y-1.5 leading-relaxed">
                  <li>• เป็นระดับ <strong>Undergraduate</strong> (วุฒิขั้นแรกหลังจบ ม.ปลาย)</li>
                  <li>• <strong>BA (Bachelor of Arts):</strong> มนุษยศาสตร์, สังคมศาสตร์, ภาษา, ศิลปะ</li>
                  <li>• <strong>BSc (Bachelor of Science):</strong> วิทย์, เทคโนโลยี, วิศวะ, คอมพิวเตอร์</li>
                  <li>• ตัวอย่าง: <em>"I want to pursue a bachelor’s degree in computer science."</em></li>
                </ul>
              </div>

              <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200/80 space-y-2">
                <div className="flex items-center justify-between font-bold text-indigo-900 text-sm">
                  <span>2. Master’s Degree (ป.โท)</span>
                  <span className="text-[10px] bg-indigo-200/60 px-2 py-0.5 rounded-full">1–3 ปี</span>
                </div>
                <ul className="text-slate-700 space-y-1.5 leading-relaxed">
                  <li>• ระดับ <strong>Postgraduate / Graduate</strong> (เรียนต่อหลังจบ ป.ตรี)</li>
                  <li>• ต้องส่ง Independent Study หรือวิทยานิพนธ์ (<strong>Thesis</strong>)</li>
                  <li>• เช่น <strong>MA</strong> (Master of Arts), <strong>MSc</strong> (Master of Science)</li>
                  <li>• ตัวอย่าง: <em>"She completed her master's degree in engineering."</em></li>
                </ul>
              </div>

              <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200/80 space-y-2">
                <div className="flex items-center justify-between font-bold text-purple-900 text-sm">
                  <span>3. PhD / Doctoral (ป.เอก)</span>
                  <span className="text-[10px] bg-purple-200/60 px-2 py-0.5 rounded-full">3.5–6 ปี</span>
                </div>
                <ul className="text-slate-700 space-y-1.5 leading-relaxed">
                  <li>• ระดับสูงสุดของ <strong>Postgraduate</strong> (เน้นการวิจัยค้นพบใหม่)</li>
                  <li>• ต้องส่ง <strong>Doctoral thesis หรือ Dissertation</strong></li>
                  <li>• ผู้สำเร็จการศึกษามีสิทธิ์ใช้คำนำหน้านามว่า <strong>Dr.</strong></li>
                  <li>• ตัวอย่าง: <em>"He earned a PhD in Mental Healthcare."</em></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Grammar & Academic Hierarchy */}
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 text-sm">
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
              <p className="text-xs text-slate-500 mt-1">สรุปครบ 4 ทักษะ: Reading (Marie Curie & Invention), Listening (BuildRight & 6 ตำแหน่ง), Speaking (Dharampur), Writing (Brick Process)</p>
            </div>

            <button
              onClick={() => onStartUnitQuiz('Unit 6')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <span>ทำข้อสอบ Unit 6 (Q21–40)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Reading Breakdown */}
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200 space-y-2">
              <strong className="text-indigo-900 font-bold text-sm block">1. The Life and Work of Marie Curie</strong>
              <ul className="text-slate-700 space-y-1.5 leading-relaxed">
                <li>• สตรีคนแรกที่ได้โนเบล และได้โนเบล 2 ครั้ง: ฟิสิกส์ 1903 (ร่วมกับสามี Pierre และ Becquerel) และเคมี 1911 (<strong>sole winner</strong> ได้คนเดียว)</li>
                <li>• วัยเด็กมีความจำเป็นเลิศ (<strong>prodigious memory</strong>) ได้เหรียญทองตอนอายุ 16</li>
                <li>• ทำงานเป็นครูเพื่อส่งเสียพี่สาว (Bronia) เรียนแพทย์ และต่อมาพี่สาวรักษาสัญญาช่วยส่งเสียให้ Marie เรียนที่ <strong>Sorbonne</strong></li>
                <li>• <em>TRUE/FALSE/NOT GIVEN:</em> สามีได้โนเบลทั้ง 2 ครั้ง = FALSE, สนใจวิทย์แต่เด็ก = NOT GIVEN</li>
              </ul>
            </div>

            <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200 space-y-2">
              <strong className="text-indigo-900 font-bold text-sm block">2. The Marvellous Invention (Language)</strong>
              <ul className="text-slate-700 space-y-1.5 leading-relaxed">
                <li>• ภาษาเป็นรากฐานของความสำเร็จมนุษย์เหนือสัตว์อื่น</li>
                <li>• เป็นระบบที่ประณีตสูง (<strong>sophisticated system</strong>) ใช้เสียงพื้นฐานเพียง 25–30 เสียงสร้างการแสดงออกไม่รู้จบ</li>
                <li>• <strong>Paradox (ความขัดแย้งในตัวเอง):</strong> เรายกย่องภาษาว่าเป็นสิ่งประดิษฐ์ยิ่งใหญ่ที่สุดของมนุษย์ แต่ความจริงไม่เคยมีใครจงใจประดิษฐ์ขึ้นมาเลย (never deliberately invented)</li>
              </ul>
            </div>
          </div>

          {/* Listening & 6 Jobs */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900 font-bold text-sm flex items-center gap-1.5">
                <Headphones className="w-4 h-4 text-indigo-600" />
                <span>6.2 Listening: BuildRight Recruitment & 6 Job Openings</span>
              </strong>
              <button
                onClick={() => speakText("Hello, everyone. My name is Alex Johnson and I’m a recruitment consultant at BuildRight Recruitment. We’re an agency that specializes in providing staff for the construction industry.", "en-GB")}
                className="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>ฟังเสียง Alex Johnson</span>
              </button>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Alex Johnson</strong> บรรยายว่าอาคารประหยัดพลังงาน (energy efficient materials) และกรีนเทคโนโลยีกำลังเป็นที่ต้องการสูงมาก รวมถึงการลงทุนโครงสร้างพื้นฐาน (infrastructure: roads, bridges, rail) ของรัฐบาล
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {jobs.map((job, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-indigo-950 font-bold">{job.title}</strong>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{job.type}</span>
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
                • <strong>Brick Making 7 ขั้นตอน:</strong> 1) ขุดดิน (clay) → 2) บดผ่าน metal grid & roller → 3) ผสมทราย+น้ำ → 4) ขึ้นรูปด้วย mold/cutter → 5) อบแห้ง 24–48 ชม. → 6) เผาในเตา kiln 200°C–1300°C พักห้องเย็น 2–3 วัน → 7) บรรจุจัดส่ง
              </p>
            </div>
          </div>
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
              <p className="text-xs text-slate-500 mt-1">สรุปเข้ม: Reading (ช่างฝีมือกับระบบโรงงาน), Listening (Work-Study กู้ยืมเรียน & Shakespeare), Speaking (ประติมากรรม & นิยามเครื่องมือ)</p>
            </div>

            <button
              onClick={() => onStartUnitQuiz('Unit 7')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <span>ทำข้อสอบ Unit 7 (Q41–60)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200 text-xs space-y-2">
            <strong className="text-purple-900 font-bold text-sm block">7.1 TOEFL Reading: Craftsmen vs Industrialization (Activity 29)</strong>
            <p className="text-slate-700 leading-relaxed">
              • <strong>ก่อนปี 1815:</strong> สินค้าทำมือโดยครูช่าง (master artisans), ช่างฝีมือ (journeymen) และเด็กฝึกงาน (apprentices) เน้นคุณภาพ ครูช่างดูแลทั้งวิชาชีพ การศึกษา และศีลธรรม (moral conduct)<br />
              • <strong>หลังปี 1815:</strong> โรงงานใช้เครื่องจักร เน้นความเร็วและผลผลิต คนงานสูญเสียอิสรภาพ ต้องเชื่อฟังเสียงระฆังโรงงาน (ding-dong of the bell) เหมือนเครื่องจักรมีชีวิต (living machines)<br />
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <span>ทำข้อสอบ Unit 8 (Q61–80)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Grammar Formulas */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-emerald-600" />
              <span>สูตรไวยากรณ์ออกสอบบ่อย TOEIC Part 5</span>
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {grammarRules.map((rule, idx) => (
                <div key={idx} className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/80 space-y-1">
                  <strong className="text-emerald-950 font-bold block">{rule.title}</strong>
                  <p className="font-mono text-[11px] bg-white/80 p-1.5 rounded-lg border border-emerald-200/60 text-emerald-900">
                    {rule.formula}
                  </p>
                  <p className="text-[11px] text-slate-600 italic font-inter pt-0.5">Ex: "{rule.ex}"</p>
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
        </div>
      )}
    </div>
  );
}
