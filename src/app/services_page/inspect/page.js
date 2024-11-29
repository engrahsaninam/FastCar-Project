"use client"
import AppBar from '@/components/AppBar2'
import Footer from '@/components/HomePage/Footer'
import FAQSection from '@/components/Inspect/Faq'
import GuaranteeSection from '@/components/Inspect/Header'
import InspectionDetails from '@/components/Inspect/InspectionDetails'
import CarAudit from '@/components/Inspect/Section2'
import CustomerReviewsSection from '@/components/Inspect/SectionThree'


import React from 'react'

const inspect = () => {

  
    
    
    
  return (
    <div>
        <AppBar/>
        <GuaranteeSection/>
        <CarAudit/>
        <CustomerReviewsSection/>
        <InspectionDetails/>
        <FAQSection/>
        <Footer/>
       
        
    </div>
  )
}

export default inspect