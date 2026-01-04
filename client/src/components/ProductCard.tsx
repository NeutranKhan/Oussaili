import { Product } from "@shared/schema";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/use-cart";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart(state => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} is now in your cart.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/product/${product.id}`} className="block h-full">
        <div className="group h-full glass-card rounded-2xl overflow-hidden flex flex-col relative">
          <div className="aspect-square overflow-hidden relative bg-white/50">
            {/* Using product image if available, otherwise a placeholder */}
            <img 
              src={product.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"} 
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <Button
              size="icon"
              className="absolute bottom-4 right-4 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl"
              onClick={handleAddToCart}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="p-5 flex flex-col flex-grow">
            <div className="mb-2">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">{product.category}</span>
            </div>
            <h3 className="font-display font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
              {product.description}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
              {product.stock < 5 && product.stock > 0 && (
                <span className="text-xs font-medium text-orange-500">Only {product.stock} left</span>
              )}
              {product.stock === 0 && (
                <span className="text-xs font-medium text-destructive">Out of stock</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
