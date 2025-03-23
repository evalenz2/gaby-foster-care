import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, Auth } from "firebase/auth";
import { getFirestore, collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, where, DocumentData, QuerySnapshot, Firestore } from "firebase/firestore";
import type { Pet } from "@shared/schema";

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Firebase initialization with safeguards for server/client environments
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

// Only initialize Firebase on the client side
if (isBrowser) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  // Initialize Firebase only if it hasn't been initialized yet
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export const loginWithEmail = async (email: string, password: string) => {
  // Return null if not in browser environment or auth is not initialized
  if (!isBrowser || !auth) return null;
  
  try {
    // We can safely assert auth is defined because we checked above
    const userCredential = await signInWithEmailAndPassword(auth as Auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  // Do nothing if not in browser environment or auth is not initialized
  if (!isBrowser || !auth) return;
  
  try {
    // We can safely assert auth is defined because we checked above
    await signOut(auth as Auth);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const getCurrentUser = () => {
  // Return null if not in browser environment or auth is not initialized
  if (!isBrowser || !auth) return null;
  
  // We can safely assert auth is defined because we checked above
  return (auth as Auth).currentUser;
};

// Pet CRUD operations
export const addPet = async (pet: Omit<Pet, "petId">) => {
  // Check if db is initialized
  if (!db) throw new Error("Firestore is not initialized");
  
  try {
    // We can safely assert db is defined because we checked above
    const dbInstance = db as Firestore;
    const docRef = await addDoc(collection(dbInstance, "pets"), pet);
    return { ...pet, petId: docRef.id };
  } catch (error) {
    console.error("Error adding pet:", error);
    throw error;
  }
};

export const updatePet = async (petId: string, petData: Partial<Pet>) => {
  // Check if db is initialized
  if (!db) throw new Error("Firestore is not initialized");
  
  try {
    // We can safely assert db is defined because we checked above
    const dbInstance = db as Firestore;
    const petRef = doc(dbInstance, "pets", petId);
    await updateDoc(petRef, petData);
    return { petId, ...petData };
  } catch (error) {
    console.error("Error updating pet:", error);
    throw error;
  }
};

export const deletePet = async (petId: string) => {
  // Check if db is initialized
  if (!db) throw new Error("Firestore is not initialized");
  
  try {
    // We can safely assert db is defined because we checked above
    const dbInstance = db as Firestore;
    await deleteDoc(doc(dbInstance, "pets", petId));
    return petId;
  } catch (error) {
    console.error("Error deleting pet:", error);
    throw error;
  }
};

export const getPet = async (petId: string) => {
  // Check if db is initialized
  if (!db) throw new Error("Firestore is not initialized");
  
  try {
    // We can safely assert db is defined because we checked above
    const dbInstance = db as Firestore;
    const petDoc = await getDoc(doc(dbInstance, "pets", petId));
    if (petDoc.exists()) {
      return { petId: petDoc.id, ...petDoc.data() } as Pet;
    }
    throw new Error("Pet not found");
  } catch (error) {
    console.error("Error getting pet:", error);
    throw error;
  }
};

// Convert Firestore snapshot to Pet array
const convertSnapshotToPets = (snapshot: QuerySnapshot<DocumentData>) => {
  return snapshot.docs.map((doc) => ({
    petId: doc.id,
    ...doc.data()
  })) as Pet[];
};

export const getAllPets = async () => {
  // Check if db is initialized
  if (!db) throw new Error("Firestore is not initialized");
  
  try {
    // We can safely assert db is defined because we checked above
    const dbInstance = db as Firestore;
    const snapshot = await getDocs(collection(dbInstance, "pets"));
    return convertSnapshotToPets(snapshot);
  } catch (error) {
    console.error("Error getting all pets:", error);
    throw error;
  }
};

// Filter pets based on criteria
export const filterPets = async (filters: Record<string, any>) => {
  // Check if db is initialized
  if (!db) throw new Error("Firestore is not initialized");
  
  // We can safely assert db is defined because we checked above
  const dbInstance = db as Firestore;
  
  try {
    const petsCollection = collection(dbInstance, "pets");
    let constraints = [];

    if (filters.breed && filters.breed !== "All Breeds") {
      constraints.push(where("breed", "==", filters.breed));
    }
    
    if (filters.sizes && filters.sizes.length > 0) {
      constraints.push(where("size", "in", filters.sizes));
    }
    
    if (filters.genders && filters.genders.length > 0) {
      constraints.push(where("gender", "in", filters.genders));
    }
    
    if (filters.statuses && filters.statuses.length > 0) {
      constraints.push(where("status", "in", filters.statuses));
    }

    // Note: petId is stored as the document ID, not as a field
    // So we handle it differently

    // Apply constraints if any exist
    let snapshot;
    if (constraints.length > 0) {
      const q = query(petsCollection, ...constraints);
      snapshot = await getDocs(q);
    } else {
      snapshot = await getDocs(petsCollection);
    }
    
    let pets = convertSnapshotToPets(snapshot);
    
    // Handle filtering by ID if specified
    if (filters.petId) {
      pets = pets.filter(pet => pet.petId === filters.petId);
    }
    
    // Client-side filtering for age
    if (filters.age) {
      pets = pets.filter(pet => pet.age === filters.age);
    }
    
    return pets;
  } catch (error) {
    console.error("Error filtering pets:", error);
    throw error;
  }
};
