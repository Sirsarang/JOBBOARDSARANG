import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function PostJobForm({jobData, mode = "create", jobId = null}) {
  const navigator = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    category: "",
    jobType: "",
    experienceLevel: "",
    salary: "",
    tags: "",
    requiredSkills: "",
    description: "",
  })
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    jobType: "",
    experience: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const [jobOptions, setJobOptions] = useState({
  categories: [],
  jobTypes: [],
  experienceLevels: [],
});
const [loadingOptions, setLoadingOptions] = useState(true);

useEffect(() => {
  const fetchJobOptions = async () => {
    try {
      const res = await fetch('/api/options'); // 👈 your backend route
      if (!res.ok) throw new Error("Failed to fetch options");
      const data = await res.json();
      setJobOptions(data);
    } catch (err) {
      console.error("Error fetching job options:", err);
    } finally {
      setLoadingOptions(false);
    }
  };

  fetchJobOptions();
}, []);

useEffect(() => {
    if (jobData) {
      setFormData({
        title: jobData.title || "",
        company: jobData.company || "",
        description: jobData.description || "",
        location: jobData.location || "",
        category: jobData.category || "",
        jobType: jobData.jobType || "",
        experienceLevel: jobData.experienceLevel || "",
        salary: jobData.salary || "",
        requiredSkills: jobData.requiredSkills || "",
        tags: jobData.tags || "",
      })
    }
  }, [jobData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      title: "",
      company: "",
      description: "",
      location: "",
      category: "",
      jobType: "",
      experience: "",
    }

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required"
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Job title must be at least 3 characters"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Job description is required"
    } else if (formData.description.trim().length < 50) {
      newErrors.description = "Job description must be at least 50 characters"
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company is required"
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }

    if (!formData.category || formData.category === "Select a category") {
      newErrors.category = "Please select a category"
    }

    if (!formData.jobType || formData.jobType === "Select job type") {
      newErrors.jobType = "Please select a job type"
    }

    if (!formData.experienceLevel || formData.experienceLevel === "Select experience level") {
      newErrors.experience = "Please select experience level"
    }

    setErrors(newErrors)
    return (
      !newErrors.title &&
      !newErrors.company &&
      !newErrors.description &&
      !newErrors.location &&
      !newErrors.category &&
      !newErrors.jobType &&
      !newErrors.experience
    )
  }

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  setIsLoading(true);

  const token = localStorage.getItem("authToken");

  const payload = {
    ...formData,
    tags: formData.tags.split(",").map((tag) => tag.trim()),
    requiredSkills: formData.requiredSkills.split(",").map((skill) => skill.trim()),
    salary: formData.salary || "Not specified",
  };

  try {
    const response = await fetch(
      mode === "edit" ? `/api/jobs/${jobId}` : "/api/jobs",
      {
        method: mode === "edit" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) throw new Error(`${mode === "edit" ? "Update" : "Post"} failed`);

    navigator("/dashboard");
  } catch (err) {
    console.error("Submit error:", err);
    alert("Something went wrong. Please try again.");
  } finally {
    setIsLoading(false);
  }
};


  if (loadingOptions) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading job options...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8 p-24">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {mode=='edit'?"Update Job":"Post a New Job"}
          </h1>
          <p className="text-gray-600">
            Fill out the details below to create your job posting
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Job Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 ${
                  errors.title
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/25"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/25"
                }`}
                placeholder="e.g. Senior Frontend Developer"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.title}
                </p>
              )}
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                id="Company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 ${
                  errors.title
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/25"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/25"
                }`}
                placeholder="e.g. Netflix, etc."
              />
              {errors.company && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.company}
                </p>
              )}
            </div>

            {/* Job Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="6"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 resize-none ${
                  errors.description
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/25"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/25"
                }`}
                placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity exciting..."
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.description}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                {formData.description.length}/500 characters (minimum 50 required)
              </p>
            </div>

            {/* Location and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 ${
                    errors.location
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/25"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/25"
                  }`}
                  placeholder="e.g. San Francisco, CA or Remote"
                />
                {errors.location && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.location}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 appearance-none bg-white ${
                      errors.category
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/25"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/25"
                    }`}
                  >
                    <option value="">Select a category</option>
                    {jobOptions.categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {errors.category && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.category}
                  </p>
                )}
              </div>
            </div>

            {/* Job Type and Experience Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Type */}
              <div>
                <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="jobType"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 appearance-none bg-white ${
                      errors.jobType
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/25"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/25"
                    }`}
                  >
                    <option value="">Select job type</option>
                    {jobOptions.jobTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {errors.jobType && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.jobType}
                  </p>
                )}
              </div>

              {/* Experience Level */}
              <div>
                <label htmlFor="experienceLevels" className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 appearance-none bg-white ${
                      errors.experience
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/25"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/25"
                    }`}
                  >
                    <option value="">Select experience level</option>
                    {jobOptions.experienceLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {errors.experience && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.experience}
                  </p>
                )}
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary <span className="text-gray-400">(Optional)</span>
              </label>
                  <input
                    name="salary"
                    type="string"
                    value={formData.salary}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/25 focus:border-blue-500 transition-all duration-200"
                    placeholder=" Salary"
                  />
                
                
              <p className="mt-2 text-xs text-gray-500">
                Providing salary information helps attract qualified candidates
              </p>
            </div>

            {/* Requirements */}
            <div>
              <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills <span className="text-gray-400">(Comma Seperated)</span>
              </label>
              <input
                id="requiredSkills"
                name="requiredSkills"
                type="text"
                value={formData.requiredSkills}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/25 focus:border-blue-500 transition-all duration-200 resize-none"
                placeholder="List the key skills needed for this role..."
              />
              <p className="mt-2 text-xs text-gray-500">Be specific about must-have vs nice-to-have requirements</p>
            </div>



            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags <span className="text-gray-400">(Comma seperated)</span>
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/25 focus:border-blue-500 transition-all duration-200"
                placeholder="e.g. React, TypeScript, Remote, Senior"
              />
              <p className="mt-2 text-xs text-gray-500">
                Separate tags with commas to help candidates find your job posting
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <a
                href="/dashboard"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-500/25 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Cancel
              </a>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/25 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {mode === "edit" ? "Updating Job..." : "Posting Job..."}
                  </>
                ) : (
                  <>
                    {mode === 'edit' ? (
                      <>
                        {/* Pencil/Edit SVG for update */}
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h12" />
                        </svg>
                        Update Job
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Post Job
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}
