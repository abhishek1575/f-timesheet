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
} from "@mui/material";
import axios from "axios";
import config from "../../service/config";
import {
  submitTimesheet,
  updateTimesheet,
  resubmitTimesheet,
} from "../../service/timesheetService";
import UpdateTimesheetDialog from "../employee/UpdateTimesheetDialog.jsx";
// Update this import path as per your project

const RejectedTimesheetDialog = ({ open, onClose }) => {
  const [rejectedTimesheets, setRejectedTimesheets] = useState([]);
  const [editingTimesheet, setEditingTimesheet] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const fetchRejectedTimesheets = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.get(`${config.BASE_URL}sheets/rejected`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRejectedTimesheets(response.data);
    } catch (error) {
      console.error("Error fetching rejected timesheets", error);
    }
  };

  useEffect(() => {
    if (open) fetchRejectedTimesheets();
  }, [open]);

  // const handleResubmit = async (id) => {
  //   try {
  //     await submitTimesheet(id);
  //     alert("Timesheet Resubmitted Successfully!");
  //     fetchRejectedTimesheets();
  //   } catch (error) {
  //     alert("Failed to resubmit timesheet.");
  //   }
  // };

  const handleResubmit = async (id) => {
    try {
      await resubmitTimesheet(id); // ✅ Step 1: Revise the timesheet
      await submitTimesheet(id); // ✅ Step 2: Submit the timesheet
      alert("Timesheet Resubmitted Successfully!");
      fetchRejectedTimesheets();
    } catch (error) {
      console.error(
        "Resubmission Failed:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Failed to resubmit timesheet.");
    }
  };


  const handleEdit = (timesheet) => {
    console.log("Editing timesheet:", timesheet);
    setEditingTimesheet(timesheet);
    setUpdateDialogOpen(true);
  };

  const handleDialogChange = (e) => {
    setEditingTimesheet({
      ...editingTimesheet,
      [e.target.name]: e.target.value,
    });
  };

  const handleDialogSubmit = async () => {
    try {
      const allowedFields = {
        taskName: editingTimesheet.taskName,
        project: editingTimesheet.project,
        startDate: editingTimesheet.startDate,
        endDate: editingTimesheet.endDate,
        effort: editingTimesheet.effort,
      };

      await updateTimesheet(editingTimesheet.id, allowedFields);
      console.log("Sending timesheet update payload:", allowedFields);

      alert("Timesheet updated successfully!");
      setUpdateDialogOpen(false);
      fetchRejectedTimesheets();
    } catch (error) {
      console.error("Update Error", error);
      alert("Failed to update timesheet.");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: "#212121", color: "#E0E0E0" }}>
          Rejected Timesheets
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#2c2c2c", color: "#f5f5f5" }}>
          {rejectedTimesheets.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                padding: "1rem",
                fontStyle: "italic",
                color: "#bdbdbd",
              }}
            >
              🚫 No rejected timesheets found
            </p>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "Project",
                    "Task Name",
                    "Start Date",
                    "End Date",
                    "Comments",
                    "Actions",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{ color: "#f5f5f5", fontWeight: 600 }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rejectedTimesheets.map((ts) => (
                  <TableRow
                    key={ts.id}
                    hover
                    sx={{ backgroundColor: "#424242" }}
                  >
                    <TableCell sx={{ color: "#e0e0e0" }}>
                      {ts.project}
                    </TableCell>
                    <TableCell sx={{ color: "#e0e0e0" }}>
                      {ts.taskName}
                    </TableCell>
                    <TableCell sx={{ color: "#e0e0e0" }}>
                      {ts.startDate}
                    </TableCell>
                    <TableCell sx={{ color: "#e0e0e0" }}>
                      {ts.endDate}
                    </TableCell>
                    <TableCell sx={{ color: "#e0e0e0" }}>
                      {ts.comments}
                    </TableCell>
                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <Button
                          variant="outlined"
                          color="info"
                          size="small"
                          fullWidth
                          onClick={() => handleEdit(ts)}
                          sx={{ textTransform: "none" }}
                        >
                          Update
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          fullWidth
                          onClick={() => handleResubmit(ts.id)}
                          sx={{ textTransform: "none" }}
                        >
                          Submit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions
          sx={{ backgroundColor: "#212121", justifyContent: "center" }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              color: "#ffffff",
              borderColor: "#bdbdbd",
              textTransform: "none",
              px: 3,
              py: 1,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#424242",
                borderColor: "#ffffff",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Timesheet Dialog */}
      <UpdateTimesheetDialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        timesheet={editingTimesheet}
        onChange={handleDialogChange}
        onSubmit={handleDialogSubmit}
      />
    </>
  );
};

export default RejectedTimesheetDialog;

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
// } from "@mui/material";
// import axios from "axios";
// import config from "../../service/config";
// import {
//   submitTimesheet,
//   updateTimesheet,
// } from "../../service/timesheetService";
// import UpdateTimesheetDialog from "../employee/UpdateTimesheetDialog.jsx";
// // Update this import path as per your project

// const RejectedTimesheetDialog = ({ open, onClose }) => {
//   const [rejectedTimesheets, setRejectedTimesheets] = useState([]);
//   const [editingTimesheet, setEditingTimesheet] = useState(null);
//   const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

//   const fetchRejectedTimesheets = async () => {
//     const token = sessionStorage.getItem("token");
//     try {
//       const response = await axios.get(`${config.BASE_URL}sheets/rejected`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRejectedTimesheets(response.data);
//     } catch (error) {
//       console.error("Error fetching rejected timesheets", error);
//     }
//   };

//   useEffect(() => {
//     if (open) fetchRejectedTimesheets();
//   }, [open]);

//   const handleResubmit = async (id) => {
//     try {
//       await submitTimesheet(id);
//       alert("Timesheet Resubmitted Successfully!");
//       fetchRejectedTimesheets();
//     } catch (error) {
//       alert("Failed to resubmit timesheet.");
//     }
//   };

//   const handleEdit = (timesheet) => {
//     console.log("Editing timesheet:", timesheet);
//     setEditingTimesheet(timesheet);
//     setUpdateDialogOpen(true);
//   };

//   const handleDialogChange = (e) => {
//     setEditingTimesheet({
//       ...editingTimesheet,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleDialogSubmit = async () => {
//     try {
//       const allowedFields = {
//         taskName: editingTimesheet.taskName,
//         project: editingTimesheet.project,
//         startDate: editingTimesheet.startDate,
//         endDate: editingTimesheet.endDate,
//         effort: editingTimesheet.effort,
//       };

//       await updateTimesheet(editingTimesheet.id, allowedFields);
//       console.log("Sending timesheet update payload:", allowedFields);

//       alert("Timesheet updated successfully!");
//       setUpdateDialogOpen(false);
//       fetchRejectedTimesheets();
//     } catch (error) {
//       console.error("Update Error", error);
//       alert("Failed to update timesheet.");
//     }
//   };

//   return (
//     <>
//       <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//         <DialogTitle sx={{ backgroundColor: "#212121", color: "#E0E0E0" }}>
//           Rejected Timesheets
//         </DialogTitle>
//         <DialogContent sx={{ backgroundColor: "#303030", color: "#E0E0E0" }}>
//           {rejectedTimesheets.length === 0 ? (
//             <p>No rejected timesheets found.</p>
//           ) : (
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell sx={{ color: "#E0E0E0" }}>Project</TableCell>
//                   <TableCell sx={{ color: "#E0E0E0" }}>Task Name</TableCell>
//                   <TableCell sx={{ color: "#E0E0E0" }}>Start Date</TableCell>
//                   <TableCell sx={{ color: "#E0E0E0" }}>End Date</TableCell>
//                   <TableCell sx={{ color: "#E0E0E0" }}>Comments</TableCell>
//                   <TableCell sx={{ color: "#E0E0E0" }}>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {rejectedTimesheets.map((ts) => (
//                   <TableRow key={ts.id}>
//                     <TableCell>{ts.project}</TableCell>
//                     <TableCell>{ts.taskName}</TableCell>
//                     <TableCell>{ts.startDate}</TableCell>
//                     <TableCell>{ts.endDate}</TableCell>
//                     <TableCell>{ts.comments}</TableCell>
//                     <TableCell>
//                       <Button
//                         variant="outlined"
//                         color="inherit"
//                         size="small"
//                         onClick={() => handleEdit(ts)}
//                         sx={{ mb: 1 }}
//                       >
//                         Update
//                       </Button>
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         size="small"
//                         onClick={() => handleResubmit(ts.id)}
//                       >
//                         Submit
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </DialogContent>
//         <DialogActions sx={{ backgroundColor: "#212121" }}>
//           <Button onClick={onClose} variant="outlined" color="inherit">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Update Timesheet Dialog */}
//       <UpdateTimesheetDialog
//         open={updateDialogOpen}
//         onClose={() => setUpdateDialogOpen(false)}
//         timesheet={editingTimesheet}
//         onChange={handleDialogChange}
//         onSubmit={handleDialogSubmit}
//       />
//     </>
//   );
// };

// export default RejectedTimesheetDialog;
