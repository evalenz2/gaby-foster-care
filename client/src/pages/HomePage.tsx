import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FilterSection from "@/components/home/FilterSection";
import PetGrid from "@/components/home/PetGrid";
import { Button } from "@/components/ui/button";
import { filterPets, getAllPets } from "@/lib/firebase";

const HomePage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);
  
  // Query for fetching all pets or filtered pets
  const { data: pets = [], isLoading } = useQuery({
    queryKey: ["pets", filters],
    queryFn: async () => {
      // If there are filters, use filterPets function
      if (Object.keys(filters).length > 0) {
        return await filterPets(filters);
      }
      // Otherwise get all pets
      return await getAllPets();
    }
  });

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-primary bg-opacity-5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Companion</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">Browse our available pets and give them a loving forever home. Every pet deserves a family.</p>
          <div className="flex justify-center">
            <Button 
              onClick={() => {
                // Scroll to the pets section
                document.getElementById('pets-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center bg-primary hover:bg-primary-dark"
            >
              <i className="fas fa-search mr-2"></i> Find Pets
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="pets-section" className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex-grow">
        {/* Mobile filter toggle */}
        <div className="md:hidden mb-4">
          <Button 
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="w-full flex justify-between items-center"
          >
            <span>Filters</span>
            <i className={`fas fa-chevron-${showFilters ? 'up' : 'down'}`}></i>
          </Button>
        </div>
        
        <div className="md:flex md:space-x-8">
          {/* Filter Sidebar (Desktop always visible, Mobile conditionally visible) */}
          {(showFilters || window.innerWidth >= 768) && (
            <FilterSection onFilterChange={handleFilterChange} loading={isLoading} />
          )}
          
          {/* Pet Grid */}
          <PetGrid pets={pets} loading={isLoading} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HomePage;
