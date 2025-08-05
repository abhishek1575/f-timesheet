import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, user }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Deactivation</DialogTitle>
    <DialogContent>
      <Typography>
        Are you sure you want to deactivate {user?.name}?
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} color="error">
        Deactivate
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteConfirmationDialog;
