import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";
import EventCard from "./components/events/EventCard"; // Import EventCard component

export default function LandingPage() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window resize for better responsiveness
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Helper for responsive values
  const responsive = useCallback(
    (mobileValue, desktopValue) => {
      return windowWidth <= 768 ? mobileValue : desktopValue;
    },
    [windowWidth]
  );

  // Define global styles for consistency
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: responsive("2rem 1rem", "3rem 1.5rem"),
    },
    sectionTitle: {
      fontSize: responsive("1.75rem", "2rem"),
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "0.75rem",
      color: "#222", // Improved contrast
    },
    sectionSubtitle: {
      textAlign: "center",
      color: "#444", // Darker color for better readability (was #666)
      marginBottom: responsive("1.5rem", "2rem"),
      maxWidth: "700px",
      marginLeft: "auto",
      marginRight: "auto",
      fontSize: responsive("0.95rem", "1rem"),
    },
    grid: {
      display: "grid",
      gap: "1.25rem",
      gridTemplateColumns: responsive(
        "1fr",
        windowWidth < 992 ? "repeat(2, 1fr)" : "repeat(4, 1fr)"
      ),
    },
    primaryButton: {
      backgroundColor: "#ff4d4d",
      color: "white",
      textDecoration: "none",
      padding: "0.75rem 1.25rem",
      borderRadius: "4px",
      fontWeight: "600",
      display: "inline-block",
      transition: "background-color 0.2s",
    },
    secondaryButton: {
      backgroundColor: "transparent",
      color: "white",
      textDecoration: "none",
      padding: "0.75rem 1.25rem",
      borderRadius: "4px",
      fontWeight: "600",
      border: "1px solid white",
      display: responsive("block", "inline-block"),
      marginLeft: responsive(0, "1rem"),
      marginTop: responsive("0.75rem", 0),
      width: responsive("fit-content", "auto"),
      transition: "background-color 0.2s",
    },
    centeredContent: {
      textAlign: "center",
      marginTop: "2rem",
    },
    featureIcon: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.5rem",
      marginBottom: "1.25rem",
      backgroundColor: "rgba(255, 77, 77, 0.15)", // Better contrast
      color: "#e63939", // Darker for better visibility
    },
  };

  // Simulated data loading with event properties expected by EventCard
  useEffect(() => {
    const timer = setTimeout(() => {
      setUpcomingEvents([
        {
          _id: "1", // Added _id for EventCard compatibility
          id: "1",
          title: "Summer Music Festival",
          image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
          date: "2025-08-20T15:00:00", // ISO format for formatDate function
          location: "Central Park, New York",
          ticketPrice: 75, // Changed from price to ticketPrice
          category: "Music",
          totalTickets: 1000, // Added for EventCard's ticket availability
          bookedTickets: 650, // Added for EventCard's availability indicators
        },
        {
          _id: "2",
          id: "2",
          title: "Tech Conference 2025",
          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
          date: "2025-09-15T09:00:00",
          location: "Convention Center, San Francisco",
          ticketPrice: 120,
          category: "Technology",
          totalTickets: 2000,
          bookedTickets: 1850, // High booking to show "selling fast"
        },
        {
          _id: "3",
          id: "3",
          title: "Basketball Championship",
          image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a",
          date: "2025-10-05T19:30:00",
          location: "Sports Arena, Los Angeles",
          ticketPrice: 60,
          category: "Sports",
          totalTickets: 5000,
          bookedTickets: 2500,
        },
        {
          _id: "4",
          id: "4",
          title: "Broadway Musical Night",
          image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf",
          date: "2025-11-12T20:00:00",
          location: "Broadway Theater, New York",
          ticketPrice: 95,
          category: "Arts",
          totalTickets: 800,
          bookedTickets: 800, // Sold out example
        },
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
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

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          background:
            "linear-gradient(rgba(18, 21, 31, 0.8), rgba(42, 45, 62, 0.8)), url('https://images.unsplash.com/photo-1540039155733-5bb30b53aa14')", // Darker overlay for better text contrast
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          padding: 0,
          height: responsive("450px", "600px"),
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1.5rem",
            width: "100%",
          }}
        >
          <h1
            style={{
              fontSize: responsive("2.2rem", "3rem"),
              fontWeight: "bold",
              marginBottom: "1.5rem",
              lineHeight: 1.2,
              textShadow: "0 1px 3px rgba(0,0,0,0.3)", // Added text shadow for better readability
            }}
          >
            Discover Events That Move You
          </h1>
          <p
            style={{
              fontSize: responsive("1.1rem", "1.2rem"),
              marginBottom: "2rem",
              maxWidth: "600px",
              fontWeight: "300",
              lineHeight: 1.5,
              textShadow: "0 1px 2px rgba(0,0,0,0.2)", // Added text shadow for better readability
            }}
          >
            From electrifying concerts to thrilling sports events, find and book
            tickets to the experiences you love.
          </p>
          <div>
            <Link
              to="/events"
              style={{
                ...styles.primaryButton,
                fontSize: responsive("0.95rem", "1rem"),
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e63939";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ff4d4d";
              }}
            >
              Explore Events
            </Link>
            <Link
              to="#"
              style={{
                ...styles.secondaryButton,
                fontSize: responsive("0.95rem", "1rem"),
                marginLeft: "1rem",
              }}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("how-it-works");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              How It Works
            </Link>
            <Link
              to="#"
              style={{
                ...styles.secondaryButton,
                fontSize: responsive("0.95rem", "1rem"),
                marginLeft: "1rem",
              }}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("about-us");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events Section - Now using EventCard Component */}
      <section style={styles.container}>
        <h2 style={styles.sectionTitle}>Upcoming Events</h2>
        <p style={styles.sectionSubtitle}>
          Discover the hottest tickets for events happening near you
        </p>

        {isLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              fontSize: "1.1rem",
              color: "#444", // Darker color for better readability
              backgroundColor: "rgba(0,0,0,0.03)", // Slightly darker for contrast
              borderRadius: "8px",
            }}
          >
            Loading events...
          </div>
        ) : (
          <div style={styles.grid}>
            {upcomingEvents.map((event) => (
              <div key={event.id}>
                {/* Using EventCard component instead of custom card */}
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}

        <div style={styles.centeredContent}>
          <Link
            to="/events"
            style={styles.primaryButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e63939";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ff4d4d";
            }}
          >
            View All Events
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section
        style={{
          backgroundColor: "#f0f2f5", // Slightly darker background for better contrast (was #f8f9fa)
          padding: responsive("2rem 0", "3rem 0"),
          width: "100%",
        }}
      >
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Browse by Category</h2>
          <p style={styles.sectionSubtitle}>
            Find events that match your interests
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: responsive(
                "repeat(2, 1fr)",
                windowWidth < 992 ? "repeat(3, 1fr)" : "repeat(6, 1fr)"
              ),
              gap: responsive("0.75rem", "1.25rem"),
            }}
          >
            {categories.map((category, index) => (
              <Link
                to={`/events/category/${category.name.toLowerCase()}`}
                key={index}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: responsive("1rem", "1.25rem"),
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 12px rgba(0, 0, 0, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <span
                    style={{
                      fontSize: responsive("1.8rem", "2.2rem"),
                      marginBottom: "0.75rem",
                      color: category.color,
                    }}
                  >
                    {category.icon}
                  </span>
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#222", // Darker color (was #333)
                      fontSize: responsive("0.85rem", "0.9rem"),
                      textAlign: "center",
                    }}
                  >
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={styles.container}>
        <h2 style={styles.sectionTitle}>How MyTicket Works</h2>
        <p style={styles.sectionSubtitle}>
          Simple steps to secure your spot at any event
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: responsive(
              "1fr",
              windowWidth < 992 ? "repeat(2, 1fr)" : "repeat(3, 1fr)"
            ),
            gap: responsive("1.5rem", "2rem"),
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "1.75rem",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              height: "100%",
            }}
          >
            <div style={styles.featureIcon}>🔍</div>
            <h3
              style={{
                fontSize: "1.2rem",
                marginBottom: "0.75rem",
                fontWeight: "600",
                color: "#222", // Darker for better readability
              }}
            >
              Find Your Event
            </h3>
            <p style={{ color: "#444", lineHeight: 1.5 }}>
              {" "}
              {/* Darker for better readability (was #666) */}
              Browse through thousands of events or use our search to find
              exactly what you're looking for.
            </p>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "1.75rem",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              height: "100%",
            }}
          >
            <div style={styles.featureIcon}>🎟️</div>
            <h3
              style={{
                fontSize: "1.2rem",
                marginBottom: "0.75rem",
                fontWeight: "600",
                color: "#222", // Darker for better readability
              }}
            >
              Book Your Tickets
            </h3>
            <p style={{ color: "#444", lineHeight: 1.5 }}>
              {" "}
              {/* Darker for better readability (was #666) */}
              Select your preferred seats and securely purchase tickets in just
              a few clicks.
            </p>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "1.75rem",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              height: "100%",
            }}
          >
            <div style={styles.featureIcon}>📱</div>
            <h3
              style={{
                fontSize: "1.2rem",
                marginBottom: "0.75rem",
                fontWeight: "600",
                color: "#222", // Darker for better readability
              }}
            >
              Get Mobile Tickets
            </h3>
            <p style={{ color: "#444", lineHeight: 1.5 }}>
              {" "}
              {/* Darker for better readability (was #666) */}
              Receive your tickets digitally - no printing required. Just show
              your phone at the gate.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        style={{
          backgroundColor: "#f0f2f5", // Slightly darker background for better contrast (was #f8f9fa)
          padding: responsive("2rem 0", "3rem 0"),
          width: "100%",
        }}
      >
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>What People Say</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: responsive(
                "1fr",
                windowWidth < 992 ? "repeat(2, 1fr)" : "repeat(3, 1fr)"
              ),
              gap: responsive("1.25rem", "2rem"),
              marginTop: "1.5rem",
            }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                style={{
                  backgroundColor: "white",
                  padding: "1.75rem",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  height: "100%",
                }}
              >
                <p
                  style={{
                    fontStyle: "italic",
                    marginBottom: "1.25rem",
                    color: "#444", // Darker for better readability (was #555)
                    lineHeight: 1.5,
                    position: "relative",
                    paddingLeft: "0.75rem",
                    borderLeft: "3px solid rgba(230, 57, 57, 0.6)", // Made border darker and more opaque
                  }}
                >
                  "{testimonial.quote}"
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "auto",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "#e6e6e6", // Slightly darker for better contrast (was #f0f0f0)
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "12px",
                      color: "#333", // Darker for better readability (was #555)
                      fontWeight: "bold",
                    }}
                  >
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontWeight: "600", margin: 0, color: "#222" }}>
                      {" "}
                      {/* Added color for consistency */}
                      {testimonial.author}
                    </p>
                    <p
                      style={{ color: "#555", fontSize: "0.85rem", margin: 0 }} // Darker for better readability (was #777)
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          backgroundColor: "#ff4d4d",
          color: "white",
          textAlign: "center",
          padding: responsive("3rem 1rem", "4rem 1.5rem"),
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: responsive("1.75rem", "2rem"),
              marginBottom: responsive("0.75rem", "1rem"),
              color: "white",
              fontWeight: "bold",
              textShadow: "0 1px 2px rgba(0,0,0,0.1)", // Added text shadow for better readability
            }}
          >
            Ready to Experience Something Amazing?
          </h2>
          <p
            style={{
              marginBottom: responsive("1.5rem", "2rem"),
              opacity: "1", // Full opacity for better readability (was 0.95)
              fontSize: responsive("0.95rem", "1rem"),
              lineHeight: 1.6,
              maxWidth: "500px",
              margin: "0 auto 2rem",
              textShadow: "0 1px 1px rgba(0,0,0,0.1)", // Added text shadow for better readability
            }}
          >
            Join thousands of event-goers and discover your next unforgettable
            experience.
          </p>
          <Link
            to="/events"
            style={{
              backgroundColor: "white",
              color: "#e63939", // Darker red for better contrast (was #ff4d4d)
              textDecoration: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "4px",
              fontWeight: "600",
              display: "inline-block",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
            }}
          >
            Find Events Now
          </Link>
        </div>
      </section>

      <Footer />

      {/* About Us Section - Newly Added */}
      <section id="about-us" style={styles.container}>
        <h2 style={styles.sectionTitle}>About Us</h2>
        <p style={styles.sectionSubtitle}>
          Welcome to MyTicket, your go-to platform for reserving tickets seamlessly.
          We simplify the ticket reservation process so you can enjoy your favorite events,
          whether it’s a concert, sports event, theater performance, or conference.
        </p>
        <p style={{ textAlign: "center", fontSize: responsive("1rem", "1.1rem"), color: "#444", maxWidth: "800px", margin: "0 auto" }}>
          Discover, select, and reserve your tickets in just a few clicks with our secure and user-friendly system.
          Experience live events without the hassle – let MyTicket be your trusted partner in creating amazing moments.
        </p>
      </section>
    </>
  );
}
