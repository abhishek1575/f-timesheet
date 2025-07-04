import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import MDashboard from './components/MDashboard';
import EDashboard from './components/EDashboard';
import CreateTimesheet from './components/CreateTimesheet';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={ <Navigate to="/Login" />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/mdashboard" element={<MDashboard />} />
        <Route path="/edashboard" element={<EDashboard />} />
        <Route path="/create" element={<CreateTimesheet/>} />

      </Routes>
    </>
  );
}

export default App
