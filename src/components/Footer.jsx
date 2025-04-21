import React from 'react';
import { Link, useNavigate, useSearchParams, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import logo from '../assets/images/mainlogo.png';

function Footer() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleFilterNavigation = (path, params) => {
        // Preserve existing search params and add new ones
        const newParams = new URLSearchParams(searchParams);
        Object.entries(params).forEach(([key, value]) => {
            newParams.set(key, value);
        });
        navigate(`${path}?${newParams.toString()}`);
    };

    const footerLinks = {
        shop: [
            { 
                name: 'All Products', 
                path: '/search',
                params: {} 
            },
            { 
                name: "Men's Collection", 
                path: '/search',
                params: { gender: 'men' }
            },
            { 
                name: "Women's Collection", 
                path: '/search',
                params: { gender: 'women' }
            },
            { 
                name: "Kids' Collection", 
                path: '/search',
                params: { gender: 'kids' }
            },
            { 
                name: 'Best Sellers', 
                path: '/search',
                params: { bestseller: 'true' }
            }
        ],
        company: [
            { name: 'About Us', path: '/about' },
            { name: 'Contact', path: '/contact' },
            { name: 'FAQ', path: '/faq' },
            { name: 'Privacy Policy', path: '/privacy' },
            { name: 'Terms & Conditions', path: '/terms' }
        ],
        account: [
            { name: 'My Account', path: '/profile' },
            { name: 'My Orders', path: '/orders' },
            { name: 'Saved Items', path: '/wishlist' },
            { name: 'Track Order', path: '/track-order' }
        ]
    };

    const socialLinks = [
        { icon: <FaFacebook className="w-5 h-5" />, url: 'https://facebook.com', name: 'Facebook' },
        { icon: <FaTwitter className="w-5 h-5" />, url: 'https://twitter.com', name: 'Twitter' },
        { icon: <FaInstagram className="w-5 h-5" />, url: 'https://instagram.com', name: 'Instagram' },
        { icon: <FaLinkedin className="w-5 h-5" />, url: 'https://linkedin.com', name: 'LinkedIn' }
    ];

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4 hover:opacity-90 transition-opacity">
                            <img src={logo} alt="MyShop Logo" className="h-10" />
                            <span className="font-[dm-serif-display-regular-italic] text-white font-bold text-2xl">
                                MyShop
                            </span>
                        </Link>
                        <p className="text-gray-400 mb-6">
                            Discover the latest fashion trends and express your unique style with our curated collection of clothing and accessories.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    className="text-gray-400 hover:text-white transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Shop</h3>
                        <ul className="space-y-2">
                            {footerLinks.shop.map((link, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => handleFilterNavigation(link.path, link.params)}
                                        className="text-gray-400 hover:text-white transition-colors block py-1 text-left w-full"
                                    >
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-white transition-colors block py-1"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Account</h3>
                        <ul className="space-y-2">
                            {footerLinks.account.map((link, index) => (
                                <li key={index}>
                                    <NavLink
                                        to={link.path}
                                        className="text-gray-400 hover:text-white transition-colors block py-1"
                                    >
                                        {link.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm mb-4 md:mb-0">
                            © {new Date().getFullYear()} MyShop. All rights reserved.
                        </p>
                        {/* Payment Methods */}
                        <div className="flex space-x-4">
                            <img 
                                src="https://cdn-icons-png.flaticon.com/512/349/349221.png" 
                                alt="Visa" 
                                className="h-8 w-auto grayscale hover:grayscale-0 transition-all" 
                            />
                            <img 
                                src="https://cdn-icons-png.flaticon.com/512/349/349228.png" 
                                alt="MasterCard" 
                                className="h-8 w-auto grayscale hover:grayscale-0 transition-all" 
                            />
                            <img 
                                src="https://cdn-icons-png.flaticon.com/512/349/349230.png" 
                                alt="PayPal" 
                                className="h-8 w-auto grayscale hover:grayscale-0 transition-all" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;