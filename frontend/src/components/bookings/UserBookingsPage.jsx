import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../services/api';
import Loader from '../shared/Loader';
import { toast } from 'react-toastify';

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getUserBookings();
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(bookingId);
        toast.success('Booking cancelled successfully');
        // Update the booking status in the state
        setBookings(
          bookings.map((booking) =>
            booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
          )
        );
      } catch (error) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  if (loading) return <Loader />;

  if (bookings.length === 0) {
    return (
      <div className="container mt-4">
        <h2>My Bookings</h2>
        <div className="alert alert-info">
          You don't have any bookings yet. <Link to="/">Browse events</Link> to book tickets.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>My Bookings</h2>
      <div className="row">
        {bookings.map((booking) => (
          <div key={booking._id} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <span>Booking #{booking._id.substring(0, 8)}</span>
                {booking.status === 'confirmed' ? (
                  <span className="badge bg-success">Confirmed</span>
                ) : (
                  <span className="badge bg-danger">Cancelled</span>
                )}
              </div>
              <div className="card-body">
                <h5 className="card-title">{booking.event.title}</h5>
                <p className="card-text">
                  <strong>Date:</strong> {new Date(booking.event.date).toLocaleDateString()}
                </p>
                <p className="card-text">
                  <strong>Location:</strong> {booking.event.location}
                </p>
                <p className="card-text">
                  <strong>Tickets:</strong> {booking.quantity}
                </p>
                <p className="card-text">
                  <strong>Total Price:</strong> ${booking.totalPrice.toFixed(2)}
                </p>
                <p className="card-text">
                  <strong>Booked on:</strong> {new Date(booking.createdAt).toLocaleDateString()}
                </p>
                <div className="d-flex justify-content-between mt-3">
                  <Link to={`/events/${booking.event._id}`} className="btn btn-primary">
                    View Event
                  </Link>
                  {booking.status === 'confirmed' && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBookingsPage;