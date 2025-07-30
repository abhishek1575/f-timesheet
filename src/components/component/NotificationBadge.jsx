import React from "react";
import { IconButton, Badge, Tooltip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const NotificationBadge = ({ count = 0, onClick }) => {
  return (
    <Tooltip title="Pending Timesheets">
      <IconButton onClick={onClick} color="inherit">
        <Badge badgeContent={count} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default NotificationBadge;
