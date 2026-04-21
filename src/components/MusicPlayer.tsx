import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  { id: '1', title: 'Neon Drift', artist: 'SynthPulse AI', duration: '3:45', url: '#' },
  { id: '2', title: 'Cybernetic Echo', artist: 'Neural Beats', duration: '4:20', url: '#' },
  { id: '3', title: 'Quantum Flux', artist: 'Glitch Core', duration: '2:58', url: '#' }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<number>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = window.setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
      }, 500);
    } else {
      if (progressInterval.current) clearInterval(progressInterval.current);
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentTrackIndex(prev => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex(prev => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-md bg-black border-4 border-[#ff00ff] p-6 relative overflow-hidden magenta-shadow">
      <div className="absolute inset-0 static-bg pointer-events-none" />
      
      <div className="flex flex-col gap-8 relative z-10">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className={`w-24 h-24 border-2 border-white bg-black flex items-center justify-center relative overflow-hidden transition-all duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}>
              <Music2 className={`text-[#00ffff] transition-all duration-1000 ${isPlaying ? 'animate-pulse scale-125' : ''}`} size={40} />
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                   <div className="w-full h-full bg-[#ff00ff] mix-blend-screen animate-glitch" />
                </div>
              )}
            </div>
            <div className="absolute -inset-1 border border-[#00ffff] animate-ping opacity-20" />
          </div>

          <div className="flex flex-col flex-1 truncate">
            <AnimatePresence mode="wait">
              <motion.h3
                key={currentTrack.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-3xl font-bold text-[#00ffff] truncate glitch-text uppercase tracking-tighter"
                data-text={currentTrack.title}
              >
                {currentTrack.title}
              </motion.h3>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTrack.id + 'artist'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                className="text-sm text-white tracking-[0.3em] uppercase leading-none mt-2"
              >
                {currentTrack.artist}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-3">
          <div className="h-4 w-full bg-black border border-white relative overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 bottom-0 bg-[#ff00ff]"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
            {/* Binary markers overlay */}
            <div className="absolute inset-0 flex justify-between px-2 text-[8px] text-white/40 items-center font-mono">
              <span>0110</span>
              <span>1011</span>
              <span>0010</span>
            </div>
          </div>
          <div className="flex justify-between text-xs font-bold text-white tracking-widest">
            <span className="text-[#00ffff]">CURR_STREAM</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-12">
          <button onClick={handlePrev} className="text-white hover:text-[#ff00ff] transition-all">
            <SkipBack size={32} />
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-20 h-20 bg-[#00ffff] text-black border-2 border-white flex items-center justify-center hover:bg-white transition-all transform active:scale-90"
          >
            {isPlaying ? <Pause size={40} /> : <Play size={40} className="ml-2" />}
          </button>

          <button onClick={handleNext} className="text-white hover:text-[#ff00ff] transition-all">
            <SkipForward size={32} />
          </button>
        </div>
      </div>
    </div>
  );
}
