import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
  IconButton,
  Typography,
  useTheme,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function UpdateTimesheetForm({
  open,
  onClose,
  timesheet,
  onChange,
  onSubmit,
}) {
  const theme = useTheme();

  if (!timesheet) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "8px",
          border: "1px solid",
          borderColor: theme.palette.divider,
          width: "100%",
          maxWidth: "600px",
          overflow: "hidden",
          boxShadow: theme.shadows[5],
        },
      }}
    >
      {/* Header with subtle border */}
      <DialogTitle
        sx={{
          p: "16px 24px",
          borderBottom: "1px solid",
          borderColor: theme.palette.divider,
          backgroundColor: theme.palette.background.paper,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Update Timesheet
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: theme.palette.text.secondary,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Form content with bordered container */}
      <DialogContent sx={{ p: 0 }}>
        <Paper
          elevation={0}
          sx={{
            p: "24px",
            m: "16px",
            borderRadius: "6px",
            border: "1px solid",
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Stack spacing={3}>
            {/* Task Description */}
            <TextField
              label="Task Description"
              name="taskName"
              value={timesheet.taskName || ""}
              onChange={onChange}
              multiline
              minRows={3}
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "4px",
                  "& fieldset": {
                    borderColor: theme.palette.divider,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />

            {/* Project Name */}
            <TextField
              label="Project Name"
              name="projectName"
              value={timesheet.projectName || ""}
              onChange={onChange}
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "4px",
                  "& fieldset": {
                    borderColor: theme.palette.divider,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />

            {/* Date Fields */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Start Date"
                name="startDate"
                type="date"
                value={timesheet.startDate || ""}
                onChange={onChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "4px",
                    "& fieldset": {
                      borderColor: theme.palette.divider,
                    },
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
              <TextField
                label="End Date"
                name="endDate"
                type="date"
                value={timesheet.endDate || ""}
                onChange={onChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "4px",
                    "& fieldset": {
                      borderColor: theme.palette.divider,
                    },
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </Box>

            {/* Hours Worked */}
            <TextField
              label="Hours Worked"
              name="effort"
              type="number"
              value={timesheet.effort || ""}
              onChange={onChange}
              fullWidth
              InputProps={{
                inputProps: {
                  step: "0.25",
                  min: 0.25,
                  max: 24,
                },
              }}
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "4px",
                  "& fieldset": {
                    borderColor: theme.palette.divider,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Stack>
        </Paper>
      </DialogContent>

      {/* Footer with action buttons */}
      <DialogActions
        sx={{
          p: "16px 24px",
          borderTop: "1px solid",
          borderColor: theme.palette.divider,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            minWidth: "120px",
            height: "40px",
            borderRadius: "4px",
            borderWidth: "1.5px",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              borderWidth: "1.5px",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          sx={{
            minWidth: "120px",
            height: "40px",
            borderRadius: "4px",
            textTransform: "none",
            fontWeight: 500,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

//-----------------------------------------------------------------------------------------------------


// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Stack,
//   Box,
//   IconButton,
//   Typography,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// export default function UpdateTimesheetForm({
//   open,
//   onClose,
//   timesheet,
//   onChange,
//   onSubmit,
// }) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   if (!timesheet) return null;

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       fullWidth
//       maxWidth="sm"
//       fullScreen={isMobile}
//       PaperProps={{
//         sx: {
//           borderRadius: isMobile ? 0 : 2,
//         },
//       }}
//     >
//       <DialogTitle sx={{ p: 2 }}>
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <IconButton onClick={onClose} sx={{ mr: 1 }}>
//             {isMobile ? <ArrowBackIcon /> : <CloseIcon />}
//           </IconButton>
//           <Typography variant="h6" sx={{ flexGrow: 1 }}>
//             Update Timesheet
//           </Typography>
//         </Box>
//       </DialogTitle>

//       <DialogContent sx={{ p: 3 }}>
//         <Stack spacing={3}>
//           <TextField
//             label="Task Description"
//             name="taskName"
//             value={timesheet.taskName || ""}
//             onChange={onChange}
//             multiline
//             minRows={3}
//             fullWidth
//             variant="outlined"
//             size="small"
//           />

//           <TextField
//             label="Project Name"
//             name="projectName"
//             value={timesheet.projectName || ""}
//             onChange={onChange}
//             fullWidth
//             variant="outlined"
//             size="small"
//           />

//           <Box
//             sx={{
//               display: "flex",
//               gap: 2,
//               flexDirection: isMobile ? "column" : "row",
//             }}
//           >
//             <TextField
//               label="Start Date"
//               name="startDate"
//               type="date"
//               value={timesheet.startDate || ""}
//               onChange={onChange}
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//               variant="outlined"
//               size="small"
//             />
//             <TextField
//               label="End Date"
//               name="endDate"
//               type="date"
//               value={timesheet.endDate || ""}
//               onChange={onChange}
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//               variant="outlined"
//               size="small"
//             />
//           </Box>

//           <TextField
//             label="Hours Worked"
//             name="effort"
//             type="number"
//             value={timesheet.effort || ""}
//             onChange={onChange}
//             fullWidth
//             InputProps={{
//               inputProps: {
//                 step: "0.25",
//                 min: 0.25,
//                 max: 24,
//               },
//             }}
//             variant="outlined"
//             size="small"
//           />
//         </Stack>
//       </DialogContent>

//       <DialogActions sx={{ px: 3, pb: 3 }}>
//         <Button variant="outlined" onClick={onClose} sx={{ mr: 2 }}>
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={onSubmit}
//           sx={{
//             bgcolor: "primary.main",
//             "&:hover": { bgcolor: "primary.dark" },
//           }}
//         >
//           Save Changes
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Stack,
//   Paper,
// } from "@mui/material";

// export default function UpdateTimesheetForm({
//   open,
//   onClose,
//   timesheet,
//   onChange,
//   onSubmit,
// }) {
//   if (!timesheet) return null;

//   return (
//     <Dialog
//       open={open}
//       onClose={(event, reason) => {
//         if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
//           onClose();
//         }
//       }}
//       fullWidth
//       maxWidth="sm"
//     >
//       <DialogTitle
//         sx={{
//           backgroundColor: "#212121",
//           color: "#E0E0E0",
//           fontWeight: 600,
//           fontSize: "1.25rem",
//           letterSpacing: "0.5px",
//           py: 2,
//           textAlign: "center",
//         }}
//       >
//         ✏️ Update Timesheet
//       </DialogTitle>

//       <DialogContent sx={{ backgroundColor: "#f5f5f5" }}>
//         <Paper
//           elevation={0}
//           sx={{
//             p: 3,
//             backgroundColor: "#ffffff",
//             borderRadius: 3,
//           }}
//         >
//           <Stack spacing={2}>
//             <TextField
//               label="Task Name"
//               name="taskName"
//               value={timesheet.taskName || ""}
//               onChange={onChange}
//               fullWidth
//               variant="outlined"
//             />
//             <TextField
//               label="Project Name"
//               name="projectName" // Changed from "project" to match API
//               value={timesheet.projectName || ""} // Ensure fallback to empty string
//               onChange={onChange}
//               fullWidth
//               variant="outlined"
//             />
//             <TextField
//               label="Start Date"
//               name="startDate"
//               type="date"
//               value={timesheet.startDate || ""}
//               onChange={onChange}
//               InputLabelProps={{ shrink: true }}
//               fullWidth
//               variant="outlined"
//             />
//             <TextField
//               label="End Date"
//               name="endDate"
//               type="date"
//               value={timesheet.endDate || ""}
//               onChange={onChange}
//               InputLabelProps={{ shrink: true }}
//               fullWidth
//               variant="outlined"
//             />
//             <TextField
//               label="Effort (Hours)"
//               name="effort"
//               type="number"
//               value={timesheet.effort || ""}
//               onChange={onChange}
//               fullWidth
//               inputProps={{ min: 0, step: "0.1" }}
//               variant="outlined"
//             />
//           </Stack>
//         </Paper>
//       </DialogContent>

//       <DialogActions
//         sx={{
//           backgroundColor: "#eeeeee",
//           px: 3,
//           py: 2,
//           justifyContent: "space-between",
//         }}
//       >
//         <Button
//           onClick={onClose}
//           variant="outlined"
//           sx={{
//             textTransform: "none",
//             borderRadius: 2,
//             px: 3,
//             height: 40,
//             color: "#424242",
//             borderColor: "#9e9e9e",
//             "&:hover": {
//               borderColor: "#616161",
//               backgroundColor: "#f5f5f5",
//             },
//           }}
//         >
//           Cancel
//         </Button>
//         <Button
//           onClick={onSubmit}
//           variant="contained"
//           sx={{
//             textTransform: "none",
//             borderRadius: 2,
//             px: 4,
//             height: 40,
//             backgroundColor: "#1976d2",
//             "&:hover": {
//               backgroundColor: "#1565c0",
//             },
//           }}
//         >
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
