import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import MainLayout from "../../components/layout/MainLayout";
import Avatar from "../../components/common/Avatar";
import SkillBadge from "../../components/common/SkillBadge";
import Spinner from "../../components/common/Spinner";
import ConfirmModal from "../../components/common/ConfirmModal";
import { FiArrowLeft, FiEdit2, FiTrash2, FiGithub, FiUsers, FiSend } from "react-icons/fi";

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinRequest, setJoinRequest] = useState(null);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [message, setMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, sentRes] = await Promise.all([
          API.get(`/projects/${id}`),
          API.get("/joinrequests/sent"),
        ]);
        setProject(projRes.data.data);
        const existing = sentRes.data.data.find((r) => r.project?._id === id);
        setJoinRequest(existing || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const isOwner = project?.owner?._id === user?._id;
  const isMember = project?.teamMembers?.some((m) => m._id === user?._id);

  const handleSendRequest = async () => {
    setSendingRequest(true);
    try {
      await API.post("/joinrequests", { projectId: id, message });
      toast.success("Join request sent!");
      const sentRes = await API.get("/joinrequests/sent");
      const updated = sentRes.data.data.find((r) => r.project?._id === id);
      setJoinRequest(updated || null);
      setMessage("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    } finally {
      setSendingRequest(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!joinRequest) return;
    try {
      await API.delete(`/joinrequests/${joinRequest._id}`);
      toast.success("Request cancelled");
      setJoinRequest(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/projects/${id}`);
      toast.success("Project deleted");
      navigate("/my-projects");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) return <MainLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></MainLayout>;
  if (!project) return <MainLayout><div className="text-center py-20 text-gray-500">Project not found.</div></MainLayout>;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/projects" className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
          <FiArrowLeft /> Back to Projects
        </Link>

        {/* Project Header */}
        <div className="card">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-100">{project.title}</h1>
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                  project.status === "open" ? "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 border border-primary-200 dark:border-primary-700/40" :
                  project.status === "closed" ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800/40" : "bg-slate-100 text-slate-700 dark:bg-dark-700 dark:text-gray-400"
                }`}>{project.status}</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                Created by <span className="font-medium text-slate-800 dark:text-gray-200">{project.owner?.name}</span>
              </p>
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div className="flex gap-2">
                <Link to={`/projects/${id}/edit`} className="btn-secondary flex items-center gap-1 text-sm">
                  <FiEdit2 size={14} /> Edit
                </Link>
                <button onClick={() => setShowDeleteModal(true)} className="btn-danger flex items-center gap-1 text-sm">
                  <FiTrash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>

          <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-4">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.skillsRequired.map((s) => <SkillBadge key={s} skill={s} />)}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <FiUsers size={14} /> {project.teamMembers.length}/{project.maxMembers} members
            </span>
            {project.githubRepo && (
              <a href={project.githubRepo} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline">
                <FiGithub size={14} /> GitHub Repo
              </a>
            )}
          </div>
        </div>

        {/* Join Request Section */}
        {!isOwner && !isMember && project.status === "open" && (
          <div className="card">
            <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-3">Join this Project</h3>
            {!joinRequest || joinRequest.status === "rejected" ? (
              <div className="space-y-3">
                {joinRequest?.status === "rejected" && (
                  <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800/40">
                    Your previous request was rejected. You can send a new one.
                  </p>
                )}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  maxLength={300}
                  placeholder="Write a brief message about why you want to join (optional)..."
                  className="input-field resize-none"
                />
                <button onClick={handleSendRequest} disabled={sendingRequest} className="btn-primary flex items-center gap-2">
                  {sendingRequest ? <Spinner size="sm" /> : <><FiSend size={14} /> Send Join Request</>}
                </button>
              </div>
            ) : joinRequest.status === "pending" ? (
              <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-xl p-3">
                <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">✅ Request sent — waiting for owner's response</p>
                <button onClick={handleCancelRequest} className="text-sm text-primary-600 dark:text-primary-400 hover:underline">Cancel</button>
              </div>
            ) : joinRequest.status === "accepted" ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-3">
                <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">🎉 Your request was accepted! You are a team member.</p>
              </div>
            ) : null}
          </div>
        )}

        {isMember && !isOwner && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-4">
            <p className="text-emerald-800 dark:text-emerald-300 font-medium">✅ You are a member of this project!</p>
          </div>
        )}

        {/* Team Members */}
        <div className="card">
          <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <FiUsers /> Team Members ({project.teamMembers.length})
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {project.teamMembers.map((member) => (
              <Link key={member._id} to={`/students/${member._id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-700 transition">
                <Avatar src={member.profilePicture} name={member.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-gray-100">
                    {member.name}
                    {member._id === project.owner._id && (
                      <span className="ml-2 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 px-1.5 py-0.5 rounded font-medium">Owner</span>
                    )}
                  </p>
                  {member.college && <p className="text-xs text-slate-500 dark:text-gray-400">{member.college}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Owner: Pending Requests */}
        {isOwner && <PendingRequestsSection projectId={id} projectTitle={project.title} />}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirmText={deleting ? "Deleting..." : "Delete"}
      />
    </MainLayout>
  );
};

// Sub-component: Pending Requests for owner
const PendingRequestsSection = ({ projectId, projectTitle }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const { data } = await API.get("/joinrequests/received");
      const filtered = data.data.filter(
        (r) => r.project?._id === projectId && r.status === "pending"
      );
      setRequests(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [projectId]);

  const respond = async (requestId, status) => {
    try {
      await API.put(`/joinrequests/${requestId}`, { status });
      toast.success(`Request ${status}!`);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  if (loading || requests.length === 0) return null;

  return (
    <div className="card">
      <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-4">
        Pending Join Requests ({requests.length})
      </h3>
      <div className="space-y-3">
        {requests.map((req) => (
          <div key={req._id} className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-dark-700 rounded-xl border border-slate-200 dark:border-dark-600">
            <div className="flex items-center gap-3">
              <Avatar src={req.sender?.profilePicture} name={req.sender?.name} size="sm" />
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-gray-100">{req.sender?.name}</p>
                {req.message && <p className="text-xs text-slate-500 dark:text-gray-400 max-w-xs">{req.message}</p>}
                <div className="flex flex-wrap gap-1 mt-1">
                  {req.sender?.skills?.slice(0, 3).map((s) => <SkillBadge key={s} skill={s} />)}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => respond(req._id, "accepted")} className="btn-primary text-sm py-1">Accept</button>
              <button onClick={() => respond(req._id, "rejected")} className="btn-danger text-sm py-1">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetail;
