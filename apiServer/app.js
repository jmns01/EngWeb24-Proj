var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var cors = require('cors');



var mongoDB = 'mongodb://127.0.0.1:27017/inquiricoes';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conexão ao MongoDB realizada com sucesso"))
  .catch(err => console.error('Erro de conexão ao MongoDB:', err));

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB'));
db.once('open', () => {
  console.log("Conexão ao MongoDB realizada com sucesso");
});

var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');
var usersRouter = require('./routes/users');

var app = express();
app.use(cors()); // FEITO PARA PERMITIR PEDIDOS DE OUTROS DOMÍNIOS


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

module.exports = app;
