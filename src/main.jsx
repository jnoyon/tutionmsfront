import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import MainLayout from './layout/MainLayout.jsx'
import Home from './pages/Home.jsx'
import SignUp from './firebase/SignUp.jsx'
import AdmissionForm from './pages/AdmissionForm.jsx'
import SignIn from './firebase/SignIn.jsx'
import AuthProvider from './firebase/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout></MainLayout>}>
          <Route index element={<Home></Home>} ></Route>
          <Route path='/signup' element={<SignUp></SignUp>} ></Route>
          <Route path='/signin' element={<SignIn></SignIn>} ></Route>
          <Route path='/admit' element={<AdmissionForm></AdmissionForm>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
