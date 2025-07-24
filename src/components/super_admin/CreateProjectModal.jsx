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

const CreateProjectModal = ({ open, onClose }) => {
  const [projectName, setProjectName] = useState('');
  const [managerId, setManagerId] = useState('');
  const [teamMemberIds, setTeamMemberIds] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle project creation logic here
    console.log({ projectName, managerId, teamMemberIds });
    onClose(); // Close modal on submit
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Create New Project</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Project Name"
            type="text"
            fullWidth
            variant="outlined"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g., Project Phoenix"
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
          <TextField
            margin="dense"
            id="teamMemberIds"
            label="Team Member IDs (comma-separated)"
            type="text"
            fullWidth
            variant="outlined"
            value={teamMemberIds}
            onChange={(e) => setTeamMemberIds(e.target.value)}
            placeholder="e.g., 3, 4, 5"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 24px' }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Create Project
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProjectModal;