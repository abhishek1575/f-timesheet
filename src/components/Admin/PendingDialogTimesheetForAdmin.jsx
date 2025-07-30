import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextareaAutosize,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  CheckCircleOutline as ApproveIcon,
  HighlightOff as RejectIcon,
  Comment as CommentIcon,
  Person as PersonIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { approveTimesheetById, rejectTimesheetById } from "../../service/timesheetService";
import config from "../../service/config";

const StatItem = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
    {icon}
    <Typography variant="body2" sx={{ ml: 1.5, fontWeight: "medium" }}>
      {label}:
    </Typography>
    <Typography variant="body2" sx={{ ml: 0.5, color: "text.secondary" }}>
      {value}
    </Typography>
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
      alert("Comment is required to reject.");
      return;
    }
    await rejectTimesheetById(id, rejectComment);
    setRejectingId(null);
    setRejectComment("");
    fetchPendingTimesheets();
    if (onUpdate) onUpdate();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ background: "#263238", color: "white" }}>
        {title}
      </DialogTitle>
      <DialogContent dividers sx={{ background: "#f5f5f5", p: { xs: 1, sm: 2, md: 3 } }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : timesheets.length === 0 ? (
          <Typography sx={{ textAlign: "center", color: "gray", p: 4 }}>
            No pending timesheets found.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {timesheets.map((sheet) => (
              <Grid item xs={12} key={sheet.id}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: "12px",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <StatItem
                          icon={<PersonIcon color="primary" />}
                          label="User"
                          value={sheet.userName}
                        />
                        <StatItem
                          icon={<BusinessIcon color="action" />}
                          label="Project"
                          value={sheet.projectName}
                        />
                        <StatItem
                          icon={<WorkIcon color="action" />}
                          label="Task"
                          value={sheet.taskName}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <StatItem
                          icon={<EventIcon color="action" />}
                          label="Date Range"
                          value={`${sheet.startDate} to ${sheet.endDate}`}
                        />
                        <StatItem
                          icon={<AccessTimeIcon color="action" />}
                          label="Effort"
                          value={`${sheet.effort} hours`}
                        />
                         <StatItem
                          icon={<EventIcon color="action" />}
                          label="Submitted At"
                          value={new Date(sheet.submittedDate).toLocaleString()}
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<ApproveIcon />}
                        onClick={() => handleApprove(sheet.id)}
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<RejectIcon />}
                        onClick={() => setRejectingId(rejectingId === sheet.id ? null : sheet.id)}
                      >
                        Reject
                      </Button>
                    </Box>
                    <Collapse in={rejectingId === sheet.id}>
                      <Box sx={{ mt: 2, p: 2, background: "#fafafa", borderRadius: "8px" }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          <CommentIcon sx={{ verticalAlign: "middle", mr: 0.5 }} />
                          Rejection Comment
                        </Typography>
                        <TextareaAutosize
                          minRows={3}
                          placeholder="Enter rejection comment..."
                          value={rejectComment}
                          onChange={(e) => setRejectComment(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "4px",
                            borderColor: "#ccc",
                          }}
                        />
                        <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
                          <Button
                            size="small"
                            onClick={() => {
                              setRejectingId(null);
                              setRejectComment("");
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() => handleReject(sheet.id)}
                            sx={{ ml: 1 }}
                          >
                            Confirm Reject
                          </Button>
                        </Box>
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
      <DialogActions sx={{ background: "#f5f5f5" }}>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PendingTimesheetsDialog;
