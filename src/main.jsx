import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import MainLayout from './layout/MainLayout.jsx'
import Home from './pages/Home.jsx'
import SignUp from './firebase/SignUp.jsx'
import AuthProvider from './firebase/AuthProvider.jsx'
import AddFee from './manage/AddFee.jsx'
import PrivateRoute from './firebase/PrivateRoute.jsx'
import AddAttendance from './manage/AddAttendance.jsx'
import AddExam from './manage/AddExam.jsx'
import AddNotice from './manage/AddNotice.jsx'
import AddResult from './manage/AddResult.jsx'
import Exam from './pages/Exam.jsx'
import Sheet from './pages/Sheet.jsx'
import Result from './pages/Result.jsx'
import Profile from './pages/Profile.jsx'
import Report from './pages/Report.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import StudentLogin from './firebase/StudentLogin.jsx'
import AdminLogin from './firebase/AdminLogin.jsx'
import Login from './firebase/Login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout></MainLayout>}>
          <Route index element={<Home></Home>} ></Route>
          <Route path='/signup' element={<SignUp></SignUp>} ></Route>
          <Route path='/manage' element={<AdminLogin></AdminLogin>} ></Route>
          <Route path='/profile' element={<PrivateRoute><Profile></Profile></PrivateRoute>}> </Route>
          <Route path='/login' element={<Login></Login>}> </Route>
          <Route path='/report' element={<PrivateRoute><Report></Report></PrivateRoute>}> </Route>
          <Route path='/exam' element={<PrivateRoute><Exam></Exam></PrivateRoute>}> </Route>
          <Route path='/result' element={<PrivateRoute><Result></Result></PrivateRoute>}> </Route>
          <Route path='/sheet' element={<PrivateRoute><Sheet></Sheet></PrivateRoute>}> </Route>
          <Route path='/leaderboard' element={<PrivateRoute><Leaderboard></Leaderboard></PrivateRoute>}> </Route>

          <Route path='/add-fee' element={<PrivateRoute><AddFee></AddFee></PrivateRoute>}> </Route>
          <Route path='/add-attendance' element={<PrivateRoute><AddAttendance></AddAttendance></PrivateRoute>}> </Route>
          <Route path='/add-exam' element={<PrivateRoute><AddExam></AddExam></PrivateRoute>}> </Route>
          <Route path='/add-notice' element={<PrivateRoute><AddNotice></AddNotice></PrivateRoute>}> </Route>
          <Route path='/add-result' element={<PrivateRoute><AddResult></AddResult></PrivateRoute>}> </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
