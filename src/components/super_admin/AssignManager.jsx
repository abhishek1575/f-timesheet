import React, { useState } from 'react';

const AssignManager = () => {
  const [projectId, setProjectId] = useState('');
  const [managerId, setManagerId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle assign manager logic here
    console.log({ projectId, managerId });
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Assign Manager to Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Project ID</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Manager ID</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Assign Manager
        </button>
      </form>
    </div>
  );
};

export default AssignManager;