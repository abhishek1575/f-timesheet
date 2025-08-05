import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

const LogoutConfirmationDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Logout</DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to logout?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} color="primary" variant="contained">
        Logout
      </Button>
    </DialogActions>
  </Dialog>
);

export default LogoutConfirmationDialog;
