import React from 'react'
import { Route, Routes } from 'react-router-dom'

import HomePage from './pages/HomePage.jsx'
import AboutUs from './pages/AboutUs.jsx'

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/about' element={<AboutUs/>}/>
    </Routes>
  )
}

export default App