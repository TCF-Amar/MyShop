import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import AddFakeClothingData from '../components/AddFakeClothingData'

function Home() {
    return (
        <div className='mt-2'>
            <Hero />
            
            <LatestCollection />
            <br />
            <hr />
            <BestSeller />
            <br />  
            <hr />
            <AddFakeClothingData/>
        </div>
    )
}

export default Home