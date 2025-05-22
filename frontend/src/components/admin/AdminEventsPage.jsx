import { useState, useEffect } from "react";

import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  InputAdornment,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { formatDate } from "../../utils/formatDate";
import api from "../../services/api";
import ConfirmationDialog from "./ConfirmationDialog";

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Action confirmation
  const [eventToApprove, setEventToApprove] = useState(null);
  const [eventToDecline, setEventToDecline] = useState(null);

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get("/events/all");
        setEvents(response.data);
        setFilteredEvents(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on status and search term
  useEffect(() => {
    let filtered = [...events];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((event) => event.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
    setPage(1); // Reset to first page on filter change
  }, [statusFilter, searchTerm, events]);

  // Handle status filter change
  const handleStatusFilterChange = (event, newValue) => {
    setStatusFilter(newValue);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle event status update
  const handleUpdateStatus = async (eventId, newStatus) => {
    try {
      await api.put(`/events/${eventId}/status`, { status: newStatus });

      // Update local state
      const updatedEvents = events.map((event) =>
        event._id === eventId ? { ...event, status: newStatus } : event
      );

      setEvents(updatedEvents);

      // Reset action states
      setEventToApprove(null);
      setEventToDecline(null);
    } catch (err) {
      console.error(
        `Error ${newStatus === "approved" ? "approving" : "declining"} event:`,
        err
      );
      setError(
        `Failed to ${
          newStatus === "approved" ? "approve" : "decline"
        } event. Please try again.`
      );
    }
  };

  // Get color for status chip
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "declined":
        return "error";
      default:
        return "default";
    }
  };

  // Calculate pagination
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredEvents.length / rowsPerPage);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ textAlign: "center", py: 8 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading events...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Event Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Status Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={statusFilter}
          onChange={handleStatusFilterChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="All Events" value="all" />
          <Tab label="Pending" value="pending" />
          <Tab label="Approved" value="approved" />
          <Tab label="Declined" value="declined" />
        </Tabs>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by title or location"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Events Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Organizer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEvents.length > 0 ? (
              paginatedEvents.map((event) => (
                <TableRow key={event._id} hover>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.Organizer?.name || "Unknown"}</TableCell>
                  <TableCell>{formatDate(event.date)}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>${event.ticketPrice}</TableCell>
                  <TableCell>
                    <Chip
                      label={event.status}
                      color={getStatusColor(event.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {event.status === "pending" && (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => setEventToApprove(event)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<CancelIcon />}
                          onClick={() => setEventToDecline(event)}
                        >
                          Decline
                        </Button>
                      </Box>
                    )}
                    {event.status === "approved" && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => setEventToDecline(event)}
                      >
                        Revoke Approval
                      </Button>
                    )}
                    {event.status === "declined" && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => setEventToApprove(event)}
                      >
                        Approve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No events found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {filteredEvents.length > rowsPerPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Approve Confirmation Dialog */}
      {eventToApprove && (
        <ConfirmationDialog
          open={!!eventToApprove}
          title="Approve Event"
          content={`Are you sure you want to approve "${eventToApprove.title}"? This will make the event visible to all users.`}
          onConfirm={() => handleUpdateStatus(eventToApprove._id, "approved")}
          onCancel={() => setEventToApprove(null)}
          confirmButtonText="Approve"
          confirmButtonColor="success"
        />
      )}

      {/* Decline Confirmation Dialog */}
      {eventToDecline && (
        <ConfirmationDialog
          open={!!eventToDecline}
          title="Decline Event"
          content={`Are you sure you want to decline "${eventToDecline.title}"? This will prevent the event from being visible to users.`}
          onConfirm={() => handleUpdateStatus(eventToDecline._id, "declined")}
          onCancel={() => setEventToDecline(null)}
          confirmButtonText="Decline"
          confirmButtonColor="error"
        />
      )}
    </Container>
  );
};

export default AdminEventsPage;
