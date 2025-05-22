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
  
  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };
  
  const handleSubmit = async () => {
    if (selectedRole === user.role) {
      onClose();
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onUpdateRole(user._id, selectedRole);
      // onClose will be called by the parent component after successful update
    } catch (error) {
      // Error is handled in the parent component
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