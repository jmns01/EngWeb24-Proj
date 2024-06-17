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

router.get('/getInquiricao/:id', function(req, res, next) {
  Inquiricao.getInquiricaoById(req.params.id)
    .then(dados => res.status(200).send(dados))
    .catch(erro => res.status(500).send(erro));
});

router.put('/updateInquiricao/:id', function(req, res, next) {
  Inquiricao.updateInquiricao(req.params.id, req.body)
    .then(dados => res.status(200).send(dados))
    .catch(erro => res.status(500).send(erro));
});

router.delete('/deleteInquiricao/:id', function(req, res, next) {
  Inquiricao.deleteInquiricao(req.params.id)
    .then(dados => res.status(200).send(dados))
    .catch(erro => res.status(500).send(erro));
});

router.get('/getRelations/:inquiricaoId/:relationsName', function(req, res, next) {
  const relationName = req.params.relationsName;
  Inquiricao.getRelation(req.params.inquiricaoId)
    .then(dados => {
      console.log(dados.Relations)
      res.status(200).send(extractedData);
    })
    .catch(erro => res.status(500).send(erro));
});

// REMOVER ISTO, N FAZ SENTIDO EDITAR RELAÇÕES
router.put('/updateRelation/:inquiricaoId/:relationNome', function(req, res, next) {
  Inquiricao.getIdByName(req.params.relationNome)
  .then(dados => {const novo_id = dados._doc._id})
  .catch(erro => res.status(500).send(erro));

  Inquiricao.updateRelation(req.params.inquiricaoId, req.novo_id)
    .then(dados => res.status(200).send(dados))
    .catch(erro => res.status(500).send(erro));
});

router.get('/isIdValid/:id', function(req, res, next) {
  Inquiricao.getInquiricaoById(req.params.id)
    .then(dados =>{
      if(dados != null){
        res.status(200).send({ success: true });
      }else{
        res.status(200).send({ success: false });
      }
    })
    .catch(erro => res.status(500).send(erro));
});

router.post('/addRelation/:relationId/:inquiricaoId', function(req, res, next) {
  const re = new RegExp('Inquirição de genere de ', 'i');
  let nome;

  Inquiricao.getNameById(req.params.relationId)
  .then(dados => {
    nome = dados.UnitTitle.replace(re, '');
    console.log(nome);
    console.log(req.params.inquiricaoId);
    Inquiricao.insertNewRelation(nome, req.params.inquiricaoId, req.params.relationId)
    .then(dados => res.status(200).send(dados))
    .catch(erro => {console.log("AQUI");res.status(500).send(erro)});
  })
  .catch(erro => res.status(500).send(erro));
});

router.delete('/deleteRelation/:inquiricaoId/:relationName', function(req, res, next) {
  Inquiricao.removeRelation(req.params.inquiricaoId, req.params.relationName)
    .then(dados => res.status(200).send(dados))
    .catch(erro => res.status(500).send(erro));
});

module.exports = router;
