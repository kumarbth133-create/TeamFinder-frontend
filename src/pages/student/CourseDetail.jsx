import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/axios";
import MainLayout from "../../components/layout/MainLayout";
import Spinner from "../../components/common/Spinner";
import { toast } from "react-hot-toast";
import {
  FiBookOpen, FiYoutube, FiClock, FiStar, FiArrowLeft,
  FiExternalLink, FiCheck, FiPlay, FiShare2, FiList,
  FiChevronLeft, FiChevronRight, FiCheckCircle, FiSearch,
  FiAward, FiCode, FiFileText, FiLayers, FiHelpCircle
} from "react-icons/fi";
import { DEFAULT_COURSES } from "../../data/coursesData";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [playlistSearch, setPlaylistSearch] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'cheatsheet' | 'curriculum'

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/courses/${id}`);
        if (data.data) {
          setCourse(data.data);
        } else {
          throw new Error("Course not found in API response");
        }
      } catch (err) {
        console.warn("API course detail fetch failed, checking default courses", err);
        const fallback = DEFAULT_COURSES.find(
          (c) => c._id === id || c.subject?.toLowerCase() === id?.toLowerCase() || c.title?.toLowerCase().includes(id?.toLowerCase())
        );
        if (fallback) {
          setCourse(fallback);
        } else {
          toast.error("Failed to load course details");
        }
      } finally {
        // Load persisted completed lessons from localStorage
        const savedProgress = localStorage.getItem(`course_progress_${id}`);
        if (savedProgress) {
          try {
            setCompletedLessons(JSON.parse(savedProgress));
          } catch (e) {
            console.error(e);
          }
        }
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const toggleLessonCompletion = (lessonIdx) => {
    setCompletedLessons((prev) => {
      let updated;
      if (prev.includes(lessonIdx)) {
        updated = prev.filter((i) => i !== lessonIdx);
        toast("Marked as incomplete", { icon: "↩️" });
      } else {
        updated = [...prev, lessonIdx];
        toast.success("Lesson marked as completed! 🎉");
      }
      localStorage.setItem(`course_progress_${id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Course link copied to clipboard!");
  };

  const getPlaylist = () => {
    if (!course) return [];
    if (course.playlist && course.playlist.length > 0) return course.playlist;
    return [
      {
        lessonNumber: 1,
        title: course.title,
        duration: course.duration || "Full Course",
        youtubeEmbedId: course.youtubeEmbedId,
        youtubeUrl: course.youtubeUrl,
        description: course.description,
      },
    ];
  };

  const playlist = getPlaylist();
  const currentLesson = playlist[activeLessonIndex] || playlist[0] || {};
  const progressPercent = playlist.length > 0
    ? Math.round((completedLessons.length / playlist.length) * 100)
    : 0;

  const filteredPlaylist = playlist.filter((item) =>
    item.title?.toLowerCase().includes(playlistSearch.toLowerCase()) ||
    item.description?.toLowerCase().includes(playlistSearch.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-red-400 transition"
          >
            <FiArrowLeft size={14} /> Back to All Courses
          </Link>

          {course && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 hidden sm:inline">Subject:</span>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-red-900/30 text-red-400 border border-red-800/40 uppercase">
                {course.subject}
              </span>
              {course.isPremium ? (
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500 text-black shadow">
                  👑 Premium ₹{course.price || 149}
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-primary-900/30 text-primary-400 border border-primary-800/40">
                  Free
                </span>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : !course ? (
          <div className="text-center py-16 card">
            <p className="text-gray-400 font-semibold">Course not found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Course Title & Meta Banner */}
            <div className="card p-5 bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border-dark-600 rounded-2xl shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap text-xs text-gray-400">
                    <span className="text-red-400 font-bold flex items-center gap-1">
                      <FiBookOpen size={13} /> {course.instructor}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <FiStar size={13} className="fill-amber-400" /> {course.rating?.toFixed(1) || "4.9"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FiClock size={13} /> {course.duration}
                    </span>
                    <span>•</span>
                    <span className="text-sky-400 font-semibold flex items-center gap-1">
                      <FiList size={13} /> {playlist.length} Lessons Playlist
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-gray-100 leading-tight">
                    {course.title}
                  </h1>
                </div>

                {/* Progress bar container */}
                <div className="shrink-0 bg-dark-950/80 p-3 rounded-xl border border-dark-700 w-full md:w-64 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-300 flex items-center gap-1">
                      <FiAward className="text-amber-400" size={13} /> Course Progress
                    </span>
                    <span className="font-bold text-red-400">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 text-right">
                    {completedLessons.length} of {playlist.length} completed
                  </p>
                </div>
              </div>
            </div>

            {/* Video Player & Playlist Layout (Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left 2 Columns: Video Player + Lesson Controls */}
              <div className="lg:col-span-2 space-y-4">
                {/* Responsive Embedded Video Container */}
                <div className="card p-2 bg-dark-900 border-dark-600 overflow-hidden shadow-2xl rounded-2xl">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
                    <iframe
                      src={`https://www.youtube.com/embed/${currentLesson.youtubeEmbedId || course.youtubeEmbedId}?autoplay=1`}
                      title={currentLesson.title || course.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>

                  {/* Player Bottom Control Bar */}
                  <div className="p-3 pt-4 flex flex-wrap items-center justify-between gap-3 bg-dark-900 border-t border-dark-700/60 mt-1">
                    <button
                      disabled={activeLessonIndex === 0}
                      onClick={() => setActiveLessonIndex((prev) => Math.max(0, prev - 1))}
                      className={`btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-semibold ${
                        activeLessonIndex === 0 ? "opacity-40 cursor-not-allowed" : ""
                      }`}
                    >
                      <FiChevronLeft size={14} /> Previous Lesson
                    </button>

                    {/* Mark Completed Button */}
                    <button
                      onClick={() => toggleLessonCompletion(activeLessonIndex)}
                      className={`text-xs py-1.5 px-3 rounded-lg font-bold border transition flex items-center gap-1.5 ${
                        completedLessons.includes(activeLessonIndex)
                          ? "bg-green-500/20 text-green-400 border-green-500/40 hover:bg-green-500/30"
                          : "bg-dark-800 text-gray-300 border-dark-600 hover:border-gray-500 hover:text-white"
                      }`}
                    >
                      <FiCheckCircle size={14} className={completedLessons.includes(activeLessonIndex) ? "text-green-400" : ""} />
                      {completedLessons.includes(activeLessonIndex) ? "Completed" : "Mark as Done"}
                    </button>

                    <button
                      disabled={activeLessonIndex >= playlist.length - 1}
                      onClick={() => setActiveLessonIndex((prev) => Math.min(playlist.length - 1, prev + 1))}
                      className={`btn-primary text-xs py-1.5 px-3 bg-[#ca0019] hover:bg-[#b00016] text-white flex items-center gap-1.5 font-semibold ${
                        activeLessonIndex >= playlist.length - 1 ? "opacity-40 cursor-not-allowed" : ""
                      }`}
                    >
                      Next Lesson <FiChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Active Lesson Header & Details */}
                <div className="card space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dark-700/60 pb-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                        Lesson {activeLessonIndex + 1} of {playlist.length}
                      </span>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-gray-100">
                        {currentLesson.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={copyLink}
                        className="btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1"
                        title="Share Course Link"
                      >
                        <FiShare2 size={13} /> Share
                      </button>

                      <a
                        href={currentLesson.youtubeUrl || course.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1 text-red-400 hover:text-red-300"
                        title="Open on YouTube"
                      >
                        <FiYoutube size={14} /> YouTube <FiExternalLink size={11} />
                      </a>
                    </div>
                  </div>

                  {currentLesson.description && (
                    <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                      {currentLesson.description}
                    </p>
                  )}
                </div>

                {/* Tabbed Info (Overview / Cheatsheet / Curriculum) */}
                <div className="card space-y-4">
                  <div className="flex border-b border-dark-700 gap-4 text-xs font-bold">
                    <button
                      onClick={() => setActiveTab("overview")}
                      className={`pb-2.5 transition flex items-center gap-1.5 border-b-2 ${
                        activeTab === "overview"
                          ? "border-red-500 text-red-400"
                          : "border-transparent text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      <FiBookOpen size={14} /> Course Overview
                    </button>

                    <button
                      onClick={() => setActiveTab("cheatsheet")}
                      className={`pb-2.5 transition flex items-center gap-1.5 border-b-2 ${
                        activeTab === "cheatsheet"
                          ? "border-red-500 text-red-400"
                          : "border-transparent text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      <FiCode size={14} /> {course.subject} Cheatsheet & Code
                    </button>

                    <button
                      onClick={() => setActiveTab("curriculum")}
                      className={`pb-2.5 transition flex items-center gap-1.5 border-b-2 ${
                        activeTab === "curriculum"
                          ? "border-red-500 text-red-400"
                          : "border-transparent text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      <FiLayers size={14} /> Topics & Objectives
                    </button>
                  </div>

                  {/* Tab 1: Overview */}
                  {activeTab === "overview" && (
                    <div className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-gray-300">
                      <p className="whitespace-pre-line">{course.description}</p>

                      {course.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {course.tags.map((t) => (
                            <span
                              key={t}
                              className="text-xs bg-transparent text-slate-600 dark:text-gray-300 px-2.5 py-1 rounded-md border border-slate-200 dark:border-dark-600 hover:border-red-500/60 hover:text-red-400 transition-colors"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 2: Cheatsheet / Code snippets */}
                  {activeTab === "cheatsheet" && (
                    <div className="space-y-3 text-xs">
                      {course.subject?.toUpperCase() === "SQL" ? (
                        <div className="space-y-2">
                          <p className="text-gray-300 font-semibold">Essential SQL Commands & Syntax Quick Reference:</p>
                          <div className="p-3 bg-dark-950 rounded-xl border border-dark-700 font-mono text-[11px] text-sky-300 space-y-2 overflow-x-auto">
                            <div>
                              <span className="text-amber-400">-- 1. Basic Filtering & Sorting</span><br />
                              SELECT id, name, salary FROM employees WHERE department = 'Engineering' AND salary &gt; 60000 ORDER BY salary DESC;
                            </div>
                            <div>
                              <span className="text-amber-400">-- 2. Aggregate & GROUP BY</span><br />
                              SELECT department, COUNT(*) AS total_staff, AVG(salary) AS avg_sal FROM employees GROUP BY department HAVING COUNT(*) &gt; 5;
                            </div>
                            <div>
                              <span className="text-amber-400">-- 3. INNER & LEFT JOIN</span><br />
                              SELECT e.name, d.dept_name, p.title FROM employees e INNER JOIN departments d ON e.dept_id = d.id LEFT JOIN projects p ON e.project_id = p.id;
                            </div>
                            <div>
                              <span className="text-amber-400">-- 4. CTE & Window Functions</span><br />
                              WITH RankedEmployees AS (<br />
                              &nbsp;&nbsp;SELECT name, department, salary, DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank_no FROM employees<br />
                              )<br />
                              SELECT * FROM RankedEmployees WHERE rank_no &lt;= 3;
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-dark-950 rounded-xl border border-dark-700 font-mono text-[11px] text-emerald-300 space-y-1 overflow-x-auto">
                          <p className="text-amber-400">-- Key Concept Summary for {course.subject}:</p>
                          <p>1. Understand core syntax, module structures, and lifecycle methods.</p>
                          <p>2. Practice writing clean, modular, and testable code.</p>
                          <p>3. Follow industry design patterns & error handling conventions.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 3: Curriculum / Objectives */}
                  {activeTab === "curriculum" && (
                    <div className="space-y-2">
                      <ul className="grid sm:grid-cols-2 gap-2 text-xs text-gray-300">
                        <li className="flex items-center gap-2 bg-dark-900/60 p-2.5 rounded-lg border border-dark-600">
                          <FiCheck className="text-red-400 shrink-0" size={14} /> Core syntax & fundamentals of {course.subject}
                        </li>
                        <li className="flex items-center gap-2 bg-dark-900/60 p-2.5 rounded-lg border border-dark-600">
                          <FiCheck className="text-red-400 shrink-0" size={14} /> Hands-on code examples & project building
                        </li>
                        <li className="flex items-center gap-2 bg-dark-900/60 p-2.5 rounded-lg border border-dark-600">
                          <FiCheck className="text-red-400 shrink-0" size={14} /> Industry best practices & production architecture
                        </li>
                        <li className="flex items-center gap-2 bg-dark-900/60 p-2.5 rounded-lg border border-dark-600">
                          <FiCheck className="text-red-400 shrink-0" size={14} /> Top technical interview questions & problem solving
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Interactive Playlist Sidebar */}
              <div className="lg:col-span-1 space-y-4 sticky top-6">
                <div className="card p-0 bg-dark-900 border-dark-600 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
                  {/* Playlist Header */}
                  <div className="p-4 border-b border-dark-700 bg-dark-850 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-100">
                        <FiList className="text-red-400" size={16} />
                        <span>Course Playlist</span>
                      </div>
                      <span className="text-[10px] bg-red-950/60 text-red-400 px-2 py-0.5 rounded border border-red-800/40 font-bold">
                        {playlist.length} Videos
                      </span>
                    </div>

                    {/* Filter Search inside playlist */}
                    <div className="relative">
                      <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" size={13} />
                      <input
                        type="text"
                        value={playlistSearch}
                        onChange={(e) => setPlaylistSearch(e.target.value)}
                        placeholder="Search video playlist topics..."
                        className="input-field text-xs pl-8 py-1.5 bg-dark-950 border-dark-700 focus:border-red-500"
                      />
                    </div>
                  </div>

                  {/* Playlist Item List */}
                  <div className="overflow-y-auto p-2 space-y-1.5 flex-1 scrollbar-thin">
                    {filteredPlaylist.length === 0 ? (
                      <p className="text-center py-6 text-xs text-gray-500">No lessons match search</p>
                    ) : (
                      filteredPlaylist.map((item, idx) => {
                        // find actual original index in full playlist
                        const originalIdx = playlist.findIndex((p) => p.youtubeEmbedId === item.youtubeEmbedId && p.title === item.title);
                        const isCurrent = originalIdx === activeLessonIndex;
                        const isDone = completedLessons.includes(originalIdx);

                        return (
                          <div
                            key={idx}
                            className={`group rounded-xl border p-2.5 transition flex items-start gap-2.5 cursor-pointer ${
                              isCurrent
                                ? "bg-red-950/50 border-red-500/80 text-white shadow-md shadow-red-950/40"
                                : "bg-dark-800/60 border-dark-700/80 text-gray-300 hover:bg-dark-800 hover:border-dark-600"
                            }`}
                            onClick={() => setActiveLessonIndex(originalIdx)}
                          >
                            {/* Play / Number / Done Icon */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLessonCompletion(originalIdx);
                              }}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 transition ${
                                isDone
                                  ? "bg-green-600 text-white hover:bg-green-500"
                                  : isCurrent
                                  ? "bg-red-600 text-white"
                                  : "bg-dark-700 text-gray-400 group-hover:bg-dark-600"
                              }`}
                              title={isDone ? "Completed! Click to unmark" : "Click to mark done"}
                            >
                              {isDone ? <FiCheck size={12} /> : isCurrent ? <FiPlay size={10} className="fill-white" /> : originalIdx + 1}
                            </button>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                              <p className={`text-xs font-semibold leading-snug line-clamp-2 ${isCurrent ? "text-red-300" : "text-gray-200"}`}>
                                {item.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                                <span className="flex items-center gap-1">
                                  <FiClock size={10} /> {item.duration || "20 Min"}
                                </span>
                                {isCurrent && (
                                  <span className="text-red-400 font-bold flex items-center gap-1">
                                    • Playing
                                  </span>
                                )}
                                {isDone && (
                                  <span className="text-green-400 font-semibold flex items-center gap-1">
                                    • Done
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Playlist Footer Stats */}
                  <div className="p-3 bg-dark-850 border-t border-dark-700 text-[11px] text-gray-400 flex items-center justify-between">
                    <span>{playlist.length} Lessons Available</span>
                    <span className="font-semibold text-green-400">
                      {completedLessons.length} Completed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CourseDetail;
