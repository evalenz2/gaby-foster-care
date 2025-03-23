"use client";
import { useState, useEffect } from "react";
import { db } from "../../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
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

export default function PetProfile() {
  const { id } = useParams();
  const petId = Array.isArray(id) ? id[0] : id;
  const [pet, setPet] = useState<Pet | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!petId || typeof petId !== "string") {
      router.push("/"); // Redirect to home page if petId is invalid
      return;
    }
    const fetchPet = async () => {
      const docRef = doc(db, "pets", petId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPet(docSnap.data() as Pet);
      } else {
        router.push("/"); // Redirect to home page if pet is not found
      }
    };
    fetchPet();
  }, [petId, router]);

  if (!pet) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl mb-4">{pet.name}</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {pet.photos.map((photo, idx) => (
          <CldImage
            key={idx}
            width="300"
            height="200"
            src={photo}
            alt={`${pet.name} photo ${idx + 1}`}
            className="w-full h-48 object-cover"
          />
        ))}
      </div>
      {pet.videoUrl && (
        <video controls className="w-full mb-4">
          <source src={pet.videoUrl} type="video/mp4" />
        </video>
      )}
      <p><strong>Breed:</strong> {pet.breed}</p>
      <p><strong>Age:</strong> {pet.age}</p>
      <p><strong>Size:</strong> {pet.size}</p>
      <p><strong>Gender:</strong> {pet.gender}</p>
      <p><strong>Temperament:</strong> {pet.temperament}</p>
      <p><strong>Status:</strong> {pet.status}</p>
    </div>
  );
}