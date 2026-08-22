import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/common/Spinner";
import signupImg from "../../assets/signup.png";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiArrowLeft,
  FiBriefcase,
  FiAward,
  FiCode,
  FiGithub,
  FiLinkedin,
  FiImage,
} from "react-icons/fi";

const Register = () => {
  const { register, registerMentor, login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryMode = new URLSearchParams(location.search).get("mode");
  const queryRole = new URLSearchParams(location.search).get("role");

  const [isSignUp, setIsSignUp] = useState(queryMode !== "login");
  const [accountType, setAccountType] = useState(queryRole === "mentor" ? "mentor" : "student"); // 'student' | 'mentor'

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    const role = params.get("role");
    if (mode === "login") setIsSignUp(false);
    else if (mode === "signup") setIsSignUp(true);
    if (role === "mentor") setAccountType("mentor");
  }, [location.search]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    title: "",
    company: "",
    experience: "5+ Years",
    expertise: "",
    githubLink: "",
    linkedinLink: "",
    profilePicture: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (isSignUp && !formData.name.trim()) errs.name = "Full Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = "Invalid email address";
    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 6) errs.password = "Min 6 characters required";

    if (isSignUp && accountType === "mentor") {
      if (!formData.title.trim()) errs.title = "Designation/Title is required (e.g. Lead Architect)";
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

    if (isSignUp) {
      if (accountType === "mentor") {
        const result = await registerMentor({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          title: formData.title,
          company: formData.company,
          experience: formData.experience,
          expertise: formData.expertise,
          githubLink: formData.githubLink,
          linkedinLink: formData.linkedinLink,
          profilePicture: formData.profilePicture,
        });
        if (result.success) navigate("/mentor/dashboard");
      } else {
        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        if (result.success) navigate("/dashboard");
      }
    } else {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });
      if (result.success) {
        if (result.role === "admin") navigate("/admin/dashboard");
        else if (result.role === "mentor") navigate("/mentor/dashboard");
        else navigate("/dashboard");
      }
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden flex items-center justify-center bg-slate-950 text-slate-900 font-sans select-none">
      {/* ── Minimal Top Back Button ── */}
      <Link
        to="/"
        className="absolute top-5 left-5 z-40 w-10 h-10 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-white hover:text-[#ca0019] hover:scale-105 active:scale-95 shadow-md border border-white/40 transition-all cursor-pointer"
        title="Back to Home"
      >
        <FiArrowLeft size={18} />
      </Link>

      {/* ── Immersive Full-Screen 3D Illustration Canvas ── */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
        {/* 3D Background Image with Reduced Opacity */}
        <img
          src={signupImg}
          alt="TeamUp 3D Sign Up Scene"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none opacity-40"
        />

        {/* Scaled Coordinate Frame for Card Alignment */}
        <div className="relative w-full h-full max-w-[177.78vh] aspect-[16/9] flex items-center justify-center pointer-events-none">
          {/* ── Desktop & Tablet Card Overlay ── */}
          <div
            className="hidden md:flex absolute z-20 bg-white rounded-[22px] lg:rounded-[28px] px-5 lg:px-7 py-3.5 lg:py-4 flex-col justify-between shadow-2xl select-none pointer-events-auto border border-slate-100 max-h-[92%]"
            style={{
              top: accountType === "mentor" && isSignUp ? "12%" : "25%",
              left: "31%",
              width: "38%",
              height: accountType === "mentor" && isSignUp ? "82%" : "66%",
            }}
          >
            {/* Header Avatar + Role Toggle */}
            <div className="text-center">
              {/* Role Toggle Selector */}
              <div className="flex items-center justify-center gap-1 p-1 bg-slate-100 rounded-xl mb-1.5 max-w-[240px] mx-auto border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setAccountType("student");
                    setErrors({});
                  }}
                  className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    accountType === "student"
                      ? "bg-[#ca0019] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAccountType("mentor");
                    setErrors({});
                  }}
                  className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    accountType === "mentor"
                      ? "bg-[#ca0019] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Mentor
                </button>
              </div>

              <h2 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 leading-tight">
                {isSignUp
                  ? accountType === "mentor"
                    ? "Join as Mentor"
                    : "Create Your Account"
                  : accountType === "mentor"
                  ? "Mentor Sign In"
                  : "Welcome Back"}
              </h2>
              <p className="text-[10px] lg:text-xs text-slate-500 font-medium mt-0.5">
                {accountType === "mentor"
                  ? "Guide students, review code & accept project requests"
                  : isSignUp
                  ? "Join, learn, build projects, and find mentors"
                  : "Sign in to access your dashboard"}
              </p>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-2 lg:space-y-2 my-auto overflow-y-auto pr-1" noValidate>
              {/* Full Name (Sign Up only) */}
              {isSignUp && (
                <div>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ca0019]" size={14} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={accountType === "mentor" ? "Mentor Full Name" : "Full Name"}
                      className={`w-full bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-1.5 pl-9 pr-3 text-xs lg:text-sm focus:outline-none focus:border-[#ca0019] focus:ring-1 focus:ring-[#ca0019] transition-all ${
                        errors.name ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.name}</p>}
                </div>
              )}

              {/* Email Address */}
              <div>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ca0019]" size={14} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={accountType === "mentor" ? "Mentor Email (e.g. mentor@gmail.com)" : "Email Address"}
                    className={`w-full bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-1.5 pl-9 pr-3 text-xs lg:text-sm focus:outline-none focus:border-[#ca0019] focus:ring-1 focus:ring-[#ca0019] transition-all ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.email}</p>}
              </div>

              {/* Mentor-Specific Signup Fields */}
              {isSignUp && accountType === "mentor" && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="relative">
                        <FiAward className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ca0019]" size={13} />
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="Designation/Title"
                          className={`w-full bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-1.5 pl-8 pr-2 text-xs focus:outline-none focus:border-[#ca0019] ${
                            errors.title ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      {errors.title && <p className="text-red-500 text-[9px] mt-0.5">{errors.title}</p>}
                    </div>

                    <div className="relative">
                      <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ca0019]" size={13} />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Company / Org"
                        className="w-full bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-1.5 pl-8 pr-2 text-xs focus:outline-none focus:border-[#ca0019]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <FiAward className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ca0019]" size={13} />
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="Exp (e.g. 5+ Years)"
                        className="w-full bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-1.5 pl-8 pr-2 text-xs focus:outline-none focus:border-[#ca0019]"
                      />
                    </div>

                    <div className="relative">
                      <FiCode className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ca0019]" size={13} />
                      <input
                        type="text"
                        name="expertise"
                        value={formData.expertise}
                        onChange={handleChange}
                        placeholder="Skills (React, AI, Cloud)"
                        className="w-full bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-1.5 pl-8 pr-2 text-xs focus:outline-none focus:border-[#ca0019]"
                      />
                    </div>
                  </div>

                  {/* LinkedIn & GitHub Links for Mentor */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <FiLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ca0019]" size={13} />
                      <input
                        type="url"
                        name="linkedinLink"
                        value={formData.linkedinLink}
                        onChange={handleChange}
                        placeholder="LinkedIn URL"
                        className="w-full bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-1.5 pl-8 pr-2 text-xs focus:outline-none focus:border-[#ca0019]"
                      />
                    </div>

                    <div className="relative">
                      <FiGithub className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ca0019]" size={13} />
                      <input
                        type="url"
                        name="githubLink"
                        value={formData.githubLink}
                        onChange={handleChange}
                        placeholder="GitHub URL"
                        className="w-full bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-1.5 pl-8 pr-2 text-xs focus:outline-none focus:border-[#ca0019]"
                      />
                    </div>
                  </div>

                  {/* Profile Picture URL Option */}
                  <div className="relative">
                    <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ca0019]" size={13} />
                    <input
                      type="url"
                      name="profilePicture"
                      value={formData.profilePicture}
                      onChange={handleChange}
                      placeholder="Profile Picture URL (e.g. https://.../photo.jpg)"
                      className="w-full bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-1.5 pl-8 pr-2 text-xs focus:outline-none focus:border-[#ca0019]"
                    />
                  </div>
                </>
              )}

              {/* Password */}
              <div>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ca0019]" size={14} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className={`w-full bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-1.5 pl-9 pr-9 text-xs lg:text-sm focus:outline-none focus:border-[#ca0019] focus:ring-1 focus:ring-[#ca0019] transition-all ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.password}</p>}
              </div>

              {/* Forgot Password Link (Sign In Mode only) */}
              {!isSignUp && (
                <div className="flex justify-end pr-1 -mt-1">
                  <Link
                    to="/forgot-password"
                    className="text-[11px] lg:text-xs font-semibold text-[#ca0019] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-[#ca0019] hover:bg-[#b00015] text-white font-bold rounded-xl shadow-md shadow-red-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 text-xs lg:text-sm cursor-pointer mt-1"
              >
                {loading ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <span>
                      {isSignUp
                        ? accountType === "mentor"
                          ? "Register as Mentor"
                          : "Sign Up as Student"
                        : accountType === "mentor"
                        ? "Log In as Mentor"
                        : "Log In"}
                    </span>
                    <FiArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Switch Link */}
            <div className="text-center pt-1 border-t border-slate-100">
              <p className="text-[11px] lg:text-xs text-slate-600">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrors({});
                  }}
                  className="font-bold text-[#ca0019] hover:underline cursor-pointer ml-0.5"
                >
                  {isSignUp ? "Log in" : "Sign up"}
                </button>
              </p>

              {/* Quick Mentor Switch Prompt */}
              <button
                type="button"
                onClick={() => {
                  setAccountType(accountType === "mentor" ? "student" : "mentor");
                  setErrors({});
                }}
                className="text-[10px] lg:text-[11px] text-[#ca0019] hover:underline font-bold mt-0.5 inline-block cursor-pointer"
              >
                {accountType === "mentor"
                  ? "Looking for projects? Click to Switch to Student"
                  : "Are you a Mentor? Click here to Login/Sign Up as Mentor"}
              </button>
            </div>
          </div>

          {/* ── Mobile Form Card (< md screens) ── */}
          <div className="md:hidden absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-20 pointer-events-auto overflow-y-auto">
            <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl text-slate-800 my-auto max-h-[92vh] overflow-y-auto">
              {/* Role Toggle Selector */}
              <div className="flex items-center justify-center gap-1 p-1 bg-slate-100 rounded-xl mb-2.5 border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setAccountType("student");
                    setErrors({});
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    accountType === "student"
                      ? "bg-[#ca0019] text-white shadow-xs"
                      : "text-slate-600"
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAccountType("mentor");
                    setErrors({});
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    accountType === "mentor"
                      ? "bg-[#ca0019] text-white shadow-xs"
                      : "text-slate-600"
                  }`}
                >
                  Mentor
                </button>
              </div>

              <div className="text-center mb-2.5">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {isSignUp
                    ? accountType === "mentor"
                      ? "Join as Mentor"
                      : "Create Your Account"
                    : accountType === "mentor"
                    ? "Mentor Sign In"
                    : "Welcome Back"}
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {accountType === "mentor"
                    ? "Access mentorship requests from students"
                    : isSignUp
                    ? "Join the TeamUp student community"
                    : "Sign in to access your dashboard"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-2.5" noValidate>
                {isSignUp && (
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={accountType === "mentor" ? "Mentor Full Name" : "Full Name"}
                      className={`w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2 text-xs focus:outline-none focus:border-[#ca0019] ${
                        errors.name ? "border-red-500" : ""
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-[10px] mt-0.5">{errors.name}</p>}
                  </div>
                )}

                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className={`w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2 text-xs focus:outline-none focus:border-[#ca0019] ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-[10px] mt-0.5">{errors.email}</p>}
                </div>

                {isSignUp && accountType === "mentor" && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Title (e.g. Lead Engineer)"
                        className={`w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2 text-xs focus:outline-none focus:border-[#ca0019] ${
                          errors.title ? "border-red-500" : ""
                        }`}
                      />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Company / Org"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2 text-xs focus:outline-none focus:border-[#ca0019]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="Exp (e.g. 5+ Years)"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2 text-xs focus:outline-none focus:border-[#ca0019]"
                      />
                      <input
                        type="text"
                        name="expertise"
                        value={formData.expertise}
                        onChange={handleChange}
                        placeholder="Skills (React, AI)"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2 text-xs focus:outline-none focus:border-[#ca0019]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="url"
                        name="linkedinLink"
                        value={formData.linkedinLink}
                        onChange={handleChange}
                        placeholder="LinkedIn Profile URL"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2 text-xs focus:outline-none focus:border-[#ca0019]"
                      />
                      <input
                        type="url"
                        name="githubLink"
                        value={formData.githubLink}
                        onChange={handleChange}
                        placeholder="GitHub Profile URL"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2 text-xs focus:outline-none focus:border-[#ca0019]"
                      />
                    </div>

                    <input
                      type="url"
                      name="profilePicture"
                      value={formData.profilePicture}
                      onChange={handleChange}
                      placeholder="Profile Picture URL (e.g. https://.../pic.jpg)"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2 text-xs focus:outline-none focus:border-[#ca0019]"
                    />
                  </>
                )}

                <div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className={`w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2 text-xs focus:outline-none focus:border-[#ca0019] ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  {errors.password && <p className="text-red-500 text-[10px] mt-0.5">{errors.password}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#ca0019] hover:bg-[#b00015] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                >
                  {loading ? (
                    <Spinner size="sm" />
                  ) : (
                    <span>
                      {isSignUp
                        ? accountType === "mentor"
                          ? "Register as Mentor"
                          : "Sign Up"
                        : accountType === "mentor"
                        ? "Log In as Mentor"
                        : "Log In"}
                    </span>
                  )}
                </button>
              </form>

              <div className="text-center pt-2.5 mt-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrors({});
                  }}
                  className="text-xs font-bold text-[#ca0019] hover:underline"
                >
                  {isSignUp ? "Already registered? Log in" : "Need an account? Sign up"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
