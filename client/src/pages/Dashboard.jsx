import { useEffect, useState } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [activeItems, setActiveItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // confirmation modal state
  const [confirmAction, setConfirmAction] = useState(null);
  const [buyerStudentId, setBuyerStudentId] = useState('');

  useEffect(() => {
    fetchMyItems();
  }, []);

  async function fetchMyItems() {
    try {
      const res = await API.get('/items/mine');
      const items = res.data;

      setActiveItems(items.filter(i => i.status === 'active'));
      setSoldItems(items.filter(i => i.status === 'sold'));
    } catch {
      setActiveItems([]);
      setSoldItems([]);
    } finally {
      setLoading(false);
    }
  }

  /* =====================
     ACTION HANDLERS
  ===================== */

 async function markSold(id) {
  const buyerStudentId = window.prompt(
    'Enter Buyer Student ID (required):'
  );

  if (!buyerStudentId || !buyerStudentId.trim()) {
    alert('Buyer Student ID is required');
    return;
  }

  try {
    await API.patch(`/items/${id}/sold`, {
      buyerStudentId: buyerStudentId.trim()
    });

    alert('Item marked as sold');
    fetchMyItems();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || 'Mark sold failed');
  }
}

async function removeItem(id) {
  const ok = window.confirm(
    'Are you sure you want to permanently remove this item?'
  );

  if (!ok) return;

  try {
    await API.delete(`/items/${id}`);
    alert('Item removed');
    fetchMyItems();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || 'Remove failed');
  }
}

  if (loading) {
    return <div className="p-10 text-gray-500">Loading dashboard…</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold gradient-text">
          My Dashboard
        </h1>

        <Link to="/post-item" className="btn btn-success">
          + Post Item
        </Link>
      </div>

      <Link to="/chats" className="btn btn-warning mb-10 inline-block">
        💬 My Chats
      </Link>

      {/* ACTIVE ITEMS */}
      <section className="mb-14">
        <h2 className="text-xl font-bold mb-4">Active Items</h2>

        {activeItems.length === 0 ? (
          <div className="card text-gray-600">No active items</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeItems.map(item => (
              <div key={item._id} className="card">
                <span className="inline-block mb-2 text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
                  Active
                </span>

                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  ₹{item.price} • {item.category}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
  onClick={() => markSold(item._id)}
  className="btn-primary text-sm"
>
  Mark Sold
</button>

<button
  onClick={() => removeItem(item._id)}
  className="btn-info text-sm"
>
  Remove
</button>


                  <Link
                    to={`/edit-item/${item._id}`}
                    className="btn-outline text-sm"
                  >
                    Edit
                  </Link>

                  
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SOLD ITEMS */}
      <section>
        <h2 className="text-xl font-bold mb-4">Sold Items</h2>

        {soldItems.length === 0 ? (
          <div className="card text-gray-600">No sold items yet</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {soldItems.map(item => (
              <div key={item._id} className="card opacity-80">
                <span className="inline-block mb-2 text-xs font-semibold px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                  Sold
                </span>

                <h3 className="font-bold">{item.title}</h3>

                <p className="text-sm text-gray-600 mt-1">
                  ₹{item.price} • {item.category}
                </p>

                <p className="mt-2 text-sm text-gray-700">
                  <span className="font-medium">Sold to:</span>{' '}
                  {item.buyerStudentId || 'N/A'}
                </p>

                <div className="mt-1 text-xs text-gray-400">
                  Sold on {new Date(item.soldAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CONFIRM MODAL */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-2">Confirm Action</h3>

            <p className="text-sm text-gray-600 mb-4">
              {confirmAction.type === 'sold'
                ? 'Mark this item as sold'
                : 'Remove this item permanently'}
            </p>

            {confirmAction.type === 'sold' && (
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Buyer Student ID
                </label>
                <input
                  value={buyerStudentId}
                  onChange={e => setBuyerStudentId(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="Enter buyer student ID"
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                className="btn-outline"
                onClick={() => {
                  setConfirmAction(null);
                  setBuyerStudentId('');
                }}
              >
                Cancel
              </button>

              <button
                className="btn-primary"
                onClick={() => {
                  if (
                    confirmAction.type === 'sold' &&
                    !buyerStudentId.trim()
                  ) {
                    alert('Please enter buyer student ID');
                    return;
                  }

                  confirmAction.type === 'sold'
                    ? markSold(confirmAction.id)
                    : removeItem(confirmAction.id);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
