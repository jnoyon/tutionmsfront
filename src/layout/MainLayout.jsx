import React from 'react'
import Header from '../shared/Header'
import { Outlet } from 'react-router'
import Footer from '../shared/Footer'

export default function MainLayout() {
  return (
    <div>
        <Header></Header>
        <Outlet></Outlet>
        <Footer></Footer>
    </div>
  )
}
