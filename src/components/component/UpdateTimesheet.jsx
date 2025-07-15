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
  Typography,
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
      <DialogTitle
        sx={{
          backgroundColor: "#212121",
          color: "#E0E0E0",
          fontWeight: 600,
          fontSize: "1.25rem",
          letterSpacing: "0.5px",
          py: 2,
          textAlign: "center",
        }}
      >
        ✏️ Update Timesheet
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: "#f5f5f5" }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: "#ffffff",
            borderRadius: 3,
          }}
        >
          <Stack spacing={2}>
            <TextField
              label="Task Name"
              name="taskName"
              value={timesheet.taskName}
              onChange={onChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Project"
              name="project"
              value={timesheet.project}
              onChange={onChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Start Date"
              name="startDate"
              type="date"
              value={timesheet.startDate}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="End Date"
              name="endDate"
              type="date"
              value={timesheet.endDate}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Effort (Hours)"
              name="effort"
              type="number"
              value={timesheet.effort}
              onChange={onChange}
              fullWidth
              inputProps={{ min: 0, step: "0.1" }}
              variant="outlined"
            />
          </Stack>
        </Paper>
      </DialogContent>

      <DialogActions
        sx={{
          backgroundColor: "#eeeeee",
          px: 3,
          py: 2,
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            height: 40,
            color: "#424242",
            borderColor: "#9e9e9e",
            "&:hover": {
              borderColor: "#616161",
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 4,
            height: 40,
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Stack,
//   Paper,
// } from "@mui/material";

// export default function UpdateTimesheetForm({
//   open,
//   onClose,
//   timesheet,
//   onChange,
//   onSubmit,
// }) {
//   if (!timesheet) return null;

//   return (
//     <Dialog
//       open={open}
//       onClose={(event, reason) => {
//         if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
//           onClose();
//         }
//       }}
//       fullWidth
//       maxWidth="sm"
//     >
//       <DialogTitle>Update Timesheet</DialogTitle>
//       <DialogContent>
//         <Paper
//           elevation={0}
//           sx={{
//             p: 2,
//             backgroundColor: "#fafafa",
//             borderRadius: 2,
//           }}
//         >
//           <Stack spacing={2}>
//             <TextField
//               label="Task Name"
//               name="taskName"
//               value={timesheet.taskName}
//               onChange={onChange}
//               fullWidth
//             />
//             <TextField
//               label="Project"
//               name="project"
//               value={timesheet.project}
//               onChange={onChange}
//               fullWidth
//             />
//             <TextField
//               label="Start Date"
//               name="startDate"
//               type="date"
//               value={timesheet.startDate}
//               onChange={onChange}
//               InputLabelProps={{ shrink: true }}
//               fullWidth
//             />
//             <TextField
//               label="End Date"
//               name="endDate"
//               type="date"
//               value={timesheet.endDate}
//               onChange={onChange}
//               InputLabelProps={{ shrink: true }}
//               fullWidth
//             />
//             <TextField
//               label="Effort (Hours)"
//               name="effort"
//               type="number"
//               value={timesheet.effort}
//               onChange={onChange}
//               fullWidth
//             />
//           </Stack>
//         </Paper>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} variant="outlined">
//           Cancel
//         </Button>
//         <Button onClick={onSubmit} variant="contained">
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
