import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";
import { useNavigate } from "react-router-dom"; // ✅ React Router replacement

// Create the Auth Context
const AuthContext = createContext();

// Custom hook to use the Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate(); 

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("userData");

        if (storedToken) {
          setToken(storedToken);

          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = (authToken, userData = null) => {
    try {
      localStorage.setItem("authToken", authToken);

      if (userData) {
        localStorage.setItem("userData", JSON.stringify(userData));
        setUser(userData);
      }

      setToken(authToken);

      console.log("Login successful:", { token: authToken, user: userData });

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("userRole");
      localStorage.removeItem("refreshToken");

      setToken(null);
      setUser(null);

      navigate("/"); // ✅ Redirect to homepage on logout

      console.log("Logout successful");

      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  };

  const isAuthenticated = () => !!token;

  const getUserRole = () => user?.role || null;

  const updateUser = (newUserData) => {
    try {
      const updatedUser = { ...user, ...newUserData };
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error("Update user error:", error);
      return false;
    }
  };

  const value = {
    user,
    token,
    isLoading,

    login,
    logout,
    isAuthenticated,
    getUserRole,
    updateUser,

    isLoggedIn: !!token,
    userRole: user?.role || null,
    userName: user?.name || user?.email || "User",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
