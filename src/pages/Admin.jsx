// import { Sidebar } from 'lucide-react'
import { Sidebar as SB } from '../components/Sidebar'
import React from 'react'
import AddProductForm from '../components/AddProductForm'
import { FaList, FaPlus, FaShoppingBag } from 'react-icons/fa'
import ListProduct from '../components/ListProduct'
function Admin() {
  const navItems = [
    { label: 'List Product', icon: <FaList /> },
    { label: 'Add Products', icon: <FaPlus /> },
    { label: 'Orders', icon: <FaShoppingBag /> },
  ]
  const [active, setActive] = React.useState('List Product')



  return (
    <div className='mt-2 flex gap-3 relative'>
      <SB active={active} setActive={setActive} navItems={navItems} />
      <section className='w-full mt-12 md:mt-0 '>
        {
          active === 'List Product' &&
          <ListProduct/>
        }

        {active === 'Add Products' &&
          <AddProductForm />
        }
      </section>

    </div>
  )
}

export default Admin  