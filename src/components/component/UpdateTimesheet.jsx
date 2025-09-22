// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Stack,
//   Box,
//   IconButton,
//   Typography,
//   useTheme,
//   Paper,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// export default function UpdateTimesheetForm({
//   open,
//   onClose,
//   timesheet,
//   onChange,
//   onSubmit,
// }) {
//   const theme = useTheme();

//   if (!timesheet) return null;

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       fullWidth
//       maxWidth="sm"
//       PaperProps={{
//         sx: {
//           borderRadius: "8px",
//           border: "1px solid",
//           borderColor: theme.palette.divider,
//           width: "100%",
//           maxWidth: "600px",
//           overflow: "hidden",
//           boxShadow: theme.shadows[5],
//         },
//       }}
//     >
//       {/* Header with subtle border */}
//       <DialogTitle
//         sx={{
//           p: "16px 24px",
//           borderBottom: "1px solid",
//           borderColor: theme.palette.divider,
//           backgroundColor: theme.palette.background.paper,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <Typography variant="h6" sx={{ fontWeight: 600 }}>
//           Update Timesheet
//         </Typography>
//         <IconButton
//           onClick={onClose}
//           sx={{
//             color: theme.palette.text.secondary,
//             "&:hover": {
//               backgroundColor: theme.palette.action.hover,
//             },
//           }}
//         >
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       {/* Form content with bordered container */}
//       <DialogContent sx={{ p: 0 }}>
//         <Paper
//           elevation={0}
//           sx={{
//             p: "24px",
//             m: "16px",
//             borderRadius: "6px",
//             border: "1px solid",
//             borderColor: theme.palette.divider,
//             backgroundColor: theme.palette.background.paper,
//           }}
//         >
//           <Stack spacing={3}>
//             {/* Task Description */}
//             <TextField
//               label="Task Description"
//               name="taskName"
//               value={timesheet.taskName || ""}
//               onChange={onChange}
//               multiline
//               minRows={3}
//               fullWidth
//               variant="outlined"
//               size="small"
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: "4px",
//                   "& fieldset": {
//                     borderColor: theme.palette.divider,
//                   },
//                   "&:hover fieldset": {
//                     borderColor: theme.palette.primary.main,
//                   },
//                 },
//               }}
//             />

//             {/* Project Name */}
//             <TextField
//               label="Project Name"
//               name="projectName"
//               value={timesheet.projectName || ""}
//               onChange={onChange}
//               fullWidth
//               variant="outlined"
//               size="small"
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: "4px",
//                   "& fieldset": {
//                     borderColor: theme.palette.divider,
//                   },
//                   "&:hover fieldset": {
//                     borderColor: theme.palette.primary.main,
//                   },
//                 },
//               }}
//             />

//             {/* Date Fields */}
//             <Box sx={{ display: "flex", gap: 2 }}>
//               <TextField
//                 label="Start Date"
//                 name="startDate"
//                 type="date"
//                 value={timesheet.startDate || ""}
//                 onChange={onChange}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 variant="outlined"
//                 size="small"
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: "4px",
//                     "& fieldset": {
//                       borderColor: theme.palette.divider,
//                     },
//                     "&:hover fieldset": {
//                       borderColor: theme.palette.primary.main,
//                     },
//                   },
//                 }}
//               />
//               <TextField
//                 label="End Date"
//                 name="endDate"
//                 type="date"
//                 value={timesheet.endDate || ""}
//                 onChange={onChange}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 variant="outlined"
//                 size="small"
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: "4px",
//                     "& fieldset": {
//                       borderColor: theme.palette.divider,
//                     },
//                     "&:hover fieldset": {
//                       borderColor: theme.palette.primary.main,
//                     },
//                   },
//                 }}
//               />
//             </Box>

//             {/* Hours Worked */}
//             <TextField
//               label="Hours Worked"
//               name="effort"
//               type="number"
//               value={timesheet.effort || ""}
//               onChange={onChange}
//               fullWidth
//               InputProps={{
//                 inputProps: {
//                   step: "0.25",
//                   min: 0.25,
//                   max: 24,
//                 },
//               }}
//               variant="outlined"
//               size="small"
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: "4px",
//                   "& fieldset": {
//                     borderColor: theme.palette.divider,
//                   },
//                   "&:hover fieldset": {
//                     borderColor: theme.palette.primary.main,
//                   },
//                 },
//               }}
//             />
//           </Stack>
//         </Paper>
//       </DialogContent>

//       {/* Footer with action buttons */}
//       <DialogActions
//         sx={{
//           p: "16px 24px",
//           borderTop: "1px solid",
//           borderColor: theme.palette.divider,
//           backgroundColor: theme.palette.background.paper,
//         }}
//       >
//         <Button
//           variant="outlined"
//           onClick={onClose}
//           sx={{
//             minWidth: "120px",
//             height: "40px",
//             borderRadius: "4px",
//             borderWidth: "1.5px",
//             textTransform: "none",
//             fontWeight: 500,
//             "&:hover": {
//               borderWidth: "1.5px",
//             },
//           }}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={onSubmit}
//           sx={{
//             minWidth: "120px",
//             height: "40px",
//             borderRadius: "4px",
//             textTransform: "none",
//             fontWeight: 500,
//             boxShadow: "none",
//             "&:hover": {
//               boxShadow: "none",
//               backgroundColor: theme.palette.primary.dark,
//             },
//           }}
//         >
//           Save Changes
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }


//--------------------with instaed of project name task category and dropdown --------------------

import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Stack,
  IconButton,
  useMediaQuery,
  useTheme,
  Paper,
  Snackbar,
  Alert,
  FormHelperText,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  createTimesheet,
  submitTimesheet,
  updateTimesheet,
  getTimesheetById,
} from "../../service/timesheetService";

export default function UpdateTimesheet({
  timesheetId,
  onCancel,
  onTimesheetUpdated,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const MAX_WORDS = 150;

  const [timesheet, setTimesheet] = useState({
    taskName: "",
    projectName: "",
    startDate: "",
    endDate: "",
    effort: "",
    comments: "",
    otherActivity: "",
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (timesheetId) {
      fetchTimesheet();
    }
  }, [timesheetId]);

  const fetchTimesheet = async () => {
    try {
      const response = await getTimesheetById(timesheetId);

      // Check if the projectName is one of the predefined options
      const predefinedOptions = [
        "Development",
        "Testing",
        "Design",
        "Debugging",
        "Support",
        "Coordination",
        "Outdoor activities",
      ];

      const isPredefined = predefinedOptions.includes(response.projectName);

      setTimesheet({
        ...response,
        projectName: isPredefined ? response.projectName : "Other",
        otherActivity: isPredefined ? "" : response.projectName,
      });
    } catch (err) {
      console.error("Error fetching timesheet:", err);
      showSnackbar("Failed to load timesheet", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

const handleChange = (e) => {
  const { name, value } = e.target;
  setLocalTimesheet((prev) => ({ ...prev, [name]: value })); // Only update local
  if (errors[name]) setErrors({ ...errors, [name]: null });
};


  const validate = () => {
    const today = new Date().toISOString().split("T")[0];
    const newErrors = {};

    if (!timesheet.taskName.trim())
      newErrors.taskName = "This field is compulsory";

    if (!timesheet.projectName)
      newErrors.projectName = "This field is compulsory";
    else if (
      timesheet.projectName === "Other" &&
      !timesheet.otherActivity.trim()
    )
      newErrors.otherActivity = "Please specify your activity";

    if (!timesheet.startDate) newErrors.startDate = "This field is compulsory";
    else if (timesheet.startDate < today)
      newErrors.startDate = "Start Date cannot be in the past";

    if (!timesheet.endDate) newErrors.endDate = "This field is compulsory";
    else if (timesheet.endDate < today)
      newErrors.endDate = "End Date cannot be in the past";
    else if (timesheet.endDate < timesheet.startDate)
      newErrors.endDate = "End Date cannot be before Start Date";

    if (!timesheet.effort) newErrors.effort = "This field is compulsory";

    const wordCount = (timesheet.taskName || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    if (wordCount > MAX_WORDS)
      newErrors.taskName = `Maximum ${MAX_WORDS} words allowed`;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveDraft = async () => {
    if (!validate()) {
      showSnackbar("Please fill all required fields correctly", "error");
      return;
    }

    try {
      // If "Other" is selected, use the custom activity text as projectName
      const projectName =
        timesheet.projectName === "Other"
          ? timesheet.otherActivity
          : timesheet.projectName;

      const payload = {
        ...timesheet,
        projectName,
        effort: Number(timesheet.effort),
      };

      // Remove otherActivity from payload as it's not needed in the backend
      delete payload.otherActivity;

      const response = await updateTimesheet(timesheetId, payload);

      if (onTimesheetUpdated) {
        onTimesheetUpdated(response);
      }

      showSnackbar("Timesheet updated successfully!");
      setTimeout(() => onCancel(), 1000);
    } catch (err) {
      console.error("Update timesheet error:", err);
      showSnackbar("Failed to update timesheet", "error");
    }
  };

  const handleSubmit = async () => {
    if (!validate()) {
      showSnackbar("Please fill all required fields correctly", "error");
      return;
    }

    try {
      // If "Other" is selected, use the custom activity text as projectName
      const projectName =
        timesheet.projectName === "Other"
          ? timesheet.otherActivity
          : timesheet.projectName;

      const payload = {
        ...timesheet,
        projectName,
        effort: Number(timesheet.effort),
      };

      // Remove otherActivity from payload as it's not needed in the backend
      delete payload.otherActivity;

      const response = await updateTimesheet(timesheetId, payload);
      await submitTimesheet(response.id);

      if (onTimesheetUpdated) {
        onTimesheetUpdated({ ...response, status: "SUBMITTED" });
      }

      showSnackbar("Timesheet submitted successfully!");
      setTimeout(() => onCancel(), 1000);
    } catch (err) {
      console.error("Submit error:", err);
      showSnackbar("Failed to submit timesheet", "error");
    }
  };

  const resetForm = () => {
    setTimesheet({
      taskName: "",
      projectName: "",
      startDate: "",
      endDate: "",
      effort: "",
      comments: "",
      otherActivity: "",
    });
    setErrors({});
  };

  const today = new Date().toISOString().split("T")[0];
  const wordCount = (timesheet.taskName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Dialog
        open
        onClose={onCancel}
        fullWidth
        maxWidth="xs"
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <Box
          sx={{
            background: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            py: 1.2,
            px: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton onClick={onCancel} sx={{ color: "inherit", mr: 1 }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Update Timesheet
          </Typography>
        </Box>

        <DialogContent sx={{ p: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1.5,
            }}
          >
            <Stack spacing={1.5}>
              <Box>
                <TextField
                  label="Task Name"
                  name="taskName"
                  value={timesheet.taskName}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  error={!!errors.taskName}
                  multiline
                  rows={4}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 0.5,
                  }}
                >
                  <FormHelperText error={!!errors.taskName}>
                    {errors.taskName || " "}
                  </FormHelperText>
                  <Typography
                    variant="caption"
                    color={wordCount > MAX_WORDS ? "error" : "text.secondary"}
                  >
                    {wordCount} / {MAX_WORDS} words
                  </Typography>
                </Box>
              </Box>

              <FormControl fullWidth size="small" error={!!errors.projectName}>
                <InputLabel id="project-name-label">Task Category</InputLabel>
                <Select
                  labelId="project-name-label"
                  label="Project Name"
                  name="projectName"
                  value={timesheet.projectName}
                  onChange={handleChange}
                >
                  <MenuItem value="Development">Development</MenuItem>
                  <MenuItem value="Testing">Testing</MenuItem>
                  <MenuItem value="Design">Design</MenuItem>
                  <MenuItem value="Debugging">Debugging</MenuItem>
                  <MenuItem value="Support">Support</MenuItem>
                  <MenuItem value="Coordination">Coordination</MenuItem>
                  <MenuItem value="Outdoor activities">
                    Outdoor activities
                  </MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
                {errors.projectName && (
                  <FormHelperText>{errors.projectName}</FormHelperText>
                )}
              </FormControl>

              {timesheet.projectName === "Other" && (
                <TextField
                  label="Specify your Activity"
                  name="otherActivity"
                  value={timesheet.otherActivity}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  error={!!errors.otherActivity}
                  helperText={errors.otherActivity}
                />
              )}

              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={timesheet.startDate}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ inputProps: { min: today } }}
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                />
                <TextField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={timesheet.endDate}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ inputProps: { min: today } }}
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                />
              </Box>

              <TextField
                label="Hours Worked"
                name="effort"
                type="number"
                value={timesheet.effort}
                onChange={handleChange}
                fullWidth
                size="small"
                error={!!errors.effort}
                helperText={errors.effort || "Enter hours"}
                InputProps={{
                  inputProps: { step: 0.25, min: 0.25, max: 24 },
                }}
              />
            </Stack>
          </Paper>
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={saveDraft}
            sx={{ textTransform: "none", borderRadius: 1 }}
          >
            Update Draft
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleSubmit}
            sx={{ textTransform: "none", borderRadius: 1, boxShadow: "none" }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
