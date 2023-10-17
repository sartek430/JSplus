import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './pages/Accueil'

function App() {
 

  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/accueil" element={<HomePage />}/> {/** HomePage */}
        </Routes>
      </Router>
    </React.StrictMode>
  )
}

export default App