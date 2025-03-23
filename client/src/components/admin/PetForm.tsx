import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addPet, updatePet } from "@/lib/firebase";
import { uploadMultipleImages } from "@/lib/cloudinary";
import { useLocation } from "wouter";
import type { Pet } from "@shared/schema";

// Validation schema for the form
const petFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  breed: z.string().min(1, "Breed is required"),
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  size: z.string().min(1, "Size is required"),
  temperament: z.string().min(1, "Temperament is required"),
  status: z.string().min(1, "Status is required"),
  videoUrl: z.string().optional(),
});

type PetFormProps = {
  pet?: Pet;
  isEditing?: boolean;
};

const PetForm = ({ pet, isEditing = false }: PetFormProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const form = useForm<z.infer<typeof petFormSchema>>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: pet?.name || "",
      breed: pet?.breed || "",
      age: pet?.age || "",
      gender: pet?.gender || "",
      size: pet?.size || "",
      temperament: pet?.temperament || "",
      status: pet?.status || "available",
      videoUrl: pet?.videoUrl || "",
    },
  });

  // Set preview URLs from existing pet photos
  useEffect(() => {
    if (pet?.photos && pet.photos.length > 0) {
      setPreviewUrls(pet.photos);
    }
  }, [pet]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setSelectedFiles(prev => [...prev, ...newFiles]);

    // Create and set preview URLs
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  // Remove a selected file/preview
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Revoke object URL to free memory
    if (previewUrls[index].startsWith('blob:')) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: z.infer<typeof petFormSchema>) => {
    setIsLoading(true);
    try {
      let photoUrls: string[] = [];
      
      // Only upload new files
      if (selectedFiles.length > 0) {
        const newPhotoUrls = await uploadMultipleImages(selectedFiles);
        
        // Combine existing photos (that weren't removed) with new ones
        if (isEditing && pet?.photos) {
          // Keep only the existing photos that are still in previewUrls
          const existingPhotos = pet.photos.filter(url => previewUrls.includes(url));
          photoUrls = [...existingPhotos, ...newPhotoUrls];
        } else {
          photoUrls = newPhotoUrls;
        }
      } else if (isEditing && pet?.photos) {
        // Keep only the photos that weren't removed
        photoUrls = pet.photos.filter(url => previewUrls.includes(url));
      }

      const petData = {
        ...data,
        photos: photoUrls,
      };

      if (isEditing && pet) {
        await updatePet(pet.petId, petData);
        toast({
          title: "Pet updated successfully",
          variant: "default",
        });
      } else {
        await addPet(petData);
        toast({
          title: "Pet added successfully",
          variant: "default",
        });
      }

      // Navigate back to admin dashboard
      navigate("/admin");
    } catch (error) {
      console.error("Error saving pet:", error);
      toast({
        title: "Error saving pet",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Pet" : "Add New Pet"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pet Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="breed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breed</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Small">Small</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="temperament"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperament</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="adopted">Adopted</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Photo Upload Section */}
            <div>
              <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Pet Photos</FormLabel>
              <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <i className="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-2"></i>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark">
                      <span>Upload files</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        multiple 
                        onChange={handleFileChange}
                        disabled={isLoading}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
            
            {/* Preview/Selected Photos */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative rounded-md overflow-hidden">
                    <img 
                      src={url} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-24 object-cover" 
                    />
                    <button 
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-700 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                      disabled={isLoading}
                    >
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/admin")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin mr-2"></i>
                    {isEditing ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  isEditing ? "Update Pet" : "Save Pet"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PetForm;
