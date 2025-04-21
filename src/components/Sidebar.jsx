import React from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'



function Sidebar({ active , setActive, navItems }) {

  return (
    <>
      {/* Mobile Dropdown Sidebar */}
      <div className="md:hidden fixed top-16 left-0 w-full z-50">
        <Menu as="div" className="relative w-full">
          <MenuButton className="flex items-center justify-between w-full bg-gray-200 px-4 py-3 text-left rounded-md shadow-md">
            <span>Menu</span>
            <FaChevronDown className="text-gray-500" />
          </MenuButton>

          <Transition
            enter="transition duration-200 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-150 ease-in"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <MenuItems className="absolute left-0 mt-2 w-full origin-top bg-gray-200 rounded-md shadow-lg focus:outline-none z-50">
              {navItems.map((item) => (
                <MenuItem key={item.label}>
                  {({ active: isHovered }) => (
                    <div
                      onClick={() => setActive(item.label)}
                      className={`flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition-all duration-200 
                        ${active === item.label || isHovered
                          ? 'bg-blue-200 text-black'
                          : 'text-gray-700 hover:bg-blue-100'}`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[220px] h-[80vh] border border-gray-400 rounded-md py-3 px-1">
        <ul className="flex flex-col gap-3">
          {navItems.map((item) => (
            <li
              key={item.label}
              onClick={() => setActive(item.label)}
              className={`flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer transition-all duration-200
                ${active === item.label
                  ? 'bg-blue-200 text-black'
                  : 'text-gray-700 hover:bg-blue-100 hover:text-black'}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export { Sidebar }
