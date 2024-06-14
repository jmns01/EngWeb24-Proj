var mongoose = require ('mongoose');

const commentSchema = new mongoose.Schema({
        Autor: String,
        Date: Date,
        Title: String,
        Description: String
});

const postSchema = new mongoose.Schema({
        _id: Number,
        inquiricaoId: Number,
        Author: String,
        Date: Date,
        Title: String,
        Description: String,
        Comments: [commentSchema]
}, {collection: 'posts', versionKey : false});

module.exports = mongoose.model('post', postSchema);