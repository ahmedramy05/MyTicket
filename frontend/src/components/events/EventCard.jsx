import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box, 
  Chip,
  CardActionArea 
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { formatDate } from '../../utils/formatDate';

const EventCard = ({ event, showStatus = false }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'declined': return 'error';
      default: return 'default';
    }
  };

  // Calculate available tickets
  const availableTickets = event.totalTickets - (event.bookedTickets || 0);
  const ticketAvailability = 
    availableTickets <= 0 ? 'Sold Out' :
    availableTickets < 10 ? `Only ${availableTickets} left` : 
    `${availableTickets} available`;

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': { transform: 'scale(1.02)' }
    }}>
      <CardActionArea component={Link} to={`/events/${event._id}`}>
        <CardMedia
          component="img"
          height="140"
          image={event.image || 'https://source.unsplash.com/random?concert'}
          alt={event.title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          {showStatus && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <Chip 
                label={event.status} 
                color={getStatusColor(event.status)}
                size="small"
              />
            </Box>
          )}
          
          <Typography gutterBottom variant="h5" component="h2">
            {event.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(event.date)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {event.location}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocalOfferIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              ${event.ticketPrice}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ConfirmationNumberIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography 
              variant="body2" 
              color={availableTickets <= 0 ? 'error.main' : 
                     availableTickets < 10 ? 'warning.main' : 'text.secondary'}
            >
              {ticketAvailability}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      
      <Box sx={{ p: 2, pt: 0 }}>
        <Button 
          component={Link}
          to={`/events/${event._id}`}
          variant="contained" 
          fullWidth
          disabled={availableTickets <= 0}
        >
          {availableTickets <= 0 ? 'Sold Out' : 'View Details'}
        </Button>
      </Box>
    </Card>
  );
};

export default EventCard;