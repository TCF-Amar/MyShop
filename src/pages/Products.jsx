import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import Item from '../components/Item';
import { FaFilter } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading } = useSelector((state) => state.product);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const sort = searchParams.get('sort');

  useEffect(() => {
    if (!products || products.length === 0) return;

    const query = searchParams.get('q')?.toLowerCase();
    const gender = searchParams.get('gender')?.toLowerCase();
    const category = searchParams.get('category')?.toLowerCase();

    const filtered = products.filter((product) => {
      const matchesQuery =
        !query ||
        product.title?.toLowerCase().includes(query) ||
        product.category?.map(cat => cat.toLowerCase()).includes(query) ||
        product.tags?.some((tag) => tag.toLowerCase().includes(query));

      const matchesGender =
        !gender || product.gender?.toLowerCase() === gender;

      const matchesCategory =
        !category || product.category?.map(cat => cat.toLowerCase()).includes(category);
      
      
      
      
      if (sort === 'low-to-high') {
        products.discountPrice.sort((a, b) => a.discountPrice - b.discountPrice);
      } else if (sort === 'high-to-low') {
        products.discountPrice.sort((a, b) => b.discountPrice - a.discountPrice);
      } 
      
      return matchesQuery && matchesGender && matchesCategory;
    });


    setFilteredProducts(filtered);
  }, [products, searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <h1 className="text-xl font-semibold animate-pulse">Loading...</h1>
      </div>
    );
  }

  const updateFilter = (key, value) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    if (currentParams[key] === value) {
      delete currentParams[key]; // remove filter if same
    } else {
      currentParams[key] = value;
    }
    setSearchParams(currentParams);
  };

  return (
    <>
      <div className=' mt-2 flex justify-center items-center'> 
        <input type="text" onChange={(e) => updateFilter('q', e.target.value)} className='border-2 border-[#1fd4a7] rounded-md px-2 py-1 w-full mx-1 md:w-1/2 outline-none' placeholder="Search by title, category, or tag" />
      </div>
      <motion.div
        className=" flex gap-4 px-4 relative"
        initial={{ opacity: 0, }}
        animate={{ opacity: 1, }}
        transition={{ duration: 0.3 }}
      >
        {/* Sidebar Filters */}
        <motion.div
          className="w-[200px] lg:flex flex-col gap-3 absolute lg:relative hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-gray-600 uppercase font-semibold flex items-center gap-2 text-xl mb-2 ">
            <div className='flex items-center gap-2 py-1'>

              <FaFilter /> Filters
            </div>
          </h3>

          <div className="border  px-2 py-3 shadow-sm">
            <div className="text-gray-700 font-semibold mb-2 text-base">
              Gender
            </div>
            <hr className="mb-2" />
            <div className="flex flex-col gap-2 text-sm">
              {['men', 'women', 'kids'].map((g) => (
                <button
                  key={g}
                  className={`py-1 px-2 rounded transition-all text-left ${searchParams.get('gender') === g
                    ? 'bg-blue-100 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  onClick={() => updateFilter('gender', g)}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>


          <div className="border  px-2 py-3 shadow-sm">
            <div className="text-gray-700 font-semibold mb-2 text-base">
              Category
            </div>
            <hr className="mb-2" />
            <div className="flex flex-col gap-2 text-sm">
              {['topware', 'bottomware', 'footware', 'winterware', 'summerware'].map((c) => (
                <button
                  key={c}
                  className={`py-1 px-2 rounded transition-all text-left ${searchParams.get('category') === c
                    ? 'bg-blue-100 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  onClick={() => updateFilter('category', c)}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>

          </div>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          className="flex-1 flex flex-col gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className='flex   lg:justify-end justify-end items-center  p-3'>
            <FaFilter className='lg:hidden w-8 h-8 fixed bottom-5 right-2 text-blue-600 z-[100]' />

            <div>
              <label htmlFor="" className='mr-2 font-semibold'>Sort By:</label>
              <select name="" id="" className='bg-gray-100 px-2 py-1' onChange={(e) => updateFilter('sort', e.target.value)}>
                <option value="relevance">Price: Relevance</option>
                <option value="low-to-high">Price: Low-To-High</option>
                <option value="high-to-low">Price: High-To-Low</option>
              </select>
            </div>
          </div>
          {filteredProducts.length > 0 ? (
            <motion.div
              className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 "
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.07,
                    delayChildren: 0.2,
                  },
                },
              }}
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <Link to={`/product/${product.id}`}>
                    <Item product={product} />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center text-gray-500 font-medium py-10">
              No products found
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}

export default Products;
