import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Train, User, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface NavbarProps {
  isLoggedIn?: boolean;
  userName?: string;
}

const Navbar = ({ isLoggedIn, userName = "Guest" }: NavbarProps) => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const isAuthenticated = isLoggedIn || !!user;
  const displayName = userName || profile?.full_name || "User";

  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2">
          <Train className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Uganda Railways</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-primary font-medium">
            Home
          </Link>
          <Link
            to="/bookings"
            className="text-gray-700 hover:text-primary font-medium"
          >
            My Bookings
          </Link>
          <Link
            to="/schedules"
            className="text-gray-700 hover:text-primary font-medium"
          >
            Schedules
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-primary font-medium"
          >
            About Us
          </Link>
        </nav>

        {/* User Authentication */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage
                      src={
                        profile?.avatar_url ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`
                      }
                      alt={displayName}
                    />
                    <AvatarFallback>
                      {displayName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{displayName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link to="/profile" className="w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/bookings" className="w-full">
                    My Bookings
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem>
                    <Link to="/admin" className="w-full flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => signOut()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link to="/" className="w-full">
                    Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/bookings" className="w-full">
                    My Bookings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/schedules" className="w-full">
                    Schedules
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/about" className="w-full">
                    About Us
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
