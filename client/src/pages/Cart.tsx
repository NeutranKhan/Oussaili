import { Navbar } from "@/components/Navbar";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useCreateOrder } from "@/hooks/use-orders";
import { Trash2, Plus, Minus, ArrowRight, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export default function Cart() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const createOrder = useCreateOrder();

  const handleCheckout = () => {
    if (!user) {
      setLocation("/auth");
      return;
    }

    if (items.length === 0) return;

    createOrder.mutate({
      userId: user.uid,
      userEmail: user.email!,
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl
      })),
      total: total,
      status: "pending"
    }, {
      onSuccess: () => {
        clearCart();
        setLocation("/profile");
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 md:px-8 pt-32 pb-20">
        <h1 className="text-3xl font-display font-bold mb-8">Shopping Cart</h1>
        
        {items.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
              <ShoppingBagIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
              <Link href="/">
                <Button size="lg" className="rounded-xl px-8">Start Shopping</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass p-4 rounded-2xl flex gap-4 items-center"
                  >
                    <div className="w-20 h-20 bg-white rounded-xl overflow-hidden p-2 flex-shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="glass rounded-2xl p-6 sticky top-28">
                <h3 className="font-semibold mb-6">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full h-12 rounded-xl text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                  onClick={handleCheckout}
                  disabled={createOrder.isPending}
                >
                  {createOrder.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <>
                      Checkout <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
                
                {!user && (
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    You'll need to login to complete your purchase.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ShoppingBagIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
