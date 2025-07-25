import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Backdrop,
} from "@mui/material";
import axios from "axios";
import config from "../../service/config";

const CreateProjectModal = ({ open, onClose }) => {
  const [projectName, setProjectName] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem("token");
      console.log("Token from CreateProjectModal:", token);
      const response = await axios.post(
        `${config.BASE_URL}projects/create`,
        { name: projectName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPopupMessage(
        `✅ Project "${response.data.name}" created successfully!`
      );
      setIsSuccess(true);
      setProjectName("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong while creating the project";
      setPopupMessage(`❌ ${errorMessage}`);
      setIsSuccess(false);
    }
  };

  const handleClose = () => {
    setPopupMessage("");
    setProjectName("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      disableEscapeKeyDown
      fullWidth
      maxWidth="sm"
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 300 }}
    >
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem", pb: 0 }}>
        Create New Project
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            type="text"
            fullWidth
            variant="outlined"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            placeholder="e.g., Project Phoenix"
          />

          {popupMessage && (
            <Box
              mt={2}
              p={2}
              borderRadius={2}
              bgcolor={isSuccess ? "#e6ffed" : "#ffe6e6"}
            >
              <Typography
                variant="body2"
                color={isSuccess ? "green" : "red"}
                fontWeight="bold"
              >
                {popupMessage}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, justifyContent: "space-between" }}>
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
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: "#1976d2",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#155fa0",
            },
          }}
          disabled={!projectName.trim()}
        >
          Create Project
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProjectModal;

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

// const CreateProjectModal = ({ open, onClose }) => {
//   const [projectName, setProjectName] = useState('');
//   const [managerId, setManagerId] = useState('');
//   const [teamMemberIds, setTeamMemberIds] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle project creation logic here
//     console.log({ projectName, managerId, teamMemberIds });
//     onClose(); // Close modal on submit
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//       <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Create New Project</DialogTitle>
//       <DialogContent>
//         <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
//           <TextField
//             autoFocus
//             margin="dense"
//             id="name"
//             label="Project Name"
//             type="text"
//             fullWidth
//             variant="outlined"
//             value={projectName}
//             onChange={(e) => setProjectName(e.target.value)}
//             placeholder="e.g., Project Phoenix"
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
//           <TextField
//             margin="dense"
//             id="teamMemberIds"
//             label="Team Member IDs (comma-separated)"
//             type="text"
//             fullWidth
//             variant="outlined"
//             value={teamMemberIds}
//             onChange={(e) => setTeamMemberIds(e.target.value)}
//             placeholder="e.g., 3, 4, 5"
//           />
//         </Box>
//       </DialogContent>
//       <DialogActions sx={{ p: '0 24px 24px' }}>
//         <Button onClick={onClose} color="inherit">Cancel</Button>
//         <Button onClick={handleSubmit} variant="contained" color="primary">
//           Create Project
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default CreateProjectModal;
