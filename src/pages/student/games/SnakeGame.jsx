import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../../components/layout/MainLayout";
import { FiArrowLeft, FiRotateCcw, FiPlay, FiPause, FiZap } from "react-icons/fi";

const CELL_SIZE = 20;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const COLS = CANVAS_WIDTH / CELL_SIZE;
const ROWS = CANVAS_HEIGHT / CELL_SIZE;

const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const [gameState, setGameState] = useState("idle"); // idle | playing | paused | gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("snake-high-score") || "0");
  });
  const [speed, setSpeed] = useState(150);

  const snakeRef = useRef([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]);
  const dirRef = useRef({ x: 1, y: 0 });
  const nextDirRef = useRef({ x: 1, y: 0 });
  const foodRef = useRef({ x: 15, y: 10 });
  const scoreRef = useRef(0);
  const speedRef = useRef(150);

  const spawnFood = useCallback(() => {
    let pos;
    do {
      pos = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      };
    } while (snakeRef.current.some(s => s.x === pos.x && s.y === pos.y));
    foodRef.current = pos;
  }, []);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Grid lines (subtle)
    ctx.strokeStyle = "rgba(9, 65, 64, 0.3)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= CANVAS_WIDTH; x += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // Food with glow
    const food = foodRef.current;
    ctx.shadowColor = "#f43f5e";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    const snake = snakeRef.current;
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      const progress = i / snake.length;

      if (isHead) {
        // Head with glow
        ctx.shadowColor = "#22d3ee";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#22d3ee";
        ctx.beginPath();
        ctx.roundRect(
          seg.x * CELL_SIZE + 1,
          seg.y * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2,
          4
        );
        ctx.fill();
        ctx.shadowBlur = 0;

        // Eyes
        ctx.fillStyle = "#000000";
        const eyeSize = 3;
        const dir = dirRef.current;
        if (dir.x === 1) {
          ctx.fillRect(seg.x * CELL_SIZE + 13, seg.y * CELL_SIZE + 5, eyeSize, eyeSize);
          ctx.fillRect(seg.x * CELL_SIZE + 13, seg.y * CELL_SIZE + 12, eyeSize, eyeSize);
        } else if (dir.x === -1) {
          ctx.fillRect(seg.x * CELL_SIZE + 4, seg.y * CELL_SIZE + 5, eyeSize, eyeSize);
          ctx.fillRect(seg.x * CELL_SIZE + 4, seg.y * CELL_SIZE + 12, eyeSize, eyeSize);
        } else if (dir.y === -1) {
          ctx.fillRect(seg.x * CELL_SIZE + 5, seg.y * CELL_SIZE + 4, eyeSize, eyeSize);
          ctx.fillRect(seg.x * CELL_SIZE + 12, seg.y * CELL_SIZE + 4, eyeSize, eyeSize);
        } else {
          ctx.fillRect(seg.x * CELL_SIZE + 5, seg.y * CELL_SIZE + 13, eyeSize, eyeSize);
          ctx.fillRect(seg.x * CELL_SIZE + 12, seg.y * CELL_SIZE + 13, eyeSize, eyeSize);
        }
      } else {
        // Body gradient from cyan to teal
        const r = Math.floor(34 - progress * 20);
        const g = Math.floor(211 - progress * 130);
        const b = Math.floor(238 - progress * 150);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.beginPath();
        ctx.roundRect(
          seg.x * CELL_SIZE + 2,
          seg.y * CELL_SIZE + 2,
          CELL_SIZE - 4,
          CELL_SIZE - 4,
          3
        );
        ctx.fill();
      }
    });
  }, []);

  const gameLoop = useCallback(() => {
    const snake = snakeRef.current;
    dirRef.current = nextDirRef.current;
    const dir = dirRef.current;

    // New head position
    const newHead = {
      x: snake[0].x + dir.x,
      y: snake[0].y + dir.y,
    };

    // Wall collision
    if (newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS) {
      setGameState("gameover");
      return;
    }

    // Self collision
    if (snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
      setGameState("gameover");
      return;
    }

    const newSnake = [newHead, ...snake];

    // Eat food?
    if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
      scoreRef.current += 10;
      setScore(scoreRef.current);
      spawnFood();
      // Speed up every 50 points
      if (scoreRef.current % 50 === 0 && speedRef.current > 60) {
        speedRef.current -= 10;
        setSpeed(speedRef.current);
      }
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    drawGame();
  }, [drawGame, spawnFood]);

  // Game loop interval
  useEffect(() => {
    if (gameState === "playing") {
      gameLoopRef.current = setInterval(gameLoop, speedRef.current);
      return () => clearInterval(gameLoopRef.current);
    }
    if (gameState === "gameover") {
      if (scoreRef.current > highScore) {
        setHighScore(scoreRef.current);
        localStorage.setItem("snake-high-score", scoreRef.current.toString());
      }
    }
  }, [gameState, gameLoop, highScore]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      if (DIRECTIONS[e.key]) {
        e.preventDefault();
        const newDir = DIRECTIONS[e.key];
        const curDir = dirRef.current;
        // Prevent 180° turn
        if (newDir.x !== -curDir.x || newDir.y !== -curDir.y) {
          nextDirRef.current = newDir;
        }
      }
      if (e.key === " ") {
        e.preventDefault();
        if (gameState === "playing") setGameState("paused");
        else if (gameState === "paused") setGameState("playing");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState]);

  const startGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    scoreRef.current = 0;
    speedRef.current = 150;
    setScore(0);
    setSpeed(150);
    spawnFood();
    setGameState("playing");
    drawGame();
  };

  // Initial draw
  useEffect(() => { drawGame(); }, [drawGame]);

  // Mobile controls
  const handleMobileDir = (dir) => {
    const curDir = dirRef.current;
    if (dir.x !== -curDir.x || dir.y !== -curDir.y) {
      nextDirRef.current = dir;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link to="/game-zone" className="p-2 rounded-xl hover:bg-dark-600 text-gray-400 hover:text-white transition">
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold dark:text-white text-slate-900">Snake Game</h1>
            <p className="text-xs dark:text-gray-400 text-slate-500">Use arrow keys or WASD to move</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card text-center py-3">
            <p className="text-2xl font-extrabold text-cyan-400">{score}</p>
            <p className="text-xs dark:text-gray-400 text-slate-500 mt-1">🎯 Score</p>
          </div>
          <div className="card text-center py-3">
            <p className="text-2xl font-extrabold text-amber-400">{highScore}</p>
            <p className="text-xs dark:text-gray-400 text-slate-500 mt-1">🏆 High Score</p>
          </div>
          <div className="card text-center py-3">
            <p className="text-2xl font-extrabold text-purple-400">{speed}ms</p>
            <p className="text-xs dark:text-gray-400 text-slate-500 mt-1">⚡ Speed</p>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative flex justify-center">
          <div className="rounded-2xl overflow-hidden border-2 border-dark-600 shadow-lg shadow-cyan-500/5 relative">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="block max-w-full"
              style={{ imageRendering: "pixelated" }}
            />

            {/* Overlay screens */}
            {gameState === "idle" && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <div className="text-5xl">🐍</div>
                <h2 className="text-xl font-bold text-white">Snake Game</h2>
                <p className="text-sm text-gray-400">Eat food, grow longer, don't hit walls!</p>
                <button onClick={startGame} className="btn-primary bg-cyan-600 hover:bg-cyan-500 px-6">
                  <FiPlay size={16} /> Start Game
                </button>
              </div>
            )}

            {gameState === "paused" && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <div className="text-4xl">⏸️</div>
                <h2 className="text-xl font-bold text-white">Paused</h2>
                <button onClick={() => setGameState("playing")} className="btn-primary bg-cyan-600 hover:bg-cyan-500 px-6">
                  <FiPlay size={16} /> Resume
                </button>
              </div>
            )}

            {gameState === "gameover" && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <div className="text-5xl">💀</div>
                <h2 className="text-xl font-bold text-white">Game Over!</h2>
                <p className="text-3xl font-extrabold text-cyan-400">{score} pts</p>
                {score >= highScore && score > 0 && (
                  <p className="text-sm text-amber-400 font-semibold">🏆 New High Score!</p>
                )}
                <button onClick={startGame} className="btn-primary bg-cyan-600 hover:bg-cyan-500 px-6">
                  <FiRotateCcw size={16} /> Play Again
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex flex-col items-center gap-2 md:hidden">
          <button onClick={() => handleMobileDir({ x: 0, y: -1 })}
            className="w-14 h-14 rounded-xl bg-dark-700 border border-dark-600 flex items-center justify-center text-xl active:bg-dark-600 active:scale-95 transition">
            ⬆️
          </button>
          <div className="flex gap-2">
            <button onClick={() => handleMobileDir({ x: -1, y: 0 })}
              className="w-14 h-14 rounded-xl bg-dark-700 border border-dark-600 flex items-center justify-center text-xl active:bg-dark-600 active:scale-95 transition">
              ⬅️
            </button>
            <button onClick={() => handleMobileDir({ x: 0, y: 1 })}
              className="w-14 h-14 rounded-xl bg-dark-700 border border-dark-600 flex items-center justify-center text-xl active:bg-dark-600 active:scale-95 transition">
              ⬇️
            </button>
            <button onClick={() => handleMobileDir({ x: 1, y: 0 })}
              className="w-14 h-14 rounded-xl bg-dark-700 border border-dark-600 flex items-center justify-center text-xl active:bg-dark-600 active:scale-95 transition">
              ➡️
            </button>
          </div>
        </div>

        {/* Controls help */}
        <div className="card text-center text-xs dark:text-gray-500 text-slate-400 space-y-1">
          <p><kbd className="px-1.5 py-0.5 bg-dark-800 border border-dark-600 rounded text-[10px]">↑ ↓ ← →</kbd> or <kbd className="px-1.5 py-0.5 bg-dark-800 border border-dark-600 rounded text-[10px]">W A S D</kbd> to move</p>
          <p><kbd className="px-1.5 py-0.5 bg-dark-800 border border-dark-600 rounded text-[10px]">Space</kbd> to pause/resume</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default SnakeGame;
