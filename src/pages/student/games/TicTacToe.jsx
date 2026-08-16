import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../../components/layout/MainLayout";
import { FiArrowLeft, FiRotateCcw, FiUsers, FiUser, FiCopy, FiCheck, FiZap } from "react-icons/fi";

// ── AI Logic (Minimax) ──
const checkWinner = (board) => {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a,b,c] };
    }
  }
  return null;
};

const minimax = (board, isMaximizing) => {
  const result = checkWinner(board);
  if (result?.winner === "O") return 10;
  if (result?.winner === "X") return -10;
  if (board.every(c => c)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        best = Math.max(best, minimax(board, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "X";
        best = Math.min(best, minimax(board, true));
        board[i] = null;
      }
    }
    return best;
  }
};

const getAIMove = (board) => {
  let bestScore = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = "O";
      const score = minimax(board, false);
      board[i] = null;
      if (score > bestScore) { bestScore = score; bestMove = i; }
    }
  }
  return bestMove;
};

const generateRoomCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [mode, setMode] = useState(null); // null | 'solo' | 'teamup'
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winLine, setWinLine] = useState(null);
  const [animatingCell, setAnimatingCell] = useState(null);

  // TeamUp state
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [myRole, setMyRole] = useState(null); // 'X' or 'O'
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [copied, setCopied] = useState(false);
  const channelRef = useRef(null);

  // ── TeamUp: BroadcastChannel ──
  const setupChannel = useCallback((code, role) => {
    if (channelRef.current) channelRef.current.close();
    const ch = new BroadcastChannel(`ttt-room-${code}`);
    channelRef.current = ch;
    setMyRole(role);
    setRoomCode(code);

    ch.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === "join" && role === "X") {
        setOpponentJoined(true);
        ch.postMessage({ type: "welcome" });
      }
      if (msg.type === "welcome" && role === "O") {
        setOpponentJoined(true);
      }
      if (msg.type === "move") {
        setBoard(msg.board);
        setIsXNext(msg.isXNext);
      }
      if (msg.type === "restart") {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setGameOver(false);
        setWinLine(null);
      }
    };

    return ch;
  }, []);

  const createRoom = () => {
    const code = generateRoomCode();
    setMode("teamup");
    setupChannel(code, "X");
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
    setWinLine(null);
    setOpponentJoined(false);
  };

  const joinRoom = () => {
    if (joinCode.length < 4) return;
    setMode("teamup");
    const ch = setupChannel(joinCode.toUpperCase(), "O");
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
    setWinLine(null);
    setOpponentJoined(false);
    ch.postMessage({ type: "join" });
  };

  const startSolo = () => {
    setMode("solo");
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
    setWinLine(null);
  };

  // ── Check winner on board change ──
  useEffect(() => {
    const result = checkWinner(board);
    if (result) {
      setWinLine(result.line);
      setGameOver(true);
      setScores(s => ({ ...s, [result.winner]: s[result.winner] + 1 }));
    } else if (board.every(c => c)) {
      setGameOver(true);
      setScores(s => ({ ...s, draw: s.draw + 1 }));
    }
  }, [board]);

  // ── AI move ──
  useEffect(() => {
    if (mode === "solo" && !isXNext && !gameOver && board.some(c => !c)) {
      const timer = setTimeout(() => {
        const move = getAIMove([...board]);
        if (move !== -1) {
          const newBoard = [...board];
          newBoard[move] = "O";
          setAnimatingCell(move);
          setTimeout(() => setAnimatingCell(null), 300);
          setBoard(newBoard);
          setIsXNext(true);
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isXNext, mode, gameOver, board]);

  const handleClick = (i) => {
    if (board[i] || gameOver) return;

    if (mode === "teamup") {
      const currentTurn = isXNext ? "X" : "O";
      if (currentTurn !== myRole) return; // not your turn
      if (!opponentJoined) return;
    }

    if (mode === "solo" && !isXNext) return; // AI's turn

    const newBoard = [...board];
    newBoard[i] = isXNext ? "X" : "O";
    setAnimatingCell(i);
    setTimeout(() => setAnimatingCell(null), 300);
    setBoard(newBoard);
    setIsXNext(!isXNext);

    if (mode === "teamup" && channelRef.current) {
      channelRef.current.postMessage({
        type: "move",
        board: newBoard,
        isXNext: !isXNext,
      });
    }
  };

  const restart = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
    setWinLine(null);
    if (mode === "teamup" && channelRef.current) {
      channelRef.current.postMessage({ type: "restart" });
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const result = checkWinner(board);
  const statusText = gameOver
    ? result
      ? `${result.winner === "X" ? "❌" : "⭕"} ${result.winner} Wins!`
      : "🤝 It's a Draw!"
    : mode === "teamup" && !opponentJoined
    ? "⏳ Waiting for opponent..."
    : `${isXNext ? "❌ X" : "⭕ O"}'s Turn ${mode === "teamup" ? (isXNext ? "X" : "O") === myRole ? "(Your Turn!)" : "(Opponent's Turn)" : ""}`;

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
            <h1 className="text-2xl font-bold dark:text-white text-slate-900">Tic Tac Toe</h1>
          </div>

          <div className="text-center py-8">
            <div className="text-6xl mb-4">❌⭕</div>
            <h2 className="text-xl font-bold dark:text-white text-slate-900 mb-2">Choose Game Mode</h2>
            <p className="text-sm dark:text-gray-400 text-slate-500 mb-8">Play solo against AI or invite a friend!</p>

            <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <button onClick={startSolo}
                className="card-hover flex flex-col items-center gap-3 p-6 group hover:border-purple-500/60">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
                  <FiUser size={24} />
                </div>
                <span className="font-bold dark:text-white text-slate-900">Solo vs AI</span>
                <span className="text-xs dark:text-gray-400 text-slate-500">Challenge the unbeatable AI</span>
              </button>

              <button onClick={createRoom}
                className="card-hover flex flex-col items-center gap-3 p-6 group hover:border-cyan-500/60">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                  <FiUsers size={24} />
                </div>
                <span className="font-bold dark:text-white text-slate-900">Create Room</span>
                <span className="text-xs dark:text-gray-400 text-slate-500">Host a game & share code</span>
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
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => { setMode(null); if (channelRef.current) channelRef.current.close(); setOpponentJoined(false); }}
              className="p-2 rounded-xl hover:bg-dark-600 text-gray-400 hover:text-white transition">
              <FiArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold dark:text-white text-slate-900">Tic Tac Toe</h1>
              <p className="text-xs dark:text-gray-400 text-slate-500">
                {mode === "solo" ? "Solo vs AI" : `TeamUp Room: ${roomCode}`}
                {mode === "teamup" && ` • You are ${myRole}`}
              </p>
            </div>
          </div>
          {mode === "teamup" && (
            <button onClick={copyCode}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
              {copied ? <><FiCheck size={13} /> Copied!</> : <><FiCopy size={13} /> Copy Code</>}
            </button>
          )}
        </div>

        {/* Scoreboard */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card text-center py-3">
            <p className="text-2xl font-extrabold text-purple-400">{scores.X}</p>
            <p className="text-xs dark:text-gray-400 text-slate-500 mt-1">❌ X {mode === "teamup" && myRole === "X" ? "(You)" : mode === "solo" ? "(You)" : ""}</p>
          </div>
          <div className="card text-center py-3">
            <p className="text-2xl font-extrabold dark:text-gray-400 text-slate-500">{scores.draw}</p>
            <p className="text-xs dark:text-gray-400 text-slate-500 mt-1">🤝 Draw</p>
          </div>
          <div className="card text-center py-3">
            <p className="text-2xl font-extrabold text-cyan-400">{scores.O}</p>
            <p className="text-xs dark:text-gray-400 text-slate-500 mt-1">⭕ O {mode === "teamup" && myRole === "O" ? "(You)" : mode === "solo" ? "(AI)" : ""}</p>
          </div>
        </div>

        {/* Status */}
        <div className={`text-center py-3 rounded-xl font-bold text-sm border transition-all duration-300 ${
          gameOver
            ? result
              ? "bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/30 dark:text-white text-slate-900"
              : "bg-amber-500/10 border-amber-500/30 text-amber-400"
            : "bg-dark-750 border-dark-600 dark:text-gray-300 text-slate-600"
        }`}>
          {statusText}
        </div>

        {/* Board */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={!!cell || gameOver || (mode === "teamup" && !opponentJoined)}
              className={`aspect-square rounded-2xl text-3xl font-extrabold flex items-center justify-center transition-all duration-200
                border-2 relative overflow-hidden
                ${cell ? "cursor-default" : "cursor-pointer hover:scale-105 active:scale-95"}
                ${winLine?.includes(i)
                  ? "bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-purple-400 shadow-lg shadow-purple-500/20 scale-105"
                  : cell
                  ? "bg-dark-750 border-dark-500 dark:border-dark-500"
                  : "bg-dark-800 border-dark-600 hover:border-purple-500/50 hover:bg-dark-700"
                }
                ${animatingCell === i ? "animate-bounce" : ""}
              `}
            >
              {cell === "X" && <span className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">✕</span>}
              {cell === "O" && <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">○</span>}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <button onClick={restart} className="btn-secondary flex items-center gap-2">
            <FiRotateCcw size={15} /> New Round
          </button>
          <button onClick={() => { setMode(null); setScores({ X: 0, O: 0, draw: 0 }); if (channelRef.current) channelRef.current.close(); setOpponentJoined(false); }}
            className="btn-ghost">
            Exit Game
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default TicTacToe;
