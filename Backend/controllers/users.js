import model from '../models/users.js'

function read_all(){
    return model.find({}, {password: 0}).exec();
}

function read_all_name(condition){
    return model.find({name: condition}, {password: 0}).exec();
}

function read(id){
    return model.findOne({_id: id}, {password: 0}).exec();
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

export default {read_all, read_all_name, read, create, update, remove}