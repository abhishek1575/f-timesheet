// src/components/UserProfileDialog.jsx
import React from "react";
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

const UserProfileDialog = ({ openProfileDialog, handleCloseProfileDialog }) => {
  const userName = sessionStorage.getItem("Name") || "N/A";
  const userEmail = sessionStorage.getItem("Email") || "N/A";
  const userRole = sessionStorage.getItem("Role") || "N/A";
  const userManager = sessionStorage.getItem("Manager") || "N/A";

  return (
    <Dialog open={openProfileDialog} onClose={handleCloseProfileDialog} maxWidth="xs" fullWidth>
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
          <Typography variant="h6">{userName}</Typography>
          <Typography variant="body2" sx={{ color: "#bdbdbd", mb: 2 }}>
            {userEmail}
          </Typography>
        </Box>

        <Divider sx={{ backgroundColor: "#555" }} />

        <Box py={2} px={1}>
          <Typography sx={{ mb: 1 }}>
            <strong>Role:</strong> {userRole}
          </Typography>
          <Typography>
            <strong>Manager:</strong> {userManager}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ backgroundColor: "#212121", justifyContent: "center" }}>
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
