import { Navbar } from "@/components/Navbar";
import { useRequireAuth } from "@/hooks/use-auth";
import { useOrders } from "@/hooks/use-orders";
import { Loader2, Package, Calendar, MapPin, Mail, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useLocation } from "wouter";

export default function Profile() {
  const { user, profile, loading } = useRequireAuth();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const [_, setLocation] = useLocation();

  if (loading || !user || !profile) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  const handleLogout = async () => {
    await signOut(auth);
    setLocation("/auth");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 md:px-8 pt-32">
        <div className="glass rounded-3xl p-8 mb-12 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-1">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt={profile.displayName || "User"} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-tr from-blue-500 to-purple-500">
                  {(profile.displayName || user.email || "U")[0].toUpperCase()}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold mb-2">{profile.displayName || "Valued Customer"}</h1>
            <div className="flex flex-col md:flex-row gap-4 text-muted-foreground text-sm justify-center md:justify-start">
              <span className="flex items-center justify-center gap-1">
                <Mail className="w-4 h-4" /> {user.email}
              </span>
              <span className="flex items-center justify-center gap-1">
                <MapPin className="w-4 h-4" /> Beirut, Lebanon
              </span>
            </div>
          </div>

          <Button variant="outline" onClick={handleLogout} className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" /> Logout
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
              <div key={order.id} className="glass rounded-2xl p-6 transition-all hover:bg-white/60 dark:hover:bg-white/10">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Order #{order.id.slice(0, 8)}</div>
                    <div className="font-bold text-lg">${order.total.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary mb-2">
                      <span className={`w-2 h-2 rounded-full mr-2 
                        ${order.status === 'delivered' ? 'bg-green-500' : 
                          order.status === 'shipped' ? 'bg-blue-500' : 
                          'bg-yellow-500'}`} 
                      />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {order.createdAt instanceof Date ? order.createdAt.toLocaleDateString() : new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 border-t border-border/50 pt-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground w-4">{item.quantity}x</span>
                        <span>{item.name}</span>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
