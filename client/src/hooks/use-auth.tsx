import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserProfile } from "@shared/schema";
import { useLocation } from "wouter";

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setUser(firebaseUser);

        if (firebaseUser) {
          // Fetch user profile from Firestore
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setProfile({ id: firebaseUser.uid, ...userSnap.data() } as UserProfile);
          } else {
            // Create new profile if it doesn't exist
            const newProfile = {
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName || "User",
              role: "customer" as const,
              photoURL: firebaseUser.photoURL || null
            };

            try {
              await setDoc(userRef, newProfile);
            } catch (error) {
              console.error("Failed to create profile (possibly permissions):", error);
              // Allow proceeding with basic profile data even if DB save fails
            }
            setProfile({ id: firebaseUser.uid, ...newProfile });
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    });

    // Fallback timeout in case Firebase doesn't respond quickly
    const timeout = setTimeout(() => {
      setLoading((currentLoading) => {
        if (currentLoading) {
          console.warn("Auth listener timeout - forcing loading to false");
          return false;
        }
        return currentLoading;
      });
    }, 4000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export function useRequireAuth(requireAdmin = false) {
  const { user, loading, isAdmin, profile } = useAuth();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        setLocation("/auth");
      } else if (requireAdmin && !isAdmin) {
        setLocation("/");
      }
    }
  }, [user, loading, isAdmin, requireAdmin, setLocation]);

  return { user, loading, isAdmin, profile };
}
