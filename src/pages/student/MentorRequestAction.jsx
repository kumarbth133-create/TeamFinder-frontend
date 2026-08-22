import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../../api/axios";
import Spinner from "../../components/common/Spinner";
import Avatar from "../../components/common/Avatar";
import SkillBadge from "../../components/common/SkillBadge";
import {
  FiCheckCircle,
  FiXCircle,
  FiMail,
  FiUser,
  FiMessageSquare,
  FiCalendar,
  FiClock,
  FiArrowRight,
  FiExternalLink,
  FiShield,
  FiAward,
} from "react-icons/fi";

const MentorRequestAction = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const initialAction = searchParams.get("action");

  const [loading, setLoading] = useState(true);
  const [requestData, setRequestData] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [actionDoneMsg, setActionDoneMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setErrorMsg("Invalid or missing action token.");
      setLoading(false);
      return;
    }

    const processInitialAction = async () => {
      setLoading(true);
      try {
        let endpoint = `/mentors/requests/action?token=${encodeURIComponent(token)}`;
        if (initialAction && ["accept", "reject"].includes(initialAction.toLowerCase())) {
          endpoint += `&action=${encodeURIComponent(initialAction.toLowerCase())}`;
        }
        const { data } = await API.get(endpoint);
        setRequestData(data.data);
        setCurrentStatus(data.data.status);
        if (initialAction) {
          setActionDoneMsg(
            initialAction.toLowerCase() === "accept"
              ? "You have successfully ACCEPTED this mentorship guidance request!"
              : "You have declined this mentorship request."
          );
        }
      } catch (err) {
        console.error(err);
        setErrorMsg(
          err.response?.data?.message ||
            "Unable to load mentorship request. The link may have expired or is invalid."
        );
      } finally {
        setLoading(false);
      }
    };

    processInitialAction();
  }, [token, initialAction]);

  const handleAction = async (actionType) => {
    setSubmitting(true);
    try {
      const { data } = await API.post("/mentors/requests/action", {
        token,
        action: actionType,
        feedback,
      });
      setRequestData(data.data);
      setCurrentStatus(data.data.status);
      setActionDoneMsg(
        actionType === "accept"
          ? "You have successfully ACCEPTED this mentorship guidance request! The student has been notified in their dashboard."
          : "You have declined this mentorship request."
      );
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to submit response.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans">
      {/* Top Navigation / Brand Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#990012] via-[#ca0019] to-[#e6001c] flex items-center justify-center text-white font-black text-lg shadow-md shadow-[#ca0019]/30">
              T
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Team<span className="text-[#e6001c]">Up</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Mentor Portal
              </span>
            </div>
          </Link>

          <Link
            to="/login"
            className="text-xs font-semibold text-slate-400 hover:text-white transition flex items-center gap-1 bg-slate-800/70 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/60"
          >
            Go to Platform <FiExternalLink size={13} />
          </Link>
        </div>
      </header>

      {/* Main Action Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Spinner size="lg" />
            <p className="text-slate-400 text-sm font-medium">
              Verifying mentorship request details...
            </p>
          </div>
        ) : errorMsg ? (
          <div className="bg-slate-900/80 border border-rose-900/50 rounded-2xl p-8 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto text-2xl">
              <FiXCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-white">Action Failed</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">{errorMsg}</p>
            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl transition border border-slate-700"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : requestData ? (
          <div className="space-y-6">
            {/* Status Announcement Banner */}
            {currentStatus === "accepted" ? (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-slate-900 border border-emerald-500/30 p-6 shadow-lg shadow-emerald-950/40">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                    <FiCheckCircle size={28} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 inline-block mb-1">
                      Status: Accepted
                    </span>
                    <h2 className="text-xl font-bold text-white">
                      Mentorship Request Accepted 🎉
                    </h2>
                    <p className="text-sm text-emerald-200/90 leading-relaxed">
                      {actionDoneMsg ||
                        `You have accepted to mentor ${requestData.sender?.name}. A notification has been sent to the student!`}
                    </p>
                  </div>
                </div>
              </div>
            ) : currentStatus === "rejected" ? (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950/80 via-rose-900/40 to-slate-900 border border-rose-500/30 p-6 shadow-lg shadow-rose-950/40">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                    <FiXCircle size={28} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20 inline-block mb-1">
                      Status: Declined
                    </span>
                    <h2 className="text-xl font-bold text-white">
                      Mentorship Request Declined
                    </h2>
                    <p className="text-sm text-rose-200/90 leading-relaxed">
                      {actionDoneMsg ||
                        `You have declined this request. The student has been notified.`}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#990012] via-[#ca0019] to-[#e6001c] p-6 text-white shadow-xl shadow-[#ca0019]/20">
                <div className="flex items-center gap-3 mb-1">
                  <FiAward size={20} />
                  <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                    Mentorship Guidance Request
                  </span>
                </div>
                <h1 className="text-2xl font-black text-white">
                  Guidance Request for {requestData.mentor?.name}
                </h1>
                <p className="text-white/80 text-xs sm:text-sm mt-1">
                  Please review the student details and message below to accept or decline.
                </p>
              </div>
            )}

            {/* Student & Request Details Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl">
              {/* Student Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div className="flex items-center gap-3.5">
                  <Avatar
                    src={requestData.sender?.profilePicture}
                    name={requestData.sender?.name || "Student"}
                    size="lg"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-white">
                      {requestData.sender?.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <FiMail size={13} className="text-rose-400" />
                      <a
                        href={`mailto:${requestData.sender?.email}`}
                        className="text-rose-400 hover:underline"
                      >
                        {requestData.sender?.email}
                      </a>
                    </p>
                    {requestData.sender?.college && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        🏫 {requestData.sender.college}
                      </p>
                    )}
                  </div>
                </div>

                <a
                  href={`mailto:${requestData.sender?.email}?subject=Re: Mentorship Guidance - ${encodeURIComponent(
                    requestData.topic
                  )}`}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-700 transition"
                >
                  <FiMail size={14} /> Send Direct Email
                </a>
              </div>

              {/* Topic & Message Details */}
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Guidance Topic / Subject
                  </span>
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-100">
                    {requestData.topic}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Student's Message
                  </span>
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 leading-relaxed italic">
                    "{requestData.message}"
                  </div>
                </div>

                {requestData.sender?.skills?.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Student's Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {requestData.sender.skills.map((skill) => (
                        <SkillBadge key={skill} skill={skill} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons if still pending or want to change */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={submitting || currentStatus === "accepted"}
                    onClick={() => handleAction("accept")}
                    className={`flex-1 min-w-[160px] py-3 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                      currentStatus === "accepted"
                        ? "bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 cursor-default"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30"
                    }`}
                  >
                    {submitting ? <Spinner size="sm" /> : <FiCheckCircle size={17} />}
                    {currentStatus === "accepted" ? "Accepted" : "Accept Mentorship Request"}
                  </button>

                  <button
                    type="button"
                    disabled={submitting || currentStatus === "rejected"}
                    onClick={() => handleAction("reject")}
                    className={`py-3 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
                      currentStatus === "rejected"
                        ? "bg-rose-600/30 border border-rose-500/40 text-rose-300 cursor-default"
                        : "bg-slate-800 hover:bg-rose-900/40 hover:text-rose-300 text-slate-300 border border-slate-700"
                    }`}
                  >
                    <FiXCircle size={17} />
                    {currentStatus === "rejected" ? "Declined" : "Decline Request"}
                  </button>
                </div>

                <p className="text-center text-xs text-slate-500">
                  Accepting will generate an instant notification for the student on TeamUp.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4">
          <p>© {new Date().getFullYear()} TeamUp Platform. Project & Mentorship Finder.</p>
        </div>
      </footer>
    </div>
  );
};

export default MentorRequestAction;
