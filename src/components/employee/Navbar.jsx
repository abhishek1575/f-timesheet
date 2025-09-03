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
  Tooltip,
  Badge,
  Snackbar,
  Alert,
  Typography,
  Avatar,
  Divider,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { fetchUserById } from "../../service/userService";

import ChangePasswordModal from "../component/ChangePasswordModal";
import AddBoxSharpIcon from "@mui/icons-material/AddBoxSharp";
import CreateTimesheet from "../component/CreateTimesheet";
import DraftsIcon from "@mui/icons-material/Drafts";
import CancelIcon from "@mui/icons-material/Cancel";
import RejectedTimesheetDialog from "../component/RejectedTimesheetDialog";
import UserProfileDialog from "../component/UserProfileDialog";
import { getRejectedTimesheets } from "../../service/timesheetService";
import logo from "../../assets/logo.png";
import { Container } from "@mui/material";


export default function Navbar({ onTimesheetCreated }) {
  const [auth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [rejectedDialogOpen, setRejectedDialogOpen] = useState(false);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [showRejectedSnackbar, setShowRejectedSnackbar] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("userId");
      if (!token || !userId) return;

      const res = await fetchUserById(userId, token);
      setUser(res);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const fetchRejectedCount = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      const res = await getRejectedTimesheets(token);
      const count = Array.isArray(res) ? res.length : 0;
      setRejectedCount(count);

      if (count > 0 && !sessionStorage.getItem("shownRejectedPopup")) {
        setShowRejectedSnackbar(true);
        sessionStorage.setItem("shownRejectedPopup", "true");
      }
    } catch (error) {
      console.error("Error fetching rejected count", error);
      setRejectedCount(0);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchRejectedCount();
  }, []);

  const handleOpenTimesheet = () => setOpen(true);
  const handleCloseTimesheet = () => setOpen(false);
  const handleDraftClick = () => navigate("/draft-timesheets");
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleOpenChangePasswordModal = () => {
    setOpenChangePasswordModal(true);
    handleCloseMenu();
  };
  const handleCloseChangePasswordModal = () =>
    setOpenChangePasswordModal(false);

  const handleLogoutClick = () => {
    setOpenLogoutConfirm(true);
    handleCloseMenu();
  };
  const handleLogoutConfirm = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/Login");
    setOpenLogoutConfirm(false);
  };
  const handleLogoutCancel = () => setOpenLogoutConfirm(false);

  const handleOpenProfile = () => {
    setOpenProfileDialog(true);
    handleCloseMenu();
  };
  const handleCloseProfileDialog = () => setOpenProfileDialog(false);

  const handleRejectedDialogClose = () => {
    setRejectedDialogOpen(false);
    fetchRejectedCount();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          background: "linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)",
          color: "#fff",
          boxShadow: "none",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={logo}
                alt="CS Tech Logo"
                style={{ height: "40px", objectFit: "contain" }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip title="Add Timesheet" arrow placement="bottom">
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleOpenTimesheet}
                >
                  <AddBoxSharpIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="View Drafts" arrow placement="bottom">
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleDraftClick}
                >
                  <DraftsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rejected Timesheets" arrow placement="bottom">
                <IconButton onClick={() => setRejectedDialogOpen(true)}>
                  <Badge badgeContent={rejectedCount} color="error">
                    <CancelIcon color="error" />
                  </Badge>
                </IconButton>
              </Tooltip>

              {auth && (
                <>
                  <Box
                    onClick={handleMenu}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 1.5,
                      py: 0.8,
                      borderRadius: "999px",
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      color: "#fff",
                      cursor: "pointer",
                      transition: "0.3s",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                      },
                    }}
                  >
                    {user?.profilePhoto ? (
                      <Avatar
                        src={`data:image/jpeg;base64,${user.profilePhoto}`}
                        alt={user.fullName}
                        sx={{ width: 32, height: 32 }}
                      />
                    ) : (
                      <Avatar sx={{ width: 32, height: 32 }}>
                        <AccountCircle fontSize="small" />
                      </Avatar>
                    )}
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {sessionStorage.getItem("Name") || "User"}
                    </Typography>
                  </Box>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        borderRadius: 2,
                        minWidth: 220,
                        boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                        backgroundColor: "#fff",
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle2" color="text.primary">
                        {user?.fullName || sessionStorage.getItem("Name")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {user?.email || sessionStorage.getItem("Email")}
                      </Typography>
                    </Box>

                    <Divider />

                    <MenuItem onClick={handleOpenProfile}>
                      <Typography variant="body2">👤 Profile</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleOpenChangePasswordModal}>
                      <Typography variant="body2">
                        🔒 Change Password
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogoutClick}>
                      <Typography variant="body2" color="error">
                        🚪 Logout
                      </Typography>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

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
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            color="error"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open}
        onClose={() => {}}
        disableEscapeKeyDown
        fullWidth
        maxWidth={false}
        PaperProps={{
          sx: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            backgroundColor: "transparent",
            boxShadow: "none",
            m: 0,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <CreateTimesheet
            onCancel={handleCloseTimesheet}
            onTimesheetCreated={onTimesheetCreated}
          />
        </Box>
      </Dialog>

      <RejectedTimesheetDialog
        open={rejectedDialogOpen}
        onClose={handleRejectedDialogClose}
      />

      <Snackbar
        open={showRejectedSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowRejectedSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClick={() => {
            setShowRejectedSnackbar(false);
            setRejectedDialogOpen(true);
          }}
          severity="warning"
          sx={{ width: "100%", cursor: "pointer" }}
          elevation={6}
          variant="filled"
        >
          You have {rejectedCount} rejected timesheet
          {rejectedCount > 1 ? "s" : ""}. Click to review.
        </Alert>
      </Snackbar>
    </Box>
  );
}

