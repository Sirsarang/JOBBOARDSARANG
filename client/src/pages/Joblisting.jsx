import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import FilterModal from "../components/FilterModal";

export default function JobListings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "All Categories",
    location: "All Locations",
    jobType: "All Types",
    salaryMin: "",
    salaryMax: "",
    experience: "All Levels",
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  //  Read initial filters from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlFilters = {
      category: searchParams.get("category") || "All Categories",
      location: searchParams.get("location") || "All Locations",
      jobType: searchParams.get("jobType") || "All Types",
      salaryMin: searchParams.get("salaryMin") || "",
      salaryMax: searchParams.get("salaryMax") || "",
      experience: searchParams.get("experience") || "All Levels",
    };

    const urlSearch = searchParams.get("search") || "";

    setFilters(urlFilters);
    setSearchTerm(urlSearch);
  }, [location.search]);

  //  Fetch jobs from backend based on filters
  useEffect(() => {
    const fetchJobs = async (pageNumber = 1, append = false) => {
      try {
        const queryParams = new URLSearchParams();

        if (searchTerm) queryParams.set("search", searchTerm);
        if (filters.category !== "All Categories")
          queryParams.set("category", filters.category);
        if (filters.location !== "All Locations")
          queryParams.set("location", filters.location);
        if (filters.jobType !== "All Types")
          queryParams.set("jobType", filters.jobType);
        if (filters.experience !== "All Levels")
          queryParams.set("experience", filters.experience);
        if (filters.salaryMin) queryParams.set("minSalary", filters.salaryMin);
        if (filters.salaryMax) queryParams.set("maxSalary", filters.salaryMax);

        queryParams.set("page", pageNumber);
        queryParams.set("limit", 5); // Change as needed

        const res = await fetch(`/api/jobs?${queryParams.toString()}`);
        const data = await res.json();

        if (append) {
          setJobs((prev) => [...prev, ...data.results]);
        } else {
          setJobs(data.results);
        }

        setHasMore(pageNumber < data.pages);
      } catch (err) {
        console.error("Error fetching jobs:", err.message);
      }
    };
    setPage(1);
    fetchJobs(1, false);
  }, [searchTerm, filters]);

  //  Handle filter application and update URL
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);

    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (newFilters.category !== "All Categories")
      params.set("category", newFilters.category);
    if (newFilters.location !== "All Locations")
      params.set("location", newFilters.location);
    if (newFilters.jobType !== "All Types")
      params.set("jobType", newFilters.jobType);
    if (newFilters.experience !== "All Levels")
      params.set("experience", newFilters.experience);
    if (newFilters.salaryMin) params.set("salaryMin", newFilters.salaryMin);
    if (newFilters.salaryMax) params.set("salaryMax", newFilters.salaryMax);

    navigate(`/jobs?${params.toString()}`);
  };

  //  Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category !== "All Categories") count++;
    if (filters.location !== "All Locations") count++;
    if (filters.jobType !== "All Types") count++;
    if (filters.experience !== "All Levels") count++;
    if (filters.salaryMin || filters.salaryMax) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  //  Handle search input change
  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    const params = new URLSearchParams(searchParams.toString());
    if (newSearchTerm) {
      params.set("search", newSearchTerm);
    } else {
      params.delete("search");
    }

    navigate(`/jobs?${params.toString()}`);
  };
  console.log(jobs);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Find Your Next{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Opportunity
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing job opportunities from top companies around the
            world
          </p>
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search jobs, companies, or locations..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/25 focus:border-blue-500 transition-all duration-200"
              />
              <svg
                className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div className="lg:w-auto">
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="relative w-full lg:w-auto inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-500/25 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                  />
                </svg>
                Filter Jobs
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 text-gray-600">
          Showing{" "}
          <span className="font-semibold text-gray-900">{jobs.length}</span> job
          {jobs.length !== 1 ? "s" : ""}
          {searchTerm && (
            <>
              {" "}
              for{" "}
              <span className="font-semibold text-blue-600">
                "{searchTerm}"
              </span>
            </>
          )}
          {activeFiltersCount > 0 && (
            <>
              {" "}
              with{" "}
              <span className="font-medium text-blue-600">
                {activeFiltersCount}
              </span>{" "}
              filter{activeFiltersCount > 1 ? "s" : ""}
            </>
          )}
        </div>

        {/* Job Cards */}
        {jobs.length > 0 ? (
          <div className="space-y-6">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                {...job}
                showSalary={true}
                isSaved={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or browse all available
              positions.
            </p>
          </div>
        )}

        {/* Load More */}
        {jobs.length > 0 && hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={() => {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchJobs(nextPage, true);
              }}
              className="px-8 py-3 text-base font-medium text-blue-600 bg-white border-2 border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-500/25 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Load More Jobs
            </button>
          </div>
        )}

        {/* Filter Modal */}
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={handleApplyFilters}
          currentFilters={filters}
        />
      </div>
    </div>
  );
}
