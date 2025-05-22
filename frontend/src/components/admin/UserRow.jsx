import { TableRow, TableCell, Button, Stack, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ROLES } from '../../utils/roles';

const UserRow = ({ user, onEditRole, onDelete }) => {
  // Generate chip color based on role
  const getRoleColor = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return 'error';
      case ROLES.ORGANIZER:
        return 'primary';
      case ROLES.USER:
      default:
        return 'success';
    }
  };

  return (
    <TableRow hover>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Chip 
          label={user.role} 
          color={getRoleColor(user.role)}
          size="small"
        />
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={onEditRole}
          >
            Update Role
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onDelete}
          >
            Delete
          </Button>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export default UserRow;