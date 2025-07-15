import React, { useState, useEffect } from "react";
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
import { createTimesheet, submitTimesheet } from "../../service/timesheetService";

export default function CreateTimesheet({ onCancel }) {
  const [timesheet, setTimesheet] = useState({
    taskName: "",
    project: "",
    startDate: "",
    endDate: "",
    effort: "",
    comments: "",
  });

  const [errors, setErrors] = useState({});
  const [timesheetId, setTimesheetId] = useState(null);

  useEffect(() => {
    const draft = localStorage.getItem("draftTimesheet");
    const savedId = localStorage.getItem("draftTimesheetId");
    if (draft) setTimesheet(JSON.parse(draft));
    if (savedId) setTimesheetId(savedId);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTimesheet({ ...timesheet, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!timesheet.taskName) newErrors.taskName = "This field is compulsory";
    if (!timesheet.project) newErrors.project = "This field is compulsory";

    if (!timesheet.startDate) {
      newErrors.startDate = "This field is compulsory";
    } else if (timesheet.startDate < today) {
      newErrors.startDate = "Start Date cannot be in the past";
    }

    if (!timesheet.endDate) {
      newErrors.endDate = "This field is compulsory";
    } else if (timesheet.endDate < today) {
      newErrors.endDate = "End Date cannot be in the past";
    } else if (timesheet.endDate < timesheet.startDate) {
      newErrors.endDate = "End Date cannot be before Start Date";
    }

    if (!timesheet.effort) newErrors.effort = "This field is compulsory";

    const wordCount = timesheet.taskName
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    if (wordCount > 150) {
      newErrors.taskName = "Maximum 150 words allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // const saveDraft = async () => {
  //   try {
  //     const response = await createTimesheet(timesheet);
  //     localStorage.setItem("draftTimesheet", JSON.stringify(timesheet));
  //     localStorage.setItem("draftTimesheetId", response.id);
  //     setTimesheetId(response.id);
  //     alert("Draft saved with ID: " + response.id);
  //     onCancel(); // Close the dialog after successful draft save
  //   } catch {
  //     alert("Failed to save draft.");
  //   }
  // };

  const saveDraft = async () => {
    try {
      const response = await createTimesheet(timesheet);
      localStorage.setItem("draftTimesheet", JSON.stringify(timesheet));
      localStorage.setItem("draftTimesheetId", response.id);
      setTimesheetId(response.id);

      // Show alert and reset
      alert("Draft saved successfully with ID: " + response.id);

      // Clear form and close dialog
      setTimesheet({
        taskName: "",
        project: "",
        startDate: "",
        endDate: "",
        effort: "",
        comments: "",
      });
      setErrors({});
      onCancel();
    } catch {
      alert("Failed to save draft.");
    }
  };



  // const handleSubmit = async () => {
  //   if (!validate()) return;

  //   // Check today's day for submission
  //   // const todayDay = new Date().getDay();
  //   // if (todayDay !== 1 && todayDay !== 2) {
  //   //   alert("You can only submit timesheets on Monday or Tuesday.");
  //   //   return;
  //   // }

  //   try {
  //     let id = timesheetId;
  //     if (!id) {
  //       const response = await createTimesheet(timesheet);
  //       id = response.id;
  //       localStorage.setItem("draftTimesheetId", id);
  //       setTimesheetId(id);
  //     }
  //     await submitTimesheet(id);
  //     localStorage.removeItem("draftTimesheet");
  //     localStorage.removeItem("draftTimesheetId");
  //     alert("Timesheet submitted successfully!");
  //     setTimesheet({
  //       taskName: "",
  //       project: "",
  //       startDate: "",
  //       endDate: "",
  //       effort: "",
  //       comments: "",
  //     });
  //     setErrors({});
  //   } catch {
  //     alert("Failed to submit timesheet.");
  //   }
  // };

  const handleSubmit = async () => {
    
    if (!validate()) return;
   // Check today's day for submission
    const todayDay = new Date().getDay();
    if (todayDay !== 1 && todayDay !== 2) {
      alert("You can only submit timesheets on Monday or Tuesday.");
      return;
    }

    try {
      let id = timesheetId;
      if (!id) {
        const response = await createTimesheet(timesheet);
        id = response.id;
        localStorage.setItem("draftTimesheetId", id);
        setTimesheetId(id);
      }
      await submitTimesheet(id);
      localStorage.removeItem("draftTimesheet");
      localStorage.removeItem("draftTimesheetId");

      alert("Timesheet submitted successfully!");

      // Clear form and close dialog
      setTimesheet({
        taskName: "",
        project: "",
        startDate: "",
        endDate: "",
        effort: "",
        comments: "",
      });
      setErrors({});
      onCancel();
    } catch {
      alert("Failed to submit timesheet.");
    }
  };

  
  
  const today = new Date().toISOString().split("T")[0];

  return (
    <Paper
      elevation={4}
      sx={{
        width: "100%",
        maxWidth: "800px",
        p: { xs: 3, sm: 4 },
        backgroundColor: "#212121",
        color: "#E0E0E0",
        overflowX: "hidden",
        mx: "auto", // Horizontal center
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={onCancel} color="inherit">
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
          InputLabelProps={{ style: { color: "#E0E0E0" } }}
          InputProps={{ style: { color: "#E0E0E0" } }}
          error={!!errors.taskName}
          helperText={
            errors.taskName
              ? errors.taskName
              : `${
                  (timesheet.taskName || "").trim().split(/\s+/).filter(Boolean)
                    .length
                } / 150 words`
          }
          FormHelperTextProps={{
            sx: { color: "#E0E0E0" },
          }}
        />

        <TextField
          label="Project"
          name="project"
          value={timesheet.project}
          onChange={handleChange}
          fullWidth
          error={!!errors.project}
          helperText={errors.project}
          InputLabelProps={{ style: { color: "#E0E0E0" } }}
          InputProps={{ style: { color: "#E0E0E0" } }}
        />

        <TextField
          label="Start Date"
          name="startDate"
          type="date"
          value={timesheet.startDate}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ shrink: true, style: { color: "#E0E0E0" } }}
          InputProps={{
            style: { color: "#E0E0E0", WebkitTextFillColor: "#E0E0E0" }, // Ensure text remains white on Chrome
            inputProps: { min: today },
          }}
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
          InputLabelProps={{ shrink: true, style: { color: "#E0E0E0" } }}
          InputProps={{
            style: { color: "#E0E0E0" },
            inputProps: { min: today },
          }}
          error={!!errors.endDate}
          helperText={errors.endDate}
        />

        <TextField
          label="Effort (Hours)"
          name="effort"
          type="number"
          value={timesheet.effort}
          onChange={handleChange}
          fullWidth
          error={!!errors.effort}
          helperText={errors.effort}
          InputLabelProps={{ style: { color: "#E0E0E0" } }}
          InputProps={{
            style: { color: "#E0E0E0" },
            inputProps: { step: "0.1", min: 0 },
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            fullWidth={false}
            onClick={saveDraft}
          >
            Save as Draft
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth={false}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
