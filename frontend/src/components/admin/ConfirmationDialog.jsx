import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
  Box,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

/**
 * Reusable confirmation dialog component
 *
 * @param {Object} props
 * @param {boolean} props.open - Controls dialog visibility
 * @param {string} props.title - Dialog title
 * @param {string|JSX.Element} props.content - Dialog content (text or JSX)
 * @param {function} props.onConfirm - Function to call when confirmed
 * @param {function} props.onCancel - Function to call when cancelled
 * @param {string} [props.confirmButtonText='Confirm'] - Text for confirm button
 * @param {string} [props.cancelButtonText='Cancel'] - Text for cancel button
 * @param {string} [props.confirmButtonColor='primary'] - Color for confirm button (primary, secondary, error, etc.)
 * @param {string} [props.severity='warning'] - Severity level (info, warning, error)
 * @param {boolean} [props.disableBackdropClick=false] - Prevent closing on backdrop click
 */
export default function ConfirmationDialog({
  open,
  title,
  content,
  onConfirm,
  onCancel,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  confirmButtonColor = "primary",
  severity = "warning",
  disableBackdropClick = false,
}) {
  // Handle backdrop click
  const handleClose = (event, reason) => {
    if (disableBackdropClick && reason === "backdropClick") {
      return;
    }
    onCancel();
  };

  // Get icon based on severity
  const renderIcon = () => {
    switch (severity) {
      case "error":
        return <ErrorOutlineIcon sx={{ fontSize: 40, color: "error.main" }} />;
      case "info":
        return <InfoIcon sx={{ fontSize: 40, color: "info.main" }} />;
      case "warning":
      default:
        return <WarningIcon sx={{ fontSize: 40, color: "warning.main" }} />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: 2,
          minWidth: { xs: "90%", sm: 400 },
        },
      }}
    >
      <DialogTitle id="confirmation-dialog-title" sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          {renderIcon()}
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="confirmation-dialog-description" sx={{ mt: 1 }}>
          {content}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onCancel}
          color="inherit"
          variant="outlined"
          size="medium"
        >
          {cancelButtonText}
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmButtonColor}
          variant="contained"
          autoFocus
          size="medium"
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
