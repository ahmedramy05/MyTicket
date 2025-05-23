import { useState, useEffect } from 'react';
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
  TextField,
  InputAdornment,
  Box,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import UserRow from './UserRow';
import UpdateUserRoleModal from './UpdateUserRoleModal';
import ConfirmationDialog from './ConfirmationDialog';
import api from '../../services/api';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Modals state
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users');
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Filter users based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };
  
  // Handle role update
  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}`, { role: newRole });
      
      // Update local state
      const updatedUsers = users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      );
      
      setUsers(updatedUsers);
      setFilteredUsers(prevFiltered => 
        prevFiltered.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      
      // Close modal
      setUserToEdit(null);
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role. Please try again.');
    }
  };
  
  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      
      // Update local state
      const updatedUsers = users.filter(user => user._id !== userId);
      setUsers(updatedUsers);
      setFilteredUsers(prevFiltered => 
        prevFiltered.filter(user => user._id !== userId)
      );
      
      // Close modal
      setUserToDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    }
  };
  
  // Calculate pagination
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ textAlign: 'center', py: 8 }}>
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
      
      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name or email"
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
      
      {/* Users Table */}
      <TableContainer component={Paper}>
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
              paginatedUsers.map(user => (
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
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination 
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
      
      {/* Update Role Modal */}
      {userToEdit && (
        <UpdateUserRoleModal
          user={userToEdit}
          onClose={() => setUserToEdit(null)}
          onUpdateRole={handleRoleUpdate}
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
        />
      )}
    </Container>
  );
};

export default AdminUsersPage;