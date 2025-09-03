import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
  IconButton,
  Typography,
  useTheme,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function UpdateTimesheetForm({
  open,
  onClose,
  timesheet,
  onChange,
  onSubmit,
}) {
  const theme = useTheme();

  if (!timesheet) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "8px",
          border: "1px solid",
          borderColor: theme.palette.divider,
          width: "100%",
          maxWidth: "600px",
          overflow: "hidden",
          boxShadow: theme.shadows[5],
        },
      }}
    >
      {/* Header with subtle border */}
      <DialogTitle
        sx={{
          p: "16px 24px",
          borderBottom: "1px solid",
          borderColor: theme.palette.divider,
          backgroundColor: theme.palette.background.paper,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Update Timesheet
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: theme.palette.text.secondary,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Form content with bordered container */}
      <DialogContent sx={{ p: 0 }}>
        <Paper
          elevation={0}
          sx={{
            p: "24px",
            m: "16px",
            borderRadius: "6px",
            border: "1px solid",
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Stack spacing={3}>
            {/* Task Description */}
            <TextField
              label="Task Description"
              name="taskName"
              value={timesheet.taskName || ""}
              onChange={onChange}
              multiline
              minRows={3}
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "4px",
                  "& fieldset": {
                    borderColor: theme.palette.divider,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />

            {/* Project Name */}
            <TextField
              label="Project Name"
              name="projectName"
              value={timesheet.projectName || ""}
              onChange={onChange}
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "4px",
                  "& fieldset": {
                    borderColor: theme.palette.divider,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />

            {/* Date Fields */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Start Date"
                name="startDate"
                type="date"
                value={timesheet.startDate || ""}
                onChange={onChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "4px",
                    "& fieldset": {
                      borderColor: theme.palette.divider,
                    },
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
              <TextField
                label="End Date"
                name="endDate"
                type="date"
                value={timesheet.endDate || ""}
                onChange={onChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "4px",
                    "& fieldset": {
                      borderColor: theme.palette.divider,
                    },
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </Box>

            {/* Hours Worked */}
            <TextField
              label="Hours Worked"
              name="effort"
              type="number"
              value={timesheet.effort || ""}
              onChange={onChange}
              fullWidth
              InputProps={{
                inputProps: {
                  step: "0.25",
                  min: 0.25,
                  max: 24,
                },
              }}
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "4px",
                  "& fieldset": {
                    borderColor: theme.palette.divider,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Stack>
        </Paper>
      </DialogContent>

      {/* Footer with action buttons */}
      <DialogActions
        sx={{
          p: "16px 24px",
          borderTop: "1px solid",
          borderColor: theme.palette.divider,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            minWidth: "120px",
            height: "40px",
            borderRadius: "4px",
            borderWidth: "1.5px",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              borderWidth: "1.5px",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          sx={{
            minWidth: "120px",
            height: "40px",
            borderRadius: "4px",
            textTransform: "none",
            fontWeight: 500,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

