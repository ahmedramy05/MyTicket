import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventAnalytics from './EventAnalytics';
import api from '../../services/api';
import EventCard from './EventCard';

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('all');
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Delete confirmation state
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    const fetchOrganizerEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/events/user/events');
        setEvents(response.data);
        setFilteredEvents(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching organizer events:', err);
        setError('Failed to load your events. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizerEvents();
  }, []);

  // Filter events based on status
  useEffect(() => {
    if (status === 'all') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => event.status === status));
    }
  }, [events, status]);

  const handleStatusChange = (event, newValue) => {
    setStatus(newValue);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    
    try {
      await api.delete(`/events/${eventToDelete._id}`);
      
      // Update state after successful delete
      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventToDelete._id));
      setEventToDelete(null);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Events
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            sx={{ mr: 2 }}
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </Button>
          <Button 
            component={Link} 
            to="/create-event" 
            variant="contained" 
            startIcon={<AddIcon />}
          >
            Create Event
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Analytics Section */}
      {showAnalytics && events.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <EventAnalytics events={events} />
        </Box>
      )}

      {/* Status Filter Tabs */}
      <Tabs
        value={status}
        onChange={handleStatusChange}
        sx={{ mb: 3 }}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab value="all" label="All Events" />
        <Tab value="approved" label="Approved" />
        <Tab value="pending" label="Pending" />
        <Tab value="declined" label="Declined" />
      </Tabs>

      {/* Events List */}
      {filteredEvents.length > 0 ? (
        <Grid container spacing={4}>
          {filteredEvents.map(event => (
            <Grid item key={event._id} xs={12} sm={6} md={4}>
              <Box sx={{ height: '100%', position: 'relative' }}>
                <EventCard event={event} showStatus={true} />
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button 
                    component={Link}
                    to={`/edit-event/${event._id}`}
                    variant="outlined" 
                    color="primary"
                    fullWidth
                    disabled={event.status === 'declined'}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error"
                    fullWidth
                    onClick={() => setEventToDelete(event)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" py={5}>
          <Typography variant="h6">
            {events.length === 0 
              ? "You haven't created any events yet." 
              : `No ${status !== 'all' ? status : ''} events found.`}
          </Typography>
          {events.length === 0 && (
            <Button 
              component={Link} 
              to="/create-event" 
              variant="contained" 
              sx={{ mt: 2 }}
            >
              Create Your First Event
            </Button>
          )}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!eventToDelete}
        onClose={() => setEventToDelete(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEventToDelete(null)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteEvent} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyEventsPage;