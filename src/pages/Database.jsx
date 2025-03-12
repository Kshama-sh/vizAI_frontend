import React, { useState } from "react";
import axios from "axios";
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
    uri: "",
    domain: "",
    userRole: "",
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
            dbType: formData.dbType,
            dbName: formData.dbName,
            connection_string: formData.connection_string,
          };

    try {
      const response = await axios.post(
        /////////
        "http://",
        payload
      );

      if (response.data.success) {
        alert("Database verified successfully!");
        setStep(2);
      } else {
        setError("Database verification failed. Please check your details.");
      }
    } catch (error) {
      setError("Error connecting to the database. Please try again.");
      console.error("Database verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        /////////
        "http://",
        {
          domain: formData.domain,
          userRole: formData.userRole,
        }
      );

      if (response.data.success) {
        alert("Setup Completed!");
      } else {
        setError("Setup failed. Please try again.");
      }
    } catch (error) {
      setError("Error in final setup. Please try again.");
      console.error("Final submission error:", error);
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
              className="w-[400px]"
              onValueChange={setActiveTab}
            >
              <TabsList>
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="uri">URI</TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="space-y-2">
                <div>
                  <Label className="mb-1">Database Type</Label>
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
                  <Label className="mb-1">Name</Label>
                  <Input
                    name="dbName"
                    type="text"
                    value={formData.dbName}
                    onChange={handleChange}
                    placeholder="Enter database name"
                  />
                </div>
                <div>
                  <Label className="mb-1">Host</Label>
                  <Input
                    name="host"
                    type="text"
                    value={formData.host}
                    onChange={handleChange}
                    placeholder="Enter host"
                  />
                </div>
                <div>
                  <Label className="mb-1">Port</Label>
                  <Input
                    name="port"
                    type="text"
                    value={formData.port}
                    onChange={handleChange}
                    placeholder="Enter port number"
                  />
                </div>
                <div>
                  <Label className="mb-1">User</Label>
                  <Input
                    name="user"
                    type="text"
                    value={formData.user}
                    onChange={handleChange}
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <Label className="mb-1">Password</Label>
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
                  <Label className="mb-1">Database Type</Label>
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
                  <Label className="mb-1">Name</Label>
                  <Input
                    name="dbName"
                    type="text"
                    value={formData.dbName}
                    onChange={handleChange}
                    placeholder="Enter database name"
                  />
                </div>
                <div>
                  <Label className="mb-1">Connection String</Label>
                  <Input
                    name="connection_string"
                    type="text"
                    value={formData.uri}
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
              <Label className="mb-1">Domain</Label>
              <Input
                name="domain"
                type="text"
                value={formData.domain}
                onChange={handleChange}
                placeholder="Enter your domain"
              />
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

export default Database;
