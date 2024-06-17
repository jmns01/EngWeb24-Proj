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

function export_data(){
    return model.find().sort({_id: 1}).exec().then(doc => doc ? doc : []);
}

function import_data(data){
    return model.insertMany(data).exec();
}

function delete_all(){
    return model.deleteMany().exec();
}

export default {read_all, create, update, remove, export_data, import_data, delete_all}