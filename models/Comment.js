const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Comment', default: null }, // reply to another comment
    votes: [{ user: { type: Schema.Types.ObjectId, ref: 'User' }, value: { type: Number, enum: [1, -1] } }],
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema); 