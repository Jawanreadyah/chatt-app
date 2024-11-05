import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { MessageSquare } from 'lucide-react';

export const Login = () => {
  const [username, setUsername] = useState('');
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    const user = {
      id: Date.now().toString(),
      username: username.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      status: 'online' as const
    };

    setCurrentUser(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block text-indigo-500 mb-4"
          >
            <MessageSquare size={48} />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome to ChatApp</h1>
          <p className="text-gray-600 mt-2">Enter any username to start chatting</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              placeholder="Enter your username"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white rounded-md py-2 px-4 hover:bg-indigo-600 transition-colors"
          >
            Start Chatting
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>No registration required!</p>
          <p className="mt-1">Your temporary username will be active for this session</p>
        </div>
      </motion.div>
    </div>
  );
};