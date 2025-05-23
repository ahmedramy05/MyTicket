import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

// Import shared components
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import Loader from "../shared/Loader";
import Toast from "../shared/Toast";

// Import EventCard component
import EventCard from "./EventCard";

const EventList = () => {
  // Core state
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Toast notification state
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "info",
  });

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [sortBy, setSortBy] = useState("date");
  const [page, setPage] = useState(1);
  const [eventsPerPage] = useState(8);

  const colors = {
    primary: "#6366f1",
    primaryHover: "#4f46e5",
    accent: "#a855f7",
    background: "#f8fafc",
    lightBg: "#f9fafb",
    text: "#1f2937",
    textSecondary: "#4b5563",
    border: "#e5e7eb",
    cardBg: "#ffffff",
    error: "#ef4444",
    errorLight: "#fee2e2",
    disabled: "#cbd5e1",
    shadow: "rgba(0, 0, 0, 0.1)",
  };

  const categories = [
    "all",
    "Music",
    "Sports",
    "Arts",
    "Technology",
    "Business",
    "Food",
    "Other",
  ];

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      setIsMobile(newIsMobile);
      if (newIsMobile && !isMobile) setShowFilters(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get("/events");
        setEvents(response.data);
        setFilteredEvents(response.data);

        // Show success toast when events load successfully
        if (response.data.length > 0) {
          setToast({
            visible: true,
            message: `Successfully loaded ${response.data.length} events`,
            type: "success",
          });
        }
      } catch (err) {
        setError("Failed to load events. Please try again later.");

        // Show error toast
        setToast({
          visible: true,
          message: "Failed to load events. Please try again later.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...events];

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (event) =>
          (event.title && event.title.toLowerCase().includes(query)) ||
          (event.location && event.location.toLowerCase().includes(query)) ||
          (event.description && event.description.toLowerCase().includes(query))
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((event) => event.category === categoryFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case "date":
        result.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
        break;
      case "price-asc":
        result.sort((a, b) => (a.ticketPrice || 0) - (b.ticketPrice || 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.ticketPrice || 0) - (a.ticketPrice || 0));
        break;
      default:
        break;
    }

    setFilteredEvents(result);
    setPage(1);
  }, [searchQuery, categoryFilter, sortBy, events]);

  // Helper functions
  const formatDate = useCallback(
    (date) =>
      !date
        ? "TBD"
        : new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
    []
  );

  const getEmoji = useCallback(
    (cat) =>
      ({
        Music: "🎵",
        Sports: "🏆",
        Arts: "🎭",
        Technology: "💻",
        Business: "💼",
        Food: "🍽️",
        Other: "✨",
      }[cat] || "✨"),
    []
  );

  // Calculate current page events
  const currentEvents = useMemo(() => {
    const indexOfLastEvent = page * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    return filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  }, [filteredEvents, page, eventsPerPage]);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setCategoryFilter("all");
    setSortBy("date");

    // Show toast notification when filters are reset
    setToast({
      visible: true,
      message: "All filters have been reset",
      type: "info",
    });
  }, []);

  // Handle toast close
  const handleToastClose = () => {
    setToast({ ...toast, visible: false });
  };

  // Style objects for cleaner JSX
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "1rem",
      backgroundColor: colors.background,
      minHeight: "calc(100vh - 160px)", // Account for navbar and footer
    },
    hero: {
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
      padding: isMobile ? "1.5rem 1rem" : "2rem",
      borderRadius: "12px",
      marginBottom: "2rem",
      color: "white",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
      boxShadow: `0 4px 12px ${colors.shadow}`,
    },
    heroPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.1,
      backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
      backgroundSize: "20px 20px",
    },
    heroTitle: {
      fontSize: isMobile ? "2rem" : "2.5rem",
      fontWeight: "bold",
      marginBottom: "0.75rem",
      textShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    filterSection: {
      backgroundColor: colors.cardBg,
      padding: isMobile ? "1.25rem" : "1.5rem",
      borderRadius: "10px",
      marginBottom: "1.5rem",
      boxShadow: `0 1px 3px ${colors.shadow}`,
    },
    filterBar: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "0.75rem" : "1rem",
    },
    searchWrapper: {
      position: "relative",
      flex: 1,
      minWidth: 0,
    },
    searchIcon: {
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3af",
      pointerEvents: "none",
      zIndex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    searchInput: {
      width: "100%",
      height: "44px",
      paddingLeft: "2.5rem",
      paddingRight: "2.5rem",
      paddingTop: "0",
      paddingBottom: "0",
      border: `1px solid ${colors.border}`,
      borderRadius: "8px",
      fontSize: "1rem",
      backgroundColor: "white",
      boxSizing: "border-box",
      outline: "none",
      transition: "border-color 0.2s, box-shadow 0.2s",
    },
    filterButton: {
      height: "44px",
      padding: "0 1.5rem",
      backgroundColor: showFilters ? colors.primary : "white",
      color: showFilters ? "white" : colors.text,
      border: showFilters ? "none" : `1px solid ${colors.border}`,
      borderRadius: "8px",
      fontSize: "1rem",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      width: isMobile ? "100%" : "auto",
      flexShrink: 0,
      whiteSpace: "nowrap",
      fontWeight: "500",
      transition: "background-color 0.2s, transform 0.1s, box-shadow 0.2s",
      boxShadow: showFilters ? `0 2px 4px ${colors.shadow}` : "none",
    },
    filterPanel: {
      display: showFilters ? "block" : "none",
      marginTop: "1.5rem",
      padding: "1.5rem",
      backgroundColor: colors.lightBg,
      borderRadius: "8px",
      transition: "all 0.3s ease",
    },
    filterGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
      gap: "1rem",
    },
    eventGrid: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : window.innerWidth < 640
        ? "1fr"
        : window.innerWidth < 992
        ? "repeat(2, 1fr)"
        : window.innerWidth < 1100
        ? "repeat(3, 1fr)"
        : "repeat(4, 1fr)",
      gap: "1rem",
    },
    pagination: {
      marginTop: "2.5rem",
      marginBottom: "1.5rem",
      display: "flex",
      justifyContent: "center",
      gap: "0.3rem",
    },
    emptyState: {
      textAlign: "center",
      padding: "3rem",
      backgroundColor: colors.lightBg,
      borderRadius: "8px",
      marginTop: "1.5rem",
      boxShadow: `0 1px 3px ${colors.shadow}`,
    },
    resetButton: {
      backgroundColor: colors.primary,
      color: "white",
      border: "none",
      padding: "0.75rem 2rem",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "500",
      transition: "background-color 0.2s, transform 0.1s",
      boxShadow: `0 2px 4px ${colors.shadow}`,
    },
    mainContent: {
      minHeight: "70vh", // Ensure there's always content space
    },
  };

  return (
    <>
      {/* Navbar component */}
      <Navbar />

      {/* Toast notification */}
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleToastClose}
        />
      )}

      <div style={styles.container}>
        {/* Hero section */}
        <div style={styles.hero}>
          <div style={styles.heroPattern}></div>
          <h1 style={styles.heroTitle}>Discover Amazing Events</h1>
          <p
            style={{
              fontSize: "1.1rem",
              marginBottom: "1.5rem",
              maxWidth: "600px",
              margin: "0 auto 1.5rem",
              opacity: 0.9,
            }}
          >
            Find and book unique experiences that match your interests
          </p>

          {/* Mobile filter toggle */}
          {isMobile && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                width: "100%",
                height: "44px",
                padding: "0.75rem",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "8px",
                color: "white",
                cursor: "pointer",
                backdropFilter: "blur(4px)",
                fontWeight: "500",
              }}
            >
              {showFilters ? "Hide Filters ▲" : "Show Filters ▼"}
            </button>
          )}
        </div>

        {/* Search and filters */}
        <div style={styles.filterSection}>
          <div style={styles.filterBar}>
            {/* Search input */}
            <div style={styles.searchWrapper}>
              <div style={styles.searchIcon}>🔍</div>
              <input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
                aria-label="Search events"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                    display: "flex",
                    alignItems: "center",
                  }}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filters button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={styles.filterButton}
              aria-expanded={showFilters}
            >
              <span>🔍</span>
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Filter panel */}
          <div id="filter-panel" style={styles.filterPanel}>
            <div style={styles.filterGrid}>
              {/* Category filter */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    marginBottom: "0.5rem",
                    color: colors.text,
                  }}
                  htmlFor="category-filter"
                >
                  Category
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    id="category-filter"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{
                      width: "100%",
                      height: "40px",
                      paddingLeft: "0.75rem",
                      paddingRight: "2rem",
                      border: `1px solid ${colors.border}`,
                      borderRadius: "6px",
                      backgroundColor: "white",
                      appearance: "none",
                      cursor: "pointer",
                      fontSize: "0.95rem",
                    }}
                  >
                    <option value="all">All Categories</option>
                    {categories
                      .filter((cat) => cat !== "all")
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {getEmoji(cat)} {cat}
                        </option>
                      ))}
                  </select>
                  <div
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  >
                    ▼
                  </div>
                </div>
              </div>

              {/* Sort by filter */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    marginBottom: "0.5rem",
                    color: colors.text,
                  }}
                  htmlFor="sort-filter"
                >
                  Sort By
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    id="sort-filter"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      width: "100%",
                      height: "40px",
                      paddingLeft: "0.75rem",
                      paddingRight: "2rem",
                      border: `1px solid ${colors.border}`,
                      borderRadius: "6px",
                      backgroundColor: "white",
                      appearance: "none",
                      fontSize: "0.95rem",
                    }}
                  >
                    <option value="date">Date: Upcoming First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                  <div
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  >
                    ▼
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "0.75rem",
                }}
              >
                <button
                  onClick={handleResetFilters}
                  style={{
                    flex: 1,
                    height: "40px",
                    padding: "0.65rem",
                    backgroundColor: "white",
                    border: `1px solid ${colors.border}`,
                    borderRadius: "6px",
                    color: colors.text,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  Reset All
                </button>
                <button
                  onClick={() => isMobile && setShowFilters(false)}
                  style={{
                    flex: 1,
                    height: "40px",
                    padding: "0.65rem",
                    backgroundColor: colors.primary,
                    border: "none",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Active filters */}
          {(searchQuery || categoryFilter !== "all" || sortBy !== "date") && (
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: "0.85rem", color: colors.textSecondary }}
              >
                Active filters:
              </span>

              {searchQuery && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    borderRadius: "20px",
                    padding: "0.3rem 0.75rem",
                    fontSize: "0.875rem",
                    color: colors.primary,
                    height: "28px",
                  }}
                >
                  <span>Search: {searchQuery}</span>
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{
                      marginLeft: "0.5rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    aria-label="Remove search filter"
                  >
                    ✕
                  </button>
                </div>
              )}

              {categoryFilter !== "all" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    borderRadius: "20px",
                    padding: "0.3rem 0.75rem",
                    fontSize: "0.875rem",
                    color: colors.primary,
                    height: "28px",
                  }}
                >
                  <span>
                    {getEmoji(categoryFilter)} {categoryFilter}
                  </span>
                  <button
                    onClick={() => setCategoryFilter("all")}
                    style={{
                      marginLeft: "0.5rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    aria-label="Remove category filter"
                  >
                    ✕
                  </button>
                </div>
              )}

              {sortBy !== "date" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    borderRadius: "20px",
                    padding: "0.3rem 0.75rem",
                    fontSize: "0.875rem",
                    color: colors.primary,
                    height: "28px",
                  }}
                >
                  <span>
                    Sort:{" "}
                    {sortBy === "price-asc"
                      ? "Price (Low to High)"
                      : "Price (High to Low)"}
                  </span>
                  <button
                    onClick={() => setSortBy("date")}
                    style={{
                      marginLeft: "0.5rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    aria-label="Remove sort filter"
                  >
                    ✕
                  </button>
                </div>
              )}

              <button
                onClick={handleResetFilters}
                style={{
                  color: colors.primary,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                  textDecoration: "underline",
                }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results summary */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
              color: colors.textSecondary,
              fontSize: "0.875rem",
            }}
          >
            <p>
              Showing <strong>{currentEvents.length}</strong> of{" "}
              <strong>{filteredEvents.length}</strong> events
            </p>
            {filteredEvents.length > eventsPerPage && (
              <p>
                Page {page} of{" "}
                {Math.ceil(filteredEvents.length / eventsPerPage)}
              </p>
            )}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: colors.errorLight,
              borderRadius: "8px",
              marginBottom: "1.5rem",
              color: colors.error,
              display: "flex",
              alignItems: "center",
              borderLeft: `4px solid ${colors.error}`,
            }}
            role="alert"
          >
            <span style={{ marginRight: "0.75rem", fontSize: "1.25rem" }}>
              ⚠️
            </span>
            <div style={{ flex: 1 }}>{error}</div>
            <button
              onClick={() => {
                window.location.reload();
                setToast({
                  visible: true,
                  message: "Refreshing events...",
                  type: "info",
                });
              }}
              style={{
                marginLeft: "1rem",
                color: colors.error,
                backgroundColor: "white",
                border: `1px solid ${colors.error}`,
                borderRadius: "4px",
                padding: "0.25rem 0.75rem",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Content area */}
        <div style={styles.mainContent}>
          {loading ? (
            <Loader />
          ) : currentEvents.length > 0 ? (
            <>
              {/* Event grid - Now using EventCard component */}
              <div style={styles.eventGrid}>
                {currentEvents.map((event) => (
                  <div key={event._id || event.id}>
                    <EventCard
                      event={{
                        ...event,
                        _id: event._id || event.id, // Ensure _id is available
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Simple pagination */}
              {filteredEvents.length > eventsPerPage && (
                <div style={styles.pagination} role="navigation">
                  <button
                    onClick={() => page > 1 && setPage(page - 1)}
                    disabled={page === 1}
                    style={{
                      padding: "0.5rem 0.75rem",
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: "6px",
                      color: page === 1 ? colors.disabled : colors.text,
                      cursor: page === 1 ? "not-allowed" : "pointer",
                    }}
                  >
                    ◄
                  </button>

                  {Array.from({
                    length: Math.min(
                      5,
                      Math.ceil(filteredEvents.length / eventsPerPage)
                    ),
                  }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={i}
                        onClick={() => setPage(pageNum)}
                        style={{
                          padding: "0.5rem 0.75rem",
                          backgroundColor:
                            page === pageNum ? colors.primary : colors.cardBg,
                          border: `1px solid ${
                            page === pageNum ? colors.primary : colors.border
                          }`,
                          borderRadius: "6px",
                          color: page === pageNum ? "white" : colors.text,
                          fontWeight: page === pageNum ? "600" : "normal",
                          cursor: "pointer",
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      page < Math.ceil(filteredEvents.length / eventsPerPage) &&
                      setPage(page + 1)
                    }
                    disabled={
                      page === Math.ceil(filteredEvents.length / eventsPerPage)
                    }
                    style={{
                      padding: "0.5rem 0.75rem",
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: "6px",
                      color:
                        page ===
                        Math.ceil(filteredEvents.length / eventsPerPage)
                          ? colors.disabled
                          : colors.text,
                      cursor:
                        page ===
                        Math.ceil(filteredEvents.length / eventsPerPage)
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    ►
                  </button>
                </div>
              )}
            </>
          ) : (
            // No events found
            <div style={styles.emptyState}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📅</div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  fontWeight: "600",
                }}
              >
                No events found
              </h3>
              <p
                style={{
                  color: colors.textSecondary,
                  margin: "0 auto 2rem",
                  maxWidth: "500px",
                }}
              >
                We couldn't find any events matching your search criteria. Try
                adjusting your filters or try a different search term.
              </p>
              <button onClick={handleResetFilters} style={styles.resetButton}>
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EventList;
