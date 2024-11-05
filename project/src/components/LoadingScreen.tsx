import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { MessageSquare } from 'lucide-react';

const tips = [
  "Did you know? You can use emojis to make conversations more fun! 🎉",
  "Pro tip: Double-click a message to react quickly! ❤️",
  "Stay connected with friends across the globe! 🌍",
  "Messages are more fun with GIFs and stickers! 🎯"
];

export const LoadingScreen = () => {
  const { loadingProgress } = useStore();
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
      <div className="text-white text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-8"
        >
          <MessageSquare size={48} />
        </motion.div>
        
        <motion.div
          className="w-64 h-2 bg-white/20 rounded-full overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${loadingProgress}%` }}
          />
        </motion.div>
        
        <motion.p
          className="mt-4 text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {tips[Math.floor(Math.random() * tips.length)]}
        </motion.p>
      </div>
    </div>
  );
};