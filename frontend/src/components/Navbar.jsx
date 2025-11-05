import { Link , useNavigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';
import { logoutUser } from '../utils/api';
import { toast } from 'react-toastify';


function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userSignedIn = localStorage.getItem('userSignedIn'); 
    const userData = localStorage.getItem('user');
    
    setIsLoggedIn(userSignedIn === 'true');
    
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    toast.success('Logged out successfully');
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <h1>SlotSwapper</h1>
        </Link>
        <div className="navbar-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
        </div>
        <div className="navbar-actions">
          {!isLoggedIn ? (
            <Link to="/login">
              <button className="btn btn-outline">Login</button>
            </Link>
          ) : (
            <div className="profile-dropdown">
              <button 
                className="btn btn-profile" 
                onClick={() => setShowDropdown(!showDropdown)}
              >
                👤
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-user-info">
                    <div className="user-name">{user?.username || 'User'}</div>
                    <div className="user-email">{user?.gmail || user?.email || 'No email'}</div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/dashboard" onClick={() => setShowDropdown(false)}>
                    <button className="dropdown-item">Dashboard</button>
                  </Link>
                  <Link to="/marketplace" onClick={() => setShowDropdown(false)}>
                    <button className="dropdown-item">Marketplace</button>
                  </Link>
                  <Link to="/requests" onClick={() => setShowDropdown(false)}>
                    <button className="dropdown-item">Requests</button>
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
