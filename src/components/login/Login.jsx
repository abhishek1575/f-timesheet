import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../service/AuthService";
import {
  Snackbar,
  Alert,
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Link,
} from "@mui/material";
import bgImage from "../../assets/office-background.jpg";
import logo from "../../assets/image.png"; // Assuming this is the correct path for the logo

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const response = await AuthService.login(normalizedEmail, password);
      if (response.data.jwt) {
        sessionStorage.setItem("token", response.data.jwt);
        sessionStorage.setItem("Role", response.data.role);
        sessionStorage.setItem("isLoggedIn", "true");
        setError("");
        setShowError(false);
        switch (response.data.role) {
          case "EMPLOYEE":
            navigate("/edashboard");
            break;
          case "MANAGER":
            navigate("/mdashboard");
            break;
          case "ADMIN":
            navigate("/adashboard");
            break;
          default:
            throw new Error("Unknown role");
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password");
      setShowError(true);
    }
  };

  const handleSnackbarClose = () => {
    setShowError(false);
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      <Container maxWidth="xs">
        <Box
          sx={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            padding: "40px",
            borderRadius: "16px",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            textAlign: "center",
          }}
        >
          <img
            src={logo}
            alt="Ceinsys Logo"
            style={{ width: "200px", height: "35px", marginBottom: "20px" }}
          />
          <Typography component="h1" variant="h5" sx={{ color: "#084298", mb: 2 }}>
            Welcome to Ceinsys
          </Typography>
          <Typography component="h2" variant="h6" sx={{ mb: 3 }}>
            Login Here
          </Typography>
          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, background: "#333", '&:hover': { background: '#555' } }}
            >
              Get Started
            </Button>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
              <Link href="/forgotpassword" variant="body2">
                Forgot password?
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;
