const chatHelper = require('../helpers/chatHelper');



const createConversation = async(req,res)=>{
    try {
      const {members,lastMessage,lastMessageTime} = req.body
       chatHelper.addConversation(members,lastMessage,lastMessageTime)
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
      chatHelper.getAllConversationsByUserId(userId)
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
      chatHelper.addMessage(conversationId,senderId,text,recieverId)
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
      chatHelper.getAllMessages(conversationId)
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
      chatHelper.messageReaded(conversationId,readerId)
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
       
      chatHelper.deleteMessage(messageId,type,userId)
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

  module.exports={
    createConversation,
    getConversations,
    addMessage,
    getAllMessages,
    messageReaded,
    deleteMessage
  }