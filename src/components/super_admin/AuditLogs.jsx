import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../service/config";
import {
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const AuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState(null);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const response = await axios.get(
          `${config.BASE_URL}projects/audit-logs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAuditLogs(response.data);
        setFilteredLogs(response.data);
      } catch (err) {
        setError("Failed to fetch audit logs. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, [token]);

  const handleSearch = (event) => {
    const text = event.target.value.toLowerCase();
    setSearchText(text);
    const filtered = auditLogs.filter(
      (log) =>
        log.projectName.toLowerCase().includes(text) ||
        log.actorName.toLowerCase().includes(text) ||
        log.targetUserName.toLowerCase().includes(text) ||
        log.action.toLowerCase().includes(text)
    );
    setFilteredLogs(filtered);
  };

  const getActionChipColor = (action) => {
    switch (action) {
      case "CREATED":
        return "success";
      case "ASSIGNED_MANAGER":
        return "primary";
      case "REMOVED_MANAGER":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f7fafc", borderRadius: "8px" }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#2d3748" }}>
        Audit Log
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by project, user, or action..."
        value={searchText}
        onChange={handleSearch}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : filteredLogs.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          No matching audit logs found.
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: "8px" }}>
          <Table sx={{ minWidth: 650 }} aria-label="audit logs table">
            <TableHead sx={{ backgroundColor: "#edf2f7" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Project</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actor</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Target User</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Action</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow
                  key={log.id}
                  sx={{ "&:hover": { backgroundColor: "#f1f5f9" } }}
                >
                  <TableCell>{log.projectName}</TableCell>
                  <TableCell>{log.actorName}</TableCell>
                  <TableCell>{log.targetUserName}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={log.action.replace(/_/g, " ")}
                      color={getActionChipColor(log.action)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AuditLogs;
