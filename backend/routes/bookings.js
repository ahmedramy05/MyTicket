const express = require("express");
const {
  getBookings,
  getBooking,
  createBooking,
  cancelBooking,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authentication");
const { authorize } = require("../middleware/authorization");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(authorize("user"), getBookings)
  .post(authorize("user"), createBooking);

router
  .route("/:id")
  .get(authorize("user"), getBooking)
  .delete(authorize("user"), cancelBooking);

module.exports = router;
