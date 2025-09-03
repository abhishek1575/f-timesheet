
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// // Vite config
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     host: "0.0.0.0",
//     port: 5174,
//     strictPort: true,
//   },
//   optimizeDeps: {
//     exclude: ["@mui/icons-material"], // prevent bundling all icons at once
//   },
//   build: {
//     // Generate smaller chunks instead of loading too many files at once
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           mui: ["@mui/material", "@mui/icons-material"],
//           xlsx: ["xlsx"],
//         },
//       },
//     },
//   },
// });



import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0", // Listen on all network interfaces
    port: 5174, // Keep default port or change if needed
    strictPort: true,
  },
});
