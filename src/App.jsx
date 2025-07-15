import { Navigate, Route, Routes } from 'react-router-dom'
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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/mdashboard" element={<MDashboard />} />
        <Route path="/edashboard" element={<EDashboard />} />
        <Route path="/adashboard" element={<ADashboard />} />
        <Route path="/create" element={<CreateTimesheet />} />
        <Route path="/draft-timesheets" element={<DraftTimesheetTable />} />
        <Route path="/update-timesheet/:id" element={<UpdateTimesheet />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/signup" element={<RegisterForm />} />
        <Route path="/team-members" element={<TeamMemberTable />} />
        <Route path='/approval-requests' element={<PendingTimesheetDialog />} />
      </Routes>
    </>
  );
}

export default App
