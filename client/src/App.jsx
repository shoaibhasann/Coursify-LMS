import React from 'react'
import { Route, Routes } from 'react-router-dom'

import HomePage from './pages/HomePage.jsx'
import AboutUs from './pages/AboutUs.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/about' element={<AboutUs/>}/>

      <Route path='*' element={<NotFound/>}/>
    </Routes>
  )
}

export default App