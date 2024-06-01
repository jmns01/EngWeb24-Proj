var express = require('express');
var router = express.Router();
var axios = require('axios');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var session = require('express-session');

router.use(bodyParser.urlencoded({ extended: true }));

// Configuração do express-session
router.use(session({
  secret: 'PGDRE2023',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Defina como true se estiver usando HTTPS
}));

function verificaToken(req, res, next) {
  if (req.cookies && req.cookies.token) {
    jwt.verify(req.cookies.token, "PGDRE2023", function (e, payload) {
      if (e) {// Erro na validação do token
        res.render('error', { error: "O token do pedido não é válido...", token: false });
      } else { // Só avança se existir um token e se este for verificado com sucesso
        req.user = payload; // Informações do user -> req.user
        next();
      }
    });
  } else { // Não existe token
    res.render('error', { error: "O pedido não tem um token...", token: false });
  }
}

/* GET home page. */
router.get('/getInquiricoesList', function (req, res, next) {
  var d = new Date().toISOString().substring(0, 16);
  var page = parseInt(req.query.page) || 1;
  var limit = 250;

  if(req.query.filter){
    if(req.query.filter === 'fNome'){
      axios.get(`http://localhost:7777/getInquiricoesList?name=${req.query.name}&page=${page}&limit=${limit}`)
      .then(resp => {
        var inquiricoes = resp.data;
        res.status(200).render("inquiricoesList", {type: "Admin", userName: "jmns", filterType : "name", value : req.query.name, lista: inquiricoes, date: d, page: page})
      })
      .catch(erro => {
        console.log('Erro na listagem de inquiricoes: ' + erro);
        res.status(500).render("error", {error: erro});
      });
    }else if(req.query.filter === 'fLocal'){
      axios.get(`http://localhost:7777/getInquiricoesList?local=${req.query.local}&page=${page}&limit=${limit}`)
      .then(resp => {
        var inquiricoes = resp.data;
        res.status(200).render("inquiricoesList", {type: "Admin", userName: "jmns", filterType : "local", value : req.query.local, lista: inquiricoes, date: d, page: page})
      })
      .catch(erro => {
        console.log('Erro na listagem de inquiricoes: ' + erro);
        res.status(500).render("error", {error: erro});
      });
    }else if(req.query.filter === 'fData'){
      axios.get(`http://localhost:7777/getInquiricoesList?date=${req.query.date}&page=${page}&limit=${limit}`)
      .then(resp => {
        var inquiricoes = resp.data;
        res.status(200).render("inquiricoesList", {type: "Admin", userName: "jmns", filterType : "date", value : req.query.date, lista: inquiricoes, date: d, page: page})
      })
      .catch(erro => {
        console.log('Erro na listagem de inquiricoes: ' + erro);
        res.status(500).render("error", {error: erro});
      });
    }
  }else{
    axios.get(`http://localhost:7777/getInquiricoesList?page=${page}&limit=${limit}`)
    .then(resp =>{
      var inquiricoes = resp.data;
      res.status(200).render("inquiricoesList", {type: "Admin", userName: "jmns", filterType : "Not filtered", value : null, lista: inquiricoes, date: d, page: page})
    })
    .catch(erro => {
      console.log('Erro na listagem de inquiricoes: ' + erro);
      res.status(500).render("error", {error: erro});
    });
  }
});

router.get('/login', function (req, res) {
  var data = new Date().toISOString().substring(0, 16);
  var error = req.session.error;
  req.session.error = null; // Limpa a mensagem de erro após ser exibida
  res.render('login', { d: data, error: error });
});

router.post('/login', function (req, res) {
  const { username, password } = req.body;

  axios.get(`http://localhost:7778/users/get/${username}`)
    .then(response => {
      const user = response.data;
      if (user && user.password === password) { // Simplificação, use hashing para passwords na prática
        // Criar token e definir cookie
        const token = jwt.sign({ username: user.username }, 'PGDRE2023');
        res.cookie('token', token);
        res.redirect('/getInquiricoesList');
      } else {
        req.session.error = 'Username ou password incorretos.';
        res.redirect('/login');
      }
    })
    .catch(error => {
      console.error('Erro ao verificar credenciais:', error);
      req.session.error = 'Ocorreu um erro. Por favor, tente novamente.';
      res.redirect('/login');
    });
});

router.get('/register', function(req, res){
  var data = new Date().toISOString().substring(0,16) 
  res.render('registo', {d: data})
})

module.exports = router;



