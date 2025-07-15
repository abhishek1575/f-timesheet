import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Stack,
} from "@mui/material";
import {
  fetchUserById,
  fetchManagersOrAdmins,
  updateUser,
} from "../../service/userService"; // Adjust the import path if needed

const EditUserProfile = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    managerId: "",
  });
  const [managers, setManagers] = useState([]);

  const userId = sessionStorage.getItem("UserId");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (open) loadUserData();
  }, [open]);

  const loadUserData = async () => {
    try {
      const data = await fetchUserById(userId, token);
      setFormData({
        name: data.name,
        email: data.email,
        role: data.role,
        managerId: data.managerId || "",
      });
      loadManagersOrAdmins(data.role);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const loadManagersOrAdmins = async (role) => {
    try {
      const data = await fetchManagersOrAdmins(role, token);
      setManagers(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "managerId" ? (value ? Number(value) : null) : value,
    }));

    if (name === "role") {
      loadManagersOrAdmins(value);
      setFormData((prev) => ({
        ...prev,
        managerId: "",
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      await updateUser(userId, formData, token);
      alert("User updated successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          onClose();
        }
      }}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundColor: "#2e2e2e",
          color: "#f0f0f0",
          px: 3,
          py: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: "1.25rem",
          textAlign: "center",
          color: "#e0e0e0",
          borderBottom: "1px solid #444",
          pb: 1,
        }}
      >
        ✏️ Edit User Profile
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={2}>
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ style: { color: "#BDBDBD" } }}
            InputProps={{ style: { color: "#E0E0E0" } }}
          />
          <TextField
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ style: { color: "#BDBDBD" } }}
            InputProps={{ style: { color: "#E0E0E0" } }}
          />
          <TextField
            select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ style: { color: "#BDBDBD" } }}
            InputProps={{ style: { color: "#E0E0E0" } }}
          >
            <MenuItem value="EMPLOYEE">Employee</MenuItem>
            <MenuItem value="MANAGER">Manager</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </TextField>
          <TextField
            select
            label="Assign Manager"
            name="managerId"
            value={
              formData.managerId !== null ? String(formData.managerId) : ""
            }
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ style: { color: "#BDBDBD" } }}
            InputProps={{ style: { color: "#E0E0E0" } }}
          >
            <MenuItem value="">None</MenuItem>
            {managers.map((manager) => (
              <MenuItem key={manager.id} value={String(manager.id)}>
                {manager.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: "1px solid #444",
          mt: 2,
          pt: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{
            textTransform: "none",
            px: 3,
            color: "#e0e0e0",
            borderColor: "#757575",
            "&:hover": {
              backgroundColor: "#3a3a3a",
              borderColor: "#bdbdbd",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            textTransform: "none",
            px: 4,
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserProfile;

// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   MenuItem,
//   Box,
// } from "@mui/material";
// import {
//   fetchUserById,
//   fetchManagersOrAdmins,
//   updateUser,
// } from '../../service/userService'; // Adjust the import path as necessary

// const EditUserProfile = ({ open, onClose }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     role: "",
//     managerId: "",
//   });
//   const [managers, setManagers] = useState([]);

//   const userId = sessionStorage.getItem("UserId");
//   const token = sessionStorage.getItem("token");

//   useEffect(() => {
//     if (open) {
//       loadUserData();
//     }
//   }, [open]);

//   const loadUserData = async () => {
//     try {
//       const data = await fetchUserById(userId, token);
//       setFormData({
//         name: data.name,
//         email: data.email,
//         role: data.role,
//         managerId: data.managerId || "",
//       });
//       loadManagersOrAdmins(data.role);
//     } catch (error) {
//       console.error(error);
//       alert(error.message);
//     }
//   };

//   const loadManagersOrAdmins = async (role) => {
//     try {
//       const data = await fetchManagersOrAdmins(role, token);
//       setManagers(data);
//     } catch (error) {
//       console.error(error);
//       alert(error.message);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "managerId" ? (value ? Number(value) : null) : value,
//     }));

//     // Auto-load managers/admins if role changes
//     if (name === "role") {
//       loadManagersOrAdmins(value);
//       setFormData((prev) => ({
//         ...prev,
//         managerId: "", // Reset manager on role change
//       }));
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       await updateUser(userId, formData, token);
//       alert("User updated successfully!");
//       onClose();
//     } catch (error) {
//       console.error(error);
//       alert(error.message);
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: {
//           minHeight: "300px",
//           borderRadius: 4,
//           boxShadow: 6,
//           p: 2,
//           backgroundColor: "#f9f9f9",
//         },
//       }}
//     >
//       <DialogTitle
//         sx={{
//           fontWeight: "bold",
//           textAlign: "center",
//           borderBottom: "1px solid #ccc",
//           pb: 1,
//           mb: 2,
//         }}
//       >
//         Edit User Profile
//       </DialogTitle>

//       <DialogContent sx={{ mt: 2 }}>
//         <Box display="flex" flexDirection="column" gap={2}>
//           <TextField
//             name="name"
//             label="Name"
//             value={formData.name}
//             onChange={handleChange}
//             fullWidth
//             variant="outlined"
//           />
//           <TextField
//             name="email"
//             label="Email"
//             value={formData.email}
//             onChange={handleChange}
//             fullWidth
//             variant="outlined"
//           />

//           {/* Role Dropdown */}
//           <TextField
//             select
//             label="Role"
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             fullWidth
//             variant="outlined"
//           >
//             <MenuItem value="EMPLOYEE">Employee</MenuItem>
//             <MenuItem value="MANAGER">Manager</MenuItem>
//             <MenuItem value="ADMIN">Admin</MenuItem>
//           </TextField>

//           {/* Manager/Admin Dropdown */}
//           <TextField
//             select
//             label="Assign Manager"
//             name="managerId"
//             value={
//               formData.managerId !== null ? String(formData.managerId) : ""
//             }
//             onChange={handleChange}
//             fullWidth
//             variant="outlined"
//           >
//             <MenuItem value="">None</MenuItem>
//             {managers.map((manager) => (
//               <MenuItem key={manager.id} value={String(manager.id)}>
//                 {manager.name}
//               </MenuItem>
//             ))}
//           </TextField>
//         </Box>
//       </DialogContent>

//       <DialogActions
//         sx={{
//           justifyContent: "space-between",
//           borderTop: "1px solid #ccc",
//           mt: 2,
//           pt: 2,
//         }}
//       >
//         <Button onClick={onClose} color="inherit" variant="outlined">
//           Cancel
//         </Button>
//         <Button onClick={handleSubmit} variant="contained" color="primary">
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditUserProfile;
