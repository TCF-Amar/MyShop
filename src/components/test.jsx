import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../redux/features/productSlice';
import Item from '../components/Item';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

function Products() {
    const dispatch = useDispatch();
    const { c: categoryParam } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    // Get products from Redux store
    const { products, loading } = useSelector((state) => state.product);

    // Filter states
    const [filters, setFilters] = useState({
        category: categoryParam || '',
        priceRange: { min: '', max: '' },
        gender: '',
        search: searchParams.get('q') || '',
        brand: '',
        material: '',
        colors: [],
    });
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [showFilters, setShowFilters] = useState(false);
    const [sortOrder, setSortOrder] = useState('');

    // Fetch products on mount
    useEffect(() => {
        if (products.length === 0) {
            dispatch(getProducts());
        }
    }, [dispatch, products.length]);

    // Apply filters when they change
    useEffect(() => {
        let result = [...products];

        // Apply search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            result = result.filter(product =>
                product.name?.toLowerCase().includes(searchTerm) ||
                product.description?.toLowerCase().includes(searchTerm) ||
                product.brand?.toLowerCase().includes(searchTerm) ||
                product.subCategory?.toLowerCase().includes(searchTerm)
            );
        }

        // Apply category filter
        if (filters.category) {
            result = result.filter(product =>
                product.category?.toLowerCase() === filters.category.toLowerCase()
            );
        }

        // Apply gender filter
        if (filters.gender) {
            result = result.filter(product =>
                product.gender?.toLowerCase() === filters.gender.toLowerCase()
            );
        }

        // Apply price range filter
        if (filters.priceRange.min || filters.priceRange.max) {
            result = result.filter(product => {
                const price = product.discountedPrice || product.price;
                const min = filters.priceRange.min ? Number(filters.priceRange.min) : 0;
                const max = filters.priceRange.max ? Number(filters.priceRange.max) : Infinity;
                return price >= min && price <= max;
            });
        }

        // Apply brand filter
        if (filters.brand) {
            const brandTerm = filters.brand.toLowerCase();
            result = result.filter(product =>
                product.brand?.toLowerCase().includes(brandTerm)
            );
        }

        // Apply material filter
        if (filters.material) {
            const materialTerm = filters.material.toLowerCase();
            result = result.filter(product =>
                product.material?.toLowerCase().includes(materialTerm)
            );
        }

        // Apply colors filter
        if (filters.colors.length > 0) {
            result = result.filter(product =>
                filters.colors.some(color =>
                    product.colors?.includes(color) ||
                    product.color?.toLowerCase() === color.toLowerCase()
                )
            );
        }

        setFilteredProducts(result);
    }, [filters, products]);

    // Update URL when search changes
    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.search) params.set('q', filters.search);
        if (filters.category) params.set('category', filters.category);
        if (filters.tags) params.set('q', filters.tag);

        if (filters.gender) params.set('gender', filters.gender);
        setSearchParams(params);
    }, [filters, setSearchParams]);

    // Handle filter changes
    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            category: '',
            priceRange: { min: '', max: '' },
            gender: '',
            search: '',
            brand: '',
            material: '',
            colors: [],
        });
        setSortOrder('');
        dispatch(clearFilters());
    };

    // Sort products
    const sortProducts = (products) => {
        if (!sortOrder) return products;

        return [...products].sort((a, b) => {
            const priceA = a.discountedPrice || a.price;
            const priceB = b.discountedPrice || b.price;
            return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
        });
    };

    const displayProducts = sortProducts(filteredProducts.length > 0 ? filteredProducts : products);

    const categories = ['T-Shirts', 'Shirts', 'Pants', 'Shoes', 'Jeans'];
    const genders = ['men', 'women', 'unisex', 'kids'];

    return (
        <div className="min-h-[90vh] pt-4">


            <div className="max-w-7xl mx-auto md:px-4 py-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Filters Sidebar */}
                    <div className="hidden md:block w-64">
                        <div className="sticky top-24 bg-white p-6 rounded-lg shadow-sm border">
                            {/* Search */}
                            <div className="mb-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        placeholder="Search products..."
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                    />
                                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
                                    Categories
                                </h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleFilterChange('category', '')}
                                        className={`w-full text-left px-2 py-1.5 rounded-md transition ${!filters.category
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        All Products
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => handleFilterChange('category', cat)}
                                            className={`w-full text-left px-2 py-1.5 rounded-md transition ${filters.category === cat
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Gender Filter */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
                                    Gender
                                </h3>
                                <div className="space-y-2">
                                    {genders.map((g) => (
                                        <button
                                            key={g}
                                            onClick={() => handleFilterChange('gender', g)}
                                            className={`w-full text-left px-2 py-1.5 rounded-md transition capitalize ${filters.gender === g
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
                                    Price Range
                                </h3>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.priceRange.min}
                                        onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, min: e.target.value })}
                                        className="w-full px-3 py-1.5 border rounded-md"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.priceRange.max}
                                        onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: e.target.value })}
                                        className="w-full px-3 py-1.5 border rounded-md"
                                    />
                                </div>
                            </div>

                            {/* Brand Filter */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
                                    Brand
                                </h3>
                                <input
                                    type="text"
                                    placeholder="Search brands..."
                                    value={filters.brand}
                                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                                    className="w-full px-3 py-1.5 border rounded-md"
                                />
                            </div>

                            {/* Material Filter */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
                                    Material
                                </h3>
                                <input
                                    type="text"
                                    placeholder="Search materials..."
                                    value={filters.material}
                                    onChange={(e) => handleFilterChange('material', e.target.value)}
                                    className="w-full px-3 py-1.5 border rounded-md"
                                />
                            </div>

                            {/* Color Filter */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
                                    Colors
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Gray', 'Brown'].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => {
                                                const updatedColors = filters.colors.includes(color)
                                                    ? filters.colors.filter(c => c !== color)
                                                    : [...filters.colors, color];
                                                handleFilterChange('colors', updatedColors);
                                            }}
                                            className={`px-3 py-1 rounded-full text-sm border transition-colors
                        ${filters.colors.includes(color)
                                                    ? 'bg-blue-50 text-blue-600 border-blue-600'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Reset Filters */}
                            <button
                                onClick={resetFilters}
                                className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>

                    {/* Mobile Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ x: "-100%", opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: "-100%", opacity: 0 }}
                                transition={{ type: "spring", damping: 20 }}
                                className="fixed inset-0 z-40 md:hidden"
                            >
                                {/* Backdrop */}
                                <div
                                    className="absolute inset-0 bg-black/30 md:hidden"
                                    onClick={() => setShowFilters(false)}
                                />

                                {/* Filter Content */}
                                <div className="absolute inset-y-0 left-0 w-80 bg-white md:w-64 md:relative md:block p-6 overflow-y-auto">
                                    <div className="flex items-center justify-between mb-6 md:hidden">
                                        <h2 className="text-lg font-semibold">Filters</h2>
                                        <button onClick={() => setShowFilters(false)}>
                                            <FaTimes className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Search */}
                                    <div className="mb-6">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={filters.search}
                                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                                placeholder="Search products..."
                                                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                            />
                                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Categories */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
                                            Categories
                                        </h3>
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => handleFilterChange('category', '')}
                                                className={`w-full text-left px-2 py-1.5 rounded-md transition ${!filters.category
                                                        ? 'bg-blue-50 text-blue-600'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                            >
                                                All Products
                                            </button>
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat}
                                                    onClick={() => handleFilterChange('category', cat)}
                                                    className={`w-full text-left px-2 py-1.5 rounded-md transition ${filters.category === cat
                                                            ? 'bg-blue-50 text-blue-600'
                                                            : 'text-gray-600 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Gender Filter */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
                                            Gender
                                        </h3>
                                        <div className="space-y-2">
                                            {genders.map((g) => (
                                                <button
                                                    key={g}
                                                    onClick={() => handleFilterChange('gender', g)}
                                                    className={`w-full text-left px-2 py-1.5 rounded-md transition capitalize ${filters.gender === g
                                                            ? 'bg-blue-50 text-blue-600'
                                                            : 'text-gray-600 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Range */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
                                            Price Range
                                        </h3>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                value={filters.priceRange.min}
                                                onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, min: e.target.value })}
                                                className="w-full px-3 py-1.5 border rounded-md"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                value={filters.priceRange.max}
                                                onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: e.target.value })}
                                                className="w-full px-3 py-1.5 border rounded-md"
                                            />
                                        </div>
                                    </div>

                                    {/* Brand Filter */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
                                            Brand
                                        </h3>
                                        <input
                                            type="text"
                                            placeholder="Search brands..."
                                            value={filters.brand}
                                            onChange={(e) => handleFilterChange('brand', e.target.value)}
                                            className="w-full px-3 py-1.5 border rounded-md"
                                        />
                                    </div>

                                    {/* Material Filter */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
                                            Material
                                        </h3>
                                        <input
                                            type="text"
                                            placeholder="Search materials..."
                                            value={filters.material}
                                            onChange={(e) => handleFilterChange('material', e.target.value)}
                                            className="w-full px-3 py-1.5 border rounded-md"
                                        />
                                    </div>

                                    {/* Color Filter */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
                                            Colors
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Gray', 'Brown'].map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => {
                                                        const updatedColors = filters.colors.includes(color)
                                                            ? filters.colors.filter(c => c !== color)
                                                            : [...filters.colors, color];
                                                        handleFilterChange('colors', updatedColors);
                                                    }}
                                                    className={`px-3 py-1 rounded-full text-sm border transition-colors
                            ${filters.colors.includes(color)
                                                            ? 'bg-blue-50 text-blue-600 border-blue-600'
                                                            : 'border-gray-300 hover:border-gray-400'
                                                        }`}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Reset Filters */}
                                    <button
                                        onClick={resetFilters}
                                        className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {/* Mobile Filter Toggle & Sort */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <button
                                onClick={() => setShowFilters(true)}
                                className="md:hidden flex items-center justify-center gap-2 px-4 py-2 bg-white border rounded-lg"
                            >
                                <FaFilter className="w-4 h-4" />
                                Filters
                            </button>

                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="px-3 py-2 bg-white border rounded-lg"
                                >
                                    <option value="">Relevance</option>
                                    <option value="asc">Price: Low to High</option>
                                    <option value="desc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-2" />
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : displayProducts.length === 0 ? (
                            <div className="text-center py-12">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No products found
                                </h3>
                                <p className="text-gray-600">
                                    Try adjusting your filters or search term
                                </p>
                            </div>
                        ) : (
                            <motion.div
                                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                                layout
                            >
                                <AnimatePresence>
                                    {displayProducts.map((product) => (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <Link to={`/product/${product.id}`}>
                                                <Item product={product} />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Products;
