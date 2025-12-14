import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminDashboard(){
  const nav = useNavigate();

  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [view, setView] = useState('users'); // users | items

  useEffect(()=> {
    const token = localStorage.getItem('ihub_token');
    if(!token){ 
      nav('/login'); 
      return; 
    }

    API.get('/admin/users')
      .then(r => setUsers(r.data))
      .catch(()=> { 
        alert('Admin access required'); 
        nav('/login'); 
      });

    API.get('/admin/items')
      .then(r => setItems(r.data))
      .catch(()=> {});
  }, [nav]);

  async function verifyUser(id){
    try{
      await API.post(`/admin/users/${id}/verify`);
      const r = await API.get('/admin/users');
      setUsers(r.data);
    }catch{
      alert('Verify failed');
    }
  }

  async function removeItem(id){
  try{
    await API.delete(`/items/${id}`); // ✅ correct route
    const r = await API.get('/admin/items');
    setItems(r.data);
  }catch{
    alert('Remove failed');
  }
}


  // ❌ exclude sold items
  const activeItems = items.filter(it => it.status !== 'sold');

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold gradient-text">
          Admin Dashboard
        </h2>

        <Link
          to="/admin/sold-history"
          className="btn-primary text-sm"
        >
          📊 Sold History
        </Link>
      </div>

      {/* TOGGLE BUTTONS */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setView('users')}
          className={`btn btn-info px-4 py-2 rounded-md text-sm border 
            ${view === 'users' ? 'bg-indigo-600 text-white' : 'bg-white'}`}
        >
          👤 Users
        </button>

        <button
          onClick={() => setView('items')}
          className={`btn btn-warning px-4 py-2 rounded-md text-sm border 
            ${view === 'items' ? 'bg-indigo-600 text-white' : 'bg-white'}`}
        >
          📦 Items
        </button>
      </div>

      {/* USERS VIEW */}
      {view === 'users' && (
        <section>
          <h4 className="font-bold mb-3">Users</h4>

          <div className="card p-0">
            {users.map(u => (
              <div
                key={u._id}
                className="flex justify-between items-center px-4 py-3 border-b"
              >
                <div>
                  <div className="font-semibold">{u.name}</div>
                  <div className="text-sm text-gray-600">
                    {u.email} • {u.department || '—'}
                  </div>
                </div>

                <div className="text-right">
                  <div className="btn text-sm mb-1 border-success">
                    {u.isVerified ? '✅ Verified' : '❌ Unverified'}
                  </div>

                  {!u.isVerified && (
                    <button
                      onClick={() => verifyUser(u._id)}
                      className="btn-primary text-xs"
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <div className="p-4 text-gray-500">
                No users found.
              </div>
            )}
          </div>
        </section>
      )}

      {/* ITEMS VIEW */}
      {view === 'items' && (
        <section>
          <h4 className="font-bold mb-3">All Items (Excluding Sold)</h4>

          {activeItems.length === 0 ? (
            <div className="card text-gray-600">
              No active items found.
            </div>
          ) : (
            activeItems.map(it => (
              <div
                key={it._id}
                className="card mb-3 flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold">{it.title}</div>
                  <div className="text-sm text-gray-600">
                    {it.seller?.email || '—'} • ₹{it.price}
                  </div>
                </div>

                <button
                  onClick={() => removeItem(it._id)}
                  className="btn-danger text-sm border-black border-danger-subtle"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </section>
      )}

    </div>
  );
}
