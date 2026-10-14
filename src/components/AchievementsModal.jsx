import React from 'react';
import { ACHIEVEMENTS, getLevelInfo, LEVEL_TIERS } from '../utils/gamification';
import { Trophy, X, Award, Flame, Sparkles, CheckCircle2, Lock } from 'lucide-react';

export default function AchievementsModal({ 
  isOpen, 
  onClose, 
  xp = 0, 
  streak = 0, 
  bestStreak = 0, 
  unlockedAchievements = [] 
}) {
  if (!isOpen) return null;

  const levelInfo = getLevelInfo(xp);
  const unlockedSet = new Set(unlockedAchievements);
  const unlockedCount = ACHIEVEMENTS.filter(a => unlockedSet.has(a.id)).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-indigo-600 to-blue-700 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
              {levelInfo.badge}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>LEVEL {levelInfo.level}: {levelInfo.title}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black">{levelInfo.thaiTitle}</h3>
              <p className="text-xs text-blue-100 mt-0.5">
                สะสมทั้งหมด <strong className="text-amber-300 font-black">{xp} XP</strong> • สถิติต่อเนื่องสูงสุด: <strong className="text-white font-bold">{bestStreak} ข้อ</strong>
              </p>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="mt-4 bg-black/25 rounded-xl p-3 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-blue-100">
              <span>ความคืบหน้าสู่เลเวล {levelInfo.nextLevel ? levelInfo.nextLevel.level : 'MAX'}</span>
              <span>{levelInfo.nextLevel ? `อีก ${levelInfo.xpToNext} XP` : 'สูดสุดแล้ว!'}</span>
            </div>
            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content: Badges Grid */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h4 className="font-extrabold text-slate-900 text-sm">
                เหรียญเกียรติยศ & ภารกิจ (ปลดล็อคแล้ว {unlockedCount}/{ACHIEVEMENTS.length})
              </h4>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}% Complete
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((ach) => {
              const isUnlocked = unlockedSet.has(ach.id);

              return (
                <div
                  key={ach.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    isUnlocked
                      ? 'bg-amber-50/70 border-amber-300 shadow-xs ring-1 ring-amber-200'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 border ${
                    isUnlocked 
                      ? 'bg-white border-amber-300 shadow-sm' 
                      : 'bg-slate-200/80 border-slate-300 text-slate-400'
                  }`}>
                    {isUnlocked ? ach.icon : <Lock className="w-4 h-4 text-slate-400" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className={`text-xs font-bold truncate ${isUnlocked ? 'text-slate-900' : 'text-slate-600'}`}>
                        {ach.title}
                      </h5>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-amber-700 shrink-0">
                        +{ach.xpReward} XP
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      {ach.description}
                    </p>
                    {isUnlocked && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-1">
                        <CheckCircle2 className="w-3 h-3" /> ปลดล็อคแล้ว
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Level Ranks Guide */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 mt-4">
            <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-600" />
              <span>ลำดับยศทางวิชาการ (Scholar Ranks):</span>
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {LEVEL_TIERS.map(tier => (
                <div 
                  key={tier.level}
                  className={`p-2 rounded-xl border flex items-center gap-2 ${
                    levelInfo.level === tier.level 
                      ? 'bg-blue-100/80 border-blue-400 font-bold text-blue-950 shadow-xs' 
                      : 'bg-white border-slate-200/80 text-slate-600'
                  }`}
                >
                  <span className="text-base">{tier.badge}</span>
                  <div className="min-w-0">
                    <span className="block text-[11px] truncate font-bold leading-none">{tier.title}</span>
                    <span className="text-[10px] text-slate-400">{tier.minXp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            💡 ทำข้อสอบ, อ่านบทความ, ฟังเสียง และท่องศัพท์เพื่อสะสม XP
          </span>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition shadow-xs"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
