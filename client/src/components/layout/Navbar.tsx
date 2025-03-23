import { useState } from "react";
import { Link, useLocation } from "wouter";
import { getAuth } from "firebase/auth";
import { logoutUser } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Logged out successfully",
        variant: "default",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Failed to log out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <i className="fas fa-paw text-primary text-3xl mr-2"></i>
              <span className="font-bold text-xl text-gray-800">Gaby Foster Care</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-primary">Home</Link>
            <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-primary">About</Link>
            <Link href="/contact" className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-primary">Contact</Link>
            {user ? (
              <>
                <Link href="/admin" className="px-3 py-2 rounded-md text-sm font-medium text-primary hover:text-primary-dark">Dashboard</Link>
                <button 
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="px-3 py-2 rounded-md text-sm font-medium text-primary hover:text-primary-dark">Admin Login</Link>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900">Home</Link>
            <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900">About</Link>
            <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900">Contact</Link>
            {user ? (
              <>
                <Link href="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-primary-dark">Dashboard</Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-primary-dark">Admin Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
