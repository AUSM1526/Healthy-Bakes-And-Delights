import { motion } from "framer-motion";
import backgroundImage from "../../assets/C2.jpg"; // Adjust the path as necessary

const First = () => {
  return (
            <section className="relative h-screen flex items-center justify-center text-center">
                {/* Background Image with Transparent Overlay */}
                <div 
                    className="absolute inset-0 bg-black opacity-80 backdrop-blur-sm"
                    style={{ 
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2)), url(${backgroundImage})`, 
                    backgroundSize: "cover", 
                    backgroundPosition: "center", 
                    backgroundAttachment: "scroll" 
                    }}
                />

                {/* Foreground Content */}
                <div className="relative z-10 container mx-auto px-6">
                    <motion.div 
                    initial={{ opacity: 0, y: 50 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 1 }}
                    className="z-10"
                    >
                    <h2 className="text-5xl md:text-7xl font-serif font-bold text-white drop-shadow-2xl mb-6 leading-snug">
                        Where every bite whispers 
                        <span> indulgence and opulence</span>
                    </h2>
                    <p className="text-lg text-white opacity-100 mb-8 drop-shadow-lg">
                        Discover our artisanal treats made with organic ingredients, less sugar, and all the flavor you crave.
                    </p>
                    </motion.div>
                </div>
            </section>

  );
};

export default First;
