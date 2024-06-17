import model from '../models/utilizadores.js'

function login(data){
    var date = new Date().toISOString().substring(0, 16);
    return model.findOneAndUpdate({username: data.username, password: data.password}, {lastAccess: date}, {new: true}).exec()
}

function signup(data){
    const item = new model(data);
    return item.save();
}

export default {login, signup}