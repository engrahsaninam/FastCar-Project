import AppBar from '@/components/AppBar'
import React from 'react'
import Footer from '@/components/HomePage/Footer'
import SafePurchasePage from './SafePurchaseOnly'

const safepurchase = () => {
  
  
  return (
    <div>
      <AppBar/>
      <SafePurchasePage/>
      <Footer/>
   
    </div>
  )
}

export default safepurchase