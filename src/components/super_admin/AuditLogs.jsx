import React, { useState, useEffect } from 'react';

const AuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    // Fetch audit logs logic here
    const fetchedLogs = [
      {
        "id": 1,
        "projectId": 5,
        "projectName": "TEST",
        "actorId": 1,
        "actorName": "Super Admin",
        "targetUserId": 1,
        "targetUserName": "Super Admin",
        "action": "CREATED",
        "timestamp": "2025-07-23T18:51:12.856018"
      },
      {
        "id": 2,
        "projectId": 4,
        "projectName": "ADAS",
        "actorId": 1,
        "actorName": "Super Admin",
        "targetUserId": 4,
        "targetUserName": "Manager2",
        "action": "ASSIGNED_MANAGER",
        "timestamp": "2025-07-23T19:00:21.6082"
      },
      {
        "id": 3,
        "projectId": 4,
        "projectName": "ADAS",
        "actorId": 1,
        "actorName": "Super Admin",
        "targetUserId": 4,
        "targetUserName": "Manager2",
        "action": "REMOVED_MANAGER",
        "timestamp": "2025-07-23T19:06:29.443472"
      },
      {
        "id": 4,
        "projectId": 4,
        "projectName": "ADAS",
        "actorId": 1,
        "actorName": "Super Admin",
        "targetUserId": 2,
        "targetUserName": "Manager",
        "action": "ASSIGNED_MANAGER",
        "timestamp": "2025-07-23T19:06:29.462985"
      }
    ];
    setAuditLogs(fetchedLogs);
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Audit Logs</h2>
      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Project</th>
              <th className="py-3 px-6 text-left">Actor</th>
              <th className="py-3 px-6 text-left">Target User</th>
              <th className="py-3 px-6 text-center">Action</th>
              <th className="py-3 px-6 text-center">Timestamp</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {auditLogs.map(log => (
              <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{log.projectName}</td>
                <td className="py-3 px-6 text-left">{log.actorName}</td>
                <td className="py-3 px-6 text-left">{log.targetUserName}</td>
                <td className="py-3 px-6 text-center">{log.action}</td>
                <td className="py-3 px-6 text-center">{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;