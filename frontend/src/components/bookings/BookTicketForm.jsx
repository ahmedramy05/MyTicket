import React, { useState } from 'react';
import { bookingService } from '../../services/api';
import { toast } from 'react-toastify';

const BookTicketForm = ({ event, onBookingComplete }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const availableTickets = event.ticketCount - event.bookedTickets;
  const maxTickets = Math.min(availableTickets, 10); // Limit to 10 tickets max per booking

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value);
  };

  const totalPrice = quantity * event.price;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (quantity > availableTickets) {
      toast.error('Not enough tickets available');
      return;
    }

    try {
      setLoading(true);
      const response = await bookingService.bookTicket(event._id, quantity);
      setBookingDetails(response.data);
      setShowConfirmation(true);
      toast.success('Tickets booked successfully!');
      if (onBookingComplete) onBookingComplete();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book tickets');
    } finally {
      setLoading(false);
    }
  };

  if (availableTickets <= 0) {
    return <div className="alert alert-danger">This event is sold out!</div>;
  }

  if (showConfirmation && bookingDetails) {
    return (
      <div className="alert alert-success">
        <h5>Booking Confirmed!</h5>
        <p>Booking ID: {bookingDetails._id}</p>
        <p>Event: {event.title}</p>
        <p>Tickets: {bookingDetails.quantity}</p>
        <p>Total Price: ${bookingDetails.totalPrice.toFixed(2)}</p>
        <button 
          className="btn btn-primary mt-2" 
          onClick={() => setShowConfirmation(false)}
        >
          Book More Tickets
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="quantity" className="form-label">
          Number of Tickets
        </label>
        <select
          className="form-select"
          id="quantity"
          value={quantity}
          onChange={handleQuantityChange}
          disabled={loading}
        >
          {[...Array(maxTickets)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <div className="d-flex justify-content-between">
          <span>Price per ticket:</span>
          <span>${event.price.toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between fw-bold">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>
      <button type="submit" className="btn btn-success w-100" disabled={loading}>
        {loading ? 'Processing...' : 'Book Now'}
      </button>
    </form>
  );
};

export default BookTicketForm; //export default BookTicketFormffff;