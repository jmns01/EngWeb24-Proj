var express = require('express');
var router = express.Router();
var axios = require('axios');

function verificaToken(req, res, next){
  if(req.cookies && req.cookies.token){
    jwt.verify(req.cookies.token, "PGDRE2023", function(e, payload){
      if(e){// Erro na validação do token
        res.render('error', {error: "O token do pedido não é válido...", token: false})
      }
      else{ // Só avança se existir um token e se este for verificado com sucesso
        req.user = payload // Informações do user -> req.user
        next()
      }
    })
  }else{ // Não existe token
    res.render('error', {error: "O pedido não tem um token...", token: false})
  }
}

/* GET home page. */
router.get('/getInquiricoesList', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16);
  axios.get('http://localhost:7777/apiServer/getInquiricoesList')
  .then(resp =>{
    var inquiricoes = resp.data;
    res.status(200).render("inquiricoesList", {title: "Inquirições de Génere", lista: inquiricoes, date: d})
  })
  .catch(erro => {
    console.log('Erro na listagem de inquiricoes: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});

module.exports = router;

router.get('/login', function(req, res){
  var data = new Date().toISOString().substring(0,16) 
  res.render('login', {d: data})
})

router.get('/register', function(req, res){
  var data = new Date().toISOString().substring(0,16) 
  res.render('registo', {d: data})
})
