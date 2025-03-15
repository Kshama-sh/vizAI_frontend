import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/api/access_token";

function Database() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("url");
  const [formData, setFormData] = useState({
    dbType: "",
    dbName: "",
    host: "",
    port: "",
    user: "",
    password: "",
    connection_string: "",
    domain: "",
    userRole: "",
    apikey: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDbTypeChange = (value) => {
    setFormData({ ...formData, dbType: value });
  };

  const handleRoleChange = (value) => {
    setFormData({ ...formData, userRole: value });
  };

  const handleDbSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload =
      activeTab === "url"
        ? {
            dbType: formData.dbType,
            dbName: formData.dbName,
            host: formData.host,
            port: formData.port,
            user: formData.user,
            password: formData.password,
          }
        : {
            db_type: formData.dbType,
            // dbName: formData.dbName,
            connection_string: formData.connection_string,
            project_id: 1,
            api_key: "",
            domain: "Metro service",
            // project_id: 1,
            // connection_string:
            //   "mysql+pymysql://root:password@localhost:3306/classicmodels",
            // domain: "Metro service",
            // db_type: "postgres",
            // api_key: "",
          };

    try {
      const data = await apiRequest(
        "POST",
        "http://192.168.1.20:8000/external-db",
        payload
      );
      console.log("Database connected successfully:", data);
      alert("Database verified successfully!");
      setStep(2);
    } catch (error) {
      setError("Database verification failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest(
        "PATCH",
        "http://192.168.1.20:8000/external-db",
        {
          domain: formData.domain,
          // userRole: formData.userRole,
          // apikey: formData.apikey,
          db_entry_id: 1,
        }
      );

      alert("Setup Completed!");
      console.log("Setup success:", data);
    } catch (error) {
      setError("Setup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center text-gray-900 mb-4">
          {step === 1 ? "Connect Your Database" : "Setup Domain & Role"}
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {step === 1 ? (
          <form onSubmit={handleDbSubmit} className="space-y-4">
            <Tabs
              defaultValue="url"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList>
                <TabsTrigger value="url">HOST</TabsTrigger>
                <TabsTrigger value="uri">URL</TabsTrigger>
              </TabsList>
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
                      <SelectItem value="sqlite">SQLite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Name</Label>
                  <Input
                    name="dbName"
                    type="text"
                    value={formData.dbName}
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
              </TabsContent>
              <TabsContent value="uri" className="space-y-2">
                <div>
                  <Label>Database Type</Label>
                  <Select onValueChange={handleDbTypeChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select database type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mysql">MySQL</SelectItem>
                      <SelectItem value="postgres">Postgres</SelectItem>
                      <SelectItem value="sqlite">SQLite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Name</Label>
                  <Input
                    name="dbName"
                    type="text"
                    value={formData.dbName}
                    onChange={handleChange}
                    placeholder="Enter database name"
                  />
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
              </TabsContent>
            </Tabs>
            <Button
              type="submit"
              className="w-full bg-blue-950"
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
            <div>
              <Label>User Role</Label>
              <Select onValueChange={handleRoleChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                </SelectContent>
              </Select>
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
              {loading ? "Setting up..." : "Complete Setup"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

export default Database;
