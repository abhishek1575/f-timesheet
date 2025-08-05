import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import { Edit, Delete, PersonAdd, PersonRemove, ListAlt, Replay, Group } from '@mui/icons-material';

const UserActionsMenu = ({ anchorEl, onClose, selectedUser, onEdit, onDelete, onReactivate, onAssignManager, onRemoveManager, onFetchTimesheets, onViewTeam }) => (
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={onClose}
  >
    <MenuItem onClick={onEdit}><Edit sx={{ mr: 1 }} /> Edit</MenuItem>
    {/* <MenuItem onClick={onDelete}><Delete sx={{ mr: 1 }} /> Deactivate</MenuItem> */}
    {selectedUser?.role === 'EMPLOYEE' && (
      <MenuItem onClick={onAssignManager}><PersonAdd sx={{ mr: 1 }} /> Assign Manager</MenuItem>
    )}
    {selectedUser?.role === 'EMPLOYEE' && selectedUser?.managerName && (
      <MenuItem onClick={onRemoveManager}><PersonRemove sx={{ mr: 1 }} /> Remove Manager</MenuItem>
    )}
     {selectedUser?.role === 'MANAGER' && (
      <MenuItem onClick={onViewTeam}><Group sx={{ mr: 1 }} /> View Team</MenuItem>
    )}
    <MenuItem onClick={onFetchTimesheets}><ListAlt sx={{ mr: 1 }} /> View Timesheets</MenuItem>
  </Menu>
);

export default UserActionsMenu;
