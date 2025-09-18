import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import MainLayout from './layout/MainLayout.jsx'
import Home from './pages/Home.jsx'
import SignUp from './firebase/SignUp.jsx'
import AuthProvider from './firebase/AuthProvider.jsx'
import AddFee from './manage/AddFee.jsx'
import Login from './firebase/Login.jsx'
import PrivateRoute from './firebase/PrivateRoute.jsx'
import AddAttendance from './manage/AddAttendance.jsx'
import AddExam from './manage/AddExam.jsx'
import AddNotice from './manage/AddNotice.jsx'
import AddResult from './manage/AddResult.jsx'
import ManagerRoute from './firebase/ManagerRoute.jsx'
import StudentRoute from './firebase/StudentRoute.jsx'
import Exam from './pages/Exam.jsx'
import Sheet from './pages/Sheet.jsx'
import Result from './pages/Result.jsx'
import Profile from './pages/Profile.jsx'
import Report from './pages/Report.jsx'
import Leaderboard from './pages/Leaderboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout></MainLayout>}>
          <Route index element={<Home></Home>} ></Route>
          <Route path='/signup' element={<SignUp></SignUp>} ></Route>
          <Route path='/login' element={<Login></Login>} ></Route>

          <Route path='/profile' element={<StudentRoute><Profile></Profile></StudentRoute>}> </Route>

          <Route path='/report' element={<StudentRoute><Report></Report></StudentRoute>}> </Route>
          <Route path='/exam' element={<StudentRoute><Exam></Exam></StudentRoute>}> </Route>
          <Route path='/result' element={<StudentRoute><Result></Result></StudentRoute>}> </Route>
          <Route path='/sheet' element={<StudentRoute><Sheet></Sheet></StudentRoute>}> </Route>
          <Route path='/leaderboard' element={<StudentRoute><Leaderboard></Leaderboard></StudentRoute>}> </Route>

          <Route path='/add-fee' element={<PrivateRoute><AddFee></AddFee></PrivateRoute>}> </Route>
          <Route path='/add-attendance' element={<PrivateRoute><AddAttendance></AddAttendance></PrivateRoute>}> </Route>
          <Route path='/add-exam' element={<ManagerRoute><AddExam></AddExam></ManagerRoute>}> </Route>
          <Route path='/add-notice' element={<ManagerRoute><AddNotice></AddNotice></ManagerRoute>}> </Route>
          <Route path='/add-result' element={<ManagerRoute><AddResult></AddResult></ManagerRoute>}> </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
