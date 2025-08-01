// ✅ Add console.log to trace project selection issue

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

export default function CreateTimesheet({ onCancel }) {
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
      await createTimesheet(payload);
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
// import React, { useState, useEffect } from "react";
// import {
//   TextField,
//   Button,
//   Box,
//   Typography,
//   Paper,
//   Stack,
//   IconButton,
//   MenuItem,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import {
//   createTimesheet,
//   submitTimesheet,
// } from "../../service/timesheetService";
// import { getProjectsByManagerId } from "../../service/projectService";

// export default function CreateTimesheet({ onCancel }) {
//   const [timesheet, setTimesheet] = useState({
//     taskName: "",
//     projectId: "",
//     projectName: "",
//     startDate: "",
//     endDate: "",
//     effort: "",
//     comments: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [projects, setProjects] = useState([]);
//   const [loadingProjects, setLoadingProjects] = useState(true);

//   const userId = sessionStorage.getItem("UserId");
//   const role = sessionStorage.getItem("Role");

//   useEffect(() => {
//     const effectiveId =
//       role === "EMPLOYEE" ? sessionStorage.getItem("ManagerId") : userId;

//     const fetchProjects = async () => {
//       try {
//         const data = await getProjectsByManagerId(effectiveId);
//         console.log("Fetched Projects:", data); // ✅ Log projects
//         setProjects(data);
//         setLoadingProjects(false);

//         if (data.length === 1) {
//           setTimesheet((prev) => ({
//             ...prev,
//             projectId: String(data[0].id),
//             projectName: data[0].name,
//           }));
//         }
//       } catch (err) {
//         console.error("Failed to fetch manager's projects", err);
//       }
//     };

//     if (effectiveId) fetchProjects();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "projectId") {
//       const selected = projects.find((p) => p.id.toString() === value);
//       console.log("Selected project:", selected); // ✅ Log selection
//       setTimesheet((prev) => ({
//         ...prev,
//         projectId: value,
//         projectName: selected?.name || "",
//       }));
//     } else {
//       setTimesheet({ ...timesheet, [name]: value });
//     }
//   };

//   const validate = () => {
//     const today = new Date().toISOString().split("T")[0];
//     const newErrors = {};

//     if (!timesheet.taskName) newErrors.taskName = "This field is compulsory";
//     if (!timesheet.projectId) newErrors.projectId = "This field is compulsory";
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
//         projectId: Number(timesheet.projectId),
//       };
//       console.log("Saving draft with payload:", payload); // ✅ Log payload
//       await createTimesheet(payload);
//       alert("Draft saved successfully!");
//       resetForm();
//       onCancel();
//     } catch (err) {
//       console.error("Save draft error:", err); // ✅ Log error
//       alert("Failed to save draft.");
//     }
//   };

//   const handleSubmit = async () => {
//     if (!validate()) return;
//     try {
//       const payload = {
//         ...timesheet,
//         projectId: Number(timesheet.projectId),
//       };
//       console.log("Submitting timesheet with payload:", payload); // ✅ Log payload
//       const response = await createTimesheet(payload);
//       await submitTimesheet(response.id);
//       alert("Timesheet submitted successfully!");
//       resetForm();
//       onCancel();
//     } catch (err) {
//       console.error("Submit error:", err); // ✅ Log error
//       alert("Failed to submit timesheet.");
//     }
//   };

//   const resetForm = () => {
//     setTimesheet({
//       taskName: "",
//       projectId: "",
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
//     <Paper elevation={4} sx={{ width: "100%", maxWidth: "800px", p: { xs: 3, sm: 4 }, overflowX: "hidden", mx: "auto" }}>
//       <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//         <IconButton onClick={onCancel}><ArrowBackIcon /></IconButton>
//         <Box sx={{ flexGrow: 1, textAlign: "center" }}>
//           <Typography variant="h6">Create Timesheet</Typography>
//         </Box>
//       </Box>

//       <Stack spacing={2}>
//         <TextField label="Task Name" name="taskName" value={timesheet.taskName} onChange={handleChange} multiline minRows={3} fullWidth error={!!errors.taskName} helperText={errors.taskName || `${(timesheet.taskName || "").trim().split(/\s+/).filter(Boolean).length} / 150 words`} />

//         {!loadingProjects && projects.length > 1 && (
//           <TextField select label="Select Project" name="projectId" value={timesheet.projectId} onChange={handleChange} fullWidth error={!!errors.projectId} helperText={errors.projectId}>
//             {projects.map((proj) => (
//               <MenuItem key={proj.id} value={proj.id}>{proj.name}</MenuItem>
//             ))}
//           </TextField>
//         )}

//         <TextField label="Sub Project / Module" name="projectName" value={timesheet.projectName} onChange={handleChange} fullWidth error={!!errors.projectName} helperText={errors.projectName} />

//         <Box sx={{ display: "flex", gap: 2 }}>
//           <TextField label="Start Date" name="startDate" type="date" value={timesheet.startDate} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} InputProps={{ inputProps: { min: today } }} error={!!errors.startDate} helperText={errors.startDate} />
//           <TextField label="End Date" name="endDate" type="date" value={timesheet.endDate} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} InputProps={{ inputProps: { min: today } }} error={!!errors.endDate} helperText={errors.endDate} />
//         </Box>

//         <TextField label="Effort (Hours)" name="effort" type="number" value={timesheet.effort} onChange={handleChange} fullWidth error={!!errors.effort} helperText={errors.effort} InputProps={{ inputProps: { step: "0.1", min: 0 } }} />

//         <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 1 }}>
//           <Button variant="outlined" onClick={saveDraft}>Save as Draft</Button>
//           <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
//         </Box>
//       </Stack>
//     </Paper>
//   );
// }

// import React, { useState, useEffect } from "react";
// import {
//   TextField,
//   Button,
//   Box,
//   Typography,
//   Paper,
//   Stack,
//   IconButton,
//   MenuItem,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import {
//   createTimesheet,
//   submitTimesheet,
// } from "../../service/timesheetService";
// import { getProjectsByUser } from "../../service/userService";

// export default function CreateTimesheet({ onCancel }) {
//   const [timesheet, setTimesheet] = useState({
//     taskName: "",
//     projectId: "",
//     projectName: "", // this is sub project/module
//     startDate: "",
//     endDate: "",
//     effort: "",
//     comments: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [projects, setProjects] = useState([]);
//   const [loadingProjects, setLoadingProjects] = useState(true);

//   const userId = sessionStorage.getItem("UserId"); // Ideally fetch from sessionStorage

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const data = await getProjectsByUser(userId);
//         setProjects(data);
//         setLoadingProjects(false);

//         // If only one project, auto-assign projectId
//         if (data.length === 1) {
//           setTimesheet((prev) => ({
//             ...prev,
//             projectId: data[0].id,
//           }));
//         }
//       } catch (err) {
//         console.error("Failed to fetch projects", err);
//       }
//     };

//     fetchProjects();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // For project dropdown
//     // if (name === "projectId") {
//     //   setTimesheet({
//     //     ...timesheet,
//     //     projectId: value,
//     //   });
//     // }
//     if (name === "projectId") {
//       const selectedProject = projects.find((p) => p.id.toString() === value);
//       setTimesheet((prev) => ({
//         ...prev,
//         projectId: value,
//         projectName: selectedProject?.name || "",
//       }));
//     } else {
//       setTimesheet({ ...timesheet, [name]: value });
//     }
//   };

//   const validate = () => {
//     const newErrors = {};
//     const today = new Date().toISOString().split("T")[0];

//     if (!timesheet.taskName) newErrors.taskName = "This field is compulsory";
//     if (!timesheet.projectId) newErrors.projectId = "This field is compulsory";
//     if (!timesheet.projectName)
//       newErrors.projectName = "This field is compulsory";

//     if (!timesheet.startDate) {
//       newErrors.startDate = "This field is compulsory";
//     } else if (timesheet.startDate < today) {
//       newErrors.startDate = "Start Date cannot be in the past";
//     }

//     if (!timesheet.endDate) {
//       newErrors.endDate = "This field is compulsory";
//     } else if (timesheet.endDate < today) {
//       newErrors.endDate = "End Date cannot be in the past";
//     } else if (timesheet.endDate < timesheet.startDate) {
//       newErrors.endDate = "End Date cannot be before Start Date";
//     }

//     if (!timesheet.effort) newErrors.effort = "This field is compulsory";

//     const wordCount = timesheet.taskName
//       .trim()
//       .split(/\s+/)
//       .filter(Boolean).length;
//     if (wordCount > 150) {
//       newErrors.taskName = "Maximum 150 words allowed";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const saveDraft = async () => {
//     try {
//       await createTimesheet(timesheet);
//       alert("Draft saved successfully!");
//       resetForm();
//       onCancel();
//     } catch {
//       alert("Failed to save draft.");
//     }
//   };

//   const handleSubmit = async () => {
//     if (!validate()) return;

//     try {
//       const response = await createTimesheet(timesheet);
//       await submitTimesheet(response.id);
//       alert("Timesheet submitted successfully!");
//       resetForm();
//       onCancel();
//     } catch {
//       alert("Failed to submit timesheet.");
//     }
//   };

//   const resetForm = () => {
//     setTimesheet({
//       taskName: "",
//       projectId: "",
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
//         {/* Task Name */}
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
//             errors.taskName
//               ? errors.taskName
//               : `${
//                   (timesheet.taskName || "").trim().split(/\s+/).filter(Boolean)
//                     .length
//                 } / 150 words`
//           }
//         />

//         {/* Project Dropdown if multiple */}
//         {!loadingProjects && projects.length > 1 && (
//           <TextField
//             select
//             label="Select Project"
//             name="projectId"
//             value={timesheet.projectId}
//             onChange={handleChange}
//             fullWidth
//             error={!!errors.projectId}
//             helperText={errors.projectId}
//           >
//             {projects.map((proj) => (
//               <MenuItem key={proj.id} value={proj.id}>
//                 {proj.name}
//               </MenuItem>
//             ))}
//           </TextField>
//         )}

//         {/* Sub-project (projectName) */}
//         <TextField
//           label="Sub Project / Module"
//           name="projectName"
//           value={timesheet.projectName}
//           onChange={handleChange}
//           fullWidth
//           error={!!errors.projectName}
//           helperText={errors.projectName}
//         />

//         {/* Dates */}
//         <Box sx={{ display: "flex", gap: 2 }}>
//           <TextField
//             label="Start Date"
//             name="startDate"
//             type="date"
//             value={timesheet.startDate}
//             onChange={handleChange}
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             InputProps={{
//               inputProps: { min: today },
//             }}
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
//             InputProps={{
//               inputProps: { min: today },
//             }}
//             error={!!errors.endDate}
//             helperText={errors.endDate}
//           />
//         </Box>

//         {/* Effort */}
//         <TextField
//           label="Effort (Hours)"
//           name="effort"
//           type="number"
//           value={timesheet.effort}
//           onChange={handleChange}
//           fullWidth
//           error={!!errors.effort}
//           helperText={errors.effort}
//           InputProps={{
//             inputProps: { step: "0.1", min: 0 },
//           }}
//         />

//         {/* Action Buttons */}
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
