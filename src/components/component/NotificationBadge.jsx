

import React, { useEffect, useState } from "react";
import { IconButton, Badge, Tooltip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import config from "../../service/config";

const NotificationBadge = ({ onClick }) => {
  const [pendingCount, setPendingCount] = useState(0);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetch(`${config.BASE_URL}sheets/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPendingCount(data.length))
      .catch(() => console.error("Failed to fetch pending timesheets"));
  }, []);

  return (
    <Tooltip title="Pending Timesheets">
      <IconButton onClick={onClick}>
        <Badge badgeContent={pendingCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default NotificationBadge;
