import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  MenuItem,
  TextField,
  Container,
  Divider
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import AnalyticsIcon from '@mui/icons-material/BarChart'; // Add this import for the icon

const EventAnalytics = ({ showToast }) => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/events/analytics');
        setAnalytics(response.data);
        
        const uniqueEvents = response.data.map(item => ({
          id: item.eventId,
          title: item.title
        }));
        
        setEvents(uniqueEvents);
        setError(null);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data. Please try again.');
        showToast('Failed to load analytics data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [showToast]);

  const filteredData = selectedEvent === 'all' 
    ? analytics 
    : analytics.filter(item => item.eventId === selectedEvent);

  const chartData = filteredData.map(item => ({
    name: item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title,
    booked: item.ticketsSold,
    available: item.totalTickets - item.ticketsSold,
    percentageBooked: parseFloat(item.percentageBooked.replace('%', '')),
  }));

  // Custom chart colors
  const chartColors = {
    booked: '#6366f1',
    available: '#4ade80',
    percentageBooked: '#f97316'
  };

  return (
    <>
      <Navbar />
      <div style={{ 
        backgroundColor: '#f8fafc', 
        minHeight: '100vh',
        paddingBottom: '2rem'
      }}>
        <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
          {/* Enhanced header with icon and title */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 4, 
              borderBottom: '1px solid #e5e7eb',
              pb: 2
            }}
          >
            <AnalyticsIcon 
              sx={{ 
                fontSize: 42, 
                color: '#6366f1', 
                mr: 2 
              }} 
            />
            <Box>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  color: '#1f2937',
                  letterSpacing: '-0.5px'
                }}
              >
                Event Analytics
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: '#6b7280',
                  mt: 0.5
                }}
              >
                Track your event performance and ticket sales
              </Typography>
            </Box>
          </Box>
          
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              flexDirection: 'column',
              my: 10
            }}>
              <CircularProgress size={60} sx={{ color: '#6366f1', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Loading analytics data...
              </Typography>
            </Box>
          ) : error ? (
            <Alert 
              severity="error" 
              sx={{ 
                p: 2, 
                borderRadius: 2, 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                fontSize: '1rem'
              }}
            >
              {error}
            </Alert>
          ) : analytics.length === 0 ? (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 5, 
                borderRadius: 2, 
                textAlign: 'center',
                border: '1px dashed #d1d5db',
                backgroundColor: '#f9fafb',
                mt: 4
              }}
            >
              <Box sx={{ fontSize: '4rem', mb: 2 }}>📊</Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#4b5563' }}>
                No analytics data available yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '500px', mx: 'auto' }}>
                Create events and get bookings to see detailed performance analytics and ticket sales data
              </Typography>
            </Paper>
          ) : (
            <Paper 
              elevation={2} 
              sx={{ 
                p: 4, 
                borderRadius: 3, 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                overflow: 'hidden',
                border: '1px solid #e5e7eb'
              }}
            >
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  color: '#111827',
                  mb: 3
                }}
              >
                Event Ticket Sales Analytics
              </Typography>
              
              {/* Event filter */}
              <Box 
                sx={{ 
                  mb: 4, 
                  p: 2, 
                  backgroundColor: '#f9fafb', 
                  borderRadius: 2,
                  border: '1px solid #f3f4f6' 
                }}
              >
                <TextField
                  select
                  label="Select Event"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  variant="outlined"
                  sx={{ 
                    minWidth: 300,
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#6366f1',
                      },
                    },
                  }}
                >
                  <MenuItem value="all">All Events</MenuItem>
                  {events.map((event) => (
                    <MenuItem key={event.id} value={event.id}>
                      {event.title}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              
              {/* First Chart - Enhanced */}
              <Box sx={{ mb: 5 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Box 
                    component="span" 
                    sx={{ 
                      backgroundColor: '#6366f1', 
                      width: 4, 
                      height: 24, 
                      display: 'inline-block', 
                      mr: 2,
                      borderRadius: 1
                    }} 
                  />
                  Tickets Sold vs. Available
                </Typography>
                <Box sx={{ height: 450, mt: 3, mb: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={80}
                        interval={0}
                        tick={{ fontSize: 12, fill: '#4b5563' }}
                      />
                      <YAxis tick={{ fontSize: 12, fill: '#4b5563' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          border: '1px solid #e5e7eb'
                        }} 
                      />
                      <Legend wrapperStyle={{ paddingTop: 20 }} />
                      <Bar dataKey="booked" name="Tickets Sold" fill={chartColors.booked} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="available" name="Tickets Available" fill={chartColors.available} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
              
              <Divider sx={{ my: 4, borderColor: '#e5e7eb' }} />
              
              {/* Second Chart - Enhanced */}
              <Box sx={{ mt: 4 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Box 
                    component="span" 
                    sx={{ 
                      backgroundColor: '#f97316', 
                      width: 4, 
                      height: 24, 
                      display: 'inline-block', 
                      mr: 2,
                      borderRadius: 1
                    }} 
                  />
                  Percentage of Tickets Booked
                </Typography>
                <Box sx={{ height: 450, mt: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={80}
                        interval={0}
                        tick={{ fontSize: 12, fill: '#4b5563' }}
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        unit="%" 
                        tick={{ fontSize: 12, fill: '#4b5563' }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Percentage Booked']}
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          border: '1px solid #e5e7eb'
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: 20 }} />
                      <Bar 
                        dataKey="percentageBooked" 
                        name="Percentage Booked" 
                        fill={chartColors.percentageBooked} 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            </Paper>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default EventAnalytics;

// This code is a React component that fetches and displays event analytics data.