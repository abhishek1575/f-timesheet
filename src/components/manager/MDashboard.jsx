import { useState, useEffect } from "react";
import CustomizedTables from "../component/CustomizedTables";
import MNavbar from "./MNavbar";
import { getAllTimesheets } from "../../service/timesheetService";
import { Box, Container, CssBaseline } from "@mui/material";

export default function MDashboard() {
  const [timesheets, setTimesheets] = useState([]);

  const fetchTimesheets = async () => {
    try {
      const managerId = sessionStorage.getItem("UserId");
      if (!managerId) return;
      const data = await getAllTimesheets(managerId);
      setTimesheets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching manager timesheets:", error);
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const handleTimesheetCreated = async () => {
    await fetchTimesheets(); // refresh after new timesheet is created
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <CssBaseline />
      <MNavbar onTimesheetCreated={handleTimesheetCreated} />
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <CustomizedTables timesheets={timesheets} />
      </Container>
    </Box>
  );
}

// import CustomizedTables from "../component/CustomizedTables";
// import MNavbar from "./MNavbar";

// export default function MDashboard() {
//   return (
//     <>
//       <MNavbar />
//       <CustomizedTables />
//     </>
//   );
// }
