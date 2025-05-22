import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeLink, setActiveLink] = useState(window.location.pathname);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // For hover effects
  const [hoveredLink, setHoveredLink] = useState(null);

  const styles = {
    navbar: {
      backgroundColor: "#ffffff",
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    logo: {
      fontWeight: "bold",
      fontSize: "1.5rem",
      color: "#333",
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
    },
    logoIcon: {
      color: "#ff4d4d",
      marginRight: "0.5rem",
    },
    navLinks: {
      display: isMobile ? "none" : "flex",
      gap: "1.5rem",
      alignItems: "center",
    },
    link: {
      textDecoration: "none",
      color: "#555",
      fontWeight: "500",
      padding: "0.5rem 0.75rem",
      borderRadius: "4px",
      transition: "all 0.2s ease",
    },
    activeLink: {
      color: "#ff4d4d",
      position: "relative",
    },
    linkHover: {
      color: "#ff4d4d",
      backgroundColor: "rgba(255, 77, 77, 0.05)",
    },
    authButtons: {
      display: isMobile ? "none" : "flex",
      gap: "0.75rem",
    },
    button: {
      padding: "0.5rem 1.25rem",
      borderRadius: "4px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    outlineButton: {
      backgroundColor: "transparent",
      border: "1px solid #ddd",
      color: "#333",
    },
    primaryButton: {
      backgroundColor: "#ff4d4d",
      color: "white",
      border: "none",
    },
    hamburger: {
      display: isMobile ? "flex" : "none",
      flexDirection: "column",
      justifyContent: "space-between",
      width: "24px",
      height: "18px",
      cursor: "pointer",
    },
    hamburgerLine: {
      height: "2px",
      width: "100%",
      backgroundColor: "#333",
      marginBottom: "5px",
    },
    mobileMenu: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 999,
      transition: "opacity 0.3s ease",
    },
    mobileMenuContent: {
      backgroundColor: "white",
      width: "70%",
      height: "100%",
      padding: "2rem",
      position: "relative",
    },
    mobileLink: {
      display: "block",
      padding: "1rem 0",
      borderBottom: "1px solid #eee",
      color: "#333",
      textDecoration: "none",
      fontSize: "1.1rem",
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "1.5rem",
      cursor: "pointer",
      position: "absolute",
      top: "1rem",
      right: "1rem",
      color: "#333",
    },
    mobileHeader: {
      marginBottom: "2rem",
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
            { path: "/venues", label: "Venues" },
            { path: "/organizers", label: "For Organizers" },
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

        {/* Authentication Buttons */}
        <div style={styles.authButtons}>
          <Link to="/login">
            <button
              style={{
                ...styles.button,
                ...styles.outlineButton,
                ...(hoveredLink === "login"
                  ? { backgroundColor: "#f5f5f5" }
                  : {}),
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
                ...(hoveredLink === "signup"
                  ? { backgroundColor: "#ff3333" }
                  : {}),
              }}
              onMouseEnter={() => setHoveredLink("signup")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Sign up
            </button>
          </Link>
        </div>

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
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside menu
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

            {[
              { path: "/events", label: "Events" },
              { path: "/venues", label: "Venues" },
              { path: "/organizers", label: "For Organizers" },
              { path: "/about", label: "About" },
              { path: "/login", label: "Log in" },
              { path: "/register", label: "Sign up" },
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
          </div>
        </div>
      )}
    </>
  );
}
