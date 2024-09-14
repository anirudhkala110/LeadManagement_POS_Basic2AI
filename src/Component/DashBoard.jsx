import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import AddCustomer from './PermissionAllowed/AddCustomer'
import Employee from './PermissionAllowed/Employee'
import { UserContext } from '../App'

const DashBoard = () => {
  const { user, login } = useContext(UserContext)
  const [buttonsForDirectView, setButtonsForDirectView] = useState({
    btn1: true,
    btn2: false,
    btn3: false,
    btn4: false,
  })
  const [employeeList, setEmployeeList] = useState([]);
  const [completeCustomerList, setCompleteCustomerList] = useState([])
  const [availableLocations, setAvailableLocations] = useState()
  const [previosuAllotedLocations, setPreviosuAllotedLocations] = useState()
  const [uniqueEstatesLength, setUniqueEstatesLength] = useState(0)
  const [allUniqueEstates, setAllUniqueEstates] = useState([])
  useEffect(() => {
    axios.get('https://salesmanagementbackend.basic2ai.info/get_data_to_admin/employee')
      .then(res => {
        setEmployeeList(res.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    axios.get('https://salesmanagementbackend.basic2ai.info/api/all/customer')
      .then(res => {
        setCompleteCustomerList(res.data.data);

        const estateArray = res.data.data.map(item => item.estate);
        const uniqueEstates = Array.from(new Set(estateArray));
        setAllUniqueEstates(uniqueEstates)
        setUniqueEstatesLength(uniqueEstates.length)
        const formattedLocations = uniqueEstates.join(', ');
        setAvailableLocations(formattedLocations);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (user?.email) {
      axios.get(`https://salesmanagementbackend.basic2ai.info/prev_available_location/${user.email}`)
        .then(res => {
          setPreviosuAllotedLocations(res.data.data[0] || null)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.role) {
      setButtonsForDirectView(prevState => ({
        ...prevState,
        btn1: user.role === 'superAdmin',
        btn2: user.role !== 'superAdmin'
      }));
    }
  }, [user?.role]);

  const handleButtonRequest = (btnIs) => {
    setButtonsForDirectView(prevState => ({
      btn1: btnIs === 1,
      btn2: btnIs === 2,
      btn3: btnIs === 3,
      btn4: btnIs === 4,
    }));
  }

  const splitAllLocations = (allLocations) => {
    return allLocations.split(',')
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className='my-3 d-flex mb-5 shadow'>
        {user.profilePic ? (
          <img src={`https://salesmanagementbackend.basic2ai.info/Images/${user.profilePic}`} style={{ maxWidth: '150px', height: 'auto' }} />
        ) : (
          <div className='d-flex align-items-center justify-content-center border' style={{ width: '150px', background: '#ab47bc', fontSize: '80px', filter: 'drop-shadow(0px 0px 3px black)', color: 'white' }}>
            {user.username[0]}
          </div>
        )}
        <div className='p-3'>
          <p>{user.username}</p>
          <p>{user.email}</p>
          <p>{user.role}</p>
        </div>
      </div>
      <div className='p-3'>
        <div className='row shadow py-4 bg-white'>
          {user.role === 'superAdmin' && (
            <div className='col-md-4 col-sm-6 my-2'>
              <div className='card p-0' onClick={() => handleButtonRequest(1)}>
                <div className='card-header text-center'>All Employee</div>
                <div className='card-body'>
                  Total Employee: {employeeList ? employeeList.length : 0}
                </div>
                <div className='card-footer'>
                  <button className='btn btn-primary rounded-0'>See Details</button>
                </div>
              </div>
            </div>
          )}
          <div className='col-md-4 col-sm-6 my-2'>
            <div className='card p-0' onClick={() => handleButtonRequest(2)}>
              <div className='card-header text-center'>All Leads</div>
              <div className='card-body'>
                Total Customers: {completeCustomerList.length}
              </div>
              <div className='card-footer'>
                <button className='btn btn-primary rounded-0'>See Details</button>
              </div>
            </div>
          </div>
          {/* <div className='col-md-4 col-sm-6 my-2'>
            <div className='card p-0' onClick={() => handleButtonRequest(3)}>
              <div className='card-header text-center'>Active</div>
              {user.role === 'superAdmin' ? (
                <div className='card-body'>
                  Total: 6<br />
                  Follow Up: 3<br />
                </div>
              ) : (
                <div className='card-body'>
                  Available Locations: {uniqueEstatesLength}
                  <br />
                </div>
              )}
              <div className='card-footer'>
                <button className='btn btn-primary rounded-0'>See Details</button>
              </div>
            </div>
          </div> */}
          <div className='col-md-4 col-sm-6 my-2'>
            {user.role === 'superAdmin' ? (
              <div className='card p-0' onClick={() => handleButtonRequest(4)}>
                <div className='card-header text-center'>Locations</div>
                <div className='card-body'>
                  Available Locations: {uniqueEstatesLength}
                  <br />
                </div>
                <div className='card-footer'>
                  <button className='btn btn-primary rounded-0'>See Details</button>
                </div>
              </div>
            ) : (
              <div className='card p-0'>
                <div className='card-header text-center'>Alloted Locations</div>
                <div className='card-body'>
                  Location 1: {previosuAllotedLocations?.location1},<br />
                  Location 2: {previosuAllotedLocations?.location2},<br />
                  Location 3: {previosuAllotedLocations?.location3},<br />
                  Alloted By: {previosuAllotedLocations?.assigned_by},<br />
                  <br />
                </div>
                <div className='card-footer'>
                  <button className='btn btn-primary rounded-0'>See Details</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='my-2'>
        {buttonsForDirectView.btn1 && <div className='shadow p-2'><Employee /></div>}
        {buttonsForDirectView.btn2 && <div className='shadow p-2'><AddCustomer /></div>}
        {buttonsForDirectView.btn3 && <div className='shadow p-2'>Button 3</div>}
        {buttonsForDirectView.btn4 && (
          <div className='shadow p-2'>
            <div className='btn ' style={{ fontSize: '25px', fontWeight: '700' }}>All Available Locations</div>
            <div className='row p-3'>
              {availableLocations && splitAllLocations(availableLocations).map((data, idx) => (
                <div className='col-2 col-sm-6 col-md-3 py-2' key={idx}>
                  <div className='shadow rounded hoverBtn p-3 ' style={{ boxShadow: 'inset 1px 1px 10px 1px #E8E8E9' }}>
                    {data}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashBoard
