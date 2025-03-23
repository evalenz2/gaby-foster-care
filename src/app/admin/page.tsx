// src/app/admin/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../firebase";
import { useRouter } from "next/navigation";
import { doc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";
import { CldUploadButton } from "next-cloudinary";
import { signOut } from "firebase/auth";
import { useDropzone } from "react-dropzone";

export default function Admin() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [formData, setFormData] = useState({
    petId: "",
    name: "",
    age: "",
    breed: "",
    size: "",
    gender: "",
    temperament: "",
    status: "available",
    photos: [],
    videoUrl: "",
  });
  const [message, setMessage] = useState("");
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [pets, setPets] = useState([]);
  const [editingPet, setEditingPet] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  // Fetch pets from Firestore
  useEffect(() => {
    const fetchPets = async () => {
      const querySnapshot = await getDocs(collection(db, "pets"));
      const petList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPets(petList);
    };
    fetchPets();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Cloudinary upload success
  const handleUpload = (result) => {
    const url = result.info.secure_url;
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, url] }));
    setPhotoPreviews((prev) => [...prev, url]);
  };

  // Handle drag-and-drop for local previews
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const previews = acceptedFiles.map((file) => URL.createObjectURL(file));
      setPhotoPreviews((prev) => [...prev, ...previews]);
    },
  });

  // Submit pet to Firestore (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "pets", formData.petId), formData);
      setMessage(editingPet ? "Pet updated successfully!" : "Pet added successfully!");
      setFormData({
        petId: "",
        name: "",
        age: "",
        breed: "",
        size: "",
        gender: "",
        temperament: "",
        status: "available",
        photos: [],
        videoUrl: "",
      });
      setPhotoPreviews([]);
      setEditingPet(null);
      // Refresh pet list
      const querySnapshot = await getDocs(collection(db, "pets"));
      setPets(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  // Edit pet
  const handleEdit = (pet) => {
    setFormData(pet);
    setPhotoPreviews(pet.photos);
    setEditingPet(pet.petId);
  };

  // Delete pet
  const handleDelete = async (petId) => {
    if (confirm("Are you sure you want to delete this pet?")) {
      try {
        await deleteDoc(doc(db, "pets", petId));
        setPets(pets.filter((pet) => pet.petId !== petId));
        setMessage("Pet deleted successfully!");
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    }
  };

  // Logout
  const handleLogout = () => {
    signOut(auth).then(() => router.push("/login"));
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl">Welcome, {user.email}!</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <h2 className="text-xl mb-4">{editingPet ? "Edit Pet" : "Add New Pet"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          name="petId"
          value={formData.petId}
          onChange={handleChange}
          placeholder="Pet ID (from shelter)"
          className="w-full p-2 border rounded"
          required
          disabled={editingPet} // Prevent changing petId when editing
        />
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="breed"
          value={formData.breed}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Breed</option>
          <option value="Labrador">Labrador</option>
          <option value="Beagle">Beagle</option>
          <option value="German Shepherd">German Shepherd</option>
        </select>
        <select
          name="size"
          value={formData.size}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Size</option>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
        </select>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          name="temperament"
          value={formData.temperament}
          onChange={handleChange}
          placeholder="Temperament (e.g., Friendly, Shy)"
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="available">Available</option>
          <option value="adopted">Adopted</option>
        </select>

        {/* Drag-and-Drop + Cloudinary Upload */}
        <div
          {...getRootProps()}
          className="border-dashed border-2 p-4 text-center cursor-pointer"
        >
          <input {...getInputProps()} />
          <p>Drag & drop photos here, or click to select</p>
        </div>
        <CldUploadButton
          uploadPreset="pet-photos"
          onUpload={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload Photos to Cloudinary
        </CldUploadButton>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {photoPreviews.map((url, idx) => (
            <img key={idx} src={url} alt="Preview" className="w-full h-20 object-cover" />
          ))}
        </div>

        <input
          name="videoUrl"
          value={formData.videoUrl}
          onChange={handleChange}
          placeholder="Video URL (optional)"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          {editingPet ? "Update Pet" : "Add Pet"}
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}

      {/* Pet List with Edit/Delete */}
      <h2 className="text-xl mb-4">Manage Pets</h2>
      <div className="space-y-4">
        {pets.map((pet) => (
          <div key={pet.petId} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h3 className="text-lg">{pet.name}</h3>
              <p>Pet ID: {pet.petId}</p>
              <p>Status: {pet.status}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(pet)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(pet.petId)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}