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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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

        // Fetch team timesheets once
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
    <Box sx={{ mt: 4, mx: "auto", maxWidth: 800 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate("/mdashboard")}>
          <ArrowBackIcon sx={{ color: "black" }} />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1, fontWeight: "bold" }}>
          Team Members
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={6} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#212121" }}>
              <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
                ID
              </TableCell>
              <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.id}</TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#424242",
                      "&:hover": { backgroundColor: "#333333" },
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
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { fetchTeamMembers } from "../../service/timesheetService";
// import { useNavigate } from "react-router-dom";

// const TeamMemberTable = () => {
//   const [teamMembers, setTeamMembers] = useState([]);
//   const managerId = sessionStorage.getItem("UserId");
//   const token = sessionStorage.getItem("token");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const getTeamMembers = async () => {
//       try {
//         const data = await fetchTeamMembers(managerId, token);
//         setTeamMembers(data);
//       } catch (error) {
//         console.error("Failed to fetch team members");
//       }
//     };

//     getTeamMembers();
//   }, []);

//   const handleShowTimesheets = (member) => {
//     alert(`Show timesheets for ${member.name} (ID: ${member.id})`);
//     // Navigate or open timesheet dialog here
//   };

//   return (
//     <Box sx={{ mt: 4, mx: "auto", maxWidth: 800 }}>
//       {/* Back Button */}
//       <Box display="flex" alignItems="center" mb={2}>
//         <IconButton onClick={() => navigate("/mdashboard")}>
//           <ArrowBackIcon sx={{ color: "black" }} />
//         </IconButton>
//         <Typography variant="h6" sx={{ ml: 1, fontWeight: "bold" }}>
//           Team Members
//         </Typography>
//       </Box>

//       {/* Team Members Table */}
//       <TableContainer
//         component={Paper}
//         elevation={6}
//         sx={{
//           borderRadius: 2,
//           overflow: "hidden",
//           boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
//         }}
//       >
//         <Table>
//           <TableHead>
//             <TableRow
//               sx={{
//                 backgroundColor: "#212121", // Dark header
//               }}
//             >
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
//               <TableRow
//                 key={member.id}
//                 sx={{
//                   backgroundColor: "#f9f9f9", // Light row background
//                   "&:nth-of-type(even)": {
//                     backgroundColor: "#eeeeee", // Alternate row background
//                   },
//                   "&:hover": {
//                     backgroundColor: "#e0e0e0", // Hover effect
//                   },
//                 }}
//               >
//                 <TableCell>{member.id}</TableCell>
//                 <TableCell>{member.name}</TableCell>
//                 <TableCell>{member.email}</TableCell>
//                 <TableCell>
//                   <Button
//                     variant="contained"
//                     sx={{
//                       backgroundColor: "#424242",
//                       color: "white",
//                       "&:hover": {
//                         backgroundColor: "#333333",
//                       },
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
//     </Box>
//   );
// };

// export default TeamMemberTable;
