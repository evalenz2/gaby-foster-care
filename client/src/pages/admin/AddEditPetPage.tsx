import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import PetForm from "@/components/admin/PetForm";
import { getPet } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

const AddEditPetPage = () => {
  const { id } = useParams();
  const isEditing = !!id;
  
  // Fetch pet data if editing
  const { data: pet, isLoading } = useQuery({
    queryKey: ["pet", id],
    queryFn: async () => {
      if (!id) return undefined;
      return await getPet(id);
    },
    enabled: isEditing
  });

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{isEditing ? "Edit Pet" : "Add New Pet"}</h1>
        <p className="text-gray-600">{isEditing ? "Update pet information" : "Create a new pet profile"}</p>
      </div>
      
      {isEditing && isLoading ? (
        // Skeleton loader for the form when editing
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          <Skeleton className="h-40 w-full my-6" />
          <div className="flex justify-end">
            <Skeleton className="h-10 w-24 mr-2" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      ) : (
        <PetForm pet={pet} isEditing={isEditing} />
      )}
    </AdminLayout>
  );
};

export default AddEditPetPage;
