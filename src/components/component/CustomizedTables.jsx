import React, { useState, useEffect, useMemo } from "react";
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
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { tableCellClasses } from "@mui/material/TableCell";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#424242",
    color: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
  "&:last-child td, &:last-child th": { border: 0 },
}));

export default function CustomizedTables({ timesheets = [] }) {
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  const [filterType, setFilterType] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [project, setProject] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'startDate',
    direction: 'desc', // 'desc' for newest first
  });

  // Sorting function
  const sortedTimesheets = useMemo(() => {
    const sortableItems = [...filteredTimesheets];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        // Handle date comparison differently
        if (sortConfig.key === 'startDate' || sortConfig.key === 'endDate') {
          const dateA = new Date(a[sortConfig.key]);
          const dateB = new Date(b[sortConfig.key]);
          if (dateA < dateB) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (dateA > dateB) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        }
        
        // Standard comparison for other fields
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredTimesheets, sortConfig]);

  // Update table whenever parent data changes
  useEffect(() => {
    const sorted = [...timesheets].sort((a, b) => 
      new Date(b.startDate) - new Date(a.startDate)
    );
    setFilteredTimesheets(sorted || []);
  }, [timesheets]);

  const applyFilters = () => {
    let filtered = [...timesheets];

    // Time Filter
    if (filterType !== "ALL") {
      const now = new Date();
      filtered = filtered.filter((sheet) => {
        const sheetDate = new Date(sheet.startDate);
        if (filterType === "WEEK") {
          const weekStart = new Date();
          weekStart.setDate(now.getDate() - now.getDay());
          return sheetDate >= weekStart;
        } else if (filterType === "MONTH") {
          return (
            sheetDate.getMonth() === now.getMonth() &&
            sheetDate.getFullYear() === now.getFullYear()
          );
        } else if (filterType === "YEAR") {
          return sheetDate.getFullYear() === now.getFullYear();
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

    // Project Filter (case-insensitive)
    if (project) {
      filtered = filtered.filter(
        (sheet) =>
          sheet.projectName?.trim().toLowerCase() ===
          project.trim().toLowerCase()
      );
    }

    setFilteredTimesheets(filtered);
    setAnchorEl(null);
  };

  const totalEffort = sortedTimesheets
    .reduce((sum, sheet) => sum + (sheet.effort || 0), 0)
    .toFixed(2);

  // Sort request handler
  const requestSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  // Build unique project list (case-insensitive)
  const projectMap = new Map();
  (timesheets || []).forEach((sheet) => {
    const normalized = sheet.projectName?.trim().toLowerCase();
    if (normalized && !projectMap.has(normalized)) {
      projectMap.set(normalized, sheet.projectName);
    }
  });
  const projectList = Array.from(projectMap.values());
  const exportToExcel = () => {
    const worksheet = utils.json_to_sheet(
      sortedTimesheets.map((sheet) => ({
        Project: sheet.projectName,
        "Task Name": sheet.taskName,
        "Start Date": sheet.startDate,
        "End Date": sheet.endDate,
        "Effort (Hrs)": sheet.effort,
        Approver: sheet.approverName,
        Assignee: sheet.userName,
        Status: sheet.status,
      }))
    );

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Timesheets");

    const excelBuffer = write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(
      fileData,
      `Timesheets_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };


  // const exportToExcel = () => {
  //   const worksheet = XLSX.utils.json_to_sheet(
  //     sortedTimesheets.map((sheet) => ({
  //       Project: sheet.projectName,
  //       "Task Name": sheet.taskName,
  //       "Start Date": sheet.startDate,
  //       "End Date": sheet.endDate,
  //       "Effort (Hrs)": sheet.effort,
  //       Approver: sheet.approverName,
  //       Assignee: sheet.userName,
  //       Status: sheet.status,
  //     }))
  //   );
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Timesheets");

  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //   });

  //   const fileData = new Blob([excelBuffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });

  //   saveAs(fileData, `Timesheets_${new Date().toISOString().split('T')[0]}.xlsx`);
  // };

  const getStatusStyles = (status) => {
    const normalized = (status || "").trim().toUpperCase();

    switch (normalized) {
      case "DRAFT":
        return { backgroundColor: "#fef3c7", color: "#92400e" };
      case "PENDING":
        return { backgroundColor: "#e0f2fe", color: "#0369a1" };
      case "APPROVED":
        return { backgroundColor: "#bbf7d0", color: "#166534" };
      case "REJECTED":
        return { backgroundColor: "#fecaca", color: "#991b1b" };
      case "REVISED":
        return { backgroundColor: "#ede9fe", color: "#6b21a8" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151" };
    }
  };

  // Function to render sort indicator
  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
      <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />;
  };

  return (
    <Box sx={{ p: 0, m: 0 }}>
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

      {/* Popover */}
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

          {/* {projectList.length > 0 && (
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
          )} */}

          <Button variant="contained" onClick={applyFilters}>
            Apply Filters
          </Button>
        </Box>
      </Popover>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "calc(100vh - 240px)",
          overflowY: "auto",
        }}
      >
        <Table sx={{ minWidth: 700 }} aria-label="customized table" stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Project</StyledTableCell>
              <StyledTableCell align="left">Task Name</StyledTableCell>
              <StyledTableCell 
                align="right"
                onClick={() => requestSort('startDate')}
                sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              >
                Start Date
                {renderSortIndicator('startDate')}
              </StyledTableCell>
              <StyledTableCell 
                align="right"
                onClick={() => requestSort('endDate')}
                sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              >
                End Date
                {renderSortIndicator('endDate')}
              </StyledTableCell>
              <StyledTableCell 
                align="right"
                onClick={() => requestSort('effort')}
                sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              >
                Effort(Hrs)
                {renderSortIndicator('effort')}
              </StyledTableCell>
              <StyledTableCell align="right">Approver</StyledTableCell>
              <StyledTableCell align="right">Assignee</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTimesheets.length > 0 ? (
              sortedTimesheets.map((sheet, index) => (
                <StyledTableRow
                  key={sheet.id || `${sheet.projectName}-${index}`}
                >
                  <StyledTableCell align="left">
                    {sheet.projectName}
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
                  <StyledTableCell align="center">
                    {(() => {
                      const { backgroundColor, color } = getStatusStyles(
                        sheet.status
                      );
                      return (
                        <span
                          style={{
                            backgroundColor,
                            color,
                            padding: "4px 10px",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            display: "inline-block",
                            whiteSpace: "nowrap",
                            textTransform: "capitalize",
                          }}
                        >
                          {sheet.status}
                        </span>
                      );
                    })()}
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
