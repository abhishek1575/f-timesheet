import React, { useEffect, useState } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  Paper,
  Button,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  getDraftTimesheets,
  submitTimesheet,
  updateTimesheet,
  getTimesheetById,
} from "../../service/timesheetService";
import UpdateTimesheetForm from "./UpdateTimesheet";
import { Navigate, useNavigate } from "react-router-dom";

export default function DraftTimesheetTable() {
  const [timesheets, setTimesheets] = useState([]);
  const [editingTimesheet, setEditingTimesheet] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadDraftTimesheets();
  }, []);

  const navigate = useNavigate(); // For navigation

  const handleBack = () => {
    const role = sessionStorage.getItem("Role");
    console.log("Role:", role); // Debugging line to check the role
    if (role === "MANAGER") {
      navigate("/mdashboard"); // Update the path as per your routing
    } else if (role === "EMPLOYEE") {
      navigate("/edashboard");
    } else if (role === "ADMIN") {
      navigate("/adashboard");
    } else {
      navigate("/Login"); // Fallback to login if role is not recognized
    }
  };
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      background: "#424242",
      color: "#fff",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const loadDraftTimesheets = async () => {
    try {
      const response = await getDraftTimesheets();
      setTimesheets(response.data);
    } catch (error) {
      console.error("Error fetching draft timesheets", error);
    }
  };

  const handleSubmit = async (id) => {
    // const todayDay = new Date().getDay(); // 0=Sunday, 1=Monday, 2=Tuesday...
    // if (todayDay !== 1 && todayDay !== 2) {
    //   alert("Timesheets can only be submitted on Monday or Tuesday.");
    //   return; // Block submission on other days
    // }

    try {
      await submitTimesheet(id);
      console.log("Timesheet id submitted:", id);
      alert("Timesheet Submitted Successfully!");
      loadDraftTimesheets();
    } catch (error) {
      console.error("Submit Error", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await getTimesheetById(id);
      setEditingTimesheet(response.data);
      setDialogOpen(true);
    } catch (error) {
      console.error("Error loading timesheet", error);
    }
  };

  const handleDialogChange = (e) => {
    setEditingTimesheet({
      ...editingTimesheet,
      [e.target.name]: e.target.value,
    });
  };

  const handleDialogSubmit = async () => {
    try {
      await updateTimesheet(editingTimesheet.id, editingTimesheet);
      alert("Timesheet updated successfully!");
      setDialogOpen(false);
      setEditingTimesheet(null);
      loadDraftTimesheets();
    } catch (error) {
      console.error("Update Error", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        overflow: "hidden",
        background: "#f4f6f8",
        p: 4,
        fontFamily: "Roboto, sans-serif",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
        }}
      >
        <IconButton
          onClick={handleBack}
          sx={{
            backgroundColor: "#e0e0e0",
            "&:hover": { backgroundColor: "#bdbdbd" },
            boxShadow: 1,
          }}
        >
          <ArrowBackIcon sx={{ color: "#424242" }} />
        </IconButton>
        <Typography
          variant="h5"
          sx={{
            ml: 2,
            fontWeight: 600,
            color: "#37474f",
            letterSpacing: 0.5,
          }}
        >
          Draft Timesheets
        </Typography>
      </Box>

      <UpdateTimesheetForm
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        timesheet={editingTimesheet}
        onChange={handleDialogChange}
        onSubmit={handleDialogSubmit}
      />

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell align="center">Project</StyledTableCell>
              <StyledTableCell align="center">Task Name</StyledTableCell>
              <StyledTableCell align="center">Start Date</StyledTableCell>
              <StyledTableCell align="center">End Date</StyledTableCell>
              <StyledTableCell align="center">Effort (Hrs)</StyledTableCell>
              <StyledTableCell align="center">Update</StyledTableCell>
              <StyledTableCell align="center">Submit</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {timesheets.length > 0 ? (
              timesheets.map((sheet) => (
                <StyledTableRow key={sheet.id}>
                  <StyledTableCell align="center">
                    {sheet.project}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {sheet.taskName}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {sheet.startDate}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {sheet.endDate}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {sheet.effort}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ textTransform: "none", borderRadius: 2 }}
                      onClick={() => handleEdit(sheet.id)}
                    >
                      Update
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ textTransform: "none", borderRadius: 2 }}
                      onClick={() => handleSubmit(sheet.id)}
                    >
                      Submit
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="center">
                  <Typography
                    variant="body1"
                    sx={{
                      py: 4,
                      fontStyle: "italic",
                      color: "#9e9e9e",
                      fontWeight: 500,
                    }}
                  >
                    🚫 No Draft Timesheets Found
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableContainer,
//   TableHead,
//   TableBody,
//   Paper,
//   Button,
//   Box,
//   IconButton,
//   Typography,

// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import TableCell, { tableCellClasses } from "@mui/material/TableCell";
// import TableRow from "@mui/material/TableRow";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import {
//   getDraftTimesheets,
//   submitTimesheet,
//   updateTimesheet,
//   getTimesheetById,
// } from "../../service/timesheetService";
// import UpdateTimesheetForm from "./UpdateTimesheet";
// import { Navigate, useNavigate } from "react-router-dom";

// export default function DraftTimesheetTable() {
//   const [timesheets, setTimesheets] = useState([]);
//   const [editingTimesheet, setEditingTimesheet] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);

//   useEffect(() => {
//     loadDraftTimesheets();
//   }, []);

//   const navigate = useNavigate(); // For navigation

//   const handleBack = () => {
//     const role = sessionStorage.getItem("Role");
//     console.log("Role:", role); // Debugging line to check the role
//     if (role === "MANAGER") {
//       navigate("/mdashboard"); // Update the path as per your routing
//     } else if (role === "EMPLOYEE") {
//       navigate("/edashboard"); // Update the path as per your routing
//     } else {
//       navigate("/Login"); // Fallback to login if role is not recognized
//     }
//   };
//   const StyledTableCell = styled(TableCell)(({ theme }) => ({
//     [`&.${tableCellClasses.head}`]: {
//       background: "#424242",
//       color: "#fff",
//     },
//     [`&.${tableCellClasses.body}`]: {
//       fontSize: 14,
//     },
//   }));

//   const StyledTableRow = styled(TableRow)(({ theme }) => ({
//     "&:nth-of-type(odd)": {
//       backgroundColor: theme.palette.action.hover,
//     },
//     "&:last-child td, &:last-child th": {
//       border: 0,
//     },
//   }));

//   const loadDraftTimesheets = async () => {
//     try {
//       const response = await getDraftTimesheets();
//       setTimesheets(response.data);
//     } catch (error) {
//       console.error("Error fetching draft timesheets", error);
//     }
//   };

//   const handleSubmit = async (id) => {
//     // const todayDay = new Date().getDay(); // 0=Sunday, 1=Monday, 2=Tuesday...
//     // if (todayDay !== 1 && todayDay !== 2) {
//     //   alert("Timesheets can only be submitted on Monday or Tuesday.");
//     //   return; // Block submission on other days
//     // }

//     try {
//       await submitTimesheet(id);
//       console.log("Timesheet id submitted:", id);
//       alert("Timesheet Submitted Successfully!");
//       loadDraftTimesheets();
//     } catch (error) {
//       console.error("Submit Error", error);
//     }
//   };

//   const handleEdit = async (id) => {
//     try {
//       const response = await getTimesheetById(id);
//       setEditingTimesheet(response.data);
//       setDialogOpen(true);
//     } catch (error) {
//       console.error("Error loading timesheet", error);
//     }
//   };

//   const handleDialogChange = (e) => {
//     setEditingTimesheet({
//       ...editingTimesheet,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleDialogSubmit = async () => {
//     try {
//       await updateTimesheet(editingTimesheet.id, editingTimesheet);
//       alert("Timesheet updated successfully!");
//       setDialogOpen(false);
//       setEditingTimesheet(null);
//       loadDraftTimesheets();
//     } catch (error) {
//       console.error("Update Error", error);
//     }
//   };

//   return (
//     <Box sx={{ p: 2 }}>
//       <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//         <IconButton onClick={handleBack} color="primary">
//           <ArrowBackIcon />
//         </IconButton>
//         <Typography variant="h6" sx={{ ml: 1 }}>
//           Draft Timesheets
//         </Typography>
//       </Box>
//       <UpdateTimesheetForm
//         open={dialogOpen}
//         onClose={() => setDialogOpen(false)}
//         timesheet={editingTimesheet}
//         onChange={handleDialogChange}
//         onSubmit={handleDialogSubmit}
//       />
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 700 }} aria-label="draft timesheet table">
//           <TableHead>
//             <StyledTableRow>
//               <StyledTableCell align="center">Project</StyledTableCell>
//               <StyledTableCell align="center">Task Name</StyledTableCell>
//               <StyledTableCell align="center">Start Date</StyledTableCell>
//               <StyledTableCell align="center">End Date</StyledTableCell>
//               <StyledTableCell align="center">Effort (Hrs)</StyledTableCell>
//               <StyledTableCell align="center">Update</StyledTableCell>
//               <StyledTableCell align="center">Submit</StyledTableCell>
//             </StyledTableRow>
//           </TableHead>
//           <TableBody>
//             {timesheets.length > 0 ? (
//               timesheets.map((sheet) => (
//                 <StyledTableRow key={sheet.id}>
//                   <StyledTableCell align="center">
//                     {sheet.project}
//                   </StyledTableCell>
//                   <StyledTableCell align="center">
//                     {sheet.taskName}
//                   </StyledTableCell>
//                   <StyledTableCell align="center">
//                     {sheet.startDate}
//                   </StyledTableCell>
//                   <StyledTableCell align="center">
//                     {sheet.endDate}
//                   </StyledTableCell>
//                   <StyledTableCell align="center">
//                     {sheet.effort}
//                   </StyledTableCell>
//                   <StyledTableCell align="center">
//                     <Button
//                       variant="outlined"
//                       onClick={() => handleEdit(sheet.id)}
//                     >
//                       Update
//                     </Button>
//                   </StyledTableCell>
//                   <StyledTableCell align="center">
//                     <Button
//                       variant="contained"
//                       onClick={() => handleSubmit(sheet.id)}
//                     >
//                       Submit
//                     </Button>
//                   </StyledTableCell>
//                 </StyledTableRow>
//               ))
//             ) : (
//               <StyledTableRow>
//                 <StyledTableCell align="center" colSpan={7}>
//                   No Records Found
//                 </StyledTableCell>
//               </StyledTableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// }
