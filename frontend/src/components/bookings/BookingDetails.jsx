import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingService } from '../../services/api';
import Loader from '../shared/Loader';
import { toast } from 'react-toastify';

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBooking(id);
      setBooking(response.data);
    } catch (error) {
      toast.error('Failed to load booking details');
      navigate('/bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(id);
        toast.success('Booking cancelled successfully');
        fetchBooking(); // Refresh booking data
      } catch (error) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  if (loading) return <Loader />;

  if (!booking) return <div className="alert alert-danger">Booking not found</div>;

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2>Booking Details</h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h4>Event Information</h4>
              <p><strong>Event:</strong> {booking.event.title}</p>
              <p><strong>Date:</strong> {new Date(booking.event.date).toLocaleString()}</p>
              <p><strong>Location:</strong> {booking.event.location}</p>
              <p><strong>Organizer:</strong> {booking.event.organizer.name}</p>
            </div>
            <div className="col-md-6">
              <h4>Booking Information</h4>
              <p><strong>Booking ID:</strong> {booking._id}</p>
              <p><strong>Status:</strong> {booking.status === 'confirmed' ? 
                <span className="badge bg-success">Confirmed</span> : 
                <span className="badge bg-danger">Cancelled</span>}
              </p>
              <p><strong>Number of Tickets:</strong> {booking.quantity}</p>
              <p><strong>Price per Ticket:</strong> ${booking.event.price.toFixed(2)}</p>
              <p><strong>Total Amount:</strong> ${booking.totalPrice.toFixed(2)}</p>
              <p><strong>Booked on:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="d-flex justify-content-between mt-4">
            <Link to="/bookings" className="btn btn-secondary">
              Back to Bookings
            </Link>
            {booking.status === 'confirmed' && (
              <button onClick={handleCancelBooking} className="btn btn-danger">
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;