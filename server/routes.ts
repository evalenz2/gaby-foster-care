import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { petSchema } from "@shared/schema";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all pets
  app.get("/api/pets", async (req: Request, res: Response) => {
    try {
      const pets = await storage.getAllPets();
      res.json(pets);
    } catch (error) {
      console.error("Error fetching pets:", error);
      res.status(500).json({ message: "Failed to fetch pets" });
    }
  });

  // Get filtered pets
  app.post("/api/pets/filter", async (req: Request, res: Response) => {
    try {
      // Basic filtering functionality using in-memory storage
      const filters = req.body;
      const allPets = await storage.getAllPets();
      
      // Apply filters
      let filteredPets = [...allPets];
      
      if (filters.breed && filters.breed !== "All Breeds") {
        filteredPets = filteredPets.filter(pet => pet.breed === filters.breed);
      }
      
      if (filters.sizes && filters.sizes.length > 0) {
        filteredPets = filteredPets.filter(pet => filters.sizes.includes(pet.size));
      }
      
      if (filters.genders && filters.genders.length > 0) {
        filteredPets = filteredPets.filter(pet => filters.genders.includes(pet.gender));
      }
      
      if (filters.statuses && filters.statuses.length > 0) {
        filteredPets = filteredPets.filter(pet => filters.statuses.includes(pet.status));
      }
      
      if (filters.petId) {
        filteredPets = filteredPets.filter(pet => pet.petId === filters.petId);
      }
      
      if (filters.age) {
        filteredPets = filteredPets.filter(pet => pet.age === filters.age);
      }
      
      res.json(filteredPets);
    } catch (error) {
      console.error("Error filtering pets:", error);
      res.status(500).json({ message: "Failed to filter pets" });
    }
  });

  // Get a single pet by ID
  app.get("/api/pets/:id", async (req: Request, res: Response) => {
    try {
      const petId = req.params.id;
      const pet = await storage.getPet(petId);
      
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
      
      res.json(pet);
    } catch (error) {
      console.error("Error fetching pet:", error);
      res.status(404).json({ message: "Pet not found" });
    }
  });

  // Create a new pet
  app.post("/api/pets", async (req: Request, res: Response) => {
    try {
      const petData = req.body;
      const validatedData = petSchema.omit({ petId: true }).parse(petData);
      const pet = await storage.createPet(validatedData);
      res.status(201).json(pet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid pet data", errors: error.errors });
      } else {
        console.error("Error creating pet:", error);
        res.status(500).json({ message: "Failed to create pet" });
      }
    }
  });

  // Update a pet
  app.put("/api/pets/:id", async (req: Request, res: Response) => {
    try {
      const petId = req.params.id;
      const petData = req.body;
      const validatedData = petSchema.partial().parse(petData);
      const pet = await storage.updatePet(petId, validatedData);
      res.json(pet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid pet data", errors: error.errors });
      } else {
        console.error("Error updating pet:", error);
        res.status(500).json({ message: "Failed to update pet" });
      }
    }
  });

  // Delete a pet
  app.delete("/api/pets/:id", async (req: Request, res: Response) => {
    try {
      const petId = req.params.id;
      const success = await storage.deletePet(petId);
      
      if (!success) {
        return res.status(404).json({ message: "Pet not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting pet:", error);
      res.status(500).json({ message: "Failed to delete pet" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
