import { createContext, useContext, useState, useCallback } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("teamup_user")) || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Register Student
  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", formData);
      localStorage.setItem("teamup_user", JSON.stringify(data.data));
      setUser(data.data);
      toast.success("Registration successful! Welcome to TeamUp 🎉");
      return { success: true, role: data.data.role || "student" };
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Register Mentor
  const registerMentor = useCallback(async (formData) => {
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register-mentor", formData);
      localStorage.setItem("teamup_user", JSON.stringify(data.data));
      setUser(data.data);
      toast.success("Mentor profile created successfully! Welcome to TeamUp 🎓");
      return { success: true, role: "mentor" };
    } catch (error) {
      const msg = error.response?.data?.message || "Mentor registration failed";
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = useCallback(async (formData) => {
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", formData);
      localStorage.setItem("teamup_user", JSON.stringify(data.data));
      setUser(data.data);
      toast.success(`Welcome back, ${data.data.name}! 👋`);
      return { success: true, role: data.data.role };
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Admin Login
  const adminLogin = useCallback(async (formData) => {
    setLoading(true);
    try {
      const { data } = await API.post("/admin/login", formData);
      localStorage.setItem("teamup_user", JSON.stringify(data.data));
      setUser(data.data);
      toast.success("Admin login successful!");
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Admin login failed";
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem("teamup_user");
    setUser(null);
    toast.success("Logged out successfully");
  }, []);

  // Update user in context (after profile edit)
  const updateUser = useCallback((updatedData) => {
    const updated = { ...user, ...updatedData };
    localStorage.setItem("teamup_user", JSON.stringify(updated));
    setUser(updated);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, register, registerMentor, login, adminLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
