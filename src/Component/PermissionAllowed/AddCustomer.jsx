import axios from 'axios';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Check, XLg } from 'react-bootstrap-icons';
import DataTable from 'react-data-table-component';
import { UserContext } from '../../App';

// Define columns for the DataTable
const columns = [
    {
        name: '#',
        selector: (row, index) => index + 1,
        sortable: true,
    },
    {
        name: 'Name',
        selector: row => row.name,
        sortable: true,
    },
    {
        name: 'Phone',
        selector: row => row.mobile,
        sortable: true,
    },
    {
        name: 'Email',
        selector: row => row.email,
        sortable: true,
    },
    {
        name: 'Village',
        selector: row => row.village,
        sortable: true,
    },
    {
        name: 'District',
        selector: row => row.district,
        sortable: true,
    },
    {
        name: 'City',
        selector: row => row.city,
        sortable: true,
    },
    {
        name: 'State',
        selector: row => row.estate,
        sortable: true,
    },
    {
        name: 'Zip Code',
        selector: row => row.zipCode,
        sortable: true,
    },
    {
        name: 'Source',
        selector: row => row.source,
        sortable: true,
    },
    {
        name: 'Status',
        cell: row => (
            <select
                className={`btn border ${row.status === 0 ? 'text-success' : 'text-danger'} rounded-0`}
                defaultValue={row.status}
                disabled
            >
                <option value={0}><Check /> &nbsp;Active</option>
                <option value={1}><XLg /> &nbsp;Closed</option>
            </select>
        ),
    },
    {
        name: 'Follow Up Date',
        selector: row => {
            const date = row.followUp_date.split('T')[0];
            return date;
        },
        sortable: true,
    },
    {
        name: 'Days Left',
        cell: row => {
            const daysLeft = calculateDaysLeft(row.followUp_date);
            return (
                <div style={{ fontSize: '14px', fontWeight: '700', color: getDaysLeftColor(daysLeft), filter: `drop-shadow(1px 1px 1px ${getDaysLeftColor(daysLeft)})` }}>
                    {daysLeft} Days Left
                </div>
            );
        },
    },
    {
        name: 'Remark',
        cell: row => (
            <textarea
                className='p-2 border border-light'
                value={row.remark}
                cols={30}
                rows={2}
                style={{ resize: 'none', minWidth: '200px' }}
                readOnly
            ></textarea>
        ),
    }
];

const customStyles = {
    headRow: {
        style: {
            backgroundColor: '#becedd',
            color: '#495057',
            fontWeight: 'bold',
        },
    },
    headCells: {
        style: {
            minWidth: '150px',
            paddingLeft: '16px',
            paddingRight: '16px',
            fontSize: '16px',
            border: '1px solid #dee2e6',
        },
    },
    rows: {
        style: {
            minHeight: '72px',
            '&:nth-of-type(odd)': {
                backgroundColor: '#f8f9fa',
            },
            '&:hover': {
                backgroundColor: '#e9ecef',
                cursor: 'pointer',
            },
        },
    },
    cells: {
        style: {
            paddingLeft: '16px',
            paddingRight: '16px',
            fontSize: '16px',
            border: '1px solid #dee2e6',
        },
    },
};

const getDaysLeftColor = (daysLeft) => {
    if (daysLeft > 20) return '#28A745'; // Green
    if (daysLeft <= 20 && daysLeft > 10) return '#FFC107'; // Yellow
    return '#DC3545'; // Red
};

const calculateDaysLeft = (followUpDate) => {
    const today = new Date();
    const followUp = new Date(followUpDate.split('T')[0]);

    // Calculate the difference in milliseconds
    const difference = followUp - today;

    // Convert milliseconds to days
    const daysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24));

    return daysLeft;
};

const AddCustomer = () => {
    const [showForm, setShowForm] = useState(false);
    const [msg, setMsg] = useState(null);
    const [msg_type, setMsg_Type] = useState(null);
    const [completeCustomerList, setCompleteCustomerList] = useState([]);
    const [currentDate, setCurrentDate] = useState('');
    const formRef = useRef(null);
    const { user, login, csrfToken } = useContext(UserContext)
    const [newCustomerData, setNewCustomerData] = useState({
        name: '',
        mobile: '',
        email: '',
        village: '',
        district: '',
        city: '',
        estate: '',
        zipCode: '',
        source: '',
        followUp_date: '',
        status: 0,
        remark: ''
    });

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        village: '',
        city: '',
        state: '',
        address: '',
        zipCode: '',
        uniqueID: user.email + user.username
    });

    // Handle clicks outside the form to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setShowForm(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch customer data on component mount
    useEffect(() => {
        axios.get('https://salesmanagementbackend.basic2ai.info/api/all/customer')
            .then(res => {
                setCompleteCustomerList(res.data.data);
            })
            .catch(err => {
                console.error(err);
            });
    }, [showForm]);

    // Set the current date on component mount
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setCurrentDate(today);
    }, []);

    const handleNumberValue = (e, len) => {
        const value = e.target.value;
        if (len) {
            if (value.length <= len) {
                if (len === 10) {
                    setNewCustomerData({ ...newCustomerData, mobile: value });
                    setFormData({ ...formData, phone: e.target.value })
                } else if (len === 6) {
                    setNewCustomerData({ ...newCustomerData, zipCode: value });
                    setFormData({ ...formData, zipCode: e.target.value })
                } else {
                    alert("Unknown Length");
                }
            } else {
                alert(`Limit exceeds for length ${len}`);
            }
        } else {
            alert('Unknown Field');
        }
    };

    // Unified handleSubmit to send data to both backends
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("HandleSubmit Clicked")
        // Prepare data for Node.js

        // Prepare data for Django
        const djangoData = { ...formData };
        console.log("Django Data : ", djangoData)
        console.log('Node Data : ', newCustomerData)

        try {
            // Send data to Node.js
            const nodeResponse = await axios.post('https://salesmanagementbackend.basic2ai.info/register/customer', { newCustomerData: newCustomerData });
            if (nodeResponse) {
                setMsg("Customer successfully created in both systems.");
                setMsg_Type("success");
                setShowForm(false);
            }

            // Send data to Django
            // const djangoResponse = await axios.post('http://localhost:8000/api/create_customer/', djangoData, {
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'X-CSRFToken': csrfToken,  // Include CSRF token in the headers
            //     },
            //     withCredentials: true,
            // });
            // console.log('Customer created in Django:', djangoResponse.data);

            // Optionally, you can handle success messages or update state here
            // setMsg("Customer successfully created in both systems.");
            // setMsg_Type("success");
            // setShowForm(false); // Hide the form after successful submission

            // Refresh the customer list
            axios.get('https://salesmanagementbackend.basic2ai.info/api/all/customer')
                .then(res => {
                    setCompleteCustomerList(res.data.data);
                })
                .catch(err => {
                    console.error(err);
                });

            // Reset form data
            setNewCustomerData({
                name: '',
                mobile: '',
                email: '',
                village: '',
                district: '',
                city: '',
                estate: '',
                zipCode: '',
                source: '',
                followUp_date: '',
                status: 0,
                remark: ''
            });

            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                village: '',
                city: '',
                state: '',
                address: '',
            });

        } catch (error) {
            console.error('Error creating customer:', error);
            setMsg("There was an error creating the customer.");
            setMsg_Type("danger");
        }
    };
    const [localSource, setLocalsource] = useState(0)
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSetvlaues = (e, name) => {
        if (name === 'name') {
            setNewCustomerData({ ...newCustomerData, name: e.target.value })
            setFormData({ ...formData, first_name: e.target.value })
        }
        else if (name === 'email') {
            setNewCustomerData({ ...newCustomerData, email: e.target.value })
            setFormData({ ...formData, email: e.target.value })
        }
        else if (name === 'village') {
            setNewCustomerData({ ...newCustomerData, village: e.target.value })
            setFormData({ ...formData, village: e.target.value })
        }
        else if (name === 'city') {
            setNewCustomerData({ ...newCustomerData, city: e.target.value })
            setFormData({ ...formData, city: e.target.value })
        }
        else if (name === 'state') {
            setNewCustomerData({ ...newCustomerData, estate: e.target.value })
            setFormData({ ...formData, state: e.target.value })
        }
        else if (name === 'source') {
            if (e.target.value === 'Others') {
                setLocalsource('Others')
                setNewCustomerData({ ...newCustomerData, source: null })
            } else {
                setLocalsource(null)
                setNewCustomerData({ ...newCustomerData, source: e.target.value })
            }
            // setFormData({ ...formData, source: e.target.value })
        }
        else if (name === 'inputSource') {
            if (e.target.value === 'Others') {
                setLocalsource('Others')
            } else
                setNewCustomerData({ ...newCustomerData, source: e.target.value })
            // setFormData({ ...formData, source: e.target.value })
        }
        else if (name === 'district') {
            setNewCustomerData({ ...newCustomerData, district: e.target.value })
        }
        if (name === 'followUp') {
            setNewCustomerData({ ...newCustomerData, followUp_date: e.target.value })
            // setFormData({ ...formData, name: e.target.value })
        }
        if (name === 'remark') {
            setNewCustomerData({ ...newCustomerData, remark: e.target.value })
            // setFormData({ ...formData, name: e.target.value })
        }
    }

    return (
        <div className='p-2'>
            <div className='w-100 d-flex align-items-center justify-content-between'>
                <button className='m-1 btn border-0 rounded-0' style={{ fontSize: '25px', fontWeight: '600' }}>All Customers</button>
                <button
                    className='m-1 btn btn-success border-0 rounded-0'
                    onClick={() => setShowForm(true)}
                >
                    Add Customer
                </button>
            </div>

            {/* DataTable for all customers */}
            <div className='table-responsive'>
                <DataTable
                    className='border table-bordered'
                    columns={columns}
                    data={completeCustomerList}
                    pagination
                    highlightOnHover
                    striped
                    customStyles={customStyles}
                />
            </div>

            {/* Conditional rendering for the form */}
            {showForm && (
                <div
                    className='modal'
                    style={{
                        display: 'block',
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: '1000',
                        overflowY: 'auto'
                    }}
                >
                    <div
                        className='modal-content'
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            padding: '20px',
                            margin: '5% auto',
                            maxWidth: '600px',
                            overflow: 'auto',
                            maxHeight: '80vh'
                        }}
                        ref={formRef}
                    >
                        <h2>Add New Customer</h2>
                        {msg && (
                            <div className={`alert alert-${msg_type}`} role="alert">
                                {msg}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className='mb-3'>
                                <label className='form-label'>Name</label>
                                <input
                                    required
                                    type='text'
                                    className='form-control'
                                    value={newCustomerData.name}
                                    onChange={e => handleSetvlaues(e, 'name')}
                                />
                            </div>
                            <div className='mb-3'>
                                <label className='form-label'>Phone</label>
                                <input
                                    required
                                    type='number'
                                    className='form-control'
                                    value={newCustomerData.mobile}
                                    onChange={e => handleNumberValue(e, 10)}
                                />
                            </div>
                            <div className='mb-3'>
                                <label className='form-label'>Email</label>
                                <input
                                    required
                                    type='email'
                                    className='form-control'
                                    value={newCustomerData.email}
                                    onChange={e => handleSetvlaues(e, 'email')}
                                />
                            </div>
                            <div className='row'>
                                <div className='mb-3 col-4'>
                                    <label className='form-label'>Village</label>
                                    <input
                                        required
                                        type='text'
                                        className='form-control'
                                        value={newCustomerData.village}
                                        onChange={e => handleSetvlaues(e, 'village')}
                                    />
                                </div>
                                <div className='mb-3 col-4'>
                                    <label className='form-label'>District</label>
                                    <input
                                        required
                                        type='text'
                                        className='form-control'
                                        value={newCustomerData.district}
                                        onChange={e => handleSetvlaues(e, 'district')}
                                    />
                                </div>
                                <div className='mb-3 col-4'>
                                    <label className='form-label'>City</label>
                                    <input
                                        required
                                        type='text'
                                        className='form-control'
                                        value={newCustomerData.city}
                                        onChange={e => handleSetvlaues(e, 'city')}
                                    />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='mb-3 col-6'>
                                    <label className='form-label'>State</label>
                                    <input
                                        required
                                        type='text'
                                        className='form-control'
                                        value={newCustomerData.estate}
                                        onChange={e => handleSetvlaues(e, 'state')}
                                    />
                                </div>
                                <div className='mb-3 col-6'>
                                    <label className='form-label'>Zip Code</label>
                                    <input
                                        required
                                        type='number'
                                        className='form-control'
                                        value={newCustomerData.zipCode}
                                        onChange={e => handleNumberValue(e, 6)}
                                    />
                                </div>
                            </div>
                            <div className='mb-3'>
                                <label className='form-label'>Source</label>
                                <select className='form-control' onChange={e => handleSetvlaues(e, 'source')}>
                                    <option disabled selected>-Select Source-</option>
                                    <option className='' value={'Google Ads'}>Google Ads</option>
                                    <option className='' value={'Youtube'}>Youtube</option>
                                    <option className='' value={'Facebook'}>Facebook</option>
                                    <option className='' value={'Instagram'}>Instagram</option>
                                    <option className='' value={'Twitter'}>Twitter</option>
                                    <option className='' value={'Whatsapp'}>Whatsapp</option>
                                    <option className='' value={'Others'}>Others</option>
                                </select>
                                {localSource === 'Others' ?
                                    <input
                                        name='inputSource'
                                        required={localSource === 'Others' ? true : false}
                                        type='text'
                                        className='form-control my-1'
                                        value={newCustomerData.source}
                                        placeholder='Please provide the other source, Friends or Relatives (with contact Number), another site (Site name) . . .'
                                        onChange={e => handleSetvlaues(e, 'inputSource')}
                                    /> : ''
                                }
                            </div>
                            <div className='mb-3'>
                                <label className='form-label'>Follow Up Date</label>
                                <input
                                    required
                                    type='date'
                                    className='form-control'
                                    value={newCustomerData.followUp_date}
                                    onChange={e => handleSetvlaues(e, 'followUp')}
                                />
                            </div>
                            <div className='mb-3'>
                                <label className='form-label'>Remark</label>
                                <textarea
                                    className='form-control'
                                    value={newCustomerData.remark}
                                    onChange={e => handleSetvlaues(e, 'remark')}
                                    rows='3'
                                ></textarea>
                            </div>
                            <div className='text-end'>
                                <button type='submit' className='btn rounded-0 m-2 btn-success'>Submit</button>
                                <button type='button' className='btn rounded-0 m-2 btn-secondary' onClick={() => setShowForm(false)}>Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddCustomer;
