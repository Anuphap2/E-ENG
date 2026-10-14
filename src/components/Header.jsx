import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Headphones, 
  FileText,
  Bookmark, 
  Award,
  Globe,
  Sparkles,
  CheckCircle2,
  ListTodo
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  answeredCount = 0, 
  totalCount = 80, 
  score = 0, 
  weightedScore = "0.00" 
}) {
  const percentCompleted = Math.round((answeredCount / totalCount) * 100);

  const tabs = [
    { 
      id: 'overview', 
      label: 'ภาพรวม & แผนผังสอบ', 
      sub: 'Roadmap & Test Info',
      icon: Globe 
    },
    { 
      id: 'lessons', 
      label: 'สรุปบทเรียน 4 หน่วย', 
      sub: 'Units 5–8 Guide',
      icon: BookOpen,
      badge: '4 Units'
    },
    { 
      id: 'listeningLab', 
      label: 'ห้องฝึกฟังเสียง', 
      sub: 'Listening Lab',
      icon: Headphones, 
      badge: '11 Tracks' 
    },
    { 
      id: 'reading', 
      label: 'ห้องฝึกอ่านบทความ', 
      sub: 'Reading Studio',
      icon: FileText, 
      badge: '5 Passages',
      highlight: true
    },
    { 
      id: 'vocab', 
      label: 'การ์ดคำศัพท์', 
      sub: 'Vocab Flashcards',
      icon: Bookmark, 
      badge: '160 คำ' 
    },
    { 
      id: 'quiz', 
      label: 'ห้องสอบจำลอง 80 ข้อ', 
      sub: 'Quiz Studio (Focus)',
      icon: Award, 
      highlight: true,
      badge: '25%'
    },
  ];

  return (
    <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-40">
      {/* Top Essential Info Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-md text-[11px] uppercase tracking-wider shadow-xs">
              FINAL EXAM 1/2026
            </span>
            <span className="font-semibold text-slate-200 hidden sm:inline">
              10700320: English for Further Studies and Future Careers
            </span>
            <span className="sm:hidden font-semibold text-slate-200">
              10700320: English
            </span>
            <span className="bg-blue-800/80 text-blue-200 border border-blue-600/40 px-2 py-0.5 rounded text-[11px] font-medium hidden md:inline">
              80 Items (น้ำหนัก 25%)
            </span>
          </div>

          {/* Quick Learning Stats */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <ListTodo className="w-3.5 h-3.5 text-blue-400" />
              <span>ทำแล้ว: <strong className="text-white font-bold">{answeredCount}</strong>/{totalCount} ({percentCompleted}%)</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>คะแนน: <strong className="text-amber-300 font-bold">{score}</strong>/80 (<strong className="text-emerald-400 font-bold">{weightedScore}</strong>/25%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full bg-slate-100 h-1">
        <div 
          className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 h-full transition-all duration-300"
          style={{ width: `${percentCompleted}%` }}
        />
      </div>

      {/* Main Brand & 5-Pillar Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-2 pt-2 pb-1 md:py-0">
        {/* App Title / Logo */}
        <div className="flex items-center gap-3 py-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-extrabold text-slate-900 tracking-tight leading-none">
                ระบบติวสอบปลายภาคภาษาอังกฤษ
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                E-Learning
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
              เรียนรู้ทีละสเต็ป • สรุปเข้ม 4 บท • ฟังเสียงสำเนียงสากล • ฝึกทำข้อสอบพร้อมเฉลยละเอียด
            </p>
          </div>
        </div>

        {/* 5 Clean Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-2 md:py-3.5 rounded-xl md:rounded-none md:border-b-2 text-xs md:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 md:bg-transparent md:border-blue-600 md:text-blue-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 md:border-transparent'
                } ${tab.highlight && !isActive ? 'bg-amber-50/70 text-amber-900 hover:bg-amber-100/60' : ''}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <div className="text-left">
                  <span className="block leading-tight">{tab.label}</span>
                </div>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : tab.highlight 
                        ? 'bg-amber-400 text-slate-950' 
                        : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
