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
} from "../service/timesheetService";
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
    navigate("/edashboard"); // Update the path as per your routing
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
    try {
      await submitTimesheet(id);
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
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={handleBack} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1 }}>
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

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="draft timesheet table">
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
            {timesheets.map((sheet) => (
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
                <StyledTableCell align="center">{sheet.effort}</StyledTableCell>
                <StyledTableCell align="center">
                  <Button
                    variant="outlined"
                    onClick={() => handleEdit(sheet.id)}
                  >
                    Update
                  </Button>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Button
                    variant="contained"
                    onClick={() => handleSubmit(sheet.id)}
                  >
                    Submit
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
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
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import TableCell, { tableCellClasses } from "@mui/material/TableCell";
// import TableRow from "@mui/material/TableRow";
// import {
//   getDraftTimesheets,
//   submitTimesheet,
//   updateTimesheet, // ✅ Imported Update Service
// } from "../service/timesheetService";
// import { useNavigate } from "react-router-dom";

// export default function DraftTimesheetTable() {
//   const [timesheets, setTimesheets] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadDraftTimesheets();
//   }, []);

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
//     try {
//       await submitTimesheet(id);
//       alert("Timesheet Submitted Successfully!");
//       loadDraftTimesheets();
//     } catch (error) {
//       console.error("Submit Error", error);
//     }
//   };

//   const handleUpdate = async (sheet) => {
//     const updatedData = {
//       taskName: sheet.taskName,
//       startDate: sheet.startDate,
//       endDate: sheet.endDate,
//       effort: sheet.effort,
//       project: sheet.project,
//     };

//     try {
//       await updateTimesheet(sheet.id, updatedData);
//       alert("Timesheet Updated Successfully!");
//       loadDraftTimesheets();
//     } catch (error) {
//       console.error("Update Error", error);
//     }
//   };

//   return (
//     <TableContainer component={Paper}>
//       <Table sx={{ minWidth: 700 }} aria-label="draft timesheet table">
//         <TableHead>
//           <StyledTableRow>
//             <StyledTableCell align="center">Project</StyledTableCell>
//             <StyledTableCell align="center">Task Name</StyledTableCell>
//             <StyledTableCell align="center">Start Date</StyledTableCell>
//             <StyledTableCell align="center">End Date</StyledTableCell>
//             <StyledTableCell align="center">Effort (Hrs)</StyledTableCell>
//             <StyledTableCell align="center">Update</StyledTableCell>
//             <StyledTableCell align="center">Submit</StyledTableCell>
//           </StyledTableRow>
//         </TableHead>
//         <TableBody>
//           {timesheets.map((sheet) => (
//             <StyledTableRow key={sheet.id}>
//               <StyledTableCell align="center">{sheet.project}</StyledTableCell>
//               <StyledTableCell align="center">{sheet.taskName}</StyledTableCell>
//               <StyledTableCell align="center">
//                 {sheet.startDate}
//               </StyledTableCell>
//               <StyledTableCell align="center">{sheet.endDate}</StyledTableCell>
//               <StyledTableCell align="center">{sheet.effort}</StyledTableCell>
//               <StyledTableCell align="center">
//                 <Button
//                   variant="outlined"
//                   onClick={() => navigate(`/update-timesheet/${sheet.id}`)}
//                 >
//                   Update
//                 </Button>
//               </StyledTableCell>
//               <StyledTableCell align="center">
//                 <Button
//                   variant="contained"
//                   onClick={() => handleSubmit(sheet.id)}
//                 >
//                   Submit
//                 </Button>
//               </StyledTableCell>
//             </StyledTableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }

// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableContainer,
//   TableHead,
//   TableBody,
//   Paper,
//   Button,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import TableCell, { tableCellClasses } from "@mui/material/TableCell";
// import TableRow from "@mui/material/TableRow";
// import {
//   getDraftTimesheets,
//   submitTimesheet,
// } from "../service/timesheetService";
// import { useNavigate } from "react-router-dom";

// export default function DraftTimesheetTable() {
//   const [timesheets, setTimesheets] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadDraftTimesheets();
//   }, []);
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
//     // hide last border
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
//     try {
//       await submitTimesheet(id);
//       alert("Timesheet Submitted Successfully!");
//       loadDraftTimesheets();
//     } catch (error) {
//       console.error("Submit Error", error);
//     }
//   };

//   return (
//     <TableContainer component={Paper}>
//       <Table sx={{ minWidth: 700 }} aria-label="draft timesheet table">
//         <TableHead>
//           <StyledTableRow>
//             <StyledTableCell align="center">Project</StyledTableCell>
//             <StyledTableCell align="center">Task Name</StyledTableCell>
//             <StyledTableCell align="center">Start Date</StyledTableCell>
//             <StyledTableCell align="center">End Date</StyledTableCell>
//             <StyledTableCell align="center">Effort (Hrs)</StyledTableCell>
//             <StyledTableCell align="center">Update</StyledTableCell>
//             <StyledTableCell align="center">Submit</StyledTableCell>
//           </StyledTableRow>
//         </TableHead>
//         <TableBody>
//           {timesheets.map((sheet) => (
//             <StyledTableRow key={sheet.id}>
//               <StyledTableCell align="center">{sheet.project}</StyledTableCell>
//               <StyledTableCell align="center">{sheet.taskName}</StyledTableCell>
//               <StyledTableCell align="center">
//                 {sheet.startDate}
//               </StyledTableCell>
//               <StyledTableCell align="center">{sheet.endDate}</StyledTableCell>
//               <StyledTableCell align="center">{sheet.effort}</StyledTableCell>
//               <StyledTableCell align="center">
//                 <Button
//                   variant="outlined"
//                   onClick={() => navigate(`/update-timesheet/${sheet.id}`)}
//                 >
//                   Update
//                 </Button>
//               </StyledTableCell>
//               <StyledTableCell align="center">
//                 <Button
//                   variant="contained"
//                   onClick={() => handleSubmit(sheet.id)}
//                 >
//                   Submit
//                 </Button>
//               </StyledTableCell>
//             </StyledTableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }
