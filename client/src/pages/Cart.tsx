import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useCreateOrder } from "@/hooks/use-orders";
import { Trash2, Plus, Minus, ArrowRight, Loader2, CreditCard, Banknote, Smartphone } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Cart() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const createOrder = useCreateOrder();

  const [paymentMethod, setPaymentMethod] = useState<"cash_on_delivery" | "orange_money" | "lonestar_money">("cash_on_delivery");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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
      status: "pending",
      paymentMethod // Included in schema update
    }, {
      onSuccess: () => {
        clearCart();
        setIsCheckoutOpen(false);
        setLocation("/profile");
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-4">
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

              {/* Payment Method Selection */}
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" /> Payment Method
                </h3>
                <RadioGroup value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as "cash_on_delivery" | "orange_money" | "lonestar_money")} className="grid gap-4">
                  <div className={`flex items-center justify-between space-x-2 border p-4 rounded-xl transition-all cursor-pointer ${paymentMethod === 'cash_on_delivery' ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/50'}`}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash_on_delivery" id="cod" />
                      <Label htmlFor="cod" className="cursor-pointer font-medium">Cash on Delivery</Label>
                    </div>
                    <Banknote className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <div className={`flex items-center justify-between space-x-2 border p-4 rounded-xl transition-all cursor-pointer ${paymentMethod === 'orange_money' ? 'border-orange-500 bg-orange-500/5' : 'border-border hover:bg-secondary/50'}`}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="orange_money" id="orange" />
                      <Label htmlFor="orange" className="cursor-pointer font-medium">Orange Money</Label>
                    </div>
                    <Smartphone className="w-5 h-5 text-orange-500" />
                  </div>

                  <div className={`flex items-center justify-between space-x-2 border p-4 rounded-xl transition-all cursor-pointer ${paymentMethod === 'lonestar_money' ? 'border-yellow-500 bg-yellow-500/5' : 'border-border hover:bg-secondary/50'}`}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lonestar_money" id="lonestar" />
                      <Label htmlFor="lonestar" className="cursor-pointer font-medium">LoneStar / MTN Mobile Money</Label>
                    </div>
                    <Smartphone className="w-5 h-5 text-yellow-600" />
                  </div>
                </RadioGroup>

                {/* Instructions for Mobile Money */}
                {(paymentMethod === 'orange_money' || paymentMethod === 'lonestar_money') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 p-4 bg-secondary/50 rounded-xl text-sm text-muted-foreground border border-border"
                  >
                    <p className="font-medium text-foreground mb-1">Payment Instructions:</p>
                    <p>Please transfer the total amount to <strong>+231 88 888 8888</strong>.</p>
                    <p className="mt-1">Your order will be processed once payment is confirmed.</p>
                  </motion.div>
                )}
              </div>
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
                  onClick={() => setIsCheckoutOpen(true)}
                  disabled={createOrder.isPending}
                >
                  Checkout <ArrowRight className="w-5 h-5 ml-2" />
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

        <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
          <DialogContent className="glass border-white/20 sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Order</DialogTitle>
              <DialogDescription>
                You are about to place an order for ${total.toFixed(2)} via {paymentMethod.replace(/_/g, " ")}.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-4 py-4">
              <div className="bg-secondary/50 p-4 rounded-xl w-full">
                <p className="text-sm font-medium mb-2">Items ({items.length})</p>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {items.map(i => i.name).join(", ")}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>Cancel</Button>
              <Button onClick={handleCheckout} disabled={createOrder.isPending} className="shadow-lg shadow-primary/25">
                {createOrder.isPending ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                Confirm Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
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
