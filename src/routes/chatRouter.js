import { Router } from 'express';
const router = Router()
import { createConversation, getConversations, addMessage, getAllMessages, messageReaded, deleteMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';


// @desc    Create a new conversation
// @route   POST /api/chats/conversation
// @access  Protected
router.post('/conversation', protect, createConversation);

// @desc    Get all conversations
// @route   GET /api/chats/conversation
// @access  Protected
router.get('/conversation', protect, getConversations);

// @desc    Add a new message to a conversation
// @route   POST /api/chats/message
// @access  Protected
router.post('/message', protect, addMessage);

// @desc    Get all messages in a conversation
// @route   GET /api/chats/message/:conversationId
// @access  Protected
router.get('/message/:conversationId', protect, getAllMessages);

// @desc    Mark a message as read
// @route   PATCH /api/chats/message/read/:conversationId/:readerId
// @access  Protected
router.patch('/message/read/:conversationId/:readerId', protect, messageReaded);

// @desc    Delete a message
// @route   PATCH /api/chats/message/delete/:messageId/:type
// @access  Protected
router.patch('/message/delete/:messageId/:type', protect, deleteMessage);




export default router