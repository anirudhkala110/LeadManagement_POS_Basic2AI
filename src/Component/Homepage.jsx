import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import AddCustomer from './PermissionAllowed/AddCustomer';
import Tasks from './Tasks';
import DashBoard from './DashBoard';
import { useAsyncError } from 'react-router-dom';
import axios from 'axios';

const Homepage = () => {
    const {user,login} = useContext(UserContext)  // Initialize as null

    const [buttonState, setButtonState] = useState({
        btn1: true,
        btn2: false,
        btn3: false
    })



    return (
        <div className='w-100 bg-light container' style={{ minWidth: '350px' }}>
            <div className=''>
                <DashBoard />
            </div>
            {/* <div className='bg-white my-3 ' style={{boxShadow:'0px 3px 5px 2px #E1E2E3'}}>
                <button className={`btn ${buttonState.btn1 ? 'btn-primary' : 'btn-success'} rounded-0 my-2 mx-1`} onClick={e => setButtonState({ ...buttonState, btn1: true, btn2: false })} style={{maxWidth:'120px'}}>Customers</button>
                <button className={`btn ${buttonState.btn2 ? 'btn-primary' : 'btn-success'} rounded-0 my-2 mx-1`} onClick={e => setButtonState({ ...buttonState, btn1: false, btn2: true })} style={{maxWidth:'100px'}}>Tasks</button>
            </div>
            {buttonState.btn2 && <div>
                <Tasks />
            </div>} */}
        </div>
    );
};

export default Homepage;
