import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:5173"]
  }
});

// In-memory storage
const users = new Map();
const messages = [];
const MAX_MESSAGES = 100;

app.use(cors());
app.use(express.json());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user login
  socket.on('login', (user) => {
    users.set(socket.id, {
      ...user,
      socketId: socket.id
    });
    
    // Broadcast user list update
    io.emit('users', Array.from(users.values()));
    
    // Send message history to new user
    socket.emit('message_history', messages);
  });

  // Handle new messages
  socket.on('message', (message) => {
    const user = users.get(socket.id);
    if (!user) return;

    const newMessage = {
      ...message,
      sender: user,
      timestamp: new Date()
    };

    messages.push(newMessage);
    if (messages.length > MAX_MESSAGES) {
      messages.shift();
    }

    io.emit('new_message', newMessage);
  });

  // Handle typing status
  socket.on('typing', (isTyping) => {
    const user = users.get(socket.id);
    if (!user) return;

    socket.broadcast.emit('user_typing', {
      user,
      isTyping
    });
  });

  // Handle message reactions
  socket.on('reaction', ({ messageId, reaction }) => {
    const user = users.get(socket.id);
    if (!user) return;

    const message = messages.find(m => m.id === messageId);
    if (message) {
      if (!message.reactions) {
        message.reactions = [];
      }

      message.reactions.push({
        user,
        type: reaction,
        timestamp: new Date()
      });

      io.emit('message_reaction', {
        messageId,
        reaction: {
          user,
          type: reaction,
          timestamp: new Date()
        }
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      users.delete(socket.id);
      io.emit('users', Array.from(users.values()));
    }
    console.log('User disconnected:', socket.id);
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Catch-all route for SPA in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});