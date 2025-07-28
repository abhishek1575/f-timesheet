import React, { useState,  } from "react";
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
import CancelIcon from "@mui/icons-material/Cancel";
import RejectedTimesheetDialog from "../component/RejectedTimesheetDialog";
import UserProfileDialog from "../component/UserProfileDialog";
import RegisterEmployeeDialog from "./RegisterEmployee";

export default function MNavbar() {
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [open, setOpen] = useState(false);

  // Added states from the first snippet
  const [isUserDialogOpen, setUserDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setRegisterDialogOpen] = useState(false);

  const [pendingTimesheets, setPendingTimesheets] = useState([]);
  const [rejectedDialogOpen, setRejectedDialogOpen] = useState(false);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null); // for MenuIcon
  const [profileAnchorEl, setProfileAnchorEl] = useState(null); // for AccountCircle

  const handleMenuClick = (event) => setMenuAnchorEl(event.currentTarget);
  const handleProfileClick = (event) => setProfileAnchorEl(event.currentTarget);

  const closeMenu = () => setMenuAnchorEl(null);
  const closeProfileMenu = () => setProfileAnchorEl(null);


  const navigate = useNavigate();

  const handleOpenTimesheet = () => setOpen(true);
  const handleCloseTimesheet = () => setOpen(false);

  // Updated functions to handle both original and new functionality
  const openUserDialog = () => setUserDialogOpen(true);
  const closeUserDialog = () => setUserDialogOpen(false);

  // Added functions from the first snippet
  const handleEditProfile = () => {
    handleCloseMenu();
    setUserDialogOpen(true);
  };

  const handleRegisterEmployee = () => {
    handleCloseMenu();
    setRegisterDialogOpen(true);
  };

  const closeRegisterDialog = () => setRegisterDialogOpen(false);

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

  const fetchPendingTimesheets = async () => {
    const token = sessionStorage.getItem("token");
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
          <Tooltip title="Menu" arrow placement="bottom">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              onClick={handleMenuClick}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={closeMenu}
          >
            <MenuItem
              onClick={() => {
                closeMenu();
                setUserDialogOpen(true);
              }}
            >
              Edit User Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                closeMenu();
                setRegisterDialogOpen(true);
              }}
            >
              Register Employee
            </MenuItem>
          </Menu>

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

              <EditUserProfile
                open={isUserDialogOpen}
                onClose={closeUserDialog}
              />

              {/* Register Employee Dialog with custom styling */}
              {isRegisterDialogOpen && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 1300,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={closeRegisterDialog}
                >
                  <div onClick={(e) => e.stopPropagation()}>
                    <RegisterEmployeeDialog
                      open={isRegisterDialogOpen}
                      onClose={closeRegisterDialog}
                    />
                  </div>
                </div>
              )}

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
                  // Prevent closing on backdrop click or ESC key
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
  );
}

// import React, { useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Typography,
//   Box,
//   Menu,
//   MenuItem,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Tooltip,
//   Badge,
// } from "@mui/material";
// import FactCheckIcon from "@mui/icons-material/FactCheck";
// import GroupsIcon from "@mui/icons-material/Groups";
// import MenuIcon from "@mui/icons-material/Menu";
// import AccountCircle from "@mui/icons-material/AccountCircle";
// import { useNavigate } from "react-router-dom";
// import ChangePasswordModal from "../component/ChangePasswordModal";
// import AddBoxSharpIcon from "@mui/icons-material/AddBoxSharp";
// import CreateTimesheet from "../component/CreateTimesheet";
// import DraftsIcon from "@mui/icons-material/Drafts";
// import EditUserProfile from "../component/EditUserProfile";
// import NotificationBadge from "../component/NotificationBadge";
// import config from "../../service/config";
// import PendingTimesheetDialog from "./PendingTimesheetDialog";
// import CancelIcon from "@mui/icons-material/Cancel";
// import RejectedTimesheetDialog from "../component/RejectedTimesheetDialog";
// import UserProfileDialog from "../component/UserProfileDialog";

// export default function MNavbar() {
//   const [auth, setAuth] = useState(true);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
//   const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
//   const [openProfileDialog, setOpenProfileDialog] = useState(false);
//   const [pendingCount, setPendingCount] = useState(0);
//   const [open, setOpen] = useState(false);
//   const handleOpenTimesheet = () => setOpen(true);
//   const handleCloseTimesheet = () => setOpen(false);

//   const [isUserDialogOpen, setUserDialogOpen] = useState(false);
//   const openUserDialog = () => setUserDialogOpen(true);
//   const closeUserDialog = () => setUserDialogOpen(false);

//   const [pendingTimesheets, setPendingTimesheets] = useState([]);
//   const [rejectedDialogOpen, setRejectedDialogOpen] = useState(false);

//   // Navigate to Draft Timesheets

//   const navigate = useNavigate();
//   const handleDraftClick = () => {
//     navigate("/draft-timesheets");
//   };

//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
//   const [dialogSource, setDialogSource] = useState("");

//   const handleMenu = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleCloseMenu = () => {
//     setAnchorEl(null);
//   };

//   const handleOpenChangePasswordModal = () => {
//     setOpenChangePasswordModal(true);
//     handleCloseMenu();
//   };

//   const handleCloseChangePasswordModal = () => {
//     setOpenChangePasswordModal(false);
//   };

//   const handleLogoutClick = () => {
//     setOpenLogoutConfirm(true);
//     handleCloseMenu();
//   };

//   const handleLogoutConfirm = () => {
//     sessionStorage.clear();
//     localStorage.clear();
//     navigate("/Login");
//     setOpenLogoutConfirm(false);
//   };

//   const handleLogoutCancel = () => {
//     setOpenLogoutConfirm(false);
//   };

//   const handleOpenProfile = () => {
//     setOpenProfileDialog(true);
//     handleCloseMenu();
//   };

//   const handleCloseProfileDialog = () => {
//     setOpenProfileDialog(false);
//   };

//   const fetchPendingTimesheets = async () => {
//     const token = sessionStorage.getItem("token");
//     const res = await fetch(`${config.BASE_URL}sheets/pending`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     setPendingTimesheets(data);
//   };
//   const handleFactCheckClick = async () => {
//     await fetchPendingTimesheets();
//     setDialogSource("factCheck");
//     setDialogOpen(true);
//   };

//   // const handleNotificationClick = async () => {
//   //   await fetchPendingTimesheets();
//   //   setDialogOpen(true);
//   // };

//   const handleNotificationClick = async () => {
//     await fetchPendingTimesheets();
//     setDialogSource("notification");
//     setDialogOpen(true);
//   };

//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <AppBar
//         position="static"
//         sx={{
//           backgroundColor: "#37474F", // Deep dark gray (Almost black)
//           color: "#E0E0E0",
//         }}
//       >
//         <Toolbar>
//           <Tooltip title="Assign Manager" arrow placement="bottom">
//             <IconButton
//               size="large"
//               edge="start"
//               color="inherit"
//               sx={{ mr: 2 }}
//               onClick={openUserDialog}
//             >
//               <MenuIcon />
//             </IconButton>
//           </Tooltip>

//           <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
//             <Tooltip title="Add Timesheet" arrow placement="bottom">
//               <IconButton
//                 size="large"
//                 color="inherit"
//                 onClick={handleOpenTimesheet}
//               >
//                 <AddBoxSharpIcon />
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="View Drafts" arrow placement="bottom">
//               <IconButton
//                 size="large"
//                 color="inherit"
//                 onClick={handleDraftClick}
//               >
//                 <DraftsIcon />
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="Team Members" arrow placement="bottom">
//               <IconButton
//                 size="large"
//                 color="inherit"
//                 onClick={() => navigate("/team-members")}
//               >
//                 <GroupsIcon />
//               </IconButton>
//             </Tooltip>

//             <Tooltip title="Approve Requests" arrow placement="bottom">
//               <IconButton
//                 size="large"
//                 color="inherit"
//                 onClick={handleNotificationClick}
//               >
//                 <FactCheckIcon />
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="Reject Timesheet" arrow placement="bottom">
//               <IconButton onClick={() => setRejectedDialogOpen(true)}>
//                 <CancelIcon color="error" />
//               </IconButton>
//             </Tooltip>

//             {/* Notification Button with Popover */}
//           </Box>
//           {auth && (
//             <>
//               <NotificationBadge />

//               <IconButton size="large" onClick={handleMenu} color="inherit">
//                 <AccountCircle />
//               </IconButton>
//               <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleCloseMenu}
//               >
//                 <MenuItem onClick={handleOpenProfile}>Profile</MenuItem>
//                 <MenuItem onClick={handleOpenChangePasswordModal}>
//                   Change Password
//                 </MenuItem>
//                 <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
//               </Menu>
//               {/* Change Password Modal */}
//               <ChangePasswordModal
//                 open={openChangePasswordModal}
//                 onClose={handleCloseChangePasswordModal}
//               />

//               <UserProfileDialog
//                 openProfileDialog={openProfileDialog}
//                 handleCloseProfileDialog={handleCloseProfileDialog}
//               />

//               {/* Logout Confirmation Dialog */}
//               <Dialog open={openLogoutConfirm} onClose={handleLogoutCancel}>
//                 <DialogTitle>Confirm Logout</DialogTitle>
//                 <DialogContent>Are you sure you want to logout?</DialogContent>
//                 <DialogActions>
//                   <Button onClick={handleLogoutCancel}>Cancel</Button>
//                   <Button
//                     onClick={handleLogoutConfirm}
//                     variant="contained"
//                     color="error"
//                   >
//                     Confirm
//                   </Button>
//                 </DialogActions>
//               </Dialog>
//               <Dialog
//                 open={open}
//                 onClose={() => {}}
//                 disableEscapeKeyDown
//                 fullWidth
//                 maxWidth={false} // Disable max width
//                 PaperProps={{
//                   sx: {
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     height: "100%",
//                     backgroundColor: "transparent",
//                     boxShadow: "none",
//                     m: 0,
//                   },
//                 }}
//               >
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     width: "100%",
//                     height: "100%",
//                   }}
//                 >
//                   <CreateTimesheet onCancel={handleCloseTimesheet} />
//                 </Box>
//               </Dialog>
//               <EditUserProfile
//                 open={isUserDialogOpen}
//                 onClose={closeUserDialog}
//               />

//               <PendingTimesheetDialog
//                 open={dialogOpen}
//                 onClose={() => setDialogOpen(false)}
//                 timesheets={pendingTimesheets}
//                 title={
//                   dialogSource === "notification"
//                     ? "Your Pending Timesheets"
//                     : "Pending Approval Requests"
//                 }
//               />

//               <RejectedTimesheetDialog
//                 open={rejectedDialogOpen}
//                 onClose={(event, reason) => {
//                   // Prevent closing on backdrop click or ESC key
//                   if (
//                     reason !== "backdropClick" &&
//                     reason !== "escapeKeyDown"
//                   ) {
//                     setRejectedDialogOpen(false);
//                   }
//                 }}
//               />
//             </>
//           )}
//         </Toolbar>
//       </AppBar>
//     </Box>
//   );
// }
