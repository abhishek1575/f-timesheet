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
import { fetchUserById } from "../../service/userService";

const UserProfileDialog = ({ openProfileDialog, handleCloseProfileDialog }) => {
  const [userDetails, setUserDetails] = useState({
    name: "N/A",
    email: "N/A",
    role: "N/A",
    managerName: "N/A",
  });

  const userId = sessionStorage.getItem("UserId");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const loadUserData = async () => {
      if (userId && token) {
        try {
          const data = await fetchUserById(userId, token);
          let managerName;

          if (data.role === "Manager") {
            managerName = "BU HEAD"; // Always override for Manager role
          } else {
            managerName = data.managerName || "N/A";
          }

          setUserDetails({
            name: data.name || "N/A",
            email: data.email || "N/A",
            role: data.role || "N/A",
            managerName,
          });
        } catch (err) {
          console.error("Failed to fetch user data:", err);
        }
      } else {
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

// import React, { useEffect, useState } from "react";
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
// import { fetchUserById } from "../../service/userService"; // adjust the path as needed

// const UserProfileDialog = ({ openProfileDialog, handleCloseProfileDialog }) => {
//   const [userDetails, setUserDetails] = useState({
//     name: "N/A",
//     email: "N/A",
//     role: "N/A",
//     managerName: "N/A",
//   });

//   const userId = sessionStorage.getItem("UserId");
//   const token = sessionStorage.getItem("token");

//   useEffect(() => {
//     const loadUserData = async () => {
//       if (userId && token) {
//         try {
//           console.log("Fetching user by ID:", userId);
//           const data = await fetchUserById(userId, token);
//           console.log("Fetched user data:", data);
//           setUserDetails({
//             name: data.name,
//             email: data.email,
//             role: data.role,
//             managerName: data.managerName || "N/A",
//           });
//         } catch (err) {
//           console.error("Failed to fetch user data:", err);
//         }
//       }else{
//         console.warn("User ID or token is not available in session storage.");
//       }
//     };

//     if (openProfileDialog) {
//       loadUserData();
//     }
//   }, [openProfileDialog, userId, token]);

//   return (
//     <Dialog
//       open={openProfileDialog}
//       onClose={handleCloseProfileDialog}
//       maxWidth="xs"
//       fullWidth
//     >
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
//           <Typography variant="h6">{userDetails.name}</Typography>
//           <Typography variant="body2" sx={{ color: "#bdbdbd", mb: 2 }}>
//             {userDetails.email}
//           </Typography>
//         </Box>

//         <Divider sx={{ backgroundColor: "#555" }} />

//         <Box py={2} px={1}>
//           <Typography sx={{ mb: 1 }}>
//             <strong>Role:</strong> {userDetails.role}
//           </Typography>
//           <Typography>
//             <strong>Manager:</strong> {userDetails.managerName}
//           </Typography>
//         </Box>
//       </DialogContent>

//       <DialogActions
//         sx={{ backgroundColor: "#212121", justifyContent: "center" }}
//       >
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
