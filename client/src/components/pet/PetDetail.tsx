import { useState } from "react";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Pet } from "@shared/schema";

type PetDetailProps = {
  pet: Pet;
  similarPets?: Pet[];
};

const PetDetail = ({ pet, similarPets = [] }: PetDetailProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const {
    petId,
    name,
    breed,
    age,
    size,
    gender,
    status,
    temperament,
    photos,
    videoUrl
  } = pet;

  // Get the currently selected image or use a placeholder
  const currentImage = photos && photos.length > 0
    ? photos[selectedImageIndex]
    : "https://via.placeholder.com/800x600?text=No+Photo";

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
    <>
      {/* Breadcrumbs */}
      <nav className="flex mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{name}</span>
      </nav>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="md:flex">
          {/* Image Gallery */}
          <div className="md:w-1/2">
            <div className="relative pb-[80%] md:pb-[100%]">
              <img 
                src={currentImage} 
                alt={`${name} - ${breed}`} 
                className="absolute h-full w-full object-cover"
              />
              <div className={`absolute top-4 right-4 ${getStatusBadgeColor(status)} text-white text-sm font-bold px-3 py-1 rounded-full`}>
                {status}
              </div>
            </div>
            {photos && photos.length > 0 && (
              <div className="p-4 grid grid-cols-4 gap-2">
                {photos.map((photo, index) => (
                  <div 
                    key={index} 
                    className={`rounded-md overflow-hidden cursor-pointer ${
                      index === selectedImageIndex 
                        ? "border-2 border-primary" 
                        : "border border-gray-200"
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img 
                      src={photo} 
                      alt={`${name} photo ${index + 1}`} 
                      className="w-full h-16 object-cover"
                    />
                  </div>
                ))}
                {videoUrl && (
                  <div 
                    className="rounded-md overflow-hidden cursor-pointer relative border border-gray-200 group"
                    onClick={() => window.open(videoUrl, "_blank")}
                  >
                    <div className="w-full h-16 bg-black flex items-center justify-center">
                      <i className="fas fa-play text-white"></i>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Pet Details */}
          <div className="md:w-1/2 p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
              <span className="text-sm text-gray-600">ID: {petId}</span>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Breed</h3>
                <p className="text-lg font-medium text-gray-800">{breed}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Age</h3>
                <p className="text-lg font-medium text-gray-800">{age} {parseInt(age) === 1 ? "year" : "years"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Size</h3>
                <p className="text-lg font-medium text-gray-800">{size}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                <p className="text-lg font-medium text-gray-800">{gender}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Temperament</h3>
                <p className="text-lg font-medium text-gray-800">{temperament}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className={`text-lg font-medium ${
                  status.toLowerCase() === "available" 
                    ? "text-amber-500" 
                    : status.toLowerCase() === "adopted" 
                      ? "text-green-500" 
                      : "text-blue-500"
                }`}>
                  {status}
                </p>
              </div>
            </div>
            
            {status.toLowerCase() === "available" && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Interested in adopting {name}?</h3>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <a href="#" className="flex-1 bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-md text-center transition duration-150 ease-in-out">
                    Apply to Adopt
                  </a>
                  <a href="#" className="flex-1 border border-primary text-primary hover:bg-primary-light hover:bg-opacity-10 font-medium py-3 px-4 rounded-md text-center transition duration-150 ease-in-out">
                    Contact Foster
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Additional Info Tabs */}
      <div className="mt-8">
        <Tabs defaultValue="medical">
          <div className="border-b border-gray-200">
            <TabsList className="border-b-0">
              <TabsTrigger 
                value="medical"
                className="data-[state=active]:border-primary data-[state=active]:text-primary border-transparent border-b-2 py-4 px-1 text-center font-medium text-sm sm:text-base w-1/3"
              >
                Medical History
              </TabsTrigger>
              <TabsTrigger 
                value="foster"
                className="data-[state=active]:border-primary data-[state=active]:text-primary border-transparent border-b-2 py-4 px-1 text-center font-medium text-sm sm:text-base w-1/3"
              >
                Foster Info
              </TabsTrigger>
              <TabsTrigger 
                value="adoption"
                className="data-[state=active]:border-primary data-[state=active]:text-primary border-transparent border-b-2 py-4 px-1 text-center font-medium text-sm sm:text-base w-1/3"
              >
                Adoption Process
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="medical" className="py-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Medical History</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <div>
                  <p className="font-medium">Vaccinations up to date</p>
                  <p className="text-sm text-gray-500">Last updated: January 15, 2025</p>
                </div>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <div>
                  <p className="font-medium">Neutered</p>
                  <p className="text-sm text-gray-500">Procedure date: November 10, 2024</p>
                </div>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <div>
                  <p className="font-medium">Microchipped</p>
                  <p className="text-sm text-gray-500">ID: 985121423456789</p>
                </div>
              </li>
            </ul>
          </TabsContent>
          
          <TabsContent value="foster" className="py-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Foster Information</h3>
            <p className="text-gray-700 mb-4">
              {name} is currently in a loving foster home where they're receiving proper care and attention.
              Our foster families provide daily updates on the pet's behavior, feeding habits, and overall wellbeing.
            </p>
            <p className="text-gray-700">
              If you'd like to know more about {name}'s current living situation or have specific questions
              for the foster family, please use the "Contact Foster" button.
            </p>
          </TabsContent>
          
          <TabsContent value="adoption" className="py-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Adoption Process</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li className="ml-6">
                <span className="font-medium -ml-6">Apply online</span>
                <p className="text-sm text-gray-500 mt-1">Fill out our adoption application form.</p>
              </li>
              <li className="ml-6">
                <span className="font-medium -ml-6">Home visit</span>
                <p className="text-sm text-gray-500 mt-1">A representative will schedule a home visit.</p>
              </li>
              <li className="ml-6">
                <span className="font-medium -ml-6">Meet and greet</span>
                <p className="text-sm text-gray-500 mt-1">Spend some time with the pet you're interested in adopting.</p>
              </li>
              <li className="ml-6">
                <span className="font-medium -ml-6">Adoption fee</span>
                <p className="text-sm text-gray-500 mt-1">Pay the adoption fee which covers vaccinations, microchipping, and spay/neuter.</p>
              </li>
              <li className="ml-6">
                <span className="font-medium -ml-6">Take home</span>
                <p className="text-sm text-gray-500 mt-1">Welcome your new furry friend to their forever home!</p>
              </li>
            </ol>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Similar Pets */}
      {similarPets.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarPets.map(pet => (
              <div key={pet.petId} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="relative pb-[65%]">
                  <img 
                    src={pet.photos && pet.photos.length > 0 ? pet.photos[0] : "https://via.placeholder.com/500x350?text=No+Photo"} 
                    alt={`${pet.name} - ${pet.breed}`} 
                    className="absolute h-full w-full object-cover"
                  />
                  <div className={`absolute top-2 right-2 ${getStatusBadgeColor(pet.status)} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                    {pet.status}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800">{pet.name}</h3>
                  <p className="text-sm text-gray-600">{pet.breed}, {pet.age} {parseInt(pet.age) === 1 ? "year" : "years"}</p>
                  <div className="mt-3">
                    <Link 
                      href={`/pet/${pet.petId}`} 
                      className="block text-center bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PetDetail;
