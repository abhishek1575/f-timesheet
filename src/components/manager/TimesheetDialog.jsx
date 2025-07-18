import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Popover,
  Select,
  MenuItem,
  TextField,
  Paper,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const TimesheetDialog = ({ open, onClose, timesheets }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterType, setFilterType] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [project, setProject] = useState("");

  const projectList = [...new Set(timesheets.map((t) => t.project))];

  const applyFilters = () => {
    setAnchorEl(null);
  };

  const filteredTimesheets = useMemo(() => {
    let filtered = timesheets.filter((t) => t.status === "APPROVED"); // Show only APPROVED timesheets

    const now = new Date();
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    if (filterType !== "ALL") {
      filtered = filtered.filter((t) => {
        const tDate = new Date(t.startDate);
        if (filterType === "WEEK") return tDate >= startOfWeek;
        if (filterType === "MONTH") return tDate >= startOfMonth;
        if (filterType === "YEAR") return tDate >= startOfYear;
        return true;
      });
    }

    if (startDate) {
      filtered = filtered.filter(
        (t) => new Date(t.startDate) >= new Date(startDate)
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (t) => new Date(t.endDate) <= new Date(endDate)
      );
    }

    if (project) {
      filtered = filtered.filter((t) => t.project === project);
    }

    return filtered;
  }, [timesheets, filterType, startDate, endDate, project]);

  const totalEffort = filteredTimesheets
    .reduce((sum, sheet) => sum + (sheet.effort || 0), 0)
    .toFixed(2);

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          onClose();
        }
      }}
      disableEscapeKeyDown
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Approved Timesheet Records</DialogTitle>
      <DialogContent dividers>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          flexWrap="wrap"
          gap={2}
        >
          <Typography variant="subtitle1">
            Total Approved Hours: <strong>{totalEffort}</strong>
          </Typography>
          <Button
            variant="outlined"
            startIcon={<FilterAltIcon />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            Filters
          </Button>
        </Box>

        {/* Filter Popover */}
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Box p={2} width={300} display="flex" flexDirection="column" gap={2}>
            <Typography variant="subtitle1">Filter Options</Typography>

            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="ALL">All Time</MenuItem>
              <MenuItem value="WEEK">This Week</MenuItem>
              <MenuItem value="MONTH">This Month</MenuItem>
              <MenuItem value="YEAR">This Year</MenuItem>
            </Select>

            <TextField
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <TextField
              type="date"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <Select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All Projects</MenuItem>
              {projectList.map((proj) => (
                <MenuItem key={proj} value={proj}>
                  {proj}
                </MenuItem>
              ))}
            </Select>

            <Button variant="contained" onClick={applyFilters}>
              Apply Filters
            </Button>
          </Box>
        </Popover>

        {/* Timesheet Table */}
        {filteredTimesheets.length > 0 ? (
          <Table component={Paper} sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Task Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Start Date</strong>
                </TableCell>
                <TableCell>
                  <strong>End Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Effort (hrs)</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTimesheets.map((sheet) => (
                <TableRow key={sheet.id} hover>
                  <TableCell>{sheet.id}</TableCell>
                  <TableCell>{sheet.taskName}</TableCell>
                  <TableCell>{sheet.startDate}</TableCell>
                  <TableCell>{sheet.endDate}</TableCell>
                  <TableCell>{sheet.effort}</TableCell>
                  <TableCell>{sheet.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography>No approved timesheets found.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TimesheetDialog;

// import React, { useMemo, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Box,
//   Popover,
//   Select,
//   MenuItem,
//   TextField,
// } from "@mui/material";
// import FilterAltIcon from "@mui/icons-material/FilterAlt";

// const TimesheetDialog = ({ open, onClose, timesheets }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [filterType, setFilterType] = useState("ALL");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [project, setProject] = useState("");

//   const projectList = [...new Set(timesheets.map((t) => t.project))];

//   const applyFilters = () => {
//     setAnchorEl(null);
//   };

//   const filteredTimesheets = useMemo(() => {
//     let filtered = [...timesheets];

//     const now = new Date();
//     const startOfWeek = new Date();
//     startOfWeek.setDate(now.getDate() - now.getDay());
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const startOfYear = new Date(now.getFullYear(), 0, 1);

//     if (filterType !== "ALL") {
//       filtered = filtered.filter((t) => {
//         const tDate = new Date(t.startDate);
//         if (filterType === "WEEK") return tDate >= startOfWeek;
//         if (filterType === "MONTH") return tDate >= startOfMonth;
//         if (filterType === "YEAR") return tDate >= startOfYear;
//         return true;
//       });
//     }

//     if (startDate) {
//       filtered = filtered.filter(
//         (t) => new Date(t.startDate) >= new Date(startDate)
//       );
//     }
//     if (endDate) {
//       filtered = filtered.filter(
//         (t) => new Date(t.endDate) <= new Date(endDate)
//       );
//     }

//     if (project) {
//       filtered = filtered.filter((t) => t.project === project);
//     }

//     return filtered;
//   }, [timesheets, filterType, startDate, endDate, project]);

//   const totalEffort = filteredTimesheets
//     .reduce((sum, sheet) => sum + (sheet.effort || 0), 0)
//     .toFixed(2);

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
//       <DialogTitle>Timesheet Records</DialogTitle>
//       <DialogContent dividers>
//         <Box
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//           mb={2}
//         >
//           <Box display="flex" alignItems="center" gap={2}>
//             <Typography variant="subtitle1">
//               Total Hours: <strong>{totalEffort}</strong>
//             </Typography>
//             <Button
//               variant="outlined"
//               startIcon={<FilterAltIcon />}
//               onClick={(e) => setAnchorEl(e.currentTarget)}
//             >
//               Filters
//             </Button>
//           </Box>
//         </Box>

//         {/* Filter Popover */}
//         <Popover
//           open={Boolean(anchorEl)}
//           anchorEl={anchorEl}
//           onClose={() => setAnchorEl(null)}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         >
//           <Box p={2} width={300} display="flex" flexDirection="column" gap={2}>
//             <Typography variant="subtitle1">Filter Options</Typography>

//             <Select
//               value={filterType}
//               onChange={(e) => setFilterType(e.target.value)}
//             >
//               <MenuItem value="ALL">All Time</MenuItem>
//               <MenuItem value="WEEK">This Week</MenuItem>
//               <MenuItem value="MONTH">This Month</MenuItem>
//               <MenuItem value="YEAR">This Year</MenuItem>
//             </Select>

//             <TextField
//               type="date"
//               label="Start Date"
//               InputLabelProps={{ shrink: true }}
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//             <TextField
//               type="date"
//               label="End Date"
//               InputLabelProps={{ shrink: true }}
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />

//             <Select
//               value={project}
//               onChange={(e) => setProject(e.target.value)}
//               displayEmpty
//             >
//               <MenuItem value="">All Projects</MenuItem>
//               {projectList.map((proj) => (
//                 <MenuItem key={proj} value={proj}>
//                   {proj}
//                 </MenuItem>
//               ))}
//             </Select>

//             <Button variant="contained" onClick={applyFilters}>
//               Apply Filters
//             </Button>
//           </Box>
//         </Popover>

//         {/* Timesheet Table */}
//         {filteredTimesheets.length > 0 ? (
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>Task Name</TableCell>
//                 <TableCell>Start Date</TableCell>
//                 <TableCell>End Date</TableCell>
//                 <TableCell>Effort</TableCell>
//                 <TableCell>Status</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredTimesheets.map((sheet) => (
//                 <TableRow key={sheet.id}>
//                   <TableCell>{sheet.id}</TableCell>
//                   <TableCell>{sheet.taskName}</TableCell>
//                   <TableCell>{sheet.startDate}</TableCell>
//                   <TableCell>{sheet.endDate}</TableCell>
//                   <TableCell>{sheet.effort}</TableCell>
//                   <TableCell>{sheet.status}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         ) : (
//           <Typography>No timesheets found.</Typography>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Close</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default TimesheetDialog;
