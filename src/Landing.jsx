import React, { useContext, useEffect, useState } from 'react';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Logo from './Auth/B2ALogo1WithoutBg.png';
import Homepage from './Component/Homepage';
import { UserContext } from './App';
import axios from 'axios';

const Landing = () => {
    const [register, setRegister] = useState(false);
    const [login, setLogin] = useState(null);
    const [user, setUser] = useState(null);  // Initialize as null
  
    useEffect(() => {
      axios.get('https://salesmanagementbackend.basic2ai.info/loggin')
        .then(res => {
          setUser(res.data);  // Set user data from the API response
          setLogin(res.data.login);  // Set login state
        })
        .catch(err => {
          console.log(err);
        });
    });

    return (
        <>
            {login ? (
                <Homepage />
            ) : (
                <div className='d-flex justify-content-center pt-5'>
                    <div className='bg-white shadow-lg pt-5 pb-3 w-100' style={{ maxWidth: '500px', minWidth: '350px' }}>
                        <center>
                            <h1>Basic to AI</h1>
                            <img src={Logo} style={{ height: '150px' }} alt="Logo" />
                            <br />
                            {/* <button
                                className='btn btn-success rounded-0 w-100'
                                onClick={() => setRegister(!register)}
                                style={{ fontWeight: "700", fontSize: '18px', width: '250px' }}
                            >
                                Switch to {register ? 'Login' : 'Register'}
                            </button> */}
                        </center>
                        {!register ? <Login /> : <Register />}
                    </div>
                </div>
            )}
        </>
    );
};

export default Landing;
