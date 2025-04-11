const express = require("express");
const mongoose = require("mongoose");
const Booking = require("./models/Booking");
const app = express();

const port = 3001;

// Replace with your MongoDB Atlas connection string
const mongoURI =
  "mongodb+srv://Thabet:MONGOMONGO@cluster0.2wax2.mongodb.net/MyTicket?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});
