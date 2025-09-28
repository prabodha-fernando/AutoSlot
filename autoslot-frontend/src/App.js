import React, { useState, useEffect, useCallback } from 'react';
// --- NEW: Import the date picker component and its styles ---
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// --- Main App Component: Manages Authentication ---
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState('login');
  const API_URL = 'http://localhost:5000/api';

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await fetch(`${API_URL}/auth/me`, { headers: { 'Authorization': `Bearer ${token}` } });
          if (!res.ok) throw new Error('Invalid token');
          setCurrentUser(await res.json());
        } catch (error) {
          console.error("Auth Error:", error);
          handleLogout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token, API_URL, handleLogout]);

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };
  
  if (loading) return <div className="min-h-screen bg-[#262525] flex justify-center items-center text-white">Loading...</div>;

  if (!currentUser) {
    return authView === 'login' ? 
           <LoginPage onLogin={handleLogin} onShowRegister={() => setAuthView('register')} apiUrl={API_URL} /> : 
           <RegisterPage onShowLogin={() => setAuthView('login')} apiUrl={API_URL} />;
  }
  
  return <MainApp currentUser={currentUser} onLogout={handleLogout} apiUrl={API_URL} />;
}


// --- LoginPage ---
const LoginPage = ({ onLogin, onShowRegister, apiUrl }) => {
    const [emailAddress, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        // --- DEBUGGING STEP ---
        console.log('Login form submitted with email:', emailAddress);
        setError('');
        try {
            const res = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailAddress, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Login failed');
            onLogin(data.token);
        } catch (err) { setError(err.message); }
    };
    return (
        <div className="min-h-screen bg-[#262525] flex flex-col justify-center items-center text-white p-4">
            <img src="/asserts/autoslot_logo.jpeg" alt="AutoSlot Logo" className="h-20 mb-8" />
            <div className="bg-[#2d2d2d] p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">Employee Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" placeholder="Email Address" value={emailAddress} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-[#40403E] p-3 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-[#40403E] p-3 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button type="submit" className="w-full bg-[#C16D00] hover:bg-orange-600 font-bold p-3 rounded">Login</button>
                </form>
                <p className="text-center text-sm text-gray-400 mt-6">Don't have an account? <button type="button" onClick={onShowRegister} className="font-semibold text-orange-500 hover:underline">Register here</button></p>
            </div>
        </div>
    );
};

// --- RegisterPage for System Users ---
const RegisterPage = ({ onShowLogin, apiUrl }) => {
    const [formData, setFormData] = useState({ name: '', emailAddress: '', password: '', role: 'Manager' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            const res = await fetch(`${apiUrl}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Registration failed');
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => onShowLogin(), 2000);
        } catch (err) { setError(err.message); }
    };
    return (
        <div className="min-h-screen bg-[#262525] flex flex-col justify-center items-center text-white p-4">
            <img src="/asserts/autoslot_logo.jpeg" alt="AutoSlot Logo" className="h-20 mb-8" />
            <div className="bg-[#2d2d2d] p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">Create System User Account</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="w-full bg-[#40403E] p-3 rounded" />
                    <input type="email" name="emailAddress" placeholder="Email Address" onChange={handleChange} required className="w-full bg-[#40403E] p-3 rounded" />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full bg-[#40403E] p-3 rounded" />
                    <select name="role" onChange={handleChange} value={formData.role} className="w-full bg-[#40403E] p-3 rounded">
                        <option value="Manager">Manager</option>
                        <option value="Admin">Administrator</option>
                    </select>
                    {error && <p className="text-red-500 text-sm text-center pt-1">{error}</p>}
                    {success && <p className="text-green-500 text-sm text-center pt-1">{success}</p>}
                    <button type="submit" className="w-full bg-[#C16D00] hover:bg-orange-600 font-bold p-3 rounded">Register</button>
                </form>
                <p className="text-center text-sm text-gray-400 mt-6">Already have an account? <button type="button" onClick={onShowLogin} className="font-semibold text-orange-500 hover:underline">Sign In</button></p>
            </div>
        </div>
    );
};


// --- Main Application Component ---
const MainApp = ({ currentUser, onLogout, apiUrl }) => {
  const [activeView, setActiveView] = useState('Home');
  const navLinks = ['Home', 'Track Vehicles', 'Employee Management', 'Incidents', 'Reports'];
  const renderView = () => {
    switch (activeView) {
      case 'Track Vehicles': return <TrackVehiclesView apiUrl={apiUrl} />;
      case 'Employee Management': return <EmployeeManagementView apiUrl={apiUrl} />;
      case 'Incidents': return <IncidentManagementView apiUrl={apiUrl} />;
      case 'Reports': return <ReportsView apiUrl={apiUrl} />;
      case 'Profile': return <ProfileView employee={currentUser} />;
      case 'Home': default: return <DashboardView apiUrl={apiUrl} />;
    }
  };
  return (
    <div className="min-h-screen bg-[#262525] text-white font-sans non-printable-area">
      <header className='sticky top-0 z-10'>
         <div className="bg-[#2d2d2d] flex justify-between items-center py-2 px-6">
          <img src="/asserts/autoslot_logo.jpeg" alt="AutoSlot Logo" className="h-12" />
          <div className="flex items-center gap-4 text-white">
            <div className="text-right">
              <p className="font-bold text-md">{currentUser.name}</p>
              <p className="text-xs text-gray-400">{currentUser.role}</p>
            </div>
            <button onClick={() => setActiveView('Profile')} className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </button>
            <button onClick={onLogout} title="Logout" className="w-12 h-12 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>
        <nav className="bg-[#C16D00] flex justify-between items-center px-6">
          <div>
            {navLinks.map(view => (
              <button key={view} onClick={() => setActiveView(view)} className={`py-3 px-5 text-sm font-semibold relative ${activeView === view ? 'text-white' : 'text-gray-200 hover:text-white'}`}>
                {view.toUpperCase()}
                {activeView === view && (<span className="absolute bottom-0 left-0 right-0 h-1 bg-white"></span>)}
              </button>
            ))}
          </div>
        </nav>
      </header>
      <main className="p-6">{renderView()}</main>
    </div>
  );
};

// --- Profile View ---
const ProfileView = ({ employee }) => {
    if (!employee) return <div className="text-center">Loading profile...</div>;
    return (
        <div className="bg-[#40403E] p-8 rounded-lg max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-600 pb-4">My Profile</h2>
            <div className="text-left space-y-4 text-lg">
                <p><span className="font-semibold text-gray-400 w-40 inline-block">Name:</span> {employee.name}</p>
                <p><span className="font-semibold text-gray-400 w-40 inline-block">Email:</span> {employee.emailAddress}</p>
                <p><span className="font-semibold text-gray-400 w-40 inline-block">Role:</span> {employee.role}</p>
            </div>
        </div>
    );
};

// --- Dashboard View ---
const DashboardView = ({ apiUrl }) => {
  const [stats, setStats] = useState({ availableSlots: 4, employees: 0, latestVehicles: 0 });
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [scansRes, officersRes] = await Promise.all([ fetch(`${apiUrl}/camera/scans`), fetch(`${apiUrl}/security-officers`) ]);
            const scansData = await scansRes.json();
            const officersData = await officersRes.json();
            const latest = scansData[0];
            const vehiclesCount = latest ? latest.detectedVehicles.length : 0;
            setStats({ 
                availableSlots: 4 - vehiclesCount,
                employees: officersData.length, 
                latestVehicles: vehiclesCount 
            });
        } catch (error) { console.error("Failed to fetch dashboard data:", error); }
    };
    fetchData();
  }, [apiUrl]);
  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#40403E] p-5 rounded-lg"> <h3 className="text-gray-400 text-sm">Available Parking Slots</h3> <p className="text-3xl font-bold">{stats.availableSlots}</p> </div>
            <div className="bg-[#40403E] p-5 rounded-lg"> <h3 className="text-gray-400 text-sm">Total Security Officers</h3> <p className="text-3xl font-bold">{stats.employees}</p> </div>
            <div className="bg-[#40403E] p-5 rounded-lg"> <h3 className="text-gray-400 text-sm">Vehicles in Latest Scan</h3> <p className="text-3xl font-bold">{stats.latestVehicles}</p> </div>
        </div>
    </div>
  );
};

// --- Track Vehicles View ---
const TrackVehiclesView = ({ apiUrl }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [lastScan, setLastScan] = useState(null);
    const [error, setError] = useState('');
    const handleScan = async () => {
        setIsScanning(true); setError('');
        try {
            const res = await fetch(`${apiUrl}/camera/scan`, { method: 'POST' });
            if (!res.ok) throw new Error('Camera scan failed');
            setLastScan(await res.json());
        } catch (err) { setError(err.message); } 
        finally { setIsScanning(false); }
    };
    const slotsOccupied = lastScan ? lastScan.detectedVehicles.length : 0;
    const slotsAvailable = 4 - slotsOccupied;
    return (
        <div className="space-y-6">
            <div className="bg-[#40403E] p-8 rounded-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Live Parking Area Security Scan</h2>
                <p className="text-gray-400 mb-6">Click the button to simulate a live scan of the parking area (4 slots total).</p>
                <button onClick={handleScan} disabled={isScanning} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg disabled:bg-gray-500">
                    {isScanning ? 'Scanning...' : 'SCAN PARKING AREA'}
                </button>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
            {lastScan && (
                <div className="bg-[#40403E] p-5 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Scan Results (ID: {lastScan.scanID})</h3>
                        <div className={`text-lg font-bold p-2 rounded ${slotsAvailable > 0 ? 'bg-green-600' : 'bg-red-600'}`}>
                            {slotsAvailable > 0 ? `${slotsAvailable} Slots Available` : 'PARKING FULL'}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead><tr className="border-b border-gray-600"><th className="p-2">VEHICLE NUMBER</th><th className="p-2">DETECTED TYPE</th><th className="p-2">CONFIDENCE</th></tr></thead>
                            <tbody>
                                {lastScan.detectedVehicles.map((v, index) => (
                                    <tr key={index} className="border-b border-gray-700"><td className="p-2">{v.vehicleNumber}</td><td className="p-2">{v.vehicleType}</td><td className="p-2">{(v.confidenceScore * 100).toFixed(2)}%</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- REDESIGNED: Employee Management View ---
const EmployeeManagementView = ({ apiUrl }) => {
    const [subView, setSubView] = useState('accounts');
    return (
        <div className="bg-[#40403E] p-5 rounded-lg">
            <div className="flex border-b border-gray-600 mb-4">
                <button onClick={() => setSubView('accounts')} className={`py-2 px-4 font-semibold ${subView === 'accounts' ? 'border-b-2 border-orange-500 text-white' : 'text-gray-400'}`}>Security Officer Accounts</button>
                <button onClick={() => setSubView('shifts')} className={`py-2 px-4 font-semibold ${subView === 'shifts' ? 'border-b-2 border-orange-500 text-white' : 'text-gray-400'}`}>Shift Management</button>
            </div>
            {subView === 'accounts' ? <AccountManagement apiUrl={apiUrl} /> : <ShiftManagement apiUrl={apiUrl} />}
        </div>
    );
};

// --- NEW: Account Management Component (for Security Officers) ---
const AccountManagement = ({ apiUrl }) => {
    const [officers, setOfficers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentOfficer, setCurrentOfficer] = useState({ name: '', contactNumber: '', shift: 'Day' });
    const fetchOfficers = useCallback(async () => {
        try {
            const res = await fetch(`${apiUrl}/security-officers`);
            setOfficers(await res.json());
        } catch (error) { console.error("Failed to fetch officers:", error); }
    }, [apiUrl]);
    useEffect(() => { fetchOfficers(); }, [fetchOfficers]);
    const handleInputChange = (e) => setCurrentOfficer({ ...currentOfficer, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEditing ? `${apiUrl}/security-officers/${currentOfficer._id}` : `${apiUrl}/security-officers`;
        const method = isEditing ? 'PUT' : 'POST';
        try {
            await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(currentOfficer) });
            setIsEditing(false);
            setCurrentOfficer({ name: '', contactNumber: '', shift: 'Day' });
            fetchOfficers();
        } catch (error) { console.error("Submit error:", error); }
    };
    const handleEdit = (officer) => { setIsEditing(true); setCurrentOfficer(officer); };
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await fetch(`${apiUrl}/security-officers/${id}`, { method: 'DELETE' });
                fetchOfficers();
            } catch (error) { console.error("Delete error:", error); }
        }
    };
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Officer' : 'Add New Officer'}</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input name="name" value={currentOfficer.name} onChange={handleInputChange} placeholder="Name" className="w-full bg-[#262525] p-2 rounded" />
                    <input name="contactNumber" value={currentOfficer.contactNumber} onChange={handleInputChange} placeholder="Contact Number" className="w-full bg-[#262525] p-2 rounded" />
                    <select name="shift" value={currentOfficer.shift} onChange={handleInputChange} className="w-full bg-[#262525] p-2 rounded"><option value="Day">Day Shift</option><option value="Night">Night Shift</option></select>
                    <button type="submit" className="w-full bg-[#C16D00] hover:bg-orange-600 p-2 rounded font-bold">{isEditing ? 'Update Officer' : 'Add Officer'}</button>
                    {isEditing && <button type="button" onClick={() => { setIsEditing(false); setCurrentOfficer({ name: '', contactNumber: '', shift: 'Day' }); }} className="w-full bg-gray-600 hover:bg-gray-700 p-2 rounded mt-2">Cancel Edit</button>}
                </form>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-4">All Security Officers</h3>
                <div className="space-y-3">
                    {officers.map(officer => (
                        <div key={officer._id} className="bg-[#262525] p-3 rounded flex justify-between items-center">
                            <div><p className="font-bold">{officer.name} <span className="text-sm font-light text-gray-400">({officer.officerID})</span></p><p className="text-xs text-gray-300">{officer.contactNumber}</p></div>
                            <div className="flex gap-2"><button onClick={() => handleEdit(officer)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-xs rounded">Edit</button><button onClick={() => handleDelete(officer._id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 text-xs rounded">Delete</button></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- NEW: Shift Management Component ---
const ShiftManagement = ({ apiUrl }) => {
    const [securityStaff, setSecurityStaff] = useState([]);
    const fetchSecurityStaff = useCallback(async () => {
        try {
            const res = await fetch(`${apiUrl}/security-officers`);
            setSecurityStaff(await res.json());
        } catch (error) { console.error("Failed to fetch security staff:", error); }
    }, [apiUrl]);
    useEffect(() => { fetchSecurityStaff(); }, [fetchSecurityStaff]);
    const handleShiftChange = async (employeeId, newShift) => {
        const employeeToUpdate = securityStaff.find(emp => emp._id === employeeId);
        if (!employeeToUpdate) return;
        setSecurityStaff(securityStaff.map(emp => emp._id === employeeId ? { ...emp, shift: newShift } : emp));
        try {
            await fetch(`${apiUrl}/security-officers/${employeeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...employeeToUpdate, shift: newShift })
            });
        } catch (error) {
            console.error("Failed to update shift", error);
            fetchSecurityStaff();
        }
    };
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Manage Security Staff Shifts</h2>
            <div className="space-y-3">
                {securityStaff.map(emp => (
                    <div key={emp._id} className="bg-[#262525] p-3 rounded flex justify-between items-center">
                        <div>
                            <p className="font-bold">{emp.name} <span className="text-sm font-light text-gray-400">({emp.officerID})</span></p>
                            <p className="text-xs text-gray-300">{emp.contactNumber}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <select value={emp.shift} onChange={(e) => handleShiftChange(emp._id, e.target.value)} className="bg-[#40403E] p-1 rounded text-xs">
                                <option value="Day">Day Shift</option>
                                <option value="Night">Night Shift</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- UPDATED: Incident Management View with Assignment ---
const IncidentManagementView = ({ apiUrl }) => {
    const [incidents, setIncidents] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentIncident, setCurrentIncident] = useState({ type: 'Suspicious Activity', severity: 'Medium', description: '', status: 'Open' });
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const fetchIncidents = useCallback(async () => {
        try {
            const res = await fetch(`${apiUrl}/incidents`);
            setIncidents(await res.json());
        } catch (error) { console.error("Failed to fetch incidents:", error); }
    }, [apiUrl]);
    useEffect(() => { fetchIncidents(); }, [fetchIncidents]);
    const handleInputChange = (e) => setCurrentIncident({ ...currentIncident, [e.target.name]: e.target.value });
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const url = isEditing ? `${apiUrl}/incidents/${currentIncident._id}` : `${apiUrl}/incidents`;
        const method = isEditing ? 'PUT' : 'POST';
        try {
            await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(currentIncident) });
            setIsEditing(false);
            setCurrentIncident({ type: 'Suspicious Activity', severity: 'Medium', description: '', status: 'Open' });
            fetchIncidents();
        } catch (error) { console.error("Form submit error:", error); }
    };
    const handleEdit = (incident) => { setIsEditing(true); setCurrentIncident(incident); };
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await fetch(`${apiUrl}/incidents/${id}`, { method: 'DELETE' });
                fetchIncidents();
            } catch (error) { console.error("Failed to delete incident:", error); }
        }
    };
    const handleAssignClick = (incident) => { setSelectedIncident(incident); setShowAssignModal(true); };
    const closeAssignModal = () => { setSelectedIncident(null); setShowAssignModal(false); fetchIncidents(); };
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#40403E] p-5 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Incident' : 'Report New Incident'}</h2>
                <form onSubmit={handleFormSubmit} className="space-y-3">
                    <select name="type" value={currentIncident.type} onChange={handleInputChange} className="w-full bg-[#262525] p-2 rounded"><option>Suspicious Activity</option><option>Unauthorized Entry</option><option>Parking Violation</option><option>Accident</option><option>Other</option></select>
                    <select name="severity" value={currentIncident.severity} onChange={handleInputChange} className="w-full bg-[#262525] p-2 rounded"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select>
                    <textarea name="description" value={currentIncident.description} onChange={handleInputChange} placeholder="Description" rows="4" className="w-full bg-[#262525] p-2 rounded"></textarea>
                    <select name="status" value={currentIncident.status} onChange={handleInputChange} className="w-full bg-[#262525] p-2 rounded"><option>Open</option><option>Under Investigation</option><option>Resolved</option><option>Closed</option></select>
                    <button type="submit" className="w-full bg-[#C16D00] hover:bg-orange-600 p-2 rounded font-bold">{isEditing ? 'Update Incident' : 'Submit Report'}</button>
                    {isEditing && <button type="button" onClick={() => {setIsEditing(false); setCurrentIncident({ type: 'Suspicious Activity', severity: 'Medium', description: '', status: 'Open' });}} className="w-full bg-gray-600 hover:bg-gray-700 p-2 rounded mt-2">Cancel Edit</button>}
                </form>
            </div>
            <div className="bg-[#40403E] p-5 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">All Incidents</h2>
                <div className="space-y-3">
                    {incidents.map(inc => (
                        <div key={inc._id} className="bg-[#262525] p-3 rounded">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold">{inc.type} <span className="text-xs font-light text-gray-400">(ID: {inc.incidentID})</span></p>
                                    <p className="text-sm text-gray-300 mt-1">{inc.description}</p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0 ml-4">
                                    <button onClick={() => handleEdit(inc)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-xs rounded">Edit</button>
                                    <button onClick={() => handleDelete(inc._id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 text-xs rounded">Delete</button>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-2 flex justify-between items-center border-t border-gray-700 pt-2">
                                <span>Severity: <span className="font-semibold text-yellow-400">{inc.severity}</span></span>
                                <span>Status: <span className="font-semibold text-green-400">{inc.status}</span></span>
                                <span>Assigned: <span className="font-semibold text-cyan-400">{inc.assignedOfficer ? inc.assignedOfficer.name : 'Unassigned'}</span></span>
                                <button onClick={() => handleAssignClick(inc)} className="bg-gray-600 hover:bg-gray-700 px-2 py-0.5 text-xs rounded">Assign</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {showAssignModal && <AssignOfficerModal incident={selectedIncident} apiUrl={apiUrl} onClose={closeAssignModal} />}
        </div>
    );
};

// --- NEW: Assign Officer Modal ---
const AssignOfficerModal = ({ incident, apiUrl, onClose }) => {
    const [onShiftOfficers, setOnShiftOfficers] = useState([]);
    const [selectedOfficer, setSelectedOfficer] = useState('');
    useEffect(() => {
        const fetchAndFilterOfficers = async () => {
            try {
                const res = await fetch(`${apiUrl}/security-officers`);
                const allOfficers = await res.json();
                const currentHour = new Date().getHours();
                const currentShift = (currentHour >= 7 && currentHour < 19) ? 'Day' : 'Night';
                setOnShiftOfficers(allOfficers.filter(officer => officer.shift === currentShift));
            } catch (error) { console.error("Error fetching officers:", error); }
        };
        fetchAndFilterOfficers();
    }, [apiUrl]);
    const handleAssign = async () => {
        if (!selectedOfficer) return;
        try {
            await fetch(`${apiUrl}/incidents/${incident._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assignedOfficer: selectedOfficer, status: 'Under Investigation' })
            });
            onClose();
        } catch(error) { console.error("Failed to assign officer", error); }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-[#2d2d2d] p-6 rounded-lg w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">Assign Officer to Incident #{incident.incidentID}</h3>
                <p className="text-sm text-gray-400 mb-4">Only officers currently on shift are shown.</p>
                <select value={selectedOfficer} onChange={(e) => setSelectedOfficer(e.target.value)} className="w-full bg-[#40403E] p-2 rounded mb-4">
                    <option value="">Select an Officer</option>
                    {onShiftOfficers.map(officer => (
                        <option key={officer._id} value={officer._id}>{officer.name} ({officer.officerID})</option>
                    ))}
                </select>
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">Cancel</button>
                    <button onClick={handleAssign} className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded">Assign</button>
                </div>
            </div>
        </div>
    );
};

// --- REDESIGNED: Reports View with new Calendar and fixed PDF styles ---
const ReportsView = ({ apiUrl }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateReport = async () => {
        if (!startDate || !endDate) {
            setError('Please select both a start and end date.');
            return;
        }
        setError(''); setLoading(true); setReportData(null);
        try {
            const res = await fetch(`${apiUrl}/reports/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ startDate, endDate })
            });
            if (!res.ok) throw new Error('Failed to generate report');
            setReportData(await res.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPdf = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            <style>
            {`
                .react-datepicker {
                    background-color: #2d2d2d;
                    border-color: #40403E;
                }
                .react-datepicker__header {
                    background-color: #2d2d2d;
                    border-bottom-color: #40403E;
                }
                .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header {
                    color: white;
                }
                .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
                    color: #d1d5db;
                }
                .react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range {
                    background-color: #C16D00;
                }
                .react-datepicker__day:hover {
                    background-color: #40403E;
                }
                .react-datepicker__day--keyboard-selected {
                    background-color: #C16D00;
                }
                .react-datepicker__triangle::before, .react-datepicker__triangle::after {
                    border-bottom-color: #2d2d2d !important;
                }
                 @media print {
                    body {
                        background-color: white !important;
                    }
                    .non-printable-area {
                        display: none !important;
                    }
                    .printable-area {
                        visibility: visible !important;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: auto;
                        box-shadow: none;
                        border-radius: 0;
                    }
                    .printable-area * {
                        color: black !important;
                    }
                    .page-break {
                        page-break-after: always;
                    }
                }
            `}
            </style>

            <div className="bg-[#40403E] p-5 rounded-lg non-printable-area">
                <h2 className="text-xl font-semibold mb-4">Generate System Report</h2>
                <div className="flex flex-wrap items-end gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Start Date</label>
                        <DatePicker 
                            selected={startDate} 
                            onChange={(date) => setStartDate(date)}
                            className="w-full bg-[#262525] p-2 rounded mt-1 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">End Date</label>
                        <DatePicker 
                            selected={endDate} 
                            onChange={(date) => setEndDate(date)}
                            className="w-full bg-[#262525] p-2 rounded mt-1 text-white"
                        />
                    </div>
                    <button onClick={handleGenerateReport} disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500">
                        {loading ? 'Generating...' : 'Generate Report'}
                    </button>
                    {reportData && (
                         <button onClick={handleDownloadPdf} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Download as PDF
                         </button>
                    )}
                </div>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>

            {reportData && (
                <div id="report-content" className="bg-white p-8 rounded-lg printable-area">
                    <div className="text-center mb-8">
                        <img src="/asserts/autoslot_logo.jpeg" alt="AutoSlot Logo" className="h-16 mx-auto mb-4"/>
                        <h2 className="text-3xl font-bold text-black">AutoSlot System Report</h2>
                        <p className="text-gray-600">
                            Report for period: {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
                        </p>
                    </div>
                    <div className="mb-8 page-break">
                        <h3 className="text-2xl font-semibold mb-4 border-b-2 border-gray-300 pb-2 text-black">Vehicle Type Analysis</h3>
                        <ul className="list-disc list-inside text-gray-800">
                            {Object.entries(reportData.scans.flatMap(s => s.detectedVehicles).reduce((acc, v) => {
                                acc[v.vehicleType] = (acc[v.vehicleType] || 0) + 1;
                                return acc;
                            }, {})).map(([type, count]) => (
                                <li key={type} className="text-lg">{type}: <span className="font-bold">{count}</span> detections</li>
                            ))}
                        </ul>
                         <p className="text-lg font-bold mt-4 text-black">Total Vehicles Detected: {reportData.scans.reduce((acc, s) => acc + s.detectedVehicles.length, 0)}</p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold mb-4 border-b-2 border-gray-300 pb-2 text-black">Incident Report</h3>
                        {reportData.incidents.length > 0 ? (
                            <table className="w-full text-left text-sm text-black">
                                <thead><tr className="border-b-2 border-gray-300"><th className="p-2 font-bold">ID</th><th className="p-2 font-bold">TYPE</th><th className="p-2 font-bold">SEVERITY</th><th className="p-2 font-bold">ASSIGNED</th><th className="p-2 font-bold">TIMESTAMP</th></tr></thead>
                                <tbody>
                                    {reportData.incidents.map(inc => (
                                        <tr key={inc._id} className="border-b border-gray-300">
                                            <td className="p-2">{inc.incidentID}</td><td className="p-2">{inc.type}</td>
                                            <td className="p-2">{inc.severity}</td><td className="p-2">{inc.assignedOfficer ? inc.assignedOfficer.name : 'N/A'}</td>
                                            <td className="p-2">{new Date(inc.timestamp).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <p className="text-gray-600">No incidents were reported in this period.</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;

