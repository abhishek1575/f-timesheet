import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  fetchTeamMembers,
  fetchTeamTimesheets,
} from "../../service/timesheetService";
import { useNavigate } from "react-router-dom";
import TimesheetDialog from "./TimesheetDialog";

const TeamMemberTable = () => {
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
        const members = await fetchTeamMembers(managerId, token);
        setTeamMembers(members);

        const timesheets = await fetchTeamTimesheets(token);
        setTeamTimesheets(timesheets);
      } catch (error) {
        console.error("Failed to fetch data");
      }
    };

    getData();
  }, []);

  const handleShowTimesheets = (member) => {
    const key = Object.keys(teamTimesheets).find((k) =>
      k.includes(member.email)
    );
    const timesheets = teamTimesheets[key] || [];
    setSelectedTimesheets(timesheets);
    setOpenDialog(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #263238, #37474F)",
        py: 4,
        px: 2,
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
        maxWidth={900}
        mx="auto"
      >
        <IconButton
          onClick={() => {
            const role = sessionStorage.getItem("Role");
            if (role === "MANAGER") navigate("/mdashboard");
            else if (role === "ADMIN") navigate("/adashboard");
            else alert("Unauthorized role");
          }}
        >
          <ArrowBackIcon sx={{ color: "#ffffff" }} />
        </IconButton>
        <Typography
          variant="h4"
          align="center"
          sx={{
            flexGrow: 1,
            color: "#ffffff",
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          Team Members
        </Typography>
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        elevation={8}
        sx={{
          maxWidth: 900,
          mx: "auto",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#263238" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                ID
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow
                key={member.id}
                hover
                sx={{ backgroundColor: "#ECEFF1" }}
              >
                <TableCell>{member.id}</TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: "#0097A7",
                      color: "#fff",
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 2,
                      py: 0.5,
                      "&:hover": {
                        backgroundColor: "#006064",
                      },
                    }}
                    onClick={() => handleShowTimesheets(member)}
                  >
                    Show Timesheets
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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

// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   IconButton,
//   Typography,
//   Box,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import {
//   fetchTeamMembers,
//   fetchTeamTimesheets,
// } from "../../service/timesheetService";
// import { useNavigate } from "react-router-dom";
// import TimesheetDialog from "./TimesheetDialog";

// const TeamMemberTable = () => {
//   const [teamMembers, setTeamMembers] = useState([]);
//   const [teamTimesheets, setTeamTimesheets] = useState({});
//   const [selectedTimesheets, setSelectedTimesheets] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const managerId = sessionStorage.getItem("UserId");
//   const token = sessionStorage.getItem("token");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const members = await fetchTeamMembers(managerId, token);
//         setTeamMembers(members);

//         // Fetch team timesheets once
//         const timesheets = await fetchTeamTimesheets(token);
//         setTeamTimesheets(timesheets);
//       } catch (error) {
//         console.error("Failed to fetch data");
//       }
//     };

//     getData();
//   }, []);

//   const handleShowTimesheets = (member) => {
//     const key = Object.keys(teamTimesheets).find((k) =>
//       k.includes(member.email)
//     );
//     const timesheets = teamTimesheets[key] || [];
//     setSelectedTimesheets(timesheets);
//     setOpenDialog(true);
//   };

//   return (
//     <Box sx={{ mt: 4, mx: "auto", maxWidth: 800 }}>
//       <Box display="flex" alignItems="center" mb={2}>
//         <IconButton
//           onClick={() => {
//             const userRole = sessionStorage.getItem("Role");
//             console.log("User Role:", userRole);

//             if (userRole === "MANAGER") {
//               navigate("/mdashboard");
//             } else if (userRole === "ADMIN") {
//               navigate("/adashboard");
//             } else {
//               alert("Unauthorized role");
//             }
//           }}
//         >
//           <ArrowBackIcon sx={{ color: "black" }} />
//         </IconButton>
//         <Typography variant="h6" sx={{ ml: 1, fontWeight: "bold" }}>
//           Team Members
//         </Typography>
//       </Box>

//       <TableContainer component={Paper} elevation={6} sx={{ borderRadius: 2 }}>
//         <Table>
//           <TableHead>
//             <TableRow sx={{ backgroundColor: "#212121" }}>
//               <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
//                 ID
//               </TableCell>
//               <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
//                 Name
//               </TableCell>
//               <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
//                 Email
//               </TableCell>
//               <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
//                 Action
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {teamMembers.map((member) => (
//               <TableRow key={member.id}>
//                 <TableCell>{member.id}</TableCell>
//                 <TableCell>{member.name}</TableCell>
//                 <TableCell>{member.email}</TableCell>
//                 <TableCell>
//                   <Button
//                     variant="contained"
//                     sx={{
//                       backgroundColor: "#424242",
//                       "&:hover": { backgroundColor: "#333333" },
//                     }}
//                     onClick={() => handleShowTimesheets(member)}
//                   >
//                     Show Timesheets
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <TimesheetDialog
//         open={openDialog}
//         onClose={() => setOpenDialog(false)}
//         timesheets={selectedTimesheets}
//       />
//     </Box>
//   );
// };

// export default TeamMemberTable;
