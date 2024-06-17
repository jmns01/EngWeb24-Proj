import model from '../models/posts.js'

function read_all(limit, skip){
    return model.find().sort({_id: 1}).skip(skip).limit(limit).exec();
}

function read(id){
    return model.findOne({_id: id}).exec();
}

function create(data){
    const item = new model(data);
    return item.save();
}

function update(id, data){
    return model.findOneAndUpdate({_id: id}, data).exec();
}

function remove(){
    return model.findOneAndDelete({_id: id}).exec();
}

export default {read_all, read, create, update, remove}