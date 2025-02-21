import mongoose, { Types } from 'mongoose';
const { Schema, model } = mongoose;


const reportSchema = new Schema({

    reporterId: {
        type: Types.ObjectId,
        ref: 'user',
        require: true
    },

    reporterUsername: {
        type: String,
        require: true
    },

    reportType: {
        type: String,
        require: true
    },

    targetId: {
        type: Types.ObjectId,
        ref:'post',
        require: true
    },

    actionTaken: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true,
})


 const Report = model('report', reportSchema);

export default Report