import { useAuth } from "../contexts/AuthContext"

export default function Navbar() {
  const { isLoggedIn, user, logout, isLoading, userRole } = useAuth()

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <nav className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JB</span>
              </div>
              <span className="text-xl font-bold text-gray-900">JobBoard</span>
            </a>
          </div>

          {/* Loading skeleton */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    )
  }

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?")
    if (confirmed) {
      logout()
    }
  }

  return (
    <nav className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">JB</span>
            </div>
            <span className="text-xl font-bold text-gray-900">JobBoard</span>
          </a>
        </div>

        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            // Show only Login when not logged in
            <>
              {/* <a
                href="/jobs"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                Browse Jobs
              </a> */}
              <a
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                Login
              </a>
              <a
                href="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Sign Up
              </a>
            </>
          ) : (
            // Show user info, Dashboard and Logout when logged in
            <>
              {/* User greeting */}
              {user && (
                <span className="text-sm text-gray-600 hidden sm:inline">
                  Welcome, {user.name || user.email || "User"}
                  {userRole && (
                    <span className="ml-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">{userRole}</span>
                  )}
                </span>
              )}

              {/* Navigation based on user role */}
              {/* <a
                href="/jobs"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                Browse Jobs
              </a> */}

                <a
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  Dashboard
                </a>


              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
