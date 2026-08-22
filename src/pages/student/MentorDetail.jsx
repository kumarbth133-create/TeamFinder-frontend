import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/axios";
import MainLayout from "../../components/layout/MainLayout";
import Avatar from "../../components/common/Avatar";
import SkillBadge from "../../components/common/SkillBadge";
import Spinner from "../../components/common/Spinner";
import { toast } from "react-hot-toast";
import {
  FiAward,
  FiStar,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiClock,
  FiBriefcase,
  FiArrowLeft,
  FiMessageCircle,
  FiBookOpen,
  FiShield,
  FiCopy,
  FiCheck,
  FiSend,
} from "react-icons/fi";

const MentorDetail = () => {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestTopic, setRequestTopic] = useState("");
  const [requestMsg, setRequestMsg] = useState("");
  const [copiedEmail, setCopiedEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMentor = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/mentors/${id}`);
        setMentor(data.data);
        setRequestTopic(`Project Guidance Request - ${data.data.name}`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load mentor details");
      } finally {
        setLoading(false);
      }
    };
    fetchMentor();
  }, [id]);

  const copyToClipboard = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    toast.success("Mentor email copied!");
    setTimeout(() => {
      setCopiedEmail("");
    }, 2500);
  };

  const submitMentorshipRequest = async (e) => {
    e.preventDefault();
    if (!requestMsg.trim()) return toast.error("Please enter a message for the mentor");
    setSubmitting(true);
    try {
      const { data } = await API.post(`/mentors/${mentor._id}/request`, {
        topic: requestTopic,
        message: requestMsg,
      });
      toast.success(data.message || `Guidance request submitted to ${mentor.name}!`);
      setRequestMsg("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl mx-auto px-2 sm:px-0">
        <Link
          to="/mentors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition"
        >
          <FiArrowLeft size={14} /> Back to Mentors List
        </Link>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : !mentor ? (
          <div className="text-center py-16 card">
            <p className="text-slate-400 dark:text-gray-400 font-semibold">Mentor not found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Profile Sidebar */}
            <div className="md:col-span-1 space-y-4">
              <div className="card text-center flex flex-col items-center p-5">
                <Avatar src={mentor.profilePicture} name={mentor.name} size="xl" />
                <h1 className="font-bold text-slate-900 dark:text-gray-100 text-lg mt-3">{mentor.name}</h1>
                <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mt-0.5">{mentor.title}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <FiBriefcase size={12} /> {mentor.company}
                </p>

                <div className="flex items-center gap-1 mt-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold">
                  <FiStar size={13} className="fill-amber-400" />
                  <span>{mentor.rating?.toFixed(1) || "4.9"}</span>
                  <span className="text-slate-400 dark:text-gray-500">({mentor.reviewsCount} reviews)</span>
                </div>

                {/* Mentor Email Badge */}
                {mentor.email && (
                  <div className="w-full mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-600 text-left space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500 block">
                      Mentor Email Address
                    </span>
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-xs font-medium text-slate-700 dark:text-gray-300 truncate">
                        {mentor.email}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(mentor.email)}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:text-gray-400 dark:hover:text-white transition rounded hover:bg-slate-200 dark:hover:bg-dark-700 shrink-0"
                        title="Copy email"
                      >
                        {copiedEmail === mentor.email ? (
                          <FiCheck size={13} className="text-emerald-500" />
                        ) : (
                          <FiCopy size={13} />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className="w-full border-t border-slate-200 dark:border-dark-600 my-4" />

                <div className="w-full text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
                    <span>Experience</span>
                    <span className="text-slate-800 dark:text-gray-200 font-medium">{mentor.experience}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
                    <span>Sessions Mentored</span>
                    <span className="text-slate-800 dark:text-gray-200 font-medium">{mentor.sessionsCompleted || 24} Sessions</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
                    <span>Status</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <FiShield size={12} /> Verified Mentor
                    </span>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mt-5">
                  {mentor.githubLink && (
                    <a
                      href={mentor.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-dark-600 rounded-lg text-slate-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
                    >
                      <FiGithub size={18} />
                    </a>
                  )}
                  {mentor.linkedinLink && (
                    <a
                      href={mentor.linkedinLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-dark-600 rounded-lg text-slate-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
                    >
                      <FiLinkedin size={18} />
                    </a>
                  )}
                </div>
              </div>

              <div className="card space-y-2 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary-600 dark:text-primary-400">
                  <FiClock size={14} /> Availability
                </div>
                <p className="text-xs text-slate-600 dark:text-gray-300">{mentor.availability}</p>
              </div>
            </div>

            {/* Right Main Content & Request Form */}
            <div className="md:col-span-2 space-y-6">
              {/* Bio & Expertise */}
              <div className="card space-y-4 p-5">
                <div>
                  <h2 className="text-sm uppercase tracking-wider font-semibold text-slate-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
                    <FiBookOpen size={14} className="text-primary-600 dark:text-primary-400" /> About Mentor
                  </h2>
                  <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {mentor.bio || "Available to provide technical guidance, code architecture advice, and team mentorship."}
                  </p>
                </div>

                <div>
                  <h2 className="text-sm uppercase tracking-wider font-semibold text-slate-500 dark:text-gray-400 mb-2">Domain & Tech Stack Expertise</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.expertise?.map((exp) => (
                      <SkillBadge key={exp} skill={exp} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Guidance Areas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="card bg-slate-50 dark:bg-dark-800/80 border-slate-200 dark:border-dark-600 p-4">
                  <p className="text-xs font-bold text-primary-600 dark:text-primary-400 mb-1">💻 Architecture & Code Review</p>
                  <p className="text-xs text-slate-600 dark:text-gray-400">Get assistance structuring frontend & backend code, database schemas, and clean code principles.</p>
                </div>
                <div className="card bg-slate-50 dark:bg-dark-800/80 border-slate-200 dark:border-dark-600 p-4">
                  <p className="text-xs font-bold text-primary-600 dark:text-primary-400 mb-1">🚀 Project & Career Guidance</p>
                  <p className="text-xs text-slate-600 dark:text-gray-400">Receive direction on choosing tech stacks, pitch preparation, and tech interview advice.</p>
                </div>
              </div>

              {/* Mentorship Request Form */}
              <div className="card space-y-4 border-primary-500/30 dark:border-primary-500/20 bg-gradient-to-b from-white to-slate-50 dark:from-dark-800 dark:to-dark-800/90 shadow-md p-5">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
                  <FiMessageCircle className="text-primary-600 dark:text-primary-400" size={18} />
                  <span>Request Mentorship / Guidance</span>
                </div>

                <div className="bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl p-3 text-xs text-slate-600 dark:text-gray-300">
                  Submit your request. {mentor.name} will review this directly in their <strong>Mentor Dashboard</strong>.
                </div>

                <form onSubmit={submitMentorshipRequest} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">Topic / Subject</label>
                    <input
                      type="text"
                      value={requestTopic}
                      onChange={(e) => setRequestTopic(e.target.value)}
                      placeholder="e.g. MERN Stack Project Architecture Guidance"
                      className="input-field text-xs sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">Detailed Request Message</label>
                    <textarea
                      rows={4}
                      value={requestMsg}
                      onChange={(e) => setRequestMsg(e.target.value)}
                      placeholder="Explain your project goals, tech stack, and what specific advice or help you are seeking from this mentor..."
                      className="input-field resize-none text-xs sm:text-sm"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-primary py-2.5 bg-primary-600 hover:bg-primary-500 text-sm font-semibold flex items-center justify-center gap-2 shadow-md"
                  >
                    {submitting ? <Spinner size="sm" /> : <FiSend size={16} />}
                    Submit Guidance Request to {mentor.name}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MentorDetail;
