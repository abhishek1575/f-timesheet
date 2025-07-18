import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
// import CustomizedTables from "./components/CustomizedTables.jsx";
// import CreateTimesheet from "./components/CreateTimesheet.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      {/* <CustomizedTables /> */}
      {/* <CreateTimesheet /> */}
      {/* <UserProfileDialog/> */}
    </BrowserRouter>
  </StrictMode>
);
