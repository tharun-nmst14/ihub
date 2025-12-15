// client/src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Listings from './pages/Listings';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import { setAuthToken } from './api/api';
import PostItem from './pages/PostItem';
import EditItem from './pages/EditItem';
import AdminSoldHistory from './pages/AdminSoldHistory';
import MyChats from './pages/MyChats';
import ChatPage from './pages/ChatPage';
import Suggestions from './pages/Suggestions';

function App(){
  const nav = useNavigate();
  useEffect(()=> {
    const token = localStorage.getItem('ihub_token');
    if(token) setAuthToken(token);
  }, []);

  function logout(){
    localStorage.removeItem('ihub_token');
    localStorage.removeItem('ihub_user');
    setAuthToken(null);
    nav('/');
  }

  return (
    <div>
      <header style={{padding:22, borderBottom:'3px solid #79a3f1ff',marginRight:30}}>
        <Link
  to="/"
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none'
  }}
>
  {/* LOGO IMAGE */}
  <img
    src="https://res.cloudinary.com/dkfuo3dcx/image/upload/v1765689730/Ihub_hygaab.png"
    alt="I-Hub Logo"
    style={{
      width: 112,
      height: 142,
      borderRadius: 50,
      objectFit: 'cover'
    }}
  />

  {/* LOGO TEXT */}
  <span
    style={{
      fontWeight: 800,
      fontSize: 20,
      color: '#1f2937'
    }}
  >
    I-Hub
  </span>
</Link>

        <Link to="/" style={{fontWeight:700, marginRight:12}} className='btn btn-accent'>I-Hub</Link>
        <Link to="/listings" style={{marginRight:12}} className='btn btn-success'>Browse</Link>
        <Link to="/dashboard" style={{marginRight:12}} className='btn btn-warning'>Dashboard</Link>
        <Link to="/admin" style={{marginRight:12}} className='btn btn-info'>Login</Link>
        <button onClick={logout} style={{float:'right'}} className='btn btn-danger'>Logout</button>
      </header>

      <main style={{padding:16}}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/post-item" element={<PostItem />} />
          <Route path="/edit-item/:id" element={<EditItem />} />
          <Route path="/admin/sold-history" element={<AdminSoldHistory />} />
          <Route path="/chats" element={<MyChats />} />
          <Route path="/chat/:id" element={<ChatPage />} />
          <Route path="/suggestions" element={<Suggestions />} />

        </Routes>
      </main>

       {/* FOOTER */}
        <footer className="mt-auto w-full py-6 text-center text-sm text-gray-500">
          © 2025 I-Hub • Built by <span className="font-semibold">B20-Batch</span> • v1.0
        </footer>
    </div>
  );
}

export default App;
