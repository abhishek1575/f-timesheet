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
  Typography,
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
  const [remarkError, setRemarkError] = useState(false);

  const refreshData = async () => {
    try {
      const data = await fetchPendingTimesheets();
      setTimesheets(data);
    } catch (err) {
      console.error("Failed to fetch timesheets");
    }
  };

  useEffect(() => {
    if (open) refreshData();
  }, [open]);

  const approveTimesheet = async (id) => {
    try {
      await approveTimesheetById(id);
      alert("✅ Timesheet approved successfully!");
      refreshData();
    } catch (error) {
      console.error("Error approving timesheet:", error);
      alert("❌ Failed to approve timesheet.");
    }
  };

  const rejectTimesheet = async () => {
    if (!remark.trim()) {
      setRemarkError(true);
      return;
    }
    try {
      await rejectTimesheetById(selectedSheetId, remark.trim());
      setRemark("");
      setRemarkError(false);
      setRemarkDialogOpen(false);
      refreshData();
      alert("⛔ Timesheet rejected.");
    } catch (error) {
      alert("Failed to reject timesheet.");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle
          sx={{
            backgroundColor: "#212121",
            color: "#f5f5f5",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          🕒 Pending Timesheets
        </DialogTitle>

        <DialogContent sx={{ backgroundColor: "#f9f9f9" }}>
          {timesheets.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ textAlign: "center", py: 3, color: "#757575" }}
            >
              🚫 No pending timesheets available
            </Typography>
          ) : (
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
                  <TableRow>
                    <TableCell>
                      <strong>ID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Employee</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Project</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Task</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Effort</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Dates</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Actions</strong>
                    </TableCell>
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
                        <Box display="flex" gap={1} flexWrap="wrap">
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            sx={{ textTransform: "none" }}
                            onClick={() => approveTimesheet(sheet.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            sx={{ textTransform: "none" }}
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
          )}
        </DialogContent>

        <DialogActions
          sx={{ backgroundColor: "#f1f1f1", justifyContent: "center" }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Elegant Remark Dialog */}
      <Dialog
        open={remarkDialogOpen}
        onClose={() => {
          setRemarkDialogOpen(false);
          setRemark("");
          setRemarkError(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: "#212121",
            color: "#fff",
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          ❌ Reject Timesheet
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#2c2c2c" }}>
          <TextField
            autoFocus
            label="Reason for rejection"
            fullWidth
            multiline
            rows={4}
            value={remark}
            onChange={(e) => {
              setRemark(e.target.value);
              setRemarkError(false);
            }}
            variant="outlined"
            InputLabelProps={{ style: { color: "#bdbdbd" } }}
            InputProps={{ style: { color: "#fff" } }}
            error={remarkError}
            helperText={
              remarkError
                ? "⚠️ Remark is required to reject the timesheet."
                : ""
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: "#212121",
            px: 3,
            py: 2,
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={() => {
              setRemarkDialogOpen(false);
              setRemark("");
              setRemarkError(false);
            }}
            variant="outlined"
            sx={{
              color: "#fff",
              borderColor: "#9e9e9e",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#383838",
                borderColor: "#fff",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={rejectTimesheet}
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
              px: 4,
              fontWeight: 500,
              backgroundColor: "#d32f2f",
              "&:hover": {
                backgroundColor: "#b71c1c",
              },
            }}
          >
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
