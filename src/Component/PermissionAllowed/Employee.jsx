import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';

const Employee = () => {
    const [employeeList, setEmployeeList] = useState([]);
    const [allotedLocations, setAllotedLocations] = useState({
        loc1: null,
        loc2: null,
        loc3: null
    });
    const [uniqueEstatesLength, setUniqueEstatesLength] = useState(0);
    const [allUniqueEstates, setAllUniqueEstates] = useState([]);
    const [completeCustomerList, setCompleteCustomerList] = useState([]);
    const [availableLocations, setAvailableLocations] = useState([]);
    const { user, csrfToken } = useContext(UserContext);

    useEffect(() => {
        axios.get('http://localhost:5020/api/all/customer')
            .then(res => {
                setCompleteCustomerList(res.data.data);

                const estateArray = res.data.data.map(item => item.estate);
                const uniqueEstates = Array.from(new Set(estateArray));
                setAllUniqueEstates(uniqueEstates);
                setUniqueEstatesLength(uniqueEstates.length);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:5020/get_data_to_admin/employee')
            .then(res => {
                setEmployeeList(res.data.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const handleSelectLocation = (e, loc) => {
        const value = e.target.value;
        setAllotedLocations(prev => {
            const updated = { ...prev };

            if (loc === 1) {
                updated.loc1 = value === '-Location 1-' ? null : value;
                updated.loc2 = null;
                updated.loc3 = null;
            } else if (loc === 2) {
                updated.loc2 = value === '-Location 2-' ? null : value;
                if (!updated.loc2) updated.loc3 = null;
            } else if (loc === 3) {
                updated.loc3 = value === '-Location 3-' ? null : value;
            }

            return updated;
        });
    };

    const handleLocationSave = (email) => {
        const djangoData = { ...allotedLocations, email: email, assigned_by: user.email };
        axios.post(`http://localhost:5020/alloted_locations/${email}`, { allotedLocations: allotedLocations })
            .then(res => {
                if (res.status == 200) {
                    alert(`Location Updated Successfully for ${email}.`)
                    window.location.reload(true)
                }
            })
            .catch(err => {
                console.log(err);
            });

        // axios.post(`http://localhost:8000/auth/api/update_location_priority/`, djangoData, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-CSRFToken': csrfToken,
        //     },
        //     withCredentials: true,
        // })
        //     .then(res => {
        //         if (res.status == 200) {
        //             axios.post(`http://localhost:5020/alloted_locations/${email}`, { allotedLocations: allotedLocations })
        //                 .then(res => {
        //                     if (res.status == 200) {
        //                         alert(`Location Updated Successfully for ${email}.`)
        //                         window.location.reload(true)
        //                     }
        //                 })
        //                 .catch(err => {
        //                     console.log(err);
        //                 });

        //         }
        //         else {
        //             alert("Django Backend Error ")
        //         }
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     });
    };

    return (
        <div>
            <div className='btn border-0'>Employee List</div>
            <div className='table-responsive'>
                <table className='table table-hover table-striped'>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Location</th>
                            <th>Alloted Location</th>
                            <th>New Location</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeeList.length > 0 ? employeeList.map((data, idx) => (
                            <tr key={idx}>
                                <td>{data.username}</td>
                                <td>{data.role}</td>
                                <td>{data.email}</td>
                                <td>{data.phone}</td>
                                <td>{data.status}</td>
                                <td>{data.village}, {data.city}, {data.State}, {data.zipCode}</td>
                                <td>
                                    Loc1 - {data.locationPriority?.location1 || 'N/A'}, <br />
                                    Loc2 - {data.locationPriority?.location2 || 'N/A'}, <br />
                                    Loc3 - {data.locationPriority?.location3 || 'N/A'}, <br />
                                    Assigned By - {data.locationPriority?.assigned_by || 'N/A'}
                                </td>
                                <td>
                                    <select
                                        className='form-control'
                                        value={allotedLocations.loc1 === null ? '-Location 1-' : allotedLocations.loc1}
                                        onChange={e => handleSelectLocation(e, 1)}
                                    >
                                        <option value={null}>-Location 1-</option>
                                        {allUniqueEstates.map((estate, idx) => (
                                            <option
                                                key={idx}
                                                value={estate}
                                                disabled={allotedLocations.loc2 === estate || allotedLocations.loc3 === estate}
                                            >
                                                {estate}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className='form-control'
                                        value={allotedLocations.loc2 === null ? '-Location 2-' : allotedLocations.loc2}
                                        onChange={e => handleSelectLocation(e, 2)}
                                        disabled={!allotedLocations.loc1}
                                    >
                                        <option value={null}>-Location 2-</option>
                                        {allUniqueEstates.map((estate, idx) => (
                                            <option
                                                key={idx}
                                                value={estate}
                                                disabled={allotedLocations.loc1 === estate || allotedLocations.loc3 === estate}
                                            >
                                                {estate}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className='form-control'
                                        value={allotedLocations.loc3 === null ? '-Location 3-' : allotedLocations.loc3}
                                        onChange={e => handleSelectLocation(e, 3)}
                                        disabled={!allotedLocations.loc2}
                                    >
                                        <option value={null}>-Location 3-</option>
                                        {allUniqueEstates.map((estate, idx) => (
                                            <option
                                                key={idx}
                                                value={estate}
                                                disabled={allotedLocations.loc1 === estate || allotedLocations.loc2 === estate}
                                            >
                                                {estate}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <i
                                        className='bi bi-save2-fill text-success'
                                        onClick={() => handleLocationSave(data.email)}
                                        style={{ fontSize: '30px', cursor: 'pointer' }}
                                        data-toggle="tooltip"
                                        data-placement="left"
                                        title="Save Location. Disabled values will be saved as empty locations."
                                    ></i>
                                </td>
                            </tr>
                        )) : <center>No Data available</center>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Employee;
