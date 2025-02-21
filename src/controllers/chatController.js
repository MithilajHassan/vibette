import { addConversation, getAllConversationsByUserId, addMessage as _addMessage, getAllMessages as _getAllMessages, messageReaded as _messageReaded, deleteMessage as _deleteMessage } from '../helpers/chatHelper.js';



const createConversation = async(req,res)=>{
    try {
      const {members,lastMessage,lastMessageTime} = req.body
       addConversation(members,lastMessage,lastMessageTime)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
    } catch (error) {
      res.status(500).send(error)
    }
  }

  const getConversations = async(req,res)=>{
    try {
      const userId = req.user.id  
      getAllConversationsByUserId(userId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
    } catch (error) {
        res.status(500).send(error)
    }
  }

  const addMessage = async(req,res)=>{
    try {
      const {conversationId,senderId,text,recieverId} = req.body
      _addMessage(conversationId,senderId,text,recieverId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
    } catch (error) {
        res.status(500).send(error)
    }
  }

  const getAllMessages= async(req,res)=>{
    try {
       const {conversationId} = req.params
       console.log(req.params);
       console.log(conversationId);
      _getAllMessages(conversationId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
    } catch (error) {
        res.status(500).send(error)
    }
  }
  const messageReaded= async(req,res)=>{
    try {
       const {conversationId,readerId} = req.params
      _messageReaded(conversationId,readerId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
    } catch (error) {
        res.status(500).send(error)
    }
  }

  const deleteMessage= async(req,res)=>{
    try {
       const {messageId,type} = req.params
       const userId = req.user.id
       
      _deleteMessage(messageId,type,userId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
    } catch (error) {
        res.status(500).send(error)
    }
  }

  export {
    createConversation,
    getConversations,
    addMessage,
    getAllMessages,
    messageReaded,
    deleteMessage
  }