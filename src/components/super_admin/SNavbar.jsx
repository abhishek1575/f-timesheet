import React, { useState } from "react";
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
import NotificationBadge from "../component/NotificationBadge";
import config from "../../service/config";
import PendingTimesheetDialog from "../manager/PendingTimesheetDialog";
import CancelIcon from "@mui/icons-material/Cancel";
import RejectedTimesheetDialog from "../component/RejectedTimesheetDialog";
import UserProfileDialog from "../component/UserProfileDialog";
import CreateProjectModal from "./CreateProjectModal";
import AssignManagerModal from "./AssignManagerModal";
import AddMemberModal from "./AddMemberModal";
import AuditLogs from "./AuditLogs";
import ViewProjects from "./ViewProjects";

export default function SNavbar() {
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminMenuAnchorEl, setAdminMenuAnchorEl] = useState(null);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpenTimesheet = () => setOpen(true);
  const handleCloseTimesheet = () => setOpen(false);

  const [pendingTimesheets, setPendingTimesheets] = useState([]);
  const [rejectedDialogOpen, setRejectedDialogOpen] = useState(false);

  const [isCreateProjectModalOpen, setCreateProjectModalOpen] = useState(false);
  const [isAssignManagerModalOpen, setAssignManagerModalOpen] = useState(false);
  const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [isAuditLogsOpen, setAuditLogsOpen] = useState(false);
  const [isViewProjectsOpen, setViewProjectsOpen] = useState(false);

  const navigate = useNavigate();
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

  const handleAdminMenuOpen = (event) => {
    setAdminMenuAnchorEl(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminMenuAnchorEl(null);
  };

  const handleCreateProject = () => {
    setCreateProjectModalOpen(true);
    handleAdminMenuClose();
  };

  const handleAssignManager = () => {
    setAssignManagerModalOpen(true);
    handleAdminMenuClose();
  };

  const handleAddMember = () => {
    setAddMemberModalOpen(true);
    handleAdminMenuClose();
  };

  const handleViewProjects = () => {
    setViewProjectsOpen(true);
    handleAdminMenuClose();
  };

  const handleAuditLogs = () => {
    setAuditLogsOpen(true);
    handleAdminMenuClose();
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
    const token = sessionStorage.getItem("token");
    const res = await fetch(`${config.BASE_URL}sheets/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPendingTimesheets(data);
  };

  const handleNotificationClick = async () => {
    await fetchPendingTimesheets();
    setDialogSource("notification");
    setDialogOpen(true);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#37474F",
            color: "#E0E0E0",
          }}
        >
          <Toolbar>
            <Tooltip title="Admin Actions" arrow placement="bottom">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                sx={{ mr: 2 }}
                onClick={handleAdminMenuOpen}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={adminMenuAnchorEl}
              open={Boolean(adminMenuAnchorEl)}
              onClose={handleAdminMenuClose}
            >
              <MenuItem onClick={handleCreateProject}>Create Project</MenuItem>
              <MenuItem onClick={handleAssignManager}>Assign Manager</MenuItem>
              <MenuItem onClick={handleAddMember}>Add Team Member</MenuItem>
              <MenuItem onClick={handleViewProjects}>View All Projects</MenuItem>
              <MenuItem onClick={handleAuditLogs}>Audit Logs</MenuItem>
            </Menu>

            <Box
              sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
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

              <Tooltip title="Approve Requests" arrow placement="bottom">
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleNotificationClick}
                >
                  <FactCheckIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject Timesheet" arrow placement="bottom">
                <IconButton onClick={() => setRejectedDialogOpen(true)}>
                  <CancelIcon color="error" />
                </IconButton>
              </Tooltip>
            </Box>
            {auth && (
              <>
                <NotificationBadge />

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
                  <DialogContent>
                    Are you sure you want to logout?
                  </DialogContent>
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
                  onClose={(event, reason) => {
                    if (
                      reason !== "backdropClick" &&
                      reason !== "escapeKeyDown"
                    ) {
                      setRejectedDialogOpen(false);
                    }
                  }}
                />
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <CreateProjectModal
        open={isCreateProjectModalOpen}
        onClose={() => setCreateProjectModalOpen(false)}
      />
      <AssignManagerModal
        open={isAssignManagerModalOpen}
        onClose={() => setAssignManagerModalOpen(false)}
      />
      <AddMemberModal
        open={isAddMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
      />
      <Dialog
        open={isAuditLogsOpen}
        onClose={() => setAuditLogsOpen(false)}
        fullWidth
        maxWidth="lg"
        PaperProps={{ sx: { overflowY: "auto" } }}
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#2d3748" }}>
          Audit Log
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 1, sm: 2 } }}>
          <AuditLogs />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAuditLogsOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isViewProjectsOpen}
        onClose={() => setViewProjectsOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { overflowY: "auto" } }}
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#2d3748" }}>
          All Projects
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 1, sm: 2 } }}>
          <ViewProjects />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewProjectsOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

