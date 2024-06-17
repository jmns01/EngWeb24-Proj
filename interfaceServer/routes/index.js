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

router.get('/inquiricao/:id', function(req, res){
  var d = new Date().toISOString().substring(0, 16);
  axios.get(`http://localhost:7777/getInquiricao/${req.params.id}`)
  .then(resp => {
    var inquiricao = resp.data;
    res.status(200).render("inquiricao", {type: "Administrador", userName: "jmns", inquiricao: inquiricao, date: d})
  })
  .catch(erro => {
    console.log('Erro na obtenção da inquiricao: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});

router.get('/addInquiricao', function(req, res){
  var d = new Date().toISOString().substring(0, 16);
  axios.get('http://localhost:7777/getMaxId')
  .then(resp => {
    res.status(200).render('addInquiricao', {type: 'Administrador', userName: 'jmns', name : "Joao", date: d, newId: parseInt(resp.data)+1})
  })
  .catch(erro => {
    console.log('Erro na obtenção do id da inquiricao: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});

router.post('/addInquiricao', function(req, res){
  const {id, descLevel, unitId, repoCod, coutryCod, title, initDate, endDate, repo, scopeContent, cotaAtual, cotaAntiga, revised, publish, available, creator, created, creatorUsername} = req.body
  const newrevised = revised === "Sim" ? true : false;
  const newpublish = publish === "Sim" ? true : false;
  const newavailable = available === "Sim" ? true : false;
  axios.post('http://localhost:7777/addInquiricao', {_id: parseInt(id), DescriptionLevel: descLevel, CompleteUnitId: unitId, RepositoryCode: repoCod, CountryCode: coutryCod, UnitTitle: title, UnitDateInitial: initDate, UnitDateFinal: endDate, Repository: repo, ScopeContent: scopeContent, PhysLoc: cotaAtual, PreviousLoc: cotaAntiga, Revised: newrevised, Published: newpublish, Available: newavailable, Creator: creator, Created: created, Username: creatorUsername})
  .then(response => {
    console.log('Inquirição adicionada com sucesso');
    res.redirect('/getInquiricoesList');
  })
  .catch(error => {
    console.error('Erro ao adicionar inquirição:', error);
    res.status(500).render("error", {error: error});
  });
});

router.get('/deleteInquiricao/:id', function(req, res){
  axios.delete(`http://localhost:7777/deleteInquiricao/${req.params.id}`)
  .then(response => {
    console.log('Inquirição eliminada com sucesso');
    res.redirect('/getInquiricoesList');
  })
  .catch(error => {
    console.error('Erro ao eliminar inquirição:', error);
    res.redirect('/getInquiricoesList');
  });
});

router.get('/editInquiricao/:id', function(req, res){
  var d = new Date().toISOString().substring(0, 16);
  axios.get(`http://localhost:7777/getInquiricao/${req.params.id}`)
  .then(resp => {
    var inquiricao = resp.data;
    res.status(200).render("editInquiricao", {type: "Administrador", userName: "jmns", inquiricao: inquiricao, date: d})
  })
  .catch(erro => {
    console.log('Erro na obtenção da inquiricao: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});

router.post('/editInquiricao/:id', function(req, res){
  const {id, descLevel, unitId, repoCod, coutryCod, title, initDate, endDate, repo, scopeContent, cotaAtual, cataAntiga, revised, publish, available, creator, created, creatorUsername} = req.body;
  const newrevised = revised === "Sim" ? true : false;
  const newpublish = publish === "Sim" ? true : false;
  const newavailable = available === "Sim" ? true : false;

  axios.put(`http://localhost:7777/updateInquiricao/${req.params.id}`, {DescriptionLevel: descLevel, CompleteUnitId: unitId, RepositoryCode: repoCod, CountryCode: coutryCod, UnitTitle: title, UnitDateInitial: initDate, UnitDateFinal: endDate, Repository: repo, ScopeContent: scopeContent, PhysLoc: cotaAtual, PreviousLoc: cataAntiga, Revised: newrevised, Published: newpublish, Available: newavailable, Creator: creator, Created: created, Username: creatorUsername})
  .then(response => {
    console.log('Inquirição atualizada com sucesso');
    res.redirect(`/editInquiricao/${req.params.id}`);
  })
  .catch(error => {
    console.error('Erro ao atualizar inquirição:', error);
    res.redirect(`/editInquiricao/${req.params.id}`);
  });
});

// REMOVER
router.get('/editRelation/:inquiricaoId/:relationNome', function(req, res){
  var d = new Date().toISOString().substring(0, 16);
  axios.get(`http://localhost:7777/getRelations/${req.params.inquiricaoId}/${req.params.relationNome}`)
  .then(resp => {
    var inquiricao = resp.data;
    const key = Object.keys(inquiricao)[0];
    const value = Object.values(inquiricao)[0];
    res.status(200).render("editRelation", {type: "Administrador", userName: "jmns", nome: key, id: value, inquiricaoId : req.params.inquiricaoId, relationId: req.params.relationNome, date: d})
  })
  .catch(erro => {
    console.log('Erro na obtenção da inquiricao: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});
// REMOVER
router.post('/editRelation/:inquiricaoId/:relationNome', function(req, res){
  const {nome, id} = req.body;
  axios.put(`http://localhost:7777/updateRelation/${req.params.inquiricaoId}/${req.params.relationNome}`, {key: nome, value: id})
  .then(response => {
    console.log('Relação atualizada com sucesso');
    res.redirect(`/editRelation/${req.params.inquiricaoId}/${req.params.relationId}`);
  })
  .catch(error => {
    console.error('Erro ao atualizar relação:', error);
    res.redirect(`/editRelation/${req.params.inquiricaoId}/${req.params.relationId}`);
  });
});

router.get('/test/:id', function(req, res){
  axios.get("http://localhost:7777/isIdValid/" + req.params.id)
  .then(data => console.log(data.data))
  .catch(error => console.log(error))
});

router.get('/deleteRelation/:inquiricaoId/:relationNome', function(req, res){
  axios.delete(`http://localhost:7777/deleteRelation/${req.params.inquiricaoId}/${req.params.relationNome}`)
  .then(response => {
    console.log('Relação eliminada com sucesso');
    res.redirect(`/editInquiricao/${req.params.inquiricaoId}`);
  })
  .catch(error => {
    console.error('Erro ao eliminar relação:', error);
    res.redirect(`/editInquiricao/${req.params.inquiricaoId}`);
  });
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
  const post_id = req.body.post_id; 
  const title = req.body.Title;
  const content = req.body.Description;
  const inquiricaoId = req.params.id;
  const date = req.body.d; 
  
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

router.get('/posts/deletePost/:post_id/:inquiricaoId', function(req, res){
  axios.delete(`http://localhost:7777/posts/removePost/${req.params.post_id}/${req.params.inquiricaoId}`)
  .then(resp => {
    res.status(200).redirect(`/posts/${req.params.inquiricaoId}`);
  })
  .catch(erro => {
    console.log('Erro na eliminação do post: ' + erro);
    res.status(500).render("error", {error: erro});
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



