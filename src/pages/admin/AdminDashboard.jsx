import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import AdminLayout from "../../components/layout/AdminLayout";
import Spinner from "../../components/common/Spinner";
import { FiUsers, FiFolder, FiSend, FiActivity } from "react-icons/fi";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/stats")
      .then(({ data }) => setStats(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></AdminLayout>;

  const statCards = [
    { label: "Total Students", value: stats.totalStudents, icon: <FiUsers />, iconBg: "bg-primary-500/10 text-primary-400", to: "/admin/students" },
    { label: "Total Projects", value: stats.totalProjects, icon: <FiFolder />, iconBg: "bg-green-500/10 text-green-400", to: "/admin/projects" },
    { label: "Join Requests", value: stats.totalJoinRequests, icon: <FiSend />, iconBg: "bg-purple-500/10 text-purple-400", to: "/admin/projects" },
    { label: "Active Projects", value: stats.activeProjects, icon: <FiActivity />, iconBg: "bg-yellow-500/10 text-yellow-400", to: "/admin/projects" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-bold dark:text-white text-slate-900">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Link key={stat.label} to={stat.to} className="stat-card group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconBg} mb-3 text-lg`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold dark:text-white text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
            </Link>
          ))}
        </div>

        {/* Pending alert */}
        {stats.pendingRequests > 0 && (
          <div className="bg-amber-50 dark:bg-yellow-900/20 border border-amber-200 dark:border-yellow-700/40 rounded-xl p-4">
            <p className="text-amber-800 dark:text-yellow-400 font-medium text-sm">
              ⚠️ {stats.pendingRequests} pending join request{stats.pendingRequests !== 1 ? "s" : ""} waiting for action
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Recent Students */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-gray-100">Recent Students</h2>
              <Link to="/admin/students" className="text-xs text-primary-600 dark:text-primary-400 hover:underline transition font-medium">View all</Link>
            </div>
            <div className="space-y-3">
              {stats.recentStudents.map((s) => (
                <div key={s._id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-gray-200">{s.name}</p>
                    <p className="text-xs text-slate-500 dark:text-gray-400">{s.email}</p>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
              {stats.recentStudents.length === 0 && (
                <p className="text-xs text-slate-400 dark:text-gray-500 text-center py-4">No students yet</p>
              )}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-gray-100">Recent Projects</h2>
              <Link to="/admin/projects" className="text-xs text-primary-600 dark:text-primary-400 hover:underline transition font-medium">View all</Link>
            </div>
            <div className="space-y-3">
              {stats.recentProjects.map((p) => (
                <div key={p._id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-gray-200">{p.title}</p>
                    <p className="text-xs text-slate-500 dark:text-gray-400">by {p.owner?.name}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    p.status === "open" ? "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 border border-primary-200 dark:border-primary-800/40" : "bg-slate-100 text-slate-700 dark:bg-dark-700 dark:text-gray-400"
                  }`}>{p.status}</span>
                </div>
              ))}
              {stats.recentProjects.length === 0 && (
                <p className="text-xs text-slate-400 dark:text-gray-500 text-center py-4">No projects yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
