import React, { useEffect, useState } from "react";

export default function Loader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulates scanning progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) return 0;
        return prevProgress + 1;
      });
    }, 25); // Adjust speed of animation

    return () => clearInterval(interval);
  }, []);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      padding: "2rem",
      background: "radial-gradient(circle, #111827 0%, #030712 100%)",
    },
    ticket: {
      position: "relative",
      width: "220px",
      height: "120px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
      overflow: "hidden",
      transform: "perspective(800px) rotateX(10deg)",
      marginBottom: "2rem",
    },
    scanLine: {
      position: "absolute",
      top: "0",
      left: `${progress}%`,
      transform: "translateX(-50%)",
      width: "4px",
      height: "100%",
      background:
        "linear-gradient(to bottom, rgba(255, 77, 77, 0), rgba(255, 77, 77, 1) 40%, rgba(255, 77, 77, 1) 60%, rgba(255, 77, 77, 0))",
      boxShadow:
        "0 0 15px rgba(255, 77, 77, 0.8), 0 0 30px rgba(255, 77, 77, 0.6), 0 0 45px rgba(255, 77, 77, 0.4)",
      zIndex: 10,
    },
    ticketTop: {
      height: "25px",
      borderBottom: "2px dashed #e2e8f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 15px",
      backgroundColor: "#f8fafc",
      color: "#334155",
      fontSize: "12px",
      fontWeight: "bold",
    },
    ticketContent: {
      padding: "15px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    ticketRow: {
      height: "8px",
      backgroundColor: "#e2e8f0",
      borderRadius: "4px",
    },
    ticketShortRow: {
      width: "60%",
    },
    barcodeContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-end",
      height: "25px",
      marginTop: "5px",
    },
    barcode: {
      display: "flex",
      alignItems: "flex-end",
    },
    barcodeBar: {
      width: "2px",
      backgroundColor: "#334155",
      marginRight: "1px",
    },
    logo: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#ffffff",
      marginBottom: "10px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    logoIcon: {
      color: "#ff4d4d",
      fontWeight: "bold",
    },
    loadingText: {
      color: "#ffffff",
      fontSize: "18px",
      animation: "pulse 1.5s infinite",
    },
    "@keyframes pulse": {
      "0%": { opacity: 0.6 },
      "50%": { opacity: 1 },
      "100%": { opacity: 0.6 },
    },
  };

  // Generate random barcode bars
  const generateBarcodeBars = () => {
    const bars = [];
    for (let i = 0; i < 30; i++) {
      const height = Math.floor(Math.random() * 15) + 5;
      bars.push(
        <div
          key={i}
          style={{
            ...styles.barcodeBar,
            height: `${height}px`,
          }}
        />
      );
    }
    return bars;
  };

  return (
    <div style={styles.container}>
      <div style={styles.logo}>
        <span style={styles.logoIcon}>●</span>
        MyTicket
      </div>

      <div style={styles.ticket}>
        <div style={styles.scanLine}></div>

        <div style={styles.ticketTop}>
          <span>MyTicket</span>
          <span>SCANNING...</span>
        </div>

        <div style={styles.ticketContent}>
          <div style={styles.ticketRow}></div>
          <div style={{ ...styles.ticketRow, ...styles.ticketShortRow }}></div>
          <div style={styles.ticketRow}></div>

          <div style={styles.barcodeContainer}>
            <div style={styles.barcode}>{generateBarcodeBars()}</div>
          </div>
        </div>
      </div>

      <div
        style={{
          ...styles.loadingText,
          opacity: 0.6 + (Math.sin(Date.now() / 500) + 1) * 0.2,
        }}
      >
        Loading your experience...
      </div>
    </div>
  );
}
