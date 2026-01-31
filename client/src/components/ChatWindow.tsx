import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, MessageCircle } from 'lucide-react';
import api from '../api/api';
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

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/bookings/${bookingId}/messages`);
        const formattedMessages = response.data.map((msg: any) => ({
          bookingId: msg.bookingId,
          senderId: msg.senderId,
          message: msg.content,
          timestamp: new Date(msg.createdAt),
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();

    const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
    });

    newSocket.on('connect', () => {
      newSocket.emit('join_booking', bookingId);
    });

    newSocket.on('new_message', (message: Message) => {
      setMessages(prev => [...prev, {
        ...message,
        timestamp: new Date(message.timestamp)
      }]);
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
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary-100 p-2 rounded-lg">
            <MessageCircle className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Conversation</h2>
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Portal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-12">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <MessageCircle className="h-12 w-12 text-gray-200" />
            </div>
            <h3 className="text-gray-900 font-bold mb-1">Secure Channel Established</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Start your conversation with the service professional here. All messages are encrypted and logged for your safety.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = msg.senderId === user?.id || String(msg.senderId) === String(user?.id);
            return (
              <div
                key={idx}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              >
                <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[80%]`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${isOwn
                      ? 'bg-primary-600 text-white rounded-tr-none'
                      : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                      }`}
                  >
                    {msg.message}
                  </div>
                  <span className="text-[10px] font-medium text-gray-400 mt-1.5 px-1 uppercase tracking-tighter">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="relative flex items-center bg-gray-50 rounded-xl p-2 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all border border-transparent focus-within:border-primary-100">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message here..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-3 py-2 text-gray-700 placeholder-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-primary-600 text-white p-2.5 rounded-lg hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-40 disabled:grayscale"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[9px] text-center text-gray-400 mt-2 font-medium uppercase tracking-widest">
          Press enter to transmit message
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;


