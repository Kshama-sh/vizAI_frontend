import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(localStorage.getItem("login") === "true");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 shadow-md flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold">
        VizAI
      </Link>

      {/* Menu for Logged-in Users */}
      {loggedIn ? (
        <div className="flex items-center gap-6">
          <Link to="/">Query</Link>
          <Link to="/">Visualisation</Link>
          <Link to="/">Dashboard</Link>
          <Link to="/">Console</Link>

          {/* Notification Icon */}
          <Bell className="text-xl cursor-pointer" />

          {/* Profile Dropdown using ShadCN */}
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <User className="text-2xl" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile">Account Details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/docs">Documentation</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex gap-4">
          <Button variant="outline">
            <Link to="/Login">Login</Link>
          </Button>
          <Button>
            <Link to="/Signup">Signup</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
