import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import superAdminService from '../../../service/superAdminService';

export const useSuperAdmin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openManagerDialog, setOpenManagerDialog] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [managers, setManagers] = useState([]);
  const [openTimesheetDialog, setOpenTimesheetDialog] = useState(false);
  const [timesheets, setTimesheets] = useState([]);
  const [tab, setTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [team, setTeam] = useState([]);
  const [openTeamDialog, setOpenTeamDialog] = useState(false);
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await superAdminService.getAllUsers();
      setUsers(res.data.filter(user => user.role === 'EMPLOYEE'));
    } catch (err) {
      showSnackbar('Failed to fetch employees', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPrivilegedUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await superAdminService.getPrivilegedUsers();
      // Sort by role: SUPER_ADMIN, ADMIN, MANAGER
      const sortedUsers = res.data.sort((a, b) => {
        const roles = ['SUPER_ADMIN', 'ADMIN', 'MANAGER'];
        return roles.indexOf(a.role) - roles.indexOf(b.role);
      });
      setUsers(sortedUsers);
    } catch (err) {
      showSnackbar('Failed to fetch privileged users', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 0) fetchEmployees();
    if (tab === 1) fetchPrivilegedUsers();
  }, [tab, fetchEmployees, fetchPrivilegedUsers]);

  const refreshData = useCallback(() => {
    if (tab === 0) fetchEmployees();
    if (tab === 1) fetchPrivilegedUsers();
  }, [tab, fetchEmployees, fetchPrivilegedUsers]);

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    try {
      await superAdminService.updateUser(selectedUser.id, {
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
      });
      showSnackbar('User updated successfully');
      setOpenEditDialog(false);
      refreshData();
    } catch {
      showSnackbar('Update failed', 'error');
    }
  };

  const handleDeleteConfirm = () => {
    setOpenDeleteConfirm(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await superAdminService.deleteUser(selectedUser.id);
      showSnackbar('User deactivated successfully');
      setOpenDeleteConfirm(false);
      refreshData();
    } catch {
      showSnackbar('Failed to deactivate user', 'error');
    }
  };

  

  const handleAssignManager = async () => {
    handleMenuClose();
    try {
      const res = await superAdminService.getPrivilegedUsers();
      setManagers(res.data.filter((u) => u.role === 'MANAGER'));
      setOpenManagerDialog(true);
    } catch {
      showSnackbar('Failed to load managers', 'error');
    }
  };

  const handleManagerChange = async (e) => {
    const managerId = e.target.value;
    if (!selectedUser) return;
    try {
      await superAdminService.assignManager(selectedUser.id, managerId);
      showSnackbar('Manager assigned successfully');
      setOpenManagerDialog(false);
      refreshData();
    } catch {
      showSnackbar('Failed to assign manager', 'error');
    }
  };

  const handleRemoveManager = async () => {
    handleMenuClose();
    if (!selectedUser) return;
    try {
            await superAdminService.removeManager(selectedUser.id); 
      showSnackbar('Manager removed successfully');
      refreshData();
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Failed to remove manager', 'error');
    }
  };

  const fetchTimesheets = async () => {
    handleMenuClose();
    if (!selectedUser) return;
    try {
      const res = await superAdminService.getTimesheetsByUser(selectedUser.id);
      setTimesheets(res.data);
      setOpenTimesheetDialog(true);
    } catch {
      showSnackbar('Failed to fetch timesheets', 'error');
    }
  };

  const handleViewTeam = async () => {
    handleMenuClose();
    if (!selectedUser) return;
    try {
      const res = await superAdminService.getTeamByManager(selectedUser.id);
      setTeam(res.data);
      setOpenTeamDialog(true);
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Failed to fetch team members', 'error');
    }
  };

  const handleChange = (e) => {
    setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleRegister = async (formData) => {
    try {
      await superAdminService.registerUser(formData);
      showSnackbar('User registered successfully');
      setOpenRegisterDialog(false);
      refreshData();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Registration failed', 'error');
    }
  };

  const handleLogout = () => {
    setOpenLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  return {
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
    // handleReactivate,
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
  };
};