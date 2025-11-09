import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <div className="font-bold">
        <Link to="/">Optimus</Link>
      </div>
      <div>
        {user ? (
          <>
            <span className="mr-4">Hi, {user.FirstName}</span>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link className="mr-4" to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}