import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import MainLayout from "../../components/layout/MainLayout";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import { toast } from "react-hot-toast";
import {
  FiSearch, FiBookOpen, FiPlay, FiYoutube, FiClock,
  FiStar, FiExternalLink, FiX, FiLayers, FiLock, FiCheckCircle, FiShield, FiCheck, FiSmartphone, FiCreditCard
} from "react-icons/fi";

const SUBJECT_CATEGORIES = [
  "All",
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Node.js",
  "Spring Boot",
  "Golang",
  "Python",
  "DSA",
  "MongoDB",
  "Git",
];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeSubject, setActiveSubject] = useState("All");
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [premiumModal, setPremiumModal] = useState(null);
  const [unlockedCourses, setUnlockedCourses] = useState([]);
  const [unlocking, setUnlocking] = useState(false);

  // Payment states
  const [payMethod, setPayMethod] = useState("upi"); // 'upi' or 'mobile'
  const [upiId, setUpiId] = useState("8092726161@paytm");
  const [phoneNumber, setPhoneNumber] = useState("8092726161");

  const fetchCourses = async (params = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (params.search) query.append("search", params.search);
      if (params.subject && params.subject !== "All") query.append("subject", params.subject);
      const { data } = await API.get(`/courses?${query.toString()}`);
      setCourses(data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses({ subject: activeSubject, search });
  }, [activeSubject]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses({ search, subject: activeSubject });
  };

  const handleCourseClick = (course) => {
    if (course.isPremium && !unlockedCourses.includes(course._id)) {
      setPremiumModal(course);
      setUpiId("8092726161@paytm");
      setPhoneNumber("8092726161");
    } else {
      setActiveVideoModal(course);
    }
  };


  const unlockPremiumCourse = (course) => {
    if (payMethod === "upi" && !upiId.trim()) {
      return toast.error("Please enter a valid UPI ID (e.g. user@gpay or 9876543210@paytm)");
    }
    if (payMethod === "mobile" && (!phoneNumber.trim() || phoneNumber.length < 10)) {
      return toast.error("Please enter a valid 10-digit mobile number");
    }

    setUnlocking(true);
    setTimeout(() => {
      setUnlockedCourses((prev) => [...prev, course._id]);
      setUnlocking(false);
      setPremiumModal(null);
      setActiveVideoModal(course);
      const methodLabel = payMethod === "upi" ? `UPI (${upiId})` : `Mobile Pay (${phoneNumber})`;
      toast.success(`🎉 Payment of ₹${course.price || 149} Successful via ${methodLabel}! Course Unlocked.`);
    }, 800);
  };

  const getSubjectColor = (subject) => {
    switch (subject?.toUpperCase()) {
      case "HTML": return "bg-orange-500/10 text-orange-400 border-orange-500/30";
      case "CSS": return "bg-primary-500/10 text-primary-400 border-blue-500/30";
      case "JAVASCRIPT": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "REACT": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "NODE.JS": return "bg-green-500/10 text-green-400 border-green-500/30";
      case "SPRING BOOT": return "bg-primary-500/20 text-primary-400 border-primary-500/40 font-bold";
      case "GOLANG": return "bg-sky-500/20 text-sky-400 border-sky-500/40 font-bold";
      case "PYTHON": return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "DSA": return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "MONGODB": return "bg-primary-500/10 text-primary-400 border-primary-500/30";
      case "GIT": return "bg-red-500/10 text-red-400 border-red-500/30";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Banner Header (Vibrant Crimson Gradient Banner matching Dashboard) */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#990012] via-[#ca0019] to-[#e6001c] text-white py-4 px-5 sm:py-5 sm:px-6 shadow-lg shadow-[#ca0019]/25 border border-white/20 hover:shadow-xl hover:shadow-[#ca0019]/30 transition-all duration-300">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex items-center gap-4 z-10">
            <div className="p-3 rounded-2xl bg-white/15 text-white border border-white/30 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-sm">
              <FiBookOpen size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-white/90">
                  Technical Learning Hub & Courses
                </span>
                <span className="text-[10px] bg-white/20 text-white px-2.5 py-0.5 rounded-full font-bold border border-white/30">
                  Courses
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Learn Technical Subjects & Master Stacks
              </h1>
            </div>
          </div>
        </div>

        {/* Search & Subject Tabs */}
        <div className="card space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses (e.g. Spring Boot, Golang, Microservices, React, DSA)..."
                className="input-field pl-9"
              />
            </div>
            <button type="submit" className="btn-primary bg-red-600 hover:bg-red-500">
              Search
            </button>
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  fetchCourses({ subject: activeSubject, search: "" });
                }}
                className="btn-secondary"
              >
                Clear
              </button>
            )}
          </form>

          {/* Subject Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 flex-shrink-0 mr-1">
              <FiLayers size={14} /> Subject:
            </span>
            {SUBJECT_CATEGORIES.map((subj) => {
              const isPremSubject = subj === "Spring Boot" || subj === "Golang";
              return (
                <button
                  key={subj}
                  onClick={() => setActiveSubject(subj)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex-shrink-0 border flex items-center gap-1 ${
                    activeSubject === subj
                      ? "bg-[#ca0019] text-white border-[#ca0019] shadow-md shadow-[#ca0019]/30"
                      : isPremSubject
                      ? "bg-transparent text-amber-600 dark:text-amber-400 border-amber-500/50 hover:border-amber-500 hover:bg-amber-500/10 hover:shadow-md hover:shadow-amber-500/25"
                      : "bg-transparent text-slate-800 dark:text-slate-200 border-[#ca0019]/40 hover:border-[#ca0019] hover:bg-[#ca0019]/10 hover:text-[#ca0019] hover:shadow-md hover:shadow-[#ca0019]/25"
                  }`}
                >
                  {isPremSubject && <span>👑</span>}
                  <span>{subj}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Courses Cards Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            icon="📚"
            title="No Courses Found"
            description="Try selecting a different subject category or clearing your search filter."
          />
        ) : (
          <>
            <p className="text-xs text-gray-500">
              Showing {courses.length} course{courses.length !== 1 ? "s" : ""} for <span className="text-red-400 font-semibold">{activeSubject}</span>
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course) => {
                const isUnlocked = unlockedCourses.includes(course._id);
                const showPremium = course.isPremium && !isUnlocked;

                return (
                  <div
                    key={course._id}
                    className={`card-hover flex flex-col justify-between overflow-hidden group border-dark-600 ${
                      course.isPremium ? "hover:border-amber-500/60" : "hover:border-red-900/60"
                    }`}
                  >
                    {/* Thumbnail Container */}
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-dark-900 group">
                      <img
                        src={course.thumbnail || `https://img.youtube.com/vi/${course.youtubeEmbedId}/hqdefault.jpg`}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                        <button
                          onClick={() => handleCourseClick(course)}
                          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition ${
                            showPremium ? "bg-amber-500 text-black font-bold" : "bg-red-600 text-white"
                          }`}
                          title={showPremium ? "Unlock Premium Course" : "Play Video Tutorial"}
                        >
                          {showPremium ? <FiLock size={20} /> : <FiPlay size={20} className="ml-1" />}
                        </button>
                      </div>

                      {/* Premium / Free Tag */}
                      {course.isPremium ? (
                        <span className="absolute top-2 right-2 bg-amber-500 text-black px-2 py-0.5 rounded text-[11px] font-bold shadow flex items-center gap-1">
                          👑 Premium ₹{course.price || 149}
                        </span>
                      ) : (
                        <span className="absolute top-2 right-2 bg-primary-600/90 text-white px-2 py-0.5 rounded text-[10px] font-semibold backdrop-blur-sm">
                          Free
                        </span>
                      )}

                      <span className="absolute bottom-2 right-2 bg-black/80 text-gray-200 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
                        <FiClock size={11} /> {course.duration}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="font-medium text-red-400">{course.instructor}</span>
                        <span className="flex items-center gap-1 text-amber-400 font-semibold">
                          <FiStar size={12} className="fill-amber-400" /> {course.rating?.toFixed(1) || "4.9"}
                        </span>
                      </div>

                      <Link
                        to={`/courses/${course._id}`}
                        className="font-bold text-slate-900 dark:text-gray-100 group-hover:text-[#ca0019] transition text-sm line-clamp-2 block"
                      >
                        {course.title}
                      </Link>

                      <p className="text-xs text-slate-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                      {course.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {course.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] bg-transparent text-slate-600 dark:text-gray-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-dark-600 hover:border-[#ca0019]/60 hover:text-[#ca0019] transition-colors">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-200 dark:border-dark-600">
                      {showPremium ? (
                        <button
                          onClick={() => handleCourseClick(course)}
                          className="btn-primary text-xs py-1.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold flex items-center gap-1.5"
                        >
                          <FiLock size={13} /> Unlock Premium (₹{course.price || 149})
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCourseClick(course)}
                          className="btn-primary text-xs py-1.5 px-3 bg-[#ca0019] hover:bg-[#b00016] text-white flex items-center gap-1.5 shadow-sm"
                        >
                          <FiPlay size={13} /> Watch Video
                        </button>
                      )}

                      <a
                        href={course.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-500 dark:text-gray-400 hover:text-[#ca0019] flex items-center gap-1 transition"
                      >
                        YouTube <FiExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Premium Unlock & Payment Modal */}
        {premiumModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-dark-800 border border-amber-500/40 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
              <button
                onClick={() => setPremiumModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <FiX size={18} />
              </button>

              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-full flex items-center justify-center mx-auto text-xl">
                  👑
                </div>
                <h3 className="font-bold text-gray-100 text-base">Premium Masterclass Unlock</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  {premiumModal.title} ({premiumModal.subject})
                </p>
              </div>

              {/* Price Tag */}
              <div className="bg-gradient-to-r from-amber-950/50 to-dark-900 p-3 rounded-xl border border-amber-600/30 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium text-amber-400 uppercase tracking-wider">Course Price</p>
                  <p className="text-2xl font-extrabold text-white">₹{premiumModal.price || 149}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    Lifetime Access
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-300">Select Payment Method:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayMethod("upi")}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition ${
                      payMethod === "upi"
                        ? "bg-amber-500/20 text-amber-400 border-amber-500"
                        : "bg-dark-900 text-gray-400 border-dark-600 hover:border-gray-500"
                    }`}
                  >
                    <FiCreditCard size={15} /> Pay via UPI ID
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayMethod("mobile")}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition ${
                      payMethod === "mobile"
                        ? "bg-amber-500/20 text-amber-400 border-amber-500"
                        : "bg-dark-900 text-gray-400 border-dark-600 hover:border-gray-500"
                    }`}
                  >
                    <FiSmartphone size={15} /> Mobile Number Pay
                  </button>
                </div>
              </div>

              {/* Input for UPI or Mobile */}
              {payMethod === "upi" ? (
                <div className="space-y-1">
                  <label className="block text-[11px] text-gray-400">Enter UPI ID (Google Pay, PhonePe, Paytm, BHIM):</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. username@gpay, 9876543210@paytm"
                    className="input-field text-xs"
                  />
                  <p className="text-[10px] text-gray-500">Supports GPay, PhonePe, Paytm, BHIM, Amazon Pay UPI</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="block text-[11px] text-gray-400">Enter Mobile Number (Paytm/PhonePe/GPay Linked):</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                    className="input-field text-xs"
                  />
                  <p className="text-[10px] text-gray-500">Payment request will be sent to your mobile app</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPremiumModal(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => unlockPremiumCourse(premiumModal)}
                  disabled={unlocking}
                  className="btn-primary text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold flex items-center gap-1.5"
                >
                  {unlocking ? <Spinner size="sm" /> : <FiShield size={14} />} Pay ₹{premiumModal.price || 149} & Unlock
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video Player Modal */}
        {activeVideoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-dark-800 border border-dark-600 rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl relative">
              <div className="flex items-center justify-between px-5 py-3 border-b border-dark-600 bg-dark-900">
                <div className="flex items-center gap-2">
                  <FiYoutube className="text-red-500" size={20} />
                  <h3 className="font-bold text-gray-100 text-sm truncate max-w-md">
                    {activeVideoModal.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Responsive Video Embed */}
              <div className="relative aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideoModal.youtubeEmbedId}?autoplay=1`}
                  title={activeVideoModal.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              <div className="p-4 flex items-center justify-between bg-dark-800 text-xs">
                <div>
                  <span className="text-gray-400">Subject: </span>
                  <span className="font-bold text-white mr-3">{activeVideoModal.subject}</span>
                  <span className="text-gray-400">Instructor: </span>
                  <span className="font-medium text-red-400">{activeVideoModal.instructor}</span>
                </div>
                <a
                  href={activeVideoModal.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs flex items-center gap-1.5"
                >
                  Open on YouTube <FiExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Courses;
