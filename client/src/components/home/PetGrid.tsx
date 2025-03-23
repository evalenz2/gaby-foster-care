import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PetCard from "../pet/PetCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Pet } from "@shared/schema";

type PetGridProps = {
  pets: Pet[];
  loading?: boolean;
};

const PetGrid = ({ pets, loading = false }: PetGridProps) => {
  const [sortOrder, setSortOrder] = useState("newest");

  // Sort pets based on selected order
  const sortedPets = [...pets].sort((a, b) => {
    switch (sortOrder) {
      case "oldest":
        return a.name.localeCompare(b.name);
      case "a-z":
        return a.name.localeCompare(b.name);
      case "z-a":
        return b.name.localeCompare(a.name);
      case "newest":
      default:
        return b.name.localeCompare(a.name);
    }
  });

  return (
    <div className="flex-1">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Available Pets</h2>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Sort by:</span>
          <Select 
            value={sortOrder} 
            onValueChange={setSortOrder}
            disabled={loading}
          >
            <SelectTrigger className="text-sm border border-gray-300 rounded-md min-w-[130px]">
              <SelectValue placeholder="Newest First" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="a-z">Name A-Z</SelectItem>
              <SelectItem value="z-a">Name Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Show skeletons while loading
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative pb-[65%]">
                <Skeleton className="absolute h-full w-full" />
              </div>
              <div className="p-4">
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            </div>
          ))
        ) : sortedPets.length > 0 ? (
          sortedPets.map((pet) => (
            <PetCard key={pet.petId} pet={pet} />
          ))
        ) : (
          <div className="col-span-3 py-10 text-center">
            <p className="text-gray-500 text-lg">No pets found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {/* Pagination - Static for now, would be dynamic in a real app */}
      {!loading && pets.length > 0 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-1">
            <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-primary">
              <i className="fas fa-chevron-left"></i>
            </a>
            <a href="#" className="px-3 py-2 rounded-md text-sm font-medium bg-primary text-white">1</a>
            <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary">2</a>
            <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary">3</a>
            <span className="px-3 py-2 text-sm text-gray-500">...</span>
            <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary">8</a>
            <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-primary">
              <i className="fas fa-chevron-right"></i>
            </a>
          </nav>
        </div>
      )}
    </div>
  );
};

export default PetGrid;
