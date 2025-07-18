import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { fetchUserById } from "../../service/userService"; // adjust the path as needed

const UserProfileDialog = ({ openProfileDialog, handleCloseProfileDialog }) => {
  const [userDetails, setUserDetails] = useState({
    name: "N/A",
    email: "N/A",
    role: "N/A",
    managerName: "N/A",
  });

  const userId = sessionStorage.getItem("UserId");
  const token = sessionStorage.getItem("token");

  console.log("UserId from UserProfileDialog:", sessionStorage.getItem("UserId"));
  console.log("Token from UserProfileDialog:", sessionStorage.getItem("token"));


  useEffect(() => {
    const loadUserData = async () => {
      if (userId && token) {
        try {
          console.log("Fetching user by ID:", userId);
          const data = await fetchUserById(userId, token);
          console.log("Fetched user data:", data);
          setUserDetails({
            name: data.name,
            email: data.email,
            role: data.role,
            managerName: data.managerName || "N/A",
          });
        } catch (err) {
          console.error("Failed to fetch user data:", err);
        }
      }else{
        console.warn("User ID or token is not available in session storage.");
      }
    };

    if (openProfileDialog) {
      loadUserData();
    }
  }, [openProfileDialog, userId, token]);

  return (
    <Dialog
      open={openProfileDialog}
      onClose={handleCloseProfileDialog}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle
        sx={{
          backgroundColor: "#212121",
          color: "#ffffff",
          textAlign: "center",
          fontWeight: 600,
          fontSize: "1.3rem",
        }}
      >
        User Profile
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: "#2c2c2c", color: "#e0e0e0" }}>
        <Box display="flex" flexDirection="column" alignItems="center" py={2}>
          <Avatar sx={{ bgcolor: "#1976d2", width: 64, height: 64, mb: 1 }}>
            <PersonIcon />
          </Avatar>
          <Typography variant="h6">{userDetails.name}</Typography>
          <Typography variant="body2" sx={{ color: "#bdbdbd", mb: 2 }}>
            {userDetails.email}
          </Typography>
        </Box>

        <Divider sx={{ backgroundColor: "#555" }} />

        <Box py={2} px={1}>
          <Typography sx={{ mb: 1 }}>
            <strong>Role:</strong> {userDetails.role}
          </Typography>
          <Typography>
            <strong>Manager:</strong> {userDetails.managerName}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{ backgroundColor: "#212121", justifyContent: "center" }}
      >
        <Button
          onClick={handleCloseProfileDialog}
          variant="outlined"
          sx={{
            color: "#ffffff",
            borderColor: "#9e9e9e",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#424242",
              borderColor: "#ffffff",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserProfileDialog;

// // src/components/UserProfileDialog.jsx
// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Typography,
//   Divider,
//   Button,
//   Box,
//   Avatar,
// } from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";

// const UserProfileDialog = ({ openProfileDialog, handleCloseProfileDialog }) => {
//   const userName = sessionStorage.getItem("Name") || "N/A";
//   const userEmail = sessionStorage.getItem("Email") || "N/A";
//   const userRole = sessionStorage.getItem("Role") || "N/A";
//   const userManager = sessionStorage.getItem("Manager") || "N/A";
//   console.log("User Profile Information:");
//   console.log("Name:", userName);
//   console.log("Email:", userEmail);
//   console.log("Role:", userRole);
//   console.log("Manager:", userManager);

//   return (
//     <Dialog open={openProfileDialog} onClose={handleCloseProfileDialog} maxWidth="xs" fullWidth>
//       <DialogTitle
//         sx={{
//           backgroundColor: "#212121",
//           color: "#ffffff",
//           textAlign: "center",
//           fontWeight: 600,
//           fontSize: "1.3rem",
//         }}
//       >
//         User Profile
//       </DialogTitle>

//       <DialogContent sx={{ backgroundColor: "#2c2c2c", color: "#e0e0e0" }}>
//         <Box display="flex" flexDirection="column" alignItems="center" py={2}>
//           <Avatar sx={{ bgcolor: "#1976d2", width: 64, height: 64, mb: 1 }}>
//             <PersonIcon />
//           </Avatar>
//           <Typography variant="h6">{userName}</Typography>
//           <Typography variant="body2" sx={{ color: "#bdbdbd", mb: 2 }}>
//             {userEmail}
//           </Typography>
//         </Box>

//         <Divider sx={{ backgroundColor: "#555" }} />

//         <Box py={2} px={1}>
//           <Typography sx={{ mb: 1 }}>
//             <strong>Role:</strong> {userRole}
//           </Typography>
//           <Typography>
//             <strong>Manager:</strong> {userManager}
//           </Typography>
//         </Box>
//       </DialogContent>

//       <DialogActions sx={{ backgroundColor: "#212121", justifyContent: "center" }}>
//         <Button
//           onClick={handleCloseProfileDialog}
//           variant="outlined"
//           sx={{
//             color: "#ffffff",
//             borderColor: "#9e9e9e",
//             textTransform: "none",
//             "&:hover": {
//               backgroundColor: "#424242",
//               borderColor: "#ffffff",
//             },
//           }}
//         >
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default UserProfileDialog;
