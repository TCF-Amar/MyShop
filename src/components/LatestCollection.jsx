import React, { useEffect } from 'react';
import {  useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Item from './Item';

function LatestCollection() {
    const { products, loading } = useSelector((state) => state.product);

    console.log(products)
    // useEffect(() => {
    //     if (products.length === 0) {
    //         dispatch(getProducts());
    //     }
    // }, [dispatch, products.length]);

    // Get the latest 8 products
    const latestProducts = [...products]
        .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
        .slice(0, 10);

    return (
        <section className="pt-10  ">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase"><span className='text-gray-600'>Latest</span> Collection</h2>
                    <p className="text-gray-600">Discover our newest arrivals and trending pieces</p>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {latestProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link to={`/product/${product.id}`}>
                                    <Item product={product} />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                <motion.div 
                    className="text-center mt-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <Link 
                        to="/search" 
                        className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        View All Products
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

export default LatestCollection;