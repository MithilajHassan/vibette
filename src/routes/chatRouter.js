const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chatController')
const authMiddleware = require('../middleware/authMiddleware')


// @desc    Create a new conversation
// @route   POST /api/chats/conversation
// @access  Protected
router.post('/conversation', authMiddleware.protect, chatController.createConversation);

// @desc    Get all conversations
// @route   GET /api/chats/conversation
// @access  Protected
router.get('/conversation', authMiddleware.protect, chatController.getConversations);

// @desc    Add a new message to a conversation
// @route   POST /api/chats/message
// @access  Protected
router.post('/message', authMiddleware.protect, chatController.addMessage);

// @desc    Get all messages in a conversation
// @route   GET /api/chats/message/:conversationId
// @access  Protected
router.get('/message/:conversationId', authMiddleware.protect, chatController.getAllMessages);

// @desc    Mark a message as read
// @route   PATCH /api/chats/message/read/:conversationId/:readerId
// @access  Protected
router.patch('/message/read/:conversationId/:readerId', authMiddleware.protect, chatController.messageReaded);

// @desc    Delete a message
// @route   PATCH /api/chats/message/delete/:messageId/:type
// @access  Protected
router.patch('/message/delete/:messageId/:type', authMiddleware.protect, chatController.deleteMessage);




module.exports=router