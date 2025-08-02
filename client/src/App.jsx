import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Jobs from './pages/Joblisting';
import Dashboard from './pages/admin/dashboard';
import PostJob from './pages/PostJob';
import EditJob from './pages/EditJob';
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/jobs" element={<><Navbar /><Jobs /></>} />
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/signup" element={<><Navbar /><Signup /></>} />
        <Route path="/dashboard" element={<ProtectedRoute><Navbar /><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/post-job" element={<><Navbar /><PostJob /></>} />
        <Route path="/dashboard/edit/:id" element={<><Navbar /><EditJob /></>} />
      </Routes>
    </AuthProvider>
    </Router>
  );
}

export default App;
