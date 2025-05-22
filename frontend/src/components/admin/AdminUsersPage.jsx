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
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Pagination,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RefreshIcon from "@mui/icons-material/Refresh";

import UserRow from "./UserRow";
import UpdateUserRoleModal from "./UpdateUserRoleModal";
import ConfirmationDialog from "./ConfirmationDialog";
import { ROLES } from "../../utils/roles";
import api from "../../services/api";

export default function AdminUsersPage({ showToast }) {
  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal state
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and role filter
  useEffect(() => {
    let filtered = [...users];

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
    setPage(1); // Reset to first page when filters change
  }, [roleFilter, searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      setUsers(response.data);
      setFilteredUsers(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle role filter change
  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };

  // Handle role update
  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await api.put(`/users/${userId}/role`, {
        role: newRole,
      });

      // Update local state
      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, role: newRole } : user
      );

      setUsers(updatedUsers);
      setUserToEdit(null);
      showToast?.("User role updated successfully", "success");
      return response;
    } catch (err) {
      console.error("Error updating user role:", err);
      showToast?.("Failed to update user role", "error");
      throw err;
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);

      // Update local state
      setUsers(users.filter((user) => user._id !== userId));
      setUserToDelete(null);
      showToast?.("User deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting user:", err);
      showToast?.("Failed to delete user", "error");
    }
  };

  // Calculate pagination
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ textAlign: "center", py: 8 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading users...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Actions Bar */}
      <Box sx={{ display: "flex", mb: 3, gap: 2, flexWrap: "wrap" }}>
        <TextField
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="role-filter-label">Role</InputLabel>
          <Select
            labelId="role-filter-label"
            id="role-filter"
            value={roleFilter}
            label="Role"
            onChange={handleRoleFilterChange}
          >
            <MenuItem value="all">All Roles</MenuItem>
            <MenuItem value={ROLES.USER}>Standard User</MenuItem>
            <MenuItem value={ROLES.ORGANIZER}>Event Organizer</MenuItem>
            <MenuItem value={ROLES.ADMIN}>System Admin</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchUsers}
        >
          Refresh
        </Button>
      </Box>

      {/* Users Table */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <UserRow
                  key={user._id}
                  user={user}
                  onEditRole={() => setUserToEdit(user)}
                  onDelete={() => setUserToDelete(user)}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {filteredUsers.length > rowsPerPage && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Role Update Modal */}
      {userToEdit && (
        <UpdateUserRoleModal
          user={userToEdit}
          onClose={() => setUserToEdit(null)}
          onUpdateRole={handleUpdateRole}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {userToDelete && (
        <ConfirmationDialog
          open={!!userToDelete}
          title="Delete User"
          content={`Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`}
          onConfirm={() => handleDeleteUser(userToDelete._id)}
          onCancel={() => setUserToDelete(null)}
          confirmButtonText="Delete"
          confirmButtonColor="error"
        />
      )}

      {/* Statistics */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          User Statistics
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
            <Typography variant="body1">Total Users</Typography>
            <Typography variant="h4">{users.length}</Typography>
          </Box>
          <Box sx={{ p: 2, bgcolor: "#e8f5e9", borderRadius: 1 }}>
            <Typography variant="body1">Standard Users</Typography>
            <Typography variant="h4">
              {users.filter((user) => user.role === ROLES.USER).length}
            </Typography>
          </Box>
          <Box sx={{ p: 2, bgcolor: "#e3f2fd", borderRadius: 1 }}>
            <Typography variant="body1">Organizers</Typography>
            <Typography variant="h4">
              {users.filter((user) => user.role === ROLES.ORGANIZER).length}
            </Typography>
          </Box>
          <Box sx={{ p: 2, bgcolor: "#fce4ec", borderRadius: 1 }}>
            <Typography variant="body1">Admins</Typography>
            <Typography variant="h4">
              {users.filter((user) => user.role === ROLES.ADMIN).length}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
