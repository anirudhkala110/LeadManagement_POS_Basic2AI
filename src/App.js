import React, { createContext, useEffect, useState } from 'react';
import './App.css';
import Landing from './Landing';
import Homepage from './Component/Homepage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Utils/Navbar';
import Register from './Auth/Register';
import Login from './Auth/Login';

axios.defaults.withCredentials = true;

export const UserContext = createContext(null);

function App() {
  const [login, setLogin] = useState(null);
  const [user, setUser] = useState(null);  // Initialize as null
  const [csrfToken, setCsrfToken] = useState(null);

  useEffect(() => {
    axios.get('https://salesmanagementbackend.basic2ai.info/loggin')
      .then(res => {
        // console.log(res.data)
        setUser(res.data);  // Set user data from the API response
        setLogin(res.data.login);  // Set login state
      })
      .catch(err => {
        console.log(err);
      });
    axios.get('https://salesmanagementbackend.basic2ai.info')
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
    // axios.get('http://localhost:8000/auth/api/get-csrf-token/')
    //   .then(response => {
    //     console.log(response.data)
    //     axios.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
    //     setCsrfToken(response.data.csrfToken);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching CSRF token:', error);
    //   });
  }, []);  // Empty array ensures this only runs once on component mount

  return (
    <UserContext.Provider value={{ user, login, csrfToken, setUser, setLogin }}>
      <div className="bg-light min-vh-100" style={{ minWidth: '400px' }}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            {login && <Route path="/home" element={<Homepage />} />}
            {user && <Route path="/register" element={user.role === "superAdmin" ? <Register /> : <Login />} />}
          </Routes>
        </Router>
      </div>
    </UserContext.Provider>
  );
}

export default App;
