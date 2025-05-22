import { useState, useEffect } from "react";

/**
 * Toast notification component
 * @param {Object} props
 * @param {string} props.message - Toast message content
 * @param {string} [props.type="info"] - Toast type: "success", "error", "warning", or "info"
 * @param {number} [props.duration=4000] - Time in ms before toast auto-dismisses
 * @param {string} [props.position="top-right"] - Position: "top-right", "top-left", "bottom-right", "bottom-left", "top-center", "bottom-center"
 * @param {function} [props.onClose] - Optional callback when toast closes
 */
export default function Toast({
  message,
  type = "info",
  duration = 4000,
  position = "top-right",
  onClose,
}) {
  const [visible, setVisible] = useState(true);
  const [animationState, setAnimationState] = useState("entering");

  // Handle auto-dismiss
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      setAnimationState("exiting");
      setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, duration, onClose]);

  // Handle manual dismiss
  const handleDismiss = () => {
    setAnimationState("exiting");
    setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  // If toast is not visible, don't render anything
  if (!visible) return null;

  // Get position styles
  const positionStyles = getPositionStyles(position);

  // Get type-specific styles
  const typeStyles = getTypeStyles(type);

  // Set up animations
  const animationStyles = {
    entering: {
      opacity: 1,
      transform: "translateX(0)",
    },
    exiting: {
      opacity: 0,
      transform: position.includes("right")
        ? "translateX(100%)"
        : position.includes("left")
        ? "translateX(-100%)"
        : "translateY(-20px)",
    },
  };

  // Base styles
  const styles = {
    toast: {
      position: "fixed",
      padding: "12px 16px",
      borderRadius: "6px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      minWidth: "280px",
      maxWidth: "450px",
      zIndex: 1000,
      transition: "all 0.3s ease",
      ...positionStyles,
      ...typeStyles,
      ...animationStyles[animationState],
    },
    icon: {
      marginRight: "12px",
      flexShrink: 0,
      fontSize: "20px",
    },
    content: {
      flex: 1,
      marginRight: "12px",
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "18px",
      cursor: "pointer",
      color: "inherit",
      opacity: 0.7,
      padding: 0,
      marginLeft: "10px",
      transition: "opacity 0.2s",
    },
    messageContainer: {
      display: "flex",
      alignItems: "center",
    },
  };

  // Render the appropriate icon based on type
  const renderIcon = () => {
    switch (type) {
      case "success":
        return <div style={styles.icon}>✓</div>;
      case "error":
        return <div style={styles.icon}>✕</div>;
      case "warning":
        return <div style={styles.icon}>⚠</div>;
      case "info":
      default:
        return <div style={styles.icon}>ℹ</div>;
    }
  };

  return (
    <div style={styles.toast}>
      <div style={styles.messageContainer}>
        {renderIcon()}
        <div style={styles.content}>{message}</div>
      </div>
      <button
        style={styles.closeButton}
        onClick={handleDismiss}
        onMouseOver={(e) => (e.target.style.opacity = 1)}
        onMouseOut={(e) => (e.target.style.opacity = 0.7)}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

// Helper function to get position-specific styles
function getPositionStyles(position) {
  const baseOffset = "20px";

  switch (position) {
    case "top-left":
      return { top: baseOffset, left: baseOffset };
    case "top-center":
      return { top: baseOffset, left: "50%", transform: "translateX(-50%)" };
    case "bottom-right":
      return { bottom: baseOffset, right: baseOffset };
    case "bottom-left":
      return { bottom: baseOffset, left: baseOffset };
    case "bottom-center":
      return { bottom: baseOffset, left: "50%", transform: "translateX(-50%)" };
    case "top-right":
    default:
      return { top: baseOffset, right: baseOffset };
  }
}

// Helper function to get type-specific styles
function getTypeStyles(type) {
  switch (type) {
    case "success":
      return { backgroundColor: "#10b981", color: "white" };
    case "error":
      return { backgroundColor: "#ef4444", color: "white" };
    case "warning":
      return { backgroundColor: "#f59e0b", color: "white" };
    case "info":
    default:
      return { backgroundColor: "#3b82f6", color: "white" };
  }
}
