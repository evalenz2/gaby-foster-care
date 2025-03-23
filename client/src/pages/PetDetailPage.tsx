import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PetDetail from "@/components/pet/PetDetail";
import { getPet, getAllPets } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

const PetDetailPage = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  
  // Fetch the pet details
  const { data: pet, isLoading, isError } = useQuery({
    queryKey: ["pet", id],
    queryFn: async () => {
      if (!id) throw new Error("Pet ID is required");
      return await getPet(id);
    }
  });
  
  // Fetch all pets to show similar ones
  const { data: allPets = [] } = useQuery({
    queryKey: ["pets"],
    queryFn: getAllPets
  });
  
  // Get similar pets (same breed or size, but not the current pet)
  const similarPets = allPets
    .filter(p => p.petId !== id && (p.breed === pet?.breed || p.size === pet?.size))
    .slice(0, 4);
  
  // Redirect to home if pet not found
  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex-grow">
        {isLoading ? (
          // Loading skeleton
          <>
            <Skeleton className="h-6 w-32 mb-6" />
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <Skeleton className="h-96 w-full" />
                  <div className="p-4 grid grid-cols-4 gap-2">
                    {Array(4).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                </div>
                <div className="md:w-1/2 p-6">
                  <Skeleton className="h-10 w-3/4 mb-4" />
                  <div className="grid grid-cols-2 gap-4">
                    {Array(6).fill(0).map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="h-32 w-full mt-6" />
                  <div className="flex space-x-3 mt-6">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : pet ? (
          <PetDetail pet={pet} similarPets={similarPets} />
        ) : null}
      </div>
      
      <Footer />
    </div>
  );
};

export default PetDetailPage;
