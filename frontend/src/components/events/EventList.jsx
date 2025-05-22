import { useState, useEffect } from 'react';
import { 
  Grid, 
  Container, 
  Typography, 
  Box, 
  TextField, 
  MenuItem, 
  InputAdornment,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EventCard from './EventCard';
import api from '../../services/api';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [eventsPerPage] = useState(12);
  
  const categories = ['all', 'Music', 'Sports', 'Arts', 'Technology', 'Business', 'Food', 'Other'];

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/events');
        setEvents(response.data);
        setFilteredEvents(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Apply filters whenever search or category changes
  useEffect(() => {
    let result = [...events];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(query) || 
        event.description?.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (categoryFilter && categoryFilter !== 'all') {
      result = result.filter(event => event.category === categoryFilter);
    }
    
    setFilteredEvents(result);
    setPage(1); // Reset to first page on filter change
  }, [searchQuery, categoryFilter, events]);

  // Get current page of events
  const indexOfLastEvent = page * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  
  // Change page
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
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
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Upcoming Events
      </Typography>
      
      {/* Filters */}
      <Box sx={{ display: 'flex', mb: 4, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <TextField
          label="Search events"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <TextField
          select
          label="Category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          variant="outlined"
          sx={{ minWidth: { xs: '100%', sm: 200 } }}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      
      {/* Event Cards */}
      {currentEvents.length > 0 ? (
        <>
          <Grid container spacing={4}>
            {currentEvents.map(event => (
              <Grid item key={event._id} xs={12} sm={6} md={4}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {filteredEvents.length > eventsPerPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={Math.ceil(filteredEvents.length / eventsPerPage)} 
                page={page} 
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      ) : (
        <Box textAlign="center" py={5}>
          <Typography variant="h6">
            No events found matching your criteria.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default EventList;