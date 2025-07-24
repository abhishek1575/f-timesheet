import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Paper
} from '@mui/material';
import {
  AddCircleOutline,
  AssignmentInd,
  PersonAdd,
  Folder,
  Plagiarism as AuditIcon
} from '@mui/icons-material';
import CreateProjectModal from './CreateProjectModal';
import AssignManagerModal from './AssignManagerModal';
import AddMemberModal from './AddMemberModal';

const FeatureCard = ({ icon, title, description, onClick }) => (
  <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
    <Card component={Paper} elevation={3} sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={onClick} sx={{ flexGrow: 1, p: 2, textAlign: 'center' }}>
        <CardContent>
          {icon}
          <Typography variant="h5" component="div" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  </Grid>
);

const SDashboard = () => {
  const [isCreateProjectModalOpen, setCreateProjectModalOpen] = useState(false);
  const [isAssignManagerModalOpen, setAssignManagerModalOpen] = useState(false);
  const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const navigate = useNavigate();

  const iconStyles = { fontSize: 50, color: 'primary.main' };

  const features = [
    {
      title: 'Create Project',
      description: 'Start a new project and define its initial parameters.',
      icon: <AddCircleOutline sx={iconStyles} />,
      action: () => setCreateProjectModalOpen(true),
    },
    {
      title: 'Assign Manager',
      description: 'Assign a manager to an existing project.',
      icon: <AssignmentInd sx={{...iconStyles, color: 'success.main'}} />,
      action: () => setAssignManagerModalOpen(true),
    },
    {
      title: 'Add Member',
      description: 'Add a new team member to a project.',
      icon: <PersonAdd sx={{...iconStyles, color: 'secondary.main'}}/>,
      action: () => setAddMemberModalOpen(true),
    },
    {
      title: 'View All Projects',
      description: 'See a list of all projects and their details.',
      icon: <Folder sx={{...iconStyles, color: 'warning.main'}}/>,
      action: () => navigate('/sdashboard/projects'),
    },
    {
      title: 'Audit Logs',
      description: 'Review all project-related activities and changes.',
      icon: <AuditIcon sx={{...iconStyles, color: 'error.main'}}/>,
      action: () => navigate('/sdashboard/audit-logs'),
    },
  ];

  return (
    <>
      <Box sx={{ flexGrow: 1, p: 4, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: '#1a237e' }}>
            Super Admin Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 5 }}>
            Manage projects, users, and system settings with ease.
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                onClick={feature.action}
              />
            ))}
          </Grid>
        </Container>
      </Box>

      <CreateProjectModal
        open={isCreateProjectModalOpen}
        onClose={() => setCreateProjectModalOpen(false)}
      />
      <AssignManagerModal
        open={isAssignManagerModalOpen}
        onClose={() => setAssignManagerModalOpen(false)}
      />
      <AddMemberModal
        open={isAddMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
      />
    </>
  );
};

export default SDashboard;