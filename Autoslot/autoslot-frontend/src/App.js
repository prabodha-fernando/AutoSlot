import React, { useState, useEffect } from 'react';
// No logo import is needed since we are using the public folder

function App() {
  const [activeView, setActiveView] = useState('Home'); // Default view is now 'Home'
  const API_URL = 'http://localhost:5000/api';

  // MODIFIED: Updated user details to match the new design
  const [currentUser, setCurrentUser] = useState({
      _id: '68d8c61c8258c97d70ac3d51', // <-- Remember to change this to a REAL ID from your DB
      name: 'Chanu Prabodha',
      role: 'Security Administrator'
  });

  // MODIFIED: Navigation links updated to match the new design
  const navLinks = ['Home', 'Track Vehicles', 'Staff Management', 'Reports'];
  
  // The activeView for 'Home' will now render the Dashboard component
  const renderView = () => {
    switch (activeView) {
      case 'Track Vehicles':
        return <TrackVehiclesView apiUrl={API_URL} />;
      case 'Staff Management':
        return <StaffManagementView apiUrl={API_URL} />;
      case 'Reports':
        return <ReportsView apiUrl={API_URL} />;
      case 'Profile':
        return <ProfileView apiUrl={API_URL} staffId={currentUser._id} />;
      case 'Home': // 'Home' now shows the dashboard
      default:
        return <DashboardView apiUrl={API_URL} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#000001] text-white font-sans">
      {/* --- ENTIRE HEADER SECTION HAS BEEN REBUILT --- */}
      <header className='sticky top-0 z-10'>
        {/* Top Section */}
        <div className="bg-[#2d2d2d] flex justify-between items-center py-2 px-6">
          <div className="flex items-center">
            <img src="/asserts/autoslot_logo.jpeg" alt="AutoSlot Logo" className="h-12" />
          </div>
          <div className="flex items-center gap-4 text-white">
            <div className="text-right">
                <p className="font-bold text-md">{currentUser.name}</p>
                <p className="text-xs text-gray-400">{currentUser.role}</p>
            </div>
            <button onClick={() => setActiveView('Profile')} className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </button>
          </div>
        </div>
        
        {/* Bottom Section - Navigation */}
        <nav className="bg-[#C16D00] flex justify-between items-center px-6">
            <div>
            {navLinks.map(view => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`py-3 px-5 text-sm font-semibold relative ${activeView === view ? 'text-white' : 'text-gray-200 hover:text-white'}`}
                >
                  {view.toUpperCase()}
                  {activeView === view && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-white"></span>
                  )}
                </button>
            ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-orange-700/50 text-white placeholder-gray-300 rounded-md py-1.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
              </div>
              <button className="text-white p-2 focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
        </nav>
      </header>
      
      <main className="p-6">
        {renderView()}
      </main>
    </div>
  );
}


// --- All other components remain the same ---

// --- Dashboard ---
const DashboardView = ({ apiUrl }) => {
  const [stats, setStats] = useState({ inside: 0, staff: 0, entries24h: 0 });
  const [recentMovements, setRecentMovements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [insideRes, staffRes, allLogsRes] = await Promise.all([
                fetch(`${apiUrl}/vehicles/inside`),
                fetch(`${apiUrl}/staff`),
                fetch(`${apiUrl}/vehicles`)
            ]);
            const insideData = await insideRes.json();
            const staffData = await staffRes.json();
            const allLogsData = await allLogsRes.json();
            
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const recentEntries = allLogsData.filter(v => new Date(v.entryTime) > twentyFourHoursAgo);

            setStats({ inside: insideData.length, staff: staffData.length, entries24h: recentEntries.length });
            setRecentMovements(allLogsData.slice(0, 5));
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        }
    };
    fetchData();
  }, [apiUrl]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#40403E] p-5 rounded-lg flex items-center gap-4">
          <div className="bg-orange-500 p-3 rounded-full">{/* Icon */}</div>
          <div>
            <h3 className="text-gray-400 text-sm">Vehicles Currently Inside</h3>
            <p className="text-3xl font-bold">{stats.inside}</p>
          </div>
        </div>
        <div className="bg-[#40403E] p-5 rounded-lg flex items-center gap-4">
          <div className="bg-blue-500 p-3 rounded-full">{/* Icon */}</div>
          <div>
            <h3 className="text-gray-400 text-sm">Total Security Staff</h3>
            <p className="text-3xl font-bold">{stats.staff}</p>
          </div>
        </div>
        <div className="bg-[#40403E] p-5 rounded-lg flex items-center gap-4">
          <div className="bg-green-500 p-3 rounded-full">{/* Icon */}</div>
          <div>
            <h3 className="text-gray-400 text-sm">Total Vehicle Entries (24h)</h3>
            <p className="text-3xl font-bold">{stats.entries24h}</p>
          </div>
        </div>
      </div>
      
      {/* Recent Movements Table */}
      <div className="bg-[#40403E] p-5 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Vehicle Movements</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="p-2">VEHICLE NUMBER</th>
              <th className="p-2">DRIVER NAME</th>
              <th className="p-2">STATUS</th>
              <th className="p-2">TIMESTAMP</th>
            </tr>
          </thead>
          <tbody>
            {recentMovements.map(v => (
              <tr key={v._id} className="border-b border-gray-700">
                <td className="p-2">{v.vehicleNumber}</td>
                <td className="p-2">{v.driverName}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${v.status === 'Inside' ? 'bg-green-500' : 'bg-red-500'}`}>{v.status}</span>
                </td>
                <td className="p-2">{new Date(v.exitTime || v.entryTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Track Vehicles ---
const TrackVehiclesView = ({ apiUrl }) => {
    const [vehiclesInside, setVehiclesInside] = useState([]);
    const [vehicleHistory, setVehicleHistory] = useState([]);
    const [newEntry, setNewEntry] = useState({ vehicleNumber: '', driverName: '', vehicleType: 'Car' });

    const fetchVehicles = async () => {
        try {
            const [insideRes, historyRes] = await Promise.all([
                fetch(`${apiUrl}/vehicles/inside`),
                fetch(`${apiUrl}/vehicles`)
            ]);
            setVehiclesInside(await insideRes.json());
            setVehicleHistory(await historyRes.json());
        } catch (error) {
            console.error("Failed to fetch vehicle data:", error);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, [apiUrl]);

    const handleInputChange = (e) => {
        setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
    };

    const handleAddEntry = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${apiUrl}/vehicles/entry`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEntry)
            });
            setNewEntry({ vehicleNumber: '', driverName: '', vehicleType: 'Car' }); // Reset form
            fetchVehicles(); // Refresh data
        } catch (error) {
            console.error("Failed to add entry:", error);
        }
    };

    const handleMarkAsExited = async (id) => {
        try {
            await fetch(`${apiUrl}/vehicles/exit/${id}`, { method: 'PUT' });
            fetchVehicles(); // Refresh data
        } catch (error) {
            console.error("Failed to mark as exited:", error);
        }
    };

    return (
        <div className="space-y-6">
            {/* New Entry Form */}
            <div className="bg-[#40403E] p-5 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">New Vehicle Entry</h2>
                <form onSubmit={handleAddEntry} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <input name="vehicleNumber" value={newEntry.vehicleNumber} onChange={handleInputChange} placeholder="Vehicle Number" className="bg-[#262525] p-2 rounded" />
                    <input name="driverName" value={newEntry.driverName} onChange={handleInputChange} placeholder="Driver Name" className="bg-[#262525] p-2 rounded" />
                    <select name="vehicleType" value={newEntry.vehicleType} onChange={handleInputChange} className="bg-[#262525] p-2 rounded">
                        <option>Car</option>
                        <option>Motorcycle</option>
                        <option>Van</option>
                        <option>Truck</option>
                    </select>
                    <button type="submit" className="bg-[#C16D00] hover:bg-orange-600 p-2 rounded">Add Entry</button>
                </form>
            </div>

            {/* Vehicles Currently Inside Table */}
            <div className="bg-[#40403E] p-5 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Vehicles Currently Inside</h2>
                <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-gray-600">
                            <th className="p-2">VEHICLE NUMBER</th>
                            <th className="p-2">DRIVER NAME</th>
                            <th className="p-2">VEHICLE TYPE</th>
                            <th className="p-2">ENTRY TIME</th>
                            <th className="p-2">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehiclesInside.map(v => (
                            <tr key={v._id} className="border-b border-gray-700">
                                <td className="p-2">{v.vehicleNumber}</td>
                                <td className="p-2">{v.driverName}</td>
                                <td className="p-2">{v.vehicleType}</td>
                                <td className="p-2">{new Date(v.entryTime).toLocaleString()}</td>
                                <td className="p-2"><button onClick={() => handleMarkAsExited(v._id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 text-xs rounded">Mark as Exited</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Vehicle History Table */}
            <div className="bg-[#40403E] p-5 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Vehicle History</h2>
                <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-gray-600">
                            <th className="p-2">VEHICLE NUMBER</th>
                            <th className="p-2">STATUS</th>
                            <th className="p-2">ENTRY TIME</th>
                            <th className="p-2">EXIT TIME</th>
                        </tr>
                    </thead>
                    <tbody>
                         {vehicleHistory.map(v => (
                            <tr key={v._id} className="border-b border-gray-700">
                                <td className="p-2">{v.vehicleNumber}</td>
                                <td className="p-2"><span className={`px-2 py-1 text-xs rounded-full ${v.status === 'Inside' ? 'bg-green-500' : 'bg-red-500'}`}>{v.status}</span></td>
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

// --- Staff Management ---
const StaffManagementView = ({ apiUrl }) => {
    // This is a simplified version. A full implementation would handle editing state.
    const [staffList, setStaffList] = useState([]);
    const [newStaff, setNewStaff] = useState({ name: '', employeeId: '', contactNumber: '', shift: 'Day' });
    const [newAccount, setNewAccount] = useState({ employeeId: '', username: '', password: '' });

    const fetchStaff = async () => {
        try {
            const res = await fetch(`${apiUrl}/staff`);
            setStaffList(await res.json());
        } catch (error) {
            console.error("Failed to fetch staff:", error);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [apiUrl]);

    const handleStaffInputChange = (e) => {
        setNewStaff({ ...newStaff, [e.target.name]: e.target.value });
    };

    const handleAccountInputChange = (e) => {
        setNewAccount({ ...newAccount, [e.target.name]: e.target.value });
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${apiUrl}/staff`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStaff)
            });
            setNewStaff({ name: '', employeeId: '', contactNumber: '', shift: 'Day' });
            fetchStaff();
        } catch (error) {
            console.error("Failed to add staff:", error);
        }
    };
    
    const handleCreateAccount = async (e) => {
        e.preventDefault();
         try {
            const res = await fetch(`${apiUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAccount)
            });
             if (res.ok) {
                alert('Account created successfully!');
                setNewAccount({ employeeId: '', username: '', password: '' });
             } else {
                 const errorData = await res.json();
                 alert(`Error: ${errorData.msg}`);
             }
        } catch (error) {
            console.error("Failed to create account:", error);
            alert("An error occurred. See console for details.");
        }
    };

    const handleDeleteStaff = async (id) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                await fetch(`${apiUrl}/staff/${id}`, { method: 'DELETE' });
                fetchStaff();
            } catch (error) {
                console.error("Failed to delete staff:", error);
            }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column Forms */}
            <div className="space-y-6">
                <div className="bg-[#40403E] p-5 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Add New Staff</h2>
                    <form onSubmit={handleAddStaff} className="space-y-4">
                        <input name="name" value={newStaff.name} onChange={handleStaffInputChange} placeholder="Name" className="w-full bg-[#262525] p-2 rounded" />
                        <input name="employeeId" value={newStaff.employeeId} onChange={handleStaffInputChange} placeholder="Employee ID" className="w-full bg-[#262525] p-2 rounded" />
                        <input name="contactNumber" value={newStaff.contactNumber} onChange={handleStaffInputChange} placeholder="Contact Number" className="w-full bg-[#262525] p-2 rounded" />
                        <select name="shift" value={newStaff.shift} onChange={handleStaffInputChange} className="w-full bg-[#262525] p-2 rounded">
                            <option>Day</option>
                            <option>Night</option>
                        </select>
                        <button type="submit" className="w-full bg-[#C16D00] hover:bg-orange-600 p-2 rounded">Add Staff</button>
                    </form>
                </div>
                 <div className="bg-[#40403E] p-5 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Create Security Officer Account</h2>
                    <form onSubmit={handleCreateAccount} className="space-y-4">
                        <input name="employeeId" value={newAccount.employeeId} onChange={handleAccountInputChange} placeholder="Employee ID (to link)" className="w-full bg-[#262525] p-2 rounded" />
                        <input name="username" value={newAccount.username} onChange={handleAccountInputChange} placeholder="Username" className="w-full bg-[#262525] p-2 rounded" />
                        <input name="password" type="password" value={newAccount.password} onChange={handleAccountInputChange} placeholder="Password" className="w-full bg-[#262525] p-2 rounded" />
                        <button type="submit" className="w-full bg-[#C16D00] hover:bg-orange-600 p-2 rounded">Create Account</button>
                    </form>
                </div>
            </div>

            {/* Right Column List */}
            <div className="bg-[#40403E] p-5 rounded-lg">
                 <h2 className="text-xl font-semibold mb-4">All Staff Members</h2>
                 <div className="space-y-3">
                     {staffList.map(staff => (
                        <div key={staff._id} className="bg-[#262525] p-3 rounded flex justify-between items-center">
                            <div>
                                <p className="font-bold">{staff.name} <span className="text-sm font-light text-gray-400">({staff.employeeId})</span></p>
                                <p className="text-xs text-gray-300">{staff.contactNumber} - {staff.shift} Shift</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-xs rounded">Edit</button>
                                <button onClick={() => handleDeleteStaff(staff._id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 text-xs rounded">Delete</button>
                            </div>
                        </div>
                     ))}
                 </div>
            </div>
        </div>
    );
};

// --- Reports ---
const ReportsView = ({ apiUrl }) => {
    const [analysis, setAnalysis] = useState({});
    const [activity, setActivity] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                 const [analysisRes, activityRes] = await Promise.all([
                    fetch(`${apiUrl}/reports/vehicle-type-analysis`),
                    fetch(`${apiUrl}/reports/security-activity`)
                ]);
                setAnalysis(await analysisRes.json());
                setActivity(await activityRes.json());
            } catch (error) {
                console.error("Failed to fetch reports:", error);
            }
        };
        fetchData();
    }, [apiUrl]);

    const vehicleTypes = ['Car', 'Motorcycle', 'Van', 'Truck'];
    const maxCount = Math.max(...Object.values(analysis), 0) || 1;

    return (
        <div className="space-y-6">
            {/* Vehicle Type Analysis */}
            <div className="bg-[#40403E] p-5 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Vehicle Type Analysis</h2>
                <div className="flex justify-around items-end h-64 p-4 gap-4">
                  {vehicleTypes.map(type => (
                      <div key={type} className="flex flex-col items-center h-full w-1/4">
                          <div className="text-lg font-bold">{analysis[type] || 0}</div>
                          <div 
                              className="w-3/4 bg-[#C16D00] rounded-t"
                              style={{ height: `${((analysis[type] || 0) / maxCount) * 100}%` }}
                          ></div>
                          <p className="mt-2">{type}</p>
                      </div>
                  ))}
                </div>
            </div>

            {/* Security Activity Report */}
             <div className="bg-[#40403E] p-5 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Security Activity Report (Last 24 hours)</h2>
                <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-gray-600">
                            <th className="p-2">VEHICLE NUMBER</th>
                            <th className="p-2">STATUS</th>
                            <th className="p-2">TIMESTAMP</th>
                        </tr>
                    </thead>
                    <tbody>
                         {activity.map(v => (
                            <tr key={v._id} className="border-b border-gray-700">
                                <td className="p-2">{v.vehicleNumber}</td>
                                <td className="p-2">
                                  <span className={`px-2 py-1 text-xs rounded-full ${v.status === 'Inside' ? 'bg-green-500' : 'bg-red-500'}`}>{v.status}</span>
                                </td>
                                <td className="p-2">{new Date(v.exitTime || v.entryTime).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- ProfileView ---
const ProfileView = ({ apiUrl, staffId }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${apiUrl}/staff`);
                if (!response.ok) throw new Error('Network response was not ok');
                
                const allStaff = await response.json();
                const userProfile = allStaff.find(s => s._id === staffId);

                if (userProfile) {
                    setProfile(userProfile);
                } else {
                    setError('Could not find profile for the specified staff ID.');
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                setError('Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [apiUrl, staffId]);

    if (loading) {
        return <div className="text-center">Loading profile...</div>;
    }
    
    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="bg-[#40403E] p-8 rounded-lg max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-600 pb-4">Security Officer Details</h2>
            <div className="text-left space-y-4 text-lg">
                <p><span className="font-semibold text-gray-400 w-32 inline-block">Name:</span> {profile.name}</p>
                <p><span className="font-semibold text-gray-400 w-32 inline-block">Employee ID:</span> {profile.employeeId}</p>
                <p><span className="font-semibold text-gray-400 w-32 inline-block">Contact:</span> {profile.contactNumber}</p>
                <p><span className="font-semibold text-gray-400 w-32 inline-block">Shift:</span> {profile.shift}</p>
                <p><span className="font-semibold text-gray-400 w-32 inline-block">Date Joined:</span> {new Date(profile.createdAt).toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default App;