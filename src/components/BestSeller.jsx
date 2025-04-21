import React, { useEffect } from 'react';
import {  useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Item from './Item';

function BestSeller() {
    const { products, loading } = useSelector((state) => state.product);


    // Get bestseller products
    const bestsellerProducts = products.filter(product => product.bestSeller).slice(0, 4);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <section className="pt-10">
            <div className="max-w-7xl mx-auto ">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase"><span className='text-gray-600'>Best</span> Sellers</h2>
                    <p className="text-gray-600">Our most popular and trending products</p>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <motion.div 
                        className="grid grid-cols-2 sm:grid-cols-3   md:grid-cols-5 gap-2"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {bestsellerProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                variants={itemVariants}
                                className="relative"
                            >
                                <Link to={`/product/${product.id}`}>
                                    <Item product={product} />
                                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                        Bestseller
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {!loading && bestsellerProducts.length > 0 && (
                    <motion.div 
                        className="text-center mt-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                    >
                        <Link 
                            to="/search" 
                            className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            View All Products
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

export default BestSeller;