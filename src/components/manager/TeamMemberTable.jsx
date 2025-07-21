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
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  fetchTeamMembers,
  fetchTeamTimesheets,
  fetchAllEmployeeTimesheets,
} from "../../service/timesheetService";
import { fetchManagersOrAdmins } from "../../service/userService";
import { useNavigate } from "react-router-dom";
import TimesheetDialog from "./TimesheetDialog";
import config from "../../service/config";
import axios from "axios";

const MemberCard = ({ member, onShowTimesheets, mode }) => {
  const name =
    mode === "ADMIN"
      ? member.employeeName || member.name
      : member.name;
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
        {member.role && (
          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" mt={1}>
            Role: {member.role}
          </Typography>
        )}
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

const TeamMemberTable = ({ mode: providedMode, filterRole }) => {
  const role = sessionStorage.getItem("Role");
  const mode = providedMode || (role === "ADMIN" ? "ADMIN" : "MANAGER");
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamTimesheets, setTeamTimesheets] = useState({});
  const [selectedTimesheets, setSelectedTimesheets] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timesheetLoading, setTimesheetLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const managerId = sessionStorage.getItem("UserId");
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (mode === "MANAGER") {
          const members = await fetchTeamMembers(managerId, token);
          setTeamMembers(members);
          const timesheets = await fetchTeamTimesheets(token);
          setTeamTimesheets(timesheets);
        } else if (mode === "ADMIN") {
          if (filterRole === "MANAGER") {
            // Fetch managers using the correct API endpoint
            try {
              const response = await fetch(`${config.BASE_URL}users/managers`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              
              if (!response.ok) {
                throw new Error(`Failed to fetch managers: ${response.status}`);
              }
              
              const managers = await response.json();
              // Make sure we only show users with MANAGER role
              const filteredManagers = managers.filter(user => user.role === "MANAGER");
              setTeamMembers(filteredManagers);
            } catch (error) {
              console.error("Error fetching managers:", error);
              setError("Failed to fetch managers. Please try again.");
            }
          } else {
            // Fetch all employees with their timesheets
            try {
              const response = await fetch(`${config.BASE_URL}users/all`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              
              if (!response.ok) {
                throw new Error(`Failed to fetch employees: ${response.status}`);
              }
              
              const employees = await response.json();
              // Filter out admin users and if not showing managers, filter out managers too
              const filteredEmployees = employees.filter(emp => 
                emp.role !== "ADMIN" && (filterRole === "MANAGER" ? emp.role === "MANAGER" : emp.role === "EMPLOYEE")
              );
              setTeamMembers(filteredEmployees);
            } catch (error) {
              console.error("Error fetching employees:", error);
              setError("Failed to fetch employees. Please try again.");
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [mode, managerId, token, filterRole]);

  const handleShowTimesheets = async (member) => {
    try {
      setTimesheetLoading(true);
      setSelectedTimesheets([]);
      
      if (mode === "MANAGER") {
        const key = Object.keys(teamTimesheets).find((k) =>
          k.includes(member.email)
        );
        const timesheets = teamTimesheets[key] || [];
        setSelectedTimesheets(timesheets);
      } else if (mode === "ADMIN") {
        // For admin, fetch timesheets specifically for this member
        try {
          const userId = member.id || member.employeeId;
          
          // First try to get user's timesheets directly
          try {
            // Using axios for better error handling
            const response = await axios.get(
              `${config.BASE_URL}sheets/all`,
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );
            
            if (response.data) {
              // Filter sheets by user ID or email
              const userSheets = response.data.filter(sheet => 
                (sheet.userId === userId || 
                 sheet.employeeId === userId ||
                 (sheet.email && sheet.email === member.email) ||
                 (sheet.user && sheet.user.email === member.email))
              );
              
              if (userSheets.length > 0) {
                setSelectedTimesheets(userSheets);
              } else {
                // No timesheets found for this user
                setSnackbarMessage(`No timesheets found for ${member.name || member.employeeName}`);
                setShowSnackbar(true);
                setSelectedTimesheets([]);
              }
            }
          } catch (error) {
            console.error("Error fetching timesheets:", error);
            setSnackbarMessage("Failed to fetch timesheets. Please try again.");
            setShowSnackbar(true);
          }
        } catch (error) {
          console.error("Error fetching employee timesheets:", error);
          setSnackbarMessage("Error loading timesheets");
          setShowSnackbar(true);
          setSelectedTimesheets([]);
        }
      }
      
      setOpenDialog(true);
    } catch (error) {
      console.error("Error showing timesheets:", error);
      setSnackbarMessage("Error showing timesheets");
      setShowSnackbar(true);
    } finally {
      setTimesheetLoading(false);
    }
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
      <Box display="flex" alignItems="center" mb={4} mx="auto" maxWidth="lg">
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
          {mode === "ADMIN" && filterRole === "MANAGER" ? "Managers" : 
           mode === "ADMIN" ? "Employees" : "Team Members"}
        </Typography>
      </Box>

      {/* Error message */}
      {error && (
        <Box 
          sx={{
            backgroundColor: "rgba(255,0,0,0.1)", 
            color: "white",
            p: 2, 
            borderRadius: 1,
            mb: 3
          }}
        >
          <Typography>{error}</Typography>
        </Box>
      )}

      {/* Loading indicator */}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress sx={{ color: "#ffffff" }} />
        </Box>
      )}

      {/* Member Cards */}
      {!loading && (
        <Grid container spacing={4}>
          {teamMembers.length > 0 ? (
            teamMembers.map((member, index) => {
              const id = mode === "ADMIN" ? member.employeeId || member.id : member.id;
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={id || member.email || index}
                >
                  <MemberCard
                    member={member}
                    onShowTimesheets={handleShowTimesheets}
                    mode={mode}
                  />
                </Grid>
              );
            })
          ) : (
            <Box width="100%" textAlign="center" mt={4}>
              <Typography variant="h6" color="#ffffff">
                No {mode === "ADMIN" && filterRole === "MANAGER" ? "managers" : 
                    mode === "ADMIN" ? "employees" : "team members"} found
              </Typography>
            </Box>
          )}
        </Grid>
      )}

      {/* Dialog */}
      <TimesheetDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        timesheets={selectedTimesheets}
        loading={timesheetLoading}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity="info"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TeamMemberTable;
