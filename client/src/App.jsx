

import { Route, Routes } from 'react-router-dom'

import RequireAuth from './components/auth/RequireAuth.jsx'
import AboutUs from './pages/AboutUs.jsx'
import Contact from './pages/Contact.jsx'
import CourseDescription from './pages/course/CourseDescription.jsx'
import CourseList from './pages/course/CourseList.jsx'
import CreateCourse from './pages/course/CreateCourse.jsx'
import Denied from './pages/Denied.jsx'
import HomePage from './pages/HomePage.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import Signup from './pages/Signup.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/courses" element={<CourseList />} />
      <Route path="/course/description" element={<CourseDescription />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/denied" element={<Denied />} />

      <Route element={<RequireAuth allowedRoles={["admin"]} />}>
        <Route path="/course/create" element={<CreateCourse />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App