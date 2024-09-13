import axios from 'axios'
import React, { useContext } from 'react'
import { UserContext } from '../App'

const Navbar = () => {
    const { login } = useContext(UserContext)
    const handleLogout = () => {
        axios.get('http://localhost:5020/logout')
            .then(res => {
                if (res.status == 200) {
                    window.location.href = '/'
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <>
            {
                login &&
                <nav class="navbar navbar-expand-lg fixed-navbar navbar-light bg-light">
                    <a class="navbar-brand" href="#">Lead Management System</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                        <div class="collapse navbar-collapse" id="navbarNavDropdown">
                            <ul class="navbar-nav">
                                <li class="nav-item active">
                                    <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
                                </li>
                                {/* <li class="nav-item">
                                <a class="nav-link" href="#">Features</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Pricing</a>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Dropdown link
                                </a>
                                <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <a class="dropdown-item" href="#">Action</a>
                                    <a class="dropdown-item" href="#">Another action</a>
                                    <a class="dropdown-item" href="#">Something else here</a>
                                </div>
                            </li> */}
                            </ul>
                            {login && <a href='/register'>Register New Account</a>}
                            {login && <button className='btn' onClick={e => handleLogout()}>Logout</button>} &nbsp;&nbsp;&nbsp;
                        </div>
                </nav>
            }

        </>
    )
}

export default Navbar