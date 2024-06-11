import model from '../models/inquiries.js'

function read_all(limit, skip){
    return model.find().sort({_id: 1}).skip(skip).limit(limit).exec();
}

function read_all_name(condition, limit, skip){
    return model.find({UnitTitle: {$regex: `${condition}`, $options: 'i'}}).sort({UnitTitle: 1}).skip(skip).limit(limit).exec();
}

function read_all_local(condition, limit, skip){
    return model.find({CountryCode: {$regex: `${condition}`, $options: 'i'}}).sort({UnitTitle: 1}).skip(skip).limit(limit).exec();
}

function read_all_date(condition, limit, skip){
    return model.find({UnitDateInitial: {$regex: `${condition}`, $options: 'i'}}).sort({UnitTitle: 1}).skip(skip).limit(limit).exec();
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

export default {read_all, read_all_name, read_all_local, read_all_date, read, create, update, remove}