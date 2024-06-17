import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
        Autor: String,
        Date: Date,
        Title: String,
        Description: String
});

const postSchema = new mongoose.Schema({
        _id: mongoose.Types.ObjectId, // "auto-increment"
        inquiricaoId: Number,
        Author: String,
        Date: Date,
        Title: String,
        Description: String,
        Comments: [commentSchema]
}, {collection: 'posts', versionKey : false});

export default mongoose.model('post', postSchema);