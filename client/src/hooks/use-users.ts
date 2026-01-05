import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { UserProfile } from "@shared/schema";
import { useAuth } from "./use-auth";

export function useUsers() {
    const { isAdmin } = useAuth();

    return useQuery({
        queryKey: ['users'],
        enabled: !!isAdmin,
        queryFn: async () => {
            const usersRef = collection(db, 'users');
            const snapshot = await getDocs(usersRef);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile));
        }
    });
}
