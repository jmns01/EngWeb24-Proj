import model from '../models/posts.js'

function read_all(inquiry_id, limit, skip){
    return model.find({inquiricaoId: inquiry_id}).sort({_id: 1}).skip(skip).limit(limit).exec();
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

export default {read_all, create, update, remove}