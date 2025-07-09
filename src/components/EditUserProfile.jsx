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
} from "@mui/material";
import {
  fetchUserById,
  fetchManagersOrAdmins,
  updateUser,
} from "../service/userService";

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
    if (open) {
      loadUserData();
    }
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

    // Auto-load managers/admins if role changes
    if (name === "role") {
      loadManagersOrAdmins(value);
      setFormData((prev) => ({
        ...prev,
        managerId: "", // Reset manager on role change
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
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: "300px",
          borderRadius: 4,
          boxShadow: 6,
          p: 2,
          backgroundColor: "#f9f9f9",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          borderBottom: "1px solid #ccc",
          pb: 1,
          mb: 2,
        }}
      >
        Edit User Profile
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />

          {/* Role Dropdown */}
          <TextField
            select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          >
            <MenuItem value="EMPLOYEE">Employee</MenuItem>
            <MenuItem value="MANAGER">Manager</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </TextField>

          {/* Manager/Admin Dropdown */}
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
          >
            <MenuItem value="">None</MenuItem>
            {managers.map((manager) => (
              <MenuItem key={manager.id} value={String(manager.id)}>
                {manager.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "space-between",
          borderTop: "1px solid #ccc",
          mt: 2,
          pt: 2,
        }}
      >
        <Button onClick={onClose} color="inherit" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
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
// } from "../service/userService";

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
//           backgroundColor: "#f9f9f9", // Light neutral background
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
//           <TextField
//             name="role"
//             label="Role"
//             value={formData.role}
//             disabled
//             fullWidth
//             variant="outlined"
//           />

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

// import React, { useState, useEffect } from "react";
// import {
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   MenuItem,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import {
//   fetchUserById,
//   fetchManagersOrAdmins,
//   updateUser,
// } from "../service/userService";

// const EditUserProfile = () => {
//   const [openEditProfile, setOpenEditProfile] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     role: "",
//     managerId: "",
//   });
//   const [managers, setManagers] = useState([]);

//   const userId = sessionStorage.getItem("userId");
//   const token = sessionStorage.getItem("token");

//   const handleOpenEditProfile = () => {
//     setOpenEditProfile(true);
//     loadUserData();
//   };

//   const handleCloseEditProfile = () => {
//     setOpenEditProfile(false);
//   };

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
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     try {
//       await updateUser(userId, formData, token);
//       alert("User updated successfully!");
//       handleCloseEditProfile();
//     } catch (error) {
//       console.error(error);
//       alert(error.message);
//     }
//   };

//   return (
//     <>
//       <IconButton
//         size="large"
//         edge="start"
//         color="inherit"
//         sx={{ mr: 2 }}
//         onClick={handleOpenEditProfile}
//       >
//         <MenuIcon />
//       </IconButton>

//       <Dialog open={openEditProfile} onClose={handleCloseEditProfile}>
//         <DialogTitle>Edit User Profile</DialogTitle>
//         <DialogContent
//           sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
//         >
//           <TextField
//             name="name"
//             label="Name"
//             value={formData.name}
//             onChange={handleChange}
//             fullWidth
//           />
//           <TextField
//             name="email"
//             label="Email"
//             value={formData.email}
//             onChange={handleChange}
//             fullWidth
//           />
//           <TextField
//             name="role"
//             label="Role"
//             value={formData.role}
//             disabled
//             fullWidth
//           />

//           {/* Manager/Admin Dropdown */}
//           {formData.role === "EMPLOYEE" || formData.role === "MANAGER" ? (
//             <TextField
//               select
//               label="Assign Manager"
//               name="managerId"
//               value={formData.managerId}
//               onChange={handleChange}
//               fullWidth
//             >
//               {managers.map((manager) => (
//                 <MenuItem key={manager.id} value={manager.id}>
//                   {manager.name}
//                 </MenuItem>
//               ))}
//             </TextField>
//           ) : null}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseEditProfile}>Cancel</Button>
//           <Button onClick={handleSubmit} variant="contained" color="primary">
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default EditUserProfile;
