import model from '../models/posts.js'

function create(post_id, data){
    model.updateOne({_id: post_id}, {$push: {Comments: data}})
}

export default {create}