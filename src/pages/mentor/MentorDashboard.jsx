import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import Spinner from "../../components/common/Spinner";
import Avatar from "../../components/common/Avatar";
import SkillBadge from "../../components/common/SkillBadge";
import EmptyState from "../../components/common/EmptyState";
import ThemeToggle from "../../components/common/ThemeToggle";
import AppLogo from "../../components/common/AppLogo";
import toast from "react-hot-toast";
import {
  FiAward,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiMail,
  FiBriefcase,
  FiStar,
  FiLogOut,
  FiExternalLink,
  FiMessageSquare,
  FiSend,
  FiCheck,
  FiX,
  FiUser,
  FiLayers,
  FiEdit,
  FiGithub,
  FiLinkedin,
  FiImage,
  FiCode,
} from "react-icons/fi";

const MentorDashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'pending' | 'accepted' | 'rejected'
  const [respondingId, setRespondingId] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState(null); // { request, status }
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [submittingResponse, setSubmittingResponse] = useState(false);

  // Edit Profile Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    title: "",
    company: "",
    experience: "",
    expertise: "",
    bio: "",
    linkedinLink: "",
    githubLink: "",
    profilePicture: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await API.get("/mentors/dashboard/me");
      setData(res.data.data);
      const m = res.data.data?.mentor || user;
      setEditForm({
        name: m?.name || "",
        title: m?.title || "",
        company: m?.company || "",
        experience: m?.experience || "5+ Years",
        expertise: Array.isArray(m?.expertise) ? m.expertise.join(", ") : m?.expertise || "",
        bio: m?.bio || "",
        linkedinLink: m?.linkedinLink || "",
        githubLink: m?.githubLink || "",
        profilePicture: m?.profilePicture || "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load mentor dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleQuickResponse = async (requestId, status) => {
    setRespondingId(requestId);
    try {
      const res = await API.put(`/mentors/requests/${requestId}/respond`, {
        status,
        feedback: status === "accepted" ? "Looking forward to guiding you on this project!" : "Currently unavailable for this topic.",
      });
      toast.success(res.data.message || `Request ${status}!`);
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to respond");
    } finally {
      setRespondingId(null);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackModal) return;
    setSubmittingResponse(true);
    try {
      const res = await API.put(`/mentors/requests/${feedbackModal.request._id}/respond`, {
        status: feedbackModal.status,
        feedback: feedbackMsg,
      });
      toast.success(res.data.message || `Request ${feedbackModal.status}!`);
      setFeedbackModal(null);
      setFeedbackMsg("");
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit response");
    } finally {
      setSubmittingResponse(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await API.put("/users/profile", {
        name: editForm.name,
        title: editForm.title,
        company: editForm.company,
        experience: editForm.experience,
        expertise: editForm.expertise,
        bio: editForm.bio,
        linkedinLink: editForm.linkedinLink,
        githubLink: editForm.githubLink,
        profilePicture: editForm.profilePicture,
      });
      toast.success("Profile updated successfully!");
      updateUser(res.data.data);
      setShowEditModal(false);
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const requests = data?.requests || [];
  const filteredRequests = requests.filter((r) => {
    if (activeFilter === "all") return true;
    return r.status === activeFilter;
  });

  const stats = data?.stats || { total: 0, pending: 0, accepted: 0, rejected: 0 };
  const mentorProfile = data?.mentor || user;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* ── Top Header Navigation Bar ── */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-xl bg-white border border-[#ca0019] shadow-sm">
              <AppLogo size="sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                  Team<span className="text-[#ca0019]">Up</span>
                </span>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full">
                  Mentor Portal
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#ca0019] px-3 py-2 rounded-xl transition cursor-pointer"
            >
              <FiEdit size={13} /> Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-2 rounded-xl transition cursor-pointer"
            >
              <FiLogOut size={14} /> Log Out
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Dashboard Body ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {/* Mentor Welcome Banner with LinkedIn, GitHub & Experience */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#880010] via-[#ca0019] to-[#e6001c] text-white p-6 sm:p-8 shadow-xl shadow-[#ca0019]/25 border border-white/20">
              <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative group">
                    <Avatar
                      src={mentorProfile?.profilePicture}
                      name={mentorProfile?.name || "Mentor"}
                      size="xl"
                    />
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="absolute -bottom-1 -right-1 p-1.5 bg-white text-slate-900 rounded-full shadow-md hover:scale-110 transition cursor-pointer"
                      title="Change Profile Picture"
                    >
                      <FiImage size={12} />
                    </button>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-black text-white truncate">
                        {mentorProfile?.name || "Mentor"}
                      </h1>
                      <span className="text-xs bg-white/25 text-white font-extrabold px-2.5 py-0.5 rounded-full border border-white/40">
                        Verified Mentor
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-white/90 font-semibold mt-0.5 truncate flex items-center gap-1.5">
                      <FiBriefcase size={13} /> {mentorProfile?.title || "Industry Mentor"} • {mentorProfile?.company || "Tech Expert"}
                    </p>
                    <p className="text-xs text-white/80 flex items-center gap-1.5 mt-1 truncate">
                      <FiMail size={13} /> {mentorProfile?.email}
                    </p>

                    {/* LinkedIn & GitHub Links */}
                    <div className="flex items-center gap-2.5 mt-2.5 pt-1">
                      {mentorProfile?.linkedinLink ? (
                        <a
                          href={mentorProfile.linkedinLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-2.5 py-1 rounded-lg border border-white/30 transition"
                        >
                          <FiLinkedin size={13} /> LinkedIn <FiExternalLink size={10} />
                        </a>
                      ) : (
                        <button
                          onClick={() => setShowEditModal(true)}
                          className="text-[11px] text-white/70 hover:text-white underline cursor-pointer"
                        >
                          + Add LinkedIn
                        </button>
                      )}

                      {mentorProfile?.githubLink ? (
                        <a
                          href={mentorProfile.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-2.5 py-1 rounded-lg border border-white/30 transition"
                        >
                          <FiGithub size={13} /> GitHub <FiExternalLink size={10} />
                        </a>
                      ) : (
                        <button
                          onClick={() => setShowEditModal(true)}
                          className="text-[11px] text-white/70 hover:text-white underline cursor-pointer"
                        >
                          + Add GitHub
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/30 shrink-0 self-stretch md:self-auto justify-around">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-300 font-black text-base sm:text-lg">
                      <FiStar size={16} className="fill-amber-300" />
                      <span>{mentorProfile?.rating || "5.0"}</span>
                    </div>
                    <span className="text-[10px] text-white/90 uppercase font-bold tracking-wider">
                      Rating
                    </span>
                  </div>
                  <div className="w-px h-8 bg-white/30" />
                  <div className="text-center">
                    <div className="text-white font-black text-base sm:text-lg">
                      {mentorProfile?.experience || "5+ Yrs"}
                    </div>
                    <span className="text-[10px] text-white/90 uppercase font-bold tracking-wider">
                      Experience
                    </span>
                  </div>
                  <div className="w-px h-8 bg-white/30" />
                  <div className="text-center">
                    <div className="text-white font-black text-base sm:text-lg">
                      {mentorProfile?.sessionsCompleted || 24}
                    </div>
                    <span className="text-[10px] text-white/90 uppercase font-bold tracking-wider">
                      Sessions
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Statistics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
              <div className="card p-4 sm:p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Total Requests
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
                    <FiLayers size={15} />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                  {stats.total}
                </p>
              </div>

              <div className="card p-4 sm:p-5 bg-white dark:bg-slate-900 border-amber-500/30 dark:border-amber-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    Pending
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                    ⏳
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">
                  {stats.pending}
                </p>
              </div>

              <div className="card p-4 sm:p-5 bg-white dark:bg-slate-900 border-emerald-500/30 dark:border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Accepted
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                    🎉
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                  {stats.accepted}
                </p>
              </div>

              <div className="card p-4 sm:p-5 bg-white dark:bg-slate-900 border-rose-500/30 dark:border-rose-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                    Declined
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
                    ❌
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-2">
                  {stats.rejected}
                </p>
              </div>
            </div>

            {/* Requests Section with Tabs */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FiMessageSquare className="text-[#ca0019]" />
                    Student Mentorship Requests
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Review and respond to guidance requests sent by students to your email
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-1 bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-xl">
                  {[
                    { key: "all", label: "All", count: stats.total },
                    { key: "pending", label: "Pending", count: stats.pending },
                    { key: "accepted", label: "Accepted", count: stats.accepted },
                    { key: "rejected", label: "Declined", count: stats.rejected },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveFilter(tab.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        activeFilter === tab.key
                          ? "bg-white dark:bg-slate-900 text-[#ca0019] dark:text-rose-400 shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800">
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Requests List */}
              {filteredRequests.length === 0 ? (
                <EmptyState
                  icon="🎓"
                  title="No Requests Found"
                  description={
                    activeFilter === "all"
                      ? "You have not received any mentorship requests yet. When students reach out, they will appear right here!"
                      : `No requests with status "${activeFilter}".`
                  }
                />
              ) : (
                <div className="space-y-4">
                  {filteredRequests.map((req) => (
                    <div
                      key={req._id}
                      className={`card p-5 sm:p-6 transition-all border ${
                        req.status === "pending"
                          ? "border-amber-500/40 bg-gradient-to-r from-white to-amber-50/20 dark:from-slate-900 dark:to-amber-950/10 shadow-sm"
                          : req.status === "accepted"
                          ? "border-emerald-500/40 bg-gradient-to-r from-white to-emerald-50/20 dark:from-slate-900 dark:to-emerald-950/10"
                          : "border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      {/* Top Header Row */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar
                            src={req.sender?.profilePicture}
                            name={req.sender?.name || "Student"}
                            size="md"
                          />
                          <div className="min-w-0">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                              {req.sender?.name || "Student Name"}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <a
                                href={`mailto:${req.sender?.email}`}
                                className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 font-medium"
                              >
                                <FiMail size={12} /> {req.sender?.email}
                              </a>
                              {req.sender?.college && (
                                <span>• 🏫 {req.sender?.college}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`badge text-xs font-bold px-2.5 py-1 ${
                              req.status === "accepted"
                                ? "badge-green"
                                : req.status === "rejected"
                                ? "badge-red"
                                : "badge-yellow"
                            }`}
                          >
                            {req.status === "accepted"
                              ? "Accepted 🎉"
                              : req.status === "rejected"
                              ? "Declined ❌"
                              : "Pending ⏳"}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Request Topic & Skills */}
                      <div className="py-3 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Topic:
                          </span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {req.topic}
                          </span>
                        </div>

                        {req.sender?.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {req.sender?.skills?.slice(0, 5).map((sk) => (
                              <SkillBadge key={sk} skill={sk} />
                            ))}
                          </div>
                        )}

                        {/* Student's Message Box */}
                        <div className="bg-slate-100/90 dark:bg-slate-950/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                          "{req.message}"
                        </div>

                        {req.mentorFeedback && (
                          <div className="bg-primary-50 dark:bg-primary-950/30 rounded-xl p-3 border border-primary-200 dark:border-primary-800/50 text-xs text-primary-800 dark:text-primary-300">
                            <strong>Your Feedback/Response:</strong> {req.mentorFeedback}
                          </div>
                        )}
                      </div>

                      {/* Action Response Buttons Right Below The Message */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">
                          {req.status === "pending"
                            ? "Click Accept to confirm mentorship session with student."
                            : "Response recorded on platform."}
                        </div>

                        <div className="flex items-center gap-2">
                          {req.status === "pending" ? (
                            <>
                              <button
                                type="button"
                                disabled={respondingId === req._id}
                                onClick={() => handleQuickResponse(req._id, "accepted")}
                                className="btn-primary py-2 px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                              >
                                {respondingId === req._id ? (
                                  <Spinner size="sm" />
                                ) : (
                                  <FiCheck size={14} />
                                )}
                                <span>Accept Request</span>
                              </button>

                              <button
                                type="button"
                                disabled={respondingId === req._id}
                                onClick={() => handleQuickResponse(req._id, "rejected")}
                                className="btn-danger py-2 px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                              >
                                <FiX size={14} />
                                <span>Decline</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setFeedbackModal({ request: req, status: "accepted" })}
                                className="btn-secondary py-2 px-3 text-xs font-semibold text-slate-600 dark:text-slate-300"
                                title="Accept with custom message"
                              >
                                + Note
                              </button>
                            </>
                          ) : (
                            <a
                              href={`mailto:${req.sender?.email}?subject=Re: Mentorship on ${encodeURIComponent(req.topic)}`}
                              className="btn-secondary py-2 px-3.5 text-xs font-bold flex items-center gap-1.5"
                            >
                              <FiMail size={13} /> Email Student
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Edit Mentor Profile Modal ── */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
              >
                <FiX size={18} />
              </button>

              <div className="flex items-center gap-2">
                <FiEdit className="text-[#ca0019]" size={18} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Edit Mentor Profile
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update your designation, picture, experience, LinkedIn and GitHub links.
              </p>

              <form onSubmit={handleProfileSave} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Profile Picture URL (or Image Link)
                  </label>
                  <input
                    type="url"
                    value={editForm.profilePicture}
                    onChange={(e) => setEditForm({ ...editForm, profilePicture: e.target.value })}
                    placeholder="https://images.unsplash.com/... or profile image link"
                    className="input-field text-xs sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="input-field text-xs sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Designation / Title
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="e.g. Senior Tech Lead"
                      className="input-field text-xs sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={editForm.company}
                      onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                      placeholder="e.g. Google / Microsoft"
                      className="input-field text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="text"
                      value={editForm.experience}
                      onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                      placeholder="e.g. 5+ Years"
                      className="input-field text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={editForm.linkedinLink}
                      onChange={(e) => setEditForm({ ...editForm, linkedinLink: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="input-field text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      GitHub Profile URL
                    </label>
                    <input
                      type="url"
                      value={editForm.githubLink}
                      onChange={(e) => setEditForm({ ...editForm, githubLink: e.target.value })}
                      placeholder="https://github.com/..."
                      className="input-field text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Skills / Domain Expertise (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editForm.expertise}
                    onChange={(e) => setEditForm({ ...editForm, expertise: e.target.value })}
                    placeholder="React, Node.js, AI, System Design, DevOps"
                    className="input-field text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    About / Bio
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Brief description about your mentoring background and tech domain..."
                    className="input-field text-xs sm:text-sm resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="btn-secondary text-xs py-2 px-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="btn-primary text-xs py-2 px-4 bg-[#ca0019] hover:bg-[#b00015] flex items-center gap-1.5"
                  >
                    {savingProfile ? <Spinner size="sm" /> : <FiCheck size={14} />} Save Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Custom Feedback / Note Modal */}
        {feedbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
              <button
                onClick={() => setFeedbackModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
              >
                <FiX size={18} />
              </button>

              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiSend className="text-[#ca0019]" />
                Respond with Custom Message
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                To student: <strong>{feedbackModal.request.sender?.name}</strong> ({feedbackModal.request.topic})
              </p>

              <form onSubmit={handleFeedbackSubmit} className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Response / Advice / Schedule Link
                  </label>
                  <textarea
                    rows={4}
                    value={feedbackMsg}
                    onChange={(e) => setFeedbackMsg(e.target.value)}
                    placeholder="e.g. Happy to help! Let's connect this Saturday 4 PM on Google Meet..."
                    className="input-field text-xs sm:text-sm resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackModal(null)}
                    className="btn-secondary text-xs py-2 px-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingResponse}
                    className="btn-primary text-xs py-2 px-4 bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1.5"
                  >
                    {submittingResponse ? <Spinner size="sm" /> : <FiCheck size={14} />} Confirm & Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MentorDashboard;
