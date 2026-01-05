import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useRequireAuth } from "@/hooks/use-auth";
import { useOrders } from "@/hooks/use-orders";
import { Loader2, Package, Calendar, MapPin, Mail, LogOut, Edit2, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, profile, loading } = useRequireAuth();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  if (!user) return null; // Should redirect via useRequireAuth

  // If loading is done but profile is missing (e.g. firestore error/hang), create a fallback
  const displayProfile = profile || {
    id: user.uid,
    email: user.email!,
    displayName: user.displayName || "User",
    role: "customer" as const,
    photoURL: user.photoURL || undefined
  };

  const handleLogout = async () => {
    await signOut(auth);
    setLocation("/auth");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 md:px-8 pt-32">
        <div className="glass rounded-3xl p-8 mb-12 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-1 relative z-10 shadow-xl">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt={displayProfile.displayName || "User"} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-tr from-blue-500 to-purple-500">
                  {(displayProfile.displayName || user.email || "U")[0].toUpperCase()}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left relative z-10">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-2xl font-bold">{displayProfile.displayName || "Valued Customer"}</h1>
              <EditProfileDialog user={user} currentName={displayProfile.displayName || ""} />
            </div>

            <div className="flex flex-col md:flex-row gap-4 text-muted-foreground text-sm justify-center md:justify-start">
              <span className="flex items-center justify-center gap-1 bg-secondary/50 px-3 py-1 rounded-full">
                <Mail className="w-4 h-4" /> {user.email}
              </span>
              <span className="flex items-center justify-center gap-1 bg-secondary/50 px-3 py-1 rounded-full">
                <MapPin className="w-4 h-4" /> Montserrado, Liberia
              </span>
            </div>
          </div>

          <Button variant="outline" onClick={handleLogout} className="relative z-10 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              if (user && profile) {
                const newRole = profile.role === 'admin' ? 'customer' : 'admin';
                const { doc, updateDoc } = await import("firebase/firestore");
                const { db } = await import("@/lib/firebase");
                await updateDoc(doc(db, "users", user.uid), { role: newRole });
                window.location.reload();
              }
            }}
            className="absolute top-4 right-4 opacity-10 hover:opacity-100"
            title="Dev: Toggle Admin Role"
          >
            <ShieldCheck className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              if (user && profile) {
                const newRole = profile.role === 'admin' ? 'customer' : 'admin';
                const { doc, updateDoc } = await import("firebase/firestore");
                const { db } = await import("@/lib/firebase");
                await updateDoc(doc(db, "users", user.uid), { role: newRole });
                window.location.reload();
              }
            }}
            className="absolute top-4 right-4 opacity-10 hover:opacity-100"
            title="Dev: Toggle Admin Role"
          >
            <ShieldCheck className="w-4 h-4" />
          </Button>
        </div>

        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" /> Order History
        </h2>

        {ordersLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
        ) : orders?.length === 0 ? (
          <div className="text-center py-12 glass rounded-2xl">
            <p className="text-muted-foreground">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders?.map((order) => (
              <div key={order.id} className="glass rounded-2xl p-6 transition-all hover:bg-white/60 dark:hover:bg-white/10 group">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      Order #{order.id.slice(0, 8)}
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="capitalize">{order.paymentMethod?.replace(/_/g, " ")}</span>
                    </div>
                    <div className="font-bold text-lg">${order.total.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary mb-2 group-hover:scale-105 transition-transform">
                      <span className={`w-2 h-2 rounded-full mr-2 
                        ${order.status === 'delivered' ? 'bg-green-500' :
                          order.status === 'shipped' ? 'bg-blue-500' :
                            'bg-yellow-500'}`}
                      />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                      <Calendar className="w-3 h-3" />
                      {order.createdAt instanceof Date ? order.createdAt.toLocaleDateString() : new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-t border-border/50 pt-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground w-4 font-mono">{item.quantity}x</span>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div >
  );
}

function EditProfileDialog({ user, currentName }: { user: any, currentName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateProfile(user, { displayName: name });
      toast({ title: "Profile updated", description: "Your display name has been updated." });
      setIsOpen(false);
      window.location.reload(); // Simple reload to refresh state
    } catch (e: any) {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary"><Edit2 className="w-3 h-3" /></Button>
      </DialogTrigger>
      <DialogContent className="glass border-white/20 sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Display Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
          </div>
          <Button onClick={handleUpdate} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
