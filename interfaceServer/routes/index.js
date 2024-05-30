var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/getInquiricoesList', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16);
  var page = parseInt(req.query.page) || 1;
  var limit = 250;

  axios.get(`http://localhost:7777/apiServer/getInquiricoesList?page=${page}&limit=${limit}`)
  .then(resp =>{
    var inquiricoes = resp.data;
    res.status(200).render("inquiricoesList", {title: "Registo de Inquirições de Génere", type: "Admin", userName: "jmns", lista: inquiricoes, date: d, page: page})
  })
  .catch(erro => {
    console.log('Erro na listagem de inquiricoes: ' + erro);
    res.status(500).render("error", {error: erro});
  });
});

module.exports = router;
