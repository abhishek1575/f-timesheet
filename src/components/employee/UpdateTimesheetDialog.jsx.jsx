import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const UpdateTimesheetDialog = ({
  open,
  onClose,
  timesheet,
  onChange,
  onSubmit,
  onResubmit,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [dateError, setDateError] = useState({ startDate: "", endDate: "" });
  const [localTimesheet, setLocalTimesheet] = useState(timesheet || {});

  useEffect(() => {
    if (timesheet) {
      setLocalTimesheet(timesheet);
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
    if (onChange) onChange(e);
  };

  const handleSubmit = () => {
    if (!dateError.startDate && !dateError.endDate) {
      onSubmit();
      onClose(); // Close dialog after submission
    }
  };

  const handleDialogResubmit = () => {
    if (!dateError.startDate && !dateError.endDate) {
      onResubmit(localTimesheet.id);
      onClose(); // Close dialog after resubmission
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

            <TextField
              label="Project Name"
              name="projectName"
              value={localTimesheet.projectName || ""}
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

          <Box display="flex" gap={2}>
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
            <Button
              onClick={handleDialogResubmit}
              variant="contained"
              color="success"
              size={isMobile ? "small" : "medium"}
              disabled={!!dateError.startDate || !!dateError.endDate}
              sx={{
                textTransform: "none",
                px: 3,
                borderRadius: 1,
                backgroundColor: theme.palette.success.main,
                "&:hover": {
                  backgroundColor: theme.palette.success.dark,
                },
                "&:disabled": {
                  backgroundColor: theme.palette.action.disabledBackground,
                },
              }}
            >
              Submit
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default UpdateTimesheetDialog;



//old code with no logic of disappearing dialog box

// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Box,
//   Stack,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// const UpdateTimesheetDialog = ({
//   open,
//   onClose,
//   timesheet,
//   onChange,
//   onSubmit,
//   onResubmit,
// }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const [dateError, setDateError] = useState({ startDate: "", endDate: "" });
//   const [localTimesheet, setLocalTimesheet] = useState(timesheet || {});

//   useEffect(() => {
//     if (timesheet) {
//       setLocalTimesheet(timesheet);
//     }
//   }, [timesheet]);

//   const isPastDate = (date) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return date < today;
//   };

//   const handleDateChange = (name, date) => {
//     let error = "";

//     if (isPastDate(date)) {
//       error = "Cannot select past dates";
//     }

//     setDateError((prev) => ({ ...prev, [name]: error }));

//     // Format date to YYYY-MM-DD for the input
//     const formattedDate = date.toISOString().split("T")[0];
//     handleChange({ target: { name, value: formattedDate } });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLocalTimesheet((prev) => ({ ...prev, [name]: value }));
//     if (onChange) onChange(e);
//   };

//   const handleSubmit = () => {
//     if (!dateError.startDate && !dateError.endDate) {
//       onSubmit();
//     }
//   };

//   const handleDialogResubmit = () => {
//     if (!dateError.startDate && !dateError.endDate) {
//       onResubmit(localTimesheet.id);
//     }
//   };

//   if (!localTimesheet) return null;

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Dialog
//         open={open}
//         onClose={onClose}
//         maxWidth="sm"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 2,
//             width: isMobile ? "95%" : "500px",
//           },
//         }}
//       >
//         <DialogTitle
//           sx={{
//             backgroundColor: theme.palette.primary.main,
//             color: theme.palette.common.white,
//             fontWeight: 600,
//             textAlign: "center",
//             fontSize: "1.2rem",
//             py: 2,
//           }}
//         >
//           Update Timesheet Entry
//         </DialogTitle>

//         <DialogContent sx={{ py: 3, px: isMobile ? 2 : 3 }}>
//           <Stack spacing={3}>
//             <TextField
//               label="Task Name"
//               name="taskName"
//               value={localTimesheet.taskName || ""}
//               onChange={handleChange}
//               fullWidth
//               variant="outlined"
//               size="small"
//               InputLabelProps={{
//                 style: { color: theme.palette.text.secondary },
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: 1,
//                 },
//               }}
//             />

//             <TextField
//               label="Project Name"
//               name="projectName"
//               value={localTimesheet.projectName || ""}
//               onChange={handleChange}
//               fullWidth
//               variant="outlined"
//               size="small"
//               InputLabelProps={{
//                 style: { color: theme.palette.text.secondary },
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: 1,
//                 },
//               }}
//             />

//             <DatePicker
//               label="Start Date"
//               value={
//                 localTimesheet.startDate
//                   ? new Date(localTimesheet.startDate)
//                   : null
//               }
//               onChange={(date) => handleDateChange("startDate", date)}
//               minDate={new Date()}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   size="small"
//                   fullWidth
//                   error={!!dateError.startDate}
//                   helperText={dateError.startDate}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       borderRadius: 1,
//                     },
//                   }}
//                 />
//               )}
//             />

//             <DatePicker
//               label="End Date"
//               value={
//                 localTimesheet.endDate ? new Date(localTimesheet.endDate) : null
//               }
//               onChange={(date) => handleDateChange("endDate", date)}
//               minDate={
//                 localTimesheet.startDate
//                   ? new Date(localTimesheet.startDate)
//                   : new Date()
//               }
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   size="small"
//                   fullWidth
//                   error={!!dateError.endDate}
//                   helperText={dateError.endDate}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       borderRadius: 1,
//                     },
//                   }}
//                 />
//               )}
//             />

//             <TextField
//               label="Effort (Hours)"
//               name="effort"
//               type="number"
//               inputProps={{ min: 0, max: 24, step: 0.5 }}
//               value={localTimesheet.effort || ""}
//               onChange={handleChange}
//               fullWidth
//               variant="outlined"
//               size="small"
//               InputLabelProps={{
//                 style: { color: theme.palette.text.secondary },
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: 1,
//                 },
//               }}
//             />
//           </Stack>
//         </DialogContent>

//         <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
//           <Button
//             onClick={onClose}
//             variant="outlined"
//             size={isMobile ? "small" : "medium"}
//             sx={{
//               textTransform: "none",
//               px: 3,
//               borderRadius: 1,
//               color: theme.palette.text.primary,
//               borderColor: theme.palette.divider,
//               "&:hover": {
//                 borderColor: theme.palette.primary.main,
//                 backgroundColor: theme.palette.action.hover,
//               },
//             }}
//           >
//             Cancel
//           </Button>

//           <Box display="flex" gap={2}>
//             <Button
//               onClick={handleSubmit}
//               variant="contained"
//               size={isMobile ? "small" : "medium"}
//               disabled={!!dateError.startDate || !!dateError.endDate}
//               sx={{
//                 textTransform: "none",
//                 px: 3,
//                 borderRadius: 1,
//                 backgroundColor: theme.palette.primary.main,
//                 "&:hover": {
//                   backgroundColor: theme.palette.primary.dark,
//                 },
//                 "&:disabled": {
//                   backgroundColor: theme.palette.action.disabledBackground,
//                 },
//               }}
//             >
//               Update
//             </Button>
//             <Button
//               onClick={handleDialogResubmit}
//               variant="contained"
//               color="success"
//               size={isMobile ? "small" : "medium"}
//               disabled={!!dateError.startDate || !!dateError.endDate}
//               sx={{
//                 textTransform: "none",
//                 px: 3,
//                 borderRadius: 1,
//                 backgroundColor: theme.palette.success.main,
//                 "&:hover": {
//                   backgroundColor: theme.palette.success.dark,
//                 },
//                 "&:disabled": {
//                   backgroundColor: theme.palette.action.disabledBackground,
//                 },
//               }}
//             >
//               Submit
//             </Button>
//           </Box>
//         </DialogActions>
//       </Dialog>
//     </LocalizationProvider>
//   );
// };

// export default UpdateTimesheetDialog;
