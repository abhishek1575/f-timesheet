import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import axios from "axios";
import config from "../../service/config";

const AssignManagerModal = ({ open, onClose }) => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedManagerId, setSelectedManagerId] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const token = sessionStorage.getItem("token");

  // Load projects and users when modal opens
  useEffect(() => {
    if (open) {
      fetchProjects();
      fetchPrivilegedUsers();
      setFeedback(null);
      setSelectedProjectId("");
      setSelectedManagerId("");
    }
  }, [open]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${config.BASE_URL}projects/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const unassignedProjects = res.data.filter(
        (project) => !project.managerId
      );
      setProjects(unassignedProjects);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  const fetchPrivilegedUsers = async () => {
    try {
      const res = await axios.get(`${config.BASE_URL}users/privileged`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const handleAssign = async () => {
    if (!selectedProjectId || !selectedManagerId) return;

    try {
      await axios.put(
        `${config.BASE_URL}projects/${selectedProjectId}/assign-manager/${selectedManagerId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedback("✅ Manager assigned successfully");
      setIsSuccess(true);
      // Refresh unassigned projects
      fetchProjects();
    } catch (err) {
      const msg = err?.response?.data?.message || "❌ Failed to assign manager";
      setFeedback(msg);
      setIsSuccess(false);
    }
  };

  const handleClose = () => {
    setFeedback(null);
    setSelectedProjectId("");
    setSelectedManagerId("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={() => {}} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
        Assign Manager to Project
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="project-label">Select Project</InputLabel>
          <Select
            labelId="project-label"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            label="Select Project"
          >
            {projects.length === 0 && (
              <MenuItem disabled>No unassigned projects</MenuItem>
            )}
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name} (ID: {project.id})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="manager-label">Select Manager</InputLabel>
          <Select
            labelId="manager-label"
            value={selectedManagerId}
            onChange={(e) => setSelectedManagerId(e.target.value)}
            label="Select Manager"
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name} ({user.role})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {feedback && (
          <Box
            mt={2}
            p={2}
            borderRadius={2}
            bgcolor={isSuccess ? "#e6ffed" : "#ffe6e6"}
          >
            <Typography color={isSuccess ? "green" : "red"} fontWeight="bold">
              {feedback}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: "space-between" }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: "#ccc",
            color: "#333",
            "&:hover": {
              backgroundColor: "#f2f2f2",
              borderColor: "#999",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAssign}
          variant="contained"
          color="success"
          disabled={!selectedProjectId || !selectedManagerId}
          sx={{
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#2e7d32",
            },
          }}
        >
          Assign Manager
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignManagerModal;

// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Box
// } from '@mui/material';

// const AssignManagerModal = ({ open, onClose }) => {
//   const [projectId, setProjectId] = useState('');
//   const [managerId, setManagerId] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle assign manager logic here
//     console.log({ projectId, managerId });
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//       <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Assign Manager to Project</DialogTitle>
//       <DialogContent>
//         <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
//           <TextField
//             autoFocus
//             margin="dense"
//             id="projectId"
//             label="Project ID"
//             type="text"
//             fullWidth
//             variant="outlined"
//             value={projectId}
//             onChange={(e) => setProjectId(e.target.value)}
//             placeholder="Enter project ID"
//           />
//           <TextField
//             margin="dense"
//             id="managerId"
//             label="Manager ID"
//             type="text"
//             fullWidth
//             variant="outlined"
//             value={managerId}
//             onChange={(e) => setManagerId(e.target.value)}
//             placeholder="Enter manager's user ID"
//           />
//         </Box>
//       </DialogContent>
//       <DialogActions sx={{ p: '0 24px 24px' }}>
//         <Button onClick={onClose} color="inherit">Cancel</Button>
//         <Button onClick={handleSubmit} variant="contained" color="success">
//           Assign Manager
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AssignManagerModal;
