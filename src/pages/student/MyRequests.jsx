import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import MainLayout from "../../components/layout/MainLayout";
import Avatar from "../../components/common/Avatar";
import SkillBadge from "../../components/common/SkillBadge";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import {
  FiMail,
  FiAward,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiCopy,
  FiCheck,
  FiExternalLink,
} from "react-icons/fi";

const MyRequests = () => {
  const [activeTab, setActiveTab] = useState("received");
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [mentorRequests, setMentorRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recRes, sentRes, mentorRes] = await Promise.all([
        API.get("/joinrequests/received"),
        API.get("/joinrequests/sent"),
        API.get("/mentors/requests/my").catch(() => ({ data: { data: [] } })),
      ]);
      setReceived(recRes.data.data || []);
      setSent(sentRes.data.data || []);
      setMentorRequests(mentorRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const respond = async (requestId, status) => {
    try {
      await API.put(`/joinrequests/${requestId}`, { status });
      toast.success(`Request ${status}!`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const cancel = async (requestId) => {
    try {
      await API.delete(`/joinrequests/${requestId}`);
      toast.success("Request cancelled");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const cancelMentorReq = async (requestId) => {
    try {
      await API.delete(`/mentors/requests/${requestId}`);
      toast.success("Mentorship request cancelled");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    }
  };

  const copyToClipboard = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    toast.success("Email copied to clipboard!");
    setTimeout(() => setCopiedEmail(""), 2000);
  };

  const pendingReceived = received.filter((r) => r.status === "pending");

  return (
    <MainLayout>
      <div className="space-y-5">
        <h1 className="text-xl font-bold dark:text-white text-slate-900">
          Requests & Mentorship
        </h1>

        {/* Tabs (Responsive Wrap) */}
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-dark-750 border border-slate-200 dark:border-dark-600 p-1 rounded-xl w-full sm:w-fit">
          {[
            {
              key: "received",
              label: "Team Requests Received",
              count: pendingReceived.length,
            },
            { key: "sent", label: "Team Requests Sent", count: sent.length },
            {
              key: "mentorship",
              label: "Mentor Requests",
              count: mentorRequests.length,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center justify-center gap-1.5 sm:gap-2 flex-1 sm:flex-none ${
                activeTab === tab.key
                  ? "bg-white dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800/60 shadow-sm"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key
                    ? "bg-primary-100 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300"
                    : "bg-slate-200 dark:bg-dark-600 text-slate-600 dark:text-gray-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : activeTab === "received" ? (
          <ReceivedTab requests={received} onRespond={respond} />
        ) : activeTab === "sent" ? (
          <SentTab requests={sent} onCancel={cancel} />
        ) : (
          <MentorshipTab
            requests={mentorRequests}
            onCancel={cancelMentorReq}
            onCopy={copyToClipboard}
            copiedEmail={copiedEmail}
          />
        )}
      </div>
    </MainLayout>
  );
};

const statusBadge = (status) => {
  const map = {
    pending: "badge-yellow",
    accepted: "badge-green",
    rejected: "badge-red",
    cancelled: "badge-gray",
  };
  return map[status] || "badge-gray";
};

const ReceivedTab = ({ requests, onRespond }) => {
  if (requests.length === 0)
    return (
      <EmptyState
        icon="📬"
        title="No requests received"
        description="Share your projects to get join requests!"
      />
    );

  return (
    <div className="space-y-3">
      {requests.map((req) => (
        <div key={req._id} className="card p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <Avatar
                src={req.sender?.profilePicture}
                name={req.sender?.name}
                size="md"
              />
              <div className="min-w-0">
                <Link
                  to={`/students/${req.sender?._id}`}
                  className="font-semibold text-slate-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition text-sm truncate block"
                >
                  {req.sender?.name}
                </Link>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                  wants to join
                </p>
                <Link
                  to={`/projects/${req.project?._id}`}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium block truncate"
                >
                  {req.project?.title}
                </Link>
                {req.message && (
                  <p className="text-xs text-slate-600 dark:text-gray-300 mt-2 bg-slate-50 dark:bg-dark-700 px-3 py-2 rounded-lg italic border border-slate-200 dark:border-dark-600">
                    "{req.message}"
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {req.sender?.skills
                    ?.slice(0, 4)
                    .map((s) => (
                      <SkillBadge key={s} skill={s} />
                    ))}
                </div>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-dark-700">
              <span className={statusBadge(req.status)}>{req.status}</span>
              {req.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onRespond(req._id, "accepted")}
                    className="btn-primary py-1 px-3 text-xs"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onRespond(req._id, "rejected")}
                    className="btn-danger py-1 px-3 text-xs"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SentTab = ({ requests, onCancel }) => {
  if (requests.length === 0)
    return (
      <EmptyState
        icon="📤"
        title="No requests sent"
        description="Browse projects and send join requests!"
      />
    );

  return (
    <div className="space-y-3">
      {requests.map((req) => (
        <div
          key={req._id}
          className="card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 sm:p-5"
        >
          <div className="min-w-0">
            <Link
              to={`/projects/${req.project?._id}`}
              className="font-semibold text-slate-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition text-sm truncate block"
            >
              {req.project?.title}
            </Link>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              Owner: {req.receiver?.name}
            </p>
            {req.message && (
              <p className="text-xs text-slate-600 dark:text-gray-300 mt-1 italic bg-slate-50 dark:bg-dark-700 px-3 py-1 rounded-lg border border-slate-200 dark:border-dark-600">
                "{req.message}"
              </p>
            )}
          </div>
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-dark-700">
            <span className={statusBadge(req.status)}>{req.status}</span>
            {req.status === "pending" && (
              <button
                onClick={() => onCancel(req._id)}
                className="text-xs text-primary-600 dark:text-primary-400 hover:underline transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const MentorshipTab = ({ requests, onCancel, onCopy, copiedEmail }) => {
  if (requests.length === 0)
    return (
      <EmptyState
        icon="🎓"
        title="No mentorship requests sent"
        description="Visit the Mentors page to reach out to industry mentors for guidance!"
      />
    );

  return (
    <div className="space-y-3">
      {requests.map((req) => (
        <div
          key={req._id}
          className={`card p-4 sm:p-5 transition ${
            req.status === "accepted"
              ? "border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10"
              : ""
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-start gap-3.5 min-w-0">
              <Avatar
                src={req.mentor?.profilePicture}
                name={req.mentor?.name || "Mentor"}
                size="md"
              />
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={`/mentors/${req.mentor?._id}`}
                    className="font-bold text-slate-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition text-sm flex items-center gap-1 truncate"
                  >
                    {req.mentor?.name} <FiExternalLink size={12} />
                  </Link>
                  <span className="text-xs text-primary-600 dark:text-primary-400 font-medium truncate">
                    {req.mentor?.title}
                  </span>
                </div>

                {/* Mentor Email Badge (Responsive) */}
                {(req.mentor?.email || req.mentorEmail) && (
                  <div className="flex items-center gap-2 text-xs py-0.5">
                    <span className="text-slate-500 dark:text-gray-400 flex items-center gap-1 shrink-0">
                      <FiMail size={12} className="text-primary-600 dark:text-primary-400" />
                      Email:
                    </span>
                    <a
                      href={`mailto:${req.mentor?.email || req.mentorEmail}`}
                      className="text-primary-600 dark:text-primary-400 hover:underline font-medium truncate"
                    >
                      {req.mentor?.email || req.mentorEmail}
                    </a>
                    <button
                      type="button"
                      onClick={() => onCopy(req.mentor?.email || req.mentorEmail)}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition p-0.5 shrink-0"
                      title="Copy email"
                    >
                      {copiedEmail === (req.mentor?.email || req.mentorEmail) ? (
                        <FiCheck size={12} className="text-emerald-500" />
                      ) : (
                        <FiCopy size={12} />
                      )}
                    </button>
                  </div>
                )}

                <div className="text-xs text-slate-800 dark:text-gray-200 font-semibold pt-1">
                  Topic: {req.topic}
                </div>

                {req.message && (
                  <p className="text-xs text-slate-600 dark:text-gray-300 italic bg-slate-50 dark:bg-dark-700 px-3 py-2 rounded-lg border border-slate-200 dark:border-dark-600">
                    "{req.message}"
                  </p>
                )}

                <p className="text-[11px] text-slate-400 dark:text-gray-500 pt-1">
                  Sent on {new Date(req.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-dark-700">
              <span className={statusBadge(req.status)}>
                {req.status === "accepted"
                  ? "Accepted 🎉"
                  : req.status === "rejected"
                  ? "Declined ❌"
                  : req.status}
              </span>

              {req.status === "pending" && (
                <button
                  onClick={() => onCancel(req._id)}
                  className="text-xs text-rose-600 hover:underline transition"
                >
                  Cancel Request
                </button>
              )}

              {req.status === "accepted" && (
                <a
                  href={`mailto:${req.mentor?.email || req.mentorEmail}?subject=Follow up: Mentorship on ${encodeURIComponent(req.topic)}`}
                  className="btn-primary py-1 px-3 text-xs flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 shrink-0"
                >
                  <FiMail size={12} /> Contact Mentor
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyRequests;
