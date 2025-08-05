import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material';

const EditUserDialog = ({ open, onClose, user, onChange, onUpdate }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Edit User</DialogTitle>
    <DialogContent className="flex flex-col gap-4">
      <TextField
        label="Name"
        name="name"
        value={user?.name || ''}
        onChange={onChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        name="email"
        value={user?.email || ''}
        onChange={onChange}
        fullWidth
        margin="normal"
      />
      <Select
        label="Role"
        name="role"
        value={user?.role || ''}
        onChange={onChange}
        fullWidth
      >
        <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
        <MenuItem value="MANAGER">MANAGER</MenuItem>
        <MenuItem value="ADMIN">ADMIN</MenuItem>
        <MenuItem value="SUPER_ADMIN">SUPER_ADMIN</MenuItem>
      </Select>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="contained" onClick={onUpdate}>
        Update
      </Button>
    </DialogActions>
  </Dialog>
);

export default EditUserDialog;
