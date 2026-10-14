import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import OverviewTab from './components/OverviewTab';
import LessonsTab from './components/LessonsTab';
import ListeningLabTab from './components/ListeningLabTab';
import ReadingTab from './components/ReadingTab';
import VocabTab from './components/VocabTab';
import QuizTab from './components/QuizTab';
import Footer from './components/Footer';
import { useSpeech } from './hooks/useSpeech';
import { questionsData } from './data/questionsData';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeLessonUnit, setActiveLessonUnit] = useState('unit5');
  const [selectedQuizUnit, setSelectedQuizUnit] = useState(null);
  const [initialQuestionId, setInitialQuestionId] = useState(null);
  
  // Shared answer and flag state across the application
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

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

  // Jump to specific unit in LessonsTab
  const handleSelectUnitLesson = (unitId) => {
    setActiveLessonUnit(unitId);
    setActiveTab('lessons');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Jump to quiz filtered to unit
  const handleStartUnitQuiz = (unitName) => {
    setSelectedQuizUnit(unitName);
    // Find first question of that unit
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
          />
        )}

        {activeTab === 'listeningLab' && (
          <ListeningLabTab
            speech={speech}
            onJumpToUnit={(unit) => handleStartUnitQuiz(unit)}
          />
        )}

        {activeTab === 'reading' && (
          <ReadingTab
            speech={speech}
            onNavigateQuiz={handleStartFullExam}
          />
        )}

        {activeTab === 'vocab' && (
          <VocabTab speech={speech} />
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
          />
        )}
      </main>

      <Footer onGoToQuiz={handleStartFullExam} />
    </div>
  );
}
