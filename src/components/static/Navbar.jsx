import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLoggedIn(localStorage.getItem("login") === "true");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 shadow-md flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        <img
          src={logo}
          alt="VizAI Logo"
          className="h-8 w-auto sm:h-10 md:h-12 lg:h-14 xl:h-16"
        />
      </Link>

      <Sheet>
        <SheetTrigger asChild>
          <button className="lg:hidden block text-white text-2xl">
            <Menu />
          </button>
        </SheetTrigger>
        <SheetContent className={""}>
          <div className="flex flex-col p-7 gap-4 mt-5">
            <Button className="bg-blue-950">
              <Link to="/Login">Login</Link>
            </Button>
            <Button className="bg-blue-950">
              <Link to="/Signup">Signup</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <NavigationMenu
        className={`lg:flex ${
          menuOpen ? "block" : "hidden"
        } absolute top-16 right-0 w-full bg-gray-900 lg:static lg:w-auto`}
      >
        <NavigationMenuList className="flex gap-6">
          {loggedIn ? (
            <>
              <NavigationMenuItem>
                <Link to="/" className="hover:text-gray-400">
                  Query
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/" className="hover:text-gray-400">
                  Visualisation
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/" className="hover:text-gray-400">
                  Dashboard
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/" className="hover:text-gray-400">
                  Console
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Bell className="text-xl cursor-pointer" />
              </NavigationMenuItem>

              <NavigationMenuItem>
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
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-500"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </NavigationMenuItem>
            </>
          ) : (
            <div className="flex gap-4">
              <Button className="bg-blue-950">
                <Link to="/Login">Login</Link>
              </Button>
              <Button className="bg-blue-950">
                <Link to="/Signup">Signup</Link>
              </Button>
            </div>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
export default Navbar;
