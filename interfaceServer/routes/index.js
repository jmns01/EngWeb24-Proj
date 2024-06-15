var express = require('express');
var router = express.Router();
var axios = require('axios');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var session = require('express-session');
const { token } = require('morgan');

//router.use(bodyParser.urlencoded({ extended: true }));

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

/* GET Página principal */
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
  else{
    res.status(200).render('home', {d: d, u: null, token: false});
  }
});

/* GET Lista de registos, inclui os filtros e paginação */
router.get('/getInquiricoesList', function (req, res, next) {
  var d = new Date().toISOString().substring(0, 16);
  var page = parseInt(req.query.page) || 1;
  var limit = 250;

  if(req.query.filter){
    if(req.query.filter === 'fNome'){
      axios.get(`http://localhost:7777/getInquiricoesList?name=${req.query.name}&page=${page}&limit=${limit}`)
      .then(resp => {
        var inquiricoes = resp.data;
        res.status(200).render("inquiricoesList", {type: "Administrador", userName: "jmns", filterType : "name", value : req.query.name, lista: inquiricoes, date: d, page: page})
      })
      .catch(erro => {
        console.log('Erro na listagem de inquiricoes: ' + erro);
        res.status(500).render("error", {error: erro});
      });
    }else if(req.query.filter === 'fLocal'){
      axios.get(`http://localhost:7777/getInquiricoesList?local=${req.query.local}&page=${page}&limit=${limit}`)
      .then(resp => {
        var inquiricoes = resp.data;
        res.status(200).render("inquiricoesList", {type: "Administrador", userName: "jmns", filterType : "local", value : req.query.local, lista: inquiricoes, date: d, page: page})
      })
      .catch(erro => {
        console.log('Erro na listagem de inquiricoes: ' + erro);
        res.status(500).render("error", {error: erro});
      });
    }else if(req.query.filter === 'fData'){
      axios.get(`http://localhost:7777/getInquiricoesList?date=${req.query.date}&page=${page}&limit=${limit}`)
      .then(resp => {
        var inquiricoes = resp.data;
        res.status(200).render("inquiricoesList", {type: "Administrador", userName: "jmns", filterType : "date", value : req.query.date, lista: inquiricoes, date: d, page: page})
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
      res.status(200).render("inquiricoesList", {type: "Administrador", userName: "jmns", filterType : "Not filtered", value : null, lista: inquiricoes, date: d, page: page})
    })
    .catch(erro => {
      console.log('Erro na listagem de inquiricoes: ' + erro);
      res.status(500).render("error", {error: erro});
    });
  }
});

router.get('/posts/:id', function(req, res){
  var d = new Date().toISOString().substring(0, 16);
  var page = parseInt(req.query.page) || 1;
  var limit = 250;

  axios.get(`http://localhost:7777/posts/getPostsList?inquiricaoId=${req.params.id}&page=${page}&limit=${limit}`)
  .then(resp => {
    var post = resp.data;
    res.status(200).render("post", {type: "Administrador", userName: "jmns", posts: post, i: req.params.id, date: d, page: page})
  })
  .catch(erro => {
    console.log('Erro na obtenção do post: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});

router.get('/addPost/:id', function(req, res){
  var date = new Date().toISOString().substring(0, 16);
  console.log(req.params.id);
  axios.get(`http://localhost:7777/posts/getMaxId`)
  .then(resp => {
    console.log(resp.data);
    newId = parseInt(resp.data)+1;
    console.log(newId);
    res.status(200).render('addPost', {type: 'Administrador', userName: 'jmns', d: date, inquiricaoId: req.params.id, post_id: newId})
  })
    .catch(erro => {
    console.log('Erro na obtenção do id do post: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});

router.post('/addPost/:id', function(req, res){
  console.log(req.body);
  const post_id = req.body.post_id; 
  console.log(`POST ID: ${post_id}`);
  const title = req.body.Title;
  const content = req.body.Description;
  const inquiricaoId = req.params.id;
  const date = req.body.d; 
  console.log(date);
  
  axios.post(`http://localhost:7777/posts/addPost/${req.params.id}`, {
    _id: post_id,
    inquiricaoId: inquiricaoId,
    Author: 'jmns',
    Date: date,
    Title: title,
    Description: content,
    Comments: []
  })
  .then(resp => {
    res.status(200).redirect(`/posts/${req.params.id}`);
  })
  .catch(erro => {
    console.log('Erro na adição do post: ' + erro);
    res.status(500).render("error", { error: erro });
  });
});

router.get('/posts/getComments/:post_id/:inquiricaoId', function(req, res){
  var d = new Date().toISOString().substring(0, 16);

  axios.get(`http://localhost:7777/posts/getComments/${req.params.post_id}`)
  .then(resp => {
    var comments = resp.data;
    res.status(200).render("comments", {type: "Administrador", userName: "jmns", lista: comments, inquiricaoId : req.params.inquiricaoId, post_id: req.params.post_id, date: d})
  })
  .catch(erro => {
    console.log('Erro na obtenção dos comentários: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});

router.post('/posts/addComments/:post_id/:inquiricaoId', function(req, res){
  const author = req.body.Autor;
  const titulo = req.body.Title;
  const desc = req.body.Description;
  const data = req.body.Date;

  axios.post(`http://localhost:7777/posts/addComment/${req.params.post_id}`, {
    Autor: author,
    Date: data,
    Title: titulo,
    Description: desc
  })
  .then(resp => {
    res.status(200).redirect(`/posts/getComments/${req.params.post_id}/${req.params.inquiricaoId}`);
  })
  .catch(erro => {
    console.log('Erro na adição do comentário: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});

/* GET Página de opções para o Admin */
router.get('/moreOptions', function(req, res){
  var d = new Date().toISOString().substring(0, 16);
  if(req.cookies && req.cookies.token){
    jwt.verify(req.cookies.token, "EW2024", function(e, payload){
      if(e){
        res.status(200).render('moreOptions', {d: d, u: null, token: false});
      }else if(e.level == "Administrador"){
        console.log("Encontrei")
        console.log(payload)
        console.log(payload.username) 
        res.status(200).render('moreOptions', {d: d, u: payload.username, token: true});
      }
    });
  }
  else{
    res.status(200).render('moreOptions', {d: d, u: null, token: false});
  }
});

router.get('/addAdmin', function(req, res){
  var d = new Date().toISOString().substring(0, 16);
  res.status(200).render('addAdmin', {date: d});
});

router.get('/gerirContas', function(req, res){
  var d = new Date().toISOString().substring(0, 16);
  axios.get('http://localhost:7778/users/get')
  .then(users => {
    console.log(users.data);
    res.status(200).render('usersList', {type: "Administrador", userName: "jmns", lista : users.data, date: d});
  })
  .catch(erro => {
    console.log('Erro na obtenção dos utilizadores: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});

router.get('/editUser/:username', function(req, res){
  var d = new Date().toISOString().substring(0, 16);
  axios.get(`http://localhost:7778/users/get/${req.params.username}`)
  .then(user =>
    res.status(200).render('editUser', {user: user.data, date: d})
  )
  .catch(erro => {
    console.log('Erro na obtenção do utilizador: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});

router.post('/editUser/:username', function(req, res){
  const {id, name, username, password, level, dateCreated, lastAccess} = req.body;
  console.log(req.body);
  axios.put(`http://localhost:7778/users/edit/user/${req.params.username}`, {_id: id, name: name, username: username, password: password, level: level, dateCreated: dateCreated, lastAccess: lastAccess, active: true})
  .then(response => {
    console.log('Utilizador atualizado com sucesso');
    res.redirect(`/editUser/${username}`);
  })
  .catch(error => {
    console.error('Erro ao atualizar utilizador:', error);
    res.redirect(`/editUser/${username}`);
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

  axios.post(`http://localhost:7778/users/login`, {params: {username: username, password: password}})
  .then(response => {
    if(user){
      const token = jwt.sign({username: user.username}, "EW2024");
      res.cookie('token', token);
      res.redirect('/getInquiricoesList');
    }else{
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


/*router.post('/login', function (req, res) {
  const { username, password } = req.body;

  axios.get(`http://localhost:7778/users/get/${username}`)
    .then(response => {
      const user = response.data;
      if (user && user.password === password) { // Simplificação, use hashing para passwords na prática
        // Criar token e definir cookie
        const token = jwt.sign({ username: user }, 'EW2024');
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
});*/

router.get('/register', function(req, res){
  var data = new Date().toISOString().substring(0,16) 
  res.render('registo', {d: data})
})

router.post('/register', function(req, res){
  console.log(req.body);
  if(req.query.admin){
    var level = "Administrador";
    const {name, username, password} = req.body;
    axios.post('http://localhost:7778/users/register', {name: name, username: username, password: password, level: level})
    .then(response => {
      console.log('Utilizador registado com sucesso');
      res.redirect('/login');
    })
    .catch(error => {
      console.error('Erro ao registar utilizador:', error);
      res.redirect('/register');
    });
  }
  else{
    const {name, username, password, level} = req.body;
    axios.post('http://localhost:7778/users/register', {name: name, username: username, password: password, level: level})
    .then(response => {
      console.log('Utilizador registado com sucesso');
      res.redirect('/login');
    })
    .catch(error => {
      console.error('Erro ao registar utilizador:', error);
      res.redirect('/register');
    });
  }
});

router.get('/logout', function(req, res){
  res.clearCookie('token');
  res.redirect('/home');
});

module.exports = router;



