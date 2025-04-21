import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PageNotFound = () => {
    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <motion.h1
                className="text-7xl font-extrabold text-blue-600"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                404
            </motion.h1>

            <motion.h2
                className="mt-4 text-2xl font-semibold text-gray-800"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                Oops! Page not found
            </motion.h2>

            <motion.p
                className="mt-2 text-gray-600"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                The page you're looking for doesn't exist or has been moved.
            </motion.p>

            <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
            >
                <Link
                    to="/"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all duration-300"
                >
                    Go Back Home
                </Link>
            </motion.div>
        </motion.div>
    );
};

export default PageNotFound;
