
import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import config from "../../service/config";
import {
  submitTimesheet,
  updateTimesheet,
  resubmitTimesheet,
} from "../../service/timesheetService";
import UpdateTimesheetDialog from "../employee/UpdateTimesheetDialog.jsx";

const RejectedTimesheetDialog = ({ open, onClose }) => {
  const [rejectedTimesheets, setRejectedTimesheets] = useState([]);
  const [editingTimesheet, setEditingTimesheet] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [showNoTimesheetSnackbar, setShowNoTimesheetSnackbar] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const timerRef = useRef(null);

  const fetchRejectedTimesheets = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.get(`${config.BASE_URL}sheets/rejected`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setRejectedTimesheets(data);

      if (data.length === 0) {
        setShowNoTimesheetSnackbar(true);
        timerRef.current = setTimeout(() => {
          setShowNoTimesheetSnackbar(false);
          onClose();
        }, 5000);
      }
    } catch (error) {
      console.error("Error fetching rejected timesheets", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchRejectedTimesheets();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [open]);

  const handleResubmit = async (id) => {
    try {
      await resubmitTimesheet(id);
      await submitTimesheet(id);
      setSnackbarMessage("Timesheet Resubmitted Successfully!");
      setShowSuccessSnackbar(true);
      fetchRejectedTimesheets();
    } catch (error) {
      console.error(
        "Resubmission Failed:",
        error.response?.data || error.message
      );
      setSnackbarMessage(
        error.response?.data?.message || "Failed to resubmit timesheet."
      );
      setShowSuccessSnackbar(true);
    }
  };

  const handleEdit = (timesheet) => {
    setEditingTimesheet(timesheet);
    setUpdateDialogOpen(true);
  };

  const handleDialogSubmit = async () => {
    try {
      const allowedFields = {
        taskName: editingTimesheet.taskName,
        projectName: editingTimesheet.projectName,
        startDate: editingTimesheet.startDate,
        endDate: editingTimesheet.endDate,
        effort: editingTimesheet.effort,
      };

      await updateTimesheet(editingTimesheet.id, allowedFields);
      setSnackbarMessage("Timesheet updated successfully!");
      setShowSuccessSnackbar(true);
      setUpdateDialogOpen(false);
      fetchRejectedTimesheets();
    } catch (error) {
      console.error("Update Error", error);
      setSnackbarMessage("Failed to update timesheet.");
      setShowSuccessSnackbar(true);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth={rejectedTimesheets.length > 0}
        maxWidth={rejectedTimesheets.length > 0 ? "md" : "xs"}
      >
        <DialogTitle sx={{ backgroundColor: "#212121", color: "#E0E0E0" }}>
          Rejected Timesheets
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#2c2c2c", color: "#f5f5f5" }}>
          {rejectedTimesheets.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                padding: "1rem",
                fontStyle: "italic",
                color: "#bdbdbd",
              }}
            >
              🚫 No rejected timesheets found
            </p>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "Project",
                    "Task Name",
                    "Start Date",
                    "End Date",
                    "Comments",
                    "Actions",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{ color: "#f5f5f5", fontWeight: 600 }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rejectedTimesheets.map((ts) => (
                  <TableRow
                    key={ts.id}
                    hover
                    sx={{ backgroundColor: "#424242" }}
                  >
                    <TableCell sx={{ color: "#e0e0e0" }}>
                      {ts.projectName}
                    </TableCell>
                    <TableCell sx={{ color: "#e0e0e0" }}>
                      {ts.taskName}
                    </TableCell>
                    <TableCell sx={{ color: "#e0e0e0" }}>
                      {ts.startDate}
                    </TableCell>
                    <TableCell sx={{ color: "#e0e0e0" }}>
                      {ts.endDate}
                    </TableCell>
                    <TableCell sx={{ color: "#e0e0e0" }}>
                      {ts.comments}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="info"
                        size="small"
                        fullWidth
                        onClick={() => handleEdit(ts)}
                        sx={{ textTransform: "none" }}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions
          sx={{ backgroundColor: "#212121", justifyContent: "center" }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              color: "#ffffff",
              borderColor: "#bdbdbd",
              textTransform: "none",
              px: 3,
              py: 1,
              borderRadius: 2,
              "&:hover": { backgroundColor: "#424242", borderColor: "#ffffff" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <UpdateTimesheetDialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        timesheet={editingTimesheet}
        onChange={(e) =>
          setEditingTimesheet({
            ...editingTimesheet,
            [e.target.name]: e.target.value,
          })
        }
        onSubmit={handleDialogSubmit}
        onResubmit={handleResubmit}
      />

      <Snackbar
        open={showNoTimesheetSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setShowNoTimesheetSnackbar(false)}
        autoHideDuration={5000}
      >
        <Alert severity="info" sx={{ width: "100%" }}>
          No rejected timesheets found.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={5000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowSuccessSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RejectedTimesheetDialog;
