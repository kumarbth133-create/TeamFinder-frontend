import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/common/Spinner";
import AppLogo from "../../components/common/AppLogo";
import ThemeToggle from "../../components/common/ThemeToggle";
import signupImg from "../../assets/signup.png";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiArrowLeft,
} from "react-icons/fi";

const Register = () => {
  const { register, login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryMode = new URLSearchParams(location.search).get("mode");
  const [isSignUp, setIsSignUp] = useState(queryMode !== "login");

  useEffect(() => {
    const mode = new URLSearchParams(location.search).get("mode");
    if (mode === "login") {
      setIsSignUp(false);
    } else if (mode === "signup") {
      setIsSignUp(true);
    }
  }, [location.search]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      if (result.success) navigate("/dashboard");
    } else {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });
      if (result.success) {
        if (result.role === "admin") navigate("/admin/dashboard");
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
          
          {/* ── Interactive Form Card Overlay on Desktop/Tablet ── */}
          <div
            className="hidden md:flex absolute z-20 bg-white rounded-[18px] lg:rounded-[24px] px-5 lg:px-7 py-4 lg:py-5 flex-col justify-between shadow-xs select-none pointer-events-auto"
            style={{
              top: "29.2%",
              left: "32.2%",
              width: "35.6%",
              height: "60.3%",
            }}
          >
            {/* Header Avatar + Titles */}
            <div className="text-center">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#ca0019] text-white flex items-center justify-center mx-auto text-base lg:text-lg shadow-sm mb-1">
                {isSignUp ? <FiUser /> : <FiLock />}
              </div>
              <h2 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 leading-tight">
                {isSignUp ? "Create Your Account" : "Welcome Back"}
              </h2>
              <p className="text-[10px] lg:text-xs text-slate-500 font-medium mt-0.5">
                {isSignUp ? "Join. Learn. Build. Grow Together!" : "Sign in to access your student dashboard"}
              </p>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-2 lg:space-y-2.5 my-auto" noValidate>
              {/* Full Name (Sign Up only) */}
              {isSignUp && (
                <div>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ca0019]" size={15} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className={`w-full bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-1.5 lg:py-2 pl-9 pr-3 text-xs lg:text-sm focus:outline-none focus:border-[#ca0019] focus:ring-1 focus:ring-[#ca0019] transition-all ${
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
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ca0019]" size={15} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className={`w-full bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-1.5 lg:py-2 pl-9 pr-3 text-xs lg:text-sm focus:outline-none focus:border-[#ca0019] focus:ring-1 focus:ring-[#ca0019] transition-all ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ca0019]" size={15} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className={`w-full bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-1.5 lg:py-2 pl-9 pr-9 text-xs lg:text-sm focus:outline-none focus:border-[#ca0019] focus:ring-1 focus:ring-[#ca0019] transition-all ${
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
                className="w-full py-2 lg:py-2.5 bg-[#ca0019] hover:bg-[#b00015] text-white font-bold rounded-xl shadow-md shadow-red-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 text-xs lg:text-sm cursor-pointer"
              >
                {loading ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <span>{isSignUp ? "Sign Up" : "Log In"}</span>
                    <FiArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Switch Link */}
            <div className="text-center pt-1">
              <p className="text-xs text-slate-600">
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
            </div>
          </div>

          {/* ── Mobile Form Card (< md screens) ── */}
          <div className="md:hidden absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-20 pointer-events-auto">
            <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl text-slate-800">
              <div className="text-center mb-3">
                <div className="w-10 h-10 rounded-full bg-[#ca0019] text-white flex items-center justify-center mx-auto text-lg shadow-md mb-1.5">
                  {isSignUp ? <FiUser /> : <FiLock />}
                </div>
                <h2 className="text-lg font-black text-slate-900">
                  {isSignUp ? "Create Your Account" : "Welcome Back"}
                </h2>
                <p className="text-[11px] text-slate-500">
                  {isSignUp ? "Join. Learn. Build. Grow Together!" : "Sign in to access your dashboard"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-2.5" noValidate>
                {isSignUp && (
                  <div>
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ca0019]" size={15} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#ca0019]"
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-[10px] mt-0.5">{errors.name}</p>}
                  </div>
                )}

                <div>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ca0019]" size={15} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#ca0019]"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-[10px] mt-0.5">{errors.email}</p>}
                </div>

                <div>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ca0019]" size={15} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-2 pl-9 pr-9 text-xs focus:outline-none focus:border-[#ca0019]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-[10px] mt-0.5">{errors.password}</p>}
                </div>

                {!isSignUp && (
                  <div className="flex justify-end pr-1 -mt-1">
                    <Link
                      to="/forgot-password"
                      className="text-[11px] font-semibold text-[#ca0019] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#ca0019] hover:bg-[#b00015] text-white font-bold rounded-xl shadow-md text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {loading ? <Spinner size="sm" /> : <span>{isSignUp ? "Sign Up" : "Log In"} →</span>}
                </button>
              </form>

              <div className="text-center pt-2 mt-1">
                <p className="text-[11px] text-slate-600">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
