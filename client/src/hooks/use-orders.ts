import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc } from "firebase/firestore";
import { Order, orderSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./use-auth";

export function useOrders() {
  const { user, isAdmin } = useAuth();
  
  return useQuery({
    queryKey: ['orders', user?.uid],
    enabled: !!user,
    queryFn: async () => {
      const ordersRef = collection(db, 'orders');
      let q;
      
      if (isAdmin) {
        q = query(ordersRef, orderBy('createdAt', 'desc'));
      } else {
        q = query(ordersRef, where('userId', '==', user!.uid), orderBy('createdAt', 'desc'));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        // Convert timestamp to date if needed, though schema accepts both
        return { 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt)
        } as Order;
      });
    }
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
      const newOrder = {
        ...orderData,
        createdAt: new Date(),
        status: 'pending' as const
      };
      
      // Validate
      orderSchema.parse(newOrder);
      
      const docRef = await addDoc(collection(db, 'orders'), newOrder);
      return { id: docRef.id, ...newOrder };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({ title: "Order placed!", description: "Thank you for your purchase." });
    },
    onError: (error) => {
      console.error(error);
      toast({ title: "Error", description: "Failed to place order", variant: "destructive" });
    }
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: Order['status'] }) => {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({ title: "Status updated", description: "Order status has been changed." });
    }
  });
}
