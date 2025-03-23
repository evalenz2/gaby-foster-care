import { useState } from "react";
import { Link, useLocation } from "wouter";
import { logoutUser } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="flex items-center justify-center h-16 border-b border-gray-200 px-4">
            <i className="fas fa-paw text-primary text-2xl mr-2"></i>
            <span className="font-bold text-gray-800">Admin Dashboard</span>
          </div>
          <div className="flex flex-col flex-grow overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              <Link href="/admin" className="flex items-center px-2 py-2 text-sm font-medium text-white bg-primary rounded-md group">
                <i className="fas fa-home mr-3 text-white"></i>
                Dashboard
              </Link>
              <Link href="/admin/pet" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md group">
                <i className="fas fa-paw mr-3 text-gray-400 group-hover:text-gray-500"></i>
                Add New Pet
              </Link>
              <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md group">
                <i className="fas fa-users mr-3 text-gray-400 group-hover:text-gray-500"></i>
                Foster Homes
              </a>
              <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md group">
                <i className="fas fa-clipboard-list mr-3 text-gray-400 group-hover:text-gray-500"></i>
                Applications
              </a>
              <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md group">
                <i className="fas fa-cog mr-3 text-gray-400 group-hover:text-gray-500"></i>
                Settings
              </a>
            </nav>
          </div>
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                  <i className="fas fa-user"></i>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <button 
                  onClick={handleLogout}
                  className="text-xs font-medium text-primary hover:text-primary-dark"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="w-full bg-white shadow-sm">
          <div className="h-16 flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center md:hidden">
              <button 
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-64 px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary text-sm"
                />
                <i className="fas fa-search absolute right-3 top-2.5 text-gray-400"></i>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button type="button" className="text-gray-500 hover:text-gray-700 focus:outline-none relative">
                <i className="fas fa-bell text-xl"></i>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
              </button>
              <div className="flex items-center md:hidden">
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                  <i className="fas fa-user text-sm"></i>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Mobile sidebar */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg absolute z-10 inset-x-0 top-16">
            <nav className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/admin" 
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/admin/pet" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Add New Pet
              </Link>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                Foster Homes
              </a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                Applications
              </a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                Settings
              </a>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
              >
                Sign out
              </button>
            </nav>
          </div>
        )}
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
