const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    type: { type: String, enum: ['text', 'image', 'video'], required: true, default: 'text' },
    title: { type: String },
    content: { type: String },
    imageUrl: { type: String },
    videoUrl: { type: String },
    thumbnailUrl: { type: String },
    videoWidth: { type: Number },
    videoHeight: { type: Number },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    votes: [{ user: { type: Schema.Types.ObjectId, ref: 'User' }, value: { type: Number, enum: [1, -1] } }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema); 