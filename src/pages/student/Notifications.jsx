import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import MainLayout from "../../components/layout/MainLayout";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import { FiTrash2, FiCheckCircle, FiAward, FiMail } from "react-icons/fi";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/notifications")
      .then(({ data }) => setNotifications(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      /* silent */
    }
  };

  const markAllRead = async () => {
    try {
      await API.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const deleteNotif = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const typeEmoji = {
    join_request_sent: "📨",
    join_request_accepted: "🎉",
    join_request_rejected: "❌",
    join_request_cancelled: "🚫",
    project_update: "📢",
    mentor_request_sent: "📨",
    mentor_request_accepted: "🎉",
    mentor_request_rejected: "❌",
    system: "🔔",
  };

  return (
    <MainLayout>
      <div className="max-w-3xl space-y-5 px-1 sm:px-0">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <h1 className="text-xl font-bold dark:text-white text-slate-900 flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <span className="badge text-xs bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300">
                {unreadCount} new
              </span>
            )}
          </h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 transition font-medium"
            >
              <FiCheckCircle size={13} /> Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon="🔔"
            title="No notifications"
            description="You're all caught up!"
          />
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const isAccepted =
                notif.type === "mentor_request_accepted" ||
                notif.type === "join_request_accepted";

              return (
                <div
                  key={notif._id}
                  onClick={() => !notif.isRead && markAsRead(notif._id)}
                  className={`card p-4 sm:p-5 cursor-pointer transition relative overflow-hidden ${
                    !notif.isRead
                      ? isAccepted
                        ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm"
                        : "border-primary-500/40 bg-primary-50/50 dark:bg-primary-950/20"
                      : "hover:border-primary-500/30"
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-3.5">
                    <span className="text-xl sm:text-2xl flex-shrink-0 mt-0.5 select-none">
                      {typeEmoji[notif.type] || "🔔"}
                    </span>

                    <div className="flex-1 min-w-0">
                      {notif.title && (
                        <h4
                          className={`text-xs sm:text-sm font-bold mb-1 truncate ${
                            isAccepted
                              ? "text-emerald-700 dark:text-emerald-300"
                              : "text-slate-900 dark:text-gray-100"
                          }`}
                        >
                          {notif.title}
                        </h4>
                      )}

                      <p
                        className={`text-xs sm:text-sm leading-relaxed ${
                          !notif.isRead
                            ? "font-medium text-slate-800 dark:text-gray-200"
                            : "text-slate-600 dark:text-gray-400"
                        }`}
                      >
                        {notif.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-xs">
                        {notif.project && (
                          <Link
                            to={`/projects/${notif.project._id}`}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium flex items-center gap-1 truncate max-w-[200px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Project: {notif.project.title} →
                          </Link>
                        )}

                        {notif.mentor && (
                          <Link
                            to={`/mentors/${notif.mentor._id}`}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-semibold flex items-center gap-1 truncate max-w-[220px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FiAward size={12} className="shrink-0" /> Mentor: {notif.mentor.name} →
                          </Link>
                        )}

                        <span className="text-[10px] sm:text-[11px] text-slate-400 dark:text-gray-500">
                          {new Date(notif.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                      {!notif.isRead && (
                        <span
                          className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
                            isAccepted ? "bg-emerald-500" : "bg-primary-600"
                          }`}
                        />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotif(notif._id);
                        }}
                        className="text-slate-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition p-1 rounded hover:bg-slate-100 dark:hover:bg-dark-700"
                        title="Delete notification"
                      >
                        <FiTrash2 size={13} className="sm:text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Notifications;
