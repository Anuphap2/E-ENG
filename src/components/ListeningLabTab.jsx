import React, { useState, useEffect, useRef } from 'react';
import { audioTracks } from '../data/audioTracks';
import { useTrackPlayer } from '../hooks/useTrackPlayer';
import { soundEffects } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Headphones, 
  Play, 
  Square, 
  Eye, 
  EyeOff, 
  Volume2, 
  ArrowRight,
  Sliders,
  Sparkles,
  Radio,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ListMusic,
  Award,
  Zap,
  HelpCircle,
  Flame
} from 'lucide-react';

// Mini comprehension questions for each track
const TRACK_CHALLENGES = {
  'track-1': {
    q: 'According to Alex Johnson, what is driving the rising demand in construction?',
    choices: [
      'Demand for luxury underground mansions',
      'Properties built using energy-efficient materials and green technologies',
      'Wooden log cabins for holiday retreats',
      'Steel factories without any ventilation'
    ],
    answer: 1,
    explanation: 'บทบรรยายระบุว่า "we’re seeing increasing demand for properties that are built using energy efficient materials and green technologies to keep up with tightening regulations."'
  },
  'track-2': {
    q: 'Which role offers company-provided dorms on site in a remote location and requires Certificate 3?',
    choices: [
      'Site Manager',
      'Safety Manager',
      'Carpenter',
      'Heavy Machinery Operator'
    ],
    answer: 2,
    explanation: 'บทบรรยายระบุ: "There’s also a role available for a carpenter... employees are based on site in dorms provided by the company. A certificate three in carpentry is required."'
  },
  'track-3': {
    q: 'What specific task was assigned to the speaker at Dr. John Simpson’s health center?',
    choices: [
      'Administering smallpox vaccine injections',
      'Filling up registration forms for illiterate or struggling villagers',
      'Driving the ambulance truck',
      'Organizing medicines in the pharmacy warehouse'
    ],
    answer: 1,
    explanation: 'บทบรรยายระบุ: "He assigned me the task of filling up forms for the villagers as some of them were either illiterate or had difficulties in writing."'
  },
  'track-4': {
    q: 'Why did Advisor Sanders recommend the student work only 10 hours a week instead of 20?',
    choices: [
      'The university ran out of work-study funding',
      'To prevent her grades from slipping and risking her scholarship',
      'Freshmen are legally prohibited from working',
      'Her student loans were already forgiven'
    ],
    answer: 1,
    explanation: 'Advisor เตือนว่า: "...considering you’re a freshman with a full class schedule, it wouldn’t be wise to increase your workload so much. If your grades slip up, you might not qualify again next year for your current scholarship."'
  },
  'track-5': {
    q: 'What practical suggestion did TA John give to the student worried about the heavy reading workload?',
    choices: [
      'Never take any literature class in college',
      'Sign up and evaluate for the first two weeks, then drop if overwhelmed',
      'Only read chapter summaries online',
      'Change majors to avoid literature'
    ],
    answer: 1,
    explanation: 'TA John แนะนำ: "Well, you could always sign up and see how it goes the first two weeks. And if it seems like too much, you could drop the class and just take it next year..."'
  },
  'track-6': {
    q: 'Why did the art student argue that enrollment in sculpture was low?',
    choices: [
      'Students genuinely dislike three-dimensional art',
      'Sculpture classes are electives, while mandatory painting classes consume all their time',
      'The sculpture studio had no materials or clay',
      'Sculpture exams are twice as hard as painting'
    ],
    answer: 1,
    explanation: 'นักศึกษาโต้แย้งว่า: "The problem is that sculpture classes are optional electives, while mandatory painting and drawing courses consume all our time!"'
  },
  'track-7': {
    q: 'What is the key requirement under the "narrow definition" of animal tool use?',
    choices: [
      'The animal must build the tool in a factory',
      'The tool must not be an unsevered part of the animal’s own physical body',
      'Only chimpanzees can qualify as tool users',
      'The object must be made of metal'
    ],
    answer: 1,
    explanation: 'บทเรียนระบุว่าในคำนิยามแบบแคบ วัตถุที่นำมาใช้เป็นเครื่องมือจะต้องไม่ใช่อวัยวะหรือส่วนหนึ่งของร่างกายของสัตว์ตัวนั้น'
  },
  'track-8': {
    q: 'In the supply chain notice, what caused the severe delivery delay?',
    choices: [
      'Port strikes and maritime bottleneck disruptions',
      'A delivery van breakdown',
      'Cancelled purchase orders',
      'Factory bankruptcy'
    ],
    answer: 0,
    explanation: 'ประกาศระบุถึงปัญหาการประท้วงหยุดงานที่ท่าเรือขนส่งสินค้า (harbor logistics strike) ส่งผลให้ตู้คอนเทนเนอร์ล่าช้า'
  },
  'track-9': {
    q: 'What remedy is the customer seeking in the warranty claim letter?',
    choices: [
      'A replacement unit or a full refund under the 30-day warranty',
      'A discount coupon for next year',
      'An apology letter from the CEO',
      'Free software training'
    ],
    answer: 0,
    explanation: 'ลูกค้าขอเปลี่ยนสินค้าใหม่ หรือขอคืนเงินเต็มจำนวนตามเงื่อนไขรับประกัน 30 วัน'
  },
  'track-10': {
    q: 'According to the university policy, what GPA puts a student on Academic Probation?',
    choices: [
      'Cumulative GPA below 3.00',
      'Cumulative GPA below 2.00',
      'Cumulative GPA below 1.50',
      'Cumulative GPA below 2.50'
    ],
    answer: 1,
    explanation: 'เกณฑ์วิชาการของมหาวิทยาลัยกำหนดว่า เกรดเฉลี่ยสะสมต่ำกว่า 2.00 จะถูกจัดอยู่ในสถานะรอพินิจ (Academic Probation)'
  },
  'track-11': {
    q: 'How can students reclaim their $5 deposit on the reusable GreenBox?',
    choices: [
      'Throw the container in the blue recycling bin',
      'Return the rinsed container to the cafeteria drop station',
      'Keep it until graduation',
      'Sell it back to other freshmen'
    ],
    answer: 1,
    explanation: 'ประกาศระบุให้นำกล่องอาหารที่ล้างสะอาดแล้วมาหยอดคืนที่ตู้รับคืนในโรงอาหารเพื่อรับเงินมัดจำ $5 คืนทันที'
  }
};

export default function ListeningLabTab({ speech, onJumpToUnit, soundEnabled = true, onAddXp }) {
  const [currentTrack, setCurrentTrack] = useState(audioTracks[0]);
  const [showTranscript, setShowTranscript] = useState(true);
  
  // Track challenge state: { [trackId]: selectedChoiceIdx }
  const [challengeAnswers, setChallengeAnswers] = useState({});
  const [completedTracks, setCompletedTracks] = useState(new Set());

  const player = useTrackPlayer();
  const activeSentenceRef = useRef(null);

  // Sync track with player
  useEffect(() => {
    player.setTrackText(currentTrack.text);
    if (currentTrack.accent) {
      player.setAccent(currentTrack.accent);
    }
  }, [currentTrack]);

  // Auto-scroll the active sentence into view
  useEffect(() => {
    if (player.activeSentenceIndex >= 0 && activeSentenceRef.current) {
      activeSentenceRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [player.activeSentenceIndex]);

  const handleSelectTrack = (track) => {
    setCurrentTrack(track);
    player.stop();
  };

  const handlePlayAllFromStart = () => {
    player.playAll(0);
    // Mark as listened
    setCompletedTracks(prev => new Set(prev).add(currentTrack.id));
  };

  // Handle challenge answer
  const currentChallenge = TRACK_CHALLENGES[currentTrack.id] || TRACK_CHALLENGES['track-1'];
  const userChoice = challengeAnswers[currentTrack.id];
  const isChallengeAnswered = userChoice !== undefined;
  const isChallengeCorrect = isChallengeAnswered && userChoice === currentChallenge.answer;

  const handleAnswerChallenge = (choiceIdx) => {
    if (isChallengeAnswered) return;
    setChallengeAnswers(prev => ({
      ...prev,
      [currentTrack.id]: choiceIdx
    }));

    if (choiceIdx === currentChallenge.answer) {
      soundEffects.playCorrect(soundEnabled);
      if (onAddXp) onAddXp(25, `ตอบถูกในความท้าทายการฟัง: ${currentTrack.title}`);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      soundEffects.playWrong(soundEnabled);
    }
  };

  return (
    <div className="bg-white p-5 md:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-xs font-black text-blue-700 uppercase tracking-wider">AUDIO CENTER & REAL-TIME READ-ALONG</span>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5 flex items-center gap-2">
            <Headphones className="w-6 h-6 text-blue-600" />
            <span>Listening Lab: ศูนย์ฝึกการฟังแบบ Real-Time คำต่อคำ</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ระบบเล่นเสียงตามประโยค ไฮไลต์คำที่กำลังพูดตรงจังหวะ 100% พร้อมคลิกฟังซ้ำทีละประโยคได้อิสระ
          </p>
        </div>

        {/* Global Settings */}
        <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl text-xs self-start md:self-auto border border-slate-200">
          <label className="font-semibold text-slate-600">สำเนียง:</label>
          <select 
            value={player.accent} 
            onChange={(e) => player.setAccent(e.target.value)} 
            className="bg-white border border-slate-300 rounded-xl px-2 py-1 text-xs outline-none"
          >
            <option value="en-US">🇺🇸 American (US)</option>
            <option value="en-GB">🇬🇧 British (UK)</option>
          </select>

          <label className="font-semibold text-slate-600 ml-2">ความเร็ว:</label>
          <select 
            value={player.rate} 
            onChange={(e) => player.setRate(parseFloat(e.target.value))} 
            className="bg-white border border-slate-300 rounded-xl px-2 py-1 text-xs outline-none"
          >
            <option value={0.85}>0.85x (ช้า)</option>
            <option value={1.0}>1.0x (ปกติ)</option>
            <option value={1.2}>1.2x (เร็ว)</option>
          </select>
        </div>
      </div>

      {/* DESKTOP 2-COLUMN SPLIT LAYOUT (Playlist on Left, Player & Challenge on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Track Playlist (4 Cols on PC Desktop) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-blue-600" />
              <span>รายการแทร็กเสียง (11 แทร็ก)</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-400">
              ฟังแล้ว {completedTracks.size}/11
            </span>
          </div>

          <div className="space-y-2 lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto lg:pr-1">
            {audioTracks.map((track, idx) => {
              const isSelected = currentTrack.id === track.id;
              const isPlayingThis = isSelected && player.isPlaying;
              const isDone = completedTracks.has(track.id);

              return (
                <div
                  key={track.id}
                  onClick={() => handleSelectTrack(track)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-500 shadow-sm ring-2 ring-blue-200'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {track.unit}
                        </span>
                      </div>
                      {isDone && (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> ฟังแล้ว
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs line-clamp-2 leading-tight">
                      {track.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                    <span className="truncate max-w-[130px]">{track.speaker}</span>
                    <span className="text-blue-600 font-bold flex items-center gap-1">
                      {isPlayingThis ? 'กำลังเล่น...' : 'คลิกเพื่อฟัง'}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Master Player & Karaoke Transcript & Challenge (8 Cols on PC Desktop) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Master Player Box */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 md:p-6 rounded-3xl shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 uppercase tracking-wide border border-blue-400/20">
                    {currentTrack.unit}
                  </span>
                  <span className="text-xs text-blue-200 font-mono">
                    {player.accent === 'en-GB' ? '🇬🇧 British Accent' : '🇺🇸 American Accent'}
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-bold mt-1 text-white">
                  {currentTrack.title}
                </h3>
                <p className="text-xs text-blue-200/80 mt-0.5">
                  ผู้บรรยาย: <strong>{currentTrack.speaker}</strong>
                </p>
              </div>

              {/* Live Audio Visualizer Animation */}
              <div className={`audio-visualizer ${player.isPlaying ? 'active' : ''} self-end sm:self-auto`}>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
              </div>
            </div>

            {/* Master Audio Controller Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={player.togglePlayAll}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 shadow-sm"
                >
                  {player.isPlaying ? (
                    <>
                      <Square className="w-4 h-4 fill-current" />
                      <span>หยุดเสียง</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>{player.activeSentenceIndex > 0 ? 'เล่นต่อจากจุดเดิม' : 'เล่นเสียงทั้งหมด (Play All)'}</span>
                    </>
                  )}
                </button>

                {player.isPlaying && (
                  <button
                    onClick={handlePlayAllFromStart}
                    className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-2.5 rounded-xl text-xs transition flex items-center gap-1"
                    title="เริ่มเล่นใหม่ตั้งแต่ประโยคแรก"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>เริ่มประโยคแรก</span>
                  </button>
                )}

                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="bg-blue-800/80 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 border border-blue-600/40"
                >
                  {showTranscript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showTranscript ? 'ซ่อนสคริปต์' : 'เปิดดูสคริปต์'}</span>
                </button>
              </div>

              {/* Real-time Sentence Tracker Info */}
              <div className="text-xs text-blue-200 flex items-center gap-2">
                <span>ประโยคที่: <strong className="text-white font-bold">{player.activeSentenceIndex >= 0 ? player.activeSentenceIndex + 1 : 1}</strong> / {player.sentences.length}</span>
              </div>
            </div>

            {/* Interactive Sentence-by-Sentence Karaoke Script Box */}
            {showTranscript && (
              <div className="mt-3 p-4 bg-slate-950 rounded-2xl border border-white/10 max-h-80 overflow-y-auto space-y-2.5">
                <div className="flex items-center justify-between text-xs text-amber-400 font-bold border-b border-white/10 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>สคริปต์แยกตามประโยค (ไฮไลต์คำตรงจังหวะเสียงพูด 100% • คลิกประโยคเพื่อฟังซ้ำ):</span>
                  </span>
                  {player.isPlaying && (
                    <span className="text-[11px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-mono animate-pulse">
                      ● Live Sync
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {player.sentences.map((sentence, sIdx) => {
                    const isActiveSentence = sIdx === player.activeSentenceIndex;
                    const tokens = player.tokenizedSentences[sIdx]?.tokens || [];

                    return (
                      <div
                        key={sIdx}
                        ref={isActiveSentence ? activeSentenceRef : null}
                        onClick={() => player.playSentence(sIdx)}
                        className={`p-3 rounded-2xl border transition cursor-pointer select-text ${
                          isActiveSentence
                            ? 'bg-blue-900/60 border-blue-400 shadow-md ring-1 ring-blue-400/50'
                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isActiveSentence && player.isPlaying) {
                                player.stop();
                              } else {
                                player.playSentence(sIdx);
                              }
                            }}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs transition ${
                              isActiveSentence && player.isPlaying
                                ? 'bg-amber-400 text-slate-950 font-bold'
                                : 'bg-white/10 text-slate-300 hover:bg-blue-600 hover:text-white'
                            }`}
                            title={isActiveSentence && player.isPlaying ? "หยุดเสียง" : "ฟังเฉพาะประโยคนี้"}
                          >
                            {isActiveSentence && player.isPlaying ? '■' : '▶'}
                          </button>

                          <div className="leading-relaxed text-xs md:text-sm flex-grow">
                            {tokens.map((t, wIdx) => {
                              const isWordActive = isActiveSentence && wIdx === player.activeWordIndex;
                              const isWordPast = isActiveSentence && wIdx < player.activeWordIndex;

                              return (
                                <React.Fragment key={wIdx}>
                                  <span
                                    className={`transition-all duration-75 ${
                                      isWordActive
                                        ? 'bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded shadow-sm scale-110 inline-block mx-0.5 ring-2 ring-amber-300 ring-offset-1 ring-offset-slate-900'
                                        : isWordPast
                                          ? 'text-slate-100 font-medium'
                                          : isActiveSentence
                                            ? 'text-slate-400'
                                            : 'text-slate-300'
                                    }`}
                                  >
                                    {t.word}
                                  </span>
                                  {t.space}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* FUN LISTENING CHALLENGE (Mini Comprehension Check) */}
          <div className="bg-slate-50 p-5 md:p-6 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-amber-100 text-amber-800">
                  <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm md:text-base">
                  ⚡ แบบทดสอบความเข้าใจประจำแทร็ก (Listening Challenge)
                </h4>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                +25 XP
              </span>
            </div>

            <p className="text-xs md:text-sm font-bold text-slate-800 leading-snug">
              {currentChallenge.q}
            </p>

            <div className="grid sm:grid-cols-2 gap-2.5">
              {currentChallenge.choices.map((choice, cIdx) => {
                const isSelected = userChoice === cIdx;
                const showCorrect = isChallengeAnswered && cIdx === currentChallenge.answer;
                const showWrong = isChallengeAnswered && isSelected && cIdx !== currentChallenge.answer;

                return (
                  <button
                    key={cIdx}
                    onClick={() => handleAnswerChallenge(cIdx)}
                    disabled={isChallengeAnswered}
                    className={`p-3 rounded-2xl border-2 text-left text-xs font-semibold transition flex items-start gap-2.5 ${
                      showCorrect
                        ? 'bg-emerald-50 text-emerald-950 border-emerald-500 ring-1 ring-emerald-300 font-bold'
                        : showWrong
                          ? 'bg-rose-50 text-rose-950 border-rose-500 font-bold'
                          : isSelected
                            ? 'bg-blue-50 text-blue-900 border-blue-500'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5 border ${
                      showCorrect
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : showWrong
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}>
                      {String.fromCharCode(65 + cIdx)}
                    </span>
                    <span className="leading-snug pt-0.5">{choice}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation card once answered */}
            {isChallengeAnswered && (
              <div className={`p-4 rounded-2xl text-xs space-y-1.5 border animate-fadeIn ${
                isChallengeCorrect ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-red-50/80 border-red-200 text-red-900'
              }`}>
                <div className="flex items-center gap-1.5 font-black">
                  {isChallengeCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>เก่งมาก! ตอบถูกต้อง (+25 XP)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>ยังไม่ถูกต้อง คำตอบที่ถูกคือข้อ {String.fromCharCode(65 + currentChallenge.answer)}</span>
                    </>
                  )}
                </div>
                <p className="text-slate-700 leading-relaxed font-sarabun text-[11px]">
                  <strong>คำอธิบาย:</strong> {currentChallenge.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
