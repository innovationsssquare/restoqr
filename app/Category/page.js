import FoodItemList from '@/components/Categorycomponent/Categorylistcard'
import FoodCategories from '@/components/ui/Homecomponets/Categories'
import Header from '@/components/ui/Homecomponets/Header'
import React from 'react'

const page = () => {
  return (
    <section>
        <Header/>
       <FoodCategories/> 
        <FoodItemList/>
    </section>
  )
}

export default page