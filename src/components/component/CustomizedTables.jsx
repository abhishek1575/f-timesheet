import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Popover,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { getAllTimesheets } from "../../service/timesheetService";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { tableCellClasses } from "@mui/material/TableCell";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: { background: "#424242", color: "#fff" },
  [`&.${tableCellClasses.body}`]: { fontSize: 14 },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
  "&:last-child td, &:last-child th": { border: 0 },
}));

export default function CustomizedTables() {
  const [timesheets, setTimesheets] = useState([]);
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  const [filterType, setFilterType] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [project, setProject] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        const userId = sessionStorage.getItem("UserId");
        const data = await getAllTimesheets(userId);
        setTimesheets(data);
        setFilteredTimesheets(data);
      } catch (error) {
        console.error("Error fetching timesheets:", error.message);
      }
    };
    fetchTimesheets();
  }, []);

  const applyFilters = () => {
    let filtered = [...timesheets];

    // Time Filter
    if (filterType !== "ALL") {
      const now = new Date();
      filtered = filtered.filter((sheet) => {
        const sheetDate = new Date(sheet.startDate);
        if (filterType === "WEEK") {
          const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
          return sheetDate >= weekStart;
        } else if (filterType === "MONTH") {
          return sheetDate.getMonth() === new Date().getMonth();
        } else if (filterType === "YEAR") {
          return sheetDate.getFullYear() === new Date().getFullYear();
        }
        return true;
      });
    }

    // Custom Date Filter
    if (startDate && endDate) {
      filtered = filtered.filter((sheet) => {
        const sheetDate = new Date(sheet.startDate);
        return (
          sheetDate >= new Date(startDate) && sheetDate <= new Date(endDate)
        );
      });
    }

    // Project Filter
    if (project) {
      filtered = filtered.filter((sheet) => sheet.project === project);
    }

    setFilteredTimesheets(filtered);
    setAnchorEl(null); // Close Popover after Apply
  };

  const totalEffort = filteredTimesheets
    .reduce((sum, sheet) => sum + (sheet.effort || 0), 0)
    .toFixed(2);

  const projectList = [...new Set(timesheets.map((sheet) => sheet.project))];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredTimesheets.map((sheet) => ({
        Project: sheet.project,
        "Task Name": sheet.taskName,
        "Start Date": sheet.startDate,
        "End Date": sheet.endDate,
        "Effort (Hrs)": sheet.effort,
        Approver: sheet.approverName,
        Assignee: sheet.userName,
        Status: sheet.status,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Timesheets");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, "Filtered_Timesheets.xlsx");
  };


  return (
    <Box p={2}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h6">Timesheet Records</Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="subtitle1">
            Total Hours: <strong>{totalEffort}</strong>
          </Typography>
          <Button variant="contained" color="success" onClick={exportToExcel}>
            Export to Excel
          </Button>

          <Button
            variant="outlined"
            startIcon={<FilterAltIcon />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            Filters
          </Button>
        </Box>
      </Box>

      {/* Popover (outside flex Box) */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
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

      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="right">Project&nbsp;</StyledTableCell>
              <StyledTableCell align="right">Task Name</StyledTableCell>
              <StyledTableCell align="right">Start Date&nbsp;</StyledTableCell>
              <StyledTableCell align="right">End Date&nbsp;</StyledTableCell>
              <StyledTableCell align="right">Effort(Hrs)&nbsp;</StyledTableCell>
              <StyledTableCell align="right">Approver&nbsp;</StyledTableCell>
              <StyledTableCell align="right">Assignee&nbsp;</StyledTableCell>
              <StyledTableCell align="right">Status&nbsp;</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTimesheets.length > 0 ? (
              filteredTimesheets.map((sheet, index) => (
                <StyledTableRow key={sheet.id || `${sheet.project}-${index}`}>
                  <StyledTableCell align="right">
                    {sheet.project}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {sheet.taskName}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {sheet.startDate
                      ? new Date(sheet.startDate).toLocaleDateString()
                      : ""}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {sheet.endDate
                      ? new Date(sheet.endDate).toLocaleDateString()
                      : ""}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {sheet.effort}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {sheet.approverName}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {sheet.userName}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <span
                      style={{
                        backgroundColor:
                          sheet.status === "Approved"
                            ? "#bbf7d0"
                            : sheet.status === "Rejected"
                            ? "#fecaca"
                            : "#dbeafe",
                        color:
                          sheet.status === "Approved"
                            ? "#166534"
                            : sheet.status === "Rejected"
                            ? "#991b1b"
                            : "#1e40af",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        display: "inline-block",
                      }}
                    >
                      {sheet.status}
                    </span>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell align="center" colSpan={8}>
                  No timesheets found.
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Popover,
//   Select,
//   MenuItem,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { getAllTimesheets } from "../../service/timesheetService";
// import FilterAltIcon from "@mui/icons-material/FilterAlt";
// import { tableCellClasses } from "@mui/material/TableCell";

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: { background: "#424242", color: "#fff" },
//   [`&.${tableCellClasses.body}`]: { fontSize: 14 },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
//   "&:last-child td, &:last-child th": { border: 0 },
// }));

// export default function CustomizedTables() {
//   const [timesheets, setTimesheets] = useState([]);
//   const [filteredTimesheets, setFilteredTimesheets] = useState([]);
//   const [filterType, setFilterType] = useState("ALL");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [project, setProject] = useState("");
//   const [anchorEl, setAnchorEl] = useState(null);

//   useEffect(() => {
//     const fetchTimesheets = async () => {
//       try {
//         const userId = sessionStorage.getItem("UserId");
//         const data = await getAllTimesheets(userId);
//         setTimesheets(data);
//         setFilteredTimesheets(data);
//       } catch (error) {
//         console.error("Error fetching timesheets:", error.message);
//       }
//     };
//     fetchTimesheets();
//   }, []);

//   const applyFilters = () => {
//     let filtered = [...timesheets];

//     // Time Filter
//     if (filterType !== "ALL") {
//       const now = new Date();
//       filtered = filtered.filter((sheet) => {
//         const sheetDate = new Date(sheet.startDate);
//         if (filterType === "WEEK") {
//           const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
//           return sheetDate >= weekStart;
//         } else if (filterType === "MONTH") {
//           return sheetDate.getMonth() === new Date().getMonth();
//         } else if (filterType === "YEAR") {
//           return sheetDate.getFullYear() === new Date().getFullYear();
//         }
//         return true;
//       });
//     }

//     // Custom Date Filter
//     if (startDate && endDate) {
//       filtered = filtered.filter((sheet) => {
//         const sheetDate = new Date(sheet.startDate);
//         return (
//           sheetDate >= new Date(startDate) && sheetDate <= new Date(endDate)
//         );
//       });
//     }

//     // Project Filter
//     if (project) {
//       filtered = filtered.filter((sheet) => sheet.project === project);
//     }

//     setFilteredTimesheets(filtered);
//     setAnchorEl(null); // Close Popover after Apply
//   };

//   const totalEffort = filteredTimesheets
//     .reduce((sum, sheet) => sum + (sheet.effort || 0), 0)
//     .toFixed(2);

//   const projectList = [...new Set(timesheets.map((sheet) => sheet.project))];

//   return (
//     <Box p={2}>
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={2}
//         flexWrap="wrap"
//         gap={2}
//       >
//         <Typography variant="h6">Timesheet Records</Typography>

//         <Box display="flex" alignItems="center" gap={2}>
//           <Typography variant="subtitle1">
//             Total Hours: <strong>{totalEffort}</strong>
//           </Typography>

//           <Button
//             variant="outlined"
//             startIcon={<FilterAltIcon />}
//             onClick={(e) => setAnchorEl(e.currentTarget)}
//           >
//             Filters
//           </Button>
//         </Box>
//       </Box>

//       {/* Popover (outside flex Box) */}
//       <Popover
//         open={Boolean(anchorEl)}
//         anchorEl={anchorEl}
//         onClose={() => setAnchorEl(null)}
//         anchorOrigin={{
//           vertical: "bottom",
//           horizontal: "right",
//         }}
//       >
//         <Box p={2} width={300} display="flex" flexDirection="column" gap={2}>
//           <Typography variant="subtitle1">Filter Options</Typography>

//           <Select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//           >
//             <MenuItem value="ALL">All Time</MenuItem>
//             <MenuItem value="WEEK">This Week</MenuItem>
//             <MenuItem value="MONTH">This Month</MenuItem>
//             <MenuItem value="YEAR">This Year</MenuItem>
//           </Select>

//           <TextField
//             type="date"
//             label="Start Date"
//             InputLabelProps={{ shrink: true }}
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//           />
//           <TextField
//             type="date"
//             label="End Date"
//             InputLabelProps={{ shrink: true }}
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//           />

//           <Select
//             value={project}
//             onChange={(e) => setProject(e.target.value)}
//             displayEmpty
//           >
//             <MenuItem value="">All Projects</MenuItem>
//             {projectList.map((proj) => (
//               <MenuItem key={proj} value={proj}>
//                 {proj}
//               </MenuItem>
//             ))}
//           </Select>

//           <Button variant="contained" onClick={applyFilters}>
//             Apply Filters
//           </Button>
//         </Box>
//       </Popover>

//       {/* Table */}
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 700 }} aria-label="customized table">
//           <TableHead>
//             <TableRow>
//               <StyledTableCell align="right">Project&nbsp;</StyledTableCell>
//               <StyledTableCell align="right">Task Name</StyledTableCell>
//               <StyledTableCell align="right">Start Date&nbsp;</StyledTableCell>
//               <StyledTableCell align="right">End Date&nbsp;</StyledTableCell>
//               <StyledTableCell align="right">Effort(Hrs)&nbsp;</StyledTableCell>
//               <StyledTableCell align="right">Approver&nbsp;</StyledTableCell>
//               <StyledTableCell align="right">Assignee&nbsp;</StyledTableCell>
//               <StyledTableCell align="right">Status&nbsp;</StyledTableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredTimesheets.length > 0 ? (
//               filteredTimesheets.map((sheet, index) => (
//                 <StyledTableRow key={sheet.id || `${sheet.project}-${index}`}>
//                   <StyledTableCell align="right">
//                     {sheet.project}
//                   </StyledTableCell>
//                   <StyledTableCell align="right">
//                     {sheet.taskName}
//                   </StyledTableCell>
//                   <StyledTableCell align="right">
//                     {sheet.startDate
//                       ? new Date(sheet.startDate).toLocaleDateString()
//                       : ""}
//                   </StyledTableCell>
//                   <StyledTableCell align="right">
//                     {sheet.endDate
//                       ? new Date(sheet.endDate).toLocaleDateString()
//                       : ""}
//                   </StyledTableCell>
//                   <StyledTableCell align="right">
//                     {sheet.effort}
//                   </StyledTableCell>
//                   <StyledTableCell align="right">
//                     {sheet.approverName}
//                   </StyledTableCell>
//                   <StyledTableCell align="right">
//                     {sheet.userName}
//                   </StyledTableCell>
//                   <StyledTableCell align="right">
//                     <span
//                       style={{
//                         backgroundColor:
//                           sheet.status === "Approved"
//                             ? "#bbf7d0"
//                             : sheet.status === "Rejected"
//                             ? "#fecaca"
//                             : "#dbeafe",
//                         color:
//                           sheet.status === "Approved"
//                             ? "#166534"
//                             : sheet.status === "Rejected"
//                             ? "#991b1b"
//                             : "#1e40af",
//                         padding: "2px 8px",
//                         borderRadius: "4px",
//                         fontSize: "0.75rem",
//                         fontWeight: 600,
//                         display: "inline-block",
//                       }}
//                     >
//                       {sheet.status}
//                     </span>
//                   </StyledTableCell>
//                 </StyledTableRow>
//               ))
//             ) : (
//               <StyledTableRow>
//                 <StyledTableCell align="center" colSpan={8}>
//                   No timesheets found.
//                 </StyledTableCell>
//               </StyledTableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// }
