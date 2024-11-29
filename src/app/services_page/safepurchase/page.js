import AppBar from '@/components/AppBar2'
import React from 'react'
import RefundPolicyPage from './RefundPolicySafe'
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