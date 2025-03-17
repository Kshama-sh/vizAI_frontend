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
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("login") === "true"
  );
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      setLoggedIn(localStorage.getItem("login") === "true");
    };

    checkLoginStatus();

    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
    window.dispatchEvent(new Event("storage"));
    navigate("/Login");
  };

  return (
    <nav className="bg-[#420039] text-gray-900 px-4 py-3 shadow-md flex justify-between items-center">
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
        <SheetContent>
          <div className="flex flex-col p-7 gap-4 mt-5">
            {loggedIn ? (
              <>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600">
                  <Link to="/Query">Query</Link>
                </Button>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600">
                  <Link to="/Visualisation">Visualisation</Link>
                </Button>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600">
                  <Link to="/Dashboard">Dashboard</Link>
                </Button>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600">
                  <Link to="/Database">Console</Link>
                </Button>
                <Button onClick={handleLogout} className="bg-red-500">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button className="bg-blue-950">
                  <Link to="/Login">Login</Link>
                </Button>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600">
                  <Link to="/Signup">Signup</Link>
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <NavigationMenu className="lg:flex hidden">
        <NavigationMenuList className="flex gap-6 text-white font-bold">
          {loggedIn ? (
            <>
              <NavigationMenuItem>
                <Link to="/Query">Query</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/Visualisation">Visualisation</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/Dashboard">Dashboard</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/Database">Console</Link>
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
              <Button className="bg-gradient-to-r from-pink-700 to-purple-700">
                <Link to="/Login">Login</Link>
              </Button>
              <Button className="bg-gradient-to-r from-pink-700 to-purple-700">
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
