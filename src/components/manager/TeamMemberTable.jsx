import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  fetchTeamMembers,
  fetchTeamTimesheets,
  fetchAllEmployeeTimesheets,
} from "../../service/timesheetService";
import { useNavigate } from "react-router-dom";
import TimesheetDialog from "./TimesheetDialog";

const MemberCard = ({ member, onShowTimesheets, mode }) => {
  const name = mode === "ADMIN" ? member.employeeName : member.name;
  const email = member.email;

  return (
    <Card
      elevation={4}
      sx={{
        borderRadius: 4,
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        color: "white",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
        },
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            margin: "0 auto 16px",
            backgroundColor: "#0097A7",
            fontSize: "2rem",
          }}
        >
          {name ? name.charAt(0).toUpperCase() : ""}
        </Avatar>
        <Typography variant="h6" component="div" noWrap>
          {name}
        </Typography>
        <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" noWrap>
          {email}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: "#0097A7",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            "&:hover": {
              backgroundColor: "#007a87",
            },
          }}
          onClick={() => onShowTimesheets(member)}
        >
          Show Timesheets
        </Button>
      </CardActions>
    </Card>
  );
};

const TeamMemberTable = ({ mode = "MANAGER" }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamTimesheets, setTeamTimesheets] = useState({});
  const [selectedTimesheets, setSelectedTimesheets] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const managerId = sessionStorage.getItem("UserId");
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        if (mode === "MANAGER") {
          const members = await fetchTeamMembers(managerId, token);
          setTeamMembers(members);
          const timesheets = await fetchTeamTimesheets(token);
          setTeamTimesheets(timesheets);
        } else if (mode === "ADMIN") {
          const response = await fetchAllEmployeeTimesheets(token);
          setTeamMembers(response);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    getData();
  }, [mode, managerId, token]);

  const handleShowTimesheets = (member) => {
    if (mode === "MANAGER") {
      const key = Object.keys(teamTimesheets).find((k) =>
        k.includes(member.email)
      );
      const timesheets = teamTimesheets[key] || [];
      setSelectedTimesheets(timesheets);
    } else if (mode === "ADMIN") {
      setSelectedTimesheets(member.timesheets || []);
    }
    setOpenDialog(true);
  };

  const handleGoBack = () => {
    const role = sessionStorage.getItem("Role");
    if (role === "MANAGER") navigate("/mdashboard");
    else if (role === "ADMIN") navigate("/adashboard");
    else alert("Unauthorized role");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #263238, #37474F)",
        py: 4,
        px: { xs: 2, sm: 4, md: 6 },
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        mb={4}
        mx="auto"
        maxWidth="lg"
      >
        <IconButton
          onClick={handleGoBack}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          <ArrowBackIcon sx={{ color: "#ffffff" }} />
        </IconButton>
        <Typography
          variant="h4"
          sx={{
            color: "#ffffff",
            fontWeight: 700,
            letterSpacing: 1,
            ml: 2,
          }}
        >
          {mode === "ADMIN" ? "Employee List" : "Team Members"}
        </Typography>
      </Box>

      {/* Member Cards */}
      <Grid container spacing={4}>
        {teamMembers.map((member, index) => {
          const id = mode === "ADMIN" ? member.employeeId : member.id;
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={id || member.email || index}>
              <MemberCard
                member={member}
                onShowTimesheets={handleShowTimesheets}
                mode={mode}
              />
            </Grid>
          );
        })}
      </Grid>

      {/* Dialog */}
      <TimesheetDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        timesheets={selectedTimesheets}
      />
    </Box>
  );
};

export default TeamMemberTable;