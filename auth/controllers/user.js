var User = require('../models/user')


module.exports.find = function() {
  console.log("Olá mundo\n");
  return User.find().exec();
};
  
module.exports.getUser = function(username) {
    return User.findOne({ username: username }).exec();
};

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
    return User.updateOne({username: newUser.username}, newUser)  
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

module.exports.deactivateUser = async (username) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { username },
        { $set: { active: false } },
        { new: true }
      );
  
      if (!updatedUser) {
        throw new Error('Utilizador não encontrado.');
      }
  
      return updatedUser;
    } catch (error) {
      console.error('Erro ao desativar o utilizador:', error);
      throw new Error('Ocorreu um erro ao processar a solicitação.');
    }
};

module.exports.activateUser = async (username) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { username },
        { $set: { active: true } },
        { new: true }
      );
  
      if (!updatedUser) {
        throw new Error('Utilizador não encontrado.');
      }
  
      return updatedUser;
    } catch (error) {
      console.error('Erro ao ativar o utilizador:', error);
      throw new Error('Ocorreu um erro ao processar a solicitação.');
    }
  };