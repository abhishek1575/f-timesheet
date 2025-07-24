import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from '@mui/material';

const AssignManagerModal = ({ open, onClose }) => {
  const [projectId, setProjectId] = useState('');
  const [managerId, setManagerId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle assign manager logic here
    console.log({ projectId, managerId });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Assign Manager to Project</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            id="projectId"
            label="Project ID"
            type="text"
            fullWidth
            variant="outlined"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="Enter project ID"
          />
          <TextField
            margin="dense"
            id="managerId"
            label="Manager ID"
            type="text"
            fullWidth
            variant="outlined"
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
            placeholder="Enter manager's user ID"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 24px' }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="success">
          Assign Manager
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignManagerModal;