import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getAllTimesheets } from "../service/timesheetService";
import { useEffect } from "react";
import { useState } from "react";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: "#424242", 
    color: "#fff",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));



export default function CustomizedTables() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timesheets, setTimesheets] = useState([]);

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        const userId = sessionStorage.getItem("UserId");
        console.log("User ID from sessionStorage:", userId);
        if (!userId) throw new Error("User ID not Found", userId);

        const data = await getAllTimesheets(userId);
        setTimesheets(data);
        console.log("Timesheets fetched:", data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchTimesheets();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4 animate-pulse">
        Loading timesheets...
      </div>
    );
  }

  if (error)
    return <div className="text-center py-4 text-red-500"> Error: {error}</div>;

return (
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
        {Array.isArray(timesheets) && timesheets.length > 0 ? (
          timesheets.map((sheet, index) => (
            <StyledTableRow
              key={sheet.id || sheet._id || `${sheet.name}-${index}`}
            >
              <StyledTableCell align="right">{sheet.project}</StyledTableCell>
              <StyledTableCell align="right">{sheet.taskName}</StyledTableCell>
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
              <StyledTableCell align="right">{sheet.effort}</StyledTableCell>
              <StyledTableCell align="right">
                {sheet.approverName}
              </StyledTableCell>
              <StyledTableCell align="right">{sheet.userName}</StyledTableCell>
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
);
}
