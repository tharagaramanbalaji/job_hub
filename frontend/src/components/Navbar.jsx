import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">💼</span>
          JobHub
        </Link>
        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>

          {user ? (
            <>
              {user.userType === 'seeker' && (
                <Link to="/saved" className="nav-link">Saved Jobs</Link>
              )}
              {user.userType === 'poster' && (
                <Link to="/post-job" className="nav-link nav-link-cta">Post a Job</Link>
              )}
              <div className="nav-user">
                <span className="nav-avatar">{user.username[0].toUpperCase()}</span>
                <span className="nav-username">{user.username}</span>
                <span className="nav-badge">{user.userType}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-ghost">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
