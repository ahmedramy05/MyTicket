import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";

export default function LandingPage() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching featured events
  useEffect(() => {
    // Replace with actual API call
    setTimeout(() => {
      setUpcomingEvents([
        {
          id: 1,
          title: "Summer Music Festival",
          image:
            "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          date: "Aug 20, 2025",
          location: "Central Park, New York",
          price: "$75",
          category: "Music",
        },
        {
          id: 2,
          title: "Tech Conference 2025",
          image:
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          date: "Sep 15, 2025",
          location: "Convention Center, San Francisco",
          price: "$120",
          category: "Conference",
        },
        {
          id: 3,
          title: "Basketball Championship",
          image:
            "https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          date: "Oct 5, 2025",
          location: "Sports Arena, Los Angeles",
          price: "$60",
          category: "Sports",
        },
        {
          id: 4,
          title: "Broadway Musical Night",
          image:
            "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          date: "Nov 12, 2025",
          location: "Broadway Theater, New York",
          price: "$95",
          category: "Arts",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { name: "Concerts", icon: "🎵", color: "#ff4d4d" },
    { name: "Sports", icon: "🏆", color: "#3498db" },
    { name: "Theater", icon: "🎭", color: "#9b59b6" },
    { name: "Conferences", icon: "💼", color: "#2ecc71" },
    { name: "Festivals", icon: "🎪", color: "#f39c12" },
    { name: "Workshops", icon: "🔧", color: "#1abc9c" },
  ];

  const testimonials = [
    {
      id: 1,
      quote:
        "MyTicket made it so easy to book tickets for my favorite band. The process was seamless!",
      author: "Sarah Johnson",
      role: "Music Enthusiast",
    },
    {
      id: 2,
      quote:
        "As an event organizer, this platform has helped me reach a wider audience. Highly recommended!",
      author: "Michael Chen",
      role: "Event Manager",
    },
    {
      id: 3,
      quote:
        "The mobile tickets feature is fantastic! No more printing or worrying about lost tickets.",
      author: "Emma Rodriguez",
      role: "Regular Attendee",
    },
  ];

  // Styles
  const styles = {
    section: {
      padding: "5rem 2rem",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    hero: {
      background: "linear-gradient(135deg, #12151f 0%, #2a2d3e 100%)",
      color: "white",
      padding: "0",
      position: "relative",
      overflow: "hidden",
      height: "600px",
      display: "flex",
      alignItems: "center",
    },
    heroOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage:
        "url('https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: 0.4,
    },
    heroContent: {
      position: "relative",
      zIndex: 2,
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 2rem",
    },
    heading: {
      fontSize: "3.5rem",
      fontWeight: "bold",
      marginBottom: "1.5rem",
      lineHeight: 1.2,
    },
    subheading: {
      fontSize: "1.5rem",
      marginBottom: "2.5rem",
      fontWeight: "300",
      maxWidth: "600px",
    },
    ctaButton: {
      backgroundColor: "#ff4d4d",
      color: "white",
      border: "none",
      padding: "1rem 2rem",
      fontSize: "1.1rem",
      borderRadius: "4px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      textDecoration: "none",
      display: "inline-block",
    },
    secondaryButton: {
      backgroundColor: "transparent",
      color: "white",
      border: "1px solid white",
      padding: "1rem 2rem",
      fontSize: "1.1rem",
      borderRadius: "4px",
      fontWeight: "600",
      cursor: "pointer",
      marginLeft: "1rem",
      transition: "all 0.2s ease",
      textDecoration: "none",
      display: "inline-block",
    },
    sectionTitle: {
      fontSize: "2.5rem",
      textAlign: "center",
      marginBottom: "3rem",
      color: "#333",
    },
    sectionSubtitle: {
      fontSize: "1.2rem",
      textAlign: "center",
      marginTop: "-2rem",
      marginBottom: "3rem",
      color: "#666",
      maxWidth: "700px",
      margin: "-1.5rem auto 3rem",
    },
    eventGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "2rem",
    },
    eventCard: {
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
      backgroundColor: "white",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    eventCardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
    },
    eventImage: {
      width: "100%",
      height: "180px",
      objectFit: "cover",
    },
    eventContent: {
      padding: "1.5rem",
    },
    eventTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "0.5rem",
      color: "#333",
    },
    eventDetails: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      marginBottom: "1rem",
      fontSize: "0.95rem",
      color: "#555",
    },
    eventDetailRow: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    eventPrice: {
      fontWeight: "bold",
      fontSize: "1.25rem",
      color: "#ff4d4d",
      marginBottom: "1rem",
    },
    badge: {
      display: "inline-block",
      padding: "0.25rem 0.75rem",
      borderRadius: "20px",
      fontSize: "0.75rem",
      fontWeight: "600",
      backgroundColor: "rgba(255, 77, 77, 0.1)",
      color: "#ff4d4d",
    },
    categoriesSection: {
      backgroundColor: "#f8f9fa",
    },
    categoryGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
      gap: "1.5rem",
    },
    categoryCard: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "1.5rem",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
      transition: "transform 0.3s ease",
      cursor: "pointer",
    },
    categoryIcon: {
      fontSize: "2.5rem",
      marginBottom: "0.75rem",
    },
    categoryName: {
      fontWeight: "600",
      color: "#333",
    },
    featuresSection: {
      backgroundColor: "#ffffff",
    },
    featureGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "2rem",
    },
    featureCard: {
      backgroundColor: "white",
      padding: "2rem",
      borderRadius: "8px",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
    featureIcon: {
      width: "50px",
      height: "50px",
      backgroundColor: "rgba(255, 77, 77, 0.1)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.5rem",
      color: "#ff4d4d",
      marginBottom: "1.5rem",
    },
    featureTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "1rem",
      color: "#333",
    },
    featureDescription: {
      color: "#666",
      lineHeight: 1.6,
    },
    testimonialSection: {
      backgroundColor: "#f8f9fa",
    },
    testimonialGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "2rem",
    },
    testimonialCard: {
      backgroundColor: "white",
      padding: "2rem",
      borderRadius: "8px",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
      position: "relative",
    },
    testimonialQuote: {
      fontSize: "1.1rem",
      lineHeight: 1.6,
      color: "#555",
      marginBottom: "1.5rem",
      fontStyle: "italic",
    },
    testimonialAuthor: {
      fontWeight: "600",
      color: "#333",
    },
    testimonialRole: {
      color: "#777",
      fontSize: "0.9rem",
    },
    ctaSection: {
      backgroundColor: "#ff4d4d",
      color: "white",
      textAlign: "center",
    },
    ctaSectionContent: {
      maxWidth: "800px",
      margin: "0 auto",
    },
    ctaTitle: {
      fontSize: "2.5rem",
      marginBottom: "1.5rem",
      color: "white",
    },
    ctaDescription: {
      fontSize: "1.2rem",
      marginBottom: "2.5rem",
      color: "rgba(255, 255, 255, 0.9)",
    },
    ctaButtonWhite: {
      backgroundColor: "white",
      color: "#ff4d4d",
      padding: "1rem 2.5rem",
      fontSize: "1.1rem",
      fontWeight: "600",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      textDecoration: "none",
      display: "inline-block",
    },
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heading}>Discover Events That Move You</h1>
          <p style={styles.subheading}>
            From electrifying concerts to thrilling sports events, find and book
            tickets to the experiences you love.
          </p>
          <div>
            <Link to="/events" style={styles.ctaButton}>
              Explore Events
            </Link>
            <Link to="/how-it-works" style={styles.secondaryButton}>
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Upcoming Events</h2>
        <p style={styles.sectionSubtitle}>
          Discover the hottest tickets for events happening near you
        </p>

        {isLoading ? (
          <div style={{ textAlign: "center" }}>Loading events...</div>
        ) : (
          <div style={styles.eventGrid}>
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                style={styles.eventCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    styles.eventCardHover.transform;
                  e.currentTarget.style.boxShadow =
                    styles.eventCardHover.boxShadow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = styles.eventCard.boxShadow;
                }}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  style={styles.eventImage}
                />
                <div style={styles.eventContent}>
                  <span style={styles.badge}>{event.category}</span>
                  <h3 style={styles.eventTitle}>{event.title}</h3>
                  <div style={styles.eventDetails}>
                    <div style={styles.eventDetailRow}>
                      <span>📅</span>
                      <span>{event.date}</span>
                    </div>
                    <div style={styles.eventDetailRow}>
                      <span>📍</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div style={styles.eventPrice}>From {event.price}</div>
                  <Link to={`/events/${event.id}`} style={styles.ctaButton}>
                    View Event
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link to="/events" style={styles.ctaButton}>
            View All Events
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ ...styles.section, ...styles.categoriesSection }}>
        <h2 style={styles.sectionTitle}>Browse by Category</h2>
        <p style={styles.sectionSubtitle}>
          Find events that match your interests
        </p>

        <div style={styles.categoryGrid}>
          {categories.map((category, index) => (
            <Link
              to={`/events/category/${category.name.toLowerCase()}`}
              style={{ textDecoration: "none" }}
              key={index}
            >
              <div
                style={styles.categoryCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span style={{ ...styles.categoryIcon, color: category.color }}>
                  {category.icon}
                </span>
                <span style={styles.categoryName}>{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>How MyTicket Works</h2>
        <p style={styles.sectionSubtitle}>
          Simple steps to secure your spot at any event
        </p>

        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔍</div>
            <h3 style={styles.featureTitle}>Find Your Event</h3>
            <p style={styles.featureDescription}>
              Browse through thousands of events or use our search to find
              exactly what you're looking for.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🎟️</div>
            <h3 style={styles.featureTitle}>Book Your Tickets</h3>
            <p style={styles.featureDescription}>
              Select your preferred seats and securely purchase tickets in just
              a few clicks.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📱</div>
            <h3 style={styles.featureTitle}>Get Mobile Tickets</h3>
            <p style={styles.featureDescription}>
              Receive your tickets digitally - no printing required. Just show
              your phone at the gate.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ ...styles.section, ...styles.testimonialSection }}>
        <h2 style={styles.sectionTitle}>What People Say</h2>

        <div style={styles.testimonialGrid}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} style={styles.testimonialCard}>
              <p style={styles.testimonialQuote}>"{testimonial.quote}"</p>
              <p style={styles.testimonialAuthor}>{testimonial.author}</p>
              <p style={styles.testimonialRole}>{testimonial.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ ...styles.section, ...styles.ctaSection }}>
        <div style={styles.ctaSectionContent}>
          <h2 style={styles.ctaTitle}>
            Ready to Experience Something Amazing?
          </h2>
          <p style={styles.ctaDescription}>
            Join thousands of event-goers and discover your next unforgettable
            experience.
          </p>
          <Link to="/events" style={styles.ctaButtonWhite}>
            Find Events Now
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
