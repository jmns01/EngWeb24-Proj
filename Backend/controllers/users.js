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

function export_data(){
    return model.find().sort({_id: 1}).exec().then(doc => doc ? doc : []);
}

function import_data(data){
    return model.insertMany(data).exec();
}

function delete_all(){
    return model.deleteMany().exec();
}

export default {read_all, read_all_name, read, create, update, remove, export_data, import_data, delete_all}