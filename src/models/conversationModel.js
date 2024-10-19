
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const conversationSchema = new Schema({
    members: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: "user"
            }
        ],
        require: true,
    },
    lastMessage: {
        type: String,
    },
    lastMessageTime: {
        type: String
    }
}, {
    timestamps: true,
});


const Conversation = model('conversation', conversationSchema);
module.exports= Conversation