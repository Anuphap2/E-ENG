// Unified Gamification Engine for Course 10700320 Final Exam Prep

export const LEVEL_TIERS = [
  { level: 1, title: 'Novice Scholar', thaiTitle: 'ผู้เริ่มต้นการเรียนรู้', minXp: 0, maxXp: 150, badge: '🌱' },
  { level: 2, title: 'Academic Explorer', thaiTitle: 'นักสำรวจวิชาการ', minXp: 150, maxXp: 400, badge: '⚡' },
  { level: 3, title: 'Exam Strategist', thaiTitle: 'นักวางแผนข้อสอบ', minXp: 400, maxXp: 800, badge: '⚔️' },
  { level: 4, title: 'Test Master', thaiTitle: 'ผู้พิชิตโจทย์สอบ', minXp: 800, maxXp: 1400, badge: '🏆' },
  { level: 5, title: 'Master Linguist', thaiTitle: 'ยอดฝีมือภาษาอังกฤษ', minXp: 1400, maxXp: 2200, badge: '👑' },
  { level: 6, title: 'English Legend', thaiTitle: 'ตำนานเกียรตินิยม', minXp: 2200, maxXp: 999999, badge: '🌌' }
];

export const ACHIEVEMENTS = [
  {
    id: 'first_correct',
    title: 'First Blood (ก้าวแรกสู่ความสำเร็จ)',
    description: 'ตอบคำถามในห้องสอบถูกต้องข้อแรก',
    icon: '🎯',
    xpReward: 25
  },
  {
    id: 'streak_3',
    title: 'Triple Combo (เครื่องติด)',
    description: 'ตอบคำถามถูกต้องติดต่อกัน 3 ข้อใน Quiz Studio',
    icon: '⚡',
    xpReward: 30
  },
  {
    id: 'streak_5',
    title: 'On Fire (ไฟแรง)',
    description: 'ตอบคำถามถูกต้องติดต่อกัน 5 ข้อใน Quiz Studio',
    icon: '🔥',
    xpReward: 50
  },
  {
    id: 'streak_10',
    title: 'Unstoppable (ไร้เทียมทาน)',
    description: 'ตอบคำถามถูกต้องติดต่อกัน 10 ข้อติดกัน!',
    icon: '🌟',
    xpReward: 100
  },
  {
    id: 'read_curie',
    title: 'Radioactive Scholar (ผู้ค้นพบกัมมันตรังสี)',
    description: 'ฝึกอ่านและทำข้อสอบบทความ Marie Curie ใน Reading Studio',
    icon: '☢️',
    xpReward: 40
  },
  {
    id: 'reading_passages_3',
    title: 'Bookworm (หนอนหนังสือ)',
    description: 'ฝึกทำแบบฝึกหัดใน Reading Studio ครบ 3 บทความ',
    icon: '📚',
    xpReward: 60
  },
  {
    id: 'listening_tracks_3',
    title: 'Golden Ears (หูทองคำ)',
    description: 'ฝึกฟังเสียงสำเนียงสากลใน Listening Lab ครบ 3 แทร็ก',
    icon: '🎧',
    xpReward: 40
  },
  {
    id: 'vocab_20',
    title: 'Word Collector (นักสะสมคลังคำ)',
    description: 'ท่องจำคำศัพท์ในการ์ดคำศัพท์ Flashcards ได้ 20 คำ',
    icon: '🎴',
    xpReward: 40
  },
  {
    id: 'match_winner',
    title: 'Speed Matcher (เซียนจับคู่)',
    description: 'จับคู่คำศัพท์และความหมายสำเร็จครบทุกคู่ในมินิเกม',
    icon: '🧩',
    xpReward: 50
  },
  {
    id: 'xp_500',
    title: 'Century Scholar (ครึ่งพันแต้ม)',
    description: 'สะสมค่าประสบการณ์ครบ 500 XP',
    icon: '💯',
    xpReward: 75
  },
  {
    id: 'xp_1000',
    title: 'Millennium Legend (พันแต้มพิชิตเกรด A)',
    description: 'สะสมค่าประสบการณ์ครบ 1,000 XP',
    icon: '👑',
    xpReward: 150
  }
];

export const getLevelInfo = (xp) => {
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_TIERS[i].minXp) {
      const current = LEVEL_TIERS[i];
      const next = LEVEL_TIERS[i + 1] || null;
      const progressPercent = next 
        ? Math.min(100, Math.round(((xp - current.minXp) / (current.maxXp - current.minXp)) * 100))
        : 100;
      return {
        ...current,
        nextLevel: next,
        progressPercent,
        xpToNext: next ? current.maxXp - xp : 0
      };
    }
  }
  return { ...LEVEL_TIERS[0], nextLevel: LEVEL_TIERS[1], progressPercent: 0, xpToNext: 150 };
};

// Storage helper
const STORAGE_KEY = 'eng_final_gamification_v2';

export const loadGamificationState = () => {
  if (typeof window === 'undefined') {
    return { xp: 0, streak: 0, bestStreak: 0, unlockedAchievements: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}
  return { xp: 0, streak: 0, bestStreak: 0, unlockedAchievements: [] };
};

export const saveGamificationState = (state) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
};
