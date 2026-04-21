import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 60;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState<Point>({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const gameLoopRef = useRef<number>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    setNextDirection({ x: 1, y: 0 });
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
    generateFood([{ x: 10, y: 10 }]);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const newHead = {
        x: (prevSnake[0].x + nextDirection.x + 20) % 20,
        y: (prevSnake[0].y + nextDirection.y + 20) % 20,
      };

      setDirection(nextDirection);

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check collision with food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setSpeed(prev => Math.max(MIN_SPEED, prev - 2));
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [nextDirection, isPaused, isGameOver, food, generateFood, score, highScore]);

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          if (direction.y === 0) setNextDirection({ x: 0, y: -1 });
          break;
        case 'arrowdown':
        case 's':
          if (direction.y === 0) setNextDirection({ x: 0, y: 1 });
          break;
        case 'arrowleft':
        case 'a':
          if (direction.x === 0) setNextDirection({ x: -1, y: 0 });
          break;
        case 'arrowright':
        case 'd':
          if (direction.x === 0) setNextDirection({ x: 1, y: 0 });
          break;
        case ' ':
          e.preventDefault(); // Prevent scrolling
          if (isGameOver) resetGame();
          else setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver, isPaused]);

  // Main game loop
  useEffect(() => {
    const tick = (time: number) => {
      if (time - lastUpdateRef.current > speed) {
        moveSnake();
        lastUpdateRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(tick);
    };

    gameLoopRef.current = requestAnimationFrame(tick);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [moveSnake, speed]);

  // Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#020617'; // slate-950
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 20; i++) {
      ctx.beginPath();
      ctx.moveTo(i * (canvas.width / 20), 0);
      ctx.lineTo(i * (canvas.width / 20), canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * (canvas.height / 20));
      ctx.lineTo(canvas.width, i * (canvas.height / 20));
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      const x = segment.x * (canvas.width / 20);
      const y = segment.y * (canvas.height / 20);
      const size = (canvas.width / 20);

      // Glitch effect: random offset for segments
      const offsetX = isPaused ? 0 : (Math.random() - 0.5) * 2;
      const offsetY = isPaused ? 0 : (Math.random() - 0.5) * 2;

      ctx.fillStyle = isHead ? '#ff00ff' : '#00ffff';
      ctx.fillRect(x + offsetX, y + offsetY, size - 1, size - 1);
      
      // Wireframe look
      ctx.strokeStyle = isHead ? '#ffffff' : '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + offsetX, y + offsetY, size - 1, size - 1);
    });

    // Draw food
    const fx = food.x * (canvas.width / 20);
    const fy = food.y * (canvas.height / 20);
    const fsize = (canvas.width / 20);

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    // Square food for pixel look
    ctx.fillRect(fx + 2, fy + 2, fsize - 4, fsize - 4);
    
    // Food glitch aura
    if (!isPaused) {
      ctx.strokeStyle = '#ff00ff';
      ctx.strokeRect(fx + Math.random() * 4, fy + Math.random() * 4, fsize, fsize);
    }

  }, [snake, food, isPaused]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-black border-4 border-[#00ffff] bg-opacity-90 relative overflow-hidden magenta-shadow">
      <div className="absolute inset-0 static-bg pointer-events-none" />
      <div className="absolute inset-0 scanline pointer-events-none" />

      <div className="flex justify-between w-full items-center px-4 relative z-10">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-[#ff00ff]">DATA_SCORE</span>
          <span className="text-4xl font-bold text-[#00ffff] glitch-text" data-text={score.toString().padStart(4, '0')}>
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs uppercase tracking-widest text-[#ff00ff]">MAX_INT_RETRIEVED</span>
          <span className="text-2xl font-bold text-white">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative group z-10">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="border-2 border-[#ff00ff] block shadow-[0_0_15px_rgba(255,0,255,0.5)]"
        />

        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80"
            >
              {isGameOver ? (
                <div className="flex flex-col items-center text-center p-6 space-y-6">
                  <h2 className="text-6xl font-bold text-[#ff00ff] glitch-text" data-text="SYSTEM_FAILURE">
                    SYSTEM_FAILURE
                  </h2>
                  <p className="text-white text-xl tracking-tighter">SCORE_ID: {score}</p>
                  <button
                    onClick={resetGame}
                    className="px-8 py-4 bg-[#00ffff] text-black font-bold uppercase tracking-widest border-b-4 border-r-4 border-white active:transform active:translate-x-1 active:translate-y-1 active:border-0 hover:bg-white"
                  >
                    REBOOT_CORE
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-12 py-6 bg-black border-2 border-[#00ffff] text-[#00ffff] font-bold text-4xl hover:bg-[#00ffff] hover:text-black transition-all glitch-text"
                  data-text="INITIALIZE"
                >
                  INITIALIZE
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4 text-xs text-white tracking-widest uppercase relative z-10">
        <span className="text-[#ff00ff]">[INPUT]:</span>
        <span className="text-[#00ffff]">WASD_VECTORS</span>
        <span className="opacity-30">|</span>
        <span className="text-[#00ffff]">SPACE_HALT</span>
      </div>
    </div>
  );
}
