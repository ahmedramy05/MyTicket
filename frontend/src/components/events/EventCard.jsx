import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";

const EventCard = ({ event, showStatus = false }) => {
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

  // Calculate ticket availability metrics
  const totalTickets = event.totalTickets || 0;
  const availableTickets = event.availableTickets || 0; // Use direct value from backend
  const bookedTickets = totalTickets - availableTickets; // Calculate booked tickets if needed
  const soldPercentage =
    totalTickets > 0 ? Math.round((bookedTickets / totalTickets) * 100) : 0;

  // Get availability status with appropriate coloring
  const getAvailabilityInfo = () => {
    if (availableTickets <= 0)
      return {
        label: "SOLD OUT",
        color: colors.error,
        progressColor: colors.error,
      };
    if (availableTickets <= totalTickets * 0.1)
      return {
        label: `SELLING FAST! Only ${availableTickets} left`,
        color: colors.warning,
        progressColor: colors.warning,
      };
    if (availableTickets <= totalTickets * 0.25)
      return {
        label: `Limited tickets: ${availableTickets} remaining`,
        color: colors.warning,
        progressColor: colors.warning,
      };
    return {
      label: `${availableTickets} tickets available`,
      color: colors.success,
      progressColor: colors.success,
    };
  };

  const availabilityInfo = getAvailabilityInfo();

  return (
    <div
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: "10px",
        overflow: "hidden",
        backgroundColor: colors.background,
        boxShadow: `0 2px 4px ${colors.shadow}`,
        transition: "transform 0.2s, box-shadow 0.2s",
        marginBottom: "16px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 10px 15px ${colors.shadow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = `0 2px 4px ${colors.shadow}`;
      }}
    >
      <Link
        to={`/events/${event._id}`}
        style={{
          textDecoration: "none",
          color: "inherit",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ position: "relative" }}>
          <img
            src={event.image || "https://source.unsplash.com/random?concert"}
            alt={event.title}
            style={{
              width: "100%",
              height: "180px",
              objectFit: "cover",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          />

          {availableTickets <= 0 && (
            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                backgroundColor: colors.error,
                color: "white",
                padding: "5px 12px",
                fontWeight: "bold",
                borderRadius: "4px",
                transform: "rotate(5deg)",
                boxShadow: `0 2px 4px ${colors.shadow}`,
              }}
            >
              SOLD OUT
            </div>
          )}
        </div>

        <div style={{ padding: "16px" }}>
          {showStatus && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "500",
                  backgroundColor:
                    event.status === "approved"
                      ? colors.success
                      : event.status === "pending"
                      ? colors.warning
                      : event.status === "declined"
                      ? colors.error
                      : "#cbd5e1",
                  color: "white",
                }}
              >
                {event.status}
              </span>
            </div>
          )}

          <h3
            style={{
              margin: "0 0 12px 0",
              color: colors.text,
              fontSize: "18px",
            }}
          >
            {event.title}
          </h3>

          <div
            style={{
              marginBottom: "16px",
              color: colors.textSecondary,
              fontSize: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <span style={{ marginRight: "8px" }}>📅</span>
              {formatDate(event.date)}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <span style={{ marginRight: "8px" }}>📍</span>
              {event.location}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ marginRight: "8px" }}>💰</span>${event.ticketPrice}
            </div>
          </div>

          {/* Ticket availability */}
          <div
            style={{
              backgroundColor:
                availableTickets <= 0
                  ? "#fee2e2"
                  : availableTickets <= totalTickets * 0.25
                  ? "#fef3c7"
                  : "#ecfdf5",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "16px",
              border: `1px solid ${availabilityInfo.color}25`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: availabilityInfo.color,
                  fontWeight:
                    availableTickets <= totalTickets * 0.25 ? "bold" : "normal",
                }}
              >
                <span style={{ marginRight: "8px" }}>🎟️</span>
                {availabilityInfo.label}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: colors.textSecondary,
                }}
              >
                {soldPercentage}% sold
              </div>
            </div>

            <div
              style={{
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
                  backgroundColor: availabilityInfo.progressColor,
                  transition: "width 1s ease-in-out",
                }}
              />
            </div>

            {availableTickets > 0 &&
              availableTickets <= totalTickets * 0.25 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "8px",
                    fontSize: "12px",
                    color: colors.textSecondary,
                  }}
                >
                  <span style={{ marginRight: "6px" }}>👥</span>
                  {Math.min(availableTickets * 2 + 3, 20)} people viewing this
                  event
                </div>
              )}
          </div>
        </div>
      </Link>

      <div
        style={{
          padding: "0 16px 16px 16px",
          marginTop: "auto",
        }}
      >
        <Link
          to={`/events/${event._id}`}
          style={{
            display: "block",
            backgroundColor:
              availableTickets <= 0
                ? "#cbd5e1"
                : availableTickets <= totalTickets * 0.1
                ? colors.warning
                : colors.primary,
            color: "white",
            textAlign: "center",
            padding: "10px 16px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "500",
            transition: "background-color 0.2s",
            boxShadow:
              availableTickets <= 0 ? "none" : `0 2px 4px ${colors.shadow}`,
          }}
          onMouseEnter={(e) => {
            if (availableTickets > 0) {
              e.target.style.backgroundColor =
                availableTickets <= totalTickets * 0.1
                  ? "#ea580c"
                  : colors.primaryDark;
            }
          }}
          onMouseLeave={(e) => {
            if (availableTickets > 0) {
              e.target.style.backgroundColor =
                availableTickets <= totalTickets * 0.1
                  ? colors.warning
                  : colors.primary;
            }
          }}
        >
          {availableTickets <= 0 ? "Sold Out" : "View Details"}
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
