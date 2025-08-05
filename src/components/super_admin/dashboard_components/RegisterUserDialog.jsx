import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';
import config from '../../../service/config';

// This component now handles user registration internally.
// The onRegister prop has been changed to onRegistrationSuccess and is called on success.
const RegisterUserDialog = ({ open, onClose, onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@cstech\.ai$/i;

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Email should end with @cstech.ai';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.role) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      managerId: null,
    };

    try {
      await axios.post(`${config.BASE_URL}auth/register`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      setSuccessMsg(`${formData.role} registered successfully`);
      setShowSuccess(true);

      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
      });

      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      }
      // Automatically close dialog on success after a short delay to show message
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Registration failed', error);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      setErrorMsg(message);
      setShowError(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSuccess(false);
    setShowError(false);
  };

  return (
    <>
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {successMsg}
        </Alert>
      </Snackbar>
      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Register New User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            margin="dense"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            margin="dense"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            margin="dense"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
          <FormControl fullWidth margin="dense" error={!!errors.role}>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
              <MenuItem value="MANAGER">MANAGER</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="SUPER_ADMIN">SUPER_ADMIN</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Register</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RegisterUserDialog;