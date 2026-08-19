import { useState, useEffect } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout/AdminLayout";
import Spinner from "../../components/common/Spinner";
import ConfirmModal from "../../components/common/ConfirmModal";
import { FiSearch, FiTrash2, FiUsers } from "react-icons/fi";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = async (q = "") => {
    setLoading(true);
    try {
      const { data } = await API.get(`/admin/projects${q ? `?search=${q}` : ""}`);
      setProjects(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await API.delete(`/admin/projects/${deleteTarget._id}`);
      setProjects((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      toast.success("Project deleted");
    } catch { toast.error("Delete failed"); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <h1 className="text-xl font-bold dark:text-white text-slate-900">Manage Projects</h1>

        <form onSubmit={(e) => { e.preventDefault(); fetchProjects(search); }} className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" size={14} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..." className="input-field pl-9" />
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </form>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 dark:border-dark-600">
              <p className="text-xs text-slate-500 dark:text-gray-400">{projects.length} projects</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header text-left">Project</th>
                    <th className="table-header text-left">Owner</th>
                    <th className="table-header text-left">Team</th>
                    <th className="table-header text-left">Status</th>
                    <th className="table-header text-left">Active</th>
                    <th className="table-header text-left">Created</th>
                    <th className="table-header text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project._id} className="table-row">
                      <td className="table-cell">
                        <p className="font-medium text-slate-900 dark:text-gray-200 text-sm max-w-40 truncate">{project.title}</p>
                      </td>
                      <td className="table-cell">
                        <p className="text-slate-800 dark:text-gray-300 text-sm font-medium">{project.owner?.name}</p>
                        <p className="text-slate-400 dark:text-gray-500 text-xs">{project.owner?.email}</p>
                      </td>
                      <td className="table-cell">
                        <span className="flex items-center gap-1 text-slate-500 dark:text-gray-400 text-xs">
                          <FiUsers size={11} /> {project.teamMembers?.length}/{project.maxMembers}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          project.status === "open" ? "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 border border-primary-200 dark:border-primary-800/40" :
                          project.status === "closed" ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400" : "bg-slate-100 text-slate-700 dark:bg-gray-800 dark:text-gray-400"
                        }`}>{project.status}</span>
                      </td>
                      <td className="table-cell">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          project.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-slate-100 text-slate-700 dark:bg-gray-800 dark:text-gray-500"
                        }`}>{project.isActive ? "Yes" : "No"}</span>
                      </td>
                      <td className="table-cell text-slate-400 dark:text-gray-500 text-xs">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </td>
                      <td className="table-cell text-right">
                        <button onClick={() => setDeleteTarget(project)}
                          className="text-slate-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition p-1">
                          <FiTrash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {projects.length === 0 && (
                <div className="text-center py-12 text-slate-500 dark:text-gray-400 text-sm">No projects found</div>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Project"
        message={`Permanently delete "${deleteTarget?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText={deleting ? "Deleting..." : "Delete"}
      />
    </AdminLayout>
  );
};

export default AdminProjects;
