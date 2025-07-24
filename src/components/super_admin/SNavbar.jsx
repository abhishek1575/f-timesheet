import React from 'react';
import { NavLink } from 'react-router-dom';

const SNavbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <div className="text-white text-lg font-bold">
          <NavLink to="/sdashboard">Super Admin</NavLink>
        </div>
        <div className="flex space-x-4">
          <NavLink to="/sdashboard/create-project" className="text-gray-300 hover:text-white">Create Project</NavLink>
          <NavLink to="/sdashboard/assign-manager" className="text-gray-300 hover:text-white">Assign Manager</NavLink>
          <NavLink to="/sdashboard/add-member" className="text-gray-300 hover:text-white">Add Member</NavLink>
          <NavLink to="/sdashboard/projects" className="text-gray-300 hover:text-white">View Projects</NavLink>
          <NavLink to="/sdashboard/audit-logs" className="text-gray-300 hover:text-white">Audit Logs</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default SNavbar;