const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const connect = require('./src/config/mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketIo_Config = require('./src/services/socketIo'); // Import socketIo_Config

// Importing Routes
const userRouter = require('./src/routes/userRouter');
const postRouter = require('./src/routes/postRouter');
const adminRouter = require('./src/routes/adminRouter');
const chatRouter = require('./src/routes/chatRouter');

// dotenv configuration
dotenv.config();

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create HTTP server
const server = http.createServer(app);


// Initialize Socket.IO with the HTTP server
const io = socketIo(server, {
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

// Define the listening port
const port = process.env.LISTENING_PORT || 7002;

// Start the server
server.listen(port, () => {
    console.log(`The server is listening on: http://localhost:${port}`);
});
