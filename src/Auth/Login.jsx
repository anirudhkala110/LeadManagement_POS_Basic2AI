import React, { useState } from 'react'
import axios from 'axios'
import Logo from './B2ALogo1WithoutBg.png'
axios.defaults.withCredentials = true
const Login = () => {
    const [userLoginData, setUserLoginData] = useState({
        username: '',
        password: '',
    })
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [show, setShow] = useState(false)
    const [msg_type, setMsg_Type] = useState(null)
    const handleLogin = (e) => {
        e.preventDefault()
        axios.post('https://salesmanagementbackend.basic2ai.info/login', { username: username, password: password })
            .then(res => {
                // console.log(res.data)
                setMsg(res.data.msg)
                setMsg_Type(res.data.msg_type)
                if (res.data.msg_type !== 'error')
                    window.location.href = '/home'
            })
            .catch(err => {
                console.log(err)
            })
    }
    const [msg, setMsg] = useState(null)
    const [msg1, setMsg1] = useState(null)
    const handleUserName = (e) => {
        if (e.target.value[parseInt(e.target.value.length) - 1] === " ") {
            setMsg1('Should not contains white space')
        }
        else {
            setMsg(null)
            setUsername(e.target.value)
        }

    }
    return (
        <div>
            <center className=''>
                <form className='form p-3 bg-white' style={{ maxWidth: '500px' }}>
                    <center className='mb-3' style={{ fontSize: '25px', filter: 'drop-shadow(5px 5px 10px black)' }}>Login Page</center>
                    {
                        msg && <span style={{ fontSize: '18px' }} className={`fs-3 my-2 ${msg_type === 'error' ? 'text-danger' : 'text-success'}`}>{msg}</span>
                    }
                    <div className='mb-3' style={{ maxWidth: '500px', textAlign: 'start' }}>
                        <label>User Name or Email</label>
                        {
                            msg1 && <b className="text-danger blink" style={{ fontSize: '12px', }}>&nbsp;&nbsp;<sup>* </sup>{msg1}</b>
                        }
                        <input type='text' className='form-control w-100' placeholder='It is name without any white space..' value={username} onChange={e => handleUserName(e)} />
                    </div>
                    <div className='mb-3' style={{ maxWidth: '500px', textAlign: 'start' }}>
                        <label>Password</label>
                        <input type={`${show ? 'text' : 'password'}`} placeholder='Enter Your Password...' className='form-control w-100' onChange={e => setPassword(e.target.value)} />
                        <sm className="btn btn-outline-dark border-0 rounded-0 py-1" onClick={e => setShow(!show)} style={{ cursor: 'pointer', fontSize: '12px' }}>{show ? 'Hide Password' : 'Show Password'}</sm>
                    </div>
                    <button className='btn btn-success rounded-0 w-100' onClick={e => handleLogin(e)}>Login</button>
                </form>
            </center>
        </div>
    )
}

export default Login
