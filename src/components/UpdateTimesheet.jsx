import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTimesheetById,
  updateTimesheet,
} from "../service/timesheetService";
import { TextField, Button, Paper, Stack } from "@mui/material";

export default function UpdateTimesheet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    project: "",
    taskName: "",
    startDate: "",
    endDate: "",
    effort: "",
  });

  useEffect(() => {
    loadTimesheet();
  }, []);

  const loadTimesheet = async () => {
    try {
      const res = await getTimesheetById(id);
      setFormData(res.data);
    } catch (error) {
      console.error("Error loading timesheet", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateTimesheet(id, formData);
      alert("Timesheet Updated Successfully!");
      navigate("/draft-timesheets");
    } catch (error) {
      console.error("Update Error", error);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: "auto" }}>
      <h2>Update Timesheet</h2>
      <Stack spacing={2}>
        <TextField
          label="Project"
          name="project"
          value={formData.project}
          onChange={handleChange}
        />
        <TextField
          label="Task Name"
          name="taskName"
          value={formData.taskName}
          onChange={handleChange}
        />
        <TextField
          type="date"
          label="Start Date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="date"
          label="End Date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Effort"
          name="effort"
          type="number"
          value={formData.effort}
          onChange={handleChange}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Update
        </Button>
      </Stack>
    </Paper>
  );
}
