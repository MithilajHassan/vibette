const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const savedSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    postId: {
        type: Schema.Types.ObjectId,
        ref: "post",
        required: true
    }
}, {
    timestamps: true
});

const Saved = model('saved', savedSchema);

module.exports = Saved;
