import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import OverviewTab from './components/OverviewTab';
import LessonsTab from './components/LessonsTab';
import ListeningLabTab from './components/ListeningLabTab';
import ReadingTab from './components/ReadingTab';
import VocabTab from './components/VocabTab';
import QuizTab from './components/QuizTab';
import Test2Tab from './components/Test2Tab';
import Footer from './components/Footer';
import AchievementsModal from './components/AchievementsModal';
import { useSpeech } from './hooks/useSpeech';
import { questionsData } from './data/questionsData';
import { 
  loadGamificationState, 
  saveGamificationState, 
  getLevelInfo, 
  ACHIEVEMENTS 
} from './utils/gamification';
import { soundEffects } from './utils/soundEffects';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState('test2');
  const [activeLessonUnit, setActiveLessonUnit] = useState('unit5');
  const [selectedQuizUnit, setSelectedQuizUnit] = useState(null);
  const [initialQuestionId, setInitialQuestionId] = useState(null);
  
  // Shared answer and flag state across the application
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

  // Global Gamification & Sound State
  const [gamification, setGamification] = useState(loadGamificationState);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

  const speech = useSpeech();

  // Compute live scores for Header and stats
  const { answeredCount, totalScore, weightedScore } = useMemo(() => {
    let score = 0;
    questionsData.forEach(q => {
      if (userAnswers[q.id] === q.answer) {
        score++;
      }
    });
    const answered = Object.keys(userAnswers).length;
    const weighted = ((score / questionsData.length) * 25).toFixed(2);
    return {
      answeredCount: answered,
      totalScore: score,
      weightedScore: weighted
    };
  }, [userAnswers]);

  // Global XP adder with milestone check and fanfare
  const handleAddXp = (amount, reason = '') => {
    setGamification(prev => {
      const oldLevel = getLevelInfo(prev.xp).level;
      const newXp = prev.xp + amount;
      const newLevel = getLevelInfo(newXp).level;

      // Celebrate level up
      if (newLevel > oldLevel) {
        soundEffects.playFanfare(soundEnabled);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      }

      // Check achievements
      const unlocked = new Set(prev.unlockedAchievements || []);
      if (!unlocked.has('first_correct')) unlocked.add('first_correct');
      if (newXp >= 500 && !unlocked.has('xp_500')) unlocked.add('xp_500');
      if (newXp >= 1000 && !unlocked.has('xp_1000')) unlocked.add('xp_1000');

      const updated = {
        ...prev,
        xp: newXp,
        unlockedAchievements: Array.from(unlocked)
      };
      saveGamificationState(updated);
      return updated;
    });
  };

  // Record streaks and unlock streak achievements
  const handleRecordStreak = (isCorrect) => {
    setGamification(prev => {
      const nextStreak = isCorrect ? prev.streak + 1 : 0;
      const best = Math.max(prev.bestStreak || 0, nextStreak);
      const unlocked = new Set(prev.unlockedAchievements || []);

      if (nextStreak >= 3 && !unlocked.has('streak_3')) unlocked.add('streak_3');
      if (nextStreak >= 5 && !unlocked.has('streak_5')) unlocked.add('streak_5');
      if (nextStreak >= 10 && !unlocked.has('streak_10')) unlocked.add('streak_10');

      const updated = {
        ...prev,
        streak: nextStreak,
        bestStreak: best,
        unlockedAchievements: Array.from(unlocked)
      };
      saveGamificationState(updated);
      return updated;
    });
  };

  // PC Global Keyboard shortcuts for Tab Navigation (Alt+1 to Alt+7)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.altKey) {
        const tabMap = {
          '1': 'test2',
          '2': 'quiz',
          '3': 'reading',
          '4': 'listeningLab',
          '5': 'vocab',
          '6': 'lessons',
          '7': 'overview'
        };
        if (tabMap[e.key]) {
          e.preventDefault();
          setActiveTab(tabMap[e.key]);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Jump to specific unit in LessonsTab
  const handleSelectUnitLesson = (unitId) => {
    setActiveLessonUnit(unitId);
    setActiveTab('lessons');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Jump to quiz filtered to unit
  const handleStartUnitQuiz = (unitName) => {
    setSelectedQuizUnit(unitName);
    const firstQ = questionsData.find(q => q.unit === unitName);
    if (firstQ) {
      setInitialQuestionId(firstQ.id);
    }
    setActiveTab('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start full 80-item exam
  const handleStartFullExam = () => {
    setSelectedQuizUnit('all');
    setInitialQuestionId(1);
    setActiveTab('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900 font-sarabun">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        answeredCount={answeredCount}
        totalCount={questionsData.length}
        score={totalScore}
        weightedScore={weightedScore}
        xp={gamification.xp}
        streak={gamification.streak}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 py-6 flex-grow w-full space-y-6">
        {activeTab === 'overview' && (
          <OverviewTab
            onSelectUnit={handleSelectUnitLesson}
            onStartFullExam={handleStartFullExam}
            onNavigateTab={(tabId) => {
              setActiveTab(tabId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'lessons' && (
          <LessonsTab
            initialUnit={activeLessonUnit}
            onStartUnitQuiz={handleStartUnitQuiz}
            speakText={speech.speak}
            soundEnabled={soundEnabled}
            onAddXp={handleAddXp}
          />
        )}

        {activeTab === 'listeningLab' && (
          <ListeningLabTab
            speech={speech}
            onJumpToUnit={(unit) => handleStartUnitQuiz(unit)}
            soundEnabled={soundEnabled}
            onAddXp={handleAddXp}
          />
        )}

        {activeTab === 'reading' && (
          <ReadingTab
            speech={speech}
            onNavigateQuiz={handleStartFullExam}
            soundEnabled={soundEnabled}
            onAddXp={handleAddXp}
          />
        )}

        {activeTab === 'vocab' && (
          <VocabTab 
            speech={speech} 
            globalSoundEnabled={soundEnabled}
            onAddGlobalXp={handleAddXp}
          />
        )}

        {activeTab === 'test2' && (
          <Test2Tab
            speech={speech}
            soundEnabled={soundEnabled}
            onAddXp={handleAddXp}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizTab
            speech={speech}
            userAnswers={userAnswers}
            setUserAnswers={setUserAnswers}
            flaggedQuestions={flaggedQuestions}
            setFlaggedQuestions={setFlaggedQuestions}
            externalFilter={selectedQuizUnit}
            onClearExternalFilter={() => setSelectedQuizUnit(null)}
            initialQuestionId={initialQuestionId}
            soundEnabled={soundEnabled}
            onAddXp={handleAddXp}
            streak={gamification.streak}
            onRecordStreak={handleRecordStreak}
          />
        )}
      </main>

      <Footer onGoToQuiz={handleStartFullExam} />

      {/* Trophies & Achievements Modal */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        xp={gamification.xp}
        streak={gamification.streak}
        bestStreak={gamification.bestStreak}
        unlockedAchievements={gamification.unlockedAchievements}
      />
    </div>
  );
}
