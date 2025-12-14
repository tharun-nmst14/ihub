import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/api';

export default function ChatPage() {
  const { id } = useParams();

  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('ihub_user'));

  useEffect(() => {
    fetchConversation();
    // eslint-disable-next-line
  }, [id]);

  // 🔽 AUTO-SCROLL WHEN MESSAGES CHANGE
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat?.messages]);

  async function fetchConversation() {
    try {
      const res = await API.get(`/conversations/${id}`);
      setChat(res.data);
    } catch {
      setChat(null);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    if (!message.trim()) return;

    try {
      setSending(true);
      await API.post(`/conversations/${id}/message`, {
        text: message
      });
      setMessage('');
      fetchConversation(); // reload messages
    } catch {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-500">Loading chat…</div>;
  }

  if (!chat) {
    return <div className="p-6 text-red-500">Chat not found</div>;
  }

  const isBuyer = chat?.buyer?._id === user?._id;
  const otherUser = isBuyer ? chat?.owner : chat?.buyer;

  function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col h-[80vh]">

      {/* HEADER */}
      <div className="mb-4 border-b pb-3">
        <h2 className="text-xl font-bold">
          {chat.item?.title}
        </h2>
        <p className="text-sm text-gray-600">
          Chat with {otherUser?.name || otherUser?.email}
        </p>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {chat.messages.length === 0 && (
          <div className="text-gray-500">
            No messages yet
          </div>
        )}
        

       {chat.messages.map((msg, index) => {
  const isMine = msg?.sender?._id === user?._id;

  return (
    <div key={index} style={{ width: '100%', overflow: 'hidden' }}>
      <div
        style={{
          maxWidth: '70%',
          float: isMine ? 'right' : 'left',
          clear: 'both',
          background: isMine ? '#2563eb' : '#e5e7eb',
          color: isMine ? '#fff' : '#111',
          padding: '10px 14px',
          borderRadius: '16px',
          marginBottom: '8px'
        }}
      >
        <div>{msg.text}</div>

        <div
          style={{
            fontSize: '10px',
            opacity: 0.9,
            textAlign: isMine ? 'right' : 'left',
            marginTop: '4px'
          }}
        >
           <span style={{ marginRight: '10px' }}>
    {isMine ? 'You' : (msg.sender?.name || otherUser?.name || 'User')}
  </span>
  <span>
    {formatTime(msg.createdAt)}
  </span>
        </div>
      </div>
    </div>
  );
})}



        {/* 🔽 AUTO-SCROLL TARGET */}
        <div ref={messagesEndRef} />
      </div>

      {/* MESSAGE INPUT */}
      <div className="flex gap-2 border-t pt-3">
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none"
          onKeyDown={e => {
            if (e.key === 'Enter') sendMessage();
          }}
        />

        <button
          onClick={sendMessage}
          disabled={sending}
          className="btn btn-primary"
        >
          Send
        </button>
      </div>

    </div>
  );
}
