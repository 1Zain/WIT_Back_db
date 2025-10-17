import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    media: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Get user data from localStorage (saved during login)
  const currentUser = {
    id: parseInt(localStorage.getItem('userId')),
    name: localStorage.getItem('userName'),
    role: localStorage.getItem('userRole')
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/post', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPosts(response.data);
    } catch (err) {
      setError('Failed to fetch posts');
      if (err.response?.status === 401) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    if (e.target.name === 'media') {
      setFormData({
        ...formData,
        media: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      if (formData.media) {
        formDataToSend.append('media', formData.media);
      }

      if (editingPost) {
        await axios.put(`http://localhost:3000/api/post/${editingPost.id}`, formDataToSend, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
        setSuccess('Post updated successfully!');
      } else {
        await axios.post('http://localhost:3000/api/post', formDataToSend, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
        setSuccess('Post created successfully!');
      }
      
      setFormData({ title: '', content: '', media: null });
      setShowCreateForm(false);
      setEditingPost(null);
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      media: null
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/post/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSuccess('Post deleted successfully!');
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingPost(null);
    setFormData({ title: '', content: '', media: null });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const canEditPost = (post) => {
    return currentUser.role === 'admin' || post.userId === currentUser.id;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Posts</h1>
          <p className="text-gray-600 mt-2">
            {currentUser.role === 'admin' 
              ? '👑 Admin: You can see, create, edit, and delete ALL posts' 
              : '👤 User: You can see all posts, but only edit/delete your own posts'
            }
          </p>
        </div>
        <div className="flex gap-3">
          {currentUser.role === 'admin' && (
            <button 
              onClick={() => navigate('/users')} 
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              👑 Users
            </button>
          )}
          <button 
            onClick={() => navigate('/profile')} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Profile
          </button>
          <button 
            onClick={handleLogout} 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <button 
            onClick={() => setShowCreateForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Create New Post
          </button>
        </div>

        {error && (
          <div className="text-red-600 text-center text-sm bg-red-50 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-600 text-center text-sm bg-green-50 p-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {showCreateForm && (
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter post title"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Content:</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-vertical"
                  placeholder="Enter post content"
                  rows="4"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Media (optional):</label>
                <input
                  type="file"
                  name="media"
                  onChange={handleChange}
                  accept="image/*,video/*"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              
              <div className="flex gap-4 justify-center">
                <button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">All Posts ({posts.length})</h3>
            <div className="text-sm text-gray-600">
              {currentUser.role === 'admin' 
                ? '👑 You can edit/delete any post' 
                : '👤 You can only edit/delete your own posts'
              }
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
            {posts.length === 0 ? (
              <div className="text-center text-xl text-gray-600 py-12">
                No posts available
              </div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">{post.title}</h4>
                      <div className="flex gap-4 text-sm text-gray-600 mt-1">
                        <span className="font-semibold">By: {post.User?.name}</span>
                        <span className="italic">
                          {new Date(post.sharedAt).toLocaleString()}
                        </span>
                        {post.userId === currentUser.id && (
                          <span className="text-blue-600 font-semibold">(Your Post)</span>
                        )}
                      </div>
                    </div>
                    
                    {canEditPost(post) && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(post)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-gray-700 leading-relaxed">{post.content}</p>
                    {post.mediaPath && (
                      <div className="mt-3">
                        <img 
                          src={`http://localhost:3000/${post.mediaPath}`} 
                          alt="Post media"
                          className="max-w-full h-auto rounded-lg shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                  
                  {!canEditPost(post) && (
                    <div className="text-xs text-gray-500 italic">
                      {currentUser.role === 'admin' 
                        ? '👑 Admin can edit/delete this post' 
                        : '👤 You can only edit your own posts'
                      }
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;