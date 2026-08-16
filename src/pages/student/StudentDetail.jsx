import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/axios";
import MainLayout from "../../components/layout/MainLayout";
import Avatar from "../../components/common/Avatar";
import SkillBadge from "../../components/common/SkillBadge";
import Spinner from "../../components/common/Spinner";
import { FiGithub, FiLinkedin, FiArrowLeft } from "react-icons/fi";

const StudentDetail = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get(`/users/${id}`);
        setStudent(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <MainLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></MainLayout>;
  if (!student) return <MainLayout><div className="text-center py-20 text-gray-500">Student not found.</div></MainLayout>;

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Link to="/students" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600">
          <FiArrowLeft /> Back to Students
        </Link>

        <div className="card">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar src={student.profilePicture} name={student.name} size="xl" />
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
              <p className="text-gray-500 text-sm">{student.email}</p>
              {student.college && <p className="text-gray-600 text-sm mt-1">📍 {student.college}</p>}
              <div className="flex gap-3 mt-3 justify-center sm:justify-start">
                {student.githubLink && (
                  <a href={student.githubLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600">
                    <FiGithub /> GitHub
                  </a>
                )}
                {student.linkedinLink && (
                  <a href={student.linkedinLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600">
                    <FiLinkedin /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

          {student.bio && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">About</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{student.bio}</p>
            </div>
          )}

          {student.skills?.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {student.skills.map((s) => <SkillBadge key={s} skill={s} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentDetail;
