import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import EventCard from '../events/EventCard';

const UserBookingsPage = ({ showToast }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/bookings');
      setBookings(response.data.data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      showToast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.delete(`/bookings/${bookingId}`);
        showToast('Booking cancelled successfully', 'success');
        // Update the booking status in the state
        setBookings(
          bookings.map((booking) =>
            booking._id === bookingId ? { ...booking, status: 'Canceled' } : booking
          )
        );
      } catch (error) {
        console.error('Failed to cancel booking:', error);
        showToast('Failed to cancel booking', 'error');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem', minHeight: '80vh' }}>
        <h2>My Bookings</h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading your bookings...</div>
        ) : bookings.length === 0 ? (
          <div style={{ padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
            <p>You don't have any bookings yet.</p>
            <Link 
              to="/events" 
              style={{ 
                display: 'inline-block', 
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#ff4d4d',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {bookings.map((booking) => (
              <div key={booking._id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Booking #{booking._id.substring(0, 8)}</span>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      backgroundColor: booking.status === 'Confirmed' ? '#d1e7dd' : '#f8d7da',
                      color: booking.status === 'Confirmed' ? '#0f5132' : '#842029',
                      fontSize: '0.875rem'
                    }}>
                      {booking.status}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '1rem' }}>
                  <h4>{booking.eventId?.title}</h4>
                  <p><strong>Date:</strong> {new Date(booking.eventId?.date).toLocaleString()}</p>
                  <p><strong>Location:</strong> {booking.eventId?.location}</p>
                  <p><strong>Tickets:</strong> {booking.numberOfTickets}</p>
                  <p><strong>Total Price:</strong> ${booking.totalPrice.toFixed(2)}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <Link to={`/events/${booking.eventId?._id}`} style={{ 
                      padding: '0.5rem 0.75rem', 
                      backgroundColor: '#6366f1', 
                      color: 'white', 
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontSize: '0.875rem'
                    }}>
                      View Event
                    </Link>
                    {booking.status === 'Confirmed' && (
                      <button onClick={() => handleCancelBooking(booking._id)} style={{
                        padding: '0.5rem 0.75rem',
                        backgroundColor: 'transparent',
                        border: '1px solid #ef4444',
                        color: '#ef4444',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}>
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default UserBookingsPage;