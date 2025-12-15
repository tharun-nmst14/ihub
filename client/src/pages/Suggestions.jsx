import { useState } from 'react';
import API from '../api/api';

export default function Suggestions() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return alert('Please enter a suggestion');

    try {
      setSending(true);
      await API.post('/suggestions', { name, message });
      alert('Thank you for your suggestion!');
      setName('');
      setMessage('');
    } catch {
      alert('Failed to submit suggestion');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg w-full card fade-in">
        <h2 className="text-2xl font-bold gradient-text text-center">
          Suggestions & Feedback
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            placeholder="Your name (optional)"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded-md px-4 py-2"
          />

          <textarea
            required
            rows="4"
            placeholder="Write your suggestion..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="w-full border rounded-md px-4 py-2"
          />

          <button
            type="submit"
            disabled={sending}
            className="btn btn-primary w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
