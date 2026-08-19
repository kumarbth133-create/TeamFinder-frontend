import { Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import { useAuth } from "../../context/AuthContext";
import {
  FiZap, FiUsers, FiUser, FiArrowRight, FiCpu, FiTarget,
} from "react-icons/fi";

const games = [
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    emoji: "❌⭕",
    description: "Classic X vs O battle. Play against a smart AI or challenge your teammate in a real-time match!",
    color: "purple",
    gradient: "from-purple-500/10 to-cyan-500/10",
    border: "hover:border-purple-500/60",
    iconBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    tag: "Strategy",
    multiplayer: true,
    difficulty: "Easy",
    path: "/game-zone/tic-tac-toe",
  },
  {
    id: "snake",
    title: "Snake Game",
    emoji: "🐍",
    description: "Navigate the snake, eat food, grow longer! Don't crash into walls or yourself. Beat your high score!",
    color: "cyan",
    gradient: "from-cyan-500/10 to-teal-500/10",
    border: "hover:border-cyan-500/60",
    iconBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
    tag: "Arcade",
    multiplayer: false,
    difficulty: "Medium",
    path: "/game-zone/snake",
  },
  {
    id: "memory",
    title: "Memory Match",
    emoji: "🧠💎",
    description: "Flip cards and find matching pairs. Test your memory solo or compete turn-by-turn with a friend!",
    color: "amber",
    gradient: "from-amber-500/10 to-pink-500/10",
    border: "hover:border-amber-500/60",
    iconBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    tag: "Puzzle",
    multiplayer: true,
    difficulty: "Easy",
    path: "/game-zone/memory",
  },
  {
    id: "typing-race",
    title: "Typing Speed Race",
    emoji: "⌨️🏎️",
    description: "How fast can you type? Race against the clock or challenge a developer friend to a WPM battle!",
    color: "green",
    gradient: "from-green-500/10 to-emerald-500/10",
    border: "hover:border-green-500/60",
    iconBg: "bg-green-500/10 border-green-500/30 text-green-400",
    tag: "Speed",
    multiplayer: true,
    difficulty: "All Levels",
    path: "/game-zone/typing-race",
  },
];

const difficultyColor = {
  Easy: "bg-green-500/10 text-green-400 border-green-500/30",
  Medium: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Hard: "bg-red-500/10 text-red-400 border-red-500/30",
  "All Levels": "bg-purple-500/10 text-purple-400 border-purple-500/30",
};

const GameZone = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Hero Banner (Vibrant Crimson Gradient Banner matching Dashboard) */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#990012] via-[#ca0019] to-[#e6001c] text-white py-4 px-5 sm:py-5 sm:px-6 shadow-lg shadow-[#ca0019]/25 border border-white/20 hover:shadow-xl hover:shadow-[#ca0019]/30 transition-all duration-300">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/15 text-white border border-white/30 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-sm">
                <FiZap size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-white/90">
                    TeamUp Game Zone
                  </span>
                  <span className="text-[10px] bg-white/20 text-white px-2.5 py-0.5 rounded-full font-bold border border-white/30">
                    Interactive Fun ✨
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  Take a Break, Play & Connect!
                </h1>
              </div>
            </div>

            {/* Quick Stats Badges inside Banner */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-white/15 border border-white/25 text-xs font-bold text-white flex items-center gap-1.5">
                <FiCpu size={14} /> 4 Games
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/15 border border-white/25 text-xs font-bold text-white flex items-center gap-1.5">
                <FiUsers size={14} /> 3 Multiplayer
              </span>
            </div>
          </div>
        </div>

        {/* How TeamUp Works */}
        <div className="card">
          <h2 className="text-sm font-bold dark:text-gray-200 text-slate-800 mb-3 flex items-center gap-2">
            <FiUsers size={16} className="text-[#ca0019]" />
            How TeamUp Multiplayer Works
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-dark-800 border border-slate-200/90 dark:border-dark-600 hover:border-[#ca0019]/60 hover:shadow-md hover:shadow-[#ca0019]/15 hover:scale-[1.008] transition-all duration-300 group">
              <span className="w-6 h-6 rounded-lg bg-[#ca0019]/10 text-[#ca0019] dark:bg-[#ca0019]/20 dark:text-rose-400 group-hover:bg-[#ca0019] group-hover:text-white flex items-center justify-center font-bold text-xs shrink-0 border border-[#ca0019]/30 transition-all">1</span>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#ca0019] transition-colors">Create Room</p>
                <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">Click "Play" → choose "Create Room" to get a 6-digit code</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-dark-800 border border-slate-200/90 dark:border-dark-600 hover:border-[#ca0019]/60 hover:shadow-md hover:shadow-[#ca0019]/15 hover:scale-[1.008] transition-all duration-300 group">
              <span className="w-6 h-6 rounded-lg bg-[#ca0019]/10 text-[#ca0019] dark:bg-[#ca0019]/20 dark:text-rose-400 group-hover:bg-[#ca0019] group-hover:text-white flex items-center justify-center font-bold text-xs shrink-0 border border-[#ca0019]/30 transition-all">2</span>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#ca0019] transition-colors">Share Code</p>
                <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">Send the room code to your friend / teammate</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-dark-800 border border-slate-200/90 dark:border-dark-600 hover:border-[#ca0019]/60 hover:shadow-md hover:shadow-[#ca0019]/15 hover:scale-[1.008] transition-all duration-300 group">
              <span className="w-6 h-6 rounded-lg bg-[#ca0019]/10 text-[#ca0019] dark:bg-[#ca0019]/20 dark:text-rose-400 group-hover:bg-[#ca0019] group-hover:text-white flex items-center justify-center font-bold text-xs shrink-0 border border-[#ca0019]/30 transition-all">3</span>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#ca0019] transition-colors">Play Together!</p>
                <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">They enter the code and you both play in real-time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div>
          <h2 className="section-header flex items-center gap-2">
            <span>🎮</span> All Games
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            {games.map((game) => (
              <div
                key={game.id}
                className={`card-hover flex flex-col justify-between overflow-hidden group ${game.border}`}
              >
                {/* Game Card Header */}
                <div className={`rounded-xl bg-gradient-to-br ${game.gradient} p-5 mb-4 text-center border border-dark-600 group-hover:border-opacity-60 transition`}>
                  <div className="text-5xl mb-2 group-hover:scale-110 transition duration-300">
                    {game.emoji}
                  </div>
                  <h3 className="text-lg font-extrabold dark:text-white text-slate-900">{game.title}</h3>
                </div>

                {/* Info */}
                <div className="space-y-3 flex-1">
                  <p className="text-xs dark:text-gray-400 text-slate-500 leading-relaxed">
                    {game.description}
                  </p>

                  {/* Tags */}
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${difficultyColor[game.difficulty]}`}>
                      {game.difficulty}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-dark-800 dark:bg-dark-800 text-gray-400 border border-dark-600">
                      {game.tag}
                    </span>
                    {game.multiplayer ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                        <FiUsers size={10} /> TeamUp
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-dark-800 dark:bg-dark-800 text-gray-500 border border-dark-600 flex items-center gap-1">
                        <FiUser size={10} /> Solo Only
                      </span>
                    )}
                  </div>
                </div>

                {/* Action */}
                <div className="pt-4 mt-4 border-t border-dark-600 dark:border-dark-600 border-slate-200">
                  <Link
                    to={game.path}
                    className="btn-primary w-full text-sm py-2.5 flex items-center justify-center gap-2 group-hover:shadow-lg transition"
                  >
                    <FiZap size={15} /> Play Now <FiArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Footer */}
        <div className="text-center py-6">
          <p className="text-xs dark:text-gray-500 text-slate-400">
            🎮 More games coming soon! Have a game idea?{" "}
            <Link to="/projects/create" className="text-primary-400 hover:underline font-semibold">
              Create a project
            </Link>{" "}
            and build it with your team!
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default GameZone;
