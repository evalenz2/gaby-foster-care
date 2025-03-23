import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for admin authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Pet schema (matches the Firebase data structure)
export interface Pet {
  petId: string;        // Document ID (e.g., "pet123")
  name: string;         // Pet's name (e.g., "Buddy")
  age: string;          // Pet's age (e.g., "5")
  breed: string;        // Pet's breed (e.g., "Labrador")
  size: string;         // Pet's size (e.g., "Large")
  gender: string;       // Pet's gender (e.g., "Male")
  temperament: string;  // Pet's temperament (e.g., "Friendly")
  status: string;       // Pet's status (e.g., "available")
  photos: string[];     // Array of Cloudinary photo URLs
  videoUrl?: string;    // Optional video URL
}

// Validation schema for pets
export const petSchema = z.object({
  petId: z.string(),
  name: z.string().min(1, "Name is required"),
  age: z.string().min(1, "Age is required"),
  breed: z.string().min(1, "Breed is required"),
  size: z.string().min(1, "Size is required"),
  gender: z.string().min(1, "Gender is required"),
  temperament: z.string().min(1, "Temperament is required"),
  status: z.string().min(1, "Status is required"),
  photos: z.array(z.string()),
  videoUrl: z.string().optional(),
});

export const insertPetSchema = petSchema.omit({ petId: true });
export type InsertPet = z.infer<typeof insertPetSchema>;
