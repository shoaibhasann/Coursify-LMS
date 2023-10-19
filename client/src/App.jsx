

import { Route, Routes } from 'react-router-dom'

import RequireAuth from './components/auth/RequireAuth.jsx'
import AboutUs from './pages/AboutUs.jsx'
import Contact from './pages/Contact.jsx'
import CourseDescription from './pages/course/CourseDescription.jsx'
import CourseList from './pages/course/CourseList.jsx'
import CreateCourse from './pages/course/CreateCourse.jsx'
import AddLecture from './pages/dashboard/AddLecture.jsx'
import AdminDashboard from './pages/dashboard/AdminDashboard.jsx'
import DisplayLectures from './pages/dashboard/DisplayLectures.jsx'
import Denied from './pages/Denied.jsx'
import HomePage from './pages/HomePage.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import Checkout from './pages/payment/Checkout.jsx'
import CheckoutFailure from './pages/payment/CheckoutFailure.jsx'
import CheckoutSuccess from './pages/payment/CheckoutSuccess.jsx'
import Signup from './pages/Signup.jsx'
import ChangePassword from './pages/user/ChangePassword.jsx'
import EditProfile from './pages/user/EditProfile.jsx'
import ForgotPassword from './pages/user/ForgotPassword.jsx'
import Profile from './pages/user/Profile.jsx'


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
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/denied" element={<Denied />} />

      <Route element={<RequireAuth allowedRoles={["admin"]} />}>
        <Route path="/course/create" element={<CreateCourse />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      <Route element={<RequireAuth allowedRoles={["admin", "user"]} />}>
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/user/editprofile" element={<EditProfile />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/checkout/fail" element={<CheckoutFailure />} />
        <Route path="/course/displaylectures" element={<DisplayLectures />} />
        <Route path="/course/addlecture" element={<AddLecture />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App