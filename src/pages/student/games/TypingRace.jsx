import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../../components/layout/MainLayout";
import { FiArrowLeft, FiRotateCcw, FiUsers, FiUser, FiCopy, FiCheck, FiZap, FiPlay } from "react-icons/fi";

const TEXTS = [
  "React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called components. React has been designed from the start for gradual adoption.",
  "Node.js is a cross-platform runtime environment that allows developers to build server-side applications using JavaScript. It uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.",
  "Git is a free and open-source distributed version control system designed to handle everything from small to very large projects. Every Git directory is a full-fledged repository with complete history and version tracking.",
  "MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database, MongoDB uses JSON-like documents with optional schemas for flexible data storage.",
  "TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. It adds optional static typing and class-based object-oriented programming to the language.",
  "Docker is a set of platform as a service products that use OS-level virtualization to deliver software in packages called containers. Containers bundle their own software, libraries and configuration files.",
];

const generateRoomCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const TypingRace = () => {
  const [mode, setMode] = useState(null); // null | 'solo' | 'teamup'
  const [targetText, setTargetText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [countdown, setCountdown] = useState(null);
  const [bestWpm, setBestWpm] = useState(() => {
    return parseInt(localStorage.getItem("typing-best-wpm") || "0");
  });
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // TeamUp state
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [myRole, setMyRole] = useState(null);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [opponentWpm, setOpponentWpm] = useState(0);
  const [opponentFinished, setOpponentFinished] = useState(false);
  const [copied, setCopied] = useState(false);
  const channelRef = useRef(null);

  // ── Calculate stats ──
  const calculateStats = useCallback((typed, start) => {
    if (!start) return;
    const elapsedMin = (Date.now() - start) / 60000;
    const words = typed.trim().split(/\s+/).filter(Boolean).length;
    const currentWpm = elapsedMin > 0 ? Math.round(words / elapsedMin) : 0;
    setWpm(currentWpm);

    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === targetText[i]) correct++;
    }
    const acc = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
    setAccuracy(acc);

    return { wpm: currentWpm, progress: Math.round((typed.length / targetText.length) * 100) };
  }, [targetText]);

  // Timer
  useEffect(() => {
    if (isStarted && !isFinished) {
      timerRef.current = setInterval(() => {
        const el = Math.floor((Date.now() - startTime) / 1000);
        setElapsed(el);
        calculateStats(typedText, startTime);
      }, 200);
      return () => clearInterval(timerRef.current);
    }
  }, [isStarted, isFinished, startTime, typedText, calculateStats]);

  // ── BroadcastChannel ──
  const setupChannel = useCallback((code, role) => {
    if (channelRef.current) channelRef.current.close();
    const ch = new BroadcastChannel(`typing-room-${code}`);
    channelRef.current = ch;
    setMyRole(role);
    setRoomCode(code);

    ch.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === "join" && role === "P1") {
        setOpponentJoined(true);
        ch.postMessage({ type: "welcome", text: targetText });
      }
      if (msg.type === "welcome" && role === "P2") {
        setOpponentJoined(true);
        if (msg.text) setTargetText(msg.text);
      }
      if (msg.type === "progress") {
        setOpponentProgress(msg.progress);
        setOpponentWpm(msg.wpm);
      }
      if (msg.type === "finished") {
        setOpponentFinished(true);
        setOpponentWpm(msg.wpm);
        setOpponentProgress(100);
      }
      if (msg.type === "start-countdown") {
        runCountdown();
      }
      if (msg.type === "restart") {
        const newText = TEXTS[Math.floor(Math.random() * TEXTS.length)];
        setTargetText(newText);
        resetGame();
      }
    };
    return ch;
  }, [targetText]);

  const runCountdown = () => {
    setCountdown(3);
    let c = 3;
    const interval = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(interval);
        setCountdown(null);
        setIsStarted(true);
        setStartTime(Date.now());
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }, 1000);
  };

  const createRoom = () => {
    const code = generateRoomCode();
    const text = TEXTS[Math.floor(Math.random() * TEXTS.length)];
    setTargetText(text);
    setMode("teamup");
    setupChannel(code, "P1");
    resetGame();
  };

  const joinRoom = () => {
    if (joinCode.length < 4) return;
    setMode("teamup");
    resetGame();
    const ch = setupChannel(joinCode.toUpperCase(), "P2");
    ch.postMessage({ type: "join" });
  };

  const startSolo = () => {
    const text = TEXTS[Math.floor(Math.random() * TEXTS.length)];
    setTargetText(text);
    setMode("solo");
    resetGame();
    runCountdown();
  };

  const startTeamUpRace = () => {
    if (!opponentJoined) return;
    runCountdown();
    if (channelRef.current) {
      channelRef.current.postMessage({ type: "start-countdown" });
    }
  };

  const resetGame = () => {
    setTypedText("");
    setIsStarted(false);
    setIsFinished(false);
    setStartTime(null);
    setElapsed(0);
    setWpm(0);
    setAccuracy(100);
    setOpponentProgress(0);
    setOpponentWpm(0);
    setOpponentFinished(false);
    setCountdown(null);
  };

  const handleTyping = (e) => {
    if (!isStarted || isFinished) return;
    const value = e.target.value;
    setTypedText(value);

    const stats = calculateStats(value, startTime);

    // Broadcast progress
    if (mode === "teamup" && channelRef.current && stats) {
      channelRef.current.postMessage({
        type: "progress",
        progress: stats.progress,
        wpm: stats.wpm,
      });
    }

    // Check completion
    if (value.length >= targetText.length) {
      setIsFinished(true);
      setIsStarted(false);
      if (stats && stats.wpm > bestWpm) {
        setBestWpm(stats.wpm);
        localStorage.setItem("typing-best-wpm", stats.wpm.toString());
      }
      if (mode === "teamup" && channelRef.current) {
        channelRef.current.postMessage({ type: "finished", wpm: stats?.wpm || wpm });
      }
    }
  };

  const restart = () => {
    const text = TEXTS[Math.floor(Math.random() * TEXTS.length)];
    setTargetText(text);
    resetGame();
    if (mode === "solo") {
      runCountdown();
    }
    if (mode === "teamup" && channelRef.current) {
      channelRef.current.postMessage({ type: "restart" });
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const myProgress = targetText ? Math.round((typedText.length / targetText.length) * 100) : 0;

  // cleanup
  useEffect(() => () => { if (channelRef.current) channelRef.current.close(); }, []);

  // ── Mode Selection ──
  if (!mode) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Link to="/game-zone" className="p-2 rounded-xl hover:bg-dark-600 text-gray-400 hover:text-white transition">
              <FiArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold dark:text-white text-slate-900">Typing Speed Race</h1>
          </div>

          <div className="text-center py-8">
            <div className="text-6xl mb-4">⌨️🏎️</div>
            <h2 className="text-xl font-bold dark:text-white text-slate-900 mb-2">Choose Game Mode</h2>
            <p className="text-sm dark:text-gray-400 text-slate-500 mb-8">Test your typing speed!</p>

            <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <button onClick={startSolo}
                className="card-hover flex flex-col items-center gap-3 p-6 group hover:border-green-500/60">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 group-hover:scale-110 transition">
                  <FiUser size={24} />
                </div>
                <span className="font-bold dark:text-white text-slate-900">Solo Practice</span>
                <span className="text-xs dark:text-gray-400 text-slate-500">Beat your own WPM record</span>
              </button>

              <button onClick={createRoom}
                className="card-hover flex flex-col items-center gap-3 p-6 group hover:border-orange-500/60">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-110 transition">
                  <FiUsers size={24} />
                </div>
                <span className="font-bold dark:text-white text-slate-900">Create Race</span>
                <span className="text-xs dark:text-gray-400 text-slate-500">Race against a developer</span>
              </button>
            </div>

            <div className="mt-8 max-w-sm mx-auto">
              <p className="text-xs dark:text-gray-500 text-slate-400 mb-2">Or join an existing race:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter Room Code"
                  maxLength={6}
                  className="input-field text-center text-lg tracking-[0.3em] font-mono font-bold uppercase"
                />
                <button onClick={joinRoom} disabled={joinCode.length < 4}
                  className="btn-primary px-6 whitespace-nowrap disabled:opacity-40">
                  <FiZap size={16} /> Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ── Game Screen ──
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => { setMode(null); if (channelRef.current) channelRef.current.close(); setOpponentJoined(false); }}
              className="p-2 rounded-xl hover:bg-dark-600 text-gray-400 hover:text-white transition">
              <FiArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold dark:text-white text-slate-900">Typing Speed Race</h1>
              <p className="text-xs dark:text-gray-400 text-slate-500">
                {mode === "solo" ? "Solo Practice" : `Room: ${roomCode} • ${myRole}`}
              </p>
            </div>
          </div>
          {mode === "teamup" && (
            <button onClick={copyCode}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
              {copied ? <><FiCheck size={13} /> Copied!</> : <><FiCopy size={13} /> Code</>}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="card text-center py-3">
            <p className="text-2xl font-extrabold text-green-400">{wpm}</p>
            <p className="text-xs dark:text-gray-400 text-slate-500 mt-1">⌨️ WPM</p>
          </div>
          <div className="card text-center py-3">
            <p className="text-2xl font-extrabold text-cyan-400">{accuracy}%</p>
            <p className="text-xs dark:text-gray-400 text-slate-500 mt-1">🎯 Accuracy</p>
          </div>
          <div className="card text-center py-3">
            <p className="text-2xl font-extrabold text-amber-400">{elapsed}s</p>
            <p className="text-xs dark:text-gray-400 text-slate-500 mt-1">⏱️ Time</p>
          </div>
          <div className="card text-center py-3">
            <p className="text-2xl font-extrabold text-purple-400">{bestWpm}</p>
            <p className="text-xs dark:text-gray-400 text-slate-500 mt-1">🏆 Best WPM</p>
          </div>
        </div>

        {/* Waiting / Start button for TeamUp */}
        {mode === "teamup" && !isStarted && !isFinished && countdown === null && (
          <div className="text-center py-4">
            {!opponentJoined ? (
              <div className="card border-amber-500/30 bg-amber-500/5">
                <p className="text-amber-400 font-semibold">⏳ Waiting for opponent to join...</p>
                <p className="text-xs dark:text-gray-500 text-slate-400 mt-1">Share the room code: <span className="font-mono font-bold text-white">{roomCode}</span></p>
              </div>
            ) : myRole === "P1" ? (
              <button onClick={startTeamUpRace} className="btn-primary bg-green-600 hover:bg-green-500 px-8">
                <FiPlay size={16} /> Start Race!
              </button>
            ) : (
              <div className="card border-green-500/30 bg-green-500/5">
                <p className="text-green-400 font-semibold">✅ Connected! Waiting for host to start...</p>
              </div>
            )}
          </div>
        )}

        {/* Countdown */}
        {countdown !== null && countdown > 0 && (
          <div className="text-center py-8">
            <div className="text-7xl font-extrabold text-white animate-pulse">{countdown}</div>
            <p className="text-sm dark:text-gray-400 text-slate-500 mt-2">Get Ready...</p>
          </div>
        )}

        {/* Race Progress Bars (TeamUp) */}
        {mode === "teamup" && (isStarted || isFinished) && (
          <div className="space-y-3">
            {/* My progress */}
            <div className="card py-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold dark:text-gray-200 text-slate-700">You ({myRole}) — {wpm} WPM</span>
                <span className="text-xs dark:text-gray-400 text-slate-500">{myProgress}%</span>
              </div>
              <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full transition-all duration-300"
                  style={{ width: `${myProgress}%` }} />
              </div>
            </div>
            {/* Opponent progress */}
            <div className="card py-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold dark:text-gray-200 text-slate-700">Opponent — {opponentWpm} WPM</span>
                <span className="text-xs dark:text-gray-400 text-slate-500">{opponentProgress}%</span>
              </div>
              <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-300"
                  style={{ width: `${opponentProgress}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Target Text */}
        {(isStarted || isFinished) && (
          <div className="card">
            <p className="text-sm leading-relaxed font-mono" style={{ wordBreak: "break-all" }}>
              {targetText.split("").map((char, i) => {
                let color = "dark:text-gray-500 text-slate-400"; // not yet typed
                if (i < typedText.length) {
                  color = typedText[i] === char
                    ? "text-green-400"
                    : "text-red-400 bg-red-500/10 rounded";
                }
                if (i === typedText.length) {
                  color = "dark:text-white text-slate-900 bg-primary-500/20 rounded animate-pulse";
                }
                return <span key={i} className={color}>{char}</span>;
              })}
            </p>
          </div>
        )}

        {/* Input */}
        {(isStarted || isFinished) && (
          <textarea
            ref={inputRef}
            value={typedText}
            onChange={handleTyping}
            disabled={isFinished}
            placeholder={isStarted ? "Start typing here..." : ""}
            className="input-field font-mono text-sm min-h-[80px] resize-none"
            autoFocus
          />
        )}

        {/* Finished */}
        {isFinished && (
          <div className="text-center py-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-lg font-bold dark:text-white text-slate-900">Race Complete!</h2>
            <p className="text-3xl font-extrabold text-green-400 mt-2">{wpm} WPM</p>
            <p className="text-sm dark:text-gray-400 text-slate-500">{accuracy}% accuracy in {elapsed}s</p>
            {wpm >= bestWpm && wpm > 0 && (
              <p className="text-sm text-amber-400 font-semibold mt-1">🏆 New Personal Best!</p>
            )}
            {mode === "teamup" && opponentFinished && (
              <p className="mt-2 text-sm font-semibold">
                {wpm > opponentWpm
                  ? <span className="text-green-400">🎉 You Won! (Opponent: {opponentWpm} WPM)</span>
                  : wpm < opponentWpm
                  ? <span className="text-red-400">😢 You Lost! (Opponent: {opponentWpm} WPM)</span>
                  : <span className="text-amber-400">🤝 It's a Tie!</span>
                }
              </p>
            )}
            {mode === "teamup" && !opponentFinished && (
              <p className="mt-2 text-sm text-amber-400">⏳ Waiting for opponent to finish...</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <button onClick={restart} className="btn-secondary flex items-center gap-2">
            <FiRotateCcw size={15} /> New Race
          </button>
          <button onClick={() => { setMode(null); if (channelRef.current) channelRef.current.close(); setOpponentJoined(false); }}
            className="btn-ghost">
            Exit
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default TypingRace;
