// frontend/src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center font-bold">O</div>
          <div className="text-lg font-semibold">Optimus</div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link className="text-sm text-slate-600 hover:text-slate-900" to="/">Jobs</Link>
          {user ? (
            <>
              <Link className="text-sm text-slate-600 hover:text-slate-900" to="/dashboard">Dashboard</Link>
              <span className="text-sm text-slate-600">Hi, {user.FirstName}</span>
              <button onClick={logout} className="ml-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link className="text-sm text-slate-600 hover:text-slate-900" to="/login">Sign in</Link>
              <Link className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm" to="/register">Get started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}