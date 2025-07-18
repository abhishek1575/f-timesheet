import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import GroupsIcon from "@mui/icons-material/Groups";
import GroupIcon from "@mui/icons-material/Group";
import AccountCircle from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../component/ChangePasswordModal";
import EditUserProfile from "../component/EditUserProfile";
import config from "../../service/config";
import PendingTimesheetDialog from "../manager/PendingTimesheetDialog";
import UserProfileDialog from "../component/UserProfileDialog";

const DashboardCard = ({ icon, title, subtitle, onClick }) => (
  <Card
    elevation={6}
    sx={{
      position: "relative",
      overflow: "hidden",
      borderRadius: "16px",
      transition: "transform 0.3s, box-shadow 0.3s",
      "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
      },
    }}
  >
    <Box
      onClick={onClick}
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
        cursor: "pointer",
        background: "linear-gradient(145deg, #37474F, #263238)",
        color: "white",
        textAlign: "center",
      }}
    >
      <Box sx={{ mb: 2 }}>{icon}</Box>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        {subtitle}
      </Typography>
    </Box>
  </Card>
);

export default function AdminDashboard() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [isUserDialogOpen, setUserDialogOpen] = useState(false);
  const [pendingTimesheets, setPendingTimesheets] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const navigate = useNavigate();

  const fetchPendingTimesheets = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${config.BASE_URL}sheets/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPendingTimesheets(data);
      } else {
        console.error("Failed to fetch pending timesheets");
        setPendingTimesheets([]);
      }
    } catch (error) {
      console.error("Error fetching pending timesheets:", error);
    }
  };

  useEffect(() => {
    fetchPendingTimesheets();
  }, []);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleOpenChangePasswordModal = () => {
    setOpenChangePasswordModal(true);
    handleCloseMenu();
  };
  const handleCloseChangePasswordModal = () => setOpenChangePasswordModal(false);
  const handleLogoutClick = () => {
    setOpenLogoutConfirm(true);
    handleCloseMenu();
  };
  const handleOpenProfile = () => {
    setOpenProfileDialog(true);
    handleCloseMenu();
  };
  const handleLogoutConfirm = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/Login");
    setOpenLogoutConfirm(false);
  };
  const handleLogoutCancel = () => setOpenLogoutConfirm(false);
  const handleCloseProfileDialog = () => setOpenProfileDialog(false);
  const openUserDialog = () => setUserDialogOpen(true);
  const closeUserDialog = () => setUserDialogOpen(false);

  const handleNotificationClick = async () => {
    await fetchPendingTimesheets();
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    fetchPendingTimesheets();
    window.dispatchEvent(new Event('timesheetsUpdated'));
  };

  const iconStyles = {
    fontSize: "3.5rem",
    color: "#FFC107",
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#ECEFF1" }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#263238",
          color: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="edit profile"
              sx={{ mr: 1 }}
              onClick={openUserDialog}
            >
              <EditIcon />
            </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Admin Dashboard
          </Typography>
          <IconButton size="large" onClick={handleMenu} color="inherit">
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            PaperProps={{
              sx: {
                backgroundColor: "#37474F",
                color: "white",
              },
            }}
          >
            <MenuItem onClick={handleOpenProfile}>Profile</MenuItem>
            <MenuItem onClick={handleOpenChangePasswordModal}>Change Password</MenuItem>
            <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={5} lg={4}>
            <DashboardCard
              icon={<GroupsIcon sx={iconStyles} />}
              title="Managers"
              subtitle="View Manager's Timesheets"
              onClick={() => navigate("/team-members")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={5} lg={4}>
            <DashboardCard
              icon={<GroupIcon sx={iconStyles} />}
              title="Employees"
              subtitle="Access and review timesheets"
              onClick={() => navigate("/employee-list")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={5} lg={4}>
            <DashboardCard
              icon={<FactCheckIcon sx={iconStyles} />}
              title="Pending Requests"
              subtitle={`${pendingTimesheets.length} pending requests`}
              onClick={handleNotificationClick}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Dialogs and Modals */}
      <ChangePasswordModal
        open={openChangePasswordModal}
        onClose={handleCloseChangePasswordModal}
      />
      <UserProfileDialog
        openProfileDialog={openProfileDialog}
        handleCloseProfileDialog={handleCloseProfileDialog}
      />
      <Dialog open={openLogoutConfirm} onClose={handleLogoutCancel}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>Are you sure you want to logout?</DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel}>Cancel</Button>
          <Button onClick={handleLogoutConfirm} variant="contained" color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <EditUserProfile open={isUserDialogOpen} onClose={closeUserDialog} />
      <PendingTimesheetDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        timesheets={pendingTimesheets}
        title="Pending Approval Requests"
      />
    </Box>
  );
}