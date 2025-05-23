import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import { formatDate } from "../../utils/formatDate";

const EventDetails = ({ showToast }) => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookForm, setShowBookForm] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Theme colors for consistent styling
  const colors = {
    primary: "#6366f1",
    primaryDark: "#4f46e5",
    accent: "#a855f7",
    text: "#1f2937",
    textSecondary: "#4b5563",
    border: "#e5e7eb",
    background: "#ffffff",
    error: "#ef4444",
    warning: "#f59e0b",
    success: "#10b981",
    shadow: "rgba(0, 0, 0, 0.1)",
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  // Handle booking tickets
  const handleBookTickets = async () => {
    if (!user || !event) return;

    try {
      setBookingLoading(true);

      const response = await api.post("/bookings", {
        eventId: event._id,
        tickets: ticketQuantity,
      });

      // Update local event data to reflect the new ticket count
      const updatedEvent = { ...event };
      updatedEvent.bookedTickets = (event.bookedTickets || 0) + ticketQuantity;
      setEvent(updatedEvent);

      // Close form and show success message
      setShowBookForm(false);
      showToast(
        `Successfully booked ${ticketQuantity} ticket${
          ticketQuantity > 1 ? "s" : ""
        }!`,
        "success"
      );
    } catch (err) {
      console.error("Error booking tickets:", err);
      showToast(
        err.response?.data?.error ||
          "Failed to book tickets. Please try again.",
        "error"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // Render ticket quantity selector modal
  const renderBookingModal = () => {
    // Calculate maximum tickets a user can book (either available tickets or a limit of 10)
    const maxTickets = Math.min(availableTickets, 10);

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: colors.background,
            borderRadius: "8px",
            padding: "24px",
            width: "90%",
            maxWidth: "400px",
            boxShadow: `0 4px 12px ${colors.shadow}`,
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "16px",
              color: colors.text,
            }}
          >
            Book Tickets
          </h3>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="ticketQuantity"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: colors.textSecondary,
              }}
            >
              How many tickets would you like to book?
            </label>

            <select
              id="ticketQuantity"
              value={ticketQuantity}
              onChange={(e) => setTicketQuantity(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "6px",
                border: `1px solid ${colors.border}`,
                fontSize: "16px",
                color: colors.text,
                backgroundColor: colors.background,
                appearance: "none",
              }}
            >
              {[...Array(maxTickets)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              padding: "12px 0",
              borderTop: `1px solid ${colors.border}`,
              borderBottom: `1px solid ${colors.border}`,
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: colors.textSecondary }}>Ticket price:</span>
              <span style={{ color: colors.text, fontWeight: "500" }}>
                ${event.ticketPrice}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: colors.textSecondary }}>Total price:</span>
              <span style={{ color: colors.text, fontWeight: "600" }}>
                ${(event.ticketPrice * ticketQuantity).toFixed(2)}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button
              onClick={() => setShowBookForm(false)}
              disabled={bookingLoading}
              style={{
                padding: "10px 16px",
                backgroundColor: "transparent",
                border: `1px solid ${colors.border}`,
                borderRadius: "6px",
                color: colors.text,
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleBookTickets}
              disabled={bookingLoading}
              style={{
                padding: "10px 20px",
                backgroundColor: colors.primary,
                border: "none",
                borderRadius: "6px",
                color: "white",
                fontSize: "14px",
                fontWeight: "500",
                cursor: bookingLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {bookingLoading ? (
                <>
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      border: "2px solid rgba(255,255,255,0.2)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      marginRight: "8px",
                    }}
                  ></div>
                  Processing...
                </>
              ) : (
                `Book ${
                  ticketQuantity > 1 ? ticketQuantity + " tickets" : "1 ticket"
                }`
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "80px 0",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                border: "4px solid rgba(99, 102, 241, 0.1)",
                borderLeftColor: colors.primary,
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "inline-block",
                animation: "spin 1s linear infinite",
              }}
            />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <p style={{ marginTop: "16px", color: colors.textSecondary }}>
              Loading event details...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div
          style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 16px" }}
        >
          <div
            style={{
              backgroundColor: "#fef2f2",
              color: colors.error,
              padding: "16px",
              borderRadius: "8px",
              border: `1px solid ${colors.error}30`,
            }}
          >
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <div
          style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 16px" }}
        >
          <div
            style={{
              backgroundColor: "#fef2f2",
              color: colors.error,
              padding: "16px",
              borderRadius: "8px",
              border: `1px solid ${colors.error}30`,
            }}
          >
            <p style={{ margin: 0 }}>Event not found</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Calculate ticket availability
  const totalTickets = event.totalTickets || 0;
  const bookedTickets = event.bookedTickets || 0;
  const availableTickets = totalTickets - bookedTickets;
  const isAvailable = availableTickets > 0;
  const soldPercentage =
    totalTickets > 0 ? Math.round((bookedTickets / totalTickets) * 100) : 0;

  // Get availability color
  const getAvailabilityColor = () => {
    if (!isAvailable) return colors.error;
    if (availableTickets < totalTickets * 0.1) return colors.warning;
    return colors.success;
  };

  return (
    <>
      <Navbar />

      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 16px" }}
      >
        <div
          style={{
            border: `1px solid ${colors.border}`,
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: colors.background,
            boxShadow: `0 4px 6px ${colors.shadow}`,
          }}
        >
          {/* Event header/image */}
          <div
            style={{
              height: "300px",
              width: "100%",
              position: "relative",
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${
                event.image || "https://source.unsplash.com/random?event"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "flex-end",
              padding: "24px",
            }}
          >
            <div>
              <div
                style={{
                  textTransform: "uppercase",
                  fontSize: "14px",
                  letterSpacing: "1px",
                  color: "white",
                  opacity: "0.8",
                  marginBottom: "8px",
                }}
              >
                {event.category}
              </div>
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "white",
                  margin: "0 0 12px 0",
                }}
              >
                {event.title}
              </h1>
              <span
                style={{
                  backgroundColor: isAvailable ? colors.success : colors.error,
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {isAvailable ? "Tickets Available" : "Sold Out"}
              </span>
            </div>
          </div>

          {/* Event content */}
          <div
            style={{
              display: "flex",
              flexDirection: window.innerWidth <= 768 ? "column" : "row",
              padding: "24px",
            }}
          >
            {/* Left column - Event details */}
            <div
              style={{
                flex: "2",
                paddingRight: window.innerWidth <= 768 ? "0" : "24px",
                marginBottom: window.innerWidth <= 768 ? "24px" : "0",
              }}
            >
              <h2
                style={{
                  fontSize: "22px",
                  marginBottom: "16px",
                  color: colors.text,
                  fontWeight: "600",
                }}
              >
                About this event
              </h2>
              <p
                style={{
                  color: colors.textSecondary,
                  lineHeight: "1.6",
                  marginBottom: "24px",
                }}
              >
                {event.description || "No description provided for this event."}
              </p>

              <h2
                style={{
                  fontSize: "22px",
                  marginBottom: "16px",
                  color: colors.text,
                  fontWeight: "600",
                }}
              >
                Event Details
              </h2>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <span style={{ marginRight: "12px", fontSize: "18px" }}>
                  📅
                </span>
                <span style={{ color: colors.textSecondary }}>
                  {formatDate(event.date)}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <span style={{ marginRight: "12px", fontSize: "18px" }}>
                  📍
                </span>
                <span style={{ color: colors.textSecondary }}>
                  {event.location}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <span style={{ marginRight: "12px", fontSize: "18px" }}>
                  💰
                </span>
                <span style={{ color: colors.textSecondary }}>
                  ${event.ticketPrice}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <span style={{ marginRight: "12px", fontSize: "18px" }}>
                  🎟️
                </span>
                <span
                  style={{
                    color: getAvailabilityColor(),
                    fontWeight:
                      isAvailable && availableTickets < totalTickets * 0.1
                        ? "bold"
                        : "normal",
                  }}
                >
                  {!isAvailable
                    ? "Sold Out"
                    : `${availableTickets} tickets available`}
                </span>
              </div>
            </div>

            {/* Right column - Ticket summary */}
            <div style={{ flex: "1" }}>
              <div
                style={{
                  backgroundColor: colors.background,
                  boxShadow: `0 2px 4px ${colors.shadow}`,
                  borderRadius: "8px",
                  padding: "24px",
                  border: `1px solid ${colors.border}`,
                }}
              >
                <h3
                  style={{
                    fontSize: "20px",
                    marginTop: "0",
                    marginBottom: "16px",
                    color: colors.text,
                    fontWeight: "600",
                  }}
                >
                  Ticket Summary
                </h3>

                <div style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      color: colors.textSecondary,
                      marginBottom: "4px",
                    }}
                  >
                    Price
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      color: colors.text,
                    }}
                  >
                    ${event.ticketPrice}
                  </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      color: colors.textSecondary,
                      marginBottom: "4px",
                    }}
                  >
                    Availability
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: getAvailabilityColor(),
                      }}
                    >
                      {isAvailable
                        ? `${availableTickets} tickets left`
                        : "SOLD OUT"}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: colors.textSecondary,
                      }}
                    >
                      {soldPercentage}% sold
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      marginTop: "8px",
                      backgroundColor: "#e5e7eb",
                      height: "8px",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${soldPercentage}%`,
                        height: "100%",
                        backgroundColor: getAvailabilityColor(),
                        transition: "width 1s ease-in-out",
                      }}
                    />
                  </div>

                  {/* Urgency indicator */}
                  {isAvailable && availableTickets <= totalTickets * 0.1 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "12px",
                        fontSize: "14px",
                        color: colors.warning,
                      }}
                    >
                      <span style={{ marginRight: "8px" }}>⚠️</span>
                      Selling fast! Don't miss out.
                    </div>
                  )}
                </div>

                {/* Booking button or login prompt */}
                {user ? (
                  <button
                    onClick={() => setShowBookForm(true)}
                    disabled={!isAvailable}
                    style={{
                      width: "100%",
                      backgroundColor: isAvailable ? colors.primary : "#cbd5e1",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "12px 24px",
                      fontSize: "16px",
                      fontWeight: "500",
                      cursor: isAvailable ? "pointer" : "not-allowed",
                      transition: "background-color 0.2s",
                      boxShadow: isAvailable
                        ? `0 2px 4px ${colors.shadow}`
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (isAvailable) {
                        e.target.style.backgroundColor = colors.primaryDark;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isAvailable) {
                        e.target.style.backgroundColor = colors.primary;
                      }
                    }}
                  >
                    {isAvailable ? "Book Tickets" : "Sold Out"}
                  </button>
                ) : (
                  <a
                    href="/login"
                    style={{
                      display: "block",
                      textAlign: "center",
                      width: "100%",
                      backgroundColor: "transparent",
                      color: colors.primary,
                      border: `1px solid ${colors.primary}`,
                      borderRadius: "6px",
                      padding: "12px 24px",
                      fontSize: "16px",
                      fontWeight: "500",
                      cursor: "pointer",
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = `${colors.primary}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    Log in to book tickets
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookForm && renderBookingModal()}

      <Footer />
    </>
  );
};

export default EventDetails;
