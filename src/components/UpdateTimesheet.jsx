import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Paper,
} from "@mui/material";

export default function UpdateTimesheetForm({
  open,
  onClose,
  timesheet,
  onChange,
  onSubmit,
}) {
  if (!timesheet) return null;

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          onClose();
        }
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Update Timesheet</DialogTitle>
      <DialogContent>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: "#fafafa",
            borderRadius: 2,
          }}
        >
          <Stack spacing={2}>
            <TextField
              label="Task Name"
              name="taskName"
              value={timesheet.taskName}
              onChange={onChange}
              fullWidth
            />
            <TextField
              label="Project"
              name="project"
              value={timesheet.project}
              onChange={onChange}
              fullWidth
            />
            <TextField
              label="Start Date"
              name="startDate"
              type="date"
              value={timesheet.startDate}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="End Date"
              name="endDate"
              type="date"
              value={timesheet.endDate}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Effort (Hours)"
              name="effort"
              type="number"
              value={timesheet.effort}
              onChange={onChange}
              fullWidth
            />
          </Stack>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { TextField, Button, Paper, Typography, Stack } from "@mui/material";
// import { updateTimesheet, getTimesheetById } from "../service/timesheetService";

// export default function UpdateTimesheet() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [timesheet, setTimesheet] = useState({
//     taskName: "",
//     startDate: "",
//     endDate: "",
//     effort: "",
//     project: "",
//   });

//   useEffect(() => {
//     loadTimesheet();
//   }, []);

//   const loadTimesheet = async () => {
//     try {
//       const response = await getTimesheetById(id);
//       setTimesheet(response.data);
//     } catch (error) {
//       console.error("Error loading timesheet", error);
//     }
//   };

//   const handleChange = (e) => {
//     setTimesheet({ ...timesheet, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     try {
//       await updateTimesheet(id, timesheet);
//       alert("Timesheet updated successfully!");
//       navigate("/draft-timesheets"); // Redirect back to table
//     } catch (error) {
//       console.error("Update Error", error);
//     }
//   };

//   return (
//     <Paper sx={{ padding: 3, maxWidth: 600, margin: "auto", marginTop: 4 }}>
//       <Typography variant="h6" gutterBottom>
//         Update Timesheet
//       </Typography>
//       <Stack spacing={2}>
//         <TextField
//           label="Task Name"
//           name="taskName"
//           value={timesheet.taskName}
//           onChange={handleChange}
//           fullWidth
//         />
//         <TextField
//           label="Project"
//           name="project"
//           value={timesheet.project}
//           onChange={handleChange}
//           fullWidth
//         />
//         <TextField
//           label="Start Date"
//           name="startDate"
//           type="date"
//           value={timesheet.startDate}
//           onChange={handleChange}
//           InputLabelProps={{ shrink: true }}
//           fullWidth
//         />
//         <TextField
//           label="End Date"
//           name="endDate"
//           type="date"
//           value={timesheet.endDate}
//           onChange={handleChange}
//           InputLabelProps={{ shrink: true }}
//           fullWidth
//         />
//         <TextField
//           label="Effort (Hours)"
//           name="effort"
//           type="number"
//           value={timesheet.effort}
//           onChange={handleChange}
//           fullWidth
//         />
//         <Button variant="contained" onClick={handleSubmit}>
//           Save
//         </Button>
//       </Stack>
//     </Paper>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   getTimesheetById,
//   updateTimesheet,
// } from "../service/timesheetService";
// import { TextField, Button, Paper, Stack } from "@mui/material";

// export default function UpdateTimesheet() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     project: "",
//     taskName: "",
//     startDate: "",
//     endDate: "",
//     effort: "",
//   });

//   useEffect(() => {
//     loadTimesheet();
//   }, []);

//   const loadTimesheet = async () => {
//     try {
//       const res = await getTimesheetById(id);
//       setFormData(res.data);
//     } catch (error) {
//       console.error("Error loading timesheet", error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     try {
//       await updateTimesheet(id, formData);
//       alert("Timesheet Updated Successfully!");
//       navigate("/draft-timesheets");
//     } catch (error) {
//       console.error("Update Error", error);
//     }
//   };

//   return (
//     <Paper sx={{ p: 4, maxWidth: 500, mx: "auto" }}>
//       <h2>Update Timesheet</h2>
//       <Stack spacing={2}>
//         <TextField
//           label="Project"
//           name="project"
//           value={formData.project}
//           onChange={handleChange}
//         />
//         <TextField
//           label="Task Name"
//           name="taskName"
//           value={formData.taskName}
//           onChange={handleChange}
//         />
//         <TextField
//           type="date"
//           label="Start Date"
//           name="startDate"
//           value={formData.startDate}
//           onChange={handleChange}
//           InputLabelProps={{ shrink: true }}
//         />
//         <TextField
//           type="date"
//           label="End Date"
//           name="endDate"
//           value={formData.endDate}
//           onChange={handleChange}
//           InputLabelProps={{ shrink: true }}
//         />
//         <TextField
//           label="Effort"
//           name="effort"
//           type="number"
//           value={formData.effort}
//           onChange={handleChange}
//         />
//         <Button variant="contained" onClick={handleSubmit}>
//           Update
//         </Button>
//       </Stack>
//     </Paper>
//   );
// }
