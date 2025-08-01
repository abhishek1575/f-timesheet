import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Tabs,
  Tab,
  Avatar,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  Refresh as RefreshIcon,
  PersonRemove as PersonRemoveIcon,
  AssignmentInd as AssignmentIndIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { superAdminService } from "../../service/superAdminService";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/system";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const RoleChip = styled(Chip)(({ theme, role }) => ({
  backgroundColor:
    role === "SUPER_ADMIN"
      ? theme.palette.primary.dark
      : role === "ADMIN"
      ? theme.palette.secondary.dark
      : role === "MANAGER"
      ? theme.palette.info.dark
      : theme.palette.success.dark,
  color: theme.palette.common.white,
  fontWeight: "bold",
}));

const SDashboard = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  const [selectedTab, setSelectedTab] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [openTimesheetDialog, setOpenTimesheetDialog] = useState(false);
  const [openManagerDialog, setOpenManagerDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [timesheets, setTimesheets] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, selectedTab, searchTerm]);

   const fetchUsers = async () => {
     try {
       const response = await superAdminService.getAllUsers();
       // Ensure we always set an array, even if response.data is null/undefined
       setUsers(Array.isArray(response.data) ? response.data : []);

       const privilegedResponse = await superAdminService.getPrivilegedUsers();
       setManagers(
         Array.isArray(privilegedResponse.data)
           ? privilegedResponse.data.filter((user) => user.role === "MANAGER")
           : []
       );
     } catch (error) {
       console.error("Error fetching users:", error);
       setUsers([]); // Set to empty array on error
       setManagers([]);
       showSnackbar("Failed to fetch users", "error");
     }
   };

  const filterUsers = () => {
    try {
      // Safeguard against non-array users
      const usersArray = Array.isArray(users) ? users : [];

      let filtered = [...usersArray];

      if (selectedTab !== "all") {
        filtered = filtered.filter(
          (user) => user?.role === selectedTab.toUpperCase()
        );
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (user) =>
            user?.name?.toLowerCase().includes(term) ||
            user?.email?.toLowerCase().includes(term)
        );
      }

      setFilteredUsers(filtered);
    } catch (error) {
      console.error("Error filtering users:", error);
      setFilteredUsers([]);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setOpenDialog(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await superAdminService.deleteUser(userId);
      showSnackbar("User deactivated successfully", "success");
      fetchUsers();
    } catch (error) {
      showSnackbar("Failed to deactivate user", "error");
    }
  };

  const handleReactivateUser = async (userId) => {
    try {
      await superAdminService.reactivateUser(userId);
      showSnackbar("User reactivated successfully", "success");
      fetchUsers();
    } catch (error) {
      showSnackbar("Failed to reactivate user", "error");
    }
  };

  const handleViewTimesheets = async (userId) => {
    try {
      const response = await superAdminService.getUserTimesheets(userId);
      setTimesheets(response.data);
      setCurrentUser(users.find((user) => user.id === userId));
      setOpenTimesheetDialog(true);
    } catch (error) {
      showSnackbar("Failed to fetch timesheets", "error");
    }
  };

  const handleAssignManager = (user) => {
    setCurrentUser(user);
    setSelectedManager(user.managerId || "");
    setOpenManagerDialog(true);
  };

  const handleRemoveManager = async (userId) => {
    try {
      await superAdminService.removeManager(userId);
      showSnackbar("Manager removed successfully", "success");
      fetchUsers();
    } catch (error) {
      showSnackbar("Failed to remove manager", "error");
    }
  };

  const handleManagerSubmit = async () => {
    try {
      if (selectedManager) {
        await superAdminService.assignManager(currentUser.id, selectedManager);
        showSnackbar("Manager assigned successfully", "success");
      } else {
        await superAdminService.removeManager(currentUser.id);
        showSnackbar("Manager removed successfully", "success");
      }
      setOpenManagerDialog(false);
      fetchUsers();
    } catch (error) {
      showSnackbar("Failed to update manager assignment", "error");
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
    };

    try {
      await superAdminService.updateUser(currentUser.id, userData);
      showSnackbar("User updated successfully", "success");
      setOpenDialog(false);
      fetchUsers();
    } catch (error) {
      showSnackbar("Failed to update user", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ mb: 3, color: theme.palette.primary.main }}
      >
        Super Admin Dashboard
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="All Users" value="all" />
                <Tab label="Super Admins" value="super_admin" />
                <Tab label="Admins" value="admin" />
                <Tab label="Managers" value="manager" />
                <Tab label="Employees" value="employee" />
              </Tabs>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <IconButton>
                      <RefreshIcon onClick={fetchUsers} />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Paper elevation={3} sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableCell sx={{ color: "white" }}>User</TableCell>
                <TableCell sx={{ color: "white" }}>Email</TableCell>
                <TableCell sx={{ color: "white" }}>Role</TableCell>
                <TableCell sx={{ color: "white" }}>Manager</TableCell>
                <TableCell sx={{ color: "white" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <StyledTableRow key={user.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        sx={{ mr: 2, bgcolor: theme.palette.primary.main }}
                      >
                        {user.name.charAt(0)}
                      </Avatar>
                      {user.name}
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <RoleChip
                      label={user.role.replace("_", " ")}
                      role={user.role}
                    />
                  </TableCell>
                  <TableCell>{user.managerName || "N/A"}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="View Timesheets">
                        <IconButton
                          color="info"
                          onClick={() => handleViewTimesheets(user.id)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Edit User">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditUser(user)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      {user.role === "EMPLOYEE" && (
                        <>
                          <Tooltip title="Assign Manager">
                            <IconButton
                              color="secondary"
                              onClick={() => handleAssignManager(user)}
                            >
                              <AssignmentIndIcon />
                            </IconButton>
                          </Tooltip>

                          {user.managerId && (
                            <Tooltip title="Remove Manager">
                              <IconButton
                                color="warning"
                                onClick={() => handleRemoveManager(user.id)}
                              >
                                <PersonRemoveIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </>
                      )}

                      <Tooltip
                        title={
                          user.deleted ? "Reactivate User" : "Deactivate User"
                        }
                      >
                        <IconButton
                          color={user.deleted ? "success" : "error"}
                          onClick={() =>
                            user.deleted
                              ? handleReactivateUser(user.id)
                              : handleDeleteUser(user.id)
                          }
                        >
                          {user.deleted ? <PersonAddIcon /> : <DeleteIcon />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit User Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleUserSubmit} sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              defaultValue={currentUser?.name}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              type="email"
              defaultValue={currentUser?.email}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                label="Role"
                defaultValue={currentUser?.role}
                required
              >
                <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="MANAGER">Manager</MenuItem>
                <MenuItem value="EMPLOYEE">Employee</MenuItem>
              </Select>
            </FormControl>
            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Timesheet Dialog */}
      <Dialog
        open={openTimesheetDialog}
        onClose={() => setOpenTimesheetDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Timesheets for {currentUser?.name}
          <IconButton
            aria-label="close"
            onClick={() => setOpenTimesheetDialog(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Hours</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timesheets.map((timesheet) => (
                  <TableRow key={timesheet.id}>
                    <TableCell>{formatDate(timesheet.date)}</TableCell>
                    <TableCell>{timesheet.projectName}</TableCell>
                    <TableCell>{timesheet.hours}</TableCell>
                    <TableCell>{timesheet.description}</TableCell>
                  </TableRow>
                ))}
                {timesheets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No timesheets found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* Assign Manager Dialog */}
      <Dialog
        open={openManagerDialog}
        onClose={() => setOpenManagerDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{currentUser?.name}'s Manager Assignment</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="manager-label">Select Manager</InputLabel>
            <Select
              labelId="manager-label"
              id="manager"
              value={selectedManager}
              label="Select Manager"
              onChange={(e) => setSelectedManager(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {managers.map((manager) => (
                <MenuItem key={manager.id} value={manager.id}>
                  {manager.name} ({manager.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={() => setOpenManagerDialog(false)}>Cancel</Button>
            <Button
              onClick={handleManagerSubmit}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SDashboard;
