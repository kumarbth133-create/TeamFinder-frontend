import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import MainLayout from "../../components/layout/MainLayout";
import Avatar from "../../components/common/Avatar";
import SkillBadge from "../../components/common/SkillBadge";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import { FiSearch, FiGithub, FiLinkedin, FiX, FiArrowRight } from "react-icons/fi";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [activeSkills, setActiveSkills] = useState([]);

  const fetchStudents = async (params = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (params.search) query.append("search", params.search);
      if (params.skills?.length) query.append("skills", params.skills.join(","));
      const { data } = await API.get(`/users?${query.toString()}`);
      setStudents(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchStudents({ search, skills: activeSkills }); };

  const addSkillFilter = () => {
    const skill = skillFilter.trim();
    if (skill && !activeSkills.includes(skill)) {
      const updated = [...activeSkills, skill];
      setActiveSkills(updated);
      fetchStudents({ search, skills: updated });
    }
    setSkillFilter("");
  };

  const removeSkillFilter = (skill) => {
    const updated = activeSkills.filter((s) => s !== skill);
    setActiveSkills(updated);
    fetchStudents({ search, skills: updated });
  };

  return (
    <MainLayout>
      <div className="space-y-5">
        <h1 className="text-xl font-bold text-white">Find Students</h1>

        <div className="card space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or college..." className="input-field pl-9" />
            </div>
            <button type="submit" className="btn-primary">Search</button>
            {(search || activeSkills.length > 0) && (
              <button type="button" onClick={() => { setSearch(""); setActiveSkills([]); fetchStudents(); }}
                className="btn-secondary">Clear</button>
            )}
          </form>

          <div className="flex gap-2">
            <input type="text" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkillFilter())}
              placeholder="Filter by skill (e.g. React)" className="input-field max-w-xs text-sm" />
            <button type="button" onClick={addSkillFilter} className="btn-secondary">+ Filter</button>
          </div>

          {activeSkills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeSkills.map((s) => (
                <span key={s} className="flex items-center gap-1 badge">
                  {s}
                  <button onClick={() => removeSkillFilter(s)}><FiX size={11} /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : students.length === 0 ? (
          <EmptyState icon="👥" title="No students found" description="Try different search terms or filters" />
        ) : (
          <>
            <p className="text-xs text-gray-500">{students.length} student{students.length !== 1 ? "s" : ""} found</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => (
                <div key={student._id} className="card-hover">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar src={student.profilePicture} name={student.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <Link to={`/students/${student._id}`}
                        className="font-semibold text-gray-100 hover:text-green-400 transition block truncate text-sm">
                        {student.name}
                      </Link>
                      {student.college && <p className="text-xs text-gray-500 truncate">📍 {student.college}</p>}
                    </div>
                  </div>

                  {student.bio && <p className="text-xs text-gray-500 line-clamp-2 mb-3">{student.bio}</p>}

                  {student.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {student.skills.slice(0, 4).map((s) => <SkillBadge key={s} skill={s} />)}
                      {student.skills.length > 4 && (
                        <span className="text-xs text-gray-600">+{student.skills.length - 4}</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-dark-600">
                    <div className="flex gap-3">
                      {student.githubLink && (
                        <a href={student.githubLink} target="_blank" rel="noopener noreferrer"
                          className="text-gray-500 hover:text-green-400 transition">
                          <FiGithub size={15} />
                        </a>
                      )}
                      {student.linkedinLink && (
                        <a href={student.linkedinLink} target="_blank" rel="noopener noreferrer"
                          className="text-gray-500 hover:text-green-400 transition">
                          <FiLinkedin size={15} />
                        </a>
                      )}
                    </div>
                    <Link to={`/students/${student._id}`}
                      className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1 transition">
                      View Profile <FiArrowRight size={11} />
                    </Link>
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

export default Students;
