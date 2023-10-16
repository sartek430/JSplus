import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'

function App() {
 

  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />}> {/** Login page */}
          </Route>
        </Routes>

      </Router>
    </React.StrictMode>
  )
}

export default App
