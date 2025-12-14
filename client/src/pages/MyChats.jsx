import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import ChatPage from './ChatPage';

export default function MyChats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('ihub_user'));

  useEffect(() => {
    fetchChats();
  }, []);

  async function fetchChats() {
    try {
      const res = await API.get('/conversations');
      setChats(res.data);
    } catch (err) {
      setChats([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-500">Loading chats…</div>;
  }

function formatTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}


  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">
        My Chats
      </h1>

      {chats.length === 0 && (
        <div className="card text-gray-600">
          No conversations yet
        </div>
      )}

      <div className="space-y-4">
        {chats.map(chat => {
          // determine the “other person”
          const isBuyer = chat.buyer._id === user._id;
          const otherUser = isBuyer ? chat.owner : chat.buyer;
          const lastMessage = chat.messages?.[chat.messages.length - 1];
          
          return (
            <div
              key={chat._id}
              className="card cursor-pointer hover:bg-gray-50"
              onClick={() => navigate(`/chat/${chat._id}`)}
            >
              <div className="font-semibold">
                {chat.item?.title}
              </div>

              <div className="text-sm text-gray-600 mt-1">
                Chat with: {otherUser?.name || otherUser?.email}
              </div>
             <p className="text-sm text-gray-600 mt-1 line-clamp-1">
        {lastMessage
          ? `Last Message : ${lastMessage.text}`
          : 'No messages yet'}
      </p>
              <div className="text-xs text-gray-400 mt-1 text-right">
                Last updated: {new Date(chat.updatedAt).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
