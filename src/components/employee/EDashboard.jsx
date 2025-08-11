import { useState, useEffect } from "react";
import CustomizedTables from "../component/CustomizedTables";
import Navbar from "./Navbar";
import { getAllTimesheets } from "../../service/timesheetService";
import { Box, CssBaseline, Container } from "@mui/material";

export default function EDashboard() {
  const [timesheets, setTimesheets] = useState([]);

  const fetchTimesheets = async () => {
    try {
      const userId = sessionStorage.getItem("UserId");
      if (!userId) return;
      const data = await getAllTimesheets(userId);
      setTimesheets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const handleTimesheetCreated = async () => {
    await fetchTimesheets();
  };

  return (
    <Box sx={{ height: "100vh", overflow: "hidden", bgcolor: "#f5f5f5" }}>
      <CssBaseline />
      <Navbar onTimesheetCreated={handleTimesheetCreated} />

      <Box
        sx={{
          height: "100%",
          pt: { xs: "56px", sm: "64px" },
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <CustomizedTables timesheets={timesheets} />
        </Container>
      </Box>
    </Box>
  );
}
// import { useState, useEffect } from "react";
// import CustomizedTables from "../component/CustomizedTables";
// import Navbar from "./Navbar";
// import { getAllTimesheets } from "../../service/timesheetService";
// import { Box, Container, CssBaseline } from "@mui/material";

// export default function EDashboard() {
//   const [timesheets, setTimesheets] = useState([]);

//   const fetchTimesheets = async () => {
//     try {
//       const userId = sessionStorage.getItem("UserId");
//       if (!userId) return;
//       const data = await getAllTimesheets(userId);
//       setTimesheets(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Error fetching timesheets:", error);
//     }
//   };

//   useEffect(() => {
//     fetchTimesheets();
//   }, []);

//   const handleTimesheetCreated = async () => {
//     await fetchTimesheets(); // refresh data after create
//   };

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
//       <CssBaseline />
//       <Navbar onTimesheetCreated={handleTimesheetCreated} />
//       <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
//         <CustomizedTables timesheets={timesheets} />
//       </Container>
//     </Box>
//   );
// }

// import CustomizedTables from "../component/CustomizedTables";
// import Navbar from "./Navbar";

// export default function ADashboard() {
//   return (
//     <>
//       <Navbar />
//       <CustomizedTables />
//     </>
//   );
// }
