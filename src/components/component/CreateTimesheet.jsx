import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Stack,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  createTimesheet,
  submitTimesheet,
} from "../../service/timesheetService";

export default function CreateTimesheet({ onCancel, onTimesheetCreated }) {
  const [timesheet, setTimesheet] = useState({
    taskName: "",
    projectName: "",
    startDate: "",
    endDate: "",
    effort: "",
    comments: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTimesheet({ ...timesheet, [name]: value });
  };

  const validate = () => {
    const today = new Date().toISOString().split("T")[0];
    const newErrors = {};

    if (!timesheet.taskName) newErrors.taskName = "This field is compulsory";
    if (!timesheet.projectName)
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
    if (wordCount > 150) newErrors.taskName = "Maximum 150 words allowed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveDraft = async () => {
    try {
      const payload = {
        ...timesheet,
        effort: Number(timesheet.effort),
      };
      const response = await createTimesheet(payload);
      if (onTimesheetCreated) {
        onTimesheetCreated(response); // notify parent immediately
      }
      alert("Draft saved successfully!");
      resetForm();
      onCancel();
    } catch (err) {
      console.error("Save draft error:", err);
      alert("Failed to save draft.");
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      // First create the timesheet (draft)
      const payload = {
        ...timesheet,
        effort: Number(timesheet.effort),
      };
      const response = await createTimesheet(payload);

      // Then submit the created timesheet
      await submitTimesheet(response.id);

      if (onTimesheetCreated) {
        onTimesheetCreated({ ...response, status: "SUBMITTED" }); // notify parent
      }

      alert("Timesheet submitted successfully!");
      resetForm();
      onCancel();
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to submit timesheet.");
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

  return (
    <Paper
      elevation={4}
      sx={{
        width: "100%",
        maxWidth: "800px",
        p: { xs: 3, sm: 4 },
        overflowX: "hidden",
        mx: "auto",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={onCancel}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1, textAlign: "center" }}>
          <Typography variant="h6">Create Timesheet</Typography>
        </Box>
      </Box>

      <Stack spacing={2}>
        <TextField
          label="Task Name"
          name="taskName"
          value={timesheet.taskName}
          onChange={handleChange}
          multiline
          minRows={3}
          fullWidth
          error={!!errors.taskName}
          helperText={
            errors.taskName ||
            `${
              (timesheet.taskName || "").trim().split(/\s+/).filter(Boolean)
                .length
            } / 150 words`
          }
        />

        <TextField
          label="Project Name"
          name="projectName"
          value={timesheet.projectName}
          onChange={handleChange}
          fullWidth
          error={!!errors.projectName}
          helperText={errors.projectName}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={timesheet.startDate}
            onChange={handleChange}
            fullWidth
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
            InputLabelProps={{ shrink: true }}
            InputProps={{ inputProps: { min: today } }}
            error={!!errors.endDate}
            helperText={errors.endDate}
          />
        </Box>

        <TextField
          label="Effort (Hours)"
          name="effort"
          type="number"
          value={timesheet.effort}
          onChange={handleChange}
          fullWidth
          error={!!errors.effort}
          helperText={errors.effort}
          InputProps={{ inputProps: { step: "0.1", min: 0 } }}
        />

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Button variant="outlined" onClick={saveDraft}>
            Save as Draft
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}

// import React, { useState } from "react";
// import {
//   TextField,
//   Button,
//   Box,
//   Typography,
//   Paper,
//   Stack,
//   IconButton,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import {
//   createTimesheet,
//   submitTimesheet,
// } from "../../service/timesheetService";

// export default function CreateTimesheet({ onCancel }) {
//   const [timesheet, setTimesheet] = useState({
//     taskName: "",
//     projectName: "",
//     startDate: "",
//     endDate: "",
//     effort: "",
//     comments: "",
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTimesheet({ ...timesheet, [name]: value });
//   };

//   const validate = () => {
//     const today = new Date().toISOString().split("T")[0];
//     const newErrors = {};

//     if (!timesheet.taskName) newErrors.taskName = "This field is compulsory";
//     if (!timesheet.projectName)
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
//     if (wordCount > 150) newErrors.taskName = "Maximum 150 words allowed";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const saveDraft = async () => {
//     try {
//       const payload = {
//         ...timesheet,
//         effort: Number(timesheet.effort),
//       };
//       await createTimesheet(payload);
//       alert("Draft saved successfully!");
//       resetForm();
//       onCancel();
//     } catch (err) {
//       console.error("Save draft error:", err);
//       alert("Failed to save draft.");
//     }
//   };

//   const handleSubmit = async () => {
//     if (!validate()) return;
//     try {
//       // First create the timesheet (draft)
//       const payload = {
//         ...timesheet,
//         effort: Number(timesheet.effort),
//       };
//       const response = await createTimesheet(payload);

//       // Then submit the created timesheet
//       await submitTimesheet(response.id);
//       alert("Timesheet submitted successfully!");
//       resetForm();
//       onCancel();
//     } catch (err) {
//       console.error("Submit error:", err);
//       alert("Failed to submit timesheet.");
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

//   return (
//     <Paper
//       elevation={4}
//       sx={{
//         width: "100%",
//         maxWidth: "800px",
//         p: { xs: 3, sm: 4 },
//         overflowX: "hidden",
//         mx: "auto",
//       }}
//     >
//       <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//         <IconButton onClick={onCancel}>
//           <ArrowBackIcon />
//         </IconButton>
//         <Box sx={{ flexGrow: 1, textAlign: "center" }}>
//           <Typography variant="h6">Create Timesheet</Typography>
//         </Box>
//       </Box>

//       <Stack spacing={2}>
//         <TextField
//           label="Task Name"
//           name="taskName"
//           value={timesheet.taskName}
//           onChange={handleChange}
//           multiline
//           minRows={3}
//           fullWidth
//           error={!!errors.taskName}
//           helperText={
//             errors.taskName ||
//             `${
//               (timesheet.taskName || "").trim().split(/\s+/).filter(Boolean)
//                 .length
//             } / 150 words`
//           }
//         />

//         <TextField
//           label="Project Name"
//           name="projectName"
//           value={timesheet.projectName}
//           onChange={handleChange}
//           fullWidth
//           error={!!errors.projectName}
//           helperText={errors.projectName}
//         />

//         <Box sx={{ display: "flex", gap: 2 }}>
//           <TextField
//             label="Start Date"
//             name="startDate"
//             type="date"
//             value={timesheet.startDate}
//             onChange={handleChange}
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             InputProps={{ inputProps: { min: today } }}
//             error={!!errors.startDate}
//             helperText={errors.startDate}
//           />
//           <TextField
//             label="End Date"
//             name="endDate"
//             type="date"
//             value={timesheet.endDate}
//             onChange={handleChange}
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             InputProps={{ inputProps: { min: today } }}
//             error={!!errors.endDate}
//             helperText={errors.endDate}
//           />
//         </Box>

//         <TextField
//           label="Effort (Hours)"
//           name="effort"
//           type="number"
//           value={timesheet.effort}
//           onChange={handleChange}
//           fullWidth
//           error={!!errors.effort}
//           helperText={errors.effort}
//           InputProps={{ inputProps: { step: "0.1", min: 0 } }}
//         />

//         <Box
//           sx={{
//             display: "flex",
//             flexWrap: "wrap",
//             justifyContent: "space-between",
//             gap: 1,
//           }}
//         >
//           <Button variant="outlined" onClick={saveDraft}>
//             Save as Draft
//           </Button>
//           <Button variant="contained" color="primary" onClick={handleSubmit}>
//             Submit
//           </Button>
//         </Box>
//       </Stack>
//     </Paper>
//   );
// }
