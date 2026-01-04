import { z } from "zod";

// Product Schema
export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  stock: z.coerce.number().int().min(0),
  isFeatured: z.boolean().optional(),
});

export const insertProductSchema = productSchema;
export type Product = z.infer<typeof productSchema> & { id: string };
export type InsertProduct = z.infer<typeof insertProductSchema>;

// Order Schema
export const orderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().min(1),
  imageUrl: z.string().optional(),
});

export const orderSchema = z.object({
  userId: z.string(),
  userEmail: z.string().email(),
  items: z.array(orderItemSchema),
  total: z.number(),
  status: z.enum(["pending", "processing", "shipped", "delivered"]),
  createdAt: z.string().or(z.date()), // Firestore timestamp
});

export type Order = z.infer<typeof orderSchema> & { id: string };
export type OrderItem = z.infer<typeof orderItemSchema>;

// User Profile Schema (stored in Firestore 'users' collection)
export const userProfileSchema = z.object({
  email: z.string().email(),
  displayName: z.string().optional(),
  role: z.enum(["admin", "customer"]).default("customer"),
  photoURL: z.string().optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema> & { id: string };
