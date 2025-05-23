// filepath: c:\Users\Saif Saad\Documents\GIU\Semester 4\Software Engineering\SEproj\MyTicket\frontend\src\components\user\ProfilePage.jsx
import { useState, useEffect, useContext } from 'react';
import { Box, Typography, Paper, Button, Container, Avatar, CircularProgress, Alert, Divider } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import UpdateProfileForm from './UpdateProfileForm';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';

const ProfilePage = ({ showToast }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useContext(AuthContext);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Use the correct API endpoint
        const response = await api.get('/users/profile');
        console.log('Profile response:', response.data); // Debug log
        if (response.data && response.data.success) {
          setProfile(response.data.data);
          setError(null);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        
        // If we have user data in context, use that as fallback
        if (user) {
          setProfile(user);
          setError(null);
        } else {
          setError('Failed to load profile. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Rest of your component remains the same...
  
  // Handle profile update success
  const handleUpdateSuccess = (updatedProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
    if (showToast) {
      showToast('Profile updated successfully!', 'success');
    }
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

  if (error && !profile) {
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
            showToast={showToast} 
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
                sx={{
                  backgroundColor: '#ff4d4d',
                  '&:hover': {
                    backgroundColor: '#e53935',
                  }
                }}
              >
                Edit Profile
              </Button>
            </Box>

            <Box display="flex" alignItems="center" mb={4}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mr: 3,
                  bgcolor: '#ff4d4d',
                  color: 'white',
                  fontSize: '2rem'
                }}
              >
                {profile.name ? profile.name.charAt(0).toUpperCase() : <AccountCircleIcon sx={{ width: 60, height: 60 }} />}
              </Avatar>
              <Box>
                <Typography variant="h5">{profile.name}</Typography>
                <Typography variant="body1" color="text.secondary">
                  {profile.role}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <EmailIcon sx={{ mr: 2, color: '#666' }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">Email</Typography>
                <Typography variant="body1">{profile.email}</Typography>
              </Box>
            </Box>

            {profile.phone && (
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ mr: 2, color: '#666' }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">Phone</Typography>
                  <Typography variant="body1">{profile.phone}</Typography>
                </Box>
              </Box>
            )}

            {profile.address && (
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <HomeIcon sx={{ mr: 2, color: '#666' }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">Address</Typography>
                  <Typography variant="body1">{profile.address}</Typography>
                </Box>
              </Box>
            )}

            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <BadgeIcon sx={{ mr: 2, color: '#666' }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">Role</Typography>
                <Typography variant="body1">{profile.role}</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CalendarTodayIcon sx={{ mr: 2, color: '#666' }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">Member Since</Typography>
                <Typography variant="body1">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ProfilePage;