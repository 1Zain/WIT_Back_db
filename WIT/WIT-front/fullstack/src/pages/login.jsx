import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Only login endpoint - get token
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      
      const { token } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      
      // Get user profile to store user data and check role
      const profileResponse = await axios.get('http://localhost:3000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Save user data to localStorage for easy access
      const userData = profileResponse.data;
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Also save individual user properties for easy access
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('userRole', userData.role);
      
      // Navigate based on user role
      if (profileResponse.data.role === 'admin') {
        navigate('/users'); // Admin goes to users management
      } else {
        navigate('/posts'); // Regular user goes to posts
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">Login to WIT</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your password"
            />
          </div>
          
          {error && (
            <div className="text-red-600 text-center text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="font-semibold text-gray-700 mb-2">Default Admin Credentials:</p>
          <p className="text-sm text-gray-600">Email: admin@wit.com</p>
          <p className="text-sm text-gray-600">Password: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
