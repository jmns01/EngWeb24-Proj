var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

// Configuração do banco de dados
var mongoDB = 'mongodb://127.0.0.1:27017/inquiricoes';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB...'));
db.once('open', function() {
  console.log("Conexão ao MongoDB realizada com sucesso...");
});

// Configuração do Passport
var User = require('./models/user'); // Certifique-se de que este caminho está correto
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var usersRouter = require('./routes/user'); // Certifique-se de que este caminho está correto

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/users', usersRouter);

// Tratamento de erro 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Manipulador de erros
app.use(function(err, req, res, next) {
  // Definir variáveis locais, fornecendo apenas erros em desenvolvimento
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Renderizar a página de erro
  res.status(err.status || 500);
  res.jsonp({ error: err });
});

module.exports = app;