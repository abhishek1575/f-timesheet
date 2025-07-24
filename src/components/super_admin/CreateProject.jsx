import React, { useState, useEffect } from "react";
import { createProject } from "../service/superAdminService";
import axios from "axios";
import config from "../config"; // Make sure your config file exports BASE_URL

const CreateProject = () => {
  const [projectName, setProjectName] = useState("");
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [popupMessage, setPopupMessage] = useState(null);

  // Fetch managers when component mounts
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const token = sessionStorage.getItem("Token");
        const response = await axios.get(`${config.BASE_URL}/users/managers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setManagers(response.data); // assuming response.data is an array of managers
      } catch (error) {
        console.error("Error fetching managers:", error);
        setPopupMessage("Failed to fetch managers.");
      }
    };

    fetchManagers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: projectName.trim(),
    };

    try {
      const projectResponse = await createProject(payload);

      if (projectResponse?.success === false) {
        setPopupMessage(projectResponse.message || "Project creation failed");
      } else {
        setPopupMessage(
          `Project "${projectResponse.name}" created successfully!`
        );

        // Assign the manager to the created project
        const assignManagerPayload = {
          projectId: projectResponse.id,
          managerId: selectedManager,
        };

        // Assuming you have an API for assigning the manager to the project
        const assignManagerResponse = await axios.put(
          `${config.BASE_URL}/projects/${projectResponse.id}/assign-manager/${selectedManager}`,
          assignManagerPayload,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (assignManagerResponse?.data?.success === false) {
          setPopupMessage("Failed to assign manager.");
        } else {
          setPopupMessage(`Manager assigned successfully!`);
        }

        // Optional: Clear form fields
        setProjectName("");
        setSelectedManager("");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setPopupMessage(err.response.data.message);
      } else {
        setPopupMessage("Something went wrong while creating the project");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Create Project</h2>

      {popupMessage && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded mb-4 shadow">
          {popupMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Project Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Select Manager</label>
          <select
            className="w-full px-3 py-2 border rounded"
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value)}
            required
          >
            <option value="">-- Select Manager --</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Create Project
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
