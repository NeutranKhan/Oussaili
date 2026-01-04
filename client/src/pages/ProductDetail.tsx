import { useRoute } from "wouter";
import { useProducts } from "@/hooks/use-products";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Loader2, ArrowLeft, ShoppingCart, ShieldCheck, Truck } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function ProductDetail() {
  const [match, params] = useRoute("/product/:id");
  const { data: products, isLoading } = useProducts(); // In a real app, fetch single product
  const addItem = useCart(state => state.addItem);
  const { toast } = useToast();

  const product = products?.find(p => p.id === params?.id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/">
          <Button>Back to Store</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-32">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Store
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-3xl p-4 md:p-8 aspect-square flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10" />
            <img 
              src={product.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
              alt={product.name}
              className="w-full h-full object-contain relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
          
          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-8"
          >
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{product.name}</h1>
              <p className="text-3xl font-light text-foreground/80">${product.price.toFixed(2)}</p>
            </div>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
              <Button 
                size="lg" 
                className="flex-1 rounded-xl h-14 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>

            {/* Features/Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">2 Year Warranty</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                <Truck className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Free Shipping</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
