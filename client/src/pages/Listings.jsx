import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

export default function Listings() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('ihub_user'));

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await API.get('/items');
      setItems(res.data);
    } catch {
      setItems([]);
    }
  }

  async function startChat(itemId) {
    const token = localStorage.getItem('ihub_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await API.post(`/conversations/${itemId}`);
      navigate(`/chat/${res.data._id}`);
    } catch {
      alert('Unable to start chat');
    }
  }

  // 🔎 Filter items by search
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* PAGE TITLE */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold gradient-text">
          Available Items
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse items shared by students across our campus
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-8 max-w-md">
       🔎 <input
          type="text"
          placeholder="Search items (books, lab kits, stationery...)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        /> 
      </div>

      {/* EMPTY STATE */}
      {filteredItems.length === 0 && (
        <div className="card text-gray-600">
          No items found
        </div>
      )}

      {/* ITEMS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
        {filteredItems.map(item => {
          const isOwner =
            user &&
            item.seller &&
            typeof item.seller === 'object' &&
            item.seller.email === user.email;

          return (
            <div
              key={item._id}
              className="card fade-in hover:scale-[1.02] transition-transform duration-300"
            >
              {/* IMAGE (COMPACT) */}
              <div className="card-image h-36 mb-3">
                <img
                  src={item.images?.[0] || '/placeholder.png'}
                  alt='image Not Available'
                />
              </div>

              {/* TITLE */}
              <h3 className="font-semibold text-base truncate">
                {item.title}
              </h3>

              {/* META INFO */}
              <div className="text-sm text-gray-500 mt-1">
               {/* <span className="mx-2">• </span> */}
               <span className="font-medium text-gray-700"> <b>Category : </b> {item.category}</span> <br />
                <span className="font-medium text-gray-700"><b>Price :</b></span> ₹{item.price}
               
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
               <b>Description :</b> {item.description}
              </p>

              {/* ACTIONS */}
              <div className="mt-4 flex items-center gap-2">
                {user && item.status === 'active' && !isOwner && (
                  <button
                    onClick={() => startChat(item._id)}
                    className="btn btn-primary text-sm"
                  >
                    💬 Chat
                  </button>
                )}

                {isOwner && (
                  <span className="badge">
                    Your Item
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
