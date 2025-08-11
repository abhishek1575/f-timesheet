// ./ProfileButton.jsx
import React from "react";
import { Box, Avatar, Typography, ButtonBase } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";

export default function ProfileButton({ firstName, onClick }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        color: "#fff",
        padding: "4px 8px",
        borderRadius: "999px",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
      }}
    >
      <Avatar sx={{ width: 32, height: 32 }}>
        {firstName ? firstName.charAt(0).toUpperCase() : <AccountCircle />}
      </Avatar>
      <Typography variant="body2" sx={{ color: "#fff", fontWeight: 500 }}>
        {firstName || "User"}
      </Typography>
    </ButtonBase>
  );
}
