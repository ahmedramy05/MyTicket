import { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  const styles = {
    footer: {
      backgroundColor: "#111",
      color: "#fff",
      padding: "2rem 0",
      fontFamily: "'Inter', sans-serif",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 1rem",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    section: {
      margin: "1rem",
      flex: "1 1 200px",
    },
    title: {
      fontSize: "1.2rem",
      marginBottom: "1rem",
      color: "#fff",
    },
    link: {
      color: "#ccc",
      textDecoration: "none",
      display: "block",
      margin: "0.5rem 0",
    },
    newsletterForm: {
      display: "flex",
      marginTop: "1rem",
    },
    input: {
      padding: "0.5rem",
      border: "none",
      borderRadius: "4px 0 0 4px",
    },
    button: {
      padding: "0.5rem 1rem",
      backgroundColor: "#ff4d4d",
      color: "white",
      border: "none",
      borderRadius: "0 4px 4px 0",
      cursor: "pointer",
    },
    bottom: {
      borderTop: "1px solid #333",
      marginTop: "1rem",
      paddingTop: "1rem",
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
    },
    copyright: {
      fontSize: "0.8rem",
      color: "#999",
      margin: "1rem",
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <h2 style={styles.title}>MyTicket</h2>
          </Link>
          <p>Your gateway to unforgettable events</p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.title}>Quick Links</h3>
          <Link to="/events" style={styles.link}>
            All Events
          </Link>
          <Link to="/about" style={styles.link}>
            About Us
          </Link>
          <Link to="/contact" style={styles.link}>
            Contact
          </Link>
          <Link to="/faq" style={styles.link}>
            FAQ
          </Link>
        </div>

        <div style={styles.section}>
          <h3 style={styles.title}>For Organizers</h3>
          <Link to="/organizers" style={styles.link}>
            Create Event
          </Link>
          <Link to="/organizers/pricing" style={styles.link}>
            Pricing
          </Link>
          <Link to="/organizers/resources" style={styles.link}>
            Resources
          </Link>
        </div>

        <div style={styles.section}>
          <h3 style={styles.title}>Stay Updated</h3>
          <form onSubmit={handleSubmit} style={styles.newsletterForm}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Subscribe
            </button>
          </form>
        </div>

        <div style={styles.bottom}>
          <div>
            <Link to="/privacy" style={styles.link}>
              Privacy
            </Link>
            <Link to="/terms" style={styles.link}>
              Terms
            </Link>
          </div>
          <p style={styles.copyright}>
            &copy; {new Date().getFullYear()} MyTicket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
