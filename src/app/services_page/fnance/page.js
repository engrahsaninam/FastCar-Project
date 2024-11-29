"use client"
import AppBar from '@/components/AppBar2'
import React from 'react'
import RefundPolicyPage from '../safepurchase/RefundPolicySafe'
import Footer from '@/components/HomePage/Footer'

const refund = () => {
  
  return (
    <div>
      <AppBar/>
     <RefundPolicyPage/>
     <Footer/>
    </div>
  )
}

export default refund