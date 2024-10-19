const Conversation = require('../models/conversationModel')
const Message      = require('../models/messagesModel')


const addConversation = (members, lastMessage, lastMessageTime) => {
    return new Promise((resolve, reject) => {
        try {
            // Check if conversation already exists
            Conversation.findOne({ members: { $all: members } })
                .then(existingConversation => {
                    if (existingConversation) {
                        // Update existing conversation
                        // existingConversation.lastMessage = lastMessage;
                        // existingConversation.lastMessageTime = lastMessageTime;
                        existingConversation.save()
                            .then(updatedConversation => {
                                resolve({
                                    data: updatedConversation,
                                    status: 200,
                                    message: 'Conversation updated successfully'
                                });
                            })
                            .catch(error => {
                                reject(error);
                            });
                    } else {
                        // Create a new conversation instance
                        const newConversation = new Conversation({
                            members,
                            lastMessage,
                            lastMessageTime
                        });

                        // Save the conversation to the database
                        newConversation.save()
                            .then(savedConversation => {
                                resolve({
                                    data: savedConversation,
                                    status: 200,
                                    message: 'Conversation created successfully'
                                });
                            })
                            .catch(error => {
                                reject(error);
                            });
                    }
                })
                .catch(error => {
                    reject(error);
                });
        } catch (error) {
            reject(error); // Throw error if something goes wrong
        }
    });
};


const getAllConversationsByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            // Find conversations where the given userId is a member
            Conversation.find({ members: { $in: [userId] } }).sort({updatedAt:-1})
                .then(conversations => {
                    resolve({
                        data: conversations,
                        status: 200,
                        message: 'Conversations retrieved successfully'
                    });
                })
                .catch(error => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
};

const addMessage = async (conversationId, senderId, text, recieverId) => {
    try {
        // Create a new message instance
        console.log(conversationId, 'conv id');
        const newMessage = new Message({
            senderId,
            conversationId,
            text,
            recieverId
        });

        // Find the conversation by ID and update the last message and last message time
        let conv = await Conversation.findById(conversationId);

        conv.lastMessage = text;
        conv.lastMessageTime = new Date(Date.now()).toISOString();

        // Save the message and update the conversation
        await Promise.all([newMessage.save(), conv.save()]);

        return {
            data: newMessage,
            status: 200,
            message: 'Message created successfully'
        };
    } catch (error) {
        throw {
            error_code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong on the server',
            status: 500,
            error: error // Optionally include the actual error for debugging purposes
        };
    }
};


const getAllMessages = (conversationId) => {
    return new Promise((resolve, reject) => {
        try {
            // Find all messages in the conversation
            console.log(conversationId);
            Message.find({ conversationId })
                .then(messages => {
                    resolve({
                        data: messages,
                        status: 200,
                        message: 'Messages retrieved successfully'
                    });
                })
                .catch(error => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
};

const messageReaded = async (conversationId, readerId) => {
    try {
        console.log(conversationId, readerId);
        // Update messages' isRead field where senderId is not equal to readerId
        const result = await Message.updateMany(
            { conversationId: conversationId, senderId: { $ne: readerId } },
            { $set: { isRead: true } }
        );

        // Fetch the updated messages
        const messages = await Message.find({ conversationId: conversationId });

        return {
            data: messages,
            status: 200,
            message: 'Messages marked as read successfully'
        };
    } catch (error) {
        throw error;
    }
};


const deleteMessage = async (messageId, deleteType, userId) => {
    try {
        const message = await Message.findById(messageId);
        
        if (!message) {
            // Message not found
            throw { status: 404, message: 'Message not found' };
        }
        
       
        if (!message.senderId.equals(userId)) {
           
            throw { status: 403, message: 'Permission denied' };
        } else if (deleteType === 'everyone' || deleteType === 'self'  ) {
           
            message.deleteType = deleteType
            const conversation = await Conversation.findById(message.conversationId)
            if(conversation.lastMessage === message.text ){
                conversation.lastMessage='message deleted';
                conversation.save()
            }
            
        }

        
    const data =    await message.save();
        return { status: 200, message: 'Message deleted successfully',data:data };
    } catch (error) {
        throw { status: error.status || 500, message: error.message || 'Internal server error', error };
    }
};







module.exports ={ 
    addConversation,
    getAllConversationsByUserId,
    addMessage,
    getAllMessages,
    messageReaded,
    deleteMessage

}