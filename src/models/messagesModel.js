
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const messageSchema = new Schema({
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        require: true,
    },
    recieverId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        require: true,
    },

    conversationId: {
        type: mongoose.Types.ObjectId,
        ref: "chatRoom",
        require: true,
    },

    text: {
        type: String,
        trim: true,
    },
    isRead:{
        type:Boolean,
        default:false,
    },
    deleteType: {
        type: String,
        enum: ['self', 'everyone','none'], 
        default: 'none'
      }

},{
    timestamps: true,
});


const Message = model('message', messageSchema);
module.exports= Message