import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/common/Spinner";
import ThemeToggle from "../../components/common/ThemeToggle";
import AppLogo from "../../components/common/AppLogo";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUsers, FiFolder, FiCheckCircle, FiShield } from "react-icons/fi";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = "Email is required";
    if (!formData.password) errs.password = "Password is required";
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
    const result = await login(formData);
    if (result.success) navigate(result.role === "admin" ? "/admin/dashboard" : "/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row relative transition-colors duration-300 dark:bg-dark-900 bg-slate-50 text-slate-800 dark:text-gray-100 overflow-hidden">

      {/* Top Bar Theme Switcher */}
      <div className="absolute top-5 right-5 z-50">
        <ThemeToggle />
      </div>

      {/* Left Panel — Clean Simple Hero */}
      <div className="relative hidden lg:flex flex-col justify-between w-1/2 p-12 overflow-hidden border-r dark:border-white/10 border-slate-200 dark:bg-dark-800 bg-white">

        {/* Header Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <AppLogo size="md" />
          <span className="text-2xl font-bold tracking-tight dark:text-white text-slate-900">
            Team<span className="text-primary-600">Up</span>
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-primary-500/20 dark:text-primary-300 bg-primary-100 text-primary-700">
            Beta
          </span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 my-auto max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium dark:bg-primary-800/40 dark:text-primary-400 bg-primary-100 text-primary-700 border border-primary-200/60 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary-500" />
            Connect & Collaborate
          </div>

          <h2 className="text-4xl font-extrabold leading-tight tracking-tight dark:text-white text-slate-900 mb-3">
            Find your perfect <br />
            <span className="text-primary-600">project team</span>
          </h2>

          <p className="dark:text-gray-400 text-slate-600 text-sm leading-relaxed mb-6">
            Connect with skilled college students, build amazing projects together, and grow your portfolio.
          </p>

          {/* Simple Clean Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { val: "500+", label: "Students", icon: FiUsers },
              { val: "120+", label: "Projects", icon: FiFolder },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="p-4 rounded-xl border dark:bg-dark-750 dark:border-dark-600 bg-slate-50 border-slate-200"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-primary-600" />
                    <p className="text-xl font-bold dark:text-white text-slate-900">{s.val}</p>
                  </div>
                  <p className="text-xs dark:text-gray-400 text-slate-500">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* Simple Features */}
          <div className="space-y-2">
            {[
              "Find teammates by required skills",
              "Create and manage projects easily",
              "Send and receive join requests in real time",
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs font-medium dark:text-gray-300 text-slate-600">
                <FiCheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-xs dark:text-gray-500 text-slate-400">
          © {new Date().getFullYear()} TeamUp. All rights reserved.
        </p>
      </div>

      {/* Right Panel — Clean Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-sm">

          {/* Mobile Logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden justify-center">
            <AppLogo size="sm" />
            <span className="text-xl font-bold tracking-tight dark:text-white text-slate-900">
              Team<span className="text-primary-600">Up</span>
            </span>
          </div>

          {/* Form Card */}
          <div className="p-8 rounded-2xl border dark:bg-dark-800 dark:border-white/10 bg-white border-slate-200 shadow-sm">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight dark:text-white text-slate-900">
                Sign In
              </h1>
              <p className="text-xs dark:text-gray-400 text-slate-500 mt-1">
                Welcome back! Please enter your details.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400" size={16} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@college.edu"
                    className={`input-field pl-10 ${errors.email ? "border-red-500 focus:ring-red-500" : ""
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-slate-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`input-field pl-10 pr-10 ${errors.password ? "border-red-500 focus:ring-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400 hover:text-primary-600 transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 mt-2 font-semibold"
              >
                {loading ? <Spinner size="sm" /> : "Sign In"}
              </button>
            </form>

            {/* Bottom Links */}
            <div className="mt-6 pt-5 border-t dark:border-white/10 border-slate-100 flex flex-col items-center gap-3 text-center">
              <p className="text-xs dark:text-gray-400 text-slate-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-primary-600 hover:text-primary-500 hover:underline"
                >
                  Sign Up
                </Link>
              </p>

              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-md dark:bg-dark-700 dark:text-gray-300 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <FiShield className="w-3.5 h-3.5 text-amber-500" />
                Admin Portal →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
