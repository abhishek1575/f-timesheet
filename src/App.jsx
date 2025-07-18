
import Login from './components/login/Login'
import MDashboard from './components/manager/MDashboard';
import EDashboard from './components/employee/EDashboard';
import CreateTimesheet from './components/component/CreateTimesheet';
import UpdateTimesheet from './components/component/UpdateTimesheet'
import DraftTimesheetTable from './components/component/DraftTimesheetTable';
import ForgotPassword from './components/login/ForgotPassword';
import RegisterForm from './components/login/RegisterForm';
import TeamMemberTable from './components/manager/TeamMemberTable';
import PendingTimesheetDialog from './components/manager/PendingTimesheetDialog';
import ADashboard from './components/Admin/ADashboard';

import ProtectedRoute from '../src/components/utils/ProtectedRoute';
import { Navigate, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/signup" element={<RegisterForm />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["MANAGER"]} />}>
          <Route path="/mdashboard" element={<MDashboard />} />
          <Route path="/create" element={<CreateTimesheet />} />
          <Route path="/draft-timesheets" element={<DraftTimesheetTable />} />
          <Route path="/team-members" element={<TeamMemberTable />} />
          <Route
            path="/approval-requests"
            element={<PendingTimesheetDialog />}
          />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["EMPLOYEE"]} />}>
          <Route path="/edashboard" element={<EDashboard />} />
          <Route path="/create" element={<CreateTimesheet />} />
          <Route path="/draft-timesheets" element={<DraftTimesheetTable />} />
          <Route path="/update-timesheet/:id" element={<UpdateTimesheet />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/adashboard" element={<ADashboard />} />
          <Route path="/team-members" element={<TeamMemberTable mode="ADMIN" />} />
          <Route
            path="/employee-list"
            element={<TeamMemberTable mode="ADMIN" />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
