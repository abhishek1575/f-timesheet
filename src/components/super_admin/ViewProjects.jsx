import React, { useState, useEffect } from 'react';

const ViewProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch all projects logic here
    const fetchedProjects = [
      {
        "id": 1,
        "name": "PEPS",
        "managerId": 2,
        "managerName": "Manager",
        "teamMemberIds": [3],
        "teamMemberNames": ["Employee"]
      },
      {
        "id": 4,
        "name": "ADAS",
        "managerId": 2,
        "managerName": "Manager",
        "teamMemberIds": [],
        "teamMemberNames": []
      },
      {
        "id": 5,
        "name": "TEST",
        "managerId": null,
        "managerName": null,
        "teamMemberIds": [],
        "teamMemberNames": []
      }
    ];
    setProjects(fetchedProjects);
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">All Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => (
          <div key={project.id} className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">{project.name}</h3>
            <p><strong>Manager:</strong> {project.managerName || 'N/A'}</p>
            <p><strong>Team:</strong> {project.teamMemberNames.join(', ') || 'No members'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewProjects;