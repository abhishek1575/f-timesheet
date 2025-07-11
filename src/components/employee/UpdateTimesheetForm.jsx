// src/components/UpdateTimesheetForm.jsx
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Timesheet</DialogTitle>
      <DialogContent>
        <Paper elevation={0} sx={{ p: 2, backgroundColor: "#fafafa" }}>
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
