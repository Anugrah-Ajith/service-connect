import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, MessageCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface Message {
  bookingId: string;
  senderId: string;
  message: string;
  timestamp: Date;
}

interface ChatWindowProps {
  bookingId: string;
}

const ChatWindow = ({ bookingId }: ChatWindowProps) => {
  const { token, user } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token || !user) return;

    const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
    });

    newSocket.on('connect', () => {
      newSocket.emit('join_booking', bookingId);
    });

    newSocket.on('new_message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [bookingId, token, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !socket) return;

    socket.emit('send_message', {
      bookingId,
      message: input,
    });

    setInput('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-4">
        <MessageCircle className="h-5 w-5 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">Chat</h2>
      </div>

      <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = msg.senderId === user?.id || String(msg.senderId) === String(user?.id);
            return (
              <div
                key={idx}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    isOwn
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p>{msg.message}</p>
                  <p className={`text-xs mt-1 ${
                    isOwn ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          onClick={handleSend}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <Send className="h-5 w-5" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;

