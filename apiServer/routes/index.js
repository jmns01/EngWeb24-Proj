var express = require('express');
var router = express.Router();
var Inquiricao = require('../controllers/inquiricoes');

/* GET home page. */
router.get('/apiServer/getInquiricoesList', function(req, res, next) {
  var page = parseInt(req.query.page) || 1;
  var limit = parseInt(req.query.limit) || 250;
  var skip = (page - 1) * limit;

  Inquiricao.listPage(limit, skip)
    .then(dados => res.status(200).send(dados))
    .catch(erro => res.status(500).send(erro));
});

module.exports = router;
