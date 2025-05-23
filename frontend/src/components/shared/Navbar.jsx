import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // For hover effects
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setShowUserMenu(false);
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    navigate("/profile");
  };

  const styles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 1.5rem',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      color: '#222',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      fontWeight: '700',
      fontSize: '1.5rem',
      color: '#ff4d4d',
      textDecoration: 'none',
    },
    logoIcon: {
      marginRight: '0.5rem',
      color: '#ff4d4d',
    },
    navLinks: {
      display: 'flex',
      gap: '1.5rem',
      alignItems: 'center',
    },
    link: {
      textDecoration: 'none',
      color: '#222',
      fontWeight: '500',
      padding: '0.5rem 0',
      position: 'relative',
      transition: 'all 0.2s ease',
    },
    linkHover: {
      color: '#ff4d4d',
    },
    activeLink: {
      color: '#ff4d4d',
      fontWeight: '600',
    },
    authButtons: {
      display: 'flex',
      gap: '1rem',
    },
    button: {
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s ease',
    },
    outlineButton: {
      backgroundColor: 'white',
      border: '1px solid #e0e0e0',
      color: '#222',
    },
    primaryButton: {
      backgroundColor: '#ff4d4d',
      border: '1px solid #ff4d4d',
      color: 'white',
    },
    hamburger: {
      display: isMobile ? 'flex' : 'none',
      flexDirection: 'column',
      cursor: 'pointer',
    },
    hamburgerLine: {
      width: '24px',
      height: '2px',
      backgroundColor: '#222',
      marginBottom: '4px',
      borderRadius: '5px',
    },
    mobileMenu: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 1100,
    },
    mobileMenuContent: {
      position: 'fixed',
      top: '0',
      right: '0',
      bottom: '0',
      width: '250px',
      backgroundColor: 'white',
      boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
      padding: '2rem 1rem',
      overflowY: 'auto',
    },
    closeButton: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#222',
    },
    mobileHeader: {
      marginBottom: '2rem',
    },
    mobileLink: {
      display: 'block',
      padding: '0.75rem 0',
      borderBottom: '1px solid #f0f0f0',
      textDecoration: 'none',
      color: '#222',
      fontWeight: '500',
    },
    userContainer: {
      position: 'relative',
    },
    userButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: '4px',
      transition: 'all 0.2s ease',
      color: '#222',
      fontWeight: '500',
      background: showUserMenu ? 'rgba(255, 77, 77, 0.08)' : 'transparent',
    },
    userAvatar: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      backgroundColor: '#ff4d4d',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
    },
    userDropdown: {
      position: 'absolute',
      top: '45px',
      right: '0',
      backgroundColor: '#fff',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '4px',
      padding: '0.5rem 0',
      minWidth: '180px',
      zIndex: 1000,
    },
    dropdownItem: {
      display: 'block',
      padding: '8px 16px',
      color: '#222',
      textDecoration: 'none',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
    },
    dropdownDivider: {
      borderBottom: '1px solid #eee',
      margin: '0.5rem 0',
    },
  };

  return (
    <>
      <nav style={styles.navbar}>
        {/* Logo */}
        <Link to="/" style={styles.logo} onClick={() => setActiveLink("/")}>
          <span style={styles.logoIcon}>●</span>
          MyTicket
        </Link>

        {/* Desktop Navigation */}
        <div style={styles.navLinks}>
          {[
            { path: "/events", label: "Events" },
            { path: "/about", label: "About" },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...styles.link,
                ...(activeLink === link.path ? styles.activeLink : {}),
                ...(hoveredLink === link.path ? styles.linkHover : {}),
              }}
              onClick={() => setActiveLink(link.path)}
              onMouseEnter={() => setHoveredLink(link.path)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Authentication Buttons or User Menu */}
        {isAuthenticated && user ? (
          <div style={styles.userContainer}>
            <div
              style={styles.userButton}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div style={styles.userAvatar}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span>{user.name || 'User'}</span>
            </div>
            {showUserMenu && (
              <div style={styles.userDropdown}>
                <Link
                  to="/dashboard"
                  style={styles.dropdownItem}
                  onClick={() => setShowUserMenu(false)}
                >
                  Dashboard
                </Link>
                <div
                  style={styles.dropdownItem}
                  onClick={handleProfileClick}
                >
                  Profile
                </div>
                {user.role === "Organizer" && (
                  <Link
                    to="/my-events"
                    style={styles.dropdownItem}
                    onClick={() => setShowUserMenu(false)}
                  >
                    My Events
                  </Link>
                )}
                {user.role === "System Admin" && (
                  <Link
                    to="/admin/users"
                    style={styles.dropdownItem}
                    onClick={() => setShowUserMenu(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <div style={styles.dropdownDivider}></div>
                <div
                  style={{ ...styles.dropdownItem, cursor: 'pointer' }}
                  onClick={handleLogout}
                >
                  Log out
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={styles.authButtons}>
            <Link to="/login">
              <button
                style={{
                  ...styles.button,
                  ...styles.outlineButton,
                  ...(hoveredLink === "login" ? { backgroundColor: "#f5f5f5" } : {}),
                }}
                onMouseEnter={() => setHoveredLink("login")}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Log in
              </button>
            </Link>
            <Link to="/register">
              <button
                style={{
                  ...styles.button,
                  ...styles.primaryButton,
                  ...(hoveredLink === "signup" ? { backgroundColor: "#ff3333" } : {}),
                }}
                onMouseEnter={() => setHoveredLink("signup")}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Sign up
              </button>
            </Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        <div style={styles.hamburger} onClick={() => setIsOpen(true)}>
          <div style={styles.hamburgerLine}></div>
          <div style={styles.hamburgerLine}></div>
          <div style={styles.hamburgerLine}></div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={styles.mobileMenu} onClick={() => setIsOpen(false)}>
          <div
            style={styles.mobileMenuContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button style={styles.closeButton} onClick={() => setIsOpen(false)}>
              ✕
            </button>

            <div style={styles.mobileHeader}>
              <Link
                to="/"
                style={styles.logo}
                onClick={() => {
                  setIsOpen(false);
                  setActiveLink("/");
                }}
              >
                <span style={styles.logoIcon}>●</span>
                MyTicket
              </Link>
            </div>

            {/* Mobile navigation links */}
            {[
              { path: "/events", label: "Events" },
              { path: "/about", label: "About" },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={styles.mobileLink}
                onClick={() => {
                  setIsOpen(false);
                  setActiveLink(link.path);
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile auth links */}
            <div style={styles.dropdownDivider}></div>
            {isAuthenticated && user ? (
              <>
                <Link
                  to="/dashboard"
                  style={styles.mobileLink}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <div
                  style={styles.mobileLink}
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/profile");
                  }}
                >
                  Profile
                </div>
                {user.role === "Organizer" && (
                  <Link
                    to="/my-events"
                    style={styles.mobileLink}
                    onClick={() => setIsOpen(false)}
                  >
                    My Events
                  </Link>
                )}
                {user.role === "System Admin" && (
                  <Link
                    to="/admin/users"
                    style={styles.mobileLink}
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <div
                  style={{ ...styles.mobileLink, cursor: 'pointer' }}
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  Log out
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={styles.mobileLink}
                  onClick={() => setIsOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  style={styles.mobileLink}
                  onClick={() => setIsOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}