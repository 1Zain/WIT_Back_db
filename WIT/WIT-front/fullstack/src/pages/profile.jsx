import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUser(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      });
    } catch (err) {
      setError('Failed to fetch profile');
      if (err.response?.status === 401) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3000/api/users/${user.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUser(response.data);
      setEditing(false);
      setSuccess('Profile updated successfully!');
      
      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'admin' 
              ? '👑 Admin Profile: You have full access to all features' 
              : '👤 User Profile: You can view and edit your own information'
            }
          </p>
        </div>
        <div className="flex gap-3">
          {user?.role === 'admin' && (
            <button 
              onClick={() => navigate('/users')} 
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              👑 Users
            </button>
          )}
          <button 
            onClick={() => navigate('/posts')} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Posts
          </button>
          <button 
            onClick={handleLogout} 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Edit Profile</h2>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Role:</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={user?.email === 'admin@wit.com'}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            {error && (
              <div className="text-red-600 text-center text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-600 text-center text-sm bg-green-50 p-3 rounded-lg">
                {success}
              </div>
            )}
            
            <div className="flex gap-4 justify-center">
              <button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Save Changes
              </button>
              <button 
                type="button" 
                onClick={() => setEditing(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Profile Information</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="font-semibold text-gray-700">Name:</span>
                <span className="ml-2 text-gray-900">{user?.name}</span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="font-semibold text-gray-700">Email:</span>
                <span className="ml-2 text-gray-900">{user?.email}</span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="font-semibold text-gray-700">Role:</span>
                <span className={`ml-2 font-bold ${user?.role === 'admin' ? 'text-red-600' : 'text-blue-600'}`}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="font-semibold text-gray-700">ID:</span>
                <span className="ml-2 text-gray-900">{user?.id}</span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="font-semibold text-gray-700">Created:</span>
                <span className="ml-2 text-gray-900">{new Date(user?.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            {success && (
              <div className="text-green-600 text-center text-sm bg-green-50 p-3 rounded-lg">
                {success}
              </div>
            )}
            
            <div className="text-center">
              <button 
                onClick={() => setEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
        
        {/* Role-based capabilities section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {user?.role === 'admin' ? '👑 Admin Capabilities' : '👤 User Capabilities'}
          </h3>
          
          {user?.role === 'admin' ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-green-600">✅</span>
                <span>View and edit ALL posts (including other users')</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-600">✅</span>
                <span>Delete ANY post from any user</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-600">✅</span>
                <span>View and manage ALL users</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-600">✅</span>
                <span>Create new users</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-600">✅</span>
                <span>Edit user roles and information</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-600">✅</span>
                <span>Delete users (except default admin)</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-green-600">✅</span>
                <span>View ALL posts from all users</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-600">✅</span>
                <span>Create new posts</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-600">✅</span>
                <span>Edit and delete YOUR OWN posts only</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-600">❌</span>
                <span>Cannot edit/delete other users' posts</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-600">❌</span>
                <span>Cannot access user management</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-600">❌</span>
                <span>Cannot create or manage other users</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;