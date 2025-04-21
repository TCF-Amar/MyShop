import React from "react";
import { motion } from "framer-motion";

// Helper function to calculate the discount percentage
const percentCalculate = (discountedPrice, price) => {
    if (!discountedPrice || !price) return 0;
    const percentage = ((price - discountedPrice) / price) * 100;
    return percentage.toFixed(0);  // Rounded percentage
};

function Item({ product }) {
    const {
        title,
        price,
        discountPrice: discountedPrice,
        discountedPercentage, // If already available, we can use it directly
        images: imageUrls,
        brand
    } = product;

    // Dynamically calculate discount percentage if not provided
    const finalDiscount = discountedPercentage || percentCalculate(discountedPrice, price);

    return (
        <motion.div
            className="  shadow-sm overflow-hidden w-full h-full flex flex-col justify-between  transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Image Section */}
            <motion.div
                className="relative aspect-[3/4] overflow-hidden"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
            >
                <img
                    src={imageUrls?.[0]}
                    alt={`${brand}: ${name}`}
                    className="w-full h-full object-cover"
                />
                {finalDiscount > 0 && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        -{finalDiscount}%
                    </div>
                )}
            </motion.div>

            {/* Content Section */}
            <div className="p-3">
                {/* Brand */}
                <p className="text-gray-500 text-sm mb-1 capitalize">{brand}</p>

                {/* Product Name */}
                <h3 className="text-gray-800 font-medium text-sm line-clamp-2 min-h-[40px]">
                    {title}
                </h3>

                {/* Price Section */}
                <div className="flex items-center gap-2 mt-2">
                    {discountedPrice ? (
                        <>
                            <span className="text-lg font-semibold text-gray-600">
                                ₹{discountedPrice.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                                ₹{price.toLocaleString()}
                            </span>
                        </>
                    ) : (
                        <span className="text-lg font-semibold text-gray-900">
                            ₹{price.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default Item;
