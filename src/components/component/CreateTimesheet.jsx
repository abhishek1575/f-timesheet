//old code with no condition of submit only on Monday and Tuesday

// import React, { useState } from "react";
// import {
//   TextField,
//   Button,
//   Box,
//   Typography,
//   Dialog,
//   DialogContent,
//   DialogActions,
//   Stack,
//   IconButton,
//   useMediaQuery,
//   useTheme,
//   Paper,
//   Snackbar,
//   Alert,
//   FormHelperText,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import {
//   createTimesheet,
//   submitTimesheet,
// } from "../../service/timesheetService";

// export default function CreateTimesheet({ onCancel, onTimesheetCreated }) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const MAX_WORDS = 150;

//   const [timesheet, setTimesheet] = useState({
//     taskName: "",
//     projectName: "",
//     startDate: "",
//     endDate: "",
//     effort: "",
//     comments: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const showSnackbar = (message, severity = "success") => {
//     setSnackbar({
//       open: true,
//       message,
//       severity,
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTimesheet({ ...timesheet, [name]: value });

//     if (errors[name]) {
//       setErrors({ ...errors, [name]: null });
//     }
//   };

//   const validate = () => {
//     const today = new Date().toISOString().split("T")[0];
//     const newErrors = {};

//     if (!timesheet.taskName.trim())
//       newErrors.taskName = "This field is compulsory";
//     if (!timesheet.projectName.trim())
//       newErrors.projectName = "This field is compulsory";
//     if (!timesheet.startDate) newErrors.startDate = "This field is compulsory";
//     else if (timesheet.startDate < today)
//       newErrors.startDate = "Start Date cannot be in the past";

//     if (!timesheet.endDate) newErrors.endDate = "This field is compulsory";
//     else if (timesheet.endDate < today)
//       newErrors.endDate = "End Date cannot be in the past";
//     else if (timesheet.endDate < timesheet.startDate)
//       newErrors.endDate = "End Date cannot be before Start Date";

//     if (!timesheet.effort) newErrors.effort = "This field is compulsory";

//     const wordCount = (timesheet.taskName || "")
//       .trim()
//       .split(/\s+/)
//       .filter(Boolean).length;
//     if (wordCount > MAX_WORDS)
//       newErrors.taskName = `Maximum ${MAX_WORDS} words allowed`;

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const saveDraft = async () => {
//     if (!validate()) {
//       showSnackbar("Please fill all required fields correctly", "error");
//       return;
//     }

//     try {
//       const payload = {
//         ...timesheet,
//         effort: Number(timesheet.effort),
//       };
//       const response = await createTimesheet(payload);

//       if (onTimesheetCreated) {
//         onTimesheetCreated(response);
//       }

//       showSnackbar("Draft saved successfully!");
//       resetForm();
//       setTimeout(() => onCancel(), 1000);
//       // Remove onCancel() or delay it until the snackbar is shown
//     } catch (err) {
//       console.error("Save draft error:", err);
//       showSnackbar("Failed to save draft", "error");
//     }
//   };

//   const handleSubmit = async () => {
//     if (!validate()) {
//       showSnackbar("Please fill all required fields correctly", "error");
//       return;
//     }

//     try {
//       const payload = {
//         ...timesheet,
//         effort: Number(timesheet.effort),
//       };
//       const response = await createTimesheet(payload);
//       await submitTimesheet(response.id);

//       if (onTimesheetCreated) {
//         onTimesheetCreated({ ...response, status: "SUBMITTED" });
//       }

//       showSnackbar("Timesheet submitted successfully!");
//       resetForm();
//       setTimeout(() => onCancel(), 1000);
//     } catch (err) {
//       console.error("Submit error:", err);
//       showSnackbar("Failed to submit timesheet", "error");
//     }
//   };

 
//   const resetForm = () => {
//     setTimesheet({
//       taskName: "",
//       projectName: "",
//       startDate: "",
//       endDate: "",
//       effort: "",
//       comments: "",
//     });
//     setErrors({});
//   };

//   const today = new Date().toISOString().split("T")[0];
//   const wordCount = (timesheet.taskName || "")
//     .trim()
//     .split(/\s+/)
//     .filter(Boolean).length;

//   return (
//     <>
//       <Dialog
//         open
//         onClose={onCancel}
//         fullWidth
//         maxWidth="xs"
//         fullScreen={isMobile}
//         PaperProps={{
//           sx: {
//             borderRadius: isMobile ? 0 : 2,
//             border: `1px solid ${theme.palette.divider}`,
//             boxShadow: theme.shadows[4],
//           },
//         }}
//       >
//         <Box
//           sx={{
//             background: theme.palette.primary.main,
//             color: theme.palette.primary.contrastText,
//             py: 1.2,
//             px: 2,
//             display: "flex",
//             alignItems: "center",
//           }}
//         >
//           <IconButton onClick={onCancel} sx={{ color: "inherit", mr: 1 }}>
//             <ArrowBackIcon fontSize="small" />
//           </IconButton>
//           <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//             New Timesheet
//           </Typography>
//         </Box>

//         <DialogContent sx={{ p: 2 }}>
//           <Paper
//             elevation={0}
//             sx={{
//               p: 2,
//               border: `1px solid ${theme.palette.divider}`,
//               borderRadius: 1.5,
//             }}
//           >
//             <Stack spacing={1.5}>
//               <Box>
//                 <TextField
//                   label="Task Name"
//                   name="taskName"
//                   value={timesheet.taskName}
//                   onChange={handleChange}
//                   fullWidth
//                   size="small"
//                   error={!!errors.taskName}
//                   multiline
//                   rows={4}
//                 />
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     mt: 0.5,
//                   }}
//                 >
//                   <FormHelperText error={!!errors.taskName}>
//                     {errors.taskName || " "}
//                   </FormHelperText>
//                   <Typography
//                     variant="caption"
//                     color={wordCount > MAX_WORDS ? "error" : "text.secondary"}
//                   >
//                     {wordCount} / {MAX_WORDS} words
//                   </Typography>
//                 </Box>
//               </Box>

//               <TextField
//                 label="Project Name"
//                 name="projectName"
//                 value={timesheet.projectName}
//                 onChange={handleChange}
//                 fullWidth
//                 size="small"
//                 error={!!errors.projectName}
//                 helperText={errors.projectName}
//               />

//               <Box sx={{ display: "flex", gap: 1 }}>
//                 <TextField
//                   label="Start Date"
//                   name="startDate"
//                   type="date"
//                   value={timesheet.startDate}
//                   onChange={handleChange}
//                   fullWidth
//                   size="small"
//                   InputLabelProps={{ shrink: true }}
//                   InputProps={{ inputProps: { min: today } }}
//                   error={!!errors.startDate}
//                   helperText={errors.startDate}
//                 />
//                 <TextField
//                   label="End Date"
//                   name="endDate"
//                   type="date"
//                   value={timesheet.endDate}
//                   onChange={handleChange}
//                   fullWidth
//                   size="small"
//                   InputLabelProps={{ shrink: true }}
//                   InputProps={{ inputProps: { min: today } }}
//                   error={!!errors.endDate}
//                   helperText={errors.endDate}
//                 />
//               </Box>

//               <TextField
//                 label="Hours Worked"
//                 name="effort"
//                 type="number"
//                 value={timesheet.effort}
//                 onChange={handleChange}
//                 fullWidth
//                 size="small"
//                 error={!!errors.effort}
//                 helperText={errors.effort || "Enter hours"}
//                 InputProps={{
//                   inputProps: { step: 0.25, min: 0.25, max: 24 },
//                 }}
//               />
//             </Stack>
//           </Paper>
//         </DialogContent>

//         <DialogActions sx={{ px: 2, pb: 2 }}>
//           <Button
//             variant="outlined"
//             size="small"
//             onClick={saveDraft}
//             sx={{ textTransform: "none", borderRadius: 1 }}
//           >
//             Save Draft
//           </Button>
//           <Button
//             variant="contained"
//             size="small"
//             onClick={handleSubmit}
//             sx={{ textTransform: "none", borderRadius: 1, boxShadow: "none" }}
//           >
//             Submit
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//           elevation={6}
//           variant="filled"
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// }


import React, { useState } from "react";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  createTimesheet,
  submitTimesheet,
} from "../../service/timesheetService";

export default function CreateTimesheet({ onCancel, onTimesheetCreated }) {
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
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Function to check if today is Monday (1) or Tuesday (2)
  const canSubmitTimesheet = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, 2 = Tuesday, etc.
    return dayOfWeek === 1 || dayOfWeek === 2;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTimesheet({ ...timesheet, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const today = new Date().toISOString().split("T")[0];
    const newErrors = {};

    if (!timesheet.taskName.trim())
      newErrors.taskName = "This field is compulsory";
    if (!timesheet.projectName.trim())
      newErrors.projectName = "This field is compulsory";
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
      const payload = {
        ...timesheet,
        effort: Number(timesheet.effort),
      };
      const response = await createTimesheet(payload);

      if (onTimesheetCreated) {
        onTimesheetCreated(response);
      }

      showSnackbar("Draft saved successfully!");
      resetForm();
      setTimeout(() => onCancel(), 1000);
    } catch (err) {
      console.error("Save draft error:", err);
      showSnackbar("Failed to save draft", "error");
    }
  };

  const handleSubmit = async () => {
    // Check if today is Monday or Tuesday
    if (!canSubmitTimesheet()) {
      showSnackbar(
        "Timesheets can only be submitted on Mondays and Tuesdays",
        "error"
      );
      return;
    }

    if (!validate()) {
      showSnackbar("Please fill all required fields correctly", "error");
      return;
    }

    try {
      const payload = {
        ...timesheet,
        effort: Number(timesheet.effort),
      };
      const response = await createTimesheet(payload);
      await submitTimesheet(response.id);

      if (onTimesheetCreated) {
        onTimesheetCreated({ ...response, status: "SUBMITTED" });
      }

      showSnackbar("Timesheet submitted successfully!");
      resetForm();
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
    });
    setErrors({});
  };

  const today = new Date().toISOString().split("T")[0];
  const wordCount = (timesheet.taskName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

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
            New Timesheet
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

              <TextField
                label="Project Name"
                name="projectName"
                value={timesheet.projectName}
                onChange={handleChange}
                fullWidth
                size="small"
                error={!!errors.projectName}
                helperText={errors.projectName}
              />

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
            Save Draft
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