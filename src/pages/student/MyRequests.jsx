import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import MainLayout from "../../components/layout/MainLayout";
import Avatar from "../../components/common/Avatar";
import SkillBadge from "../../components/common/SkillBadge";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";

const MyRequests = () => {
  const [activeTab, setActiveTab] = useState("received");
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recRes, sentRes] = await Promise.all([
        API.get("/joinrequests/received"),
        API.get("/joinrequests/sent"),
      ]);
      setReceived(recRes.data.data);
      setSent(sentRes.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const respond = async (requestId, status) => {
    try {
      await API.put(`/joinrequests/${requestId}`, { status });
      toast.success(`Request ${status}!`);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const cancel = async (requestId) => {
    try {
      await API.delete(`/joinrequests/${requestId}`);
      toast.success("Request cancelled");
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const pendingReceived = received.filter((r) => r.status === "pending");

  return (
    <MainLayout>
      <div className="space-y-5">
        <h1 className="text-xl font-bold text-white">Join Requests</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-dark-750 border border-dark-600 p-1 rounded-xl w-fit">
          {[
            { key: "received", label: "Received", count: pendingReceived.length },
            { key: "sent", label: "Sent", count: sent.length },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-primary-700/20 text-green-400 border border-primary-600/30"
                  : "text-gray-500 hover:text-gray-200"
              }`}>
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? "bg-primary-800/50 text-green-400" : "bg-dark-600 text-gray-500"
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : activeTab === "received" ? (
          <ReceivedTab requests={received} onRespond={respond} />
        ) : (
          <SentTab requests={sent} onCancel={cancel} />
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
  };
  return map[status] || "badge-gray";
};

const ReceivedTab = ({ requests, onRespond }) => {
  if (requests.length === 0)
    return <EmptyState icon="📬" title="No requests received" description="Share your projects to get join requests!" />;

  return (
    <div className="space-y-3">
      {requests.map((req) => (
        <div key={req._id} className="card">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex items-start gap-3">
              <Avatar src={req.sender?.profilePicture} name={req.sender?.name} size="md" />
              <div>
                <Link to={`/students/${req.sender?._id}`}
                  className="font-semibold text-gray-100 hover:text-green-400 transition text-sm">
                  {req.sender?.name}
                </Link>
                <p className="text-xs text-gray-500 mt-0.5">wants to join</p>
                <Link to={`/projects/${req.project?._id}`}
                  className="text-sm text-green-400 hover:underline font-medium">
                  {req.project?.title}
                </Link>
                {req.message && (
                  <p className="text-xs text-gray-500 mt-2 bg-dark-700 px-3 py-2 rounded-lg italic border border-dark-600">
                    "{req.message}"
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {req.sender?.skills?.slice(0, 4).map((s) => <SkillBadge key={s} skill={s} />)}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={statusBadge(req.status)}>{req.status}</span>
              {req.status === "pending" && (
                <div className="flex gap-2">
                  <button onClick={() => onRespond(req._id, "accepted")} className="btn-primary py-1 px-3 text-xs">Accept</button>
                  <button onClick={() => onRespond(req._id, "rejected")} className="btn-danger py-1 px-3 text-xs">Reject</button>
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
    return <EmptyState icon="📤" title="No requests sent" description="Browse projects and send join requests!" />;

  return (
    <div className="space-y-3">
      {requests.map((req) => (
        <div key={req._id} className="card flex flex-wrap justify-between items-center gap-4">
          <div>
            <Link to={`/projects/${req.project?._id}`}
              className="font-semibold text-gray-100 hover:text-green-400 transition text-sm">
              {req.project?.title}
            </Link>
            <p className="text-xs text-gray-500 mt-0.5">Owner: {req.receiver?.name}</p>
            {req.message && <p className="text-xs text-gray-500 mt-1 italic">"{req.message}"</p>}
          </div>
          <div className="flex items-center gap-3">
            <span className={statusBadge(req.status)}>{req.status}</span>
            {req.status === "pending" && (
              <button onClick={() => onCancel(req._id)}
                className="text-xs text-red-400 hover:text-red-300 transition hover:underline">
                Cancel
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyRequests;
