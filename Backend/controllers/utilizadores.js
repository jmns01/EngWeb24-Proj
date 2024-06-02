import model from '../models/utilizadores.js'

function read_all(){
    return model.find().exec();
}

// Exemplo de read : ?condition=AAAAA
// Trocar o 'item' pelo nome do atributo desejado
function read_all_condition(condition){
    return model.find({item: condition}).exec();
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

export default {read_all, read_all_condition, read, create, update, remove}