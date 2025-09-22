import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  IconButton,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import {
  getDraftTimesheets,
  submitTimesheet,
  updateTimesheet,
  getTimesheetById,
} from "../../service/timesheetService";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

// UpdateTimesheetForm component
const UpdateTimesheetForm = ({
  open,
  onClose,
  timesheet,
  onSubmit,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [dateError, setDateError] = useState({ startDate: "", endDate: "" });
  const [localTimesheet, setLocalTimesheet] = useState({
    taskName: "",
    projectName: "",
    startDate: "",
    endDate: "",
    effort: "",
    comments: "",
    otherActivity: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (timesheet) {
      // Check if the projectName is one of the predefined options
      const predefinedOptions = [
        "Development",
        "Testing",
        "Design",
        "Debugging",
        "Support",
        "Coordination",
        "Outdoor activities",
      ];

      const isPredefined = predefinedOptions.includes(timesheet.projectName);

      setLocalTimesheet({
        ...timesheet,
        projectName: isPredefined ? timesheet.projectName : "Other",
        otherActivity: isPredefined ? "" : timesheet.projectName,
      });
    }
  }, [timesheet]);

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateChange = (name, date) => {
    let error = "";

    if (isPastDate(date)) {
      error = "Cannot select past dates";
    }

    setDateError((prev) => ({ ...prev, [name]: error }));

    // Format date to YYYY-MM-DD for the input
    const formattedDate = date.toISOString().split("T")[0];
    handleChange({ target: { name, value: formattedDate } });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalTimesheet((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!localTimesheet.projectName)
      newErrors.projectName = "This field is compulsory";
    else if (
      localTimesheet.projectName === "Other" &&
      !localTimesheet.otherActivity.trim()
    )
      newErrors.otherActivity = "Please specify your activity";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!dateError.startDate && !dateError.endDate && validate()) {
      onSubmit(localTimesheet);
    }
  };

  if (!localTimesheet) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            width: isMobile ? "95%" : "500px",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            fontWeight: 600,
            textAlign: "center",
            fontSize: "1.2rem",
            py: 2,
          }}
        >
          Update Timesheet Entry
        </DialogTitle>

        <DialogContent sx={{ py: 3, px: isMobile ? 2 : 3 }}>
          <Stack spacing={3}>
            <TextField
              label="Task Name"
              name="taskName"
              value={localTimesheet.taskName || ""}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              InputLabelProps={{
                style: { color: theme.palette.text.secondary },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />

            <FormControl fullWidth size="small" error={!!errors.projectName}>
              <InputLabel id="project-name-label">Task Category</InputLabel>
              <Select
                labelId="project-name-label"
                label="Project Name"
                name="projectName"
                value={localTimesheet.projectName || ""}
                onChange={handleChange}
              >
                <MenuItem value="Development">Development</MenuItem>
                <MenuItem value="Testing">Testing</MenuItem>
                <MenuItem value="Design">Design</MenuItem>
                <MenuItem value="Debugging">Debugging</MenuItem>
                <MenuItem value="Support">Support</MenuItem>
                <MenuItem value="Coordination">Coordination</MenuItem>
                <MenuItem value="Outdoor activities">
                  Outdoor activities
                </MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              {errors.projectName && (
                <FormHelperText>{errors.projectName}</FormHelperText>
              )}
            </FormControl>

            {localTimesheet.projectName === "Other" && (
              <TextField
                label="Specify your Activity"
                name="otherActivity"
                value={localTimesheet.otherActivity || ""}
                onChange={handleChange}
                fullWidth
                size="small"
                error={!!errors.otherActivity}
                helperText={errors.otherActivity}
              />
            )}

            <DatePicker
              label="Start Date"
              value={
                localTimesheet.startDate
                  ? new Date(localTimesheet.startDate)
                  : null
              }
              onChange={(date) => handleDateChange("startDate", date)}
              minDate={new Date()}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  fullWidth
                  error={!!dateError.startDate}
                  helperText={dateError.startDate}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                    },
                  }}
                />
              )}
            />

            <DatePicker
              label="End Date"
              value={
                localTimesheet.endDate ? new Date(localTimesheet.endDate) : null
              }
              onChange={(date) => handleDateChange("endDate", date)}
              minDate={
                localTimesheet.startDate
                  ? new Date(localTimesheet.startDate)
                  : new Date()
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  fullWidth
                  error={!!dateError.endDate}
                  helperText={dateError.endDate}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                    },
                  }}
                />
              )}
            />

            <TextField
              label="Effort (Hours)"
              name="effort"
              type="number"
              inputProps={{ min: 0, max: 24, step: 0.5 }}
              value={localTimesheet.effort || ""}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              InputLabelProps={{
                style: { color: theme.palette.text.secondary },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
          <Button
            onClick={onClose}
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{
              textTransform: "none",
              px: 3,
              borderRadius: 1,
              color: theme.palette.text.primary,
              borderColor: theme.palette.divider,
              "&:hover": {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            variant="contained"
            size={isMobile ? "small" : "medium"}
            disabled={!!dateError.startDate || !!dateError.endDate}
            sx={{
              textTransform: "none",
              px: 3,
              borderRadius: 1,
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
              "&:disabled": {
                backgroundColor: theme.palette.action.disabledBackground,
              },
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

// DraftCard component
const DraftCard = ({ sheet, onEdit, onSubmit }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: "300px",
        minWidth: "250px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        boxShadow: theme.shadows[1],
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: theme.shadows[4],
          transform: "translateY(-2px)",
        },
        borderLeft: `3px solid ${theme.palette.primary.main}`,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ flex: 1, p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <WorkOutlineIcon color="primary" sx={{ mr: 1, flexShrink: 0 }} />
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.dark,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {sheet.project}
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: theme.palette.grey[50],
            borderRadius: "8px",
            p: 1.5,
            mb: 1.5,
            minHeight: "60px",
          }}
        >
          <Tooltip title={sheet.taskName} arrow>
            <Typography
              variant="body2"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: 1.3,
              }}
            >
              {sheet.taskName}
            </Typography>
          </Tooltip>
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Box sx={{ display: "极", alignItems: "center" }}>
              <CalendarTodayIcon color="action" sx={{ mr: 0.5 }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Start
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {sheet.startDate}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CalendarTodayIcon color="action" sx={{ mr: 0.5 }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  End
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {sheet.endDate}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ mt: 0.5 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AccessTimeIcon color="action" sx={{ mr: 0.5 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {sheet.effort} hours
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <CardActions sx={{ p: 1.5, pt: 0 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => onEdit(sheet.id)}
          sx={{
            borderRadius: "6px",
            minWidth: 0,
            whiteSpace: "nowrap",
          }}
        >
          Edit
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<SendIcon />}
          onClick={() => onSubmit(sheet.id)}
          sx={{
            borderRadius: "6px",
            minWidth: 0,
            whiteSpace: "nowrap",
          }}
        >
          Submit
        </Button>
      </CardActions>
    </Card>
  );
};

// Main component
export default function DraftTimesheetTable() {
  const [timesheets, setTimesheets] = useState([]);
  const [editingTimesheet, setEditingTimesheet] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

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

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const validateTimesheetDates = (timesheet) => {
    const today = new Date().toISOString().split("T")[0];
    const startDate = timesheet.startDate;
    const endDate = timesheet.endDate;

    // Check if start date is in the past
    if (startDate < today) {
      showSnackbar("Start date cannot be in the past", "error");
      return false;
    }

    // Check if end date is in the past
    if (endDate < today) {
      showSnackbar("End date cannot be in the past", "error");
      return false;
    }

    // Check if end date is before start date
    if (endDate < startDate) {
      showSnackbar("End date cannot be before start date", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (id) => {
    try {
      const response = await getTimesheetById(id);
      const timesheet = response.data;

      if (!validateTimesheetDates(timesheet)) {
        return;
      }

      await submitTimesheet(id);
      showSnackbar("Timesheet submitted successfully!");
      loadDraftTimesheets();
    } catch (error) {
      console.error("Submit Error", error);
      showSnackbar("Failed to submit timesheet", "error");
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await getTimesheetById(id);
      // Ensure the editingTimesheet includes otherActivity field
      setEditingTimesheet({
        ...response.data,
        otherActivity: response.data.otherActivity || "",
      });
      setDialogOpen(true);
    } catch (error) {
      console.error("Error loading timesheet", error);
    }
  };

  const handleDialogSubmit = async (localTimesheet) => {
    try {
      // If "Other" is selected, use the custom activity text as projectName
      const projectName =
        localTimesheet.projectName === "Other"
          ? localTimesheet.otherActivity
          : localTimesheet.projectName;

      const updatedTimesheet = {
        ...localTimesheet,
        projectName,
      };

      // Remove otherActivity from payload as it's not needed in the backend
      delete updatedTimesheet.otherActivity;

      // Validate the updated timesheet
      if (!validateTimesheetDates(updatedTimesheet)) {
        return;
      }

      await updateTimesheet(updatedTimesheet.id, updatedTimesheet);
      showSnackbar("Timesheet updated successfully!");
      setDialogOpen(false);
      setEditingTimesheet(null);
      loadDraftTimesheets();
    } catch (error) {
      console.error("Update Error", error);
      showSnackbar("Failed to update timesheet", "error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: theme.palette.grey[100],
        p: { xs: 1, sm: 3 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          maxWidth: "1600px",
          mx: "auto",
        }}
      >
        <IconButton
          onClick={handleBack}
          sx={{
            backgroundColor: "white",
            boxShadow: 1,
            "&:hover": { backgroundColor: theme.palette.grey[200] },
            mr: 2,
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{
            fontWeight: 600,
            color: theme.palette.primary.dark,
          }}
        >
          Draft Timesheets
        </Typography>
      </Box>

      <UpdateTimesheetForm
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        timesheet={editingTimesheet}
        onSubmit={handleDialogSubmit}
      />

      {timesheets.length > 0 ? (
        <Grid
          container
          spacing={2}
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
            height: "40vh",
            maxWidth: "1600px",
            mx: "auto",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: theme.shadows[1],
          }}
        >
          <Typography
            variant="body1"
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
          severity={snackbarSeverity}
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