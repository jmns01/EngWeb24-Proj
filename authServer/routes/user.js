var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var auth = require('../auth/auth')
var jwt = require('jsonwebtoken')
var dotenv = require('dotenv')

var User = require('../controllers/user')

function generate_token(data){
  return jwt.sign(data, process.env.JWT_SECRET_KEY, {expiresIn: '3000s'})
}

router.get('/get', auth.is_admin, function(req, res){
  User.list()
    .then(users => {
      res.status(200).jsonp(users)
    })
    .catch(erro => res.status(502).jsonp({error: "Erro na obtenção da lista de users: " + erro}))
})

router.get('/getAllUsers', auth.is_admin, function(req, res){
  User.getAllUsers()
    .then(users => {
      res.status(200).jsonp(users)
    })
    .catch(erro => res.status(500).jsonp({error: "Erro na obtenção da lista de users: " + erro}))
});

router.get('/deleteAllUsers', auth.is_admin, function(req, res){
  User.deleteAllUsers()
    .then(users => {
      res.status(200).jsonp(users)
    })
    .catch(erro => res.status(500).jsonp({error: "Erro na obtenção da lista de users: " + erro}))
});

router.post('/addManyUsers', auth.is_admin, function(req, res){
  User.addManyUsers(req.body)
    .then(users => {
      res.status(200).jsonp(users)
    })
    .catch(erro => res.status(500).jsonp({error: "Erro na adição de users: " + erro}))
});

router.get('/get/:username', auth.verify_token, function(req, res){
  User.getUser(req.params.username)
    .then(user => {
      res.status(200).jsonp(user)
    })
    .catch(erro => res.status(501).jsonp({error: "Erro na obtenção do user: " + erro}))
})

router.put('/edit/user/:username', auth.verify_token, function(req, res){
  User.updateUser(req.body)
    .then(user => {
      res.status(200).jsonp(user)
    })
    .catch(erro => res.status(503).jsonp({error: "Erro na edição do user: " + erro}))
})

router.post('/register',function(req, res) {
  var d = new Date().toISOString().substring(0,19)
  req.body.level = "Consumidor"
  req.body.dateCreated = new Date().toISOString().substring(0, 16);
  req.body.lastAccess = new Date().toISOString().substring(0, 16);
  User.addUser(req.body)
  .then(data => {
      const token = generate_token({name: data.name, username: data.username, level: data.level})
      res.jsonp({name: data.name, username: data.username, level: data.level, token: token})
  })
  .catch(error => res.jsonp(error));
})

router.post('/login', function(req, res, next) {
  User.loginUser(req.body)
  .then(data => {
      if(data != null){
        const token = generate_token({name: data.name, username: data.username, level: data.level})
        res.jsonp({name: data.name, username: data.username, level: data.level, token: token})                        
      }else{
          res.sendStatus(401)
      }
  })
  .catch(error => res.jsonp(error));
});

router.delete('/delete/user/:username', auth.is_admin,function(req,res){
  User.deleteUser(req.params.username)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(605).json({erro:erro}))

})

module.exports = router;