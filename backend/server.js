require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const port = 3001;

const mongoURI =
  "mongodb+srv://Thabet:MONGOMONGO@cluster0.2wax2.mongodb.net/MyTicket?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Add this to your server.js BEFORE defining routes
const cors = require("cors");
app.use(cors({
  origin: [
    'http://localhost:5173', // Development frontend
    'https://my-ticket-kappa.vercel.app/' // Production frontend
  ],
  credentials: true
}));

app.use(express.json());
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1", require("./routes/auth"));
app.use("/api/v1/events", require("./routes/events"));
app.use("/api/v1/bookings", require("./routes/bookings"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});
