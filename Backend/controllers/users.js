import model from '../models/users.js'

function read_all(){
    return model.find().exec();
}

function read_all_name(condition){
    return model.find({name: condition}).exec();
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

export default {read_all, read_all_name, read, create, update, remove}