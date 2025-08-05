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
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../component/ChangePasswordModal";
import AddBoxSharpIcon from "@mui/icons-material/AddBoxSharp";
import CreateTimesheet from "../component/CreateTimesheet";
import DraftsIcon from "@mui/icons-material/Drafts";
import CancelIcon from "@mui/icons-material/Cancel";
import RejectedTimesheetDialog from "../component/RejectedTimesheetDialog";
import UserProfileDialog from "../component/UserProfileDialog";
import NotificationBadge from "../component/NotificationBadge";
import { getRejectedTimesheets } from "../../service/timesheetService";

export default function Navbar() {
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [rejectedDialogOpen, setRejectedDialogOpen] = useState(false);
  const [rejectedTimesheets, setRejectedTimesheets] = useState([]);
  const [hasNewRejections, setHasNewRejections] = useState(false);
  const [lastCheckedCount, setLastCheckedCount] = useState(0); // Start with 0 instead of null
  const [hasCheckedInitially, setHasCheckedInitially] = useState(false); // Better naming

  const navigate = useNavigate();

  // Timesheet Dialog Handlers
  const handleOpenTimesheet = () => setOpen(true);
  const handleCloseTimesheet = () => setOpen(false);

  // Rejected Timesheets Logic
  const fetchRejectedTimesheets = async () => {
    try {
      const response = await getRejectedTimesheets();
      const currentRejected = response.data;

      console.log("Fetched rejected timesheets:", currentRejected.length);
      console.log("Has checked initially:", hasCheckedInitially);
      console.log("Last checked count:", lastCheckedCount);

      setRejectedTimesheets(currentRejected);

      // Always show notification if there are rejected timesheets and we haven't checked initially
      if (!hasCheckedInitially) {
        console.log("Initial check - rejected count:", currentRejected.length);
        if (currentRejected.length > 0) {
          console.log("Setting hasNewRejections to true on initial check");
          setHasNewRejections(true);
        }
        setHasCheckedInitially(true);
      } else {
        // On subsequent checks, show notification only if count increased
        if (currentRejected.length > lastCheckedCount) {
          console.log("New rejections detected - showing notification");
          setHasNewRejections(true);
        }
      }

      setLastCheckedCount(currentRejected.length);
      console.log("Updated hasNewRejections state:", hasNewRejections);
    } catch (error) {
      console.error("Error fetching rejected timesheets:", error);
    }
  };

  useEffect(() => {
    fetchRejectedTimesheets();
    const interval = setInterval(fetchRejectedTimesheets, 30000);
    return () => clearInterval(interval);
  }, []); // Remove lastCheckedCount dependency to avoid infinite re-renders

  // Notification click handler - only clears the notification popup
  const handleNotificationClick = () => {
    setHasNewRejections(false); // Just clear the notification popup
  };

  // Handle when rejected timesheet dialog closes - update the count
  const handleRejectedDialogClose = () => {
    setRejectedDialogOpen(false);
    // Refresh the rejected timesheets to get updated count after any actions
    fetchRejectedTimesheets();
  };

  // Menu Handlers
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleOpenChangePasswordModal = () => {
    setOpenChangePasswordModal(true);
    handleCloseMenu();
  };

  const handleCloseChangePasswordModal = () => {
    setOpenChangePasswordModal(false);
  };

  // Profile Handlers
  const handleOpenProfile = () => {
    setOpenProfileDialog(true);
    handleCloseMenu();
  };

  const handleCloseProfileDialog = () => {
    setOpenProfileDialog(false);
  };

  // Logout Handlers
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

  // Navigation Handlers
  const handleDraftClick = () => {
    navigate("/draft-timesheets");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#37474F", color: "#E0E0E0" }}
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

            {/* Separate Reject Timesheet Button */}
            <Tooltip title="Reject Timesheet" arrow placement="bottom">
              <IconButton onClick={() => setRejectedDialogOpen(true)}>
                <CancelIcon color="inherit" />
              </IconButton>
            </Tooltip>
          </Box>

          {auth && (
            <>
              {/* Notification Badge - shows count and red popup when new rejections */}
              <NotificationBadge
                count={rejectedTimesheets.length}
                hasNew={hasNewRejections}
                onClick={handleNotificationClick}
                title={`${rejectedTimesheets.length} rejected timesheets`}
              />

              {/* Rest of your auth content remains the same */}
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

              {/* All your existing dialogs remain unchanged */}
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
                onClose={handleCloseTimesheet}
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
                <Box sx={{ width: "100%", height: "100%" }}>
                  <CreateTimesheet onCancel={handleCloseTimesheet} />
                </Box>
              </Dialog>

              <RejectedTimesheetDialog
                open={rejectedDialogOpen}
                onClose={handleRejectedDialogClose}
              />
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
// import React, { useState, useEffect } from "react";
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
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import AccountCircle from "@mui/icons-material/AccountCircle";
// import { useNavigate } from "react-router-dom";
// import ChangePasswordModal from "../component/ChangePasswordModal";
// import AddBoxSharpIcon from "@mui/icons-material/AddBoxSharp";
// import CreateTimesheet from "../component/CreateTimesheet";
// import DraftsIcon from "@mui/icons-material/Drafts";
// import EditUserProfile from "../component/EditUserProfile";
// import CancelIcon from "@mui/icons-material/Cancel";
// import RejectedTimesheetDialog from "../component/RejectedTimesheetDialog";
// import UserProfileDialog from "../component/UserProfileDialog";
// import NotificationBadge from "../component/NotificationBadge";
// import { getRejectedTimesheets } from "../../service/timesheetService";

// export default function Navbar() {
//   const [auth, setAuth] = useState(true);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
//   const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
//   const [openProfileDialog, setOpenProfileDialog] = useState(false);

//   const [open, setOpen] = useState(false);
//   const handleOpenTimesheet = () => setOpen(true);
//   const handleCloseTimesheet = () => setOpen(false);

//   const [isUserDialogOpen, setUserDialogOpen] = useState(false);
//   const openUserDialog = () => setUserDialogOpen(true);
//   const closeUserDialog = () => setUserDialogOpen(false);

//   const [rejectedDialogOpen, setRejectedDialogOpen] = useState(false);
//   const [rejectedCount, setRejectedCount] = useState(0);

//   // Navigate to Draft Timesheets

//   const navigate = useNavigate();
//   const handleDraftClick = () => {
//     navigate("/draft-timesheets");
//   };

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

//    const handleOpenProfile = () => {
//      setOpenProfileDialog(true);
//      handleCloseMenu(); // optional to close the menu
//    };

//    const handleCloseProfileDialog = () => {
//      setOpenProfileDialog(false);
//    };

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
//           {/* <Tooltip title="Assign Manager" arrow placement="bottom">
//             <IconButton
//               size="large"
//               edge="start"
//               color="inherit"
//               sx={{ mr: 2 }}
//               onClick={openUserDialog}
//             >
//               <MenuIcon />
//             </IconButton>
//           </Tooltip> */}

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
//             <Tooltip title="Reject Timesheet" arrow placement="bottom">
//               <IconButton onClick={() => setRejectedDialogOpen(true)}>
//                 <CancelIcon color="error" />
//               </IconButton>
//             </Tooltip>
//           </Box>
//           {auth && (
//             <>
//               <NotificationBadge
//                 count={rejectedCount}
//                 title="Rejected Timesheets"
//               />
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
//               {/* <EditUserProfile
//                 open={isUserDialogOpen}
//                 onClose={closeUserDialog}
//               /> */}

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
