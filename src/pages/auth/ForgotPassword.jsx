import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import Spinner from "../../components/common/Spinner";
import ThemeToggle from "../../components/common/ThemeToggle";
import AppLogo from "../../components/common/AppLogo";
import signupImg from "../../assets/signup.png";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiArrowRight,
  FiKey,
  FiCheckCircle,
} from "react-icons/fi";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email verify, 2: Reset password, 3: Success
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Verify Email
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setError("Please enter your registered email");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Please enter a valid email address");

    setError("");
    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email });
      toast.success("Email verified! Please enter your new password.");
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.message || "Verification failed. Check your email.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!passwords.newPassword) return setError("New password is required");
    if (passwords.newPassword.length < 6) return setError("Password must be at least 6 characters long");
    if (passwords.newPassword !== passwords.confirmPassword) return setError("Passwords do not match");

    setError("");
    setLoading(true);
    try {
      await API.post("/auth/reset-password", {
        email,
        newPassword: passwords.newPassword,
      });
      toast.success("Password reset successfully! 🎉");
      setStep(3);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to reset password. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden flex items-center justify-center bg-slate-950 text-slate-900 font-sans select-none">
      
      {/* ── Minimal Top Back Button ── */}
      <Link
        to="/register?mode=login"
        className="absolute top-5 left-5 z-40 w-10 h-10 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-white hover:text-[#ca0019] hover:scale-105 active:scale-95 shadow-md border border-white/40 transition-all cursor-pointer"
        title="Back to Login"
      >
        <FiArrowLeft size={18} />
      </Link>

      {/* ── Immersive Full-Screen 3D Illustration Canvas ── */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">

        {/* 3D Background Image with Reduced Opacity */}
        <img
          src={signupImg}
          alt="TeamUp 3D Forgot Password Scene"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none opacity-40"
        />

        {/* Scaled Coordinate Frame for Card Alignment */}
        <div className="relative w-full h-full max-w-[177.78vh] aspect-[16/9] flex items-center justify-center pointer-events-none">
          
          {/* ── Interactive Card Overlay on Desktop/Tablet ── */}
          <div
            className="hidden md:flex absolute z-20 bg-white rounded-[18px] lg:rounded-[24px] px-5 lg:px-7 py-4 lg:py-5 flex-col justify-between shadow-xs select-none pointer-events-auto"
            style={{
              top: "29.2%",
              left: "32.2%",
              width: "35.6%",
              height: "60.3%",
            }}
          >
            {/* STEP 1: VERIFY EMAIL */}
            {step === 1 && (
              <>
                <div className="text-center">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#ca0019] text-white flex items-center justify-center mx-auto text-base lg:text-lg shadow-sm mb-1">
                    <FiKey />
                  </div>
                  <h2 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 leading-tight">
                    Reset Password
                  </h2>
                  <p className="text-[10px] lg:text-xs text-slate-500 font-medium mt-0.5">
                    Enter your registered email to reset your password
                  </p>
                </div>

                <form onSubmit={handleVerifyEmail} className="space-y-2 lg:space-y-3 my-auto" noValidate>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-[10px] sm:text-xs p-2 rounded-xl font-medium">
                      ⚠️ {error}
                    </div>
                  )}

                  <div>
                    <div className="relative">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ca0019]" size={15} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        placeholder="Registered Email Address"
                        className="w-full bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-2 pl-9 pr-3 text-xs lg:text-sm focus:outline-none focus:border-[#ca0019] focus:ring-1 focus:ring-[#ca0019] transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 lg:py-2.5 bg-[#ca0019] hover:bg-[#b00015] text-white font-bold rounded-xl shadow-md shadow-red-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 text-xs lg:text-sm cursor-pointer"
                  >
                    {loading ? <Spinner size="sm" /> : <><span>Verify Email</span> <FiArrowRight size={15} /></>}
                  </button>
                </form>

                <div className="text-center pt-1">
                  <Link
                    to="/register?mode=login"
                    className="text-xs font-semibold text-[#ca0019] hover:underline inline-flex items-center gap-1"
                  >
                    <FiArrowLeft size={13} /> Back to Sign In
                  </Link>
                </div>
              </>
            )}

            {/* STEP 2: RESET PASSWORD */}
            {step === 2 && (
              <>
                <div className="text-center">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#ca0019] text-white flex items-center justify-center mx-auto text-base lg:text-lg shadow-sm mb-1">
                    <FiLock />
                  </div>
                  <h2 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 leading-tight">
                    New Password
                  </h2>
                  <p className="text-[10px] lg:text-xs text-slate-500 font-medium mt-0.5 truncate max-w-[200px] mx-auto">
                    For {email}
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-2 my-auto" noValidate>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-[10px] p-2 rounded-xl font-medium">
                      ⚠️ {error}
                    </div>
                  )}

                  <div>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ca0019]" size={15} />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwords.newPassword}
                        onChange={(e) => {
                          setPasswords({ ...passwords, newPassword: e.target.value });
                          setError("");
                        }}
                        placeholder="New Password (min 6 chars)"
                        className="w-full bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-1.5 lg:py-2 pl-9 pr-9 text-xs lg:text-sm focus:outline-none focus:border-[#ca0019] focus:ring-1 focus:ring-[#ca0019]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ca0019]" size={15} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwords.confirmPassword}
                        onChange={(e) => {
                          setPasswords({ ...passwords, confirmPassword: e.target.value });
                          setError("");
                        }}
                        placeholder="Confirm New Password"
                        className="w-full bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-1.5 lg:py-2 pl-9 pr-9 text-xs lg:text-sm focus:outline-none focus:border-[#ca0019] focus:ring-1 focus:ring-[#ca0019]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 lg:py-2.5 bg-[#ca0019] hover:bg-[#b00015] text-white font-bold rounded-xl shadow-md shadow-red-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 text-xs lg:text-sm cursor-pointer"
                  >
                    {loading ? <Spinner size="sm" /> : "Save New Password"}
                  </button>
                </form>
              </>
            )}

            {/* STEP 3: SUCCESS */}
            {step === 3 && (
              <div className="text-center my-auto">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 text-xl">
                  🎉
                </div>
                <h2 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 leading-tight">
                  Password Reset!
                </h2>
                <p className="text-[11px] lg:text-xs text-slate-500 font-medium mt-1 mb-4 leading-relaxed max-w-[220px] mx-auto">
                  Your password for <strong className="text-slate-700">{email}</strong> has been updated.
                </p>

                <button
                  onClick={() => navigate("/register?mode=login")}
                  className="w-full py-2 lg:py-2.5 bg-[#ca0019] hover:bg-[#b00015] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 text-xs lg:text-sm cursor-pointer"
                >
                  Sign In Now →
                </button>
              </div>
            )}
          </div>

          {/* ── Mobile Form Card (< md screens) ── */}
          <div className="md:hidden absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-20 pointer-events-auto">
            <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl text-slate-800">
              {step === 1 && (
                <>
                  <div className="text-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#ca0019] text-white flex items-center justify-center mx-auto text-lg shadow-md mb-1.5">
                      <FiKey />
                    </div>
                    <h2 className="text-lg font-black text-slate-900">Reset Password</h2>
                    <p className="text-[11px] text-slate-500">Enter your email to reset password</p>
                  </div>

                  <form onSubmit={handleVerifyEmail} className="space-y-2.5" noValidate>
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 text-[10px] p-2 rounded-xl font-medium">
                        ⚠️ {error}
                      </div>
                    )}
                    <div>
                      <div className="relative">
                        <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ca0019]" size={15} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                          }}
                          placeholder="Registered Email"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#ca0019]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-[#ca0019] hover:bg-[#b00015] text-white font-bold rounded-xl shadow-md text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {loading ? <Spinner size="sm" /> : <span>Verify Email →</span>}
                    </button>
                  </form>

                  <div className="text-center pt-2 mt-1">
                    <Link
                      to="/register?mode=login"
                      className="text-[11px] font-semibold text-[#ca0019] hover:underline"
                    >
                      Back to Sign In
                    </Link>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="text-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#ca0019] text-white flex items-center justify-center mx-auto text-lg shadow-md mb-1.5">
                      <FiLock />
                    </div>
                    <h2 className="text-lg font-black text-slate-900">New Password</h2>
                    <p className="text-[11px] text-slate-500">Create a new password</p>
                  </div>

                  <form onSubmit={handleResetPassword} className="space-y-2.5" noValidate>
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 text-[10px] p-2 rounded-xl font-medium">
                        ⚠️ {error}
                      </div>
                    )}

                    <div>
                      <div className="relative">
                        <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ca0019]" size={15} />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwords.newPassword}
                          onChange={(e) => {
                            setPasswords({ ...passwords, newPassword: e.target.value });
                            setError("");
                          }}
                          placeholder="New Password"
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
                    </div>

                    <div>
                      <div className="relative">
                        <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ca0019]" size={15} />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwords.confirmPassword}
                          onChange={(e) => {
                            setPasswords({ ...passwords, confirmPassword: e.target.value });
                            setError("");
                          }}
                          placeholder="Confirm Password"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-2 pl-9 pr-9 text-xs focus:outline-none focus:border-[#ca0019]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showConfirmPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-[#ca0019] hover:bg-[#b00015] text-white font-bold rounded-xl shadow-md text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {loading ? <Spinner size="sm" /> : "Save Password"}
                    </button>
                  </form>
                </>
              )}

              {step === 3 && (
                <div className="text-center py-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 text-xl">
                    🎉
                  </div>
                  <h2 className="text-lg font-black text-slate-900">Password Reset!</h2>
                  <p className="text-[11px] text-slate-500 mt-1 mb-3">Your password has been updated.</p>

                  <button
                    onClick={() => navigate("/register?mode=login")}
                    className="w-full py-2.5 bg-[#ca0019] text-white font-bold rounded-xl text-xs"
                  >
                    Sign In Now →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
