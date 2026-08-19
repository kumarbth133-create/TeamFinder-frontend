import teamImg from "../../assets/team.png";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/common/Spinner";
import ThemeToggle from "../../components/common/ThemeToggle";
import AppLogo from "../../components/common/AppLogo";
import API from "../../api/axios";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUsers,
  FiCheckCircle,
  FiArrowRight,
  FiZap,
  FiCode,
  FiBarChart2,
  FiX,
  FiUser,
  FiBook,
  FiChevronUp,
  FiChevronDown,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiInstagram,
  FiGlobe,
  FiHeart,
  FiArrowUp,
  FiMessageSquare,
  FiSend,
} from "react-icons/fi";

const Login = () => {
  const { login, register, loading, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin/dashboard" : "/dashboard", { replace: true });
    }
  }, [user, navigate]);

  // FAQ Accordion State
  const [openFaqs, setOpenFaqs] = useState({});
  const toggleFaq = (idx) => {
    setOpenFaqs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'signup'

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalProjects: 0,
    totalSkillsMatched: 0,
    evaluationAccuracy: 100,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/auth/stats");
        if (data?.success && data?.data) {
          setStats({
            totalStudents: data.data.totalStudents || 0,
            totalProjects: data.data.totalProjects || 0,
            totalSkillsMatched: data.data.totalSkillsMatched || 0,
            evaluationAccuracy: data.data.evaluationAccuracy || 100,
          });
        }
      } catch {
        /* fallback to default */
      }
    };
    fetchStats();
  }, []);

  const openModal = (mode = "login") => {
    setAuthMode(mode);
    setErrors({});
    setShowAuthModal(true);
  };

  const validate = () => {
    const errs = {};
    if (authMode === "signup" && !formData.name.trim()) errs.name = "Full Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = "Invalid email address";
    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 6) errs.password = "Min 6 characters required";
    if (authMode === "signup" && formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);

    if (authMode === "login") {
      const result = await login({ email: formData.email, password: formData.password });
      if (result.success) {
        setShowAuthModal(false);
        navigate(result.role === "admin" ? "/admin/dashboard" : "/dashboard");
      }
    } else {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        college: formData.college,
      });
      if (result.success) {
        setShowAuthModal(false);
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 overflow-x-hidden font-sans relative">

      {/* ── Fixed Floating Navigation Bar with Curved Corners ── */}
      <header className="fixed top-2 sm:top-3 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl bg-white/90 dark:bg-slate-950/90 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800/90 rounded-2xl sm:rounded-3xl z-50 shadow-md shadow-black/5 transition-all duration-200">
        <div className="px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">

          {/* Left Brand Logo with Red Outline & Beta badge */}
          <div className="flex items-center gap-2.5">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="p-1 rounded-xl border border-[#ca0019] shadow-sm flex items-center justify-center bg-white">
                <AppLogo size="sm" />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-[#ca0019] transition-colors">
                Team<span className="text-[#ca0019]">Up</span>
              </span>
              <span className="text-[11px] bg-[#ca0019]/10 text-[#ca0019] dark:bg-[#ca0019]/20 dark:text-rose-400 px-2 py-0.5 rounded-full font-extrabold tracking-wider border border-[#ca0019]/30">
                Beta
              </span>
            </Link>
          </div>

          {/* Center Navigation Links (Slimmer & Clean Spacing) */}
          <nav className="hidden md:flex items-center gap-1.5 sm:gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
            <Link to="/" className="hover:text-[#ca0019] px-3 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all">
              Home
            </Link>
            <a href="#about" className="hover:text-[#ca0019] px-3 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all">
              About Us
            </a>
            <a href="#features" className="hover:text-[#ca0019] px-3 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all">
              Features
            </a>
            <a href="#community" className="hover:text-[#ca0019] px-3 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all">
              Community
            </a>
            <a href="#faq" className="hover:text-[#ca0019] px-3 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all">
              FAQ
            </a>
            <a href="#contact" className="hover:text-[#ca0019] px-3 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all">
              Contact
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              to="/register?mode=login"
              className="text-xs sm:text-sm font-extrabold bg-[#ca0019] hover:bg-[#b00016] text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-md shadow-red-600/20 transition-all border border-[#ca0019] hover:scale-105 active:scale-95 cursor-pointer"
            >
              Log In
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Hero Card Layout (Matching Uniques Red Design) ── */}
      <section id="hero" className="px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-6 max-w-7xl mx-auto w-full">

        {/* Large Curved Crimson Red Hero Card Container (#ca0019 mixed theme) */}
        <div className="w-full rounded-[32px] sm:rounded-[40px] bg-gradient-to-r from-[#880010] via-[#ca0019] to-[#e6001c] text-white p-6 sm:p-10 lg:p-14 shadow-2xl shadow-[#ca0019]/30 border border-white/20 border-t-white/30 relative overflow-hidden">

          {/* Glowing Crimson Radial Orbs */}
          <div className="absolute -top-20 -right-20 w-[550px] h-[550px] bg-gradient-to-br from-[#ff2e48]/30 via-[#ca0019]/20 to-transparent rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] bg-gradient-to-tr from-[#55000a]/50 via-transparent to-transparent rounded-full blur-[80px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Column: Headline & Info (Col-span-7) */}
            <div className="lg:col-span-7">

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-sm">
                Match. Team Up. <span className="text-amber-300">Build.</span>
              </h1>

              <p className="text-sm sm:text-lg text-red-50 max-w-xl font-normal leading-relaxed mb-6">
                A smart developer team matching platform developed for college students and hackathon enthusiasts that brings peer skill search, team listings, and real-time collaboration together in one place.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/register?mode=signup"
                  className="bg-white text-[#ca0019] hover:bg-red-50 font-bold px-6 py-3 rounded-full text-sm shadow-lg shadow-black/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2"
                >
                  Get Started Free <FiArrowRight size={16} />
                </Link>
                <a
                  href="#features"
                  className="bg-black/20 hover:bg-black/30 backdrop-blur-md text-white font-semibold px-6 py-3 rounded-full text-sm border border-white/20 hover:border-white/40 transition-all duration-200 flex items-center gap-2"
                >
                  Explore Features
                </a>
              </div>
            </div>

            {/* Right Column: Team Illustration (Col-span-5) */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-none flex items-center justify-center">
                {/* Soft ambient backlight */}
                <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl transform scale-90 pointer-events-none" />
                <img
                  src={teamImg}
                  alt="Team Collaboration"
                  className="relative z-10 w-full max-h-[280px] sm:max-h-[340px] lg:max-h-[380px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Dark Capsule Stats Bar (Matching screenshot exact bottom capsule!) ── */}
        <div className="mt-6 w-full rounded-[24px] sm:rounded-[30px] bg-slate-900 dark:bg-slate-950 text-white p-6 border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800/60">
            <div className="pt-2 md:pt-0">
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{stats.totalStudents}</p>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Students Joined</p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{stats.totalProjects}</p>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Project Teams</p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{stats.totalSkillsMatched}</p>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Skills Matched</p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{stats.evaluationAccuracy}%</p>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Evaluation Accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Us Section ── */}
      <section id="about" className="py-20 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-red-900/30 transition-colors scroll-mt-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
            About <span className="text-[#ca0019]">TeamUp</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            TeamUp is built for college students, developers, designers, and creators to connect, form project teams based on complementary skills, and showcase innovative projects seamlessly.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-left">
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-red-950/20 border border-slate-200/90 dark:border-red-900/30 shadow-lg dark:shadow-none hover:border-[#ca0019]/60 hover:scale-[1.02] transition-all duration-300">
              <h3 className="text-base sm:text-lg lg:text-xl font-black text-[#ca0019] dark:text-red-400 mb-2.5">
                Find & Build
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Find teammates, collaborate, and work together on exciting projects.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-red-950/20 border border-slate-200/90 dark:border-red-900/30 shadow-lg dark:shadow-none hover:border-[#ca0019]/60 hover:scale-[1.02] transition-all duration-300">
              <h3 className="text-base sm:text-lg lg:text-xl font-black text-rose-600 dark:text-rose-400 mb-2.5">
                Learn & Get Guidance
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Connect with mentors, clear your doubts, and explore courses and learning resources.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-red-950/20 border border-slate-200/90 dark:border-red-900/30 shadow-lg dark:shadow-none hover:border-[#ca0019]/60 hover:scale-[1.02] transition-all duration-300">
              <h3 className="text-base sm:text-lg lg:text-xl font-black text-amber-600 dark:text-amber-400 mb-2.5">
                Ask & Enjoy
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Get instant answers with our AI chatbot and relax with our interactive Game Zone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900/60 border-t border-slate-200 dark:border-red-900/30 transition-colors scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
              Powerful <span className="text-[#ca0019]">Features</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              Everything you need to discover teammates, collaborate on code, and present your projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* 01: Skill Search */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-red-900/30 shadow-md dark:shadow-none hover:border-[#ca0019]/60 hover:scale-[1.02] transition-all">
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ca0019]/15 text-[#ca0019] dark:bg-[#ca0019]/25 dark:text-rose-400 flex items-center justify-center font-extrabold shrink-0">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">Skill Search</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Filter peers by skills like React, Node.js, Python, Figma, or Machine Learning.</p>
            </div>

            {/* 02: Team Creation */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-red-900/30 shadow-md dark:shadow-none hover:border-[#ca0019]/60 hover:scale-[1.02] transition-all">
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ca0019]/15 text-[#ca0019] dark:bg-[#ca0019]/25 dark:text-rose-400 flex items-center justify-center font-extrabold shrink-0">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">Team Creation</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Post your hackathon idea, define required open roles, and receive applications.</p>
            </div>

            {/* 03: Join Requests */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-red-900/30 shadow-md dark:shadow-none hover:border-[#ca0019]/60 hover:scale-[1.02] transition-all">
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ca0019]/15 text-[#ca0019] dark:bg-[#ca0019]/25 dark:text-rose-400 flex items-center justify-center font-extrabold shrink-0">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">Join Requests</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Send join requests to project leaders with single-click approval workflows.</p>
            </div>

            {/* 04: Courses */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-red-900/30 shadow-md dark:shadow-none hover:border-[#ca0019]/60 hover:scale-[1.02] transition-all">
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ca0019]/15 text-[#ca0019] dark:bg-[#ca0019]/25 dark:text-rose-400 flex items-center justify-center font-extrabold shrink-0">
                  04
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">Courses</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Explore courses and learning resources to build new skills and strengthen your knowledge.</p>
            </div>

            {/* 05: Mentors */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-red-900/30 shadow-md dark:shadow-none hover:border-[#ca0019]/60 hover:scale-[1.02] transition-all">
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ca0019]/15 text-[#ca0019] dark:bg-[#ca0019]/25 dark:text-rose-400 flex items-center justify-center font-extrabold shrink-0">
                  05
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">Mentors</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Connect with mentors, get guidance, and clear your project-related doubts.</p>
            </div>

            {/* 06: Game Zone */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-red-900/30 shadow-md dark:shadow-none hover:border-[#ca0019]/60 hover:scale-[1.02] transition-all">
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ca0019]/15 text-[#ca0019] dark:bg-[#ca0019]/25 dark:text-rose-400 flex items-center justify-center font-extrabold shrink-0">
                  06
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">Game Zone</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Take a break from learning and enjoy fun, interactive games.</p>
            </div>

            {/* 07: AI Chatbot */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-red-900/30 shadow-md dark:shadow-none hover:border-[#ca0019]/60 hover:scale-[1.02] transition-all">
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ca0019]/15 text-[#ca0019] dark:bg-[#ca0019]/25 dark:text-rose-400 flex items-center justify-center font-extrabold shrink-0">
                  07
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">AI Chatbot</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Ask questions anytime and get quick, AI-powered assistance on different topics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Community Section ── */}
      <section id="community" className="py-20 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-red-900/30 transition-colors relative overflow-hidden scroll-mt-24">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#ca0019]/10 via-[#ca0019]/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
              Community
            </h2>
            <p className="text-lg sm:text-2xl font-black text-[#ca0019] mb-4 tracking-tight">
              Find Your Team • Learn • Build • Connect • Grow
            </p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong className="text-[#ca0019] dark:text-rose-400 font-extrabold">Team Up</strong> is a dedicated community platform built by <strong className="text-slate-900 dark:text-white font-extrabold">The Uniques Community</strong>, designed to help you find the right teammates, collaborate on projects, connect with mentors, explore courses and learning resources, clear your doubts, and get instant assistance through our AI chatbot. Take a break, have fun in the Game Zone, and grow together with the community.
            </p>
          </div>

          {/* 3 Feature Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
            {/* Card 1: Be Part of Something Bigger */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-red-900/30 shadow-md hover:border-[#ca0019]/50 hover:scale-[1.02] transition-all group">
              <div className="flex items-center gap-3.5 mb-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ca0019] to-rose-500 text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-md shadow-red-600/20 group-hover:scale-110 transition-transform">
                  🌟
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                  Be Part of Something Bigger
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Join a community where everyone can contribute, participate, and make a difference through their ideas and skills.
              </p>
            </div>

            {/* Card 2: Share & Discover */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-red-900/30 shadow-md hover:border-[#ca0019]/50 hover:scale-[1.02] transition-all group">
              <div className="flex items-center gap-3.5 mb-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ca0019] to-rose-500 text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-md shadow-red-600/20 group-hover:scale-110 transition-transform">
                  💡
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                  Share & Discover
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Exchange experiences, explore new perspectives, and discover ideas that can inspire your personal and professional growth.
              </p>
            </div>

            {/* Card 3: Turn Ideas Into Reality */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-red-900/30 shadow-md hover:border-[#ca0019]/50 hover:scale-[1.02] transition-all group">
              <div className="flex items-center gap-3.5 mb-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ca0019] to-rose-500 text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-md shadow-red-600/20 group-hover:scale-110 transition-transform">
                  🚀
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                  Turn Ideas Into Reality
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Share your thoughts, find people who believe in your ideas, and take the first step toward creating something meaningful.
              </p>
            </div>
          </div>

          {/* Bottom Highlighted Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#880010] via-[#ca0019] to-[#dc142a] text-white shadow-xl shadow-[#ca0019]/25 border border-white/20 text-center">
            <p className="text-sm sm:text-base font-bold leading-relaxed max-w-3xl mx-auto tracking-wide">
              Find your team, share your ideas, learn new skills, build amazing projects, get guidance, and grow together.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section id="faq" className="py-20 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-red-900/30 transition-colors scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
              Frequently Asked <span className="text-[#ca0019]">Questions</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">Got questions? We've got answers.</p>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {[
              {
                q: "What is TeamUp?",
                a: "TeamUp is a platform designed to help people connect, collaborate, and work together effectively on projects and shared goals.",
              },
              {
                q: "Who can use TeamUp?",
                a: "TeamUp can be used by students, project teams, organizations, and anyone who wants to collaborate with others in an organized way.",
              },
              {
                q: "How does TeamUp help project teams?",
                a: "TeamUp makes it easier for team members to communicate, share responsibilities, manage tasks, and stay updated on project progress.",
              },
              {
                q: "Can I create or join a team?",
                a: "Yes. Users can create teams for their projects or join existing teams based on their interests, skills, or project requirements.",
              },
            ].map((item, idx) => {
              const isOpen = !!openFaqs[idx];
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-red-900/30 shadow-sm dark:shadow-none overflow-hidden transition-all duration-300 hover:border-[#ca0019]/60"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full py-3 px-4 sm:py-3.5 sm:px-5 text-left flex items-center justify-between gap-4 cursor-pointer select-none transition-colors"
                  >
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {item.q}
                    </h3>
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 ${
                        isOpen
                          ? "bg-[#ca0019] text-white rotate-180 shadow-md shadow-red-900/30"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rotate-0"
                      }`}
                    >
                      <FiChevronUp size={16} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-4.5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section id="contact" className="py-20 bg-white dark:bg-slate-900/60 border-t border-slate-200 dark:border-red-900/30 transition-colors scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
            Contact <span className="text-[#ca0019]">Us</span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-8">
            Have questions or feedback? Reach out to the TeamFinder community team.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-red-900/30 text-center shadow-sm dark:shadow-none hover:border-[#ca0019]/60 transition-all">
              <div className="text-[#ca0019] text-xl font-bold mb-2">📧 Email Support</div>
              <a href="mailto:kundanbth133@gmail.com" className="text-xs text-slate-600 dark:text-slate-400 hover:text-[#ca0019] transition-colors">
                kundanbth133@gmail.com
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-red-900/30 text-center shadow-sm dark:shadow-none hover:border-[#ca0019]/60 transition-all">
              <div className="text-rose-500 dark:text-rose-400 text-xl font-bold mb-2">💬 Student Community</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">discord.gg/teamfinder</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Compact & Sleek Light Gray Modern Footer ── */}
      <footer className="bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-dark-600 relative overflow-hidden py-4 sm:py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-3.5 sm:pb-4 border-b border-slate-200 dark:border-dark-600">
            {/* Left: Brand */}
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-xl bg-white shadow-sm border border-[#ca0019]/40">
                <AppLogo size="sm" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white block leading-tight">
                  Team<span className="text-[#ca0019]">Up</span>
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Built by <strong className="text-slate-700 dark:text-slate-300 font-semibold">The Uniques Community</strong>
                </span>
              </div>
            </div>

            {/* Center: In-page Navigation */}
            <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium">
              <a href="#about" className="text-slate-600 hover:text-[#ca0019] dark:text-slate-300 dark:hover:text-rose-400 transition-colors">About</a>
              <a href="#features" className="text-slate-600 hover:text-[#ca0019] dark:text-slate-300 dark:hover:text-rose-400 transition-colors">Features</a>
              <a href="#community" className="text-slate-600 hover:text-[#ca0019] dark:text-slate-300 dark:hover:text-rose-400 transition-colors">Community</a>
              <a href="#faq" className="text-slate-600 hover:text-[#ca0019] dark:text-slate-300 dark:hover:text-rose-400 transition-colors">FAQ</a>
              <a href="#contact" className="text-slate-600 hover:text-[#ca0019] dark:text-slate-300 dark:hover:text-rose-400 transition-colors">Contact</a>
            </nav>

            {/* Right: Social Links & Back to Top */}
            <div className="flex items-center gap-2.5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 rounded-lg bg-white dark:bg-dark-700 border border-slate-200 dark:border-dark-600 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-[#ca0019] hover:border-[#ca0019] flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <FiGithub size={15} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg bg-white dark:bg-dark-700 border border-slate-200 dark:border-dark-600 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-[#ca0019] hover:border-[#ca0019] flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <FiLinkedin size={15} />
              </a>
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="w-8 h-8 rounded-lg bg-white dark:bg-dark-700 border border-slate-200 dark:border-dark-600 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-[#ca0019] hover:border-[#ca0019] flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <FiMessageSquare size={15} />
              </a>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                aria-label="Back to Top"
                className="w-8 h-8 rounded-lg bg-white dark:bg-dark-700 border border-slate-200 dark:border-dark-600 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-[#ca0019] hover:border-[#ca0019] flex items-center justify-center transition-all duration-200 shadow-sm ml-0.5"
              >
                <FiArrowUp size={15} />
              </button>
            </div>
          </div>

          {/* Bottom Copyright - Reduced compact spacing */}
          <div className="pt-2.5 sm:pt-3 text-center text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} <strong className="text-slate-700 dark:text-slate-200 font-semibold">TeamUp</strong>
          </div>
        </div>
      </footer>

      {/* ── Glassmorphic Auth Modal Overlay ── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="w-full max-w-md bg-slate-950/95 dark:bg-dark-800/95 border border-red-900/40 rounded-3xl p-7 sm:p-8 shadow-2xl relative text-left my-8">

            {/* Modal Header Bar with Close Button */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-0.5 rounded-lg border border-[#ca0019] bg-white">
                  <AppLogo size="sm" />
                </div>
                <span className="text-lg font-black tracking-tight text-white">
                  Team<span className="text-[#ca0019]">Up</span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-red-900/40 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Auth Mode Toggle Tabs */}
            <div className="flex items-center justify-between p-1 bg-slate-900 rounded-2xl mb-6 border border-red-900/30">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setErrors({});
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${authMode === "login"
                    ? "bg-gradient-to-r from-[#ca0019] to-rose-600 text-white shadow-md shadow-red-950/50"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("signup");
                  setErrors({});
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${authMode === "signup"
                    ? "bg-gradient-to-r from-[#ca0019] to-rose-600 text-white shadow-md shadow-red-950/50"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                Sign Up
              </button>
            </div>

            <div className="mb-5">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {authMode === "signup" ? "Create Your Account" : "Welcome Back"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {authMode === "signup"
                  ? "Fill in your details to start collaborating on projects."
                  : "Sign in to access your student dashboard."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
              {/* Full Name (Sign Up only) */}
              {authMode === "signup" && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Rahul Sharma"
                      className={`w-full bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#ca0019] focus:ring-2 focus:ring-[#ca0019]/25 transition-all ${errors.name ? "border-red-500 focus:ring-red-500" : ""
                        }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1 font-medium">{errors.name}</p>
                  )}
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={authMode === "signup" ? "rahul@college.edu" : "student@college.edu"}
                    className={`w-full bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#ca0019] focus:ring-2 focus:ring-[#ca0019]/25 transition-all ${errors.email ? "border-red-500 focus:ring-red-500" : ""
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1 font-medium">{errors.email}</p>
                )}
              </div>

              {/* College (Sign Up only) */}
              {authMode === "signup" && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    College / University <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <div className="relative">
                    <FiBook className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      placeholder="e.g. IIT Delhi"
                      className="w-full bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#ca0019] focus:ring-2 focus:ring-[#ca0019]/25 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  {authMode === "login" && (
                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-red-400 hover:text-red-300 hover:underline"
                    >
                      Forgot?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={authMode === "signup" ? "Min 6 characters" : "••••••••"}
                    className={`w-full bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:border-[#ca0019] focus:ring-2 focus:ring-[#ca0019]/25 transition-all ${errors.password ? "border-red-500 focus:ring-red-500" : ""
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-300 transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password (Sign Up only) */}
              {authMode === "signup" && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className={`w-full bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:border-[#ca0019] focus:ring-2 focus:ring-[#ca0019]/25 transition-all ${errors.confirmPassword ? "border-red-500 focus:ring-red-500" : ""
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-300 transition-colors"
                    >
                      {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1 font-medium">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#ca0019] via-red-600 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold rounded-xl shadow-lg shadow-red-900/50 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <Spinner size="sm" />
                ) : authMode === "signup" ? (
                  "Create Account Free"
                ) : (
                  "Sign In to TeamFinder"
                )}
              </button>
            </form>

            {/* Bottom Links */}
            <div className="mt-5 pt-4 border-t border-white/10 text-center">
              <p className="text-xs text-slate-400">
                {authMode === "signup" ? "Already have an account?" : "Don't have an account yet?"}{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === "signup" ? "login" : "signup")}
                  className="font-bold text-red-400 hover:text-red-300 hover:underline"
                >
                  {authMode === "signup" ? "Sign In here" : "Sign Up for free"}
                </button>
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
