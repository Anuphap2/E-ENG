import React, { useState, useEffect, useRef } from 'react';
import { audioTracks } from '../data/audioTracks';
import { useTrackPlayer } from '../hooks/useTrackPlayer';
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
  ListMusic
} from 'lucide-react';

export default function ListeningLabTab({ speech, onJumpToUnit }) {
  const [currentTrack, setCurrentTrack] = useState(audioTracks[0]);
  const [showTranscript, setShowTranscript] = useState(true);
  
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
  };

  return (
    <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">AUDIO CENTER & REAL-TIME READ-ALONG</span>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-0.5 flex items-center gap-2">
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

      {/* Master Player Box */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 md:p-6 rounded-3xl shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 uppercase tracking-wide border border-blue-400/20">
                {currentTrack.unit}
              </span>
              <span className="text-xs text-slate-300">ผู้บรรยาย: <strong className="text-white">{currentTrack.speaker}</strong></span>
              {player.isPlaying && (
                <span className="text-[11px] bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 animate-pulse">
                  <Radio className="w-3 h-3" />
                  <span>กำลังออกเสียง</span>
                </span>
              )}
            </div>
            <h3 className="text-lg md:text-xl font-black mt-1.5 text-white">
              {currentTrack.title}
            </h3>
            <p className="text-xs text-blue-200 mt-0.5 font-light">
              {currentTrack.description}
            </p>
          </div>

          {/* Sound Wave Indicator */}
          <div className={`flex items-center h-9 px-3.5 bg-white/10 rounded-xl border border-white/10 self-start sm:self-auto ${player.isPlaying ? 'playing' : ''}`}>
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
                <span>สคริปต์แยกตามประโยค (ไฮไลต์คำตรงจังหวะเสียงพูด 100% • คลิกที่ประโยคเพื่อฟังซ้ำได้ทันที):</span>
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
                      {/* Sentence Play/Stop Button */}
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

                      {/* Sentence text with word-level highlight */}
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

      {/* Playlist Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black">
              11
            </span>
            <span>รายการคลิปเสียงและบทสนทนาทั้งหมด (11 Tracks)</span>
          </h3>
          <span className="text-xs text-slate-500">เลือกแทร็กที่ต้องการฝึกฟัง</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {audioTracks.map((track) => {
            const isSelected = currentTrack.id === track.id;
            const isPlayingThis = isSelected && player.isPlaying;

            return (
              <div 
                key={track.id} 
                className={`p-4 rounded-2xl border transition flex flex-col justify-between space-y-2.5 ${
                  isPlayingThis
                    ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500'
                    : isSelected 
                      ? 'bg-slate-50 border-blue-300' 
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">{track.unit}</span>
                    <span className="truncate max-w-[140px] text-slate-400">{track.speaker}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{track.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{track.description}</p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                  <button
                    onClick={() => {
                      handleSelectTrack(track);
                      setTimeout(() => {
                        player.playAll(0);
                      }, 50);
                    }}
                    className={`font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition shadow-xs ${
                      isPlayingThis
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isPlayingThis ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isPlayingThis ? 'กำลังเล่น...' : 'ฟังบทบรรยาย'}</span>
                  </button>
                  <button
                    onClick={() => onJumpToUnit(track.unit)}
                    className="text-slate-500 hover:text-blue-700 text-[11px] font-semibold flex items-center gap-0.5"
                  >
                    <span>ไปทำข้อสอบ</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
