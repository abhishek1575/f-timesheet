import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  Card,
  Divider,
  Chip,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  fetchPendingTimesheets,
  approveTimesheetById,
  rejectTimesheetById,
} from "../../service/timesheetService";
import {
  CheckCircleOutline,
  CancelOutlined,
  ExpandMore,
  ExpandLess,
  Person,
  WorkOutline,
  TaskAlt,
  Schedule,
  Close,
  Info,
  CalendarToday,
  AccessTime,
} from "@mui/icons-material";


const TimesheetListItem = ({ sheet, onApprove, onReject }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
    } catch (e) {
      return "N/A";
    }
  };

  const handleUserNameClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        borderRadius: "8px",
        boxShadow: theme.shadows[1],
        mb: 1,
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Main Item */}
      <ListItem
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            <Person />
          </Avatar>
        </ListItemAvatar>

        <ListItemText
          primary={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.primary.main,
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                onClick={handleUserNameClick}
              >
                {sheet.userName}
              </Typography>
              <IconButton
                size="small"
                onClick={handleUserNameClick}
                sx={{ ml: "auto" }}
              >
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
          }
          secondary={
            <Box sx={{ mt: 0.5 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                <WorkOutline
                  sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }}
                />
                {sheet.projectName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <CalendarToday
                  sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }}
                />
                Submitted: {formatDate(sheet.submittedDate)}
              </Typography>
            </Box>
          }
        />
      </ListItem>

      {/* Expanded Details */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <Box sx={{ p: 2, backgroundColor: theme.palette.grey[50] }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, color: theme.palette.primary.main }}
          >
            Timesheet Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500, mb: 0.5 }}
                    >
                      <WorkOutline
                        sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }}
                      />
                      Task Category
                    </Typography>
                    <Typography variant="body1">{sheet.projectName}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500, mb: 0.5 }}
                    >
                      <AccessTime
                        sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }}
                      />
                      Total Effort
                    </Typography>
                    <Chip
                      label={`${sheet.effort} hours`}
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500, mb: 0.5 }}
                >
                  <TaskAlt
                    sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }}
                  />
                  Task Name
                </Typography>
                <Typography variant="body1">{sheet.taskName}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500, mb: 0.5 }}
                    >
                      <CalendarToday
                        sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }}
                      />
                      Start Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(sheet.startDate)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500, mb: 0.5 }}
                    >
                      <CalendarToday
                        sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }}
                      />
                      End Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(sheet.endDate)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              mt: 2,
              pt: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Button
              variant="contained"
              size="small"
              startIcon={<CheckCircleOutline />}
              onClick={() => onApprove(sheet.id)}
              sx={{
                backgroundColor: theme.palette.success.main,
                "&:hover": {
                  backgroundColor: theme.palette.success.dark,
                },
                textTransform: "none",
                borderRadius: "6px",
              }}
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CancelOutlined />}
              onClick={() => onReject(sheet.id)}
              color="error"
              sx={{
                textTransform: "none",
                borderRadius: "6px",
              }}
            >
              Reject
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
};

const PendingTimesheetDialog = ({ open, onClose }) => {
  const [timesheets, setTimesheets] = useState([]);
  const [remarkDialogOpen, setRemarkDialogOpen] = useState(false);
  const [selectedSheetId, setSelectedSheetId] = useState(null);
  const [remark, setRemark] = useState("");
  const [remarkError, setRemarkError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const refreshData = async () => {
    setLoading(true);
    try {
      const data = await fetchPendingTimesheets();
      setTimesheets(data);
    } catch (err) {
      console.error("Failed to fetch timesheets");
      setSnackbar({
        open: true,
        message: "Failed to fetch timesheets",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) refreshData();
  }, [open]);

  const approveTimesheet = async (id) => {
    try {
      await approveTimesheetById(id);
      refreshData();
      setSnackbar({
        open: true,
        message: "Timesheet approved successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error approving timesheet:", error);
      setSnackbar({
        open: true,
        message: "Failed to approve timesheet.",
        severity: "error",
      });
    }
  };

  const rejectTimesheet = async () => {
    if (!remark.trim()) {
      setRemarkError(true);
      return;
    }

    try {
      await rejectTimesheetById(selectedSheetId, remark.trim());
      setRemark("");
      setRemarkError(false);
      setRemarkDialogOpen(false);
      refreshData();
      setSnackbar({
        open: true,
        message: "Timesheet rejected successfully!",
        severity: "warning",
      });
    } catch (error) {
      console.error("Rejection error:", error);
      setSnackbar({
        open: true,
        message: "Failed to reject timesheet.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : "12px",
            background: theme.palette.background.default,
            maxHeight: "85vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2,
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Schedule sx={{ mr: 1.5 }} />
            Pending Timesheets ({timesheets.length})
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            p: isMobile ? 1 : 2,
            flex: 1,
            overflow: "auto",
            background: theme.palette.background.paper,
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress color="primary" />
            </Box>
          ) : timesheets.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
                textAlign: "center",
              }}
            >
              <Info
                color="disabled"
                sx={{ fontSize: "3rem", mb: 2, opacity: 0.6 }}
              />
              <Typography variant="h6" color="text.secondary">
                No pending timesheets
              </Typography>
              <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                All timesheets have been processed
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {timesheets.map((sheet, index) => (
                <TimesheetListItem
                  key={sheet.id || index}
                  sheet={sheet}
                  onApprove={approveTimesheet}
                  onReject={(id) => {
                    setSelectedSheetId(id);
                    setRemarkDialogOpen(true);
                  }}
                />
              ))}
            </List>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            backgroundColor: theme.palette.grey[100],
            px: 3,
            py: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            position: "sticky",
            bottom: 0,
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              px: 3,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog
        open={remarkDialogOpen}
        onClose={() => {
          setRemarkDialogOpen(false);
          setRemark("");
          setRemarkError(false);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.grey[200],
            color: theme.palette.text.primary,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
            py: 2,
          }}
        >
          <CancelOutlined /> Reject Timesheet
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Please provide a reason for rejecting this timesheet:
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            maxRows={5}
            value={remark}
            onChange={(e) => {
              setRemark(e.target.value);
              setRemarkError(false);
            }}
            variant="outlined"
            error={remarkError}
            helperText={
              remarkError ? "Please enter a reason for rejection" : ""
            }
          />
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Button
            onClick={() => {
              setRemarkDialogOpen(false);
              setRemark("");
              setRemarkError(false);
            }}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={rejectTimesheet}
            variant="contained"
            color="primary"
            startIcon={<CancelOutlined />}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
            }}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PendingTimesheetDialog;

//----------------------------------------------------------------------------------------------------------------

// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Paper,
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   Divider,
//   Chip,
//   Avatar,
//   IconButton,
//   Tooltip,
//   useTheme,
//   useMediaQuery,
//   CircularProgress,
//   Collapse,
// } from "@mui/material";
// import {
//   fetchPendingTimesheets,
//   approveTimesheetById,
//   rejectTimesheetById,
// } from "../../service/timesheetService";
// import {
//   CheckCircleOutline,
//   CancelOutlined,
//   ExpandMore,
//   ExpandLess,
//   Person,
//   WorkOutline,
//   TaskAlt,
//   Schedule,
//   Close,
//   Info,
// } from "@mui/icons-material";
// import { styled } from "@mui/material/styles";

// const ExpandButton = styled(IconButton)(({ theme }) => ({
//   marginLeft: "auto",
//   transition: theme.transitions.create("transform", {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// const TimesheetCard = ({ sheet, onApprove, onReject }) => {
//   const [expanded, setExpanded] = useState(false);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   return (
//     <Card
//       sx={{
//         borderRadius: "12px",
//         boxShadow: theme.shadows[2],
//         mb: 2,
//         background: theme.palette.background.paper,
//         borderLeft: `4px solid ${theme.palette.primary.main}`,
//       }}
//     >
//       <CardContent>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-start",
//             mb: 1,
//           }}
//         >
//           <Box>
//             <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//               <Person color="primary" sx={{ mr: 1 }} />
//               <Typography variant="subtitle1" fontWeight="500">
//                 {sheet.userName}
//               </Typography>
//             </Box>
//             <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//               <WorkOutline color="primary" sx={{ mr: 1 }} />
//               <Typography variant="body2" color="text.secondary">
//                 {sheet.projectName}
//               </Typography>
//             </Box>
//           </Box>
//           <Chip
//             label={`${sheet.effort} hrs`}
//             color="primary"
//             size="small"
//             avatar={<Schedule fontSize="small" />}
//           />
//         </Box>

//         <Divider sx={{ my: 1 }} />

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="caption" color="text.secondary">
//             {sheet.startDate} to {sheet.endDate}
//           </Typography>
//           <ExpandButton
//             size="small"
//             onClick={() => setExpanded(!expanded)}
//             aria-expanded={expanded}
//             aria-label="show more"
//           >
//             {expanded ? <ExpandLess /> : <ExpandMore />}
//           </ExpandButton>
//         </Box>

//         <Collapse in={expanded} timeout="auto" unmountOnExit>
//           <Box
//             sx={{
//               mt: 2,
//               p: 2,
//               backgroundColor: theme.palette.grey[100],
//               borderRadius: "8px",
//             }}
//           >
//             <Typography
//               variant="body2"
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 mb: 1,
//               }}
//             >
//               <TaskAlt color="action" sx={{ mr: 1 }} />
//               <strong>Task:</strong>
//             </Typography>
//             <Typography variant="body2" paragraph>
//               {sheet.taskName}
//             </Typography>
//           </Box>
//         </Collapse>
//       </CardContent>

//       <CardActions
//         sx={{
//           justifyContent: "flex-end",
//           p: 2,
//           pt: 0,
//           borderTop: `1px solid ${theme.palette.divider}`,
//         }}
//       >
//         <Tooltip title="Approve timesheet">
//           <Button
//             variant="contained"
//             size="small"
//             startIcon={<CheckCircleOutline />}
//             onClick={() => onApprove(sheet.id)}
//             sx={{
//               mr: 1,
//               backgroundColor: theme.palette.success.main,
//               "&:hover": {
//                 backgroundColor: theme.palette.success.dark,
//               },
//             }}
//           >
//             Approve
//           </Button>
//         </Tooltip>
//         <Tooltip title="Reject timesheet">
//           <Button
//             variant="outlined"
//             size="small"
//             startIcon={<CancelOutlined />}
//             onClick={() => onReject(sheet.id)}
//             color="error"
//           >
//             Reject
//           </Button>
//         </Tooltip>
//       </CardActions>
//     </Card>
//   );
// };

// const PendingTimesheetDialog = ({ open, onClose }) => {
//   const [timesheets, setTimesheets] = useState([]);
//   const [remarkDialogOpen, setRemarkDialogOpen] = useState(false);
//   const [selectedSheetId, setSelectedSheetId] = useState(null);
//   const [remark, setRemark] = useState("");
//   const [remarkError, setRemarkError] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const refreshData = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchPendingTimesheets();
//       setTimesheets(data);
//     } catch (err) {
//       console.error("Failed to fetch timesheets");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (open) refreshData();
//   }, [open]);

//   const approveTimesheet = async (id) => {
//     try {
//       await approveTimesheetById(id);
//       refreshData();
//     } catch (error) {
//       console.error("Error approving timesheet:", error);
//     }
//   };

//   const rejectTimesheet = async () => {
//     if (!remark.trim()) {
//       setRemarkError(true);
//       return;
//     }

//     try {
//       await rejectTimesheetById(selectedSheetId, remark.trim());
//       setRemark("");
//       setRemarkError(false);
//       setRemarkDialogOpen(false);
//       refreshData();
//     } catch (error) {
//       console.error("Rejection error:", error);
//     }
//   };

//   return (
//     <>
//       <Dialog
//         open={open}
//         onClose={onClose}
//         fullWidth
//         maxWidth="md"
//         fullScreen={isMobile} // Use full screen on mobile
//         PaperProps={{
//           sx: {
//             borderRadius: isMobile ? 0 : "16px",
//             background: theme.palette.background.default,
//             maxHeight: "80vh", // ✅ tighter limit
//             overflow: "hidden", // ✅ clip overflow inside
//             display: "flex",
//             flexDirection: "column",
//           },
//         }}
//       >
//         <DialogTitle
//           sx={{
//             backgroundColor: theme.palette.primary.main,
//             color: theme.palette.primary.contrastText,
//             fontWeight: 600,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             py: 2,
//             position: "sticky",
//             top: 0,
//             zIndex: 1,
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <Schedule sx={{ mr: 1.5 }} />
//             Pending Timesheets
//           </Box>
//           <IconButton
//             edge="end"
//             color="inherit"
//             onClick={onClose}
//             aria-label="close"
//           >
//             <Close />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent
//           sx={{
//             p: isMobile ? 1 : 3,
//             flex: 1,
//             overflow: "auto",
//             background: theme.palette.background.paper,
//           }}
//         >
//           {loading ? (
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 height: "100%",
//               }}
//             >
//               <CircularProgress color="primary" />
//             </Box>
//           ) : timesheets.length === 0 ? (
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 height: "100%",
//                 textAlign: "center",
//               }}
//             >
//               <Info
//                 color="disabled"
//                 sx={{ fontSize: "3rem", mb: 2, opacity: 0.6 }}
//               />
//               <Typography variant="h6" color="text.secondary">
//                 No pending timesheets
//               </Typography>
//               <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
//                 All timesheets have been processed
//               </Typography>
//             </Box>
//           ) : (
//             <Grid container spacing={2}>
//               {timesheets.map((sheet) => (
//                 <Grid item xs={12} key={sheet.id}>
//                   <TimesheetCard
//                     sheet={sheet}
//                     onApprove={approveTimesheet}
//                     onReject={(id) => {
//                       setSelectedSheetId(id);
//                       setRemarkDialogOpen(true);
//                     }}
//                   />
//                 </Grid>
//               ))}
//             </Grid>
//           )}
//         </DialogContent>

//         <DialogActions
//           sx={{
//             backgroundColor: theme.palette.grey[100],
//             px: 3,
//             py: 2,
//             borderTop: `1px solid ${theme.palette.divider}`,
//             position: "sticky",
//             bottom: 0,
//           }}
//         >
//           <Button
//             onClick={onClose}
//             variant="outlined"
//             sx={{
//               textTransform: "none",
//               borderRadius: "8px",
//               px: 3,
//             }}
//           >
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Rejection Dialog */}
//       <Dialog
//         open={remarkDialogOpen}
//         onClose={() => {
//           setRemarkDialogOpen(false);
//           setRemark("");
//           setRemarkError(false);
//         }}
//         maxWidth="sm"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: "16px",
//           },
//         }}
//       >
//         <DialogTitle
//           sx={{
//             backgroundColor: theme.palette.error.main,
//             color: theme.palette.error.contrastText,
//             fontWeight: 600,
//             display: "flex",
//             alignItems: "center",
//             py: 2,
//           }}
//         >
//           <CancelOutlined sx={{ mr: 1.5 }} />
//           Reject Timesheet
//         </DialogTitle>
//         <DialogContent sx={{ p: 3 }}>
//           <Typography variant="body1" paragraph>
//             Please provide a reason for rejecting this timesheet:
//           </Typography>
//           <TextField
//             autoFocus
//             fullWidth
//             multiline
//             minRows={3}
//             maxRows={6}
//             value={remark}
//             onChange={(e) => {
//               setRemark(e.target.value);
//               setRemarkError(false);
//             }}
//             variant="outlined"
//             error={remarkError}
//             helperText={
//               remarkError ? "Please enter a reason for rejection" : ""
//             }
//             sx={{ mt: 1 }}
//           />
//         </DialogContent>
//         <DialogActions
//           sx={{
//             px: 3,
//             py: 2,
//             borderTop: `1px solid ${theme.palette.divider}`,
//           }}
//         >
//           <Button
//             onClick={() => {
//               setRemarkDialogOpen(false);
//               setRemark("");
//               setRemarkError(false);
//             }}
//             variant="outlined"
//             sx={{
//               textTransform: "none",
//               borderRadius: "8px",
//               px: 3,
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={rejectTimesheet}
//             variant="contained"
//             color="error"
//             sx={{
//               textTransform: "none",
//               borderRadius: "8px",
//               px: 3,
//             }}
//             startIcon={<CancelOutlined />}
//           >
//             Confirm Rejection
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default PendingTimesheetDialog;
