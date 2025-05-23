import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import EventCard from './EventCard';
import { AuthContext } from '../../contexts/AuthContext';
import AddIcon from '@mui/icons-material/Add';
import BarChartIcon from '@mui/icons-material/BarChart';

const MyEventsPage = ({ showToast }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Fetch organizer's events on component mount
  useEffect(() => {
    if (user?.role !== 'Organizer') {
      showToast('Only organizers can access this page', 'error');
      navigate('/');
      return;
    }
    
    fetchMyEvents();
  }, [user]);
  
  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events/user/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to load events:', error);
      showToast('Failed to load your events', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await api.delete(`/events/${eventId}`);
        showToast('Event deleted successfully', 'success');
        // Remove the deleted event from state
        setEvents(events.filter(event => event._id !== eventId));
      } catch (error) {
        console.error('Failed to delete event:', error);
        showToast('Failed to delete event', 'error');
      }
    }
  };
  
  // Filter events based on active tab
  const getFilteredEvents = () => {
    const now = new Date();
    
    switch(activeTab) {
      case 'active':
        return events.filter(event => new Date(event.date) >= now);
      case 'past':
        return events.filter(event => new Date(event.date) < now);
      case 'all':
      default:
        return events;
    }
  };
  
  const filteredEvents = getFilteredEvents();
  
  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <h1 style={styles.title}>My Events</h1>
            <p style={styles.subtitle}>Manage your created events</p>
          </div>
          <div style={styles.headerButtons}>
            <Link to="/my-events/analytics" style={styles.analyticsButton}>
              <BarChartIcon style={{ marginRight: '8px' }} />
              Analytics
            </Link>
            <Link to="/my-events/new" style={styles.createButton}>
              <AddIcon style={{ marginRight: '8px' }} />
              Create Event
            </Link>
          </div>
        </div>
        
        {/* Tabs for filtering */}
        <div style={styles.tabs}>
          <button 
            style={{...styles.tabButton, ...(activeTab === 'all' && styles.activeTab)}}
            onClick={() => setActiveTab('all')}
          >
            All Events
          </button>
          <button 
            style={{...styles.tabButton, ...(activeTab === 'active' && styles.activeTab)}}
            onClick={() => setActiveTab('active')}
          >
            Upcoming Events
          </button>
          <button 
            style={{...styles.tabButton, ...(activeTab === 'past' && styles.activeTab)}}
            onClick={() => setActiveTab('past')}
          >
            Past Events
          </button>
        </div>
        
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Loading your events...</p>
          </div>
        ) : events.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>🎭</div>
            <h3 style={styles.emptyStateTitle}>No events created yet</h3>
            <p style={styles.emptyStateText}>Start by creating your first event</p>
            <Link to="/my-events/new" style={styles.emptyStateButton}>
              Create an Event
            </Link>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>🔍</div>
            <h3 style={styles.emptyStateTitle}>No matching events</h3>
            <p style={styles.emptyStateText}>Try changing your filter criteria</p>
            <button 
              onClick={() => setActiveTab('all')} 
              style={styles.emptyStateButton}
            >
              View All Events
            </button>
          </div>
        ) : (
          <div style={styles.eventsGrid}>
            {filteredEvents.map((event) => (
              <div key={event._id} style={styles.eventCardWrapper}>
                <EventCard event={event} />
                <div style={styles.eventActions}>
                  <Link 
                    to={`/my-events/${event._id}/edit`} 
                    style={styles.editButton}
                  >
                    Edit Event
                  </Link>
                  <button 
                    onClick={() => handleDeleteEvent(event._id)} 
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
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

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
    minHeight: '80vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  titleSection: {
    flex: '1',
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
  headerButtons: {
    display: 'flex',
    gap: '1rem',
  },
  createButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#10b981',
    color: 'white',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  analyticsButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6366f1',
    color: 'white',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontWeight: '500',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.2s',
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
    backgroundColor: '#10b981',
    color: 'white',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem',
    animation: 'fadeIn 0.3s ease-out',
  },
  eventCardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    backgroundColor: 'white',
  },
  eventActions: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    borderTop: '1px solid #e5e7eb',
  },
  editButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#6366f1',
    color: 'white',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    textAlign: 'center',
    transition: 'background-color 0.2s ease',
    flex: '1',
    marginRight: '0.5rem',
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'white',
    color: '#ef4444',
    border: '1px solid #ef4444',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flex: '1',
    marginLeft: '0.5rem',
  },
};

export default MyEventsPage;