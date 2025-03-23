import { useState } from "react";
import { Link } from "wouter";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { deletePet } from "@/lib/firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Pet } from "@shared/schema";

interface PetTableProps {
  pets: Pet[];
  isLoading: boolean;
}

const PetTable = ({ pets, isLoading }: PetTableProps) => {
  const [searchText, setSearchText] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [petToDelete, setPetToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Filter pets based on search text
  const filteredPets = pets.filter(pet => 
    pet.name.toLowerCase().includes(searchText.toLowerCase()) ||
    pet.breed.toLowerCase().includes(searchText.toLowerCase()) ||
    pet.petId.toLowerCase().includes(searchText.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredPets.length / parseInt(entriesPerPage));
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const endIndex = startIndex + parseInt(entriesPerPage);
  const displayedPets = filteredPets.slice(startIndex, endIndex);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async () => {
    if (!petToDelete) return;
    
    try {
      await deletePet(petToDelete);
      toast({
        title: "Pet deleted successfully",
        variant: "default",
      });
      
      // Invalidate pets query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      
      // Reset petToDelete
      setPetToDelete(null);
    } catch (error) {
      toast({
        title: "Failed to delete pet",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-amber-100 text-amber-800";
      case "adopted":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Manage Pets</h2>
        <Link href="/admin/pet">
          <Button>
            <i className="fas fa-plus mr-2"></i> Add New Pet
          </Button>
        </Link>
      </div>
      
      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 space-y-2 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Show</span>
            <Select 
              value={entriesPerPage} 
              onValueChange={(value) => {
                setEntriesPerPage(value);
                setCurrentPage(1); // Reset to first page when changing entries per page
              }}
            >
              <SelectTrigger className="border border-gray-300 rounded-md text-sm w-20">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500">entries</span>
          </div>
          <div className="flex items-center">
            <Input 
              type="text" 
              placeholder="Search pets..." 
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="w-full md:w-64 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Pet ID</TableHead>
                <TableHead className="w-[80px]">Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Breed</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading rows
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={7} className="h-14 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <i className="fas fa-circle-notch fa-spin text-primary"></i>
                        <span>Loading...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : displayedPets.length > 0 ? (
                // Pet rows
                displayedPets.map((pet) => (
                  <TableRow key={pet.petId}>
                    <TableCell className="font-medium">{pet.petId}</TableCell>
                    <TableCell>
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img 
                          src={pet.photos && pet.photos.length > 0 ? pet.photos[0] : "https://via.placeholder.com/40?text=No+Photo"} 
                          alt={pet.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{pet.name}</TableCell>
                    <TableCell>{pet.breed}</TableCell>
                    <TableCell>{pet.age}</TableCell>
                    <TableCell>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(pet.status)}`}>
                        {pet.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/admin/pet/${pet.petId}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-primary">
                            <i className="fas fa-edit"></i>
                          </Button>
                        </Link>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              onClick={() => setPetToDelete(pet.petId)}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete {pet.name}'s profile. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setPetToDelete(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        
                        <Link href={`/pet/${pet.petId}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700">
                            <i className="fas fa-eye"></i>
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // No pets found
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No pets found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {filteredPets.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <div className="flex items-center">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">{Math.min(endIndex, filteredPets.length)}</span> of{" "}
                <span className="font-medium">{filteredPets.length}</span> results
              </p>
            </div>
            {totalPages > 1 && (
              <nav className="flex items-center space-x-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-chevron-left"></i>
                </Button>
                
                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => (
                    // Show first page, last page, and pages around current page
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ))
                  .map((page, i, arr) => (
                    <React.Fragment key={page}>
                      {i > 0 && arr[i - 1] !== page - 1 && (
                        <span className="px-3 py-2 text-sm text-gray-500">...</span>
                      )}
                      <Button 
                        variant={currentPage === page ? "default" : "outline"} 
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  ))
                }
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <i className="fas fa-chevron-right"></i>
                </Button>
              </nav>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetTable;
