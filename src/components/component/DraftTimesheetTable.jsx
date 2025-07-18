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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import {
  getDraftTimesheets,
  submitTimesheet,
  updateTimesheet,
  getTimesheetById,
} from "../../service/timesheetService";
import UpdateTimesheetForm from "./UpdateTimesheet";
import { useNavigate } from "react-router-dom";

const DraftCard = ({ sheet, onEdit, onSubmit }) => (
  <Card
    elevation={4}
    sx={{
      borderRadius: 4,
      background: "#FFFFFF",
      color: "#212121",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      transition: "transform 0.3s, box-shadow 0.3s",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      },
    }}
  >
    <CardContent>
      <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
        {sheet.project}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {sheet.taskName}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={1} sx={{ my: 1 }}>
        <Grid item xs={6}>
          <Typography variant="caption">Start Date</Typography>
          <Typography variant="body2">{sheet.startDate}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption">End Date</Typography>
          <Typography variant="body2">{sheet.endDate}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption">Effort</Typography>
          <Typography variant="body2">{sheet.effort} hours</Typography>
        </Grid>
      </Grid>
    </CardContent>
    <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
      <Button
        variant="outlined"
        startIcon={<EditIcon />}
        onClick={() => onEdit(sheet.id)}
        sx={{ textTransform: "none", borderRadius: 2, mr: 1 }}
      >
        Update
      </Button>
      <Button
        variant="contained"
        color="primary"
        startIcon={<SendIcon />}
        onClick={() => onSubmit(sheet.id)}
        sx={{ textTransform: "none", borderRadius: 2 }}
      >
        Submit
      </Button>
    </CardActions>
  </Card>
);

export default function DraftTimesheetTable() {
  const [timesheets, setTimesheets] = useState([]);
  const [editingTimesheet, setEditingTimesheet] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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
      alert("Timesheet Submitted Successfully!");
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
      alert("Timesheet updated successfully!");
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
        background: "#f4f6f8",
        p: { xs: 2, sm: 4 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
        }}
      >
        <IconButton
          onClick={handleBack}
          sx={{
            backgroundColor: "white",
            boxShadow: 1,
            "&:hover": { backgroundColor: "#e0e0e0" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h4"
          sx={{
            ml: 2,
            fontWeight: "bold",
            color: "#37474f",
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
        <Grid container spacing={3}>
          {timesheets.map((sheet) => (
            <Grid item xs={12} sm={6} md={4} key={sheet.id}>
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
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No Draft Timesheets Found
          </Typography>
        </Box>
      )}
    </Box>
  );
}