import model from '../models/utilizadores.js'

function login(data){
    return model.findOne({username: data.username, password: data.password}).exec();
}

function create(data){
    const item = new model(data);
    return item.save();
}

export default {login, create}