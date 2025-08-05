import React from 'react';
import { Grid, Card, CardContent, Skeleton, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const LoadingSkeleton = ({ isMobile }) => {
  if (isMobile) {
    return (
      <Grid container spacing={2}>
        {[...Array(4)].map((_, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <Card elevation={2}>
              <CardContent>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="rectangular" height={20} width="40%" sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          {[...Array(6)].map((_, i) => <TableCell key={i}><Skeleton /></TableCell>)}
        </TableRow>
      </TableHead>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            {[...Array(6)].map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LoadingSkeleton;
