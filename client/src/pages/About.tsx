import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, Heart, Globe } from "lucide-react";

export default function About() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-grow pt-32 pb-16 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <section className="text-center mb-20 relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent"
                        >
                            Our Story
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-muted-foreground max-w-2xl mx-auto"
                        >
                            Bringing quality, style, and innovation to your doorstep in Liberia.
                        </motion.p>
                    </section>

                    {/* Mission & Vision */}
                    <section className="grid md:grid-cols-2 gap-12 mb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="glass p-8 rounded-3xl"
                        >
                            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                At Oussaili Store, our mission is to redefine the shopping experience in Liberia by providing access to premium, high-quality products that enhance your lifestyle. We believe in bridging the gap between global trends and local needs, ensuring that you never have to compromise on quality or style.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="glass p-8 rounded-3xl"
                        >
                            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We envision a future where online shopping is seamless, trusted, and delightful. We aspire to be the leading e-commerce platform in the region, known not just for our products, but for our commitment to customer satisfaction, swift delivery, and community building.
                            </p>
                        </motion.div>
                    </section>

                    {/* Core Values */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <ValueCard
                                icon={<ShieldCheck className="w-8 h-8 text-primary" />}
                                title="Premium Quality"
                                description="We carefully curate every item to ensure it meets our high standards of excellence."
                                delay={0}
                            />
                            <ValueCard
                                icon={<Truck className="w-8 h-8 text-primary" />}
                                title="Fast Delivery"
                                description="Swift and reliable delivery across Montserrado and beyond."
                                delay={0.1}
                            />
                            <ValueCard
                                icon={<Heart className="w-8 h-8 text-primary" />}
                                title="Customer First"
                                description="Your satisfaction is our top priority. We're here to help, always."
                                delay={0.2}
                            />
                            <ValueCard
                                icon={<Globe className="w-8 h-8 text-primary" />}
                                title="Global Trends"
                                description="Bringing the latest international styles and tech right to your hands."
                                delay={0.3}
                            />
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function ValueCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="glass p-6 rounded-2xl text-center hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
        >
            <div className="w-16 h-16 mx-auto bg-secondary/50 rounded-full flex items-center justify-center mb-4 text-primary">
                {icon}
            </div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </motion.div>
    );
}
