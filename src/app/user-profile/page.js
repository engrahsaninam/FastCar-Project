import AppBar from '@/components/AppBar'
import React from 'react'
import UserProfile from './userProfileSection'
import Footer from '@/components/HomePage/Footer'

const userProfile = () => {
 
   
  return (
    <div className='bg-red-50/85 ]'>
         <AppBar/>
         <UserProfile/>
         <Footer/>
    </div>
  )
}

export default userProfile