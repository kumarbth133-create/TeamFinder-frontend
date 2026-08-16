import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/common/Spinner";
import ThemeToggle from "../../components/common/ThemeToggle";
import AppLogo from "../../components/common/AppLogo";
import { FiMail, FiLock, FiShield, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";

const AdminLogin = () => {
  const { adminLogin, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return setError("Email and password are required");
    }
    const result = await adminLogin(formData);
    if (result.success) navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative transition-colors duration-300 dark:bg-dark-900 bg-slate-50 text-slate-800 dark:text-gray-100">
      
      {/* Top Bar Theme Switcher */}
      <div className="absolute top-5 right-5 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <AppLogo size="md" />
          <span className="text-2xl font-bold tracking-tight dark:text-white text-slate-900">
            Team<span className="text-primary-500">Up</span>
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-red-500/10 text-red-500 border border-red-500/20 inline-flex items-center gap-1">
            <FiShield className="w-3 h-3" /> Admin
          </span>
        </div>

        {/* Card */}
        <div className="p-8 sm:p-10 rounded-3xl border transition-all duration-300 dark:bg-dark-800/80 dark:border-white/10 dark:shadow-2xl dark:shadow-black/50 bg-white border-slate-200/90 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight dark:text-white text-slate-900">
              Admin Portal
            </h1>
            <p className="text-xs sm:text-sm dark:text-gray-400 text-slate-500 mt-1">
              Restricted area — enter administrative credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium px-4 py-3 rounded-xl flex items-center gap-2">
                <span>⚠️ {error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-slate-700 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400" size={17} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@teamup.com"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400" size={17} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400 hover:text-primary-500 transition-colors"
                >
                  {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-2 font-bold tracking-wide"
            >
              {loading ? <Spinner size="sm" /> : "Sign In as Admin"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t dark:border-white/10 border-slate-100 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-500 hover:text-primary-400 transition-colors"
            >
              <FiArrowLeft className="w-3.5 h-3.5" /> Back to Student Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
