import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';

const ReactivateConfirmationDialog = ({ open, onClose, onConfirm, user }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reactivate User</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to reactivate the user "{user?.name}"?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          Reactivate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReactivateConfirmationDialog;