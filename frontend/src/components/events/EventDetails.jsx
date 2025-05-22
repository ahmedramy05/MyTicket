import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Chip,
  Button, 
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PersonIcon from '@mui/icons-material/Person';
import BookTicketForm from '../bookings/BookTicketForm';
import api from '../../services/api';
import { formatDate } from '../../utils/formatDate';
import AuthContext from '../../contexts/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookForm, setShowBookForm] = useState(false);
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">Event not found</Alert>
      </Container>
    );
  }

  // Calculate ticket availability
  const availableTickets = event.totalTickets - (event.bookedTickets || 0);
  const isAvailable = availableTickets > 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2 }}>
        {/* Event Image */}
        <Box
          sx={{
            height: { xs: 200, md: 300 },
            width: '100%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            component="img"
            src={event.image || 'https://source.unsplash.com/random?concert'}
            alt={event.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>

        <Grid container sx={{ p: { xs: 2, md: 4 } }}>
          {/* Event Details */}
          <Grid item xs={12} md={8} sx={{ pr: { md: 4 } }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {event.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarTodayIcon sx={{ mr: 1 }} />
              <Typography variant="body1">
                {formatDate(event.date)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1 }} />
              <Typography variant="body1">
                {event.location}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ mr: 1 }} />
              <Typography variant="body1">
                Organized by: {event.organizer?.name || 'Event Organizer'}
              </Typography>
            </Box>
            
            {event.category && (
              <Box sx={{ mb: 2 }}>
                <Chip label={event.category} color="primary" />
              </Box>
            )}

            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              About This Event
            </Typography>
            
            <Typography variant="body1" paragraph>
              {event.description || 'No description provided.'}
            </Typography>
          </Grid>

          {/* Ticket Info & Booking */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Ticket Information
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalOfferIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  ${event.ticketPrice}
                </Typography>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  per ticket
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ConfirmationNumberIcon sx={{ mr: 1 }} />
                <Typography 
                  variant="body1"
                  color={!isAvailable ? 'error.main' : 
                         availableTickets < 10 ? 'warning.main' : 'inherit'}
                >
                  {!isAvailable 
                    ? 'Sold Out' 
                    : `${availableTickets} tickets available`}
                </Typography>
              </Box>

              {/* Booking Section */}
              {user ? (
                isAvailable ? (
                  showBookForm ? (
                    <BookTicketForm 
                      event={event} 
                      onCancel={() => setShowBookForm(false)}
                      onBookingComplete={() => setShowBookForm(false)}
                    />
                  ) : (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      onClick={() => setShowBookForm(true)}
                      disabled={!isAvailable}
                    >
                      Book Tickets
                    </Button>
                  )
                ) : (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    This event is sold out!
                  </Alert>
                )
              ) : (
                <Box>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Please log in to book tickets.
                  </Alert>
                  <Button 
                    component={Link}
                    to="/login" 
                    variant="contained" 
                    color="primary"
                    fullWidth
                  >
                    Log In
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default EventDetails;