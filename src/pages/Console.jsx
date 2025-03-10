import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
function Console() {
  return (
    <div>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl m-auto mt-20">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-xl">
              Select Your Organisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Select</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-amber-100">
                <DropdownMenuGroup>
                  <DropdownMenuItem>Webknot</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                  <DropdownMenuItem>Amazon</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                  <DropdownMenuItem>Google</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-xl">
              Your Organisation
            </CardTitle>
          </CardHeader>
        </Card>
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
