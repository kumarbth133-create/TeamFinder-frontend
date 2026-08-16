import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import MainLayout from "../../components/layout/MainLayout";
import SkillBadge from "../../components/common/SkillBadge";
import Spinner from "../../components/common/Spinner";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [formData, setFormData] = useState({
    title: "", description: "", skillsRequired: [],
    maxMembers: 5, githubRepo: "", status: "open", tags: "",
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get(`/projects/${id}`);
        const p = data.data;
        setFormData({
          title: p.title, description: p.description,
          skillsRequired: p.skillsRequired, maxMembers: p.maxMembers,
          githubRepo: p.githubRepo || "", status: p.status,
          tags: p.tags?.join(", ") || "",
        });
      } catch (err) {
        toast.error("Failed to load project");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.skillsRequired.includes(skill)) {
      setFormData({ ...formData, skillsRequired: [...formData.skillsRequired, skill] });
    }
    setSkillInput("");
  };

  const removeSkill = (skill) =>
    setFormData({ ...formData, skillsRequired: formData.skillsRequired.filter((s) => s !== skill) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      return toast.error("Title and description are required");
    }
    if (formData.skillsRequired.length === 0) return toast.error("Add at least one skill");
    setSaving(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };
      await API.put(`/projects/${id}`, payload);
      toast.success("Project updated!");
      navigate(`/projects/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <MainLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></MainLayout>;

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Project</h1>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange}
                rows={4} maxLength={1000} className="input-field resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills Required *</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  className="input-field" placeholder="Add skill..." />
                <button type="button" onClick={addSkill} className="btn-primary px-3">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skillsRequired.map((s) => <SkillBadge key={s} skill={s} onRemove={removeSkill} />)}
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Members</label>
                <input type="number" name="maxMembers" value={formData.maxMembers} onChange={handleChange} min={2} max={20} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="input-field">
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Repo</label>
                <input type="url" name="githubRepo" value={formData.githubRepo} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="input-field" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary">{saving ? <Spinner size="sm" /> : "Save Changes"}</button>
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditProject;
