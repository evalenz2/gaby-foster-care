"use client";
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { CldImage } from "next-cloudinary";

interface Pet {
  petId: string;
  name: string;
  age: string;
  breed: string;
  size: string;
  gender: string;
  temperament: string;
  status: string;
  photos: string[];
  videoUrl?: string;
}

export default function Home() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filters, setFilters] = useState({
    breed: "",
    age: "",
    size: "",
    gender: "",
    status: "",
  });
  const [searchId, setSearchId] = useState("");

  // Fetch pets from Firestore
  useEffect(() => {
    const fetchPets = async () => {
      const querySnapshot = await getDocs(collection(db, "pets"));
      const petList = querySnapshot.docs.map((doc) => ({
        petId: doc.id, // Rename 'id' to 'petId'
        ...doc.data(),
      })) as unknown as Pet[];
      setPets(petList);
    };
    fetchPets();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Filter and search logic
  const filteredPets = pets
    .filter((pet) => (searchId ? pet.petId === searchId : true))
    .filter((pet) => (filters.breed ? pet.breed === filters.breed : true))
    .filter((pet) => (filters.age ? Number(pet.age) === Number(filters.age) : true))
    .filter((pet) => (filters.size ? pet.size === filters.size : true))
    .filter((pet) => (filters.gender ? pet.gender === filters.gender : true))
    .filter((pet) => (filters.status ? pet.status === filters.status : true));

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-6">Available Pets</h1>

      {/* Search Bar */}
      <input
        type="text"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        placeholder="Search by Pet ID"
        className="w-full p-2 border rounded mb-4"
      />

      {/* Filter Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <select
          name="breed"
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Breeds</option>
          <option value="Labrador">Labrador</option>
          <option value="Beagle">Beagle</option>
          <option value="German Shepherd">German Shepherd</option>
        </select>
        <input
          name="age"
          type="number"
          placeholder="Age"
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        <select
          name="size"
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Sizes</option>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
        </select>
        <select
          name="gender"
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select
          name="status"
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="adopted">Adopted</option>
        </select>
      </div>

      {/* Pet Listings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPets.map((pet) => (
          <div key={pet.petId} className="border p-4 rounded">
            {pet.photos[0] && (
              <CldImage
                width="300"
                height="200"
                src={pet.photos[0]}
                alt={pet.name}
                className="w-full h-48 object-cover mb-2"
              />
            )}
            <h2 className="text-xl">{pet.name}</h2>
            <p>Breed: {pet.breed}</p>
            <p>Age: {pet.age}</p>
            <p>Size: {pet.size}</p>
            <p>Gender: {pet.gender}</p>
            <p>Status: {pet.status}</p>
            <a href={`/pet/${pet.petId}`} className="text-blue-500">
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}