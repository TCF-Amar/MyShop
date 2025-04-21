import React, { use, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Item from '../components/Item';

function Product() {
    const productId  = useParams();
    const navigate = useNavigate();
    const { products } = useSelector((state) => state.product);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [itemQuantity, setItemQuantity] = useState(1);
    const user = useSelector((state) => state.user.user);
    
    
    // auto scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);
    },[productId])

    useEffect(() => {
        if (products.length > 0) {
            setLoading(false);
        }
    }, [products]);



    const product = products.find((p) => p.id === productId.id);

    console.log()
    const cartData = {
        quantity: itemQuantity,
        size: selectedSize,
        productId: product.id,
        userId: user.id,
        price: product.discountedPrice || product.price
    };

    console.log(cartData)

    // console.log(product)

    //    set related products 
    useEffect(() => {
        
        if (product) {
            const related = products.filter((p) => p.category === product.category && p.id !== product.id);
            setRelatedProducts(related);
        }



    }, [product, products]);

    if (loading) {
        return (
            <div className="min-h-[90vh] flex items-center justify-center">
                <p className="text-xl text-gray-600">Loading...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-[90vh] flex items-center justify-center">
                <p className="text-xl text-red-600">Product not found.</p>
            </div>
        );
    }

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? product.imageUrls.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === product.imageUrls.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <div className="min-h-[90vh] bg-white p-4 md:p-8">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
                <FaChevronLeft /> Back
            </button>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
                    <motion.img
                        key={currentImageIndex}
                        src={product.imageUrls[currentImageIndex]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Image Navigation */}ds
                    {product.imageUrls.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevImage}
                                title="Previous Image"
                                aria-label="Previous Image"
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <FaChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleNextImage}
                                title="Next Image"
                                aria-label="Next Image"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <FaChevronRight className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>

                    {/* Price */}
                    <div className="mt-2 text-3xl text-gray-900">
                        ₹{product.discountedPrice ? product.discountedPrice.toLocaleString() : product.price.toLocaleString()}
                    </div>

                    {/* Discount */}
                    {product.discountedPrice && (
                        <p className="mt-1">
                            <span className="text-lg text-gray-500 line-through">
                                ₹{product.price.toLocaleString()}
                            </span>
                            <span className="ml-2 text-green-600">
                                {Math.round((1 - product.discountedPrice / product.price) * 100)}% off
                            </span>
                        </p>
                    )}

                    {/* Size Selection */}
                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-900">Size</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200
                                        ${selectedSize === size
                                            ? 'bg-gray-900 text-white scale-105'
                                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                        <div className="mt-2 flex items-center gap-2">
                            <button
                                onClick={() => setItemQuantity(prev => Math.max(1, prev - 1))}
                                className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                            >
                                -
                            </button>
                            <input
                                type="number"
                                min={1}
                                value={itemQuantity}
                                onChange={(e) => {
                                    const val = Math.max(1, parseInt(e.target.value) || 1);
                                    setItemQuantity(val);
                                }}
                                className="w-16 text-center border rounded px-2 py-1"
                            />
                            <button
                                onClick={() => setItemQuantity(prev => prev + 1)}
                                className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6">
                        <button
                            onClick={() => alert('Add to Cart feature coming soon!')}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add to Cart
                        </button>
                        <button
                            title="Add to Wishlist"
                            className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <FaHeart className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Product Description */}
                    <div className="border-t pt-6 mt-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
                        <p className="text-sm text-gray-600">{product.description}</p>
                    </div>

                    {/* Product Features */}
                    {product.features && product.features.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                            <ul className="list-disc pl-4 text-sm text-gray-600">
                                {product.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            {/* related products */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Related Products</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {relatedProducts.map((product) => (
                        <Link to={`/product/${product.id}`} key={product.id}>
                            <Item key={product.id} product={product} />
                            </Link>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Product;
