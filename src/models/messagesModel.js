
import mongoose, { Types } from 'mongoose';
const { Schema, model } = mongoose;

const messageSchema = new Schema({
    senderId: {
        type: Types.ObjectId,
        ref: "user",
        require: true,
    },
    recieverId: {
        type: Types.ObjectId,
        ref: "user",
        require: true,
    },

    conversationId: {
        type: Types.ObjectId,
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
export default Message