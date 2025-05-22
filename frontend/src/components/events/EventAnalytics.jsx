import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  MenuItem,
  TextField
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const EventAnalytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [events, setEvents] = useState([]);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await api.get('/events/user/events/analytics');
        setAnalytics(response.data);
        
        // Extract unique event names for the filter
        const uniqueEvents = response.data.map(item => ({
          id: item.eventId,
          title: item.title
        }));
        
        setEvents(uniqueEvents);
        setError(null);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Filter data based on selected event
  const filteredData = selectedEvent === 'all' 
    ? analytics 
    : analytics.filter(item => item.eventId === selectedEvent);

  // Format data for chart
  const chartData = filteredData.map(item => ({
    name: item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title,
    booked: item.ticketsSold,
    available: item.totalTickets - item.ticketsSold,
    percentageBooked: parseFloat(item.percentageBooked.replace('%', '')),
  }));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (analytics.length === 0) {
    return <Alert severity="info">No analytics data available yet. Create events and get bookings to see analytics.</Alert>;
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Event Ticket Sales Analytics
      </Typography>
      
      {/* Event filter */}
      <Box sx={{ mb: 3 }}>
        <TextField
          select
          label="Select Event"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          variant="outlined"
          sx={{ minWidth: 250 }}
        >
          <MenuItem value="all">All Events</MenuItem>
          {events.map((event) => (
            <MenuItem key={event.id} value={event.id}>
              {event.title}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      
      {/* Tickets Sold Bar Chart */}
      <Typography variant="h6" gutterBottom>
        Tickets Sold vs. Available
      </Typography>
      <Box sx={{ height: 400, mb: 4 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="booked" name="Tickets Sold" fill="#8884d8" />
            <Bar dataKey="available" name="Tickets Available" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      
      {/* Percentage Booked Bar Chart */}
      <Typography variant="h6" gutterBottom>
        Percentage of Tickets Booked
      </Typography>
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              interval={0}
            />
            <YAxis domain={[0, 100]} unit="%" />
            <Tooltip formatter={(value) => [`${value}%`, 'Percentage Booked']} />
            <Legend />
            <Bar dataKey="percentageBooked" name="Percentage Booked" fill="#ff7300" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default EventAnalytics;