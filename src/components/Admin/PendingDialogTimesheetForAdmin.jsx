import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Collapse,
  Tooltip,
  TextField,
  Divider,
  Avatar,
  Chip,
  IconButton,
} from "@mui/material";
import {
  CheckCircleOutline as ApproveIcon,
  HighlightOff as RejectIcon,
  Comment as CommentIcon,
  Close as CloseIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import {
  approveTimesheetById,
  rejectTimesheetById,
} from "../../service/timesheetService";
import config from "../../service/config";

const StatItem = ({ icon, label, value }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      mb: 1.5,
      gap: 1,
      minHeight: 24,
    }}
  >
    <Box
      sx={{
        color: "text.secondary",
        width: 24,
        display: "flex",
        justifyContent: "center",
      }}
    >
      {icon}
    </Box>
    <Typography
      variant="caption"
      sx={{
        fontWeight: "medium",
        minWidth: 90,
        color: "text.secondary",
      }}
    >
      {label}:
    </Typography>
    <Tooltip title={value || "N/A"} arrow>
      <Typography
        variant="body2"
        sx={{
          color: "text.primary",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          flex: 1,
        }}
      >
        {value || "N/A"}
      </Typography>
    </Tooltip>
  </Box>
);

const PendingTimesheetsDialog = ({ open, onClose, onUpdate, title }) => {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectComment, setRejectComment] = useState("");

  const fetchPendingTimesheets = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${config.BASE_URL}sheets/admin/pending-manager-sheets`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      setTimesheets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch timesheets:", error);
      setTimesheets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchPendingTimesheets();
    }
  }, [open]);

  const handleApprove = async (id) => {
    await approveTimesheetById(id);
    fetchPendingTimesheets();
    if (onUpdate) onUpdate();
  };

  const handleReject = async (id) => {
    if (!rejectComment.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    await rejectTimesheetById(id, rejectComment);
    setRejectingId(null);
    setRejectComment("");
    fetchPendingTimesheets();
    if (onUpdate) onUpdate();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          maxHeight: "80vh",
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #263238 0%, #455a64 100%)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
          px: 3,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="medium">
            {title}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {timesheets.length} pending approval
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          background: "#f8fafc",
          p: { xs: 1, sm: 2 },
          overflow: "auto",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 200,
            }}
          >
            <CircularProgress size={50} thickness={4} />
          </Box>
        ) : timesheets.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 200,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
              No pending timesheets
            </Typography>
            <Typography variant="body2" color="textSecondary">
              All timesheets are up to date
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {timesheets.map((sheet) => (
              <Grid item xs={12} sm={6} key={sheet.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "#bdbdbd",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      p: 2,
                      pb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        gap: 1.5,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: stringToColor(sheet.userName),
                        }}
                      >
                        {getInitials(sheet.userName)}
                      </Avatar>
                      <Box sx={{ overflow: "hidden" }}>
                        <Typography
                          variant="subtitle1"
                          noWrap
                          sx={{ fontWeight: 500 }}
                        >
                          {sheet.userName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {sheet.projectName}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box sx={{ mt: 1 }}>
                      <StatItem
                        icon={<WorkIcon fontSize="small" />}
                        label="Task"
                        value={sheet.taskName}
                      />
                      <StatItem
                        icon={<CalendarIcon fontSize="small" />}
                        label="Date Range"
                        value={`${formatDate(sheet.startDate)} - ${formatDate(
                          sheet.endDate
                        )}`}
                      />
                      <StatItem
                        icon={<AccessTimeIcon fontSize="small" />}
                        label="Effort"
                        value={`${sheet.effort} hours`}
                      />
                      <StatItem
                        icon={<EventIcon fontSize="small" />}
                        label="Submitted"
                        value={formatDate(sheet.submittedDate)}
                      />
                    </Box>
                  </CardContent>

                  <Box sx={{ px: 2, pb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        mb: rejectingId === sheet.id ? 1 : 0,
                      }}
                    >
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<ApproveIcon />}
                        onClick={() => handleApprove(sheet.id)}
                        sx={{
                          borderRadius: "20px",
                          textTransform: "none",
                          px: 2,
                          boxShadow: "none",
                          "&:hover": {
                            boxShadow: "none",
                          },
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<RejectIcon />}
                        onClick={() =>
                          setRejectingId(
                            rejectingId === sheet.id ? null : sheet.id
                          )
                        }
                        sx={{
                          borderRadius: "20px",
                          textTransform: "none",
                          px: 2,
                        }}
                      >
                        Reject
                      </Button>
                    </Box>

                    <Collapse in={rejectingId === sheet.id}>
                      <Box
                        sx={{
                          mt: 1,
                          p: 2,
                          backgroundColor: "#fff9f9",
                          borderRadius: 1,
                          border: "1px solid #ffebee",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            mb: 1,
                            display: "flex",
                            alignItems: "center",
                            color: "error.main",
                          }}
                        >
                          <CommentIcon sx={{ mr: 1, fontSize: 18 }} />
                          Reason for rejection
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          variant="outlined"
                          placeholder="Please specify the reason..."
                          value={rejectComment}
                          onChange={(e) => setRejectComment(e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px",
                              backgroundColor: "white",
                            },
                          }}
                        />
                        <Box
                          sx={{
                            mt: 1.5,
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1.5,
                          }}
                        >
                          <Button
                            size="small"
                            onClick={() => {
                              setRejectingId(null);
                              setRejectComment("");
                            }}
                            sx={{ borderRadius: "20px" }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() => handleReject(sheet.id)}
                            sx={{ borderRadius: "20px", px: 2 }}
                          >
                            Confirm Reject
                          </Button>
                        </Box>
                      </Box>
                    </Collapse>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          background: "#f5f7fa",
          px: 3,
          py: 1.5,
        }}
      >
        <Button
          variant="text"
          onClick={onClose}
          sx={{
            borderRadius: "20px",
            px: 2,
            color: "text.secondary",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Helper functions
function stringToColor(string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export default PendingTimesheetsDialog;

// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   CircularProgress,
//   Box,
//   Collapse,
//   Tooltip,
//   TextField,
//   Divider,
// } from "@mui/material";
// import {
//   CheckCircleOutline as ApproveIcon,
//   HighlightOff as RejectIcon,
//   Comment as CommentIcon,
//   Person as PersonIcon,
//   Event as EventIcon,
//   AccessTime as AccessTimeIcon,
//   Work as WorkIcon,
//   Business as BusinessIcon,
//   CalendarToday as CalendarIcon,
// } from "@mui/icons-material";
// import { approveTimesheetById, rejectTimesheetById } from "../../service/timesheetService";
// import config from "../../service/config";

// const StatItem = ({ icon, label, value }) => (
//   <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1, overflow: "hidden" }}>
//     {icon}
//     <Typography
//       variant="body2"
//       sx={{ ml: 1.5, fontWeight: "medium", flexShrink: 0, minWidth: "80px" }}
//     >
//       {label}:
//     </Typography>
//     <Tooltip title={value || "N/A"} arrow>
//       <Typography
//         variant="body2"
//         sx={{
//           color: "text.secondary",
//           whiteSpace: "nowrap",
//           overflow: "hidden",
//           textOverflow: "ellipsis",
//         }}
//       >
//         {value || "N/A"}
//       </Typography>
//     </Tooltip>
//   </Box>
// );

// const PendingTimesheetsDialog = ({ open, onClose, onUpdate, title }) => {
//   const [timesheets, setTimesheets] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [rejectingId, setRejectingId] = useState(null);
//   const [rejectComment, setRejectComment] = useState("");

//   const fetchPendingTimesheets = async () => {
//     setLoading(true);
//     try {
//       const token = sessionStorage.getItem("token");
//       const res = await fetch(
//         `${config.BASE_URL}sheets/admin/pending-manager-sheets`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const data = await res.json();
//       setTimesheets(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Failed to fetch timesheets:", error);
//       setTimesheets([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (open) {
//       fetchPendingTimesheets();
//     }
//   }, [open]);

//   const handleApprove = async (id) => {
//     await approveTimesheetById(id);
//     fetchPendingTimesheets();
//     if (onUpdate) onUpdate();
//   };

//   const handleReject = async (id) => {
//     if (!rejectComment.trim()) {
//       alert("Comment is required to reject.");
//       return;
//     }
//     await rejectTimesheetById(id, rejectComment);
//     setRejectingId(null);
//     setRejectComment("");
//     fetchPendingTimesheets();
//     if (onUpdate) onUpdate();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle sx={{ background: "#263238", color: "white" }}>
//         {title}
//       </DialogTitle>
//       <DialogContent dividers sx={{ background: "#f5f5f5", p: { xs: 1, sm: 2 } }}>
//         {loading ? (
//           <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
//             <CircularProgress />
//           </Box>
//         ) : timesheets.length === 0 ? (
//           <Typography sx={{ textAlign: "center", color: "gray", p: 4 }}>
//             No pending timesheets found.
//           </Typography>
//         ) : (
//           <Grid container spacing={2}>
//             {timesheets.map((sheet) => (
//               <Grid item xs={12} sm={6} key={sheet.id}>
//                 <Card
//                   elevation={2}
//                   sx={{
//                     height: "100%",
//                     borderRadius: "12px",
//                     transition: "all 0.3s ease",
//                     "&:hover": {
//                       boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
//                       transform: "translateY(-2px)",
//                     },
//                     display: "flex",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <CardContent sx={{ flexGrow: 1 }}>
//                     <Box sx={{ mb: 1.5 }}>
//                       <Typography variant="h6" component="div" noWrap>
//                         {sheet.userName}
//                       </Typography>
//                       <Typography color="text.secondary" variant="body2" noWrap>
//                         {sheet.projectName}
//                       </Typography>
//                     </Box>
//                     <Divider sx={{ mb: 2 }} />
//                     <StatItem
//                       icon={<WorkIcon fontSize="small" color="action" />}
//                       label="Task"
//                       value={sheet.taskName}
//                     />
//                     <StatItem
//                       icon={<CalendarIcon fontSize="small" color="action" />}
//                       label="Date Range"
//                       value={`${sheet.startDate} to ${sheet.endDate}`}
//                     />
//                     <StatItem
//                       icon={<AccessTimeIcon fontSize="small" color="action" />}
//                       label="Effort"
//                       value={`${sheet.effort} hours`}
//                     />
//                     <StatItem
//                       icon={<EventIcon fontSize="small" color="action" />}
//                       label="Submitted"
//                       value={new Date(sheet.submittedDate).toLocaleDateString()}
//                     />
//                   </CardContent>
//                   <Box>
//                     <Box sx={{ px: 2, pb: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
//                       <Button
//                         variant="contained"
//                         color="success"
//                         size="small"
//                         startIcon={<ApproveIcon />}
//                         onClick={() => handleApprove(sheet.id)}
//                         sx={{ borderRadius: '20px', textTransform: 'none' }}
//                       >
//                         Approve
//                       </Button>
//                       <Button
//                         variant="contained"
//                         color="error"
//                         size="small"
//                         startIcon={<RejectIcon />}
//                         onClick={() => setRejectingId(rejectingId === sheet.id ? null : sheet.id)}
//                         sx={{ borderRadius: '20px', textTransform: 'none' }}
//                       >
//                         Reject
//                       </Button>
//                     </Box>
//                     <Collapse in={rejectingId === sheet.id}>
//                       <Box sx={{ p: 2, pt: 0, background: "#fafafa" }}>
//                         <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
//                           <CommentIcon sx={{ mr: 0.5 }} />
//                           Rejection Comment
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           multiline
//                           rows={2}
//                           variant="outlined"
//                           placeholder="Enter comment..."
//                           value={rejectComment}
//                           onChange={(e) => setRejectComment(e.target.value)}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               borderRadius: "8px",
//                               backgroundColor: "white",
//                             },
//                           }}
//                         />
//                         <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end", gap: 1 }}>
//                           <Button
//                             size="small"
//                             onClick={() => {
//                               setRejectingId(null);
//                               setRejectComment("");
//                             }}
//                           >
//                             Cancel
//                           </Button>
//                           <Button
//                             size="small"
//                             variant="contained"
//                             color="error"
//                             onClick={() => handleReject(sheet.id)}
//                           >
//                             Confirm
//                           </Button>
//                         </Box>
//                       </Box>
//                     </Collapse>
//                   </Box>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         )}
//       </DialogContent>
//       <DialogActions sx={{ background: "#f5f5f5" }}>
//         <Button variant="outlined" onClick={onClose}>
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default PendingTimesheetsDialog;
