const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const reportSchema = new Schema({

    reporterId: {
        type: mongoose.Types.ObjectId,
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
        type: mongoose.Types.ObjectId,
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

module.exports= Report