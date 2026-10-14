import React, { useRef } from 'react';
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
  ListTodo,
  Volume2,
  VolumeX,
  Trophy,
  Flame,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getLevelInfo } from '../utils/gamification';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  answeredCount = 0, 
  totalCount = 80, 
  score = 0, 
  weightedScore = "0.00",
  xp = 0,
  streak = 0,
  soundEnabled = true,
  setSoundEnabled,
  onOpenAchievements
}) {
  const navRef = useRef(null);
  const percentCompleted = Math.round((answeredCount / totalCount) * 100);
  const levelInfo = getLevelInfo(xp);

  const tabs = [
    { 
      id: 'test2', 
      label: '🔥 ข้อสอบ Test 2 (40 ข้อ)', 
      sub: 'สอบบ่ายนี้ (40 ข้อ)',
      icon: Flame, 
      highlight: true,
      badge: '40 ข้อบ่ายนี้',
      shortcut: '1'
    },
    { 
      id: 'quiz', 
      label: 'ข้อสอบ Final (80 ข้อ)', 
      sub: 'Final Exam (25%)',
      icon: Award, 
      badge: '80 ข้อ (25%)',
      shortcut: '2'
    },
    { 
      id: 'reading', 
      label: 'ห้องฝึกอ่านบทความ', 
      sub: 'Reading Studio',
      icon: FileText, 
      badge: 'Passages',
      shortcut: '3'
    },
    { 
      id: 'listeningLab', 
      label: 'ห้องฝึกฟังเสียง', 
      sub: 'Listening Lab',
      icon: Headphones, 
      badge: '11 Tracks',
      shortcut: '4'
    },
    { 
      id: 'vocab', 
      label: 'การ์ดคำศัพท์ & มินิเกม', 
      sub: 'Vocab Flashcards',
      icon: Bookmark, 
      badge: '160 คำ',
      shortcut: '5'
    },
    { 
      id: 'lessons', 
      label: 'สรุปบทเรียน 4 หน่วย', 
      sub: 'Units 5–8 Guide',
      icon: BookOpen, 
      badge: '4 Units',
      shortcut: '6'
    },
    { 
      id: 'overview', 
      label: 'ภาพรวม & แผนผังสอบ', 
      sub: 'Roadmap & Info',
      icon: Globe,
      shortcut: '7'
    },
  ];

  const handleScrollLeft = () => {
    if (navRef.current) {
      navRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (navRef.current) {
      navRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  const handleWheelScroll = (e) => {
    if (navRef.current && e.deltaY !== 0) {
      navRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-40 select-none">
      {/* 1. Top Essential Info & Gamification Bar */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Course & Exam Identity */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider shadow-xs">
              FINAL 1/2026
            </span>
            <span className="font-semibold text-slate-200 hidden sm:inline text-xs">
              10700320: English for Further Studies and Future Careers
            </span>
            <span className="sm:hidden font-semibold text-slate-200 text-xs">
              10700320: English
            </span>
          </div>

          {/* Right: Gamification XP + Level + Streak + Achievements + Sound + Stats */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs flex-wrap">
            {/* Streak Counter */}
            {streak > 0 && (
              <div 
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold animate-pulse text-[11px]"
                title={`คุณตอบถูกต้องต่อเนื่อง ${streak} ครั้ง!`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{streak} Streak</span>
              </div>
            )}

            {/* Level & XP Capsule */}
            <div 
              onClick={onOpenAchievements}
              className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 px-2.5 py-1 rounded-xl cursor-pointer transition text-[11px] group"
              title="คลิกเพื่อดูเหรียญเกียรติยศและระดับเลเวล"
            >
              <span className="text-sm">{levelInfo.badge}</span>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-amber-300">Lv.{levelInfo.level}</span>
                  <span className="text-[10px] text-slate-300 font-semibold hidden md:inline">({levelInfo.title})</span>
                  <span className="text-[10px] text-emerald-400 font-black">+{xp} XP</span>
                </div>
                <div className="w-16 bg-slate-700 h-1 rounded-full overflow-hidden mt-0.5">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${levelInfo.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Achievements Trophy Button */}
            <button
              onClick={onOpenAchievements}
              className="p-1 px-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1 transition text-[11px]"
              title="ดูเหรียญเกียรติยศ (Achievements)"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">เกียรติยศ</span>
            </button>

            {/* Sound FX Toggle */}
            <button
              onClick={() => setSoundEnabled && setSoundEnabled(!soundEnabled)}
              className={`p-1 px-2 rounded-xl border transition text-[11px] flex items-center gap-1 ${
                soundEnabled 
                  ? 'bg-blue-600/30 text-blue-200 border-blue-500/40 hover:bg-blue-600/50' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title={soundEnabled ? 'เปิดเสียงเอฟเฟกต์ (กดเพื่อปิด)' : 'ปิดเสียงเอฟเฟกต์ (กดเพื่อเปิด)'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-blue-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden md:inline">{soundEnabled ? 'เสียงเปิด' : 'เสียงปิด'}</span>
            </button>

            <span className="text-slate-700 hidden sm:inline">|</span>

            {/* Quick Learning Stats */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-300 hidden md:inline">
                ทำแล้ว: <strong className="text-white font-bold">{answeredCount}</strong>/{totalCount}
              </span>
              <span className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-lg text-[11px] font-bold">
                {score}/80 ({weightedScore}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Progress Bar Line */}
      <div className="w-full bg-slate-100 h-1">
        <div 
          className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 h-full transition-all duration-300"
          style={{ width: `${percentCompleted}%` }}
        />
      </div>

      {/* 3. Brand & Course Identity Row */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold text-slate-900 tracking-tight leading-none">
                ระบบติวสอบปลายภาคภาษาอังกฤษ
              </h1>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                Smart Tutor 10700320
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
              ข้อสอบจำลอง 80 ข้อ • เจาะลึกบทอ่าน • ฟังเสียงคาราโอเกะคำต่อคำ • คลังศัพท์ 160 คำ • สรุปเข้ม 4 หน่วย
            </p>
          </div>
        </div>

        {/* PC Keyboard Shortcut Reminder */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-xl border border-slate-200">
          <span className="font-semibold text-slate-600">คีย์ลัดสลับเมนู:</span>
          <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px] text-slate-800 font-bold">Alt+1</kbd>
          <span className="text-slate-400">ถึง</span>
          <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px] text-slate-800 font-bold">Alt+7</kbd>
        </div>
      </div>

      {/* 4. DEDICATED 7-TAB NAVIGATION BAR (PC Full Grid & Mobile/Scrollable with Arrows) */}
      <div className="bg-slate-50/90 border-t border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 relative flex items-center">
          {/* Scroll Left Button for Narrow Screens */}
          <button
            onClick={handleScrollLeft}
            className="flex lg:hidden absolute left-1 z-10 w-7 h-7 rounded-full bg-white/95 border border-slate-300 shadow-md items-center justify-center text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
            title="เลื่อนเมนูไปทางซ้าย"
            aria-label="Scroll menu left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Navigation Tab Bar: Full 7-column Grid on PC, Scrollable with Mouse Wheel on smaller screens */}
          <nav
            ref={navRef}
            onWheel={handleWheelScroll}
            className="w-full flex lg:grid lg:grid-cols-7 gap-1.5 overflow-x-auto py-2 px-1 scroll-smooth focus:outline-none"
            style={{ scrollbarWidth: 'thin' }}
          >
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
                  className={`p-2.5 rounded-xl text-xs md:text-sm font-semibold transition flex items-center justify-between gap-1.5 whitespace-nowrap shrink-0 lg:w-full border ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-bold ring-2 ring-blue-300'
                      : tab.highlight
                        ? 'bg-amber-100/80 text-amber-950 border-amber-300 hover:bg-amber-200/80 font-bold'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                  title={`กดแท็บ หรือคีย์ลัด (Alt+${tab.shortcut})`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : tab.highlight ? 'text-amber-600' : 'text-slate-500'}`} />
                    <span className="truncate leading-tight text-xs font-bold">{tab.label}</span>
                  </div>

                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black shrink-0 ${
                      isActive 
                        ? 'bg-white/25 text-white' 
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

          {/* Scroll Right Button for Narrow Screens */}
          <button
            onClick={handleScrollRight}
            className="flex lg:hidden absolute right-1 z-10 w-7 h-7 rounded-full bg-white/95 border border-slate-300 shadow-md items-center justify-center text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
            title="เลื่อนเมนูไปทางขวา"
            aria-label="Scroll menu right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
