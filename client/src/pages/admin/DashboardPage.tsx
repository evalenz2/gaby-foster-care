import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import PetTable from "@/components/admin/PetTable";
import { getAllPets } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardPage = () => {
  // Fetch all pets
  const { data: pets = [], isLoading } = useQuery({
    queryKey: ["pets"],
    queryFn: getAllPets
  });
  
  // Calculate stats
  const totalPets = pets.length;
  const adoptedPets = pets.filter(pet => pet.status.toLowerCase() === "adopted").length;
  const availablePets = pets.filter(pet => pet.status.toLowerCase() === "available").length;
  const pendingPets = pets.filter(pet => pet.status.toLowerCase() === "pending").length;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pet Management</h1>
        <p className="text-gray-600">Add, edit, and manage pet profiles</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          // Skeleton loaders for stats
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="ml-4">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary bg-opacity-10 p-3 rounded-full">
                  <i className="fas fa-paw text-primary"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Pets</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPets}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                  <i className="fas fa-home text-green-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Adopted</p>
                  <p className="text-2xl font-bold text-gray-900">{adoptedPets}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-amber-100 p-3 rounded-full">
                  <i className="fas fa-search text-amber-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Available</p>
                  <p className="text-2xl font-bold text-gray-900">{availablePets}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                  <i className="fas fa-clock text-blue-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingPets}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Pet Table */}
      <PetTable pets={pets} isLoading={isLoading} />
    </AdminLayout>
  );
};

export default DashboardPage;
