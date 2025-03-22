import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/api/access_token";
import { useNavigate } from "react-router-dom";
import useQueryStore from "@/store/queryStore";

function Database() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dbEntryId, setDbEntryId] = useState(null);
  const [activeTab, setActiveTab] = useState("host");
  const [dashboardId, setDashboardId] = useState(null);
  const { fetchQueryTitles } = useQueryStore();
  const [formData, setFormData] = useState({
    dbType: "",
    name: "",
    host: "",
    port: "",
    user: "",
    password: "",
    connection_string: "",
    domain: "",
    role: "",
    apikey: "",
  });

  const navigate = useNavigate();
  //changes in form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //change in dropdown for db type
  const handleDbTypeChange = (value) => {
    setFormData({ ...formData, dbType: value });
  };

  //change in dropdown for role type
  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  //handle db submission
  const handleDbSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload =
      activeTab === "host"
        ? {
            db_type: formData.dbType.toLowerCase(),
            db_name: formData.name,
            host: formData.host,
            port: formData.port,
            user: formData.user,
            password: formData.password,
            role: String(formData.role),
            project_id: "57f299e8-67e9-44b1-b4fe-9b3a7b847a0c",
          }
        : {
            db_type: formData.dbType.toLowerCase(),
            connection_string: formData.connection_string,
            role: String(formData.role),
            project_id: "57f299e8-67e9-44b1-b4fe-9b3a7b847a0c",
          };
    console.log("Final Payload:", JSON.stringify(payload, null, 2));

    try {
      const data = await apiRequest(
        "POST",
        `${import.meta.env.VITE_BACKEND_URL}/external-db`,
        payload
      );
      console.log("Database connected successfully:", data);
      alert("Database verified successfully!");
      if (data && data.db_entry_id) {
        setDbEntryId(data.db_entry_id);
      } else {
        throw new Error("db_entry_id missing in response");
      }
      console.log(data.db_entry_id);
      setStep(2);
    } catch (error) {
      setError("Database verification failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const createOrGetDashboard = async () => {
    setLoading(true);
    const payload = {
      db_entry_id: dbEntryId, // Ensure this is correctly assigned
      role_id: formData.role, // Ensure this is correctly assigned
    };

    try {
      const endpoint = `${
        import.meta.env.VITE_BACKEND_URL
      }/execute-query/create-dashboard`;

      // Use apiRequest for consistency
      const data = await apiRequest("POST", endpoint, payload);

      setDashboardId(data.dashboard_id);
      localStorage.setItem("current-dashboard-id", data.dashboard_id);
      console.log("Dashboard created! ID: " + data.dashboard_id);

      return data.dashboard_id;
    } catch (error) {
      console.error("Failed to create dashboard:", error.message || error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  //patch for role and domain
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!dbEntryId) {
      setError(
        "Database entry ID is missing. Please verify your database first."
      );
      setLoading(false);
      return;
    }

    try {
      // First, update the DB entry with domain and API key
      await apiRequest(
        "PATCH",
        `${import.meta.env.VITE_BACKEND_URL}/external-db`,
        {
          domain: formData.domain,
          project_id: "57f299e8-67e9-44b1-b4fe-9b3a7b847a0c",
          apikey: formData.apikey,
          db_entry_id: dbEntryId,
        }
      );

      console.log(
        "Setup completed, fetching queries for dbEntryId:",
        dbEntryId
      );

      // Store role in localStorage
      localStorage.setItem("user-role", formData.role);
      localStorage.setItem("current-db-entry-id", dbEntryId);

      // Create or get dashboard first
      await createOrGetDashboard();

      // Then fetch query titles
      await fetchQueryTitles(dbEntryId);

      alert("Setup Completed!");
      navigate("/Dashboard");
    } catch (error) {
      console.error("Setup failed:", error);
      setError("Setup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDashboards = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const roleId = localStorage.getItem("user-role");
      if (!roleId) {
        throw new Error("Role ID is required to fetch dashboards.");
      }

      const response = await apiRequest(
        "GET",
        `${import.meta.env.VITE_BACKEND_URL}/execute-query/dashboards`,
        null,
        {
          role_id: roleId,
        }
      );

      if (response && Array.isArray(response)) {
        // Transform backend data to match our frontend format if needed
        const formattedDashboards = response.map((dashboard) => ({
          id: dashboard.id,
          name: dashboard.name,
          isActive:
            dashboard.id ===
            (dashboards.find((d) => d.isActive)?.id || response[0].id),
        }));

        // Make sure at least one dashboard is active
        if (
          !formattedDashboards.some((d) => d.isActive) &&
          formattedDashboards.length > 0
        ) {
          formattedDashboards[0].isActive = true;
        }

        setDashboards(formattedDashboards);
      } else {
        // If no dashboards returned, create a default one
        setDashboards([
          { id: "default", name: "Main Dashboard", isActive: true },
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch dashboards:", error);
      setError(error.message || "Failed to fetch dashboards");

      // Fallback to default dashboard if fetch fails
      if (dashboards.length === 0) {
        setDashboards([
          { id: "default", name: "Main Dashboard", isActive: true },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="mt-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
          Hang tight... We're connecting!
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center text-gray-900 mb-4">
          {step === 1 ? "Connect Your Database" : "Setup Domain and API Key"}
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {step === 1 ? (
          <form onSubmit={handleDbSubmit} className="space-y-4">
            <Tabs
              defaultValue="host"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList>
                <TabsTrigger value="host">HOST</TabsTrigger>
                <TabsTrigger value="url">URL</TabsTrigger>
              </TabsList>
              <TabsContent value="host" className="space-y-2">
                <div>
                  <Label>Database Type</Label>
                  <Select onValueChange={handleDbTypeChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select database type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mysql">MySQL</SelectItem>
                      <SelectItem value="postgres">Postgres</SelectItem>
                      {/* <SelectItem value="sqlite">SQLite</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Name</Label>
                  <Input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter database name"
                  />
                </div>
                <div>
                  <Label>Host</Label>
                  <Input
                    name="host"
                    type="text"
                    value={formData.host}
                    onChange={handleChange}
                    placeholder="Enter host"
                  />
                </div>
                <div>
                  <Label>Port</Label>
                  <Input
                    name="port"
                    type="text"
                    value={formData.port}
                    onChange={handleChange}
                    placeholder="Enter port number"
                  />
                </div>
                <div>
                  <Label>User</Label>
                  <Input
                    name="user"
                    type="text"
                    value={formData.user}
                    onChange={handleChange}
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <Label>User Role</Label>
                  <Select onValueChange={handleRoleChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="13ef4ebe-00c4-48b1-a7bb-ad0edf7368aa">
                        Admin
                      </SelectItem>
                      <SelectItem value="f01cc98b-c0f8-4d34-83f5-66e75e0c16ef">
                        Finance
                      </SelectItem>
                      <SelectItem value="d8cf4d90-70ff-4fb5-b93f-8e6accc8056d">
                        Product
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              <TabsContent value="url" className="space-y-2">
                <div>
                  <Label>Database Type</Label>
                  <Select onValueChange={handleDbTypeChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select database type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mysql">MySQL</SelectItem>
                      <SelectItem value="postgres">Postgres</SelectItem>
                      {/* <SelectItem value="sqlite">SQLite</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Connection String</Label>
                  <Input
                    name="connection_string"
                    type="text"
                    value={formData.connection_string}
                    onChange={handleChange}
                    placeholder="Enter your Connection String"
                  />
                </div>
                <div>
                  <Label>User Role</Label>
                  <Select onValueChange={handleRoleChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="13ef4ebe-00c4-48b1-a7bb-ad0edf7368aa">
                        Admin
                      </SelectItem>
                      <SelectItem value="f01cc98b-c0f8-4d34-83f5-66e75e0c16ef">
                        Finance
                      </SelectItem>
                      <SelectItem value="d8cf4d90-70ff-4fb5-b93f-8e6accc8056d">
                        Product
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
            <Button
              type="submit"
              className="w-full bg-[#230C33]"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Database"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div>
              <Label>Domain</Label>
              <Input
                name="domain"
                type="text"
                value={formData.domain}
                onChange={handleChange}
                placeholder="Enter your domain"
              />
            </div>
            <div className="space-y-2">
              <Label className="mb-1 text-lg font-semibold">API Key</Label>
              <p className="text-sm text-gray-500">
                Wish to use your own API key? Go ahead, be the boss!
              </p>
              <Input
                name="apikey"
                type="text"
                value={formData.apikey}
                onChange={handleChange}
                placeholder="Enter your secret 🔑"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-950"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Setting up...</span>
                </div>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

export default Database;
