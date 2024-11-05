import { create } from 'zustand';
import { socket } from '../services/socket';

interface User {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  reactions: Array<{
    userId: string;
    type: string;
  }>;
}

interface ChatStore {
  currentUser: User | null;
  messages: Message[];
  friends: User[];
  typingUsers: Map<string, boolean>;
  isLoading: boolean;
  loadingProgress: number;
  setCurrentUser: (user: User) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setFriends: (friends: User[]) => void;
  setUserTyping: (user: User, isTyping: boolean) => void;
  addReaction: (messageId: string, reaction: any) => void;
  setLoadingProgress: (progress: number) => void;
  sendMessage: (content: string) => void;
  sendTypingStatus: (isTyping: boolean) => void;
  addReactionToMessage: (messageId: string, reactionType: string) => void;
}

export const useStore = create<ChatStore>((set, get) => ({
  currentUser: null,
  messages: [],
  friends: [],
  typingUsers: new Map(),
  isLoading: true,
  loadingProgress: 0,
  
  setCurrentUser: (user) => {
    set({ currentUser: user });
    socket.emit('login', user);
  },
  
  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  
  setFriends: (friends) => set({ friends }),
  
  setUserTyping: (user, isTyping) => set((state) => {
    const newTypingUsers = new Map(state.typingUsers);
    if (isTyping) {
      newTypingUsers.set(user.id, true);
    } else {
      newTypingUsers.delete(user.id);
    }
    return { typingUsers: newTypingUsers };
  }),
  
  addReaction: (messageId, reaction) => set((state) => {
    const messages = state.messages.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          reactions: [...(msg.reactions || []), reaction]
        };
      }
      return msg;
    });
    return { messages };
  }),
  
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  
  sendMessage: (content) => {
    const { currentUser } = get();
    if (!currentUser || !content.trim()) return;
    
    const message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      content,
      timestamp: new Date(),
      reactions: []
    };
    
    socket.emit('message', message);
  },
  
  sendTypingStatus: (isTyping) => {
    socket.emit('typing', isTyping);
  },
  
  addReactionToMessage: (messageId, reactionType) => {
    socket.emit('reaction', { messageId, reaction: reactionType });
  }
}));