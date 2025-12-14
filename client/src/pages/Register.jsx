import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';

export default function Register(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleRegister(e){
    e.preventDefault();
    try{
      await API.post('/auth/register', { name, email, password, department });
      alert('Registered successfully! Wait for admin verification.');
      navigate('/login');
    }catch(err){
      alert(err.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center ">
      <div className="w-full max-w-lg card fade-in ">
        <h2 className="text-3xl font-extrabold text-center gradient-text ">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mt-2">
          Join Our campus marketplace - Ihub
        </p>

        <form onSubmit={handleRegister} className="mt-10 space-y-5">
          <div className='text-center'>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              className=" rounded-md border border-gray-300 px-4 py-2.5 text-sm
                         focus:ring-2 focus:ring-teal-400 focus:border-teal-400
                         focus:outline-none transition text-center"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              College Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your_id@rgukt.ac.in"
              className=" rounded-md border border-gray-300 px-4 py-2.5 text-sm
                         focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                         focus:outline-none transition text-center"
            />
          </div>

          <div>
  <label className="block text-sm font-medium text-gray-600 mb-1">
    Department
  </label>

  <select
    value={department}
    onChange={e => setDepartment(e.target.value)}
    className="rounded-md border border-gray-300 px-4 py-2.5 text-sm
               focus:ring-2 focus:ring-amber-400 focus:border-amber-400
               focus:outline-none transition bg-white"
    required
  >
    <option value="">Select Department</option>
    <option value="CSE">CSE</option>
    <option value="ECE">ECE</option>
    <option value="EEE">EEE</option>
    <option value="ME">ME</option>
    <option value="CE">CE</option>
    <option value="MME">MME</option>
    <option value="CHE">CHE</option>
    <option value="PUC">PUC</option>
  </select>
</div>


          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 text-center">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className=" rounded-md border border-gray-300 px-4 py-2.5 text-sm
                         focus:ring-2 focus:ring-teal-400 focus:border-teal-400
                         focus:outline-none transition"
            />
          </div>

          <button type="submit" className="btn-primary  text-base mt-2">
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="gradient-text font-semibold">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
