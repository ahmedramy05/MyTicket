import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  CircularProgress
} from '@mui/material';
import { ROLES } from '../../utils/roles';

const UpdateUserRoleModal = ({ user, onClose, onUpdateRole }) => {
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

    // Inside handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset submission states
    setSubmitError(null);
    setSubmitSuccess(false);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for API - include all fields except confirmPassword
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone, // Include even if empty
        address: formData.address // Include even if empty
      };
      
      // Only include password if it's not empty
      if (formData.password && formData.password.trim() !== '') {
        updateData.password = formData.password;
      }
      
      console.log("Sending update request with data:", updateData);
      
      // Send update request
      const response = await api.put('/users/profile', updateData);
      
      console.log("Profile update response:", response.data);
      setSubmitSuccess(true);
      
      // Notify parent component about successful update
      if (onUpdateSuccess) {
        onUpdateSuccess(response.data.data);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setSubmitError(
        err.response?.data?.message || 
        'Failed to update profile. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onClose={!isSubmitting ? onClose : undefined} maxWidth="sm" fullWidth>
      <DialogTitle>Update User Role</DialogTitle>

      <DialogContent>
        <Typography variant="body1" paragraph>
          Change role for: <strong>{user.name}</strong> ({user.email})
        </Typography>

        <FormControl component="fieldset">
          <FormLabel component="legend">Select Role</FormLabel>
          <RadioGroup
            value={selectedRole}
            onChange={handleRoleChange}
            name="role-radio-group"
          >
            <FormControlLabel
              value={ROLES.USER}
              control={<Radio />}
              label="Standard User"
              disabled={isSubmitting}
            />
            <FormControlLabel
              value={ROLES.ORGANIZER}
              control={<Radio />}
              label="Event Organizer"
              disabled={isSubmitting}
            />
            <FormControlLabel
              value={ROLES.ADMIN}
              control={<Radio />}
              label="System Admin"
              disabled={isSubmitting}
            />
          </RadioGroup>
        </FormControl>
        {submitError && (
          <Typography color="error" sx={{ mt: 2 }}>
            {submitError}
          </Typography>
        )}
        {submitSuccess && (
          <Typography color="primary" sx={{ mt: 2 }}>
            Role updated successfully!
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          color="inherit"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={isSubmitting || selectedRole === user.role}
          startIcon={isSubmitting && <CircularProgress size={20} />}
        >
          {isSubmitting ? 'Updating...' : 'Update Role'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateUserRoleModal;