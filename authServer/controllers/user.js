var User = require('../models/user')


module.exports.list = () => {
    return User.find()
               .sort({nome: 1})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.getAllUsers = () => {
    return User
        .find()
        .sort({username: 1})
        .exec()
        .then(doc => doc ? doc : []);
}

module.exports.deleteAllUsers = () => {
    return User
        .deleteMany()
        .exec()
}

module.exports.addManyUsers = users => {
    return User
        .insertMany(users)
        .exec()
}

module.exports.getUser = username => {
    return User.findOne({username: username})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.addUser = u => {
    return User.create(u)
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.loginUser = (username, data) => {
    return User.updateOne({username: username}, {$set: {lastAccess: data}})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.updateUser = newUser => {
    return User.updateOne({_id: newUser._id}, newUser)  
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.deleteUser = username => {
    return User.deleteOne({username:username})
    .then(dados=>{
        return dados
    })
    .catch(erro =>{
        return erro
    })
}