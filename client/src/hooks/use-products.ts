import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { Product, InsertProduct, insertProductSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      const productsRef = collection(db, 'products');
      let q = query(productsRef); // basic query
      
      if (category && category !== 'All') {
        q = query(productsRef, where('category', '==', category));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    }
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (product: InsertProduct) => {
      // Validate first
      insertProductSchema.parse(product);
      
      const docRef = await addDoc(collection(db, 'products'), product);
      return { id: docRef.id, ...product };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: "Product created", description: "The product has been added to the store." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to create product", variant: "destructive" });
    }
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<InsertProduct>) => {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, updates);
      return { id, ...updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: "Product updated", description: "Changes saved successfully." });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to update product", variant: "destructive" });
    }
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, 'products', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: "Product deleted", description: "The product has been removed." });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    }
  });
}
