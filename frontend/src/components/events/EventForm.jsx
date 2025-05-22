import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../../services/api';

const categories = ['Music', 'Sports', 'Arts', 'Technology', 'Business', 'Food', 'Other'];

const EventForm = ({ eventId = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: null,
    location: '',
    category: '',
    ticketPrice: '',
    totalTickets: '',
    image: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetchingEvent, setFetchingEvent] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const isEditing = Boolean(eventId);

  // Fetch event data if editing
  useEffect(() => {
    if (isEditing) {
      const fetchEvent = async () => {
        try {
          setFetchingEvent(true);
          const response = await api.get(`/events/${eventId}`);
          const eventData = response.data;
          
          setFormData({
            title: eventData.title || '',
            description: eventData.description || '',
            date: new Date(eventData.date) || null,
            location: eventData.location || '',
            category: eventData.category || '',
            ticketPrice: eventData.ticketPrice || '',
            totalTickets: eventData.totalTickets || '',
            image: eventData.image || ''
          });
        } catch (err) {
          console.error('Error fetching event:', err);
          setError('Could not load event data. Please try again.');
        } finally {
          setFetchingEvent(false);
        }
      };

      fetchEvent();
    }
  }, [eventId, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (newValue) => {
    setFormData({ ...formData, date: newValue });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.category) errors.category = 'Category is required';
    
    if (!formData.ticketPrice) {
      errors.ticketPrice = 'Ticket price is required';
    } else if (isNaN(formData.ticketPrice) || Number(formData.ticketPrice) < 0) {
      errors.ticketPrice = 'Must be a positive number';
    }
    
    if (!formData.totalTickets) {
      errors.totalTickets = 'Total tickets is required';
    } else if (
      isNaN(formData.totalTickets) || 
      !Number.isInteger(Number(formData.totalTickets)) || 
      Number(formData.totalTickets) <= 0
    ) {
      errors.totalTickets = 'Must be a positive integer';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError('Please correct the errors in the form');
      return;
    }
    
    // Prepare data
    const eventData = {
      ...formData,
      ticketPrice: Number(formData.ticketPrice),
      totalTickets: Number(formData.totalTickets)
    };
    
    setLoading(true);
    
    try {
      if (isEditing) {
        await api.put(`/events/${eventId}`, eventData);
        setSuccess('Event updated successfully!');
      } else {
        await api.post('/events', eventData);
        setSuccess('Event created successfully! It is pending approval.');
      }
      
      if (onSuccess) onSuccess();
      
      // Redirect after short delay to show success message
      setTimeout(() => {
        navigate('/my-events');
      }, 1500);
    } catch (err) {
      console.error('Error saving event:', err);
      setError(err.response?.data?.error || 'Failed to save event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingEvent) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditing ? 'Edit Event' : 'Create New Event'}
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              name="title"
              label="Event Title"
              fullWidth
              required
              value={formData.title}
              onChange={handleInputChange}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Event Date & Time"
                value={formData.date}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    required 
                    disabled={loading}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="location"
              label="Location"
              fullWidth
              required
              value={formData.location}
              onChange={handleInputChange}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="category"
              label="Category"
              select
              fullWidth
              required
              value={formData.category}
              onChange={handleInputChange}
              disabled={loading}
            >
              {categories.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="image"
              label="Image URL (optional)"
              fullWidth
              value={formData.image}
              onChange={handleInputChange}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="ticketPrice"
              label="Ticket Price ($)"
              type="number"
              fullWidth
              required
              value={formData.ticketPrice}
              onChange={handleInputChange}
              inputProps={{ min: 0, step: 0.01 }}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="totalTickets"
              label="Total Tickets"
              type="number"
              fullWidth
              required
              value={formData.totalTickets}
              onChange={handleInputChange}
              inputProps={{ min: 1, step: 1 }}
              disabled={loading || (isEditing && event?.bookedTickets > 0)}
              helperText={isEditing && event?.bookedTickets > 0 ? 
                "Can't change ticket count when tickets are already booked" : ""}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/my-events')}
            disabled={loading}
            sx={{ flex: 1 }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
            sx={{ flex: 1 }}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? (isEditing ? 'Updating...' : 'Creating...') : 
                       (isEditing ? 'Update Event' : 'Create Event')}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default EventForm;