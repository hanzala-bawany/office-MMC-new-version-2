import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import AppLayout from './Layouts/AppLayout'
import ScreenLayout from './Layouts/ScreenLayout'
import Screen2Page from './pages/Screen2'
import Screen3Page from './pages/Screen3'
import Screen4Page from './pages/Screen4'
import FacultyPage from './pages/Faculty'
import Screen1Page from './pages/Screen1'
import DoctorPage from './pages/Doctor'
import ScreensPage from './pages/Screens'
import Screen1Display from './pages/Screen1Display'
import Screen4Display from './pages/Screen4Display'
import Screen3Display from './pages/Screen3Display'
import Screen2Display from './pages/Screen2Display'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import AdminDisplayParent from './routes/AdminDisplayParent'
import AuthParent from './routes/AuthParent'
import ScreenDisplayParent from './routes/ScreenDisplayParent'


function App() {


  return (
    <>
      <Routes>
        
        {/* AppLayout wale routes */}
        <Route element={<AdminDisplayParent />}>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="/screen1" element={<Screen1Page />} />
            <Route path="/screen2" element={<Screen2Page />} />
            <Route path="/screen3" element={<Screen3Page />} />
            <Route path="/screen4" element={<Screen4Page />} />
            <Route path="/consultant" element={<FacultyPage />} />
            <Route path="/doctor" element={<DoctorPage />} />
            <Route path="/screens" element={<ScreensPage />} />
          </Route>
        </Route> 

        {/* Screen Displays */}
        <Route element={<ScreenDisplayParent />}>
          {/* <Route element={<ScreenLayout />}> */}
            <Route path="/screen1display" element={<Screen1Display />} />
          {/* </Route> */}
          <Route path="/screen2display" element={<Screen2Display />} />
          <Route path="/screen3display" element={<Screen3Display />} />
          <Route path="/screen4display" element={<Screen4Display />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthParent />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route path="/*" element={<NotFoundPage />} />

      </Routes>
    </>
  )
}

export default App 