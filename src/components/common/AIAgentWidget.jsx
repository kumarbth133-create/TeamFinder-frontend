import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import logoImg from "../../assets/logo.png";
import {
  FiSend,
  FiX,
  FiMaximize2,
  FiMinimize2,
  FiTrash2,
  FiCpu,
  FiCopy,
  FiCheck,
  FiChevronDown,
  FiZap,
  FiStar,
  FiCompass,
  FiLayers,
  FiUsers,
  FiCode,
  FiArrowRight,
} from "react-icons/fi";

const INITIAL_GREETING = (name) => ({
  id: "init-1",
  sender: "ai",
  text: `Hello **${name || "Student"}**! 👋 I am your **TeamUp Copilot**.\n\nI can help you:\n- 💡 **Brainstorm unique project ideas**\n- 🔍 **Find open projects matching your skills**\n- 🛠️ **Recommend optimal tech stacks & architectures**\n- 📋 **Generate 4-week sprint roadmaps**\n- 👥 **Form high-performing student teams**\n\nWhat would you like to build or explore today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
});

const QUICK_PROMPTS = [
  { icon: <FiZap className="text-amber-400" />, label: "Project Ideas", text: "Suggest 3 unique project ideas combining MERN stack and AI with real-world impact." },
  { icon: <FiUsers className="text-rose-400" />, label: "Find Matching Projects", text: "What open projects currently on TeamUp match my skills and profile?" },
  { icon: <FiLayers className="text-blue-400" />, label: "Tech Stack Advice", text: "Recommend the best tech stack, database, and authentication setup for a collaborative web app." },
  { icon: <FiCompass className="text-emerald-400" />, label: "4-Week Roadmap", text: "Create a 4-week step-by-step sprint roadmap for building a web application with a 4-person team." },
];

const AIAgentWidget = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [unreadBadge, setUnreadBadge] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize messages once user is available
  useEffect(() => {
    if (user && messages.length === 0) {
      const firstName = user?.name ? user.name.split(" ")[0] : "Student";
      setMessages([INITIAL_GREETING(firstName)]);
    }
  }, [user]);

  // Scroll to bottom whenever messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadBadge(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  // Copy code or text snippet
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Clear conversation
  const handleClearChat = () => {
    const firstName = user?.name ? user.name.split(" ")[0] : "Student";
    setMessages([INITIAL_GREETING(firstName)]);
  };

  // Extract current project ID if on project detail page
  const getCurrentProjectId = () => {
    const match = location.pathname.match(/\/projects\/([a-f\d]{24})/i);
    return match ? match[1] : null;
  };

  // Client-side instant Project Intelligence Fallback
  const generateLocalProjectResponse = (query, currentUser) => {
    const q = query.toLowerCase();
    const name = currentUser?.name ? currentUser.name.split(" ")[0] : "Student";
    const skills = Array.isArray(currentUser?.skills) ? currentUser.skills.join(", ") : "Web Development";

    if (q.includes("roadmap") || q.includes("sprint") || q.includes("plan") || q.includes("timeline") || q.includes("week")) {
      return `### 📋 4-Week Agile Sprint Roadmap for Your Project

Here is a step-by-step 4-week execution blueprint designed for student teams:

#### 🔹 Week 1: Architecture, Wireframes & Setup
- **Goal:** Project setup and database design.
- **Tasks:**
  - Define user stories and database schemas (Users, Projects, Features).
  - Create Figma mockups and choose color palette/tokens.
  - Setup Git repository with \`main\` and \`develop\` branch protection.
  - Initialize frontend (React + Tailwind) and backend (Node.js/Express) boilerplate.

#### 🔹 Week 2: Authentication & Core Backend APIs
- **Goal:** Robust server and authentication flow.
- **Tasks:**
  - Implement JWT authentication (Register, Login, Password Reset).
  - Build CRUD REST endpoints for your main resources.
  - Test all endpoints in Postman / Thunder Client.
  - Setup cloud database (MongoDB Atlas / PostgreSQL).

#### 🔹 Week 3: Frontend Integration & State Management
- **Goal:** Connect UI to backend APIs.
- **Tasks:**
  - Implement protected routes and global auth context.
  - Create responsive dashboard, forms, and search filters.
  - Add toast notifications, error handling, and loading states.
  - Integrate interactive components (chat, cards, file upload).

#### 🔹 Week 4: Testing, Polish & Deployment
- **Goal:** Ship a production-ready application.
- **Tasks:**
  - Conduct peer testing, fix UI responsiveness and edge cases.
  - Deploy backend to Render/Railway/Vercel with secure \`.env\` variables.
  - Deploy frontend to Vercel/Netlify.
  - Record a 2-minute demo video and prepare README documentation!

💡 **Pro-Tip:** Hold 15-minute standup syncs twice a week to keep the entire team aligned!`;
    }

    if (q.includes("idea") || q.includes("suggest") || q.includes("brainstorm") || q.includes("build")) {
      return `### 💡 High-Impact Project Ideas for You & Your Team:

1. **AI-Powered Campus Team & Skill Matcher (Like TeamUp)**
   - **Stack:** MERN Stack (React, Node, Express, MongoDB) + Gemini/OpenAI API + TailwindCSS.
   - **Features:** Resume skill extraction, automated teammate recommendation, real-time collaboration canvas.
   - **Team Roles:** 1 Frontend Lead, 1 Backend/API Dev, 1 AI/NLP Specialist.

2. **Real-time Collaborative Code Review & Pair-Programming Arena**
   - **Stack:** React, Tailwind, Node.js, WebSockets / Socket.io, Docker code sandbox.
   - **Features:** Shared live code editor, syntax error detection bot, audio/chat rooms.

3. **Student Hackathon & Milestone Project Tracker**
   - **Stack:** Next.js / Vite, Express, PostgreSQL / MongoDB, Cloudinary.
   - **Features:** Milestone progress bars, submission deadline alerts, automated mentor review workflow.

👉 You can click **+ Create Project** in the sidebar to publish any of these ideas on TeamUp!`;
    }

    if (q.includes("tech stack") || q.includes("stack") || q.includes("technology") || q.includes("database")) {
      return `### 🛠️ Recommended Tech Stacks by Project Type:

#### 1. 🌐 Modern Full-Stack Web App (Recommended)
- **Frontend:** React.js (Vite) + TailwindCSS + React Router + React Icons.
- **Backend:** Node.js with Express.js (Modular MVC architecture).
- **Database:** MongoDB Atlas (Mongoose ODM) for flexibility, or PostgreSQL (Prisma ORM) for relational data.
- **Auth:** JWT (JSON Web Tokens) with bcrypt password hashing.

#### 2. ⚡ Real-Time & Collaborative Platform
- **Frontend:** React + Zustand / Redux Toolkit.
- **Realtime Layer:** Socket.io / WebSockets for live notifications & chat.
- **Caching:** Redis for session store and fast message queuing.

#### 3. 🤖 AI-Integrated Modern Stack
- **AI Core:** LangChain / FastAPI (Python) or Direct Gemini / Groq API calls in Node.js.
- **Vector Search:** ChromaDB, Pinecone, or pgvector.
- **UI:** Server-Sent Events (SSE) for streaming typewriter answers.`;
    }

    if (q.includes("match") || q.includes("find project") || q.includes("my skills") || q.includes("teammate")) {
      return `### 🔍 Project Matching & Team Formation for **${name}**

- **Your Profile Skills:** \`${skills}\`

💡 **How to find the best project on TeamUp:**
1. Navigate to the **Browse Projects** page from the sidebar.
2. Use the search bar to filter by your primary skills (e.g. \`React\`, \`Node.js\`, \`Python\`).
3. Click on any project card to view the team lead, open slots, and description.
4. Click **Send Join Request** with a brief note highlighting your skills!

✨ Want to lead your own team? Click **Create Project** and list the roles you need!`;
    }

    return `### 🤖 TeamUp AI Copilot Response

Hello **${name}**! Regarding *"**${query}**"*:

Here are my top recommendations for your project journey:
1. **Define the MVP:** Focus on solving a single real-world problem effectively before adding complex features.
2. **Team Roles:** Distribute responsibilities clearly (e.g. Frontend UI, Backend API, Database, Testing).
3. **Collaboration:** Use GitHub branches with pull request reviews and set clear weekly milestone deliverables.
4. **TeamUp Platform:** You can discover projects in **Browse Projects**, create your own under **Create Project**, or connect with expert guidance under **Find Mentors**!

Feel free to ask me for a **tech stack recommendation**, **4-week sprint roadmap**, or **project ideas**!`;
  };

  // Send message
  const handleSend = async (textToSend) => {
    const query = (typeof textToSend === "string" ? textToSend : input).trim();
    if (!query || loading) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const { data } = await API.post("/ai/chat", {
        message: query,
        conversationHistory: history,
        currentProjectId: getCurrentProjectId(),
      });

      const replyText = data?.data?.reply || generateLocalProjectResponse(query, user);

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn("Backend AI query fallback activated:", err?.message);
      // Seamlessly generate high quality response with local project intelligence engine
      const fallbackReply = generateLocalProjectResponse(query, user);
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Format simple markdown into styled JSX (bold, bullet points, headers, code)
  const renderFormattedMessage = (content, msgId) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      // Header 3: ###
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="font-bold text-sm sm:text-base text-slate-900 dark:text-rose-300 mt-2 mb-1">
            {line.replace("### ", "")}
          </h4>
        );
      }
      // Header 4: ####
      if (line.startsWith("#### ")) {
        return (
          <h5 key={idx} className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-rose-200 mt-2 mb-0.5">
            {line.replace("#### ", "")}
          </h5>
        );
      }
      // List items with bullet: - or *
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const itemText = line.trim().replace(/^[-*]\s+/, "");
        return (
          <div key={idx} className="flex items-start gap-2 my-0.5 pl-1">
            <span className="text-[#ca0019] dark:text-rose-400 mt-1 text-xs">•</span>
            <div className="flex-1 text-xs sm:text-sm" dangerouslySetInnerHTML={{ __html: parseInlineStyles(itemText) }} />
          </div>
        );
      }
      // Numbered lists: 1. 2.
      if (/^\d+\.\s/.test(line.trim())) {
        const num = line.trim().match(/^(\d+)\.\s/)[1];
        const itemText = line.trim().replace(/^\d+\.\s+/, "");
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-1">
            <span className="font-bold text-[#ca0019] dark:text-rose-400 text-xs mt-0.5">{num}.</span>
            <div className="flex-1 text-xs sm:text-sm" dangerouslySetInnerHTML={{ __html: parseInlineStyles(itemText) }} />
          </div>
        );
      }
      // Code block lines or tables (fallback simple display)
      if (line.trim().startsWith("|") || line.trim().startsWith("```")) {
        return (
          <div key={idx} className="font-mono text-[11px] bg-slate-100 dark:bg-dark-900 px-2 py-1 rounded my-1 text-slate-800 dark:text-slate-200 overflow-x-auto">
            {line}
          </div>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      // Normal paragraph
      return (
        <p
          key={idx}
          className="text-xs sm:text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: parseInlineStyles(line) }}
        />
      );
    });
  };

  // Helper to parse **bold** and `code` and [links](/url)
  const parseInlineStyles = (str) => {
    if (!str) return "";
    let parsed = str
      .replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-slate-900 dark:text-white'>$1</strong>")
      .replace(/`([^`]+)`/g, "<code class='bg-slate-200/80 dark:bg-dark-900 text-[#ca0019] dark:text-rose-400 px-1.5 py-0.5 rounded text-[11px] font-mono'>$1</code>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2' class='text-[#ca0019] dark:text-rose-400 font-semibold underline hover:opacity-80'>$1</a>");
    return parsed;
  };

  // If user is not logged in, do not render the widget
  if (!user) return null;

  return (
    <div className="fixed z-50 right-4 bottom-4 sm:right-6 sm:bottom-6 font-sans">
      {/* ── Floating Action Trigger Button (When Closed) ── */}
      {!isOpen && (
        <div className="relative group cursor-pointer">
          {/* Unread / Notification Sparkle Badge */}
          {unreadBadge && (
            <span className="absolute -top-1.5 -right-1.5 z-10 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#ca0019] text-[9px] text-white font-black items-center justify-center shadow-md">
                1
              </span>
            </span>
          )}

          {/* Glowing Ambient Aura */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#ca0019] via-rose-600 to-amber-500 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:duration-200"></div>

          {/* Trigger Pill Button (Flexing & Modern) */}
          <button
            id="teamup-ai-copilot-trigger"
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-3 pl-2.5 pr-4 py-2 bg-gradient-to-r from-slate-950 via-[#15090c] to-slate-950 text-white rounded-full shadow-2xl border border-rose-500/50 hover:border-rose-400 hover:shadow-[0_0_30px_rgba(202,0,25,0.4)] hover:scale-[1.04] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ease-out backdrop-blur-xl"
            aria-label="Open TeamUp AI Project Copilot"
          >
            {/* Logo Badge with External Online Radar Ping */}
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-[#ca0019] shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src={logoImg}
                  alt="TeamUp AI"
                  className="w-full h-full object-contain scale-[1.45] transform origin-center"
                />
              </div>
              {/* Green Online Radar Pulse */}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>

            {/* Centered Flex Typography */}
            <div className="text-left hidden sm:flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wide text-white leading-tight">
                  TeamUp Copilot
                </span>
                <span className="text-[10px] text-amber-400 animate-pulse">✨</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5 font-medium group-hover:text-slate-300 transition-colors">
                Ask questions & advice
              </p>
            </div>

            {/* Interactive Slide Arrow Indicator */}
            <div className="hidden sm:flex items-center text-slate-500 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all duration-200 ml-0.5">
              <FiArrowRight size={13} />
            </div>
          </button>
        </div>
      )}

      {/* ── Chat Modal / Panel (When Open) ── */}
      {isOpen && (
        <div
          className={`flex flex-col bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-600 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ease-out backdrop-blur-xl ${
            isMaximized
              ? "w-[94vw] sm:w-[640px] h-[85vh] max-h-[750px]"
              : "w-[92vw] sm:w-[420px] h-[560px] max-h-[82vh]"
          }`}
          style={{ boxShadow: "0 25px 50px -12px rgba(202, 0, 25, 0.25)" }}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-dark-900 to-slate-950 text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-[#ca0019]/50 overflow-hidden shadow-sm flex-shrink-0">
                <img
                  src={logoImg}
                  alt="TeamUp AI"
                  className="w-full h-full object-contain scale-[1.45] transform origin-center"
                />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight text-white">TeamUp Copilot</h3>
                  <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-rose-500/30">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Project, Tech Stack & Teammate Assistant</p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Clear Chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <FiTrash2 size={14} />
              </button>
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                title={isMaximized ? "Restore Size" : "Maximize"}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition hidden sm:block"
              >
                {isMaximized ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-rose-600/60 transition"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar (Top Chips) */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-dark-900 border-b border-slate-200 dark:border-dark-700 flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-shrink-0">
            {QUICK_PROMPTS.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp.text)}
                disabled={loading}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white dark:bg-dark-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-dark-600 hover:border-[#ca0019] dark:hover:border-rose-400 hover:text-[#ca0019] dark:hover:text-rose-300 transition whitespace-nowrap shadow-2xs active:scale-95 disabled:opacity-50"
              >
                {qp.icon}
                <span>{qp.label}</span>
              </button>
            ))}
          </div>

          {/* Chat Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-dark-800">
            {messages.map((msg) => {
              const isAi = msg.sender === "ai";
              return (
                <div key={msg.id} className={`flex gap-2.5 ${isAi ? "items-start" : "items-end justify-end"}`}>
                  {isAi && (
                    <div className="w-7 h-7 rounded-xl bg-white border border-[#ca0019]/40 flex items-center justify-center overflow-hidden shadow-xs flex-shrink-0 mt-0.5">
                      <img
                        src={logoImg}
                        alt="AI"
                        className="w-full h-full object-contain scale-[1.45] transform origin-center"
                      />
                    </div>
                  )}

                  <div className={`relative max-w-[86%] sm:max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm shadow-xs ${
                    isAi
                      ? "bg-white dark:bg-dark-750 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-dark-600 rounded-tl-sm"
                      : "bg-gradient-to-r from-[#ca0019] to-rose-600 text-white rounded-br-sm shadow-md"
                  }`}>
                    {/* Copy Button for AI replies */}
                    {isAi && (
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded transition"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? <FiCheck size={12} className="text-emerald-500" /> : <FiCopy size={12} />}
                      </button>
                    )}

                    {/* Content */}
                    <div className="space-y-1 pr-4">
                      {isAi ? renderFormattedMessage(msg.text, msg.id) : <p className="whitespace-pre-wrap">{msg.text}</p>}
                    </div>

                    {/* Timestamp */}
                    <div className={`text-[10px] mt-1.5 text-right font-medium ${isAi ? "text-slate-400 dark:text-slate-500" : "text-rose-200"}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading / Thinking Indicator */}
            {loading && (
              <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 text-xs p-2">
                <div className="w-7 h-7 rounded-xl bg-white border border-[#ca0019]/40 flex items-center justify-center overflow-hidden shadow-xs flex-shrink-0 animate-pulse">
                  <img
                    src={logoImg}
                    alt="AI"
                    className="w-full h-full object-contain scale-[1.45] transform origin-center"
                  />
                </div>
                <div className="bg-white dark:bg-dark-750 border border-slate-200 dark:border-dark-600 rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#ca0019] animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-[#ca0019] animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#ca0019] animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium ml-1">Analyzing projects & thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Footer Action Suggestions */}
          <div className="px-3 py-1.5 bg-slate-100 dark:bg-dark-900/90 border-t border-slate-200 dark:border-dark-700 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-medium">
              <FiCode size={12} className="text-[#ca0019]" /> Project Intelligence
            </span>
            <div className="flex items-center gap-2">
              <Link to="/projects/create" onClick={() => setIsOpen(false)} className="hover:text-[#ca0019] underline font-semibold">
                + Create Project
              </Link>
              <span>•</span>
              <Link to="/projects" onClick={() => setIsOpen(false)} className="hover:text-[#ca0019] underline font-semibold">
                Browse Projects
              </Link>
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-dark-800 border-t border-slate-200 dark:border-dark-600 flex items-center gap-2 flex-shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about projects, tech stack, roadmap..."
              className="flex-1 bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-dark-600 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ca0019]/30 focus:border-[#ca0019] transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-gradient-to-r from-[#ca0019] to-rose-600 hover:from-primary-700 hover:to-primary-600 text-white rounded-xl shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 active:scale-95 flex items-center justify-center"
              aria-label="Send message"
            >
              <FiSend size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIAgentWidget;
