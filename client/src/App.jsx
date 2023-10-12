

import { Route, Routes } from 'react-router-dom'

import AboutUs from './pages/AboutUs.jsx'
import Contact from './pages/Contact.jsx'
import CourseList from './pages/course/CourseList.jsx'
import Denied from './pages/Denied.jsx'
import HomePage from './pages/HomePage.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import Signup from './pages/Signup.jsx'

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/about' element={<AboutUs/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/courses' element={<CourseList/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/denied' element={<Denied/>}/>
      <Route path='*' element={<NotFound/>}/>
    </Routes>
  )
}

export default App