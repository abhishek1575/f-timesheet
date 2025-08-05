import React, { useState, useMemo } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Avatar,
  Box,
  Typography,
  TableContainer,
  Paper,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { MoreVert, Search } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    cursor: 'pointer',
  },
}));

const getRoleChipColor = (role) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'error';
    case 'ADMIN':
      return 'warning';
    case 'MANAGER':
      return 'info';
    case 'EMPLOYEE':
      return 'success';
    default:
      return 'default';
  }
};

const UserTable = ({ users, onMenuClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedManager, setSelectedManager] = useState('');

  const managers = useMemo(() => {
    const managerNames = users
      .map((user) => user.managerName)
      .filter((name) => name);
    return ['All', ...new Set(managerNames)];
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesManager = selectedManager === '' || selectedManager === 'All' || user.managerName === selectedManager;
      return matchesSearch && matchesManager;
    });
  }, [users, searchTerm, selectedManager]);

  return (
    <TableContainer component={Paper} elevation={3}>
      <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Manager</InputLabel>
          <Select
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value)}
            label="Filter by Manager"
          >
            {managers.map((manager) => (
              <MenuItem key={manager} value={manager}>
                {manager}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Table sx={{ minWidth: 650 }} aria-label="user table">
        <TableHead sx={{ backgroundColor: (theme) => theme.palette.grey[200] }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Manager</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <StyledTableRow key={user.id}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    {user.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1">{user.name}</Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip label={user.role} size="small" color={getRoleChipColor(user.role)} />
              </TableCell>
              <TableCell>{user.managerName || 'N/A'}</TableCell>
              <TableCell align="right">
                <IconButton onClick={(e) => onMenuClick(e, user)}>
                  <MoreVert />
                </IconButton>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
