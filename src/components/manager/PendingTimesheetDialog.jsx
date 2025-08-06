

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Paper,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Collapse,
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
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const ExpandButton = styled(IconButton)(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const TimesheetCard = ({ sheet, onApprove, onReject }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      sx={{
        borderRadius: "12px",
        boxShadow: theme.shadows[2],
        mb: 2,
        background: theme.palette.background.paper,
        borderLeft: `4px solid ${theme.palette.primary.main}`,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Person color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight="500">
                {sheet.userName}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <WorkOutline color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {sheet.projectName}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={`${sheet.effort} hrs`}
            color="primary"
            size="small"
            avatar={<Schedule fontSize="small" />}
          />
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {sheet.startDate} to {sheet.endDate}
          </Typography>
          <ExpandButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label="show more"
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </ExpandButton>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: theme.palette.grey[100],
              borderRadius: "8px",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
              }}
            >
              <TaskAlt color="action" sx={{ mr: 1 }} />
              <strong>Task:</strong>
            </Typography>
            <Typography variant="body2" paragraph>
              {sheet.taskName}
            </Typography>
          </Box>
        </Collapse>
      </CardContent>

      <CardActions
        sx={{
          justifyContent: "flex-end",
          p: 2,
          pt: 0,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Tooltip title="Approve timesheet">
          <Button
            variant="contained"
            size="small"
            startIcon={<CheckCircleOutline />}
            onClick={() => onApprove(sheet.id)}
            sx={{
              mr: 1,
              backgroundColor: theme.palette.success.main,
              "&:hover": {
                backgroundColor: theme.palette.success.dark,
              },
            }}
          >
            Approve
          </Button>
        </Tooltip>
        <Tooltip title="Reject timesheet">
          <Button
            variant="outlined"
            size="small"
            startIcon={<CancelOutlined />}
            onClick={() => onReject(sheet.id)}
            color="error"
          >
            Reject
          </Button>
        </Tooltip>
      </CardActions>
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const refreshData = async () => {
    setLoading(true);
    try {
      const data = await fetchPendingTimesheets();
      setTimesheets(data);
    } catch (err) {
      console.error("Failed to fetch timesheets");
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
    } catch (error) {
      console.error("Error approving timesheet:", error);
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
    } catch (error) {
      console.error("Rejection error:", error);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: theme.palette.background.default,
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
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Schedule sx={{ mr: 1.5 }} />
            Pending Timesheets
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
            p: isMobile ? 1 : 3,
            minHeight: "400px",
            background: theme.palette.background.paper,
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "300px",
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
                height: "300px",
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
            <Grid container spacing={2}>
              {timesheets.map((sheet) => (
                <Grid item xs={12} key={sheet.id}>
                  <TimesheetCard
                    sheet={sheet}
                    onApprove={approveTimesheet}
                    onReject={(id) => {
                      setSelectedSheetId(id);
                      setRemarkDialogOpen(true);
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            backgroundColor: theme.palette.grey[100],
            px: 3,
            py: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
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
          sx: {
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            py: 2,
          }}
        >
          <CancelOutlined sx={{ mr: 1.5 }} />
          Reject Timesheet
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" paragraph>
            Please provide a reason for rejecting this timesheet:
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            maxRows={6}
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
            sx={{ mt: 1 }}
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
              borderRadius: "8px",
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={rejectTimesheet}
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              px: 3,
            }}
            startIcon={<CancelOutlined />}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PendingTimesheetDialog;

// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TextField,
//   TableContainer,
//   Paper,
//   Box,
//   Typography,
// } from "@mui/material";
// import {
//   fetchPendingTimesheets,
//   approveTimesheetById,
//   rejectTimesheetById,
// } from "../../service/timesheetService";

// const PendingTimesheetDialog = ({ open, onClose }) => {
//   const [timesheets, setTimesheets] = useState([]);
//   const [remarkDialogOpen, setRemarkDialogOpen] = useState(false);
//   const [selectedSheetId, setSelectedSheetId] = useState(null);
//   const [remark, setRemark] = useState("");
//   const [remarkError, setRemarkError] = useState(false);

//   const refreshData = async () => {
//     try {
//       const data = await fetchPendingTimesheets();
//       setTimesheets(data);
//     } catch (err) {
//       console.error("Failed to fetch timesheets");
//     }
//   };

//   useEffect(() => {
//     if (open) refreshData();
//   }, [open]);

//   const approveTimesheet = async (id) => {
//     try {
//       await approveTimesheetById(id);
//       alert("✅ Timesheet approved successfully!");
//       refreshData();
//     } catch (error) {
//       console.error("Error approving timesheet:", error);
//       alert("❌ Failed to approve timesheet.");
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
//       alert("⛔ Timesheet rejected successfully!");
//     } catch (error) {
//       console.error("Rejection error:", error);
//       alert(`❌ Failed to reject timesheet: ${error.message}`);
//     }
//   };

//   return (
//     <>
//       <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
//         <DialogTitle
//           sx={{
//             backgroundColor: "#212121",
//             color: "#f5f5f5",
//             fontWeight: 600,
//             textAlign: "center",
//           }}
//         >
//           🕒 Pending Timesheets
//         </DialogTitle>

//         <DialogContent sx={{ backgroundColor: "#f9f9f9" }}>
//           {timesheets.length === 0 ? (
//             <Typography
//               variant="body2"
//               sx={{ textAlign: "center", py: 3, color: "#757575" }}
//             >
//               🚫 No pending timesheets available
//             </Typography>
//           ) : (
//             <TableContainer component={Paper} elevation={2}>
//               <Table>
//                 <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
//                   <TableRow>
//                     {/* <TableCell>
//                       <strong>ID</strong>
//                     </TableCell> */}
//                     <TableCell>
//                       <strong>Employee</strong>
//                     </TableCell>
//                     <TableCell>
//                       <strong>Project</strong>
//                     </TableCell>
//                     <TableCell>
//                       <strong>Task</strong>
//                     </TableCell>
//                     <TableCell>
//                       <strong>Effort</strong>
//                     </TableCell>
//                     <TableCell>
//                       <strong>Dates</strong>
//                     </TableCell>
//                     <TableCell>
//                       <strong>Actions</strong>
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {timesheets.map((sheet) => (
//                     <TableRow key={sheet.id} hover>
//                       {/* <TableCell>{sheet.id}</TableCell> */}
//                       <TableCell>{sheet.userName}</TableCell>
//                       <TableCell>{sheet.projectName}</TableCell>
//                       <TableCell>{sheet.taskName}</TableCell>
//                       <TableCell>{sheet.effort}</TableCell>
//                       <TableCell>
//                         {sheet.startDate} to {sheet.endDate}
//                       </TableCell>
//                       <TableCell>
//                         <Box display="flex" gap={1} flexWrap="wrap">
//                           <Button
//                             size="small"
//                             variant="contained"
//                             color="success"
//                             sx={{ textTransform: "none" }}
//                             onClick={() => approveTimesheet(sheet.id)}
//                           >
//                             Approve
//                           </Button>
//                           <Button
//                             size="small"
//                             variant="contained"
//                             color="error"
//                             sx={{ textTransform: "none" }}
//                             onClick={() => {
//                               setSelectedSheetId(sheet.id);
//                               setRemarkDialogOpen(true);
//                             }}
//                           >
//                             Reject
//                           </Button>
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}
//         </DialogContent>

//         <DialogActions
//           sx={{ backgroundColor: "#f1f1f1", justifyContent: "center" }}
//         >
//           <Button
//             onClick={onClose}
//             variant="outlined"
//             sx={{ textTransform: "none" }}
//           >
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* ✅ Elegant Remark Dialog */}
//       <Dialog
//         open={remarkDialogOpen}
//         onClose={() => {
//           setRemarkDialogOpen(false);
//           setRemark("");
//           setRemarkError(false);
//         }}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle
//           sx={{
//             backgroundColor: "#212121",
//             color: "#fff",
//             textAlign: "center",
//             fontWeight: 600,
//           }}
//         >
//           ❌ Reject Timesheet
//         </DialogTitle>
//         <DialogContent sx={{ backgroundColor: "#2c2c2c" }}>
//           <TextField
//             autoFocus
//             label="Reason for rejection"
//             fullWidth
//             multiline
//             rows={4}
//             value={remark}
//             onChange={(e) => {
//               setRemark(e.target.value);
//               setRemarkError(false);
//             }}
//             variant="outlined"
//             InputLabelProps={{ style: { color: "#bdbdbd" } }}
//             InputProps={{ style: { color: "#fff" } }}
//             error={remarkError}
//             helperText={
//               remarkError
//                 ? "⚠️ Remark is required to reject the timesheet."
//                 : ""
//             }
//             sx={{ mt: 2 }}
//           />
//         </DialogContent>
//         <DialogActions
//           sx={{
//             backgroundColor: "#212121",
//             px: 3,
//             py: 2,
//             justifyContent: "space-between",
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
//               color: "#fff",
//               borderColor: "#9e9e9e",
//               textTransform: "none",
//               "&:hover": {
//                 backgroundColor: "#383838",
//                 borderColor: "#fff",
//               },
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
//               px: 4,
//               fontWeight: 500,
//               backgroundColor: "#d32f2f",
//               "&:hover": {
//                 backgroundColor: "#b71c1c",
//               },
//             }}
//           >
//             Submit
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default PendingTimesheetDialog;

