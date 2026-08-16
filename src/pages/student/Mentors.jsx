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
  FiSearch, FiAward, FiStar, FiGithub, FiLinkedin, FiX,
  FiArrowRight, FiMessageCircle, FiCheckCircle, FiClock, FiBriefcase
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
      toast.success(data.message || "Request sent successfully!");
      setRequestModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900/40 via-dark-800 to-dark-800 p-6 rounded-xl border border-emerald-800/30">
          <div>
            <div className="flex items-center gap-2 text-primary-400 font-semibold text-sm mb-1">
              <FiAward size={18} />
              <span>Project & Career Mentors</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Find Mentors to Guide You</h1>
            <p className="text-sm text-gray-400 mt-1 max-w-xl">
              Connect with experienced engineers, architects, and technical leads who assist student teams in code review, architecture, AI/ML, and career growth.
            </p>
          </div>
        </div>

        {/* Search & Filter Card */}
        <div className="card space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search mentors by name, role (e.g. Architect, Lead), or company..."
                className="input-field pl-9"
              />
            </div>
            <button type="submit" className="btn-primary">Search</button>
            {(search || activeExpertise.length > 0) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveExpertise([]);
                  fetchMentors();
                }}
                className="btn-secondary"
              >
                Clear
              </button>
            )}
          </form>

          <div className="flex gap-2">
            <input
              type="text"
              value={expertiseFilter}
              onChange={(e) => setExpertiseFilter(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addExpertiseFilter())}
              placeholder="Filter by skill/topic (e.g. React, System Design, PyTorch)"
              className="input-field max-w-xs text-sm"
            />
            <button type="button" onClick={addExpertiseFilter} className="btn-secondary">
              + Filter Topic
            </button>
          </div>

          {activeExpertise.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {activeExpertise.map((exp) => (
                <span key={exp} className="flex items-center gap-1 badge">
                  {exp}
                  <button onClick={() => removeExpertiseFilter(exp)}>
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
            <p className="text-xs text-gray-500">
              Showing {mentors.length} available mentor{mentors.length !== 1 ? "s" : ""}
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
              {mentors.map((mentor) => (
                <div key={mentor._id} className="card-hover flex flex-col justify-between relative overflow-hidden">
                  {/* Top Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={mentor.profilePicture} name={mentor.name} size="lg" />
                      <div>
                        <Link
                          to={`/mentors/${mentor._id}`}
                          className="font-bold text-gray-100 hover:text-primary-400 transition text-base block truncate"
                        >
                          {mentor.name}
                        </Link>
                        <p className="text-xs font-medium text-primary-400">{mentor.title}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <FiBriefcase size={12} /> {mentor.company} • {mentor.experience}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md text-xs font-semibold">
                      <FiStar size={12} className="fill-amber-400" />
                      <span>{mentor.rating?.toFixed(1) || "4.9"}</span>
                      <span className="text-gray-500 text-[10px]">({mentor.reviewsCount || 15})</span>
                    </div>
                  </div>

                  {/* Bio */}
                  {mentor.bio && (
                    <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                      {mentor.bio}
                    </p>
                  )}

                  {/* Expertise Tags */}
                  {mentor.expertise?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-1.5">Domain Expertise</p>
                      <div className="flex flex-wrap gap-1.5">
                        {mentor.expertise.slice(0, 5).map((exp) => (
                          <SkillBadge key={exp} skill={exp} />
                        ))}
                        {mentor.expertise.length > 5 && (
                          <span className="text-xs text-gray-500 flex items-center">+{mentor.expertise.length - 5} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Availability */}
                  <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-4 bg-dark-900/60 p-2 rounded-lg border border-dark-600">
                    <FiClock size={13} className="text-primary-400" />
                    <span>{mentor.availability || "Available for Mentorship"}</span>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-dark-600 mt-auto">
                    <div className="flex gap-3">
                      {mentor.githubLink && (
                        <a
                          href={mentor.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-primary-400 transition"
                        >
                          <FiGithub size={16} />
                        </a>
                      )}
                      {mentor.linkedinLink && (
                        <a
                          href={mentor.linkedinLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-primary-400 transition"
                        >
                          <FiLinkedin size={16} />
                        </a>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/mentors/${mentor._id}`}
                        className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => openRequestModal(mentor)}
                        className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 bg-primary-600 hover:bg-primary-500"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-dark-800 border border-dark-600 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
              <button
                onClick={() => setRequestModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <FiX size={18} />
              </button>

              <div className="flex items-center gap-3">
                <Avatar src={selectedMentor.profilePicture} name={selectedMentor.name} size="md" />
                <div>
                  <h3 className="font-bold text-gray-100 text-base">{selectedMentor.name}</h3>
                  <p className="text-xs text-primary-400">{selectedMentor.title}</p>
                </div>
              </div>

              <form onSubmit={submitMentorshipRequest} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Guidance Topic / Subject</label>
                  <input
                    type="text"
                    value={requestTopic}
                    onChange={(e) => setRequestTopic(e.target.value)}
                    placeholder="e.g. MERN Stack Architecture Review"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Your Message / Questions</label>
                  <textarea
                    rows={4}
                    value={requestMsg}
                    onChange={(e) => setRequestMsg(e.target.value)}
                    placeholder="Describe what help you or your project team needs from this mentor..."
                    className="input-field resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRequestModal(false)}
                    className="btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary text-xs bg-primary-600 hover:bg-primary-500 flex items-center gap-1.5"
                  >
                    {submitting ? <Spinner size="sm" /> : <FiCheckCircle size={14} />} Send Guidance Request
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
