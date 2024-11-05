import { io } from 'socket.io-client';
import { useStore } from '../store/useStore';

const SOCKET_URL = import.meta.env.PROD 
  ? window.location.origin 
  : 'http://localhost:3000';

export const socket = io(SOCKET_URL);

// Socket event handlers
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('users', (users) => {
  const currentUser = useStore.getState().currentUser;
  const friends = users.filter(user => user.id !== currentUser?.id);
  useStore.getState().setFriends(friends);
});

socket.on('message_history', (messages) => {
  useStore.getState().setMessages(messages);
});

socket.on('new_message', (message) => {
  useStore.getState().addMessage(message);
});

socket.on('user_typing', ({ user, isTyping }) => {
  useStore.getState().setUserTyping(user, isTyping);
});

socket.on('message_reaction', ({ messageId, reaction }) => {
  useStore.getState().addReaction(messageId, reaction);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});