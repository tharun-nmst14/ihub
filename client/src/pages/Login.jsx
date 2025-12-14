import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API, { setAuthToken } from '../api/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('ihub_token', res.data.token);
      localStorage.setItem('ihub_user', JSON.stringify(res.data.user));
      setAuthToken(res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden" style={{backgroundColor:'rgba(214, 231, 232, 0.68)'}}>

      {/* SOFT BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-indigo-50 to-white -z-10"></div>

      <div className="w-full max-w-md card fade-in">

        {/* HEADER */}
        <div className="text-center mb-8" >
          <h2 className="text-3xl font-extrabold gradient-text">
            Welcome Back
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Login to continue to I-Hub
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-6">

          {/* EMAIL */}
          <div className='text-center' style={{margin:'20px'}} >
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@rgukt.ac.in"
              className=" rounded-lg border border-gray-300 px-4 py-3 text-sm
                         focus:ring-2 focus:ring-teal-400 focus:border-teal-400
                         focus:outline-none transition"
            />
          </div>

          {/* PASSWORD */}
          <div className='text-center'>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className=" rounded-lg border border-gray-300 px-4 py-3 text-sm
                         focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                         focus:outline-none transition"
            />
          </div>

          {/* SUBMIT */}
          <div className='text-center' style={{marginTop:'20px'}} >
          <button
            type="submit"
            className="btn btn-primary  text-base mt-2"
          >
            Login
          </button> </div>
        </form>

        {/* FOOTER */}
        <div className="mt-8 text-center text-sm text-gray-600" style={{marginTop:'20px'}} >
          Don’t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-teal-600 hover:underline"
          >
            Create one
          </Link>
        </div>

      </div>
    </div>
  );
}
