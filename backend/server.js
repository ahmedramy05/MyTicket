const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();

const port = 3001;
app.use(cors());

const mongoURI =
  "mongodb+srv://Thabet:MONGOMONGO@cluster0.2wax2.mongodb.net/MyTicket?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use(express.json());
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1", require("./routes/auth"));
app.use("/api/v1/events", require("./routes/events"));
app.use("/api/v1/bookings", require("./routes/bookings"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("bruh");
});
