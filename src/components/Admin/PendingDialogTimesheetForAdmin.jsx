import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import Button from "@mui/material/Button";
import TextareaAutosize from "@mui/material/TextareaAutosize";

import {
  approveTimesheetById,
  rejectTimesheetById,
} from "../../service/timesheetService";
import config from "../../service/config";

const PendingTimesheetsDialog = ({ open, onClose }) => {
  const [timesheets, setTimesheets] = useState([]);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectComment, setRejectComment] = useState("");

  const fetchPendingTimesheets = async () => {
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
    setTimesheets(data);
  };

  const handleApprove = async (id) => {
    await approveTimesheetById(id);
    fetchPendingTimesheets();
  };

  const handleReject = async (id) => {
    if (!rejectComment.trim()) return alert("Comment is required to reject.");
    await rejectTimesheetById(id, rejectComment);
    setRejectingId(null);
    setRejectComment("");
    fetchPendingTimesheets();
  };

  useEffect(() => {
    if (open) fetchPendingTimesheets();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Pending Timesheets</DialogTitle>
      <DialogContent dividers>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {timesheets.length === 0 ? (
            <p style={{ textAlign: "center", color: "gray" }}>
              No pending timesheets.
            </p>
          ) : (
            timesheets.map((sheet) => (
              <div
                key={sheet.id}
                style={{
                  border: "1px solid #ccc",
                  padding: 16,
                  borderRadius: 12,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  backgroundColor: "#fff",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  <div>
                    <strong>Task:</strong>
                    <p>{sheet.taskName}</p>
                  </div>
                  <div>
                    <strong>Project:</strong>
                    <p>{sheet.projectName}</p>
                  </div>
                  <div>
                    <strong>User:</strong>
                    <p>{sheet.userName}</p>
                  </div>
                  <div>
                    <strong>Effort:</strong>
                    <p>{sheet.effort} hours</p>
                  </div>
                  <div>
                    <strong>Date Range:</strong>
                    <p>
                      {sheet.startDate} to {sheet.endDate}
                    </p>
                  </div>
                  <div>
                    <strong>Submitted At:</strong>
                    <p>{new Date(sheet.submittedDate).toLocaleString()}</p>
                  </div>
                </div>
                <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleApprove(sheet.id)}
                  >
                    Approve
                  </Button>
                  {rejectingId === sheet.id ? (
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <TextareaAutosize
                        minRows={3}
                        placeholder="Enter rejection comment"
                        value={rejectComment}
                        onChange={(e) => setRejectComment(e.target.value)}
                        style={{ width: "100%", padding: 8, borderRadius: 4 }}
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleReject(sheet.id)}
                        >
                          Confirm Reject
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setRejectingId(null);
                            setRejectComment("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => setRejectingId(sheet.id)}
                    >
                      Reject
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PendingTimesheetsDialog;
