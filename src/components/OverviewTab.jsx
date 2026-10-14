import React, { useState } from 'react';
import { testMatrixData } from '../data/testMatrix';
import { 
  Award, 
  BookOpen, 
  Calendar, 
  Clock, 
  ExternalLink, 
  GraduationCap, 
  Search, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Globe,
  Headphones,
  Bookmark,
  CheckCircle2,
  Check
} from 'lucide-react';

export default function OverviewTab({ onSelectUnit, onStartFullExam, onNavigateTab }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredTests = testMatrixData.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.administrator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.highlights.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'international') {
      return matchesSearch && ['IELTS', 'TOEFL iBT', 'TOEFL ITP', 'TOEIC (L&R)', 'TOEIC (S&W)', 'DET', 'PTE Academic'].includes(test.name);
    }
    if (selectedFilter === 'domestic') {
      return matchesSearch && ['CU-TEP', 'TU-GET'].includes(test.name);
    }
    return matchesSearch;
  });

  const steps = [
    {
      step: '01',
      title: 'สรุปบทเรียน 4 หน่วย',
      desc: 'ศึกษาเนื้อหาสำคัญ Unit 5-8, โครงสร้างปริญญา, ประวัติ Marie Curie, บทความช่างฝีมือ และสูตรไวยากรณ์ TOEIC',
      actionText: 'เข้าสู่บทเรียน',
      tabId: 'lessons',
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/80'
    },
    {
      step: '02',
      title: 'ฝึกการฟัง Listening Lab',
      desc: 'ฟังเสียงจำลองสำเนียง US/UK ทั้ง 11 แทร็ก ปรับความเร็ว 0.85x-1.2x พร้อมดูสคริปต์คำพูดเฉลย',
      actionText: 'เปิดห้องฟังเสียง',
      tabId: 'listeningLab',
      icon: Headphones,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100/80'
    },
    {
      step: '03',
      title: 'ท่องศัพท์ Flashcards',
      desc: 'ทบทวน 160 คำศัพท์ออกสอบบ่อย พลิกการ์ดจำความหมายภาษาไทยและฟังการออกเสียงที่ถูกต้อง',
      actionText: 'ท่องคำศัพท์',
      tabId: 'vocab',
      icon: Bookmark,
      color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100/80'
    },
    {
      step: '04',
      title: 'ห้องสอบจำลอง 80 ข้อ',
      desc: 'ทำข้อสอบจำลอง Focus Mode ทีละข้อ มีเฉลยภาษาไทยละเอียดและเทคนิคจำ หรือจำลองสอบจริง 90 นาที',
      actionText: 'เริ่มทำข้อสอบ',
      tabId: 'quiz',
      icon: Award,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80',
      highlight: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>แนวทางข้อสอบปลายภาค 1/2026 (Final Exam)</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
            10700320: English for Further Studies and Future Careers
          </h2>

          <p className="text-sm md:text-base text-blue-100 leading-relaxed font-light">
            ข้อสอบปลายภาคมีจำนวนทั้งหมด <strong>80 ข้อ (คิดเป็น 25% ของคะแนนรวมทั้งภาคเรียน)</strong> เป็นแบบเลือกตอบ Multiple Choices 
            เนื้อหาครอบคลุม 4 หน่วยการเรียนรู้หลัก เว็บไซต์นี้ออกแบบมาเพื่อให้ผู้เรียนสามารถเรียนรู้ได้อย่างเป็นระบบ มีสมาธิ และเข้าใจลึกซึ้ง
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onStartFullExam}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>เริ่มทำข้อสอบจำลอง 80 ข้อ (Exam Mode)</span>
            </button>
            <button
              onClick={() => onSelectUnit('unit5')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 py-3 rounded-xl text-sm transition flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>เข้าสู่สรุปบทเรียน 4 หน่วย</span>
            </button>
          </div>
        </div>

        {/* Background Decorative Rings */}
        <div className="absolute right-[-10%] top-[-20%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-[10%] bottom-[-30%] w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* 4-Step Guided Learning Pathway */}
      <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black">
                ★
              </span>
              <span>เส้นทางการเรียนรู้ 4 ขั้นตอน (Recommended Study Path)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ศึกษาตามลำดับเพื่อความเข้าใจที่แม่นยำและเพิ่มโอกาสคว้าคะแนนเต็ม 25%
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3 hover:shadow-sm transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-400 font-mono">
                      STEP {st.step}
                    </span>
                    <span className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{st.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                </div>

                <button
                  onClick={() => {
                    if (onNavigateTab) onNavigateTab(st.tabId);
                  }}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${st.color}`}
                >
                  <span>{st.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Units Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Unit 5 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
                <GraduationCap className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-200">
                ข้อ 1–20 (20 ข้อ)
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-base">Unit 5: Study Opportunities</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ระดับปริญญา (Bachelor, Master, PhD, Double degree), ตำแหน่งทางวิชาการ (US vs UK, Faculty), กฎไวยากรณ์ตัวพิมพ์เล็ก-ใหญ่ และค่าธรรมเนียมการศึกษา
            </p>
          </div>
          <button
            onClick={() => onSelectUnit('unit5')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 pt-2 border-t border-slate-100"
          >
            <span>อ่านสรุปเนื้อหา & ทำโจทย์</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Unit 6 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                <BookOpen className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-800 rounded-full border border-indigo-200">
                ข้อ 21–40 (20 ข้อ)
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-base">Unit 6: IELTS Masterclass</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Reading (Marie Curie, การประดิษฐ์ภาษา), Listening (BuildRight & 6 ตำแหน่งงานก่อสร้าง), Speaking (หมู่บ้าน Dharampur), Writing (กระบวนการผลิตอิฐ)
            </p>
          </div>
          <button
            onClick={() => onSelectUnit('unit6')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 pt-2 border-t border-slate-100"
          >
            <span>อ่านสรุปเนื้อหา & ทำโจทย์</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Unit 7 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold px-2.5 py-1 bg-purple-50 text-purple-800 rounded-full border border-purple-200">
                ข้อ 41–60 (20 ข้อ)
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-base">Unit 7: TOEFL Masterclass</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Reading (Craftsmen vs Industrialization ช่างฝีมือกับระบบโรงงาน), Listening (Work-Study กู้ยืมเรียน & Shakespeare), Speaking (นิยามเครื่องมือของสัตว์)
            </p>
          </div>
          <button
            onClick={() => onSelectUnit('unit7')}
            className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 pt-2 border-t border-slate-100"
          >
            <span>อ่านสรุปเนื้อหา & ทำโจทย์</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Unit 8 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <Clock className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                ข้อ 61–80 (20 ข้อ)
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-base">Unit 8: TOEIC Masterclass</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              TOEIC Part 1-7 สำหรับการทำงาน: ไวยากรณ์ยอดฮิต (Despite, Since, Application form, Word form), คำศัพท์ธุรกิจ และตัวย่อในอีเมล (EOD, ASAP, FYI, ETA)
            </p>
          </div>
          <button
            onClick={() => onSelectUnit('unit8')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 pt-2 border-t border-slate-100"
          >
            <span>อ่านสรุปเนื้อหา & ทำโจทย์</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                <Globe className="w-4 h-4" />
              </span>
              <span>ตารางเปรียบเทียบข้อสอบวัดระดับภาษาอังกฤษสากล & ในประเทศ</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              สรุปข้อมูลสำคัญจากหนังสือเรียน Unit 5 (ปรับปรุงข้อมูลค่าสมัครสอบล่าสุด เม.ย. 2025)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาข้อสอบ, หน่วยงาน..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none w-48"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={e => setSelectedFilter(e.target.value)}
              className="border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">ข้อสอบทั้งหมด</option>
              <option value="international">เฉพาะสากล (IELTS, TOEFL, TOEIC, DET, PTE)</option>
              <option value="domestic">เฉพาะในประเทศ (CU-TEP, TU-GET)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <th className="p-3 font-bold">แบบทดสอบ (Test)</th>
                <th className="p-3 font-bold">ประเภท & วัตถุประสงค์</th>
                <th className="p-3 font-bold">ทักษะที่วัด</th>
                <th className="p-3 font-bold">รูปแบบการสอบ & เวลา</th>
                <th className="p-3 font-bold">ค่าสมัครสอบ (THB)</th>
                <th className="p-3 font-bold">เกณฑ์คะแนน (Scale)</th>
                <th className="p-3 font-bold">อายุผลสอบ</th>
                <th className="p-3 font-bold">หน่วยงานจัดสอบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTests.map((test, index) => (
                <tr key={index} className="hover:bg-blue-50/40 transition">
                  <td className="p-3 font-bold text-blue-900 whitespace-nowrap">
                    <div>{test.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{test.fullName}</div>
                  </td>
                  <td className="p-3">{test.modules}</td>
                  <td className="p-3">{test.skills}</td>
                  <td className="p-3">{test.format}</td>
                  <td className="p-3 font-semibold text-slate-900">{test.cost}</td>
                  <td className="p-3 font-bold text-indigo-700">{test.scale}</td>
                  <td className="p-3 whitespace-nowrap">{test.validity}</td>
                  <td className="p-3">{test.administrator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
