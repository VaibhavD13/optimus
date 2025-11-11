import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import JobList from '@/pages/JobList';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Forgot from './pages/Forgot';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import EmployerDashboard from './pages/EmployerDashboard';
import EmployerJobs from './pages/EmployerJobs';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/employer" element={<ProtectedRoute><EmployerDashboard /></ProtectedRoute>} />
          <Route path="/employer/jobs" element={<ProtectedRoute><EmployerJobs /></ProtectedRoute>} />
          {/* <Route path="/employer/jobs/edit/:jobId" element={<ProtectedRoute><EmployerJobsEdit /></ProtectedRoute>} /> // create EmployerJobsEdit later */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}