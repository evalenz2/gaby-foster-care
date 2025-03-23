import { users, type User, type InsertUser, type Pet } from "@shared/schema";

// Modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Pet-related methods
  getAllPets(): Promise<Pet[]>;
  getPet(petId: string): Promise<Pet | undefined>;
  createPet(pet: Omit<Pet, "petId">): Promise<Pet>;
  updatePet(petId: string, pet: Partial<Pet>): Promise<Pet>;
  deletePet(petId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pets: Map<string, Pet>;
  currentId: number;
  currentPetId: number;

  constructor() {
    this.users = new Map();
    this.pets = new Map();
    this.currentId = 1;
    this.currentPetId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Pet methods
  async getAllPets(): Promise<Pet[]> {
    return Array.from(this.pets.values());
  }

  async getPet(petId: string): Promise<Pet | undefined> {
    return this.pets.get(petId);
  }

  async createPet(petData: Omit<Pet, "petId">): Promise<Pet> {
    const petId = `pet${this.currentPetId++}`;
    const pet: Pet = { ...petData, petId };
    this.pets.set(petId, pet);
    return pet;
  }

  async updatePet(petId: string, petData: Partial<Pet>): Promise<Pet> {
    const existingPet = this.pets.get(petId);
    if (!existingPet) {
      throw new Error("Pet not found");
    }
    
    const updatedPet: Pet = { ...existingPet, ...petData };
    this.pets.set(petId, updatedPet);
    return updatedPet;
  }

  async deletePet(petId: string): Promise<boolean> {
    return this.pets.delete(petId);
  }
}

export const storage = new MemStorage();
