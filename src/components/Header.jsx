import React, { useState } from 'react'
import logo from '../assets/images/mainlogo.png'
import flag from "../assets/images/flag.png"
import { ShoppingBag, User, Menu as MenuIcon } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import {  signOutUser } from '../redux/features/userSlice'
import MobileMenu from './MobileMenu'
import { FaSearch } from 'react-icons/fa'

function Header({ open, setOpen }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth()
    const user = useSelector((state) => state.user.user)

    const handleSignout = async () => {
        try {
            await dispatch(signOutUser());
            toast.success("Logged out successfully");
            
        } catch (error) {
            toast.error(error.message);

            console.error('Error signing out:', error);
        }
    }

    return (
        <>
            {!isAuthenticated &&
                <div className='fixed text-sm top-0 left-0 right-0 h-6 bg-gray-600 border-b border-gray-300 flex items-center justify-between px-3 gap-2 z-10'>
                    <div className='flex items-center justify-center gap-2'>
                        <img src={flag} className='h-4' alt="" />
                        <span className='text-white'>India</span>
                    </div>
                    <span className="ai-dice1">
                        <Link to={'/signin'} className='text-white'>Sign In</Link> <span className='text-white'>|</span> <Link to={'/signup'} className='text-white'>Create Account</Link>
                    </span>
                </div>
            }
            <header className={`fixed z-10 ${!isAuthenticated ? 'top-6' : 'top-0'} left-0 right-0 h-16 bg-gray-100 border-b border-gray-300 flex items-center justify-between`}>
                <div className='flex items-center justify-center gap-4 ml-4'>
                    <Link to={'/'} className='flex items-center justify-center -gap-4 mx-auto'>
                        <img src={logo} alt="Logo" className="h-18 " />
                        <span className='font-[dm-serif-display-regular-italic] font-bold text-2xl'>MyShop</span>
                    </Link>
                    <div className='hidden md:flex items-center justify-center gap-4 mx-auto'>
                        <NavLink to="/" className={({ isActive }) =>
                            isActive
                                ? 'text-[#1fd4a7] border-b-2 border-[#1fd4a7] transition-all duration-200'
                                : 'text-gray-600 hover:text-gray-900 transition-all duration-200'}>
                            Home
                        </NavLink>
                        
                        <NavLink to="/search" className={({ isActive }) =>
                            isActive
                                ? 'text-[#1fd4a7] border-b-2 border-[#1fd4a7] transition-all duration-200'
                                : 'text-gray-600 hover:text-gray-900 transition-all duration-200'}>
                            Products
                        </NavLink>
                        {user?.role === 'admin' && 
                            <NavLink to="/admin" className={({ isActive }) =>
                                isActive
                                    ? 'text-[#1fd4a7] border-b-2 border-[#1fd4a7] transition-all duration-200'
                                    : 'text-gray-600 hover:text-gray-900 transition-all duration-200'}>
                                Admin
                            </NavLink>
                        }
                    </div>
                </div>
               <Link to='/search' className='px-4 text-gray-500 '>Search</Link>

             
                <div className='flex items-center justify-center gap-4 ml-auto mr-4'>
                    {isAuthenticated &&
                        <Menu as="div" className="relative hidden md:inline-block text-left">
                            <MenuButton className="inline-flex w-full justify-center items-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-gray-900 ring-gray-300 ring-inset">
                                {user?.photoURL ? 
                                    <img src={user.photoURL} alt="user" className='w-8 h-8 rounded-full' /> 
                                    : <User className='cursor-pointer' />
                                }
                                {user?.displayName}
                                <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                            </MenuButton>
                            <MenuItems
                                transition
                                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                            >
                                <div className="py-1">
                                    <MenuItem>
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                        >
                                            Profile
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link
                                            to="/orders"
                                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                        >
                                            Orders
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link
                                            to="/history"
                                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                        >
                                            History
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Button className="block w-full text-left px-4 py-2 text-sm text-red-600 data-focus:bg-gray-100 data-focus:outline-hidden" onClick={handleSignout}>
                                            Sign Out
                                        </Button>
                                    </MenuItem>
                                </div>
                            </MenuItems>
                        </Menu>
                    }
                    <div className='relative cursor-pointer' onClick={() => setOpen(!open)}>
                        <ShoppingBag className='cursor-pointer' />
                        <span className='absolute top-4 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs'>3</span>
                    </div>
                    <button 
                        className='md:hidden cursor-pointer'
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <MenuIcon className='h-6 w-6' />
                    </button>
                </div>

            </header>

            <MobileMenu 
                isOpen={isMobileMenuOpen}
                setIsOpen={setIsMobileMenuOpen}
                handleSignout={handleSignout}
            />
        </>
    )
}

export default Header