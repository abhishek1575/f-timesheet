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
} from "@mui/material";
import FactCheckIcon from "@mui/icons-material/FactCheck";
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

export default function MNavbar() {
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [pendingTimesheets, setPendingTimesheets] = useState([]);
  const [rejectedDialogOpen, setRejectedDialogOpen] = useState(false);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [showRejectedSnackbar, setShowRejectedSnackbar] = useState(false);
  const [showPendingSnackbar, setShowPendingSnackbar] = useState(false);

  const [profileAnchorEl, setProfileAnchorEl] = useState(null); // for AccountCircle

  const handleProfileClick = (event) => setProfileAnchorEl(event.currentTarget);

  const closeProfileMenu = () => setProfileAnchorEl(null);

  const navigate = useNavigate();

  const fetchRejectedCount = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      const res = await getRejectedTimesheets(token);
      console.log("REJECTED RES DATA:", res);

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
    const res = await fetch(`${config.BASE_URL}sheets/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPendingTimesheets(data);
    setPendingCount(data.length);

    if (data.length > 0 && !sessionStorage.getItem("shownPendingPopup")) {
      setShowPendingSnackbar(true);
      sessionStorage.setItem("shownPendingPopup", "true");
    }
  };

  useEffect(() => {
    fetchRejectedCount();
    fetchPendingTimesheets();
  }, []);

  const handleOpenTimesheet = () => setOpen(true);
  const handleCloseTimesheet = () => setOpen(false);

  // Navigate to Draft Timesheets
  const handleDraftClick = () => {
    navigate("/draft-timesheets");
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
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

  const handleFactCheckClick = async () => {
    await fetchPendingTimesheets();
    setDialogSource("factCheck");
    setDialogOpen(true);
  };

  const handleNotificationClick = async () => {
    await fetchPendingTimesheets();
    setDialogSource("notification");
    setDialogOpen(true);
  };

  const handleRejectedDialogClose = () => {
    setRejectedDialogOpen(false);
    fetchRejectedCount();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#37474F", // Deep dark gray (Almost black)
          color: "#E0E0E0",
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
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

            <Tooltip title="Approve Requests" arrow placement="bottom">
              <IconButton
                size="large"
                color="inherit"
                onClick={handleNotificationClick}
              >
                <Badge badgeContent={pendingCount} color="error">
                  <FactCheckIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Rejected Timesheet" arrow placement="bottom">
              <IconButton onClick={() => setRejectedDialogOpen(true)}>
                <Badge badgeContent={rejectedCount} color="error">
                  <CancelIcon color="error" />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>

          {auth && (
            <>
              <NotificationBadge />
              <IconButton
                size="large"
                color="inherit"
                onClick={handleProfileClick}
              >
                <AccountCircle />
              </IconButton>

              {/* Updated Menu with additional items */}
              <Menu
                anchorEl={profileAnchorEl}
                open={Boolean(profileAnchorEl)}
                onClose={closeProfileMenu}
              >
                <MenuItem
                  onClick={() => {
                    closeProfileMenu();
                    handleOpenProfile();
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    closeProfileMenu();
                    handleOpenChangePasswordModal();
                  }}
                >
                  Change Password
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    closeProfileMenu();
                    handleLogoutClick();
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>

              {/* Change Password Modal */}
              <ChangePasswordModal
                open={openChangePasswordModal}
                onClose={handleCloseChangePasswordModal}
              />

              <UserProfileDialog
                openProfileDialog={openProfileDialog}
                handleCloseProfileDialog={handleCloseProfileDialog}
              />

              {/* Logout Confirmation Dialog */}
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
                maxWidth={false} // Disable max width
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
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
