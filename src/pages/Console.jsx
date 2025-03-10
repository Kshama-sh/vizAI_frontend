import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
function Console() {
  return (
    <div>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl m-auto mt-20">
        <Card>
          <CardTitle className="font-bold text-xl">
            Choose Organisation
          </CardTitle>
          <Select>
            <SelectTrigger className="w-full p-3 mb-3 border border-gray-300 rounded-lg">
              <SelectValue placeholder="Select your organisation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mysql">Webknot</SelectItem>
              <SelectItem value="postgres">Google</SelectItem>
              <SelectItem value="sqlite">Amazon</SelectItem>
            </SelectContent>
          </Select>
        </Card>
        {/* <Card>
          <CardHeader>
            <CardTitle className="font-bold text-xl">
              Your Organisation
            </CardTitle>
          </CardHeader>
        </Card> */}
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-xl">Invites</CardTitle>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}
export default Console;
