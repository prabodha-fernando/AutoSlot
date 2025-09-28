import React, { useState, useEffect, useCallback } from 'react';

// --- Main App Component: Manages Authentication ---
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
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
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!res.ok) throw new Error('Invalid token');
          const userData = await res.json();
          setCurrentUser(userData);
        } catch (error) {
          console.error("Authentication Error:", error);
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
  
  if (loading) {
    return <div className="min-h-screen bg-[#262525] flex justify-center items-center text-white">Loading...</div>;
  }

  // If not logged in, show either Login or Register page
  if (!currentUser) {
    if (authView === 'login') {
        return <LoginPage onLogin={handleLogin} onShowRegister={() => setAuthView('register')} apiUrl={API_URL} />;
    } else {
        return <RegisterPage onShowLogin={() => setAuthView('login')} apiUrl={API_URL} />;
    }
  }
  
  // If a user is logged in, show the main application
  return <MainApp currentUser={currentUser} onLogout={handleLogout} apiUrl={API_URL} />;
}


// --- Login Page Component ---
const LoginPage = ({ onLogin, onShowRegister, apiUrl }) => {
    const [emailAddress, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        } catch (err) {
            setError(err.message);
        }
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
                <p className="text-center text-sm text-gray-400 mt-6">
                    Don't have an account?{' '}
                    <button onClick={onShowRegister} className="font-semibold text-orange-500 hover:underline">
                        Register here
                    </button>
                </p>
            </div>
        </div>
    );
};

// --- Register Page Component ---
const RegisterPage = ({ onShowLogin, apiUrl }) => {
    const [formData, setFormData] = useState({ name: '', age: '', contactNumber: '', NIC: '', emailAddress: '', password: '', role: 'Security' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const res = await fetch(`${apiUrl}/employees`, {
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
                <h2 className="text-2xl font-bold text-center mb-6">Create Employee Account</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="w-full bg-[#40403E] p-3 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <input type="number" name="age" placeholder="Age" onChange={handleChange} required className="w-full bg-[#40403E] p-3 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <input type="text" name="contactNumber" placeholder="Contact Number" onChange={handleChange} required className="w-full bg-[#40403E] p-3 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <input type="text" name="NIC" placeholder="NIC" onChange={handleChange} required className="w-full bg-[#40403E] p-3 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <input type="email" name="emailAddress" placeholder="Email Address" onChange={handleChange} required className="w-full bg-[#40403E] p-3 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full bg-[#40403E] p-3 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <select name="role" onChange={handleChange} value={formData.role} className="w-full bg-[#40403E] p-3 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option value="Security">Security</option><option value="Admin">Admin</option><option value="Manager">Manager</option>
                    </select>
                    {error && <p className="text-red-500 text-sm text-center pt-1">{error}</p>}
                    {success && <p className="text-green-500 text-sm text-center pt-1">{success}</p>}
                    <button type="submit" className="w-full bg-[#C16D00] hover:bg-orange-600 font-bold p-3 rounded">Register</button>
                </form>
                <p className="text-center text-sm text-gray-400 mt-6">Already have an account? <button onClick={onShowLogin} className="font-semibold text-orange-500 hover:underline">Sign In</button></p>
            </div>
        </div>
    );
};

// --- Main Application Component (Dashboard, etc.) ---
const MainApp = ({ currentUser, onLogout, apiUrl }) => {
  const [activeView, setActiveView] = useState('Home');
  const navLinks = ['Home', 'Track Vehicles', 'Employee Management', 'Reports'];
  const renderView = () => {
    switch (activeView) {
      case 'Track Vehicles': return <TrackVehiclesView apiUrl={apiUrl} />;
      case 'Employee Management': return <EmployeeManagementView apiUrl={apiUrl} />;
      case 'Reports': return <ReportsView apiUrl={apiUrl} />;
      case 'Profile': return <ProfileView employee={currentUser} />;
      case 'Home': default: return <DashboardView apiUrl={apiUrl} />;
    }
  };
  return (
    <div className="min-h-screen bg-[#262525] text-white font-sans">
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
                <p><span className="font-semibold text-gray-400 w-40 inline-block">Employee ID:</span> {employee.employeeID}</p>
                <p><span className="font-semibold text-gray-400 w-40 inline-block">Name:</span> {employee.name}</p>
                <p><span className="font-semibold text-gray-400 w-40 inline-block">Age:</span> {employee.age}</p>
                <p><span className="font-semibold text-gray-400 w-40 inline-block">Email:</span> {employee.emailAddress}</p>
                <p><span className="font-semibold text-gray-400 w-40 inline-block">NIC:</span> {employee.NIC}</p>
                <p><span className="font-semibold text-gray-400 w-40 inline-block">Contact:</span> {employee.contactNumber}</p>
                <p><span className="font-semibold text-gray-400 w-40 inline-block">Role:</span> {employee.role}</p>
            </div>
        </div>
    );
};

// --- Dashboard View ---
const DashboardView = ({ apiUrl }) => {
  const [stats, setStats] = useState({ inside: 0, employees: 0, entries24h: 0 });
  const [recentMovements, setRecentMovements] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [vehiclesRes, employeesRes] = await Promise.all([
                fetch(`${apiUrl}/vehicles`),
                fetch(`${apiUrl}/employees`),
            ]);
            const vehiclesData = await vehiclesRes.json();
            const employeesData = await employeesRes.json();
            const vehiclesInside = vehiclesData.filter(v => !v.exitTime);
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const recentEntries = vehiclesData.filter(v => new Date(v.entryTime) > twentyFourHoursAgo);
            setStats({ inside: vehiclesInside.length, employees: employeesData.length, entries24h: recentEntries.length });
            setRecentMovements(vehiclesData.sort((a,b) => new Date(b.entryTime) - new Date(a.entryTime)).slice(0, 5));
        } catch (error) { console.error("Failed to fetch dashboard data:", error); }
    };
    fetchData();
  }, [apiUrl]);

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#40403E] p-5 rounded-lg"> <h3 className="text-gray-400 text-sm">Vehicles Currently Inside</h3> <p className="text-3xl font-bold">{stats.inside}</p> </div>
            <div className="bg-[#40403E] p-5 rounded-lg"> <h3 className="text-gray-400 text-sm">Total Employees</h3> <p className="text-3xl font-bold">{stats.employees}</p> </div>
            <div className="bg-[#40403E] p-5 rounded-lg"> <h3 className="text-gray-400 text-sm">Vehicle Entries (24h)</h3> <p className="text-3xl font-bold">{stats.entries24h}</p> </div>
        </div>
        <div className="bg-[#40403E] p-5 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Recent Vehicle Movements</h2>
            <table className="w-full text-left">
                <thead><tr className="border-b border-gray-600"><th className="p-2">VEHICLE ID</th><th className="p-2">VEHICLE NUMBER</th><th className="p-2">STATUS</th><th className="p-2">TIMESTAMP</th></tr></thead>
                <tbody>
                    {recentMovements.map(v => (
                        <tr key={v._id} className="border-b border-gray-700">
                            <td className="p-2">{v.vehicleID}</td><td className="p-2">{v.vehicleNumber}</td>
                            <td className="p-2"><span className={`px-2 py-1 text-xs rounded-full ${!v.exitTime ? 'bg-green-500' : 'bg-red-500'}`}>{!v.exitTime ? 'Inside' : 'Exited'}</span></td>
                            <td className="p-2">{new Date(v.exitTime || v.entryTime).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

// --- Track Vehicles View ---
const TrackVehiclesView = ({ apiUrl }) => {
    const [allVehicles, setAllVehicles] = useState([]);
    const [newVehicle, setNewVehicle] = useState({ vehicleNumber: '', vehicleType: 'Car', reservationType: 'Standard' });
    const fetchVehicles = useCallback(async () => {
        try {
            const res = await fetch(`${apiUrl}/vehicles`);
            const data = await res.json();
            setAllVehicles(data.sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime)));
        } catch (error) { console.error("Failed to fetch vehicles:", error); }
    }, [apiUrl]);
    useEffect(() => { fetchVehicles(); }, [fetchVehicles]);
    const handleInputChange = (e) => setNewVehicle({ ...newVehicle, [e.target.name]: e.target.value });
    const handleAddVehicle = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${apiUrl}/vehicles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newVehicle, entryTime: new Date() })
            });
            setNewVehicle({ vehicleNumber: '', vehicleType: 'Car', reservationType: 'Standard' });
            fetchVehicles();
        } catch (error) { console.error("Failed to add vehicle:", error); }
    };
    const handleMarkAsExited = async (id) => {
        try {
            await fetch(`${apiUrl}/vehicles/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ exitTime: new Date() })
            });
            fetchVehicles();
        } catch (error) { console.error("Failed to mark as exited:", error); }
    };
    const vehiclesInside = allVehicles.filter(v => !v.exitTime);
    return (
        <div className="space-y-6">
            <div className="bg-[#40403E] p-5 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">New Vehicle Entry</h2>
                <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <input name="vehicleNumber" value={newVehicle.vehicleNumber} onChange={handleInputChange} placeholder="Vehicle Number" className="bg-[#262525] p-2 rounded" />
                    <select name="vehicleType" value={newVehicle.vehicleType} onChange={handleInputChange} className="bg-[#262525] p-2 rounded"><option>Car</option><option>Motorcycle</option><option>Van</option><option>Truck</option></select>
                    <select name="reservationType" value={newVehicle.reservationType} onChange={handleInputChange} className="bg-[#262525] p-2 rounded"><option>Standard</option><option>Reserved</option><option>VIP</option><option>Monthly Pass</option></select>
                    <button type="submit" className="bg-[#C16D00] hover:bg-orange-600 p-2 rounded">Add Entry</button>
                </form>
            </div>
            <div className="bg-[#40403E] p-5 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Vehicles Currently Inside</h2>
                <table className="w-full text-left">
                  <thead><tr className="border-b border-gray-600"><th className="p-2">ID</th><th className="p-2">VEHICLE NO.</th><th className="p-2">TYPE</th><th className="p-2">ENTRY TIME</th><th className="p-2">ACTIONS</th></tr></thead>
                  <tbody>
                    {vehiclesInside.map(v => (
                        <tr key={v._id} className="border-b border-gray-700">
                          <td className="p-2">{v.vehicleID}</td><td className="p-2">{v.vehicleNumber}</td><td className="p-2">{v.vehicleType}</td>
                          <td className="p-2">{new Date(v.entryTime).toLocaleString()}</td>
                          <td className="p-2"><button onClick={() => handleMarkAsExited(v._id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 text-xs rounded">Mark as Exited</button></td>
                        </tr>
                    ))}
                  </tbody>
                </table>
            </div>
            <div className="bg-[#40403E] p-5 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Full Vehicle History</h2>
                <table className="w-full text-left">
                  <thead><tr className="border-b border-gray-600"><th className="p-2">ID</th><th className="p-2">VEHICLE NO.</th><th className="p-2">TYPE</th><th className="p-2">ENTRY TIME</th><th className="p-2">EXIT TIME</th></tr></thead>
                  <tbody>
                    {allVehicles.map(v => (
                        <tr key={v._id} className="border-b border-gray-700">
                          <td className="p-2">{v.vehicleID}</td><td className="p-2">{v.vehicleNumber}</td><td className="p-2">{v.vehicleType}</td>
                          <td className="p-2">{new Date(v.entryTime).toLocaleString()}</td>
                          <td className="p-2">{v.exitTime ? new Date(v.exitTime).toLocaleString() : 'N/A'}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Employee Management View ---
const EmployeeManagementView = ({ apiUrl }) => {
    const [employees, setEmployees] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState({ name: '', age: '', contactNumber: '', NIC: '', emailAddress: '', password: '', role: 'Security' });
    const fetchEmployees = useCallback(async () => {
        try {
            const res = await fetch(`${apiUrl}/employees`);
            setEmployees(await res.json());
        } catch (error) { console.error("Failed to fetch employees:", error); }
    }, [apiUrl]);
    useEffect(() => { fetchEmployees(); }, [fetchEmployees]);
    const handleInputChange = (e) => setCurrentEmployee({ ...currentEmployee, [e.target.name]: e.target.value });
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const url = isEditing ? `${apiUrl}/employees/${currentEmployee._id}` : `${apiUrl}/employees`;
        const method = isEditing ? 'PUT' : 'POST';
        try {
            await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(currentEmployee) });
            setIsEditing(false);
            setCurrentEmployee({ name: '', age: '', contactNumber: '', NIC: '', emailAddress: '', password: '', role: 'Security' });
            fetchEmployees();
        } catch (error) { console.error("Form submit error:", error); }
    };
    const handleEdit = (employee) => {
        setIsEditing(true);
        setCurrentEmployee({ ...employee, password: '' });
    };
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await fetch(`${apiUrl}/employees/${id}`, { method: 'DELETE' });
                fetchEmployees();
            } catch (error) { console.error("Failed to delete employee:", error); }
        }
    };
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#40403E] p-5 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Employee' : 'Add New Employee'}</h2>
                <form onSubmit={handleFormSubmit} className="space-y-3">
                    <input name="name" value={currentEmployee.name} onChange={handleInputChange} placeholder="Name" className="w-full bg-[#262525] p-2 rounded" />
                    <input name="age" type="number" value={currentEmployee.age} onChange={handleInputChange} placeholder="Age" className="w-full bg-[#262525] p-2 rounded" />
                    <input name="contactNumber" value={currentEmployee.contactNumber} onChange={handleInputChange} placeholder="Contact Number" className="w-full bg-[#262525] p-2 rounded" />
                    <input name="NIC" value={currentEmployee.NIC} onChange={handleInputChange} placeholder="NIC" className="w-full bg-[#262525] p-2 rounded" />
                    <input name="emailAddress" type="email" value={currentEmployee.emailAddress} onChange={handleInputChange} placeholder="Email Address" className="w-full bg-[#262525] p-2 rounded" />
                    <input name="password" type="password" value={currentEmployee.password} onChange={handleInputChange} placeholder={isEditing ? 'New Password (Optional)' : 'Password'} className="w-full bg-[#262525] p-2 rounded" />
                    <select name="role" value={currentEmployee.role} onChange={handleInputChange} className="w-full bg-[#262525] p-2 rounded"><option value="Security">Security</option><option value="Admin">Admin</option><option value="Manager">Manager</option></select>
                    <button type="submit" className="w-full bg-[#C16D00] hover:bg-orange-600 p-2 rounded font-bold">{isEditing ? 'Update Employee' : 'Add Employee'}</button>
                    {isEditing && <button type="button" onClick={() => {setIsEditing(false); setCurrentEmployee({ name: '', age: '', contactNumber: '', NIC: '', emailAddress: '', password: '', role: 'Security' });}} className="w-full bg-gray-600 hover:bg-gray-700 p-2 rounded mt-2">Cancel Edit</button>}
                </form>
            </div>
            <div className="bg-[#40403E] p-5 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">All Employees</h2>
                <div className="space-y-3">
                    {employees.map(emp => (
                        <div key={emp._id} className="bg-[#262525] p-3 rounded flex justify-between items-center">
                            <div><p className="font-bold">{emp.name} <span className="text-sm font-light text-gray-400">({emp.employeeID})</span></p></div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(emp)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-xs rounded">Edit</button>
                                <button onClick={() => handleDelete(emp._id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 text-xs rounded">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Reports View ---
const ReportsView = ({ apiUrl }) => {
    const [analysis, setAnalysis] = useState({});
    const [activity, setActivity] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                 const [vehiclesRes] = await Promise.all([ fetch(`${apiUrl}/vehicles`) ]);
                 const vehicles = await vehiclesRes.json();
                 const analysisData = vehicles.reduce((acc, vehicle) => {
                    acc[vehicle.vehicleType] = (acc[vehicle.vehicleType] || 0) + 1;
                    return acc;
                 }, {});
                 setAnalysis(analysisData);
                 const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                 const recentActivity = vehicles.filter(v => new Date(v.entryTime) > twentyFourHoursAgo);
                 setActivity(recentActivity);
            } catch (error) { console.error("Failed to fetch reports:", error); }
        };
        fetchData();
    }, [apiUrl]);
    const vehicleTypes = ['Car', 'Motorcycle', 'Van', 'Truck'];
    const maxCount = Math.max(...Object.values(analysis), 0) || 1;
    return (
        <div className="space-y-6">
            <div className="bg-[#40403E] p-5 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Vehicle Type Analysis</h2>
                <div className="flex justify-around items-end h-64 p-4 gap-4">
                  {vehicleTypes.map(type => (
                      <div key={type} className="flex flex-col items-center h-full w-1/4">
                          <div className="text-lg font-bold">{analysis[type] || 0}</div>
                          <div className="w-3/4 bg-[#C16D00] rounded-t" style={{ height: `${((analysis[type] || 0) / maxCount) * 100}%` }}></div>
                          <p className="mt-2">{type}</p>
                      </div>
                  ))}
                </div>
            </div>
            <div className="bg-[#40403E] p-5 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Security Activity Report (Last 24 hours)</h2>
                <table className="w-full text-left">
                     <thead><tr className="border-b border-gray-600"><th className="p-2">VEHICLE ID</th><th className="p-2">STATUS</th><th className="p-2">TIMESTAMP</th></tr></thead>
                    <tbody>
                         {activity.map(v => (
                            <tr key={v._id} className="border-b border-gray-700">
                                <td className="p-2">{v.vehicleID}</td>
                                <td className="p-2"><span className={`px-2 py-1 text-xs rounded-full ${!v.exitTime ? 'bg-green-500' : 'bg-red-500'}`}>{!v.exitTime ? 'Inside' : 'Exited'}</span></td>
                                <td className="p-2">{new Date(v.entryTime).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default App;

