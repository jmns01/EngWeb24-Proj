var Post = require('../models/post');

module.exports.list = (limit, skip) => {
    return Post
        .find()
        .sort({_id: 1})
        .skip(skip)
        .limit(limit)
        .exec();
}

module.exports.listByInquiricaoId = (inquiricaoId, limit, skip) => {
    return Post
        .find({inquiricaoId: inquiricaoId})
        .sort({Date: 1})
        .skip(skip)
        .limit(limit)
        .exec()
        .then(doc => doc ? doc : []);
}

module.exports.getComments = (postId) => {
    return Post
        .findOne({_id: postId}, {Comments: 1, _id: 0})
        .exec()
        .then(doc => doc ? doc.Comments : []);
}

module.exports.getMaxId = () => {
    return Post
        .find()
        .sort({_id: -1})
        .limit(1)
        .exec()
        .then(doc => doc && doc.length > 0 ? doc[0]._id : 0);
}

module.exports.addPost = (inquiricaoId, post) => {
    return Post
        .create({
            _id: post._id,
            inquiricaoId: inquiricaoId,
            Author : post.Author,
            Date: post.Date,
            Title: post.Title,
            Description: post.Description,
            Comments: []
        });
}

module.exports.addComment = (postId, comment) => {
    return Post
        .updateOne(
            {_id: postId},
            {$push: {Comments: comment}}
        )
        .exec();
}