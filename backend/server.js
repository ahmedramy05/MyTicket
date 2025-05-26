require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 3001;
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Improved CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://my-ticket-kappa.vercel.app' // Removed trailing slash
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1", require("./routes/auth"));
app.use("/api/v1/events", require("./routes/events"));
app.use("/api/v1/bookings", require("./routes/bookings"));

// Add this to ensure options requests are handled
app.options('*', cors());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
