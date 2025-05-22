import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Container, Avatar, CircularProgress, Alert } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import UpdateProfileForm from './UpdateProfileForm';
import api from '../../services/api';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/profile');
        setProfile(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle profile update success
  const handleUpdateSuccess = (updatedProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading profile...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {isEditing ? (
          <UpdateProfileForm 
            profile={profile} 
            onUpdateSuccess={handleUpdateSuccess} 
            onCancel={() => setIsEditing(false)} 
          />
        ) : (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" component="h1" gutterBottom>
                My Profile
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </Box>

            <Box display="flex" alignItems="center" mb={4}>
              <Avatar 
                sx={{ width: 80, height: 80, mr: 3 }}
              >
                <AccountCircleIcon sx={{ width: 60, height: 60 }} />
              </Avatar>
              <Box>
                <Typography variant="h5">{profile.name}</Typography>
                <Typography variant="body1" color="textSecondary">
                  {profile.role}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Email</Typography>
              <Typography variant="body1">{profile.email}</Typography>
            </Box>

            {profile.phone && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">Phone</Typography>
                <Typography variant="body1">{profile.phone}</Typography>
              </Box>
            )}

            {profile.address && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">Address</Typography>
                <Typography variant="body1">{profile.address}</Typography>
              </Box>
            )}

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Member Since</Typography>
              <Typography variant="body1">
                {new Date(profile.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ProfilePage;
