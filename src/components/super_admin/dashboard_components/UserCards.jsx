import React from 'react';
import { Grid, Card, CardContent, CardActions, Typography, Box, Chip, IconButton } from '@mui/material';
import { MoreVert } from '@mui/icons-material';

const UserCards = ({ users, onMenuClick }) => (
  <Grid container spacing={2}>
    {users.map((user) => (
      <Grid item xs={12} sm={6} key={user.id}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6">{user.name}</Typography>
            <Typography color="textSecondary">{user.email}</Typography>
            <Box mt={1}>
              <Chip label={user.role} size="small" />
            </Box>
            <Typography mt={1}>
              Manager: {user.managerName || 'N/A'}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <IconButton onClick={(e) => onMenuClick(e, user)}>
              <MoreVert />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export default UserCards;
