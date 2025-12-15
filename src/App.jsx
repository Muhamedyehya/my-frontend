import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Hero from './pages/Hero'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CartPage from './pages/CartPage'; 
import AddPropertyPage from './components/AddPropertyPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './routes/ProtectedRoute'
import { AuthProvider } from './context/AuthContext';
import RegisterPage from './pages/RegisterPage'
import PropertyDetailsPage from './pages/PropertyDetailsPage'
import Navbar from './components/Navbar'



function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
  <Router>

    <Navbar />  

    <Routes>

      <Route path="/" element={<Hero />} />
      <Route path="/cartpage" element={<CartPage />} />
      <Route path="/loginPage" element={<LoginPage />} />
      <Route path="/Property/:id" element={<PropertyDetailsPage />} />
      <Route path="/RegisterPage" element={<RegisterPage />} />

      {/* صفحات محمية */}
      {/* <Route element={<ProtectedRoute />}> */}
        <Route path="/AddPropertyPage" element={<AddPropertyPage />} />
      {/* </Route> */}

    </Routes>

  </Router>
</AuthProvider>

  )
}

export default App;