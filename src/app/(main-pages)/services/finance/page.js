"use client"
import AppBar from '@/components/AppBar'
import React from 'react'
import RefundPolicyPage from '../safe-purchase/RefundPolicySafe'
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