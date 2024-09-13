import React, { useContext, useState } from 'react';
import axios from 'axios';
import Logo from './B2ALogo1WithoutBg.png';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import { UserContext } from '../App';

axios.defaults.withCredentials = true;

const Register = () => {
    const { csrfToken } = useContext(UserContext)
    const [userRegisterData, setUserRegisterData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        password: '',
        cpassword: '',
        role: '',
        email: '',
        phone: '',
        village: '',
        city: '',
        state: '',
        zipCode: '',
        verified: false
    });

    const [profilePic, setProfilePic] = useState(null); // For the profile picture file
    const [show, setShow] = useState(false);
    const [msg, setMsg] = useState(null);
    const [msg_type, setMsg_Type] = useState(null)

    const handleRegister = async (e) => {
        e.preventDefault();

        if (userRegisterData.password !== userRegisterData.cpassword) {
            setMsg('Passwords do not match!');
            return;
        }

        // Create a FormData object to send the image and other form data
        const formData = new FormData();
        formData.append('username', userRegisterData.username);
        formData.append('password', userRegisterData.password);
        formData.append('cpassword', userRegisterData.cpassword);
        formData.append('role', userRegisterData.role);
        formData.append('email', userRegisterData.email);
        formData.append('phone', userRegisterData.phone);
        formData.append('village', userRegisterData.village);
        formData.append('city', userRegisterData.city);
        formData.append('state', userRegisterData.state);
        formData.append('zipCode', userRegisterData.zipCode);
        formData.append('profilePic', profilePic); // Append the file
        formData.append('verified', userRegisterData.verified);
        console.log(formData,userRegisterData.first_name)

        axios.post('http://localhost:5020/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set the correct content type for file uploads
            },
            withCredentials: true
        })
            .then(res => {
                console.log(res.data);
                setMsg(res.data.msg)
                setMsg_Type(res.data.msg_type)
                if(res.data.msg_type==='good'){
                    try {
                        const response = axios.post('http://localhost:8000/auth/api/register/', {
                            username: userRegisterData.username,
                            first_name: userRegisterData.first_name,
                            email: userRegisterData.email,
                            password: userRegisterData.password,
                            last_name: userRegisterData.last_name
                        }, {
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRFToken': csrfToken,  // Include CSRF token in the headers
                            },
                            withCredentials: true,
                        }
                        );
                        setMsg(response.data.msg);
                    } catch (error) {
                        setMsg('Error: ' + error.response.data.non_field_errors[0]);
                    }
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    const handleUserName = (e) => {
        if (e.target.value.includes(" ")) {
            setMsg('Username should not contain spaces.');
        } else {
            setMsg(null);
            setUserRegisterData({ ...userRegisterData, username: e.target.value });
        }
    };

    return (
        <div className='container d-flex'>
            <form className='p-4 rounded bg-white w-100' style={{ maxWidth: '700px' }} onSubmit={handleRegister}>
                <center className='mb-4'>
                    <h3 className='mt-3'>Create an Account</h3>
                    {
                        msg && <span className={`${msg_type === 'error' ? 'text-danger' : 'text-success'}`}>{msg}</span>
                    }
                </center>

                <div className='row'>
                    {/* Username */}
                    <div className='col-md-6 mb-3'>
                        <label htmlFor='name' className='form-label'>Name</label>
                        {/* {msg && <small className="text-danger d-block mb-2">{msg}</small>} */}
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                            <input type='text' className='form-control' id='name' placeholder='Enter your Name' value={userRegisterData.first_name} onChange={e => setUserRegisterData({ ...userRegisterData, first_name: e.target.value })} required />
                        </div>
                    </div>

                    {/* Email */}
                    <div className='col-md-6 mb-3'>
                        <label htmlFor='text' className='form-label'>Shop Name</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-shop-window"></i></span>
                            <input type='text' className='form-control' id='email' placeholder='Enter your shop name' value={userRegisterData.last_name} onChange={e => setUserRegisterData({ ...userRegisterData, last_name: e.target.value })} required />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    {/* Username */}
                    <div className='col-md-6 mb-3'>
                        <label htmlFor='username' className='form-label'>Username</label>
                        {/* {msg && <small className="text-danger d-block mb-2">{msg}</small>} */}
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                            <input type='text' className='form-control' id='username' placeholder='Enter your username' value={userRegisterData.username} onChange={handleUserName} required />
                        </div>
                    </div>

                    {/* Email */}
                    <div className='col-md-6 mb-3'>
                        <label htmlFor='email' className='form-label'>Email</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
                            <input type='email' className='form-control' id='email' placeholder='Enter your email' value={userRegisterData.email} onChange={e => setUserRegisterData({ ...userRegisterData, email: e.target.value })} required />
                        </div>
                    </div>
                </div>

                <div className='row'>
                    {/* Phone */}
                    <div className='col-md-6 mb-3'>
                        <label htmlFor='phone' className='form-label'>Phone</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-telephone-fill"></i></span>
                            <input type='tel' className='form-control' id='phone' placeholder='Enter your phone number' value={userRegisterData.phone} onChange={e => setUserRegisterData({ ...userRegisterData, phone: e.target.value })} required />
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className='col-md-6 mb-3'>
                        <label htmlFor='role' className='form-label'>Role</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-people-fill"></i></span>
                            <select className='form-control' id='role' value={userRegisterData.role} onChange={e => setUserRegisterData({ ...userRegisterData, role: e.target.value })} required>
                                <option disabled value=''>- Select Role -</option>
                                <option value='superAdmin'>Super Admin</option>
                                {/* <option value='admin'>Admin</option>
                                <option value='manager'>Manager</option> */}
                                <option value='employee'>Employee</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className='row'>
                    {/* Village */}
                    <div className='col-md-6 mb-3'>
                        <label htmlFor='village' className='form-label'>Village</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-house-fill"></i></span>
                            <input type='text' className='form-control' id='village' placeholder='Enter your village' value={userRegisterData.village} onChange={e => setUserRegisterData({ ...userRegisterData, village: e.target.value })} required />
                        </div>
                    </div>

                    {/* City */}
                    <div className='col-md-6 mb-3'>
                        <label htmlFor='city' className='form-label'>City</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-building-fill"></i></span>
                            <input type='text' className='form-control' id='city' placeholder='Enter your city' value={userRegisterData.city} onChange={e => setUserRegisterData({ ...userRegisterData, city: e.target.value })} required />
                        </div>
                    </div>
                </div>

                <div className='row'>
                    {/* State */}
                    <div className='col-md-6 mb-3'>
                        <label htmlFor='state' className='form-label'>State</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-map-fill"></i></span>
                            <input type='text' className='form-control' id='state' placeholder='Enter your state' value={userRegisterData.state} onChange={e => setUserRegisterData({ ...userRegisterData, state: e.target.value })} required />
                        </div>
                    </div>

                    {/* Zip Code */}
                    <div className='col-md-6 mb-3'>
                        <label htmlFor='zipCode' className='form-label'>Zip Code</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-mailbox2"></i></span>
                            <input type='number' className='form-control' id='zipCode' placeholder='Enter your zip code' value={userRegisterData.zipCode} onChange={e => setUserRegisterData({ ...userRegisterData, zipCode: e.target.value })} required />
                        </div>
                    </div>
                </div>

                {/* Profile Picture */}
                <div className='mb-3'>
                    <label htmlFor='profilePic' className='form-label'>Profile Picture</label>
                    <div className="input-group d-flex align-items-center">
                        <span className="input-group-text"><i className="bi bi-image-fill"></i></span>
                        <input type='file' className='border' id='profilePic' onChange={e => setProfilePic(e.target.files[0])} required />
                    </div>
                </div>

                <div className='row'>
                    {/* Password */}
                    <div className='col-md-6 mb-3'>
                        <label htmlFor='password' className='form-label'>Password</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                            <input type={show ? 'text' : 'password'} className='form-control' id='password' placeholder='Enter your password' value={userRegisterData.password} onChange={e => setUserRegisterData({ ...userRegisterData, password: e.target.value })} required />
                            <span className="input-group-text" onClick={() => setShow(!show)} style={{ cursor: 'pointer' }}>
                                {show ? <EyeSlashFill /> : <EyeFill />}
                            </span>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className='col-md-6 mb-3'>
                        <label htmlFor='cpassword' className='form-label'>Confirm Password</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                            <input type={show ? 'text' : 'password'} className='form-control' id='cpassword' placeholder='Re-enter your password' value={userRegisterData.cpassword} onChange={e => setUserRegisterData({ ...userRegisterData, cpassword: e.target.value })} required />
                            <span className="input-group-text" onClick={() => setShow(!show)} style={{ cursor: 'pointer' }}>
                                {show ? <EyeSlashFill /> : <EyeFill />}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button type='submit' className='btn btn-primary w-100'>
                    <i className="bi bi-person-plus-fill me-2"></i> Register
                </button>
            </form>
        </div>
    );
};

export default Register;
