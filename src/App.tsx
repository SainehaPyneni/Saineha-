/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Music, Gamepad2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00ffff] flex flex-col items-center justify-center p-4 md:p-8 space-y-16 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 static-bg" />
        <div className="absolute inset-0 scanline" />
        <div className="absolute top-1/4 left-0 w-full h-[2px] bg-[#ff00ff] opacity-20 animate-pulse" />
        <div className="absolute top-3/4 left-0 w-full h-[1px] bg-[#00ffff] opacity-10" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex flex-col items-center gap-6 text-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 py-2 border-2 border-[#ff00ff] bg-black text-[#ff00ff] text-xl font-bold uppercase tracking-[0.5em] magenta-shadow"
        >
          ARCADE_CORE_v2.0
        </motion.div>
        
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="relative"
        >
          <h1 
            className="text-7xl md:text-9xl font-bold tracking-tighter glitch-text leading-none"
            data-text="GLITCH_ARCADE"
          >
            GLITCH_ARCADE
          </h1>
          <div className="absolute -bottom-4 right-0 text-white text-xs tracking-widest bg-black px-2 border border-white">
            UNAUTHORIZED_ACCESS_DETECTED
          </div>
        </motion.div>
      </header>

      {/* Main Content Grid */}
      <main className="w-full max-w-7xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Sidebar Left: Machine Logs */}
        <motion.section 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 space-y-8 hidden lg:block"
        >
          <div className="p-6 border-2 border-white bg-black magenta-shadow">
            <h4 className="text-xl font-bold uppercase tracking-widest text-[#ff00ff] mb-6 border-b border-[#ff00ff] pb-2">
              &gt; SYSTEM_LOG
            </h4>
            <div className="space-y-4 text-sm font-mono leading-none">
              <p className="text-white flex gap-2">
                <span className="text-[#00ffff]">[04:49:50]</span> 
                 INIT_GAME_ENGINE...
              </p>
              <p className="text-white flex gap-2">
                <span className="text-[#00ffff]">[04:49:51]</span> 
                 CALIBRATING_CYAN_VECTORS...
              </p>
              <p className="text-white flex gap-2">
                <span className="text-[#ff00ff]">[04:49:52]</span> 
                 MAGENTA_LEAK_DETECTED
              </p>
              <p className="text-white flex gap-2 animate-pulse">
                <span className="text-[#00ffff]">[04:49:53]</span> 
                 AWAITING_INPUT_SEQUENCE_
              </p>
            </div>
          </div>

          <div className="p-6 border-2 border-[#00ffff] bg-black">
             <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-[#00ffff]">CPU_LOAD</span>
                <span className="text-xs text-white">98.2%</span>
             </div>
             <div className="w-full h-2 bg-black border border-[#00ffff]">
                <div className="w-[98%] h-full bg-[#00ffff]" />
             </div>
          </div>
        </motion.section>

        {/* Center: Snake Game */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-6 flex justify-center"
        >
          <div className="relative group">
             <div className="absolute -inset-1 bg-[#ff00ff] blur-sm opacity-20 group-hover:opacity-40 transition-opacity" />
             <SnakeGame />
          </div>
        </motion.section>

        {/* Sidebar Right: Music Player */}
        <motion.section 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 flex justify-center lg:justify-start"
        >
          <div className="w-full flex flex-col gap-8">
            <MusicPlayer />
            
            <div className="hidden lg:block p-6 border-2 border-white bg-black magenta-shadow">
               <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-[#00ffff] mb-4">WAVE_INTERFERENCE</h4>
               <div className="flex gap-1 h-12 items-end bg-black/50 p-2 border border-[#ff00ff]">
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['10%', '90%', '20%', '100%'] }}
                      transition={{ duration: 0.5 + Math.random(), repeat: Infinity, delay: i * 0.05 }}
                      className="flex-1 bg-white"
                    />
                  ))}
               </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-[#ff00ff] text-lg font-bold uppercase tracking-[1em] relative z-10">
        TERMINAL_EOF // 0xCCFF001
      </footer>
    </div>
  );
}
