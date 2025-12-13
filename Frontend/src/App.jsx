import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Signup from './Pages/Signup.jsx'
import Home from './Pages/Home.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
