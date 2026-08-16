import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import Spinner from "../../components/common/Spinner";
import ThemeToggle from "../../components/common/ThemeToggle";
import AppLogo from "../../components/common/AppLogo";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiCheckCircle, FiShield, FiKey } from "react-icons/fi";

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
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative transition-colors duration-300 dark:bg-dark-900 bg-slate-50 text-slate-800 dark:text-gray-100">
      
      {/* Top Bar Theme Switcher */}
      <div className="absolute top-5 right-5 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Header Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <AppLogo size="md" />
          <span className="text-2xl font-bold tracking-tight dark:text-white text-slate-900">
            Team<span className="text-primary-600">Up</span>
          </span>
        </div>

        {/* Card Container */}
        <div className="p-8 rounded-2xl border dark:bg-dark-800 dark:border-white/10 bg-white border-slate-200 shadow-sm">
          
          {/* STEP 1: VERIFY EMAIL */}
          {step === 1 && (
            <div>
              <div className="mb-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-800/40 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto mb-3 text-xl">
                  <FiKey />
                </div>
                <h1 className="text-2xl font-bold tracking-tight dark:text-white text-slate-900">
                  Forgot Password?
                </h1>
                <p className="text-xs dark:text-gray-400 text-slate-500 mt-1">
                  Enter your registered email address to reset your password.
                </p>
              </div>

              <form onSubmit={handleVerifyEmail} className="space-y-4" noValidate>
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs p-3 rounded-xl">
                    ⚠️ {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-slate-700 mb-1.5">
                    Registered Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400" size={16} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="student@college.edu"
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-2.5 font-semibold"
                >
                  {loading ? <Spinner size="sm" /> : "Verify Email"}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t dark:border-white/10 border-slate-100 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <FiArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </div>
          )}

          {/* STEP 2: RESET PASSWORD */}
          {step === 2 && (
            <div>
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-800/40 text-primary-700 dark:text-primary-300 mb-3 border border-primary-200/60">
                  <FiCheckCircle className="text-primary-600" /> Account Verified
                </div>
                <h1 className="text-2xl font-bold tracking-tight dark:text-white text-slate-900">
                  Create New Password
                </h1>
                <p className="text-xs dark:text-gray-400 text-slate-500 mt-1">
                  Enter a new strong password for <span className="font-semibold text-slate-700 dark:text-gray-300">{email}</span>
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs p-3 rounded-xl">
                    ⚠️ {error}
                  </div>
                )}

                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400" size={16} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwords.newPassword}
                      onChange={(e) => {
                        setPasswords({ ...passwords, newPassword: e.target.value });
                        setError("");
                      }}
                      placeholder="At least 6 characters"
                      className="input-field pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400 hover:text-primary-600 transition-colors"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-slate-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400" size={16} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwords.confirmPassword}
                      onChange={(e) => {
                        setPasswords({ ...passwords, confirmPassword: e.target.value });
                        setError("");
                      }}
                      placeholder="Re-enter new password"
                      className="input-field pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400 hover:text-primary-600 transition-colors"
                    >
                      {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-2.5 font-semibold"
                >
                  {loading ? <Spinner size="sm" /> : "Update & Save Password"}
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 3 && (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-800/50 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto mb-4 text-2xl">
                🎉
              </div>
              <h1 className="text-2xl font-bold dark:text-white text-slate-900 mb-2">
                Password Reset Successfully!
              </h1>
              <p className="text-xs dark:text-gray-400 text-slate-600 leading-relaxed mb-6 max-w-xs mx-auto">
                Your password for <span className="font-semibold text-slate-800 dark:text-gray-200">{email}</span> has been updated. You can now log in using your new password.
              </p>

              <button
                onClick={() => navigate("/login")}
                className="btn-primary w-full py-2.5 font-semibold"
              >
                Sign In Now →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
