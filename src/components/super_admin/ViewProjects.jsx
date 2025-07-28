import React, { useEffect, useState } from "react";
import {
  Card, CardContent, Typography, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, IconButton, MenuItem, Select, 
  Snackbar, Alert, Grid, Box, Chip, Avatar, CircularProgress, 
  FormControl, InputLabel
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/Badge';
import { 
  assignEmployeeToProject, assignManagerToProject, getAllProjects, 
  getAllEmployees, getAllPrivilegedUsers 
} from "../../service/projectService";

const ViewProjects = () => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [privilegedUsers, setPrivilegedUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedManagerId, setSelectedManagerId] = useState("");
  const [loading, setLoading] = useState({ projects: true, employees: false, privilegedUsers: false });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchAllData = async () => {
    try {
      setLoading({ projects: true, employees: true, privilegedUsers: true });
      const [projectsRes, employeesRes, privilegedUsersRes] = await Promise.all([
        getAllProjects(),
        getAllEmployees(),
        getAllPrivilegedUsers(),
      ]);
      setProjects(projectsRes.data);
      setEmployees(employeesRes.data);
      setPrivilegedUsers(privilegedUsersRes.data);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to fetch initial data.", severity: "error" });
    } finally {
      setLoading({ projects: false, employees: false, privilegedUsers: false });
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setSelectedManagerId(project.managerId || "");
    setOpenDetailsDialog(true);
  };

  const handleAddEmployee = async () => {
    if (!selectedEmployeeId) {
      setSnackbar({ open: true, message: "Please select an employee.", severity: "warning" });
      return;
    }
    try {
      await assignEmployeeToProject(selectedProject.id, selectedEmployeeId);
      setSnackbar({ open: true, message: "Employee added successfully!", severity: "success" });
      setSelectedEmployeeId("");
      fetchAllData(); // Refresh all data to reflect changes
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to add employee.", severity: "error" });
    }
  };

  const handleChangeManager = async () => {
    if (!selectedManagerId) {
      setSnackbar({ open: true, message: "Please select a manager.", severity: "warning" });
      return;
    }
    try {
      await assignManagerToProject(selectedProject.id, selectedManagerId);
      setSnackbar({ open: true, message: "Manager changed successfully!", severity: "success" });
      fetchAllData(); // Refresh all data to reflect changes
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to change manager.", severity: "error" });
    }
  };

  if (loading.projects) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  const filteredPrivilegedUsers = privilegedUsers.filter(user => 
    user.role && ["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(user.role.toUpperCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4}>
        {projects.map((project) => (
          <Grid item key={project.id} xs={12} sm={6} md={4}>
            <Card sx={{ 
              height: '100%', display: 'flex', flexDirection: 'column', 
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': { transform: 'scale(1.05)', boxShadow: 6 }
            }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
                  <BusinessIcon /> {project.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                  <PersonIcon />
                  <Typography variant="body2" color="text.secondary">
                    Manager: {project.managerName || "Not Assigned"}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <GroupsIcon />
                  <Typography variant="body2" color="text.secondary">
                    Team Members: {project.teamMemberNames?.length || 0}
                  </Typography>
                </Box>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button onClick={() => handleProjectClick(project)} variant="contained" fullWidth>
                  View Details
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Project Details</Typography>
            <IconButton aria-label="close" onClick={() => setOpenDetailsDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedProject && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom><BadgeIcon sx={{verticalAlign: 'middle', mr: 1}}/>{selectedProject.name}</Typography>
                <Typography><strong>Manager:</strong> {selectedProject.managerName || "Not Assigned"}</Typography>
                <Typography sx={{ mt: 2 }}><strong>Team Members:</strong></Typography>
                <Box sx={{ maxHeight: 150, overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
                  {(selectedProject.teamMemberNames || []).map((name, index) => (
                    <Chip key={index} label={name} avatar={<Avatar>{name[0]}</Avatar>} />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>Add Employee</Typography>
                  <FormControl fullWidth>
                    <InputLabel>Select Employee</InputLabel>
                    <Select value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)} label="Select Employee">
                      {employees.map((emp) => (
                        <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button variant="contained" color="primary" onClick={handleAddEmployee} sx={{ mt: 1 }}>Add</Button>
                </Box>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>Change Manager</Typography>
                  <FormControl fullWidth>
                    <InputLabel>Select Manager</InputLabel>
                    <Select value={selectedManagerId} onChange={(e) => setSelectedManagerId(e.target.value)} label="Select Manager">
                      {filteredPrivilegedUsers.map((user) => (
                        <MenuItem key={user.id} value={user.id}>{user.name} ({user.role})</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button variant="contained" color="secondary" onClick={handleChangeManager} sx={{ mt: 1 }}>Change</Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)} color="error">Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewProjects;

// import React, { useState, useEffect } from "react";
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   CircularProgress,
//   Alert,
//   Box,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Snackbar,
// } from "@mui/material";
// import axios from "axios";
// import config from "../../service/config";

// const ViewProjects = () => {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedProjectId, setSelectedProjectId] = useState(null);
//   const [managerId, setManagerId] = useState("");
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const token = sessionStorage.getItem("token");

//   const fetchProjects = async () => {
//     try {
//       const response = await axios.get(`${config.BASE_URL}projects/all`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setProjects(response.data);
//     } catch (err) {
//       setError("Failed to fetch projects.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const handleOpenDialog = (projectId) => {
//     setSelectedProjectId(projectId);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setManagerId("");
//     setOpenDialog(false);
//   };

//   const handleAssignManager = async () => {
//     try {
//       await axios.put(
//         `${config.BASE_URL}projects/${selectedProjectId}/assign-manager/${managerId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setSnackbar({
//         open: true,
//         message: "Manager assigned successfully!",
//         severity: "success",
//       });
//       handleCloseDialog();
//       fetchProjects();
//     } catch (error) {
//       const message =
//         error.response?.data?.message || "Error assigning manager";
//       setSnackbar({ open: true, message, severity: "error" });
//     }
//   };

//   return (
//     <Box sx={{ p: { xs: 1, sm: 2 } }}>
//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
//           <CircularProgress />
//         </Box>
//       ) : error ? (
//         <Alert severity="error">{error}</Alert>
//       ) : (
//         <Grid container spacing={3}>
//           {projects.map((project) => (
//             <Grid item xs={12} sm={6} md={4} key={project.id}>
//               <Card
//                 sx={{
//                   height: "100%",
//                   display: "flex",
//                   flexDirection: "column",
//                   boxShadow: 3,
//                   "&:hover": { boxShadow: 6 },
//                 }}
//               >
//                 <CardContent sx={{ flexGrow: 1 }}>
//                   <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
//                     {project.name}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ mb: 1 }}
//                   >
//                     <strong>Manager:</strong> {project.managerName || "N/A"}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     <strong>Team:</strong>{" "}
//                     {project.teamMemberNames.length
//                       ? project.teamMemberNames.join(", ")
//                       : "No members"}
//                   </Typography>
//                 </CardContent>
//                 <Box sx={{ p: 2, pt: 0 }}>
//                   <Button
//                     variant="outlined"
//                     color="primary"
//                     fullWidth
//                     onClick={() => handleOpenDialog(project.id)}
//                   >
//                     Assign / Change Manager
//                   </Button>
//                 </Box>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       {/* Assign Manager Dialog */}
//       <Dialog open={openDialog} onClose={handleCloseDialog}>
//         <DialogTitle>Assign Manager</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Manager ID"
//             fullWidth
//             type="number"
//             value={managerId}
//             onChange={(e) => setManagerId(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Cancel</Button>
//           <Button
//             onClick={handleAssignManager}
//             variant="contained"
//             color="primary"
//           >
//             Assign
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         message={snackbar.message}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//         ContentProps={{
//           sx: {
//             backgroundColor: snackbar.severity === "success" ? "green" : "red",
//             color: "#fff",
//           },
//         }}
//       />
//     </Box>
//   );
// };

// export default ViewProjects;

// import React, { useState, useEffect } from 'react';
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   CircularProgress,
//   Alert,
//   Box,
// } from '@mui/material';

// const ViewProjects = () => {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Mock API call
//     const fetchProjects = () => {
//       try {
//         const fetchedProjects = [
//           {
//             "id": 1,
//             "name": "PEPS",
//             "managerId": 2,
//             "managerName": "Manager",
//             "teamMemberIds": [3],
//             "teamMemberNames": ["Employee"]
//           },
//           {
//             "id": 4,
//             "name": "ADAS",
//             "managerId": 2,
//             "managerName": "Manager",
//             "teamMemberIds": [],
//             "teamMemberNames": []
//           },
//           {
//             "id": 5,
//             "name": "TEST",
//             "managerId": null,
//             "managerName": null,
//             "teamMemberIds": [],
//             "teamMemberNames": []
//           }
//         ];
//         setProjects(fetchedProjects);
//       } catch (err) {
//         setError("Failed to fetch projects.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//   }, []);

//   return (
//     <Box sx={{ p: { xs: 1, sm: 2 } }}>
//       {loading ? (
//         <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
//           <CircularProgress />
//         </Box>
//       ) : error ? (
//         <Alert severity="error">{error}</Alert>
//       ) : (
//         <Grid container spacing={3}>
//           {projects.map(project => (
//             <Grid item xs={12} sm={6} md={4} key={project.id}>
//               <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3, '&:hover': { boxShadow: 6 } }}>
//                 <CardContent sx={{ flexGrow: 1 }}>
//                   <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
//                     {project.name}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                     <strong>Manager:</strong> {project.managerName || 'N/A'}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     <strong>Team:</strong> {project.teamMemberNames.join(', ') || 'No members'}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </Box>
//   );
// };

// export default ViewProjects;
