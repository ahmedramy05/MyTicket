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

  const validateForm = () => {
    if (!selectedRole) {
      setSubmitError('Please select a role');
      return false;
    }
    return true;
  };

  // Fixed handleSubmit function to properly update user role
  const handleSubmit = async () => {
    // Reset submission states
    setSubmitError(null);
    setSubmitSuccess(false);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the onUpdateRole function passed as prop from parent
      await onUpdateRole(user._id, selectedRole);
      
      // Set success state
      setSubmitSuccess(true);
    } catch (err) {
      console.error('Error updating role:', err);
      setSubmitError('Failed to update role. Please try again.');
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