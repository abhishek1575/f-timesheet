
import { IconButton, Badge, Tooltip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const NotificationBadge = ({
  count = 0,
  hasNew = false,
  onClick,
  title = "Notifications",
}) => {
  return (
    <Tooltip title={title}>
      <IconButton
        onClick={onClick}
        color="inherit"
        sx={{
          position: "relative",
          "& .pulse-dot": {
            position: "absolute",
            top: 8,
            right: 8,
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: "#ff0000",
            animation: hasNew ? "pulse 2s infinite" : "none",
            "@keyframes pulse": {
              "0%": { transform: "scale(0.95)", opacity: 0.7 },
              "50%": { transform: "scale(1.2)", opacity: 1 },
              "100%": { transform: "scale(0.95)", opacity: 0.7 },
            },
          },
        }}
      >
        <Badge
          badgeContent={count}
          color="error"
          overlap="circular"
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <NotificationsIcon />
        </Badge>
        {hasNew && <span className="pulse-dot" />}
      </IconButton>
    </Tooltip>
  );
};

export default NotificationBadge;

