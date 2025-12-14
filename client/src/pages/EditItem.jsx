import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/api';

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchItem() {
      const res = await API.get('/items/mine');
      const item = res.data.find(i => i._id === id);
      setForm(item);
      setImagePreview(item?.images?.[0] || null);
    }
    fetchItem();
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        condition: Number(form.condition)
      };

      // ⚠️ OPTIONAL: only if backend supports image update
      if (imagePreview) {
        payload.images = [imagePreview];
      }

      await API.put(`/items/${id}`, payload);

      alert('Item updated successfully');
      navigate('/dashboard');
    } catch {
      alert('Failed to update item');
    } finally {
      setSaving(false);
    }
  }

  if (!form) {
    return <div className="p-10 text-gray-500">Loading item…</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">

      <div className="w-full max-w-xl card fade-in">

        {/* HEADER */}
        <h1 className="text-3xl font-extrabold gradient-text text-center">
          Edit Item
        </h1>
        <p className="text-center text-gray-500 mt-2 text-sm">
          Update details of your posted item
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Item Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-md border px-4 py-2.5 text-sm
                         focus:ring-2 focus:ring-teal-400 focus:outline-none"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-md border px-4 py-2.5 text-sm
                         focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category
            </label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-md border px-4 py-2.5 text-sm
                         focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          {/* PRICE + CONDITION */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Price (₹)
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className="w-full rounded-md border px-4 py-2.5 text-sm
                           focus:ring-2 focus:ring-teal-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Condition (1–5)
              </label>
              <input
                name="condition"
                type="number"
                min="1"
                max="5"
                value={form.condition}
                onChange={handleChange}
                className="w-full rounded-md border px-4 py-2.5 text-sm
                           focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
          </div>

          {/* IMAGE UPDATE */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Item Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files[0];
                if (!file) return;

                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
              }}
              className="block w-full text-sm"
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-3 h-40 rounded-lg object-cover"
              />
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary w-full text-base"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>

        </form>
      </div>
    </div>
  );
}
