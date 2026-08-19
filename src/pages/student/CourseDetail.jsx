import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/axios";
import MainLayout from "../../components/layout/MainLayout";
import Spinner from "../../components/common/Spinner";
import { toast } from "react-hot-toast";
import {
  FiBookOpen, FiYoutube, FiClock, FiStar, FiArrowLeft,
  FiExternalLink, FiCheck, FiPlay, FiShare2
} from "react-icons/fi";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/courses/${id}`);
        setCourse(data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Course link copied to clipboard!");
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-red-400 transition"
        >
          <FiArrowLeft size={14} /> Back to Courses
        </Link>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : !course ? (
          <div className="text-center py-16 card">
            <p className="text-gray-400 font-semibold">Course not found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Embedded YouTube Video Container */}
            <div className="card p-2 bg-dark-900 border-dark-600 overflow-hidden shadow-2xl rounded-xl">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${course.youtubeEmbedId}`}
                  title={course.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </div>

            {/* Course Information Header */}
            <div className="card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-red-900/30 text-red-400 border border-red-800/40 uppercase">
                    {course.subject}
                  </span>
                  {course.isPremium ? (
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500 text-black shadow">
                      👑 Premium ₹{course.price || 149}
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-dark-900 text-gray-300 border border-dark-600">
                      {course.level} Level
                    </span>
                  )}
                </div>


                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <FiStar size={14} className="fill-amber-400" /> {course.rating?.toFixed(1) || "4.8"}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400 flex items-center gap-1">
                    <FiClock size={13} /> {course.duration}
                  </span>
                </div>
              </div>

              <h1 className="text-xl font-bold text-slate-900 dark:text-gray-100">{course.title}</h1>
              <p className="text-xs text-[#ca0019] dark:text-rose-400 font-bold">Instructor: {course.instructor}</p>

              <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed whitespace-pre-line pt-2">
                {course.description}
              </p>

              {course.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {course.tags.map((t) => (
                    <span key={t} className="text-xs bg-transparent text-slate-600 dark:text-gray-300 px-2.5 py-1 rounded-md border border-slate-200 dark:border-dark-600 hover:border-[#ca0019]/60 hover:text-[#ca0019] transition-colors">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-dark-600">
                <button
                  onClick={copyLink}
                  className="btn-secondary text-xs flex items-center gap-1.5"
                >
                  <FiShare2 size={14} /> Share Course
                </button>

                <a
                  href={course.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs bg-[#ca0019] hover:bg-[#b00016] text-white flex items-center gap-1.5 shadow-sm"
                >
                  <FiYoutube size={16} /> Open Directly on YouTube <FiExternalLink size={13} />
                </a>
              </div>
            </div>

            {/* What you will learn */}
            <div className="card space-y-3">
              <h3 className="font-bold text-gray-100 text-sm flex items-center gap-2">
                <FiBookOpen className="text-red-400" size={16} /> Topics Covered in this {course.subject} Tutorial
              </h3>
              <ul className="grid sm:grid-cols-2 gap-2 text-xs text-gray-300">
                <li className="flex items-center gap-2 bg-dark-900/60 p-2 rounded-lg border border-dark-600">
                  <FiCheck className="text-red-400" size={14} /> Core syntax & fundamentals of {course.subject}
                </li>
                <li className="flex items-center gap-2 bg-dark-900/60 p-2 rounded-lg border border-dark-600">
                  <FiCheck className="text-red-400" size={14} /> Hands-on code examples & projects
                </li>
                <li className="flex items-center gap-2 bg-dark-900/60 p-2 rounded-lg border border-dark-600">
                  <FiCheck className="text-red-400" size={14} /> Industry best practices & clean code rules
                </li>
                <li className="flex items-center gap-2 bg-dark-900/60 p-2 rounded-lg border border-dark-600">
                  <FiCheck className="text-red-400" size={14} /> Debugging & common interview questions
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CourseDetail;
