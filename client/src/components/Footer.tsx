import { Link } from "wouter";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-secondary/30 border-t border-border mt-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-display font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Store
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            Refined essentials for modern life. Quality meets elegance in every product.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary transition-colors">Store</Link></li>
                            <li><Link href="/cart" className="hover:text-primary transition-colors">Cart</Link></li>
                            <li><Link href="/profile" className="hover:text-primary transition-colors">My Profile</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Contact</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span>Montserrado, Liberia</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary" />
                                <span>+231 88 888 8888</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary" />
                                <span>contact@store.com</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Follow Us</h4>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Store. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
