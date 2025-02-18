import mongoose, { Types } from "mongoose";

const { Schema, model } = mongoose;

const notificationSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "user",
        require: true,
    },

    postId: {
        type: Types.ObjectId,
        ref:"post"
    },

    from: {
        type: Types.ObjectId,
        ref: "user",
    },

    fromUser: {
        type: String
    },

    message: {
        type: String,
        required: true,
    },

    isRead: {
        type: Boolean,
        required: true,
        default: false,
    },
    type:{
     type:String
    }
}, {
    timestamps: true,
});

notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 259200 }); //3days

const Notifications = model("notification", notificationSchema);

export default Notifications;

