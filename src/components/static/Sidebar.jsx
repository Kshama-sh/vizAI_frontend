import React, { useState } from "react";
import useQueryStore from "@/store/queryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Sidebar() {
  const { dashboards, activeDashboard, setActiveDashboard, addDashboard } =
    useQueryStore();
  const [newDashboardName, setNewDashboardName] = useState("");

  const handleAddDashboard = () => {
    if (newDashboardName.trim() !== "") {
      addDashboard(newDashboardName);
      setNewDashboardName("");
    }
  };

  return (
    <div className="w-64 h-screen bg-gray-100 p-4 border-r">
      <h2 className="text-lg font-semibold mb-4">Dashboards</h2>
      <div className="mb-4">
        {Object.entries(dashboards).map(([id, dashboard]) => (
          <button
            key={id}
            onClick={() => setActiveDashboard(id)}
            className={`block w-full text-left px-3 py-2 rounded-md ${
              activeDashboard === id
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {dashboard.name}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="New Dashboard"
          value={newDashboardName}
          onChange={(e) => setNewDashboardName(e.target.value)}
        />
        <Button
          onClick={handleAddDashboard}
          className="bg-green-500 text-white"
        >
          +
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
