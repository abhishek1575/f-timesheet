import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Box,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Fab,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSuperAdmin } from './hooks/useSuperAdmin';
import UserTable from './dashboard_components/UserTable';
import UserCards from './dashboard_components/UserCards';
import LoadingSkeleton from './dashboard_components/LoadingSkeleton';
import UserActionsMenu from './dashboard_components/UserActionsMenu';
import EditUserDialog from './dashboard_components/EditUserDialog';
import AssignManagerDialog from './dashboard_components/AssignManagerDialog';
import TimesheetDialog from './dashboard_components/TimesheetDialog';
import DeleteConfirmationDialog from './dashboard_components/DeleteConfirmationDialog';
import RegisterUserDialog from './dashboard_components/RegisterUserDialog';
import TeamViewDialog from './dashboard_components/TeamViewDialog';
import LogoutConfirmationDialog from './dashboard_components/LogoutConfirmationDialog';

const SuperAdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    users,
    loading,
    selectedUser,
    openEditDialog,
    setOpenEditDialog,
    openManagerDialog,
    setOpenManagerDialog,
    openRegisterDialog,
    setOpenRegisterDialog,
    managers,
    openTimesheetDialog,
    setOpenTimesheetDialog,
    timesheets,
    tab,
    anchorEl,
    openDeleteConfirm,
    setOpenDeleteConfirm,
    snackbar,
    setSnackbar,
    team,
    openTeamDialog, 
    setOpenTeamDialog,
    openLogoutConfirm,
    setOpenLogoutConfirm,
    handleMenuClick,
    handleMenuClose,
    handleEdit,
    handleUpdate,
    handleDeleteConfirm,
    handleDelete,
    handleReactivate,
    handleAssignManager,
    handleManagerChange,
    handleRemoveManager,
    fetchTimesheets,
    handleChange,
    handleTabChange,
    handleRegister,
    handleViewTeam,
    handleLogout,
    handleLogoutConfirm,
  } = useSuperAdmin();

  return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Super Admin Dashboard
        </Typography>
        <Box>
          <Button variant="contained" onClick={() => setOpenRegisterDialog(true)} sx={{ mr: 2 }}>Register User</Button>
          <Button variant="contained" color="error" onClick={handleLogout}>Logout</Button>
        </Box>
      </Box>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={handleTabChange} aria-label="user tabs">
            <Tab label="Employees" />
            <Tab label="Privileged" />
          </Tabs>
        </Box>
        <Box sx={{ pt: 2 }}>
          {loading ? (
            <LoadingSkeleton isMobile={isMobile} />
          ) : isMobile ? (
            <UserCards users={users} onMenuClick={handleMenuClick} />
          ) : (
            <UserTable users={users} onMenuClick={handleMenuClick} />
          )}
        </Box>
      </Paper>

      

      <UserActionsMenu
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        selectedUser={selectedUser}
        onEdit={handleEdit}
        onDelete={handleDeleteConfirm}
        onAssignManager={handleAssignManager}
        onRemoveManager={handleRemoveManager}
        onFetchTimesheets={fetchTimesheets}
        onViewTeam={handleViewTeam}
      />

      <EditUserDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        user={selectedUser}
        onChange={handleChange}
        onUpdate={handleUpdate}
      />

      <AssignManagerDialog
        open={openManagerDialog}
        onClose={() => setOpenManagerDialog(false)}
        managers={managers}
        onChange={handleManagerChange}
        selectedUser={selectedUser}
      />

      <TimesheetDialog
        open={openTimesheetDialog}
        onClose={() => setOpenTimesheetDialog(false)}
        timesheets={timesheets}
        user={selectedUser}
      />

      <DeleteConfirmationDialog
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
        onConfirm={handleDelete}
        user={selectedUser}
      />

      <RegisterUserDialog
        open={openRegisterDialog}
        onClose={() => setOpenRegisterDialog(false)}
        onRegister={handleRegister}
      />

      <TeamViewDialog
        open={openTeamDialog}
        onClose={() => setOpenTeamDialog(false)}
        team={team}
        manager={selectedUser}
      />

      <LogoutConfirmationDialog
        open={openLogoutConfirm}
        onClose={() => setOpenLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SuperAdminDashboard;