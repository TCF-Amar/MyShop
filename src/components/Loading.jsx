import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

const bagVariants = {
    initial: { y: 0 },
    animate: {
        y: [-10, 0, -6, 0],
        transition: {
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.2,
        },
    },
};

const textVariants = {
    initial: { opacity: 0.5 },
    animate: {
        opacity: [0.5, 1, 0.5],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

const FancyLoading = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            {/* <motion.h2
                variants={textVariants}
                initial="initial"
                animate="animate"
                className="text-2xl font-semibold text-gray-700 mb-6"
            >
                Loading your shopping experience...
            </motion.h2> */}

            <div className="flex gap-6">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        variants={bagVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: i * 0.5 }}
                        className="text-blue-600 drop-shadow-md"
                    >
                        <ShoppingBag className="w-10 h-10" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FancyLoading;
