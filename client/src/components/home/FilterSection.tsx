import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FilterSectionProps = {
  onFilterChange: (filters: Record<string, any>) => void;
  loading?: boolean;
};

const FilterSection = ({ onFilterChange, loading = false }: FilterSectionProps) => {
  const [petId, setPetId] = useState("");
  const [breed, setBreed] = useState("All Breeds");
  const [age, setAge] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [genders, setGenders] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);

  // List of available breeds (can be fetched from API in a real application)
  const breeds = ["Labrador", "Beagle", "German Shepherd", "Golden Retriever", "French Bulldog"];

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setSizes(prev => [...prev, size]);
    } else {
      setSizes(prev => prev.filter(s => s !== size));
    }
  };

  const handleGenderChange = (gender: string, checked: boolean) => {
    if (checked) {
      setGenders(prev => [...prev, gender]);
    } else {
      setGenders(prev => prev.filter(g => g !== gender));
    }
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setStatuses(prev => [...prev, status]);
    } else {
      setStatuses(prev => prev.filter(s => s !== status));
    }
  };

  const handleSubmit = () => {
    onFilterChange({
      petId: petId.trim(),
      // Only include breed if it's not "All Breeds"
      breed: breed === "All Breeds" ? "" : breed.trim(),
      age: age.trim(),
      sizes,
      genders,
      statuses,
    });
  };

  const clearFilters = () => {
    setPetId("");
    setBreed("All Breeds");
    setAge("");
    setSizes([]);
    setGenders([]);
    setStatuses([]);
    onFilterChange({});
  };

  // Update filters when any filter value changes
  useEffect(() => {
    // This would normally be just button based, but for demo auto-filter on change
    handleSubmit();
  }, [sizes, genders, statuses]);

  return (
    <div className="md:w-64 flex-shrink-0 mb-6 md:mb-0">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button 
            id="clear-filters" 
            onClick={clearFilters}
            disabled={loading}
            className="text-sm text-primary hover:text-primary-dark"
          >
            Clear all
          </button>
        </div>
        
        {/* Search by Pet ID */}
        <div className="mb-6">
          <Label htmlFor="pet-id" className="block text-sm font-medium text-gray-700 mb-1">Pet ID</Label>
          <Input 
            id="pet-id" 
            value={petId} 
            onChange={(e) => setPetId(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
            placeholder="Enter Pet ID"
            disabled={loading}
          />
        </div>
        
        {/* Status Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
          <div className="flex items-center mb-2">
            <Checkbox 
              id="status-available" 
              checked={statuses.includes("available")}
              onCheckedChange={(checked) => handleStatusChange("available", checked === true)}
              disabled={loading}
            />
            <Label htmlFor="status-available" className="ml-2 text-sm text-gray-700">Available</Label>
          </div>
          <div className="flex items-center mb-2">
            <Checkbox 
              id="status-adopted" 
              checked={statuses.includes("adopted")}
              onCheckedChange={(checked) => handleStatusChange("adopted", checked === true)}
              disabled={loading}
            />
            <Label htmlFor="status-adopted" className="ml-2 text-sm text-gray-700">Adopted</Label>
          </div>
          <div className="flex items-center">
            <Checkbox 
              id="status-pending" 
              checked={statuses.includes("pending")}
              onCheckedChange={(checked) => handleStatusChange("pending", checked === true)}
              disabled={loading}
            />
            <Label htmlFor="status-pending" className="ml-2 text-sm text-gray-700">Pending</Label>
          </div>
        </div>
        
        {/* Breed Filter */}
        <div className="mb-6">
          <Label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">Breed</Label>
          <Select value={breed} onValueChange={setBreed} disabled={loading}>
            <SelectTrigger id="breed">
              <SelectValue placeholder="All Breeds" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Breeds">All Breeds</SelectItem>
              {breeds.map((breedOption) => (
                <SelectItem key={breedOption} value={breedOption}>{breedOption}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Size Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Size</h3>
          <div className="flex items-center mb-2">
            <Checkbox 
              id="size-small" 
              checked={sizes.includes("Small")}
              onCheckedChange={(checked) => handleSizeChange("Small", checked === true)}
              disabled={loading}
            />
            <Label htmlFor="size-small" className="ml-2 text-sm text-gray-700">Small</Label>
          </div>
          <div className="flex items-center mb-2">
            <Checkbox 
              id="size-medium" 
              checked={sizes.includes("Medium")}
              onCheckedChange={(checked) => handleSizeChange("Medium", checked === true)}
              disabled={loading}
            />
            <Label htmlFor="size-medium" className="ml-2 text-sm text-gray-700">Medium</Label>
          </div>
          <div className="flex items-center">
            <Checkbox 
              id="size-large" 
              checked={sizes.includes("Large")}
              onCheckedChange={(checked) => handleSizeChange("Large", checked === true)}
              disabled={loading}
            />
            <Label htmlFor="size-large" className="ml-2 text-sm text-gray-700">Large</Label>
          </div>
        </div>
        
        {/* Gender Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Gender</h3>
          <div className="flex items-center mb-2">
            <Checkbox 
              id="gender-male" 
              checked={genders.includes("Male")}
              onCheckedChange={(checked) => handleGenderChange("Male", checked === true)}
              disabled={loading}
            />
            <Label htmlFor="gender-male" className="ml-2 text-sm text-gray-700">Male</Label>
          </div>
          <div className="flex items-center">
            <Checkbox 
              id="gender-female" 
              checked={genders.includes("Female")}
              onCheckedChange={(checked) => handleGenderChange("Female", checked === true)}
              disabled={loading}
            />
            <Label htmlFor="gender-female" className="ml-2 text-sm text-gray-700">Female</Label>
          </div>
        </div>
        
        {/* Age Filter */}
        <div className="mb-6">
          <Label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</Label>
          <Input 
            id="age" 
            value={age} 
            onChange={(e) => setAge(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
            placeholder="Enter age"
            disabled={loading}
          />
        </div>
        
        <Button 
          onClick={handleSubmit} 
          className="w-full"
          disabled={loading}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterSection;
