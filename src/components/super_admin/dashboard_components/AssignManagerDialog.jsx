import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem } from '@mui/material';

const AssignManagerDialog = ({ open, onClose, managers, onChange, selectedUser }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Assign Manager to {selectedUser?.name}</DialogTitle>
    <DialogContent>
      <Select
        fullWidth
        defaultValue=""
        onChange={onChange}
        displayEmpty
      >
        <MenuItem value="" disabled>
          Select a Manager
        </MenuItem>
        {managers.map((mgr) => (
          <MenuItem key={mgr.id} value={mgr.id}>
            {mgr.name}
          </MenuItem>
        ))}
      </Select>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
    </DialogActions>
  </Dialog>
);

export default AssignManagerDialog;
