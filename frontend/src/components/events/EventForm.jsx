import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  InputAdornment,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { Add as AddIcon, Save as SaveIcon } from '@mui/icons-material';

const CATEGORIES = [
  'Music',
  'Sports',
  'Arts',
  'Technology',
  'Business',
  'Food',
  'Other'
];

const EventForm = ({ showToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: new Date(),
    location: '',
    imageUrl: '',
    price: '',
    availableTickets: '',
  });

  const [errors, setErrors] = useState({});

  // If in edit mode, fetch the event data
  useEffect(() => {
    if (isEditMode) {
      fetchEventDetails();
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${id}`);
      const eventData = response.data; // <-- FIX: use response.data, not response.data.data

      setFormData({
        title: eventData.title || '',
        description: eventData.description || '',
        category: eventData.category || '',
        date: eventData.date ? new Date(eventData.date) : new Date(),
        location: eventData.location || '',
        imageUrl: eventData.image || '',
        price: eventData.ticketPrice?.toString() || '',
        availableTickets: eventData.totalTickets?.toString() || '',
      });
    } catch (error) {
      console.error('Failed to fetch event details:', error);
      setError('Failed to load event details. Please try again.');
      showToast('Failed to load event details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleDateChange = (newDate) => {
    setFormData({
      ...formData,
      date: newDate
    });

    // Clear date error
    if (errors.date) {
      setErrors({
        ...errors,
        date: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (new Date(formData.date) < new Date()) {
      newErrors.date = 'Date cannot be in the past';
    }

    // Numeric fields
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.availableTickets.trim()) {
      newErrors.availableTickets = 'Available tickets is required';
    } else if (isNaN(formData.availableTickets) || parseInt(formData.availableTickets) <= 0) {
      newErrors.availableTickets = 'Available tickets must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Map frontend field names to what the backend expects
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date instanceof Date ? formData.date.toISOString() : formData.date,
        location: formData.location,
        category: formData.category,
        ticketPrice: parseFloat(formData.price),
        totalTickets: parseInt(formData.availableTickets),
        availableTickets: parseInt(formData.availableTickets),
        image: formData.imageUrl || ''
      };

      console.log('Sending event data:', eventData);

      let response;

      if (isEditMode) {
        response = await api.put(`/events/${id}`, eventData);
        setSuccess(true);
        showToast('Event updated successfully', 'success');
      } else {
        response = await api.post('/events', eventData);
        setSuccess(true);
        showToast('Event created successfully', 'success');
      }

      // Redirect after a short delay so user can see success message
      setTimeout(() => {
        navigate('/my-events');
      }, 1500);

    } catch (error) {
      console.error('Failed to save event:', error);
      const errorMsg = error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to save event. Please try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem', minHeight: '80vh' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {isEditMode ? 'Edit Event' : 'Create New Event'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {isEditMode ? 'Event updated successfully!' : 'Event created successfully!'}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  disabled={submitting}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  error={!!errors.category}
                  helperText={errors.category}
                  disabled={submitting}
                  required
                >
                  <MenuItem value="">Select a category</MenuItem>
                  {CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  error={!!errors.location}
                  helperText={errors.location}
                  disabled={submitting}
                  required
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
                        error={!!errors.date}
                        helperText={errors.date}
                        disabled={submitting}
                        required
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  disabled={submitting}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  error={!!errors.price}
                  helperText={errors.price}
                  disabled={submitting}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Available Tickets"
                  name="availableTickets"
                  value={formData.availableTickets}
                  onChange={handleChange}
                  error={!!errors.availableTickets}
                  helperText={errors.availableTickets}
                  disabled={submitting}
                  required
                  type="number"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  disabled={submitting}
                  required
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/my-events')}
                disabled={submitting}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : (isEditMode ? <SaveIcon /> : <AddIcon />)}
              >
                {submitting
                  ? (isEditMode ? 'Updating...' : 'Creating...')
                  : (isEditMode ? 'Update Event' : 'Create Event')}
              </Button>
            </Box>
          </Box>
        </Paper>
      </div>
      <Footer />
    </>
  );
};

export default EventForm;