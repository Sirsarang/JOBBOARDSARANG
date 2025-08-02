import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function FilterModal({ isOpen, onClose, onApplyFilters, currentFilters }) {
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    jobType: "",
    salaryMin: "",
    salaryMax: "",
    experience: "",
  });

  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    jobTypes: [],
    experienceLevels: [],
  });

  const [loadingOptions, setLoadingOptions] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Fetch options from backend (once on mount)
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch("/api/options");
        const data = await res.json();
        setFilterOptions(data);
      } catch (err) {
        console.error("Error fetching filter options:", err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  // Sync currentFilters prop when modal opens or filters change
  useEffect(() => {
    if (currentFilters) {
      setFilters({
        category: currentFilters.category || "",
        location: currentFilters.location || "",
        jobType: currentFilters.jobType || "",
        salaryMin: currentFilters.salaryMin || "",
        salaryMax: currentFilters.salaryMax || "",
        experience: currentFilters.experience || "",
      });
    }
  }, [currentFilters, isOpen]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: "",
      location: "",
      jobType: "",
      salaryMin: "",
      salaryMax: "",
      experience: "",
    });
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();

    const currentSearch = searchParams.get("search");
    if (currentSearch) params.set("search", currentSearch);

    if (filters.category) params.set("category", filters.category);
    if (filters.location) params.set("location", filters.location);
    if (filters.jobType) params.set("jobType", filters.jobType);
    if (filters.experience) params.set("experience", filters.experience);
    if (filters.salaryMin) params.set("salaryMin", filters.salaryMin);
    if (filters.salaryMax) params.set("salaryMax", filters.salaryMax);

    navigate(`/jobs?${params.toString()}`);
    onApplyFilters(filters);
    onClose();
  };

  if (!isOpen || loadingOptions) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300 scale-100 opacity-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Filter Jobs</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Row 1: Category + Job Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/25"
                >
                  <option value="">All Categories</option>
                  {filterOptions.categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <select
                  value={filters.jobType}
                  onChange={(e) => handleFilterChange("jobType", e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/25"
                >
                  <option value="">All Types</option>
                  {filterOptions.jobTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Location + Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={filters.location || ""}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  placeholder="Enter location (e.g., Remote, Delhi)"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select
                  value={filters.experience}
                  onChange={(e) => handleFilterChange("experience", e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/25"
                >
                  <option value="">All Levels</option>
                  {filterOptions.experienceLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Salary Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range (₹)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Min salary"
                  value={filters.salaryMin || ""}
                  onChange={(e) => handleFilterChange("salaryMin", e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/25"
                />
                <input
                  type="number"
                  placeholder="Max salary"
                  value={filters.salaryMax || ""}
                  onChange={(e) => handleFilterChange("salaryMax", e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/25"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleClearFilters}
              className="flex-1 px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 border rounded-lg hover:bg-gray-200"
            >
              Clear Filters
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-lg hover:shadow-xl"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
