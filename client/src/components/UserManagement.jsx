import React, { useState, useEffect } from 'react';
import {
    Users,
    UserPlus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Eye,
    CheckCircle,
    X,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Mail,
    Phone,
    Building,
    UserCheck,
    Calendar,
    Loader2
} from 'lucide-react';

const API_BASE = 'https://tracking-system-backend-r1jo.onrender.com/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newUser, setNewUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        department: '',
        phoneNumber: ''
    });

    const roles = ['EBM', 'ABM', 'CBM'];
    const departments = [
        'Computer Science Engineering',
        'Information Technology',
        'Artificial Intelligence and Data Science',
        'Electronics and Communication Engineering',
        'Electrical and Electronics Engineering',
        'Artificial Intelligence and Machine learning',
        'Computer Science and Information Technology',
        'CSBS',
        'CIC'
    ];

    // Fetch users with filters and pagination
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage,
                limit: 10,
                ...(searchTerm && { search: searchTerm }),
                ...(selectedDepartment && { department: selectedDepartment }),
                ...(selectedRole && { role: selectedRole })
            });

            const response = await fetch(`${API_BASE}/users?${params}`);
            const data = await response.json();

            setUsers(data.users || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Register new user
    const handleAddUser = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                setShowAddModal(false);
                setNewUser({
                    firstName: '',
                    lastName: '',
                    email: '',
                    role: '',
                    department: '',
                    phoneNumber: ''
                });
                fetchUsers();
            }
        } catch (error) {
            console.error('Error adding user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Update user
    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE}/users/${selectedUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedUser)
            });

            if (response.ok) {
                setShowEditModal(false);
                setSelectedUser(null);
                fetchUsers();
            }
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete user
    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`${API_BASE}/users/${userId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    // Mark attendance
    const handleMarkAttendance = async (email) => {
        try {
            const response = await fetch(`${API_BASE}/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error('Error marking attendance:', error);
        }
    };

    const hasAttendedToday = (user) => {
        if (!user.attend_stamps || user.attend_stamps.length === 0) return false;

        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        return user.attend_stamps.some(stamp => stamp.startsWith(today));
    };


    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm, selectedDepartment, selectedRole]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                        <Users className="w-10 h-10 text-purple-400" />
                        User Management System
                    </h1>
                    <p className="text-gray-300">Manage your team members with ease</p>
                </div>

                {/* Controls */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 mb-8">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search */}
                        <div className="relative flex-1 min-w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                            />
                        </div>

                        {/* Department Filter */}
                        <div className="relative">
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="appearance-none bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                            >
                                <option value="">All Departments</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept} className="bg-slate-800">{dept}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        </div>

                        {/* Role Filter */}
                        <div className="relative">
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="appearance-none bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                            >
                                <option value="">All Roles</option>
                                {roles.map(role => (
                                    <option key={role} value={role} className="bg-slate-800">{role}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        </div>

                        {/* Add User Button */}
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add User
                        </button>
                    </div>
                </div>

                {/* Users Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        {users.map((user, index) => (
                            <div
                                key={user._id}
                                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                                style={{
                                    animationDelay: `${index * 100}ms`
                                }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {user.firstName[0]}{user.lastName[0]}
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setShowViewModal(true);
                                            }}
                                            className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-all duration-300"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedUser({ ...user });
                                                setShowEditModal(true);
                                            }}
                                            className="p-2 text-green-400 hover:bg-green-400/20 rounded-lg transition-all duration-300"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-all duration-300"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-white font-semibold text-lg mb-1">
                                    {user.firstName} {user.lastName}
                                </h3>
                                <p className="text-gray-300 text-sm mb-2">{user.email}</p>
                                <p className="text-purple-300 text-sm mb-3">{user.role} • {user.department}</p>

                                {hasAttendedToday(user) ? (
                                    <button
                                        disabled
                                        className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 cursor-not-allowed"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Attended Today
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleMarkAttendance(user.email)}
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
                                    >
                                        <UserCheck className="w-4 h-4" />
                                        Mark Attendance
                                    </button>
                                )}


                                {user.attend_stamps && user.attend_stamps.length > 0 && (
                                    <p className="text-xs text-gray-400 mt-2 text-center">
                                        Attended {user.attend_stamps.length} times
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 text-white hover:bg-white/20 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${currentPage === page
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                    : 'text-white hover:bg-white/20'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 text-white hover:bg-white/20 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Add User Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 flex flex-col gap-4 rounded-2xl p-8 w-full max-w-md mx-4 animate-in zoom-in-95 duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <UserPlus className="w-6 h-6 text-purple-400" />
                                    Add New User
                                </h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>


                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={newUser.firstName}
                                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={newUser.lastName}
                                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                    required
                                />
                            </div>

                            <input
                                type="email"
                                placeholder="Email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                required
                            />

                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={newUser.phoneNumber}
                                onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                required
                            />

                            <div className="relative">
                                <select
                                    value={newUser.department}
                                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                                    className="appearance-none w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                    required
                                >
                                    <option value="" className="bg-slate-800">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept} value={dept} className="bg-slate-800">{dept}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            </div>

                            <div className="relative">
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="appearance-none w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                    required
                                >
                                    <option value="" className="bg-slate-800">Select Role</option>
                                    {roles.map(role => (
                                        <option key={role} value={role} className="bg-slate-800">{role}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddUser}
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                    {isSubmitting ? 'Adding...' : 'Add User'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit User Modal */}
                {showEditModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md mx-4 animate-in zoom-in-95 duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Edit2 className="w-6 h-6 text-green-400" />
                                    Edit User
                                </h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        value={selectedUser.firstName}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        value={selectedUser.lastName}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                        required
                                    />
                                </div>

                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={selectedUser.email}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                    required
                                />

                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={selectedUser.phoneNumber}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, phoneNumber: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                    required
                                />

                                <div className="relative">
                                    <select
                                        value={selectedUser.department}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, department: e.target.value })}
                                        className="appearance-none w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                        required
                                    >
                                        <option value="" className="bg-slate-800">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept} className="bg-slate-800">{dept}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                </div>

                                <div className="relative">
                                    <select
                                        value={selectedUser.role}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                                        className="appearance-none w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                        required
                                    >
                                        <option value="" className="bg-slate-800">Select Role</option>
                                        {roles.map(role => (
                                            <option key={role} value={role} className="bg-slate-800">{role}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdateUser}
                                        disabled={isSubmitting}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                        {isSubmitting ? 'Updating...' : 'Update User'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* View User Modal */}
                {showViewModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md mx-4 animate-in zoom-in-95 duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Eye className="w-6 h-6 text-blue-400" />
                                    User Details
                                </h2>
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="text-center mb-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                                        {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">
                                        {selectedUser.firstName} {selectedUser.lastName}
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-white">
                                        <Mail className="w-5 h-5 text-purple-400" />
                                        <span>{selectedUser.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white">
                                        <Phone className="w-5 h-5 text-purple-400" />
                                        <span>{selectedUser.phoneNumber}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white">
                                        <Building className="w-5 h-5 text-purple-400" />
                                        <span>{selectedUser.department}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white">
                                        <Users className="w-5 h-5 text-purple-400" />
                                        <span>{selectedUser.role}</span>
                                    </div>
                                    {selectedUser.attend_stamps && selectedUser.attend_stamps.length > 0 && (
                                        <div className="flex items-center gap-3 text-white">
                                            <Calendar className="w-5 h-5 text-purple-400" />
                                            <span>Attended {selectedUser.attend_stamps.length} times</span>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={() => setShowViewModal(false)}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all duration-300"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;