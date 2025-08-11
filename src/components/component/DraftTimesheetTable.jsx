import React, { useEffect, useState } from "react";
import {
  Paper,
  Button,
  Box,
  IconButton,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import DescriptionIcon from "@mui/icons-material/Description";

import {
  getDraftTimesheets,
  submitTimesheet,
  updateTimesheet,
  getTimesheetById,
} from "../../service/timesheetService";
import UpdateTimesheetForm from "./UpdateTimesheet";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

const DraftCard = ({ sheet, onEdit, onSubmit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  


  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: "16px",
        background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        width: "100%",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
        },
        borderLeft: `4px solid ${theme.palette.primary.main}`,
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
          }}
        >
          <WorkOutlineIcon
            color="primary"
            sx={{ mr: 1.5, fontSize: "1.5rem" }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: theme.palette.primary.dark,
            }}
          >
            {sheet.project}
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: theme.palette.grey[100],
            borderRadius: "12px",
            p: 2,
            mb: 2,
            minHeight: "80px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <DescriptionIcon
              color="action"
              sx={{ mr: 1, fontSize: "1.1rem" }}
            />
            <Typography variant="caption" color="text.secondary">
              Task Description
            </Typography>
          </Box>
          <Tooltip title={sheet.taskName} arrow>
            <Typography
              variant="body2"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "normal",
                lineHeight: 1.4,
              }}
            >
              {sheet.taskName}
            </Typography>
          </Tooltip>
        </Box>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
              }}
            >
              <CalendarTodayIcon
                color="action"
                sx={{ mr: 1, fontSize: "1.1rem" }}
              />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Start Date
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {sheet.startDate}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
              }}
            >
              <CalendarTodayIcon
                color="action"
                sx={{ mr: 1, fontSize: "1.1rem" }}
              />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  End Date
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {sheet.endDate}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <AccessTimeIcon
                color="action"
                sx={{ mr: 1, fontSize: "1.1rem" }}
              />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Effort
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {sheet.effort} hours
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <CardActions
        sx={{
          justifyContent: "space-between",
          p: 2,
          pt: 0,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => onEdit(sheet.id)}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            px: 2,
            py: 1,
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.light,
              borderColor: theme.palette.primary.dark,
            },
          }}
        >
          Update
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SendIcon />}
          onClick={() => onSubmit(sheet.id)}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            px: 2,
            py: 1,
            boxShadow: "none",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
              boxShadow: "none",
            },
          }}
        >
          Submit
        </Button>
      </CardActions>
    </Card>
  );
};

export default function DraftTimesheetTable() {
  const [timesheets, setTimesheets] = useState([]);
  const [editingTimesheet, setEditingTimesheet] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadDraftTimesheets();
  }, []);

  const handleBack = () => {
    const role = sessionStorage.getItem("Role");
    if (role === "MANAGER") {
      navigate("/mdashboard");
    } else if (role === "EMPLOYEE") {
      navigate("/edashboard");
    } else if (role === "ADMIN") {
      navigate("/adashboard");
    } else {
      navigate("/Login");
    }
  };

  const loadDraftTimesheets = async () => {
    try {
      const response = await getDraftTimesheets();
      setTimesheets(response.data);
    } catch (error) {
      console.error("Error fetching draft timesheets", error);
    }
  };

  const handleSubmit = async (id) => {
    try {
      await submitTimesheet(id);
     setSnackbarMessage("Timesheet submitted successfully!");
     setSnackbarOpen(true);

      loadDraftTimesheets();
    } catch (error) {
      console.error("Submit Error", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await getTimesheetById(id);
      setEditingTimesheet(response.data);
      setDialogOpen(true);
    } catch (error) {
      console.error("Error loading timesheet", error);
    }
  };

  const handleDialogChange = (e) => {
    setEditingTimesheet({
      ...editingTimesheet,
      [e.target.name]: e.target.value,
    });
  };

  const handleDialogSubmit = async () => {
    try {
      await updateTimesheet(editingTimesheet.id, editingTimesheet);
      setSnackbarMessage("Timesheet updated successfully!");
      setSnackbarOpen(true);

      setDialogOpen(false);
      setEditingTimesheet(null);
      loadDraftTimesheets();
    } catch (error) {
      console.error("Update Error", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
        p: { xs: 2, sm: 4 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          maxWidth: "1600px",
          mx: "auto",
        }}
      >
        <IconButton
          onClick={handleBack}
          sx={{
            backgroundColor: "white",
            boxShadow: 2,
            "&:hover": { backgroundColor: "#e0e0e0" },
            mr: 2,
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontWeight: "bold",
            color: theme.palette.primary.dark,
            letterSpacing: "0.5px",
          }}
        >
          Draft Timesheets
        </Typography>
      </Box>

      <UpdateTimesheetForm
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        timesheet={editingTimesheet}
        onChange={handleDialogChange}
        onSubmit={handleDialogSubmit}
      />

      {timesheets.length > 0 ? (
        <Grid
          container
          spacing={3}
          sx={{
            maxWidth: "1600px",
            mx: "auto",
          }}
        >
          {timesheets.map((sheet) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={sheet.id}
              sx={{
                display: "flex",
              }}
            >
              <DraftCard
                sheet={sheet}
                onEdit={handleEdit}
                onSubmit={handleSubmit}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            maxWidth: "1600px",
            mx: "auto",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: theme.shadows[2],
          }}
        >
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <DescriptionIcon color="action" />
            No Draft Timesheets Found
          </Typography>
        </Box>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// import React, { useEffect, useState } from "react";
// import {
//   Paper,
//   Button,
//   Box,
//   IconButton,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   Divider,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import EditIcon from "@mui/icons-material/Edit";
// import SendIcon from "@mui/icons-material/Send";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
// import DescriptionIcon from "@mui/icons-material/Description";

// import {
//   getDraftTimesheets,
//   submitTimesheet,
//   updateTimesheet,
//   getTimesheetById,
// } from "../../service/timesheetService";
// import UpdateTimesheetForm from "./UpdateTimesheet";
// import { useNavigate } from "react-router-dom";
// import Tooltip from "@mui/material/Tooltip";

// const DraftCard = ({ sheet, onEdit, onSubmit }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   return (
//     <Card
//       elevation={3}
//       sx={{
//         borderRadius: "16px",
//         background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
//         color: theme.palette.text.primary,
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "space-between",
//         height: "100%",
//         width: "100%",
//         transition: "transform 0.3s, box-shadow 0.3s",
//         "&:hover": {
//           transform: "translateY(-4px)",
//           boxShadow: theme.shadows[8],
//         },
//         borderLeft: `4px solid ${theme.palette.primary.main}`,
//       }}
//     >
//       <CardContent sx={{ flexGrow: 1, p: 3 }}>
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             mb: 2,
//           }}
//         >
//           <WorkOutlineIcon
//             color="primary"
//             sx={{ mr: 1.5, fontSize: "1.5rem" }}
//           />
//           <Typography
//             variant="h6"
//             sx={{
//               fontWeight: "bold",
//               color: theme.palette.primary.dark,
//             }}
//           >
//             {sheet.project}
//           </Typography>
//         </Box>

//         <Box
//           sx={{
//             backgroundColor: theme.palette.grey[100],
//             borderRadius: "12px",
//             p: 2,
//             mb: 2,
//             minHeight: "80px",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
//             <DescriptionIcon
//               color="action"
//               sx={{ mr: 1, fontSize: "1.1rem" }}
//             />
//             <Typography variant="caption" color="text.secondary">
//               Task Description
//             </Typography>
//           </Box>
//           <Tooltip title={sheet.taskName} arrow>
//             <Typography
//               variant="body2"
//               sx={{
//                 display: "-webkit-box",
//                 WebkitLineClamp: 3,
//                 WebkitBoxOrient: "vertical",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 whiteSpace: "normal",
//                 lineHeight: 1.4,
//               }}
//             >
//               {sheet.taskName}
//             </Typography>
//           </Tooltip>
//         </Box>

//         <Grid container spacing={2} sx={{ mt: 2 }}>
//           <Grid item xs={12} sm={6}>
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 mb: 1,
//               }}
//             >
//               <CalendarTodayIcon
//                 color="action"
//                 sx={{ mr: 1, fontSize: "1.1rem" }}
//               />
//               <Box>
//                 <Typography variant="caption" color="text.secondary">
//                   Start Date
//                 </Typography>
//                 <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                   {sheet.startDate}
//                 </Typography>
//               </Box>
//             </Box>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 mb: 1,
//               }}
//             >
//               <CalendarTodayIcon
//                 color="action"
//                 sx={{ mr: 1, fontSize: "1.1rem" }}
//               />
//               <Box>
//                 <Typography variant="caption" color="text.secondary">
//                   End Date
//                 </Typography>
//                 <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                   {sheet.endDate}
//                 </Typography>
//               </Box>
//             </Box>
//           </Grid>

//           <Grid item xs={12}>
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//               }}
//             >
//               <AccessTimeIcon
//                 color="action"
//                 sx={{ mr: 1, fontSize: "1.1rem" }}
//               />
//               <Box>
//                 <Typography variant="caption" color="text.secondary">
//                   Effort
//                 </Typography>
//                 <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                   {sheet.effort} hours
//                 </Typography>
//               </Box>
//             </Box>
//           </Grid>
//         </Grid>
//       </CardContent>

//       <CardActions
//         sx={{
//           justifyContent: "space-between",
//           p: 2,
//           pt: 0,
//           borderTop: `1px solid ${theme.palette.divider}`,
//         }}
//       >
//         <Button
//           variant="outlined"
//           startIcon={<EditIcon />}
//           onClick={() => onEdit(sheet.id)}
//           sx={{
//             textTransform: "none",
//             borderRadius: "8px",
//             px: 2,
//             py: 1,
//             color: theme.palette.primary.main,
//             borderColor: theme.palette.primary.main,
//             "&:hover": {
//               backgroundColor: theme.palette.primary.light,
//               borderColor: theme.palette.primary.dark,
//             },
//           }}
//         >
//           Update
//         </Button>
//         <Button
//           variant="contained"
//           color="primary"
//           startIcon={<SendIcon />}
//           onClick={() => onSubmit(sheet.id)}
//           sx={{
//             textTransform: "none",
//             borderRadius: "8px",
//             px: 2,
//             py: 1,
//             boxShadow: "none",
//             "&:hover": {
//               backgroundColor: theme.palette.primary.dark,
//               boxShadow: "none",
//             },
//           }}
//         >
//           Submit
//         </Button>
//       </CardActions>
//     </Card>
//   );
// };

// export default function DraftTimesheetTable() {
//   const [timesheets, setTimesheets] = useState([]);
//   const [editingTimesheet, setEditingTimesheet] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const navigate = useNavigate();

//   useEffect(() => {
//     loadDraftTimesheets();
//   }, []);

//   const handleBack = () => {
//     const role = sessionStorage.getItem("Role");
//     if (role === "MANAGER") {
//       navigate("/mdashboard");
//     } else if (role === "EMPLOYEE") {
//       navigate("/edashboard");
//     } else if (role === "ADMIN") {
//       navigate("/adashboard");
//     } else {
//       navigate("/Login");
//     }
//   };

//   const loadDraftTimesheets = async () => {
//     try {
//       const response = await getDraftTimesheets();
//       setTimesheets(response.data);
//     } catch (error) {
//       console.error("Error fetching draft timesheets", error);
//     }
//   };

//   const handleSubmit = async (id) => {
//     try {
//       await submitTimesheet(id);
//       alert("Timesheet Submitted Successfully!");
//       loadDraftTimesheets();
//     } catch (error) {
//       console.error("Submit Error", error);
//     }
//   };

//   const handleEdit = async (id) => {
//     try {
//       const response = await getTimesheetById(id);
//       setEditingTimesheet(response.data);
//       setDialogOpen(true);
//     } catch (error) {
//       console.error("Error loading timesheet", error);
//     }
//   };

//   const handleDialogChange = (e) => {
//     setEditingTimesheet({
//       ...editingTimesheet,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleDialogSubmit = async () => {
//     try {
//       await updateTimesheet(editingTimesheet.id, editingTimesheet);
//       alert("Timesheet updated successfully!");
//       setDialogOpen(false);
//       setEditingTimesheet(null);
//       loadDraftTimesheets();
//     } catch (error) {
//       console.error("Update Error", error);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
//         p: { xs: 2, sm: 4 },
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           mb: 4,
//           maxWidth: "1600px",
//           mx: "auto",
//         }}
//       >
//         <IconButton
//           onClick={handleBack}
//           sx={{
//             backgroundColor: "white",
//             boxShadow: 2,
//             "&:hover": { backgroundColor: "#e0e0e0" },
//             mr: 2,
//           }}
//         >
//           <ArrowBackIcon />
//         </IconButton>
//         <Typography
//           variant={isMobile ? "h5" : "h4"}
//           sx={{
//             fontWeight: "bold",
//             color: theme.palette.primary.dark,
//             letterSpacing: "0.5px",
//           }}
//         >
//           Draft Timesheets
//         </Typography>
//       </Box>

//       <UpdateTimesheetForm
//         open={dialogOpen}
//         onClose={() => setDialogOpen(false)}
//         timesheet={editingTimesheet}
//         onChange={handleDialogChange}
//         onSubmit={handleDialogSubmit}
//       />

//       {timesheets.length > 0 ? (
//         <Grid
//           container
//           spacing={3}
//           sx={{
//             maxWidth: "1600px",
//             mx: "auto",
//           }}
//         >
//           {timesheets.map((sheet) => (
//             <Grid
//               item
//               xs={12}
//               sm={6}
//               md={4}
//               lg={3}
//               key={sheet.id}
//               sx={{
//                 display: "flex",
//               }}
//             >
//               <DraftCard
//                 sheet={sheet}
//                 onEdit={handleEdit}
//                 onSubmit={handleSubmit}
//               />
//             </Grid>
//           ))}
//         </Grid>
//       ) : (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "50vh",
//             maxWidth: "1600px",
//             mx: "auto",
//             backgroundColor: "white",
//             borderRadius: "16px",
//             boxShadow: theme.shadows[2],
//           }}
//         >
//           <Typography
//             variant="h6"
//             color="text.secondary"
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1,
//             }}
//           >
//             <DescriptionIcon color="action" />
//             No Draft Timesheets Found
//           </Typography>
//         </Box>
//       )}
//     </Box>
//   );
// }
