import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
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
} from "@mui/material";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../component/ChangePasswordModal";
import AddBoxSharpIcon from "@mui/icons-material/AddBoxSharp";
import CreateTimesheet from "../component/CreateTimesheet";
import DraftsIcon from "@mui/icons-material/Drafts";
import EditUserProfile from "../component/EditUserProfile";
import NotificationBadge from "../component/NotificationBadge";
import config from "../../service/config";
import PendingTimesheetDialog from "./PendingTimesheetDialog";

export default function MNavbar() {
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [open, setOpen] = useState(false);
  const handleOpenTimesheet = () => setOpen(true);
  const handleCloseTimesheet = () => setOpen(false);

  const [isUserDialogOpen, setUserDialogOpen] = useState(false);
  const openUserDialog = () => setUserDialogOpen(true);
  const closeUserDialog = () => setUserDialogOpen(false);

  const [pendingTimesheets, setPendingTimesheets] = useState([]);

  // Navigate to Draft Timesheets

  const navigate = useNavigate();
  const handleDraftClick = () => {
    navigate("/draft-timesheets");
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [dialogSource, setDialogSource] = useState("");


  // Load user details from sessionStorage
  const userName = sessionStorage.getItem("Name") || "N/A";
  const userEmail = sessionStorage.getItem("Email") || "N/A";
  const userRole = sessionStorage.getItem("Role") || "N/A";
  const userManager = sessionStorage.getItem("Manager") || "N/A";

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

  const fetchPendingTimesheets = async () => {
    const token = sessionStorage.getItem("token")
    const res = await fetch(`${config.BASE_URL}sheets/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPendingTimesheets(data);
  };
  const handleFactCheckClick = async () => {
    await fetchPendingTimesheets();
    setDialogSource("factCheck");
    setDialogOpen(true);
  };

  // const handleNotificationClick = async () => {
  //   await fetchPendingTimesheets();
  //   setDialogOpen(true);
  // };

  const handleNotificationClick = async () => {
    await fetchPendingTimesheets();
    setDialogSource("notification");
    setDialogOpen(true);
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
          <Tooltip title="Assign Manager" arrow placement="bottom">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
              onClick={openUserDialog}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

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

            {/* <Tooltip title="Approve Requests" arrow placement="bottom">
              <IconButton
                size="large"
                color="inherit"
                onClick={() => setApprovalDialogOpen(true)}
              >
                <FactCheckIcon />
              </IconButton>
            </Tooltip> */}
            <Tooltip title="Approve Requests" arrow placement="bottom">
              <IconButton
                size="large"
                color="inherit"
                onClick={handleNotificationClick}
              >
                <FactCheckIcon />
              </IconButton>
            </Tooltip>

            {/* Notification Button with Popover */}
          </Box>
          {auth && (
            <>
              <NotificationBadge  />
              

              <IconButton size="large" onClick={handleMenu} color="inherit">
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={handleOpenProfile}>Profile</MenuItem>
                <MenuItem onClick={handleOpenChangePasswordModal}>
                  Change Password
                </MenuItem>
                <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
              </Menu>
              {/* Change Password Modal */}
              <ChangePasswordModal
                open={openChangePasswordModal}
                onClose={handleCloseChangePasswordModal}
              />
              {/* Profile Dialog */}
              <Dialog
                open={openProfileDialog}
                onClose={handleCloseProfileDialog}
              >
                <DialogTitle>User Profile</DialogTitle>
                <DialogContent>
                  <Typography>
                    <strong>Name:</strong> {userName}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong> {userEmail}
                  </Typography>
                  <Typography>
                    <strong>Role:</strong> {userRole}
                  </Typography>
                  <Typography>
                    <strong>Manager:</strong> {userManager}
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseProfileDialog}>Close</Button>
                </DialogActions>
              </Dialog>
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
              <EditUserProfile
                open={isUserDialogOpen}
                onClose={closeUserDialog}
              />

              {/* <PendingTimesheetDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                timesheets={pendingTimesheets}
              /> */}
              {/* <PendingTimesheetDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                timesheets={pendingTimesheets}
                title="Pending Approval Requests"
              /> */}
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

              {/* <Dialog
                open={approvalDialogOpen}
                onClose={() => setApprovalDialogOpen(false)}
                fullWidth
                maxWidth="md"
              >
                <DialogTitle>Approval Requests</DialogTitle>
                <DialogContent>
                  <Typography>
                    Here you can display pending approval requests...
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setApprovalDialogOpen(false)}>
                    Close
                  </Button>
                </DialogActions>
              </Dialog> */}
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

