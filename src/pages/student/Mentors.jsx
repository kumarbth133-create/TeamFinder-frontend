import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import MainLayout from "../../components/layout/MainLayout";
import Avatar from "../../components/common/Avatar";
import SkillBadge from "../../components/common/SkillBadge";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import { toast } from "react-hot-toast";
import {
  FiSearch,
  FiAward,
  FiStar,
  FiGithub,
  FiLinkedin,
  FiX,
  FiMail,
  FiCopy,
  FiCheck,
  FiMessageCircle,
  FiClock,
  FiBriefcase,
  FiSend,
} from "react-icons/fi";

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expertiseFilter, setExpertiseFilter] = useState("");
  const [activeExpertise, setActiveExpertise] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestModal, setRequestModal] = useState(false);
  const [requestTopic, setRequestTopic] = useState("");
  const [requestMsg, setRequestMsg] = useState("");
  const [copiedEmail, setCopiedEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchMentors = async (params = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (params.search) query.append("search", params.search);
      if (params.expertise?.length) query.append("expertise", params.expertise.join(","));
      const { data } = await API.get(`/mentors?${query.toString()}`);
      setMentors(data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load mentors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMentors({ search, expertise: activeExpertise });
  };

  const addExpertiseFilter = () => {
    const exp = expertiseFilter.trim();
    if (exp && !activeExpertise.includes(exp)) {
      const updated = [...activeExpertise, exp];
      setActiveExpertise(updated);
      fetchMentors({ search, expertise: updated });
    }
    setExpertiseFilter("");
  };

  const removeExpertiseFilter = (exp) => {
    const updated = activeExpertise.filter((item) => item !== exp);
    setActiveExpertise(updated);
    fetchMentors({ search, expertise: updated });
  };

  const copyToClipboard = (email, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    toast.success("Mentor email copied!");
    setTimeout(() => {
      setCopiedEmail("");
    }, 2500);
  };

  const openRequestModal = (mentor) => {
    setSelectedMentor(mentor);
    setRequestTopic(`Guidance for Project / Tech Stack`);
    setRequestMsg("");
    setRequestModal(true);
  };

  const submitMentorshipRequest = async (e) => {
    e.preventDefault();
    if (!requestMsg.trim()) return toast.error("Please enter a message for the mentor");
    setSubmitting(true);
    try {
      const { data } = await API.post(`/mentors/${selectedMentor._id}/request`, {
        topic: requestTopic,
        message: requestMsg,
      });

      setRequestModal(false);
      toast.success(data.message || `Guidance request submitted to ${selectedMentor.name}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#990012] via-[#ca0019] to-[#e6001c] text-white py-4 px-4 sm:py-5 sm:px-6 shadow-lg shadow-[#ca0019]/25 border border-white/20 hover:shadow-xl hover:shadow-[#ca0019]/30 transition-all duration-300">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex items-center gap-3 sm:gap-4 z-10">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/15 text-white border border-white/30 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-sm">
              <FiAward size={22} className="sm:text-2xl" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-0.5">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white/90">
                  Project & Career Mentors
                </span>
                <span className="text-[9px] sm:text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold border border-white/30">
                  Guidance
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black text-white leading-tight truncate">
                Find Mentors to Guide You
              </h1>
            </div>
          </div>
        </div>

        {/* Search & Filter Card (Responsive) */}
        <div className="card space-y-3 p-4 sm:p-5">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" size={15} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search mentors by name, role, email or company..."
                className="input-field pl-9 text-xs sm:text-sm"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <button type="submit" className="btn-primary flex-1 sm:flex-none text-xs sm:text-sm py-2 px-4">
                Search
              </button>
              {(search || activeExpertise.length > 0) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveExpertise([]);
                    fetchMentors();
                  }}
                  className="btn-secondary text-xs sm:text-sm py-2 px-3"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={expertiseFilter}
              onChange={(e) => setExpertiseFilter(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addExpertiseFilter())}
              placeholder="Filter by skill/topic (e.g. React, System Design, PyTorch)"
              className="input-field sm:max-w-xs text-xs sm:text-sm"
            />
            <button type="button" onClick={addExpertiseFilter} className="btn-secondary text-xs sm:text-sm py-2 px-3 shrink-0">
              + Filter Topic
            </button>
          </div>

          {activeExpertise.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeExpertise.map((exp) => (
                <span key={exp} className="flex items-center gap-1 badge text-xs">
                  {exp}
                  <button onClick={() => removeExpertiseFilter(exp)} className="p-0.5 hover:text-red-500">
                    <FiX size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Mentors Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : mentors.length === 0 ? (
          <EmptyState
            icon="🎓"
            title="No Mentors Found"
            description="Try adjusting your search query or skill filters."
          />
        ) : (
          <>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              Showing {mentors.length} available mentor{mentors.length !== 1 ? "s" : ""}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {mentors.map((mentor) => (
                <div key={mentor._id} className="card-hover flex flex-col justify-between relative overflow-hidden p-4 sm:p-5">
                  {/* Top Profile Area */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar src={mentor.profilePicture} name={mentor.name} size="lg" />
                      <div className="min-w-0">
                        <Link
                          to={`/mentors/${mentor._id}`}
                          className="font-bold text-slate-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition text-sm sm:text-base block truncate"
                        >
                          {mentor.name}
                        </Link>
                        <p className="text-xs font-medium text-primary-600 dark:text-primary-400 truncate">{mentor.title}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                          <FiBriefcase size={12} className="shrink-0" /> {mentor.company} • {mentor.experience}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md text-xs font-semibold shrink-0">
                      <FiStar size={12} className="fill-amber-400" />
                      <span>{mentor.rating?.toFixed(1) || "4.9"}</span>
                      <span className="text-slate-400 dark:text-gray-500 text-[10px]">({mentor.reviewsCount || 15})</span>
                    </div>
                  </div>

                  {/* Mentor Email Badge */}
                  {mentor.email && (
                    <div className="flex items-center justify-between gap-2 mb-3 px-2.5 py-1.5 rounded-xl bg-slate-100/90 dark:bg-dark-900/80 border border-slate-200 dark:border-dark-600/80 text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <FiMail size={13} className="text-primary-600 dark:text-primary-400 shrink-0" />
                        <span className="text-slate-700 dark:text-gray-300 font-medium truncate">
                          {mentor.email}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => copyToClipboard(mentor.email, e)}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:text-gray-400 dark:hover:text-white transition shrink-0 rounded hover:bg-slate-200 dark:hover:bg-dark-700"
                        title="Copy email address"
                      >
                        {copiedEmail === mentor.email ? (
                          <FiCheck size={13} className="text-emerald-500" />
                        ) : (
                          <FiCopy size={13} />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Bio */}
                  {mentor.bio && (
                    <p className="text-xs text-slate-600 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                      {mentor.bio}
                    </p>
                  )}

                  {/* Expertise Tags */}
                  {mentor.expertise?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-gray-400 mb-1.5">Domain Expertise</p>
                      <div className="flex flex-wrap gap-1.5">
                        {mentor.expertise.slice(0, 5).map((exp) => (
                          <SkillBadge key={exp} skill={exp} />
                        ))}
                        {mentor.expertise.length > 5 && (
                          <span className="text-xs text-slate-500 dark:text-gray-400 flex items-center">+{mentor.expertise.length - 5} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Availability */}
                  <div className="text-xs text-slate-600 dark:text-gray-400 flex items-center gap-1.5 mb-4 bg-slate-50 dark:bg-dark-900/60 p-2 rounded-xl border border-slate-200 dark:border-dark-600">
                    <FiClock size={13} className="text-primary-600 dark:text-primary-400 shrink-0" />
                    <span className="truncate">{mentor.availability || "Available for Mentorship"}</span>
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-dark-600 mt-auto">
                    <div className="flex gap-2.5">
                      {mentor.githubLink && (
                        <a
                          href={mentor.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition p-1"
                        >
                          <FiGithub size={16} />
                        </a>
                      )}
                      {mentor.linkedinLink && (
                        <a
                          href={mentor.linkedinLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition p-1"
                        >
                          <FiLinkedin size={16} />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/mentors/${mentor._id}`}
                        className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => openRequestModal(mentor)}
                        className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 bg-primary-600 hover:bg-primary-500 shadow-sm"
                      >
                        <FiMessageCircle size={14} /> Request Guidance
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Mentorship Request Modal */}
        {requestModal && selectedMentor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-600 rounded-2xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setRequestModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-white p-1"
              >
                <FiX size={18} />
              </button>

              <div className="flex items-center gap-3 pr-6">
                <Avatar src={selectedMentor.profilePicture} name={selectedMentor.name} size="md" />
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-gray-100 text-base truncate">{selectedMentor.name}</h3>
                  <p className="text-xs text-primary-600 dark:text-primary-400 font-medium truncate">{selectedMentor.title}</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl p-3 text-xs text-slate-600 dark:text-gray-300">
                Submit your guidance questions. {selectedMentor.name} will review this in their <strong>Mentor Dashboard</strong> and respond!
              </div>

              <form onSubmit={submitMentorshipRequest} className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">Guidance Topic / Subject</label>
                  <input
                    type="text"
                    value={requestTopic}
                    onChange={(e) => setRequestTopic(e.target.value)}
                    placeholder="e.g. MERN Stack Architecture Review"
                    className="input-field text-xs sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">Your Message / Questions</label>
                  <textarea
                    rows={4}
                    value={requestMsg}
                    onChange={(e) => setRequestMsg(e.target.value)}
                    placeholder="Describe what guidance or advice your project team needs from this mentor..."
                    className="input-field resize-none text-xs sm:text-sm"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRequestModal(false)}
                    className="btn-secondary text-xs py-2 px-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary text-xs py-2 px-4 bg-primary-600 hover:bg-primary-500 flex items-center gap-1.5 shadow-md"
                  >
                    {submitting ? <Spinner size="sm" /> : <FiSend size={14} />} Send Guidance Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Mentors;
