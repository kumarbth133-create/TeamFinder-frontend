import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import MainLayout from "../../components/layout/MainLayout";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import { FiTrash2, FiCheckCircle } from "react-icons/fi";

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
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
    } catch { /* silent */ }
  };

  const markAllRead = async () => {
    try {
      await API.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All marked as read");
    } catch { toast.error("Failed"); }
  };

  const deleteNotif = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch { toast.error("Failed"); }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const typeEmoji = {
    join_request_sent: "📨",
    join_request_accepted: "🎉",
    join_request_rejected: "❌",
    join_request_cancelled: "🚫",
    project_update: "📢",
  };

  return (
    <MainLayout>
      <div className="max-w-2xl space-y-5">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <span className="badge text-xs">{unreadCount} new</span>
            )}
          </h1>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1 transition">
              <FiCheckCircle size={13} /> Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : notifications.length === 0 ? (
          <EmptyState icon="🔔" title="No notifications" description="You're all caught up!" />
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                onClick={() => !notif.isRead && markAsRead(notif._id)}
                className={`card cursor-pointer hover:border-green-700/40 transition ${
                  !notif.isRead ? "border-green-700/40 bg-green-900/10" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0 mt-0.5">{typeEmoji[notif.type] || "🔔"}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notif.isRead ? "font-medium text-gray-100" : "text-gray-400"}`}>
                      {notif.message}
                    </p>
                    {notif.project && (
                      <Link to={`/projects/${notif.project._id}`}
                        className="text-xs text-green-400 hover:underline mt-1 block"
                        onClick={(e) => e.stopPropagation()}>
                        {notif.project.title} →
                      </Link>
                    )}
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notif.isRead && <span className="w-2 h-2 bg-green-500 rounded-full" />}
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNotif(notif._id); }}
                      className="text-gray-600 hover:text-red-400 transition p-1">
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Notifications;
