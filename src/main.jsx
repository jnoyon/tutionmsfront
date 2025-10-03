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
import AddNotice from './manage/AddNotice.jsx'
import Sheet from './pages/Sheet.jsx'
import Profile from './pages/Profile.jsx'
import Report from './pages/Report.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Login from './firebase/Login.jsx'
import Students from './manage/Students.jsx'
import AdminRoute from './firebase/AdminRoute.jsx'
import QuizList from './quiz/QuizList.jsx'
import QuizPage from './quiz/QuizPage.jsx'
import AddQuiz from './quiz/AddQuiz.jsx'
import QuizResult from './quiz/QuizResult.jsx'
import ManageQuiz from './quiz/ManageQuiz.jsx'
import EditQuiz from './quiz/EditQuiz.jsx'
import Videos from './pages/Videos.jsx'
import RecentQuiz from './quiz/RecentQuiz.jsx'
import AddVideo from './manage/AddVideo.jsx'
import HtmlEditor from './pages/HtmlEditor.jsx'
import PublicCreateQuiz from './public-quiz/PublicCreateQuiz.jsx'
import PublicQuizList from './public-quiz/PublicQuizList.jsx'
import PublicQuizPage from './public-quiz/PublicQuizpage.jsx'
import PublicEditQuiz from './public-quiz/PublicEditQuiz.jsx'
import PublicManageQuiz from './public-quiz/PublicManageQuiz.jsx'
import PublicQuizResult from './public-quiz/PublicQuizResult.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout></MainLayout>}>
          <Route index element={<Home></Home>} ></Route>
          <Route path='/signup' element={<SignUp></SignUp>} ></Route>


          <Route path='/profile' element={<PrivateRoute><Profile></Profile></PrivateRoute>}> </Route>
          <Route path='/login' element={<Login></Login>}> </Route>
          <Route path='/report' element={<PrivateRoute><Report></Report></PrivateRoute>}> </Route>
          <Route path='/recentresults' element={<AdminRoute><RecentQuiz></RecentQuiz></AdminRoute>}> </Route>

          <Route path='/quiz' element={<PrivateRoute><QuizList></QuizList></PrivateRoute>}> </Route>
          <Route path='/html' element={<HtmlEditor></HtmlEditor>}> </Route>
          <Route path='/quiz/:quizId' element={<PrivateRoute> <QuizPage></QuizPage> </PrivateRoute>}> </Route>
          <Route path='/result' element={<PrivateRoute> <QuizResult></QuizResult> </PrivateRoute>}> </Route>
          <Route path='/add-quiz' element={<AdminRoute><AddQuiz></AddQuiz></AdminRoute>}> </Route>
          <Route path='/add-video' element={<AdminRoute><AddVideo></AddVideo></AdminRoute>}> </Route>
          <Route path='/manage-quiz' element={<AdminRoute><ManageQuiz></ManageQuiz></AdminRoute>}> </Route>
          <Route path='/edit-quiz/:quizId' element={<AdminRoute><EditQuiz></EditQuiz></AdminRoute>}> </Route>
          <Route path='/sheet' element={<PrivateRoute><Sheet></Sheet></PrivateRoute>}> </Route>
          <Route path='/videos' element={<PrivateRoute><Videos></Videos></PrivateRoute>}> </Route>
          <Route path='/leaderboard' element={<PrivateRoute><Leaderboard></Leaderboard></PrivateRoute>}> </Route>
          <Route path='/students' element={<AdminRoute><Students></Students></AdminRoute>}> </Route>
          <Route path='/add-fee' element={<AdminRoute><AddFee></AddFee></AdminRoute>}> </Route>
          <Route path='/add-attendance' element={<AdminRoute><AddAttendance></AddAttendance></AdminRoute>}> </Route>
          <Route path='/add-notice' element={<AdminRoute><AddNotice></AddNotice></AdminRoute>}> </Route>

          <Route path='/add-public-quiz' element={<AdminRoute><PublicCreateQuiz></PublicCreateQuiz></AdminRoute>}> </Route>
          <Route path='/public-quiz-list' element={<PublicQuizList></PublicQuizList>}> </Route>
           <Route path='/public-quiz/:quizId' element={<PublicQuizPage></PublicQuizPage>}> </Route>
           <Route path='/edit-public-quiz/:quizId' element={<AdminRoute><PublicEditQuiz /></AdminRoute>} />
           <Route path='/manage-public-quiz' element={<AdminRoute><PublicManageQuiz /></AdminRoute>} />
           <Route path="/public-quiz-result" element={<PublicQuizResult />} />




        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
