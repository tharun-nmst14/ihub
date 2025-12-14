import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import API from '../api/api';

export default function AdminSoldHistory(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('table'); // table | chart

  // filters
  const [buyerFilter, setBuyerFilter] = useState('');
  const [sellerFilter, setSellerFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSoldItems(){
      try {
        const res = await API.get('/admin/sold-items');
        setItems(res.data);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSoldItems();
  }, []);

  // 🔍 FILTER LOGIC
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const buyerMatch =
        !buyerFilter ||
        item.buyerStudentId?.toLowerCase().includes(buyerFilter.toLowerCase());

      const sellerMatch =
        !sellerFilter ||
        item.seller?.name?.toLowerCase().includes(sellerFilter.toLowerCase());

      const soldDate = new Date(item.soldAt);

      const fromMatch =
        !fromDate || soldDate >= new Date(fromDate);

      const toMatch =
        !toDate || soldDate <= new Date(toDate);

      return buyerMatch && sellerMatch && fromMatch && toMatch;
    });
  }, [items, buyerFilter, sellerFilter, fromDate, toDate]);

  // 📊 CHART DATA (monthly count)
  const chartData = useMemo(() => {
    const map = {};
    filteredItems.forEach(item => {
      const d = new Date(item.soldAt);
      const key = `${d.getFullYear()}-${d.getMonth()+1}`;
      map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map).map(([month, count]) => ({
      month,
      count
    }));
  }, [filteredItems]);

  // ⬇ CSV DOWNLOAD
  function downloadCSV(){
    if (!filteredItems.length) return;

    const headers = [
      'Item','Seller','Buyer ID','Price','Created','Sold'
    ];

    const rows = filteredItems.map(i => [
      i.title,
      i.seller?.name || '',
      i.buyerStudentId || '',
      i.price,
      new Date(i.createdAt).toLocaleDateString(),
      new Date(i.soldAt).toLocaleDateString()
    ]);

    const csv =
      [headers, ...rows]
        .map(r => r.map(v => `"${v}"`).join(','))
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sold-items-history.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <div className="p-10 text-gray-500">Loading sold history…</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* HEADER */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold gradient-text">
          Sold Items History
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-md text-sm"
          >
            ← Back
          </button>

          <button
            onClick={() => setView(view === 'table' ? 'chart' : 'table')}
            className="btn-outline text-sm"
          >
            {view === 'table' ? '📊 Chart View' : '📋 Table View'}
          </button>

          <button
            onClick={downloadCSV}
            className="btn-primary text-sm"
          >
            ⬇ Download CSV
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="card mb-6 grid md:grid-cols-4 gap-4">
        <input
          placeholder="Filter by Buyer ID"
          value={buyerFilter}
          onChange={e => setBuyerFilter(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        />

        <input
          placeholder="Filter by Seller Name"
          value={sellerFilter}
          onChange={e => setSellerFilter(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        />

        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        />

        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        />
      </div>

      {/* TABLE VIEW */}
      {view === 'table' && (
        filteredItems.length === 0 ? (
          <div className="card text-gray-600">
            No records match the filters
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Item</th>
                  <th className="p-3 text-left">Seller</th>
                  <th className="p-3 text-left">Buyer ID</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Sold Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.title}</td>
                    <td className="p-3">{item.seller?.name || '—'}</td>
                    <td className="p-3 font-mono text-xs">
                      {item.buyerStudentId || 'N/A'}
                    </td>
                    <td className="p-3">₹{item.price}</td>
                    <td className="p-3">
                      {new Date(item.soldAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* CHART VIEW */}
      {view === 'chart' && (
        <div className="card h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
}
