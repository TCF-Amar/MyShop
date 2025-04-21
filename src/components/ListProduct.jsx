import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getProducts } from '../redux/features/productSlice';
import { useDispatch } from 'react-redux';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function ListProduct() {
  const dispatch = useDispatch();
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleAction = (productId) => {
    setActiveMenu(activeMenu === productId ? null : productId);
  };

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const products = useSelector((state) => state.product.products);

  return (
    <div>
      {products.map((product, index) => (
        <motion.div 
          key={product.id} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center justify-between gap-3 hover:scale-[101%] transition-all duration-300"
        >
          <motion.img 
            whileHover={{ scale: 1.1 }}
            src={product.imageUrls[0]} 
            className="w-10 object-cover mb-2" 
            alt="" 
          />
          <div className='flex-1'>
            <h2 className="font-semibold">{product.name}</h2>
            <p className="text-gray-800 font-semibold">${product.discountedPrice}</p>
            <div className='flex gap-2'>
              <p className="text-gray-600 line-through">${product.price}</p>
              <p className="text-green-700">{product.discountedPercentage}% off</p>
            </div>
          </div>
          <div className='relative'>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className='text-xl rotate-90 font-extrabold cursor-pointer' 
              onClick={() => toggleAction(product.id)}
            >
              ...
            </motion.button>
            <AnimatePresence>
              {activeMenu === product.id && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-[130px] bg-gray-200 right-0 p-2 rounded"
                >
                  <motion.button 
                    
                    className='flex items-center gap-2 w-full p-2 duration-300 rounded hover:bg-gray-400'
                  >
                    <FaEdit /><p>Update</p>
                  </motion.button>
                  <motion.button 
                    
                    className='flex items-center gap-2 w-full p-2 duration-300 rounded hover:bg-gray-400'
                  >
                    <FaTrashAlt /><p>Delete</p>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default ListProduct