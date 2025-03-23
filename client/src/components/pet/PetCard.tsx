import { Link } from "wouter";
import type { Pet } from "@shared/schema";

type PetCardProps = {
  pet: Pet;
};

const PetCard = ({ pet }: PetCardProps) => {
  const {
    petId, 
    name, 
    breed, 
    age, 
    size, 
    gender, 
    status,
    photos
  } = pet;

  // Get the first photo or use a placeholder
  const photoUrl = photos && photos.length > 0 
    ? photos[0] 
    : "https://via.placeholder.com/500x350?text=No+Photo";

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-amber-500";
      case "adopted":
        return "bg-green-500";
      case "pending":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative pb-[65%]">
        <img 
          src={photoUrl}
          alt={`${name} - ${breed}`} 
          className="absolute h-full w-full object-cover"
        />
        <div className={`absolute top-2 right-2 ${getStatusBadgeColor(status)} text-white text-xs font-bold px-2 py-1 rounded-full`}>
          {status}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-800">{name}</h3>
          <span className="text-sm text-gray-600">ID: {petId}</span>
        </div>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-600 flex items-center">
            <i className="fas fa-paw text-gray-400 w-5"></i> {breed}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <i className="fas fa-ruler text-gray-400 w-5"></i> {size}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <i className="fas fa-venus-mars text-gray-400 w-5"></i> {gender}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <i className="fas fa-birthday-cake text-gray-400 w-5"></i> {age} {parseInt(age) === 1 ? "year" : "years"}
          </p>
        </div>
        <div className="mt-4">
          {status.toLowerCase() === "available" ? (
            <Link 
              href={`/pet/${petId}`} 
              className="block text-center bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
            >
              View Details
            </Link>
          ) : (
            <div 
              className="block text-center bg-gray-400 text-white font-medium py-2 px-4 rounded-md cursor-not-allowed"
            >
              Already Adopted
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetCard;
