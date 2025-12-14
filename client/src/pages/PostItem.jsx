import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

export default function PostItem() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('ihub_user'));

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    condition: ''
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user?.isVerified) {
      alert('Your account must be verified before posting items.');
      return;
    }

    let imageUrl = null;

    try {
      // 🔹 STEP 1: Upload image if selected
      if (imageFile) {
        setUploading(true);

        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadRes = await API.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        imageUrl = uploadRes.data.url;
      }

      // 🔹 STEP 2: Create item (existing logic preserved)
      await API.post('/items', {
        ...form,
        price: Number(form.price),
        condition: Number(form.condition),
        images: imageUrl ? [imageUrl] : []
      });

      alert('Item posted successfully!');
      navigate('/dashboard');

    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post item');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className=" max-w-xl card">
        <h1 className="text-3xl font-extrabold gradient-text text-center">
          Post New Item
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Share Your Loved items...with Ihub
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Item Title
            </label>
            <input
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-md border px-4 py-2.5 text-sm"
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
              className="w-full rounded-md border px-4 py-2.5 text-sm"
            />
          </div>

          {/* CATEGORY + PRICE */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Category
              </label>
             <select
  name="category"
  value={form.category}
  onChange={handleChange}
  required
  className=" rounded-md border px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
>
  <option value="">Select Category</option>
  <option value="Books">Books</option>
  <option value="Lab Kits">Lab Kits</option>
  <option value="Stationery">Stationery</option>
  <option value="Electronics">Electronics</option>
  <option value="Calculators">Calculators</option>
  <option value="Notes & Guides">Notes & Guides</option>
  <option value="Sports Items">Sports Items</option>
  <option value="Others">Others</option>
</select>

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Price (₹)
              </label>
              <input
                name="price"
                type="number"
                required
                value={form.price}
                onChange={handleChange}
                className="w-full rounded-md border px-4 py-2.5 text-sm"
              />
            </div>
          </div>

          {/* CONDITION */}
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
              className=" rounded-md border px-4 py-2.5 text-sm"
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-sm font-medium mb-2">
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
                className="mt-3 h-40 w-full rounded-lg object-cover"
              />
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={uploading}
            className="btn-primary w-full text-base"
          >
            {uploading ? 'Uploading...' : 'Post Item'}
          </button>

        </form>
      </div>
    </div>
  );
}
