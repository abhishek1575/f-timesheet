import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  TableContainer,
  Paper,
  Box,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const getStatusChipColor = (status) => {
  switch (status) {
    case 'APPROVED':
      return 'success';
    case 'REJECTED':
      return 'error';
    case 'DRAFT':
      return 'warning';
    default:
      return 'default';
  }
};

const TimesheetDialog = ({ open, onClose, timesheets, user }) => {
  const approvedTimesheets = timesheets.filter((sheet) => sheet.status === 'APPROVED');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', mb: 2 }}>
        <Typography variant="h6" component="div">
          {user?.name}'s Approved Timesheets
        </Typography>
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 650 }} aria-label="timesheet table">
            <TableHead sx={{ backgroundColor: (theme) => theme.palette.grey[200] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Project Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Task Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Effort (hrs)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Approved By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {approvedTimesheets.length > 0 ? (
                approvedTimesheets.map((sheet, i) => (
                  <StyledTableRow key={i}>
                    <TableCell>{sheet.projectName || '-'}</TableCell>
                    <TableCell>{sheet.taskName || '-'}</TableCell>
                    <TableCell>{sheet.startDate || '-'}</TableCell>
                    <TableCell>{sheet.endDate || '-'}</TableCell>
                    <TableCell>{sheet.effort || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={sheet.status}
                        size="small"
                        color={getStatusChipColor(sheet.status)}
                      />
                    </TableCell>
                    <TableCell>{sheet.approverName || 'N/A'}</TableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box sx={{ p: 3 }}>
                      <Typography variant="body1">
                        No approved timesheets found.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TimesheetDialog;
