import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './pages/Accueil'
import Login from './pages/Login'
import Signup from './pages/Signup'


function App() {
 

  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/accueil" element={<HomePage />}/> {/** HomePage */}
          <Route path="/login" element={<Login />}/> {/** Login page */}
          <Route path="/signup" element={<Signup />}/> {/** Signup page */}
        </Routes>
      </Router>
    </React.StrictMode>
  )
}

export default App