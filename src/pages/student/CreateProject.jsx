import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import MainLayout from "../../components/layout/MainLayout";
import SkillBadge from "../../components/common/SkillBadge";
import Spinner from "../../components/common/Spinner";

const CreateProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [formData, setFormData] = useState({
    title: "", description: "", skillsRequired: [],
    maxMembers: 5, githubRepo: "", tags: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Title is required";
    if (!formData.description.trim()) errs.description = "Description is required";
    if (formData.skillsRequired.length === 0) errs.skills = "Add at least one required skill";
    if (formData.maxMembers < 2 || formData.maxMembers > 20) errs.maxMembers = "Must be between 2-20";
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill) return;
    if (formData.skillsRequired.includes(skill)) return toast.error("Skill already added");
    setFormData({ ...formData, skillsRequired: [...formData.skillsRequired, skill] });
    setErrors({ ...errors, skills: "" });
    setSkillInput("");
  };

  const removeSkill = (skill) =>
    setFormData({ ...formData, skillsRequired: formData.skillsRequired.filter((s) => s !== skill) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);
    setLoading(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };
      const { data } = await API.post("/projects", payload);
      toast.success("Project created!");
      navigate(`/projects/${data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { setLoading(false); }
  };

  const labelClass = "block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider";
  const errClass = "text-red-400 text-xs mt-1";

  return (
    <MainLayout>
      <div className="max-w-2xl">
        <h1 className="text-xl font-bold text-white mb-5">Create New Project</h1>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className={labelClass}>Project Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange}
                placeholder="e.g. AI Study Planner" maxLength={100}
                className={`input-field ${errors.title ? "border-red-600" : ""}`} />
              {errors.title && <p className={errClass}>{errors.title}</p>}
            </div>

            <div>
              <label className={labelClass}>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange}
                rows={4} maxLength={1000} placeholder="Describe your project goals..."
                className={`input-field resize-none ${errors.description ? "border-red-600" : ""}`} />
              <p className="text-xs text-gray-600 mt-1 text-right">{formData.description.length}/1000</p>
              {errors.description && <p className={errClass}>{errors.description}</p>}
            </div>

            <div>
              <label className={labelClass}>Skills Required *</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  placeholder="e.g. React, Node.js" className="input-field" />
                <button type="button" onClick={addSkill} className="btn-secondary px-3 whitespace-nowrap">Add</button>
              </div>
              {errors.skills && <p className={errClass}>{errors.skills}</p>}
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skillsRequired.map((s) => <SkillBadge key={s} skill={s} onRemove={removeSkill} />)}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Max Team Size *</label>
                <input type="number" name="maxMembers" value={formData.maxMembers} onChange={handleChange}
                  min={2} max={20} className={`input-field ${errors.maxMembers ? "border-red-600" : ""}`} />
                {errors.maxMembers && <p className={errClass}>{errors.maxMembers}</p>}
              </div>
              <div>
                <label className={labelClass}>GitHub Repo <span className="text-gray-600 normal-case">(optional)</span></label>
                <input type="url" name="githubRepo" value={formData.githubRepo} onChange={handleChange}
                  placeholder="https://github.com/..." className="input-field" />
              </div>
            </div>

            <div>
              <label className={labelClass}>Tags <span className="text-gray-600 normal-case">(comma-separated, optional)</span></label>
              <input type="text" name="tags" value={formData.tags} onChange={handleChange}
                placeholder="AI, Web, Mobile" className="input-field" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? <Spinner size="sm" /> : "Create Project"}
              </button>
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateProject;
