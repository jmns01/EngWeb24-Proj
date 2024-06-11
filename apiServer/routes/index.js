var express = require('express');
var router = express.Router();
var Inquiricao = require('../controllers/inquiricoes');

/* GET home page. */
router.get('/getInquiricoesList', function(req, res, next) {
  var page = parseInt(req.query.page) || 1;
  var limit = parseInt(req.query.limit) || 250;
  var skip = (page - 1) * limit;

  if(req.query.name){
    Inquiricao.listByName(req.query.name, limit, skip)
    .then(dados => res.status(200).send(dados))
    .catch(erro => res.status(500).send(erro));
  }else if(req.query.local){
    Inquiricao.listByLocal(req.query.local, limit, skip)
    .then(dados => res.status(200).send(dados))
    .catch(erro => res.status(500).send(erro));
  }else if(req.query.date){
    Inquiricao.listByDate(req.query.date, limit, skip)
    .then(dados => res.status(200).send(dados))
    .catch(erro => res.status(500).send(erro));
  }
  else{
  Inquiricao.listPage(limit, skip)
    .then(dados => res.status(200).send(dados))
    .catch(erro => res.status(500).send(erro));
  }
});

/* POST */
router.post('/getInquiricoesList', function(req, res){
  console.log(req.body);
  Inquiricao.insert(req.body)
    .then(data => res.status(201).jsonp(data))
    .catch(erro => res.status(523).jsonp(erro));
});

/* DELETE */
router.delete('/getInquiricoesList/:id', function(req, res, next) {
  Inquiricao.delete(req.params.id)
    .then(data => res.status(204).send()) // 204 No Content
    .catch(erro => res.status(500).jsonp(erro));
});


module.exports = router;
