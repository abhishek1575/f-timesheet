import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Stack,
} from "@mui/material";

const UpdateTimesheetDialog = ({
  open,
  onClose,
  timesheet,
  onChange,
  onSubmit,
}) => {
  if (!timesheet) return null;

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          onClose();
        }
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{
          backgroundColor: "#212121",
          color: "#E0E0E0",
          fontWeight: 600,
          textAlign: "center",
          fontSize: "1.3rem",
        }}
      >
        ✏️ Update Timesheet
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: "#2c2c2c",
          color: "#f5f5f5",
          py: 3,
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
            InputLabelProps={{ style: { color: "#BDBDBD" } }}
            InputProps={{
              style: { color: "#E0E0E0" },
            }}
          />
          <TextField
            label="Project"
            name="project"
            value={timesheet.project}
            onChange={onChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ style: { color: "#BDBDBD" } }}
            InputProps={{ style: { color: "#E0E0E0" } }}
          />
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={timesheet.startDate}
            onChange={onChange}
            fullWidth
            InputLabelProps={{ shrink: true, style: { color: "#BDBDBD" } }}
            InputProps={{ style: { color: "#E0E0E0" } }}
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={timesheet.endDate}
            onChange={onChange}
            fullWidth
            InputLabelProps={{ shrink: true, style: { color: "#BDBDBD" } }}
            InputProps={{ style: { color: "#E0E0E0" } }}
          />
          <TextField
            label="Effort (Hours)"
            name="effort"
            type="number"
            inputProps={{ min: 0, max: 24 }}
            value={timesheet.effort}
            onChange={onChange}
            fullWidth
            InputLabelProps={{ style: { color: "#BDBDBD" } }}
            InputProps={{ style: { color: "#E0E0E0" } }}
          />
        </Stack>
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
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            px: 3,
            py: 1,
            borderRadius: 2,
            color: "#ffffff",
            borderColor: "#9e9e9e",
            "&:hover": {
              borderColor: "#ffffff",
              backgroundColor: "#383838",
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
            px: 4,
            py: 1,
            borderRadius: 2,
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateTimesheetDialog;

// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Box,
// } from "@mui/material";

// const UpdateTimesheetDialog = ({
//   open,
//   onClose,
//   timesheet,
//   onChange,
//   onSubmit,
// }) => {
//   if (!timesheet) return null;

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle sx={{ backgroundColor: "#212121", color: "#E0E0E0" }}>
//         Update Timesheet
//       </DialogTitle>
//       <DialogContent
//         sx={{ backgroundColor: "#303030", color: "#E0E0E0", py: 2 }}
//       >
//         <Box display="flex" flexDirection="column" gap={2}>
//           <TextField
//             label="Task Name"
//             name="taskName"
//             value={timesheet.taskName}
//             onChange={onChange}
//             fullWidth
//             InputLabelProps={{ style: { color: "#E0E0E0" } }}
//             InputProps={{ style: { color: "#E0E0E0" } }}
//           />
//           <TextField
//             label="Project"
//             name="project"
//             value={timesheet.project}
//             onChange={onChange}
//             fullWidth
//             InputLabelProps={{ style: { color: "#E0E0E0" } }}
//             InputProps={{ style: { color: "#E0E0E0" } }}
//           />
//           <TextField
//             label="Start Date"
//             name="startDate"
//             type="date"
//             value={timesheet.startDate}
//             onChange={onChange}
//             fullWidth
//             InputLabelProps={{ shrink: true, style: { color: "#E0E0E0" } }}
//             InputProps={{ style: { color: "#E0E0E0" } }}
//           />
//           <TextField
//             label="End Date"
//             name="endDate"
//             type="date"
//             value={timesheet.endDate}
//             onChange={onChange}
//             fullWidth
//             InputLabelProps={{ shrink: true, style: { color: "#E0E0E0" } }}
//             InputProps={{ style: { color: "#E0E0E0" } }}
//           />
//           <TextField
//             label="Effort (Hours)"
//             name="effort"
//             type="number"
//             inputProps={{ min: 0, max: 24 }}
//             value={timesheet.effort}
//             onChange={onChange}
//             fullWidth
//             InputLabelProps={{ style: { color: "#E0E0E0" } }}
//             InputProps={{ style: { color: "#E0E0E0" } }}
//           />
//         </Box>
//       </DialogContent>
//       <DialogActions sx={{ backgroundColor: "#212121" }}>
//         <Button onClick={onClose} variant="outlined" color="inherit">
//           Cancel
//         </Button>
//         <Button onClick={onSubmit} variant="contained" color="primary">
//           Update
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default UpdateTimesheetDialog;
