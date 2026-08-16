import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import MainLayout from "../../components/layout/MainLayout";
import SkillBadge from "../../components/common/SkillBadge";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import ConfirmModal from "../../components/common/ConfirmModal";
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiEye } from "react-icons/fi";

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    API.get("/projects/my-projects")
      .then(({ data }) => setProjects(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await API.delete(`/projects/${deleteTarget._id}`);
      toast.success("Project deleted!");
      setProjects(projects.filter((p) => p._id !== deleteTarget._id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) return <MainLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></MainLayout>;

  return (
    <MainLayout>
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">My Projects</h1>
          <Link to="/projects/create" className="btn-primary">
            <FiPlus size={15} /> New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <EmptyState icon="📁" title="No projects yet"
            description="Create your first project and start building your team!"
            action={<Link to="/projects/create" className="btn-primary">Create Project</Link>} />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div key={project._id} className="card-hover flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-100 line-clamp-1 text-sm">{project.title}</h3>
                  <span className={`ml-2 flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                    project.status === "open" ? "bg-primary-800/50 text-green-400 border border-green-800/40" :
                    project.status === "closed" ? "bg-red-900/50 text-red-400 border border-red-800/40" :
                    "bg-gray-800 text-gray-400"
                  }`}>{project.status}</span>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">{project.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {project.skillsRequired.slice(0, 3).map((s) => <SkillBadge key={s} skill={s} />)}
                  {project.skillsRequired.length > 3 && (
                    <span className="text-xs text-gray-600">+{project.skillsRequired.length - 3}</span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-dark-600">
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <FiUsers size={12} /> {project.teamMembers.length}/{project.maxMembers} members
                  </span>
                  <div className="flex gap-1">
                    <Link to={`/projects/${project._id}`}
                      className="p-2 text-gray-500 hover:text-green-400 hover:bg-dark-600 rounded-lg transition" title="View">
                      <FiEye size={15} />
                    </Link>
                    <Link to={`/projects/${project._id}/edit`}
                      className="p-2 text-gray-500 hover:text-green-400 hover:bg-dark-600 rounded-lg transition" title="Edit">
                      <FiEdit2 size={15} />
                    </Link>
                    <button onClick={() => setDeleteTarget(project)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-dark-600 rounded-lg transition" title="Delete">
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Project"
        message={`Delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText={deleting ? "Deleting..." : "Delete"}
      />
    </MainLayout>
  );
};

export default MyProjects;
