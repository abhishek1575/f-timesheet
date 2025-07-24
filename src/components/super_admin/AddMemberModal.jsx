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

const AddMemberModal = ({ open, onClose }) => {
  const [projectId, setProjectId] = useState('');
  const [userId, setUserId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle add member logic here
    console.log({ projectId, userId });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Add Member to Project</DialogTitle>
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
            id="userId"
            label="User ID"
            type="text"
            fullWidth
            variant="outlined"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user's ID to add"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 24px' }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="secondary">
          Add Member
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMemberModal;