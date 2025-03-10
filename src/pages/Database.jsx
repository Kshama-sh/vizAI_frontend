import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
function Database() {
  return (
    <div>
      <Card className="w-full max-w-md bg-white p-6 rounded-lg shadow-md m-auto mt-20">
        <h2 className="text-xl font-semibold text-center text-gray-900 mb-4">
          Connect Your Database
        </h2>
        <form className="mt-6 w-full max-w-sm">
          <Label className="flex text-gray-700 font-medium flex-start">
            Database Type
          </Label>
          <Select>
            <SelectTrigger className="w-full p-3 mb-3 border border-gray-300 rounded-lg">
              <SelectValue placeholder="Select database type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mysql">MySQL</SelectItem>
              <SelectItem value="postgres">Postgres</SelectItem>
              <SelectItem value="sqlite">SQLite</SelectItem>
            </SelectContent>
          </Select>
          <Label className="flex text-gray-700 font-medium flex-start">
            Name
          </Label>
          <Input
            type="text"
            placeholder="Enter database Name"
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
          />
          <Label className="flex text-gray-700 font-medium flex-start">
            Host
          </Label>
          <Input
            type="text"
            placeholder="Enter Host"
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
          />
          <Label className="flex text-gray-700 font-medium flex-start">
            Port
          </Label>
          <Input
            type="text"
            placeholder="Enter Port number"
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
          />
          <Label className="flex text-gray-700 font-medium flex-start">
            User
          </Label>
          <Input
            type="text"
            placeholder="Enter your Username"
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
          />
          <Label className="flex text-gray-700 font-medium flex-start">
            Password
          </Label>
          <Input
            type="password"
            placeholder="Enter your Password"
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
          />
          <Button
            type="submit"
            className="w-full bg-blue-950 text-white py-3 rounded-lg transition"
          >
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
}
export default Database;
