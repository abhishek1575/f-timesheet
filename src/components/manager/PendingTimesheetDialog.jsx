import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  TableContainer,
  Paper,
  Box,
} from "@mui/material";
import {
  fetchPendingTimesheets,
  approveTimesheetById,
  rejectTimesheetById,
} from "../../service/timesheetService";

const PendingTimesheetDialog = ({ open, onClose }) => {
  const [timesheets, setTimesheets] = useState([]);
  const [remarkDialogOpen, setRemarkDialogOpen] = useState(false);
  const [selectedSheetId, setSelectedSheetId] = useState(null);
  const [remark, setRemark] = useState("");

  const refreshData = async () => {
    try {
      const data = await fetchPendingTimesheets();
      setTimesheets(data);
    } catch (err) {
      console.error("Failed to fetch timesheets");
    }
  };

  useEffect(() => {
    if (open) {
      refreshData();
    }
  }, [open]);

  // const approveTimesheet = async (id) => {
  //   await approveTimesheetById(id);
  //   refreshData();
  // };

  const approveTimesheet = async (id) => {
    try {
      await approveTimesheetById(id);
      alert("Timesheet approved successfully!"); // ✅ Alert after approval
      refreshData(); // Reload the table data
    } catch (error) {
      console.error("Error approving timesheet:", error);
      alert("Failed to approve timesheet."); // Optional error message
    }
  };
  

  const rejectTimesheet = async () => {
    await rejectTimesheetById(selectedSheetId, remark);
    setRemark("");
    setRemarkDialogOpen(false);
    refreshData();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle>Pending Timesheets</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Employee</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Task Name</TableCell>
                  <TableCell>Effort</TableCell>
                  <TableCell>Dates</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timesheets.map((sheet) => (
                  <TableRow key={sheet.id} hover>
                    <TableCell>{sheet.id}</TableCell>
                    <TableCell>{sheet.userName}</TableCell>
                    <TableCell>{sheet.project}</TableCell>
                    <TableCell>{sheet.taskName}</TableCell>
                    <TableCell>{sheet.effort}</TableCell>
                    <TableCell>
                      {sheet.startDate} to {sheet.endDate}
                    </TableCell>
                    <TableCell>
                      <Box 
                        display="flex"
                        flexWrap="wrap"
                        gap={1} // adds spacing, avoids overlap
                      >
                        <Button
                          size="small"
                          color="success"
                          variant="contained"
                          onClick={() => approveTimesheet(sheet.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="contained"
                          onClick={() => {
                            setSelectedSheetId(sheet.id);
                            setRemarkDialogOpen(true);
                          }}
                        >
                          Reject
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remark Dialog */}
      <Dialog
        open={remarkDialogOpen}
        onClose={() => setRemarkDialogOpen(false)}
      >
        <DialogTitle>Reject Timesheet</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Remark"
            fullWidth
            multiline
            rows={3}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemarkDialogOpen(false)}>Cancel</Button>
          <Button onClick={rejectTimesheet} variant="contained" color="error">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PendingTimesheetDialog;

// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TextField,

// } from "@mui/material";
// import config from "../../service/config";

// const PendingTimesheetDialog = ({ open, onClose }) => {
//   const [timesheets, setTimesheets] = useState([]);
//   const [remarkDialogOpen, setRemarkDialogOpen] = useState(false);
//   const [selectedSheetId, setSelectedSheetId] = useState(null);
//   const [remark, setRemark] = useState("");
//   const token = sessionStorage.getItem("token");

//   useEffect(() => {
//     if (open) {
//       fetch(`${config.BASE_URL}sheets/pending`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//         .then((res) => res.json())
//         .then((data) => setTimesheets(data))
//         .catch(() => console.error("Failed to fetch timesheets"));
//     }
//   }, [open]);

//   const approveTimesheet = async (id) => {
//     await fetch(`${config.BASE_URL}sheets/${id}/approve`, {
//       method: "PUT",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     refreshData();
//   };

//   const rejectTimesheet = async () => {
//     await fetch(
//       `${config.BASE_URL}sheets/${selectedSheetId}/reject?comment=${encodeURIComponent(
//         remark
//       )}`,
//       {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     setRemark("");
//     setRemarkDialogOpen(false);
//     refreshData();
//   };

//   const refreshData = () => {
//     fetch(`${config.BASE_URL}sheets/pending`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => res.json())
//       .then((data) => setTimesheets(data));
//   };

//   return (
//     <>
//       <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
//         <DialogTitle>Pending Timesheets</DialogTitle>
//         <DialogContent>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>Employee</TableCell>
//                 <TableCell>Project</TableCell>
//                 <TableCell>Task Name</TableCell>
//                 <TableCell>Effort</TableCell>
//                 <TableCell>Dates</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {timesheets.map((sheet) => (
//                 <TableRow key={sheet.id}>
//                   <TableCell>{sheet.id}</TableCell>
//                   <TableCell>{sheet.userName}</TableCell>
//                   <TableCell>{sheet.project}</TableCell>
//                   <TableCell>{sheet.taskName}</TableCell>
//                   <TableCell>{sheet.effort}</TableCell>
//                   <TableCell>
//                     {sheet.startDate} to {sheet.endDate}
//                   </TableCell>
//                   <TableCell>
//                     <Button
//                       size="small"
//                       color="success"
//                       variant="contained"
//                       onClick={() => approveTimesheet(sheet.id)}
//                     >
//                       Approve
//                     </Button>
//                     <Button
//                       size="small"
//                       color="error"
//                       variant="contained"
//                       onClick={() => {
//                         setSelectedSheetId(sheet.id);
//                         setRemarkDialogOpen(true);
//                       }}
//                       sx={{ ml: 1 }}
//                     >
//                       Reject
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={onClose}>Close</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Remark Dialog */}
//       <Dialog
//         open={remarkDialogOpen}
//         onClose={() => setRemarkDialogOpen(false)}
//       >
//         <DialogTitle>Reject Timesheet</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             label="Remark"
//             fullWidth
//             multiline
//             rows={3}
//             value={remark}
//             onChange={(e) => setRemark(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setRemarkDialogOpen(false)}>Cancel</Button>
//           <Button onClick={rejectTimesheet} variant="contained" color="error">
//             Submit
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default PendingTimesheetDialog;
