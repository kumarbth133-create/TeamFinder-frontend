import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import MainLayout from "../../components/layout/MainLayout";
import Spinner from "../../components/common/Spinner";
import Avatar from "../../components/common/Avatar";
import SkillBadge from "../../components/common/SkillBadge";
import {
  FiPlus, FiFolder, FiUsers, FiBell, FiSend,
  FiArrowRight, FiTrendingUp, FiActivity,
} from "react-icons/fi";

const Dashboard = () => {
  const { user } = useAuth();
  const [myProjects, setMyProjects] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, sentRes, receivedRes, notifRes] = await Promise.all([
          API.get("/projects/my-projects"),
          API.get("/joinrequests/sent"),
          API.get("/joinrequests/received"),
          API.get("/notifications"),
        ]);
        setMyProjects(projRes.data.data);
        setSentRequests(sentRes.data.data);
        setReceivedRequests(receivedRes.data.data.filter((r) => r.status === "pending"));
        setNotifications(notifRes.data.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <MainLayout>
      <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    </MainLayout>
  );

  const totalMembers = myProjects.reduce((acc, p) => acc + (p.teamMembers?.length || 0), 0);

  const stats = [
    {
      label: "My Projects", value: myProjects.length,
      icon: <FiFolder size={20} />, iconBg: "bg-blue-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400",
      trend: "+20% this month", to: "/my-projects",
    },
    {
      label: "Requests Sent", value: sentRequests.length,
      icon: <FiSend size={20} />, iconBg: "bg-primary-100 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400",
      trend: "Active", to: "/my-requests",
    },
    {
      label: "Pending Requests", value: receivedRequests.length,
      icon: <FiBell size={20} />, iconBg: "bg-amber-50 text-amber-600 dark:bg-yellow-500/10 dark:text-yellow-400",
      trend: "Action needed", to: "/my-requests",
    },
    {
      label: "Team Members", value: totalMembers,
      icon: <FiUsers size={20} />, iconBg: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
      trend: "+10% this month", to: "/my-projects",
    },
  ];

  const typeEmoji = {
    join_request_sent: "📨",
    join_request_accepted: "🎉",
    join_request_rejected: "❌",
    join_request_cancelled: "🚫",
    project_update: "📢",
  };

  return (
    <MainLayout>
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 shadow-sm">
            <div className="relative flex items-center gap-5">
              <Avatar src={user?.profilePicture} name={user?.name} size="xl" className="ring-4 ring-white/20" />
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  Welcome back, {user?.name?.split(" ")[0]}! 👋
                </h1>
                <p className="text-primary-100 text-sm mt-1">
                  Let's collaborate and build something amazing together today.
                </p>
                {user?.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {user.skills.slice(0, 5).map((s) => (
                      <span key={s} className="text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-full font-medium backdrop-blur-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Link key={stat.label} to={stat.to} className="stat-card group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconBg} mb-3`}>
                  {stat.icon}
                </div>
                <p className="text-2xl font-extrabold dark:text-white text-slate-900">{stat.value}</p>
                <p className="text-xs dark:text-gray-400 text-slate-500 mt-0.5">{stat.label}</p>
                <p className="text-xs text-primary-600 dark:text-primary-400 mt-1 flex items-center gap-1 font-medium">
                  <FiTrendingUp size={11} /> {stat.trend}
                </p>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Link to="/projects/create" className="btn-primary">
              <FiPlus size={16} /> Create Project
            </Link>
            <Link to="/projects" className="btn-secondary">
              <FiFolder size={16} /> Browse Projects
            </Link>
            <Link to="/students" className="btn-secondary">
              <FiUsers size={16} /> Find Teammates
            </Link>
          </div>

          {/* My Projects */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-header mb-0">My Projects</h2>
              <Link to="/my-projects" className="text-xs font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 flex items-center gap-1 transition">
                View all <FiArrowRight size={12} />
              </Link>
            </div>

            {myProjects.length === 0 ? (
              <div className="card text-center py-10">
                <FiFolder className="mx-auto text-4xl mb-3 text-slate-400 dark:text-gray-600" />
                <p className="text-slate-500 dark:text-gray-400 text-sm">No projects created yet.</p>
                <Link to="/projects/create" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline text-sm mt-1 inline-block">
                  Create your first project →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myProjects.slice(0, 3).map((project) => (
                  <Link key={project._id} to={`/projects/${project._id}`}
                    className="card-hover flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold dark:text-gray-100 text-slate-900 text-sm truncate">{project.title}</h3>
                        <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                          project.status === "open"
                            ? "bg-primary-100 text-primary-700 dark:bg-primary-800/50 dark:text-primary-300"
                            : project.status === "closed"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400"
                            : "bg-slate-100 text-slate-700 dark:bg-gray-800 dark:text-gray-400"
                        }`}>{project.status}</span>
                      </div>
                      <p className="text-xs dark:text-gray-400 text-slate-600 line-clamp-2 mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.skillsRequired.slice(0, 3).map((s) => (
                          <SkillBadge key={s} skill={s} />
                        ))}
                      </div>
                    </div>
                    <FiArrowRight size={15} className="text-slate-400 dark:text-gray-500 flex-shrink-0 mt-1" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pending Requests */}
          {receivedRequests.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="section-header mb-0">
                  Pending Requests
                  <span className="ml-2 badge-yellow text-xs px-2 py-0.5 rounded-full">
                    {receivedRequests.length}
                  </span>
                </h2>
                <Link to="/my-requests" className="text-xs font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 flex items-center gap-1 transition">
                  View all <FiArrowRight size={12} />
                </Link>
              </div>
              <div className="space-y-2">
                {receivedRequests.slice(0, 3).map((req) => (
                  <div key={req._id} className="card flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={req.sender?.profilePicture} name={req.sender?.name} size="sm" />
                      <div>
                        <p className="text-sm font-semibold dark:text-gray-200 text-slate-900">{req.sender?.name}</p>
                        <p className="text-xs dark:text-gray-400 text-slate-500">
                          wants to join "{req.project?.title}"
                        </p>
                      </div>
                    </div>
                    <Link to="/my-requests" className="btn-primary py-1.5 px-3 text-xs">
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side Panel */}
        <aside className="w-full xl:w-72 flex-shrink-0 space-y-5">
          {/* Recent Activity */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold dark:text-gray-100 text-slate-900 flex items-center gap-2">
                <FiActivity size={16} className="text-primary-600 dark:text-primary-400" /> Recent Activity
              </h3>
              <Link to="/notifications" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                View all
              </Link>
            </div>

            {notifications.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-gray-500 text-center py-4">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n._id} className="flex items-start gap-2.5">
                    <span className="text-base flex-shrink-0 mt-0.5">
                      {typeEmoji[n.type] || "🔔"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs dark:text-gray-300 text-slate-700 leading-relaxed line-clamp-2">{n.message}</p>
                      {n.project && (
                        <Link to={`/projects/${n.project._id}`}
                          className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline truncate block mt-0.5">
                          {n.project.title}
                        </Link>
                      )}
                      <p className="text-[11px] text-slate-400 dark:text-gray-500 mt-0.5">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Completion Card */}
          {(!user?.bio || !user?.skills?.length || !user?.githubLink) && (
            <div className="card border-primary-200 dark:border-emerald-800/40">
              <h3 className="text-sm font-bold dark:text-gray-100 text-slate-900 mb-3">Complete Your Profile</h3>
              <div className="space-y-2">
                {!user?.bio && (
                  <Link to="/profile" className="flex items-center justify-between text-xs text-slate-600 dark:text-gray-400 hover:text-primary-600 transition group">
                    <span>Add a bio</span>
                    <FiArrowRight size={12} className="group-hover:translate-x-1 transition" />
                  </Link>
                )}
                {(!user?.skills || user.skills.length === 0) && (
                  <Link to="/profile" className="flex items-center justify-between text-xs text-slate-600 dark:text-gray-400 hover:text-primary-600 transition group">
                    <span>Add your skills</span>
                    <FiArrowRight size={12} className="group-hover:translate-x-1 transition" />
                  </Link>
                )}
                {!user?.githubLink && (
                  <Link to="/profile" className="flex items-center justify-between text-xs text-slate-600 dark:text-gray-400 hover:text-primary-600 transition group">
                    <span>Add GitHub profile</span>
                    <FiArrowRight size={12} className="group-hover:translate-x-1 transition" />
                  </Link>
                )}
              </div>
              <Link to="/profile" className="mt-4 btn-primary w-full text-xs py-2">
                Update Profile
              </Link>
            </div>
          )}
        </aside>
      </div>
    </MainLayout>
  );
};

// Helper: time ago
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default Dashboard;
