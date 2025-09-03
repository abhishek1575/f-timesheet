import React, { useState, useEffect } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Toolbar,
  Box,
  AppBar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Badge,
  Snackbar,
  Alert,
  Container,
  Avatar,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../component/ChangePasswordModal";
import AddBoxSharpIcon from "@mui/icons-material/AddBoxSharp";
import CreateTimesheet from "../component/CreateTimesheet";
import DraftsIcon from "@mui/icons-material/Drafts";
import NotificationBadge from "../component/NotificationBadge";
import config from "../../service/config";
import PendingTimesheetDialog from "./PendingTimesheetDialog";
import CancelIcon from "@mui/icons-material/Cancel";
import RejectedTimesheetDialog from "../component/RejectedTimesheetDialog";
import UserProfileDialog from "../component/UserProfileDialog";
import { getRejectedTimesheets } from "../../service/timesheetService";
import { fetchUserById } from "../../service/userService";
import logo from "../../assets/logo.png";
import MenuIcon from "@mui/icons-material/Menu";

export default function MNavbar({ onTimesheetCreated }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [auth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [open, setOpen] = useState(false);
  const [pendingTimesheets, setPendingTimesheets] = useState([]);
  const [rejectedDialogOpen, setRejectedDialogOpen] = useState(false);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [showRejectedSnackbar, setShowRejectedSnackbar] = useState(false);
  const [showPendingSnackbar, setShowPendingSnackbar] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const handleProfileClick = (event) => setProfileAnchorEl(event.currentTarget);
  const closeProfileMenu = () => setProfileAnchorEl(null);
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

  const fetchPendingTimesheets = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${config.BASE_URL}sheets/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const newCount = Array.isArray(data) ? data.length : 0;
        setPendingCount((prevCount) => {
          if (newCount > prevCount) {
            setHasNewNotification(true);
            if (!sessionStorage.getItem("shownPendingPopup")) {
              setShowPendingSnackbar(true);
              sessionStorage.setItem("shownPendingPopup", "true");
            }
          }
          return newCount;
        });
        setPendingTimesheets(data);
      } else {
        console.error("Failed to fetch pending timesheets");
      }
    } catch (error) {
      console.error("Error fetching pending timesheets:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchRejectedCount();
    fetchPendingTimesheets();

    const interval = setInterval(fetchPendingTimesheets, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenTimesheet = () => setOpen(true);
    const handleCloseTimesheet = () => setOpen(false);

    // Navigate to Draft Timesheets
    const handleDraftClick = () => {
      navigate("/draft-timesheets");
    };

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogSource, setDialogSource] = useState("");

    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
      setAnchorEl(null);
    };

    const handleOpenChangePasswordModal = () => {
      setOpenChangePasswordModal(true);
      handleCloseMenu();
    };

    const handleCloseChangePasswordModal = () => {
      setOpenChangePasswordModal(false);
    };

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

    const handleLogoutCancel = () => {
      setOpenLogoutConfirm(false);
    };

    const handleOpenProfile = () => {
      setOpenProfileDialog(true);
      handleCloseMenu();
    };

    const handleCloseProfileDialog = () => {
      setOpenProfileDialog(false);
    };

    const handleNotificationClick = async () => {
      await fetchPendingTimesheets();
      setDialogSource("notification");
      setDialogOpen(true);
      setHasNewNotification(false); // Reset the pulse animation
    };

    const handleRejectedDialogClose = () => {
      setRejectedDialogOpen(false);
      fetchRejectedCount();
    };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          sx={{
            background: "linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)",
            color: "#fff",
            boxShadow: "none",
            zIndex: (theme) => theme.zIndex.drawer + 1,
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

              {/* Desktop View */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 1,
                }}
              >
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

                <Tooltip title="Team Members" arrow placement="bottom">
                  <IconButton
                    size="large"
                    color="inherit"
                    onClick={() => navigate("/team-members")}
                  >
                    <GroupsIcon />
                  </IconButton>
                </Tooltip>

                <NotificationBadge
                  count={pendingCount}
                  hasNew={hasNewNotification}
                  onClick={handleNotificationClick}
                  title="Pending Approval Requests"
                />

                <Tooltip title="Rejected Timesheet" arrow placement="bottom">
                  <IconButton onClick={() => setRejectedDialogOpen(true)}>
                    <Badge badgeContent={rejectedCount} color="error">
                      <CancelIcon color="error" />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {auth && (
                  <>
                    <Box
                      onClick={handleProfileClick}
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
                      anchorEl={profileAnchorEl}
                      open={Boolean(profileAnchorEl)}
                      onClose={closeProfileMenu}
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
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {user?.email || sessionStorage.getItem("Email")}
                        </Typography>
                      </Box>

                      <Divider />

                      <MenuItem
                        onClick={() => {
                          closeProfileMenu();
                          handleOpenProfile();
                        }}
                      >
                        <Typography variant="body2">👤 Profile</Typography>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          closeProfileMenu();
                          handleOpenChangePasswordModal();
                        }}
                      >
                        <Typography variant="body2">
                          🔒 Change Password
                        </Typography>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          closeProfileMenu();
                          handleLogoutClick();
                        }}
                      >
                        <Typography variant="body2" color="error">
                          🚪 Logout
                        </Typography>
                      </MenuItem>
                    </Menu>
                  </>
                )}
              </Box>

              {/* Mobile View */}
              <Box
                sx={{
                  display: { xs: "flex", md: "none" },
                  alignItems: "center",
                }}
              >
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={toggleMobileMenu}
                >
                  <MenuIcon />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={mobileMenuOpen}
                  onClose={toggleMobileMenu}
                  sx={{ display: { xs: "block", md: "none" } }}
                >
                  <MenuItem onClick={handleOpenTimesheet}>
                    <AddBoxSharpIcon sx={{ mr: 1 }} />
                    Add Timesheet
                  </MenuItem>
                  <MenuItem onClick={handleDraftClick}>
                    <DraftsIcon sx={{ mr: 1 }} />
                    View Drafts
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/team-members")}>
                    <GroupsIcon sx={{ mr: 1 }} />
                    Team Members
                  </MenuItem>
                  <MenuItem onClick={handleNotificationClick}>
                    <Badge
                      badgeContent={pendingCount}
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      <DraftsIcon />
                    </Badge>
                    Pending Approvals
                  </MenuItem>
                  <MenuItem onClick={() => setRejectedDialogOpen(true)}>
                    <Badge
                      badgeContent={rejectedCount}
                      color="error"
                      sx={{ mr: 1 }}
                    >
                      <CancelIcon />
                    </Badge>
                    Rejected Timesheets
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleProfileClick}>
                    <AccountCircle sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleOpenChangePasswordModal}>
                    <AccountCircle sx={{ mr: 1 }} />
                    Change Password
                  </MenuItem>
                  <MenuItem onClick={handleLogoutClick}>
                    <AccountCircle sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>

                {/* Mobile Profile Button */}
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleProfileClick}
                  sx={{ ml: 1 }}
                >
                  {user?.profilePhoto ? (
                    <Avatar
                      src={`data:image/jpeg;base64,${user.profilePhoto}`}
                      alt={user.fullName}
                      sx={{ width: 32, height: 32 }}
                    />
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Spacer to push content below fixed navbar */}
        <Toolbar />
      </Box>

      {/* Profile Menu for Mobile */}
      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={closeProfileMenu}
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

        <MenuItem
          onClick={() => {
            closeProfileMenu();
            handleOpenProfile();
          }}
        >
          <Typography variant="body2">👤 Profile</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeProfileMenu();
            handleOpenChangePasswordModal();
          }}
        >
          <Typography variant="body2">🔒 Change Password</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeProfileMenu();
            handleLogoutClick();
          }}
        >
          <Typography variant="body2" color="error">
            🚪 Logout
          </Typography>
        </MenuItem>
      </Menu>

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
          <CreateTimesheet onCancel={handleCloseTimesheet} />
        </Box>
      </Dialog>

      <PendingTimesheetDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        timesheets={pendingTimesheets}
        title={
          dialogSource === "notification"
            ? "Your Pending Timesheets"
            : "Pending Approval Requests"
        }
      />

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
      <Snackbar
        open={showPendingSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowPendingSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClick={() => {
            setShowPendingSnackbar(false);
            handleNotificationClick();
          }}
          severity="info"
          sx={{ width: "100%", cursor: "pointer" }}
          elevation={6}
          variant="filled"
        >
          You have {pendingCount} pending timesheet
          {pendingCount > 1 ? "s" : ""} for approval. Click to review.
        </Alert>
      </Snackbar>
    </>
  );
}
