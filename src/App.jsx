import React, { useState,useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import { SignIn, SignUp, Home, ForgotPassword, PageNotFound, Products, Admin, Profile, Product } from './pages'
import FancyLoading from './components/Loading'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { getProducts } from './redux/features/productSlice'

function App() {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const { loading, isAuthenticated, user } = useAuth()

    useEffect(() => {
      dispatch(getProducts())
    })

  if (loading) return <FancyLoading />
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header open={open} setOpen={setOpen} />
      
      <main className={`flex-grow ${isAuthenticated ? "mt-16" : "mt-24"} w-full  sm:w-[80%] mx-auto`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/search" element={<Products />} />
          <Route path="/product/:id" element={<Product />} />
          {user?.role === "admin" && (
            <Route path="/admin" element={<Admin />} />
          )}
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>

      <Footer />
      <Toaster />
    </div>
  )
}

export default App