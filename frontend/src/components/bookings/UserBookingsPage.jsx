import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

const UserBookingsPage = ({ showToast }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

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

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') {
      return booking.status === 'Confirmed' && new Date(booking.eventId?.date) > new Date();
    }
    if (activeTab === 'past') {
      return new Date(booking.eventId?.date) < new Date();
    }
    if (activeTab === 'canceled') {
      return booking.status === 'Canceled';
    }
    return true;
  });

  // Format date for better display
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    
    // Format the date and time in a user-friendly way
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Generate a color based on the event category
  const getCategoryColor = (category) => {
    const colors = {
      'Music': '#8B5CF6',
      'Sports': '#22C55E',
      'Arts': '#EC4899',
      'Technology': '#3B82F6',
      'Business': '#F59E0B',
      'Food': '#EF4444',
      'Other': '#6B7280',
    };
    return colors[category] || colors['Other'];
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Bookings</h1>
          <p style={styles.subtitle}>Manage your event tickets and bookings</p>
        </div>
        
        {/* Tabs for filtering */}
        <div style={styles.tabs}>
          <button 
            style={{...styles.tabButton, ...(activeTab === 'all' && styles.activeTab)}}
            onClick={() => setActiveTab('all')}
          >
            All Bookings
          </button>
          <button 
            style={{...styles.tabButton, ...(activeTab === 'upcoming' && styles.activeTab)}}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button 
            style={{...styles.tabButton, ...(activeTab === 'past' && styles.activeTab)}}
            onClick={() => setActiveTab('past')}
          >
            Past
          </button>
          <button 
            style={{...styles.tabButton, ...(activeTab === 'canceled' && styles.activeTab)}}
            onClick={() => setActiveTab('canceled')}
          >
            Canceled
          </button>
        </div>
        
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>🎫</div>
            <h3 style={styles.emptyStateTitle}>No bookings found</h3>
            <p style={styles.emptyStateText}>You haven't booked any events yet.</p>
            <Link to="/events" style={styles.emptyStateButton}>
              Browse Events
            </Link>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>🔍</div>
            <h3 style={styles.emptyStateTitle}>No matching bookings</h3>
            <p style={styles.emptyStateText}>Try changing your filter criteria.</p>
            <button 
              onClick={() => setActiveTab('all')} 
              style={styles.emptyStateButton}
            >
              View All Bookings
            </button>
          </div>
        ) : (
          <div style={styles.bookingsGrid}>
            {filteredBookings.map((booking) => (
              <div key={booking._id} style={styles.bookingCard}>
                <div style={styles.bookingCardHeader}>
                  <div style={styles.bookingStatus}>
                    <div 
                      style={{
                        ...styles.statusIndicator, 
                        backgroundColor: booking.status === 'Confirmed' ? '#10b981' : '#ef4444'
                      }}
                    ></div>
                    <span style={styles.statusText}>{booking.status}</span>
                  </div>
                  <div style={styles.bookingId}>#{booking._id.substring(0, 8)}</div>
                </div>
                
                <div style={styles.bookingCardContent}>
                  {booking.eventId?.category && (
                    <div 
                      style={{
                        ...styles.category,
                        backgroundColor: getCategoryColor(booking.eventId.category) + '20',
                        color: getCategoryColor(booking.eventId.category)
                      }}
                    >
                      {booking.eventId.category}
                    </div>
                  )}
                  
                  <h3 style={styles.eventTitle}>{booking.eventId?.title || 'Event Unavailable'}</h3>
                  
                  <div style={styles.eventDetails}>
                    <div style={styles.eventDetail}>
                      <span style={styles.eventDetailIcon}>📅</span>
                      <span style={styles.eventDetailText}>{formatDate(booking.eventId?.date)}</span>
                    </div>
                    
                    <div style={styles.eventDetail}>
                      <span style={styles.eventDetailIcon}>📍</span>
                      <span style={styles.eventDetailText}>{booking.eventId?.location || 'Location unavailable'}</span>
                    </div>
                    
                    <div style={styles.eventDetail}>
                      <span style={styles.eventDetailIcon}>🎟️</span>
                      <span style={styles.eventDetailText}>{booking.numberOfTickets} ticket{booking.numberOfTickets !== 1 ? 's' : ''}</span>
                    </div>
                    
                    <div style={styles.eventDetail}>
                      <span style={styles.eventDetailIcon}>💰</span>
                      <span style={styles.eventDetailText}>${booking.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div style={styles.bookingActions}>
                    <Link 
                      to={`/events/${booking.eventId?._id}`} 
                      style={styles.viewButton}
                    >
                      View Event
                    </Link>
                    
                    {booking.status === 'Confirmed' && new Date(booking.eventId?.date) > new Date() && (
                      <button 
                        onClick={() => handleCancelBooking(booking._id)} 
                        style={styles.cancelButton}
                      >
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
      
      {/* CSS Animation for Loading Spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
};

// Styles object
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
    minHeight: '80vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#6b7280',
    margin: 0,
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  tabButton: {
    padding: '0.75rem 1.25rem',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    color: '#4b5563',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    backgroundColor: '#6366f1',
    color: 'white',
    border: '1px solid #6366f1',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
  },
  loadingSpinner: {
    width: '3rem',
    height: '3rem',
    border: '4px solid rgba(99, 102, 241, 0.1)',
    borderLeftColor: '#6366f1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '1rem',
    color: '#6b7280',
    fontSize: '1rem',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: '0.75rem',
    padding: '3rem',
    textAlign: 'center',
    border: '1px solid #e5e7eb',
  },
  emptyStateIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  emptyStateTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 0.5rem 0',
  },
  emptyStateText: {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '1.5rem',
  },
  emptyStateButton: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6366f1',
    color: 'white',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  bookingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
    animation: 'fadeIn 0.3s ease-out',
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    border: '1px solid #e5e7eb',
  },
  bookingCardHeader: {
    padding: '1rem',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  bookingStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  statusIndicator: {
    width: '0.625rem',
    height: '0.625rem',
    borderRadius: '50%',
  },
  statusText: {
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  bookingId: {
    fontSize: '0.75rem',
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  bookingCardContent: {
    padding: '1.5rem',
  },
  category: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    marginBottom: '0.75rem',
  },
  eventTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 1rem 0',
    lineHeight: '1.5',
  },
  eventDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  eventDetail: {
    display: 'flex',
    alignItems: 'center',
  },
  eventDetailIcon: {
    marginRight: '0.75rem',
    fontSize: '1rem',
    width: '1.5rem',
    textAlign: 'center',
  },
  eventDetailText: {
    fontSize: '0.875rem',
    color: '#4b5563',
  },
  bookingActions: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '0.75rem',
    marginTop: '1.5rem',
  },
  viewButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    textAlign: 'center',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  cancelButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: 'transparent',
    color: '#ef4444',
    border: '1px solid #ef4444',
    borderRadius: '0.5rem',
    textAlign: 'center',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

export default UserBookingsPage;