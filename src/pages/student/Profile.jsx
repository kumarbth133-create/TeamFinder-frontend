import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import toast from "react-hot-toast";
import MainLayout from "../../components/layout/MainLayout";
import Avatar from "../../components/common/Avatar";
import SkillBadge from "../../components/common/SkillBadge";
import Spinner from "../../components/common/Spinner";
import {
  FiEdit2, FiGithub, FiLinkedin, FiCamera, FiSave, FiX,
  FiUpload, FiLink, FiCheck, FiUser, FiBook, FiGlobe
} from "react-icons/fi";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    college: user?.college || "",
    profilePicture: user?.profilePicture || "",
    githubLink: user?.githubLink || "",
    linkedinLink: user?.linkedinLink || "",
    skills: user?.skills || [],
    password: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
    setSkillInput("");
  };

  const removeSkill = (skill) =>
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Full Name is required");
    setSaving(true);
    try {
      const { data } = await API.put("/users/profile", formData);
      updateUser(data.data);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setPreviewSrc(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please select a valid image file (PNG, JPG, WEBP)");
    }

    if (file.size > 10 * 1024 * 1024) {
      return toast.error("Image size should be less than 10MB");
    }

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setPreviewSrc(localUrl);

    setUploading(true);
    const fd = new FormData();
    fd.append("profilePicture", file);

    try {
      const { data } = await API.post("/users/upload-picture", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser(data.data);
      setFormData((prev) => ({ ...prev, profilePicture: data.data.profilePicture }));
      toast.success("Profile picture updated! 🎉");
    } catch (err) {
      setPreviewSrc(null);
      toast.error(err.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const currentDisplayPicture = previewSrc || user?.profilePicture || formData.profilePicture;

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold dark:text-white text-slate-900">My Profile</h1>
            <p className="text-xs dark:text-gray-400 text-slate-500 mt-0.5">Manage your personal information and skills</p>
          </div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn-primary flex items-center gap-2">
              <FiEdit2 size={15} /> Edit Profile
            </button>
          )}
        </div>

        {/* Profile Main Card */}
        <div className="card">
          
          {/* Top Hero Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-200 dark:border-dark-600">
            
            {/* Avatar with Camera Trigger */}
            <div className="relative group flex-shrink-0">
              <div className="relative">
                <Avatar
                  src={currentDisplayPicture}
                  name={user?.name}
                  size="xl"
                  className="ring-4 ring-primary-500/20"
                />
                
                {/* Upload Spinner Overlay */}
                {uploading && (
                  <div className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center text-white backdrop-blur-xs">
                    <Spinner size="md" />
                  </div>
                )}
              </div>

              {/* Camera Icon Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title="Upload Profile Picture"
                className="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-2.5 shadow-lg border-2 border-white dark:border-dark-750 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <FiCamera size={15} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                className="hidden"
                onChange={handlePictureUpload}
                disabled={uploading}
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-2xl font-extrabold dark:text-white text-slate-900">{user?.name}</h2>
                <span className="inline-block self-center sm:self-auto text-xs px-2.5 py-0.5 rounded-full font-semibold bg-primary-100 text-primary-700 dark:bg-emerald-900/40 dark:text-primary-400">
                  Student Member
                </span>
              </div>
              <p className="text-sm dark:text-gray-400 text-slate-500 font-medium">{user?.email}</p>
              {user?.college && (
                <p className="text-xs dark:text-gray-300 text-slate-600 flex items-center gap-1 justify-center sm:justify-start mt-1">
                  <FiBook className="text-primary-600" /> {user.college}
                </p>
              )}

              {/* Quick Upload Hint */}
              <div className="pt-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline cursor-pointer"
                >
                  <FiUpload size={13} /> Click to Change Photo
                </button>
              </div>
            </div>
          </div>

          {/* View Mode Content */}
          {!isEditing && (
            <div className="pt-6 space-y-5">
              {/* Bio */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  About Me
                </h3>
                <p className="text-sm dark:text-gray-200 text-slate-700 leading-relaxed font-normal">
                  {user?.bio || "No bio added yet. Click Edit Profile to add a summary about yourself!"}
                </p>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Skills & Expertise
                </h3>
                {user?.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill) => (
                      <SkillBadge key={skill} skill={skill} />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-gray-500">No skills added yet.</p>
                )}
              </div>

              {/* Social Links */}
              {(user?.githubLink || user?.linkedinLink) && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Social Links
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {user?.githubLink && (
                      <a
                        href={user.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-dark-600 bg-slate-50 dark:bg-dark-700 hover:text-primary-600 dark:hover:text-primary-400 transition"
                      >
                        <FiGithub size={14} /> GitHub Profile
                      </a>
                    )}
                    {user?.linkedinLink && (
                      <a
                        href={user.linkedinLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-dark-600 bg-slate-50 dark:bg-dark-700 hover:text-primary-600 dark:hover:text-primary-400 transition"
                      >
                        <FiLinkedin size={14} /> LinkedIn Profile
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Edit Mode Form */}
          {isEditing && (
            <form onSubmit={handleSave} className="pt-6 space-y-5">
              
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400" size={16} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                {/* College */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-slate-700 mb-1.5">
                    College Name
                  </label>
                  <div className="relative">
                    <FiBook className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400" size={16} />
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="e.g. IIT Delhi"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Picture URL Option */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-slate-700 mb-1.5">
                  Profile Picture URL <span className="text-gray-400 font-normal lowercase">(or upload via camera icon above)</span>
                </label>
                <div className="relative">
                  <FiGlobe className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400" size={16} />
                  <input
                    type="text"
                    name="profilePicture"
                    value={formData.profilePicture}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-slate-700 mb-1.5">
                  Bio Summary
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  maxLength={500}
                  className="input-field resize-none"
                  placeholder="Share a short bio about your passions, tech interests, or project goals..."
                />
                <p className="text-[11px] text-slate-400 dark:text-gray-500 mt-1 text-right">
                  {formData.bio.length}/500
                </p>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-slate-700 mb-1.5">
                  Skills & Technologies
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    className="input-field"
                    placeholder="Type skill (e.g. React, Node.js, Python) and press Add"
                  />
                  <button type="button" onClick={addSkill} className="btn-secondary px-4">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <SkillBadge key={skill} skill={skill} onRemove={removeSkill} />
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-slate-700 mb-1.5">
                    GitHub URL
                  </label>
                  <div className="relative">
                    <FiGithub className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400" size={16} />
                    <input
                      type="url"
                      name="githubLink"
                      value={formData.githubLink}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-slate-700 mb-1.5">
                    LinkedIn URL
                  </label>
                  <div className="relative">
                    <FiLinkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-slate-400" size={16} />
                    <input
                      type="url"
                      name="linkedinLink"
                      value={formData.linkedinLink}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-200 dark:border-dark-600">
                <button type="submit" disabled={saving} className="btn-primary px-5">
                  {saving ? <Spinner size="sm" /> : <><FiSave size={15} /> Save Changes</>}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setPreviewSrc(null);
                  }}
                  className="btn-secondary"
                >
                  <FiX size={15} /> Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
