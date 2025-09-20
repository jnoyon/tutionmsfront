import React from 'react'
import Header from '../shared/Header'
import { Outlet } from 'react-router'
import Footer from '../shared/Footer'

export default function MainLayout() {
  return (
    <div className='bg-gradient-to-l from-yellow-50 via-red-50 to-blue-50'>
        <Header></Header>
        <Outlet></Outlet>
        <Footer></Footer>
    </div>
  )
}
