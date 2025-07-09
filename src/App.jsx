import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import MDashboard from './components/MDashboard';
import EDashboard from './components/EDashboard';
import CreateTimesheet from './components/CreateTimesheet';
import UpdateTimesheet from './components/UpdateTimesheet';
import DraftTimesheetTable from './components/DraftTimesheetTable';
import ForgotPassword from './components/ForgotPassword';
import RegisterForm from './components/RegisterForm';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/mdashboard" element={<MDashboard />} />
        <Route path="/edashboard" element={<EDashboard />} />
        <Route path="/create" element={<CreateTimesheet />} />
        <Route path="/draft-timesheets" element={<DraftTimesheetTable />} />
        <Route path="/update-timesheet/:id" element={<UpdateTimesheet />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/signup" element={<RegisterForm />} />
      </Routes>
    </>
  );
}

export default App
