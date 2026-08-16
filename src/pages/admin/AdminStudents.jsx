import { useState, useEffect } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout/AdminLayout";
import Avatar from "../../components/common/Avatar";
import Spinner from "../../components/common/Spinner";
import ConfirmModal from "../../components/common/ConfirmModal";
import { FiSearch, FiTrash2, FiToggleLeft, FiToggleRight } from "react-icons/fi";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStudents = async (q = "") => {
    setLoading(true);
    try {
      const { data } = await API.get(`/admin/students${q ? `?search=${q}` : ""}`);
      setStudents(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleToggle = async (id) => {
    try {
      const { data } = await API.put(`/admin/students/${id}/toggle`);
      setStudents((prev) => prev.map((s) => s._id === id ? { ...s, isActive: data.data.isActive } : s));
      toast.success(`Student ${data.data.isActive ? "activated" : "deactivated"}`);
    } catch { toast.error("Failed"); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await API.delete(`/admin/students/${deleteTarget._id}`);
      setStudents((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      toast.success("Student deleted");
    } catch { toast.error("Delete failed"); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <h1 className="text-xl font-bold text-white">Manage Students</h1>

        <form onSubmit={(e) => { e.preventDefault(); fetchStudents(search); }} className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students..." className="input-field pl-9" />
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </form>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <div className="px-5 py-3 border-b border-dark-600 flex items-center justify-between">
              <p className="text-xs text-gray-500">{students.length} students</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header text-left">Student</th>
                    <th className="table-header text-left">Email</th>
                    <th className="table-header text-left">College</th>
                    <th className="table-header text-left">Status</th>
                    <th className="table-header text-left">Joined</th>
                    <th className="table-header text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <Avatar src={student.profilePicture} name={student.name} size="sm" />
                          <span className="font-medium text-gray-200">{student.name}</span>
                        </div>
                      </td>
                      <td className="table-cell text-gray-400">{student.email}</td>
                      <td className="table-cell text-gray-500">{student.college || "—"}</td>
                      <td className="table-cell">
                        <span className={student.isActive ? "badge-green" : "badge-red"}>
                          {student.isActive ? "Active" : "Banned"}
                        </span>
                      </td>
                      <td className="table-cell text-gray-600 text-xs">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                      <td className="table-cell text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleToggle(student._id)}
                            className={`text-xl transition ${student.isActive ? "text-green-500 hover:text-red-400" : "text-gray-600 hover:text-green-400"}`}
                            title={student.isActive ? "Ban" : "Activate"}>
                            {student.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                          </button>
                          <button onClick={() => setDeleteTarget(student)}
                            className="text-gray-600 hover:text-red-400 transition p-1" title="Delete">
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {students.length === 0 && (
                <div className="text-center py-12 text-gray-600 text-sm">No students found</div>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Student"
        message={`Permanently delete "${deleteTarget?.name}"? This will also delete their projects and requests.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText={deleting ? "Deleting..." : "Delete Permanently"}
      />
    </AdminLayout>
  );
};

export default AdminStudents;
