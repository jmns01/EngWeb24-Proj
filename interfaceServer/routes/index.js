var express = require('express');
var router = express.Router();
var axios = require('axios');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var session = require('express-session');
const { token } = require('morgan');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.use(bodyParser.urlencoded({ extended: true }));

// Configuração do express-session
router.use(session({
  secret: 'EW2024',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Defina como true se estiver usando HTTPS
}));

function verificaToken(req, res, next) {
  if (req.cookies && req.cookies.token) {
    jwt.verify(req.cookies.token, "EW2024", function (e, payload) {
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

router.get('/home', function(req, res){
  var d = new Date().toISOString().substring(0, 16);
  if(req.cookies && req.cookies.token){
    jwt.verify(req.cookies.token, "EW2024", function(e, payload){
      if(e){
        res.status(200).render('home', {d: d, u: null, token: false});
      }else{
        console.log("Encontrei")
        console.log(payload)
        console.log(payload.username) 
        res.status(200).render('home', {d: d, u: payload.username, token: true});
      }
    });
  }
});

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

router.get('/downloadInquiricoes', function(req, res) {
  axios.get('http://localhost:7777/getInquiricoesList')
    .then(response => {
      const inquiricoes = response.data;
      res.setHeader('Content-disposition', 'attachment; filename=inquiricoes.json');
      res.setHeader('Content-type', 'application/json');
      res.send(JSON.stringify(inquiricoes, null, 2));
    })
    .catch(error => {
      console.error('Erro ao obter inquirições:', error);
      res.status(500).send('Erro ao obter inquirições');
    });
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
        const token = jwt.sign({ username: user }, 'EW2024');
        res.cookie('token', token);
        res.redirect('/home');
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

router.get('/logout', function(req, res) {
  res.clearCookie('token');
  res.redirect('/login');
});

// Rota para carregar a página de adição de inquirições
router.get('/addInquiricao', verificaToken, function(req, res) {
  console.log(req.user.username)
  if (req.user.username.level === 'Produtor') {
    res.render('addInquiricao');
  } else {
    res.status(403).send('Acesso negado');
  }
});

// Rota para adicionar inquirições manualmente
router.post('/addInquiricaoManual', verificaToken, function(req, res) {
  if (payload.username.level === 'Produtor') {
    const inquiricao = req.body;
    axios.post('http://localhost:7777/inquiricoes', inquiricao)
      .then(() => {
        res.redirect('/getInquiricoesList');
      })
      .catch(error => {
        console.error('Erro ao adicionar inquirição:', error);
        res.status(500).send('Erro ao adicionar inquirição');
      });
  } else {
    res.status(403).send('Acesso negado');
  }
});

// Rota para adicionar inquirições por ficheiro
router.post('/addInquiricaoFile', verificaToken, upload.single('inquiricaoFile'), function(req, res) {
  if (payload.username.level === 'Produtor') {
    const filePath = req.file.path;
    const inquiricoes = require(filePath); // Supondo que o ficheiro é um JSON válido

    axios.post('http://localhost:7777/inquiricoes', inquiricoes)
      .then(() => {
        res.redirect('/getInquiricoesList');
      })
      .catch(error => {
        console.error('Erro ao adicionar inquirição por ficheiro:', error);
        res.status(500).send('Erro ao adicionar inquirição por ficheiro');
      });
  } else {
    res.status(403).send('Acesso negado');
  }
});

module.exports = router;
