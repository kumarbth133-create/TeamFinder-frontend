import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import SkillBadge from "../../components/common/SkillBadge";
import Avatar from "../../components/common/Avatar";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import { FiSearch, FiPlus, FiUsers, FiX, FiArrowRight } from "react-icons/fi";

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [activeSkills, setActiveSkills] = useState([]);

  const fetchProjects = async (params = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (params.search) query.append("search", params.search);
      if (params.status) query.append("status", params.status);
      if (params.skills?.length) query.append("skills", params.skills.join(","));
      const { data } = await API.get(`/projects?${query.toString()}`);
      setProjects(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchProjects({ search, status: statusFilter, skills: activeSkills }); };

  const addSkillFilter = () => {
    const skill = skillFilter.trim();
    if (skill && !activeSkills.includes(skill)) {
      const updated = [...activeSkills, skill];
      setActiveSkills(updated);
      fetchProjects({ search, status: statusFilter, skills: updated });
    }
    setSkillFilter("");
  };

  const removeSkillFilter = (skill) => {
    const updated = activeSkills.filter((s) => s !== skill);
    setActiveSkills(updated);
    fetchProjects({ search, status: statusFilter, skills: updated });
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    fetchProjects({ search, status: e.target.value, skills: activeSkills });
  };

  return (
    <MainLayout>
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Browse Projects</h1>
          <Link to="/projects/create" className="btn-primary">
            <FiPlus size={15} /> New Project
          </Link>
        </div>

        {/* Filters */}
        <div className="card space-y-3">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-40">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..." className="input-field pl-9" />
            </div>
            <select value={statusFilter} onChange={handleStatusChange}
              className="input-field w-auto bg-dark-700 text-gray-300">
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="completed">Completed</option>
            </select>
            <button type="submit" className="btn-primary">Search</button>
          </form>

          <div className="flex gap-2">
            <input type="text" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkillFilter())}
              placeholder="Filter by skill (e.g. React)" className="input-field max-w-xs text-sm" />
            <button type="button" onClick={addSkillFilter} className="btn-secondary">+ Skill</button>
          </div>

          {activeSkills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeSkills.map((s) => (
                <span key={s} className="flex items-center gap-1 badge">
                  {s}
                  <button onClick={() => removeSkillFilter(s)} className="hover:text-green-200 ml-0.5">
                    <FiX size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : projects.length === 0 ? (
          <EmptyState icon="📁" title="No projects found"
            description="Try different filters or create a new project"
            action={<Link to="/projects/create" className="btn-primary">Create Project</Link>} />
        ) : (
          <>
            <p className="text-xs text-gray-500">{projects.length} project{projects.length !== 1 ? "s" : ""} found</p>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div key={project._id} className="card-hover flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/projects/${project._id}`}
                      className="font-semibold text-gray-100 hover:text-green-400 transition line-clamp-1 text-sm">
                      {project.title}
                    </Link>
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
                    <div className="flex items-center gap-2">
                      <Avatar src={project.owner?.profilePicture} name={project.owner?.name} size="sm" />
                      <span className="text-xs text-gray-500 truncate max-w-20">{project.owner?.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <FiUsers size={11} /> {project.teamMembers.length}/{project.maxMembers}
                      </span>
                      {project.owner?._id !== user?._id && project.status === "open" && (
                        <Link to={`/projects/${project._id}`}
                          className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1 transition">
                          Join <FiArrowRight size={11} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Projects;
