var express = require('express');
var router = express.Router();
var Inquiricao = require('../controllers/inquiricoes');

/* GET home page. */
router.get('/apiServer/getInquiricoesList', function(req, res, next) {
  Inquiricao.list()
    .then(dados => res.status(200).send(dados))
    .catch(erro => res.status(500).send(erro));
});

module.exports = router;
