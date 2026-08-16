import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../../components/layout/MainLayout";
import { FiArrowLeft, FiRotateCcw, FiUsers, FiUser, FiCopy, FiCheck, FiZap, FiClock } from "react-icons/fi";

const CARD_EMOJIS = ["🚀", "⚡", "🎯", "💎", "🔥", "🎮", "🌟", "💡"];

const generateRoomCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const shuffleArray = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const MemoryGame = () => {
  const [mode, setMode] = useState(null); // null | 'solo' | 'teamup'
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [bestTime, setBestTime] = useState(() => {
    return parseInt(localStorage.getItem("memory-best-time") || "999");
  });

  // TeamUp state
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [myRole, setMyRole] = useState(null); // 'P1' or 'P2'
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState("P1");
  const [teamScores, setTeamScores] = useState({ P1: 0, P2: 0 });
  const [copied, setCopied] = useState(false);
  const channelRef = useRef(null);
  const timerRef = useRef(null);

  const initCards = useCallback(() => {
    const pairs = [...CARD_EMOJIS, ...CARD_EMOJIS].map((emoji, i) => ({
      id: i,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));
    return shuffleArray(pairs);
  }, []);

  // Timer
  useEffect(() => {
    if (isPlaying && !gameOver) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [isPlaying, gameOver]);

  // Check game over
  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) {
      setGameOver(true);
      setIsPlaying(false);
      if (mode === "solo" && timer < bestTime) {
        setBestTime(timer);
        localStorage.setItem("memory-best-time", timer.toString());
      }
    }
  }, [matched, cards, timer, bestTime, mode]);

  // ── TeamUp: BroadcastChannel ──
  const setupChannel = useCallback((code, role) => {
    if (channelRef.current) channelRef.current.close();
    const ch = new BroadcastChannel(`memory-room-${code}`);
    channelRef.current = ch;
    setMyRole(role);
    setRoomCode(code);

    ch.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === "join" && role === "P1") {
        setOpponentJoined(true);
        ch.postMessage({ type: "welcome", cards: cards });
      }
      if (msg.type === "welcome" && role === "P2") {
        setOpponentJoined(true);
        if (msg.cards) setCards(msg.cards);
      }
      if (msg.type === "flip") {
        setFlipped(msg.flipped);
        setCards(msg.cards);
        setMatched(msg.matched);
        setCurrentPlayer(msg.currentPlayer);
        setTeamScores(msg.teamScores);
        setMoves(msg.moves);
      }
      if (msg.type === "restart") {
        const newCards = initCards();
        setCards(newCards);
        setFlipped([]);
        setMatched([]);
        setMoves(0);
        setTimer(0);
        setGameOver(false);
        setIsPlaying(true);
        setCurrentPlayer("P1");
        setTeamScores({ P1: 0, P2: 0 });
      }
    };
    return ch;
  }, [cards, initCards]);

  const createRoom = () => {
    const code = generateRoomCode();
    const newCards = initCards();
    setCards(newCards);
    setMode("teamup");
    setupChannel(code, "P1");
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimer(0);
    setGameOver(false);
    setIsPlaying(true);
    setCurrentPlayer("P1");
    setTeamScores({ P1: 0, P2: 0 });
    setOpponentJoined(false);
  };

  const joinRoom = () => {
    if (joinCode.length < 4) return;
    setMode("teamup");
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimer(0);
    setGameOver(false);
    setIsPlaying(true);
    setCurrentPlayer("P1");
    setTeamScores({ P1: 0, P2: 0 });
    setOpponentJoined(false);
    const ch = setupChannel(joinCode.toUpperCase(), "P2");
    ch.postMessage({ type: "join" });
  };

  const startSolo = () => {
    setMode("solo");
    setCards(initCards());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimer(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  const handleCardClick = (cardId) => {
    if (gameOver || flipped.length >= 2) return;
    if (matched.includes(cardId) || flipped.includes(cardId)) return;

    if (mode === "teamup") {
      if (currentPlayer !== myRole || !opponentJoined) return;
    }

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      const card1 = cards.find(c => c.id === first);
      const card2 = cards.find(c => c.id === second);

      if (card1.emoji === card2.emoji) {
        // Match found
        const newMatched = [...matched, first, second];
        setMatched(newMatched);
        
        const newScores = mode === "teamup"
          ? { ...teamScores, [currentPlayer]: teamScores[currentPlayer] + 1 }
          : teamScores;
        setTeamScores(newScores);

        setTimeout(() => {
          setFlipped([]);
          if (mode === "teamup" && channelRef.current) {
            channelRef.current.postMessage({
              type: "flip", flipped: [], cards, matched: newMatched,
              currentPlayer, teamScores: newScores, moves: moves + 1,
            });
          }
        }, 600);
      } else {
        // No match — switch turn in teamup
        setTimeout(() => {
          setFlipped([]);
          const nextPlayer = mode === "teamup"
            ? currentPlayer === "P1" ? "P2" : "P1"
            : currentPlayer;
          setCurrentPlayer(nextPlayer);

          if (mode === "teamup" && channelRef.current) {
            channelRef.current.postMessage({
              type: "flip", flipped: [], cards, matched,
              currentPlayer: nextPlayer, teamScores, moves: moves + 1,
            });
          }
        }, 800);
      }

      // Broadcast flip immediately for visual sync
      if (mode === "teamup" && channelRef.current) {
        channelRef.current.postMessage({
          type: "flip", flipped: newFlipped, cards, matched,
          currentPlayer, teamScores, moves,
        });
      }
    } else if (mode === "teamup" && channelRef.current) {
      channelRef.current.postMessage({
        type: "flip", flipped: newFlipped, cards, matched,
        currentPlayer, teamScores, moves,
      });
    }
  };

  const restart = () => {
    const newCards = initCards();
    setCards(newCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimer(0);
    setGameOver(false);
    setIsPlaying(true);
    setCurrentPlayer("P1");
    setTeamScores({ P1: 0, P2: 0 });
    if (mode === "teamup" && channelRef.current) {
      channelRef.current.postMessage({ type: "restart" });
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

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
            <h1 className="text-2xl font-bold dark:text-white text-slate-900">Memory Match</h1>
          </div>

          <div className="text-center py-8">
            <div className="text-6xl mb-4">🧠💎</div>
            <h2 className="text-xl font-bold dark:text-white text-slate-900 mb-2">Choose Game Mode</h2>
            <p className="text-sm dark:text-gray-400 text-slate-500 mb-8">Test your memory solo or battle a friend!</p>

            <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <button onClick={startSolo}
                className="card-hover flex flex-col items-center gap-3 p-6 group hover:border-amber-500/60">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
                  <FiUser size={24} />
                </div>
                <span className="font-bold dark:text-white text-slate-900">Solo Mode</span>
                <span className="text-xs dark:text-gray-400 text-slate-500">Beat your best time</span>
              </button>

              <button onClick={createRoom}
                className="card-hover flex flex-col items-center gap-3 p-6 group hover:border-pink-500/60">
                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-110 transition">
                  <FiUsers size={24} />
                </div>
                <span className="font-bold dark:text-white text-slate-900">Create Room</span>
                <span className="text-xs dark:text-gray-400 text-slate-500">Challenge a developer</span>
              </button>
            </div>

            <div className="mt-8 max-w-sm mx-auto">
              <p className="text-xs dark:text-gray-500 text-slate-400 mb-2">Or join an existing room:</p>
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

  // ── Game Board ──
  return (
    <MainLayout>
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => { setMode(null); if (channelRef.current) channelRef.current.close(); setOpponentJoined(false); }}
              className="p-2 rounded-xl hover:bg-dark-600 text-gray-400 hover:text-white transition">
              <FiArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold dark:text-white text-slate-900">Memory Match</h1>
              <p className="text-xs dark:text-gray-400 text-slate-500">
                {mode === "solo" ? "Find all pairs!" : `Room: ${roomCode} • You are ${myRole}`}
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
        <div className={`grid ${mode === "teamup" ? "grid-cols-4" : "grid-cols-3"} gap-3`}>
          <div className="card text-center py-3">
            <p className="text-2xl font-extrabold text-amber-400">{moves}</p>
            <p className="text-xs dark:text-gray-400 text-slate-500 mt-1">🎯 Moves</p>
          </div>
          <div className="card text-center py-3">
            <p className="text-2xl font-extrabold text-cyan-400">{formatTime(timer)}</p>
            <p className="text-xs dark:text-gray-400 text-slate-500 mt-1"><FiClock size={11} className="inline" /> Time</p>
          </div>
          {mode === "solo" ? (
            <div className="card text-center py-3">
              <p className="text-2xl font-extrabold text-purple-400">{bestTime < 999 ? formatTime(bestTime) : "—"}</p>
              <p className="text-xs dark:text-gray-400 text-slate-500 mt-1">🏆 Best</p>
            </div>
          ) : (
            <>
              <div className={`card text-center py-3 ${currentPlayer === "P1" ? "border-purple-500/50 bg-purple-500/5" : ""}`}>
                <p className="text-2xl font-extrabold text-purple-400">{teamScores.P1}</p>
                <p className="text-xs dark:text-gray-400 text-slate-500 mt-1">P1 {myRole === "P1" ? "(You)" : ""}</p>
              </div>
              <div className={`card text-center py-3 ${currentPlayer === "P2" ? "border-pink-500/50 bg-pink-500/5" : ""}`}>
                <p className="text-2xl font-extrabold text-pink-400">{teamScores.P2}</p>
                <p className="text-xs dark:text-gray-400 text-slate-500 mt-1">P2 {myRole === "P2" ? "(You)" : ""}</p>
              </div>
            </>
          )}
        </div>

        {/* Turn indicator for TeamUp */}
        {mode === "teamup" && (
          <div className={`text-center py-2 rounded-xl text-sm font-bold border ${
            !opponentJoined
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
              : currentPlayer === myRole
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-dark-750 border-dark-600 dark:text-gray-400 text-slate-500"
          }`}>
            {!opponentJoined ? "⏳ Waiting for opponent..." :
              currentPlayer === myRole ? "✨ Your Turn — Pick a card!" : "⏳ Opponent's Turn"}
          </div>
        )}

        {/* Game Over */}
        {gameOver && (
          <div className="text-center py-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/30">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-lg font-bold dark:text-white text-slate-900">
              {mode === "teamup"
                ? teamScores.P1 > teamScores.P2
                  ? `Player 1 Wins! (${teamScores.P1}-${teamScores.P2})`
                  : teamScores.P2 > teamScores.P1
                  ? `Player 2 Wins! (${teamScores.P2}-${teamScores.P1})`
                  : "It's a Tie!"
                : `Completed in ${formatTime(timer)} with ${moves} moves!`}
            </h2>
            {mode === "solo" && timer <= bestTime && timer > 0 && (
              <p className="text-sm text-amber-400 font-semibold mt-1">🏆 New Best Time!</p>
            )}
          </div>
        )}

        {/* Card Grid */}
        <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
          {cards.map((card) => {
            const isFlippedOrMatched = flipped.includes(card.id) || matched.includes(card.id);
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={isFlippedOrMatched || flipped.length >= 2 || gameOver}
                className={`aspect-square rounded-2xl text-3xl flex items-center justify-center transition-all duration-300 border-2 relative
                  ${matched.includes(card.id)
                    ? "bg-green-500/10 border-green-500/40 scale-95 opacity-70"
                    : isFlippedOrMatched
                    ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/40 scale-105"
                    : "bg-dark-800 border-dark-600 hover:border-purple-500/50 hover:bg-dark-700 cursor-pointer hover:scale-105 active:scale-95"
                  }
                `}
                style={{
                  transform: isFlippedOrMatched ? "rotateY(0deg)" : "rotateY(0deg)",
                }}
              >
                {isFlippedOrMatched ? (
                  <span className="drop-shadow-lg">{card.emoji}</span>
                ) : (
                  <span className="text-dark-500 text-2xl">?</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <button onClick={restart} className="btn-secondary flex items-center gap-2">
            <FiRotateCcw size={15} /> Restart
          </button>
          <button onClick={() => { setMode(null); if (channelRef.current) channelRef.current.close(); setOpponentJoined(false); }}
            className="btn-ghost">
            Exit Game
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default MemoryGame;
