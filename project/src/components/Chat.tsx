import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, Image, PlusCircle, User } from 'lucide-react';

let typingTimeout: NodeJS.Timeout;

export const Chat = () => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { 
    currentUser, 
    messages, 
    friends, 
    typingUsers,
    sendMessage,
    sendTypingStatus
  } = useStore();

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage(message);
    setMessage('');
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    sendTypingStatus(true);
    clearTimeout(typingTimeout);
    
    typingTimeout = setTimeout(() => {
      sendTypingStatus(false);
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeout);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username}`}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                currentUser?.status === 'online' ? 'bg-green-500' :
                currentUser?.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
              }`} />
            </div>
            <div>
              <h3 className="font-medium">{currentUser?.username}</h3>
              <p className="text-sm text-gray-500">{currentUser?.status}</p>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-2">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Online Friends</h4>
          <div className="mt-2 space-y-2">
            {friends.map((friend) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.username}`}
                    alt={friend.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white ${
                    friend.status === 'online' ? 'bg-green-500' :
                    friend.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                </div>
                <div>
                  <span className="text-sm font-medium">{friend.username}</span>
                  {typingUsers.get(friend.id) && (
                    <p className="text-xs text-gray-500">typing...</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${
                  msg.senderId === currentUser?.id
                    ? 'bg-indigo-500 text-white rounded-l-lg rounded-tr-lg'
                    : 'bg-white text-gray-800 rounded-r-lg rounded-tl-lg'
                } p-3 shadow-sm`}>
                  <p>{msg.content}</p>
                  <span className="text-xs opacity-75 mt-1 block">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex space-x-1 mt-2">
                      {msg.reactions.map((reaction, index) => (
                        <span key={index} className="text-xs">
                          {reaction.type}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <PlusCircle className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Image className="w-5 h-5 text-gray-500" />
            </button>
            <input
              type="text"
              value={message}
              onChange={handleTyping}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-200 rounded-full focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};