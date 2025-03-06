import express, { json, urlencoded } from 'express';
import { config } from 'dotenv';
// dotenv configuration
config();
import { createServer } from 'http';
import { Server } from 'socket.io';
import connect from './src/config/mongoose.js';
import cors from 'cors';
import socketIo_Config from './src/services/socketIo.js'; // Import socketIo_Config

// Importing Routes
import userRouter from './src/routes/userRouter.js';
import postRouter from './src/routes/postRouter.js';
import adminRouter from './src/routes/adminRouter.js';
import chatRouter from './src/routes/chatRouter.js';


// MongoDB configuration
connect();

// Create Express app
const app = express();

// Apply middleware
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}));

app.use(json());
app.use(urlencoded({ extended: true }));

// Create HTTP server
const server = createServer(app);


// Initialize Socket.IO with the HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST"] // Allow only GET and POST requests
  }
});

// Configure Socket.IO
socketIo_Config(io);

// Apply routes
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chats", chatRouter);

app.get('/sample', (req, res) => {
  console.log('health server connected');
  res.status(201).json({name:'sinaan'})
})

// Define the listening port
const port = process.env.LISTENING_PORT || 7002;

// Start the server
server.listen(port, () => {
  console.log(`The server is listening on: http://localhost:${port}`);
});
