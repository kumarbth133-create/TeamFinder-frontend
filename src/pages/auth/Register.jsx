import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/common/Spinner";
import ThemeToggle from "../../components/common/ThemeToggle";
import AppLogo from "../../components/common/AppLogo";
import { FiMail, FiLock, FiUser, FiBook, FiEye, FiEyeOff, FiCheckCircle } from "react-icons/fi";

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "", college: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = "Invalid email address";
    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 6) errs.password = "Min 6 characters required";
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match";
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
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      college: formData.college,
    });
    if (result.success) navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row relative transition-colors duration-300 dark:bg-dark-900 bg-slate-50 text-slate-800 dark:text-gray-100 overflow-y-auto">
      
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
            Create Account
          </div>

          <h2 className="text-4xl font-extrabold leading-tight tracking-tight dark:text-white text-slate-900 mb-3">
            Start building <br />
            <span className="text-primary-600">your dream team</span>
          </h2>

          <p className="dark:text-gray-400 text-slate-600 text-sm leading-relaxed mb-6">
            Join thousands of college students finding teammates, building innovative projects, and showcasing their work.
          </p>

          {/* Simple Features */}
          <div className="space-y-3 p-5 rounded-xl dark:bg-dark-750 border dark:border-dark-600 bg-slate-50 border-slate-200">
            {[
              "Find teammates based on skills and tech stack",
              "Create and manage team projects smoothly",
              "Send and review join requests in real time",
              "Connect with mentors & track project growth",
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs font-medium dark:text-gray-300 text-slate-700">
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

      {/* Right Panel — Clean Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10 my-auto">
        <div className="w-full max-w-sm my-auto">

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
                Create Account
              </h1>
              <p className="text-xs dark:text-gray-400 text-slate-500 mt-1">
                Fill in your details below to get started.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400" size={16} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Rahul Sharma"
                    className={`input-field pl-10 ${
                      errors.name ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400" size={16} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="rahul@college.edu"
                    className={`input-field pl-10 ${
                      errors.email ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* College */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-slate-700 mb-1">
                  College <span className="text-gray-400 font-normal lowercase">(optional)</span>
                </label>
                <div className="relative">
                  <FiBook className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400" size={16} />
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="e.g. IIT Delhi"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className={`input-field pl-10 pr-10 ${
                      errors.password ? "border-red-500 focus:ring-red-500" : ""
                    }`}
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-slate-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400" size={16} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className={`input-field pl-10 pr-10 ${
                      errors.confirmPassword ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400 hover:text-primary-600 transition-colors"
                  >
                    {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 mt-2 font-semibold"
              >
                {loading ? <Spinner size="sm" /> : "Create Account"}
              </button>
            </form>

            {/* Bottom Links */}
            <div className="mt-6 pt-4 border-t dark:border-white/10 border-slate-100 text-center">
              <p className="text-xs dark:text-gray-400 text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-primary-600 hover:text-primary-500 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
