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
router.post('/getInquiricoesList', function(req, res, next) {
  Inquiricao.findMaxId()
    .then(ultimaEntrada => {
      let novoId;
      if (ultimaEntrada && ultimaEntrada.length > 0) {
        novoId = ultimaEntrada[0]._id + 1;
      } else {
        // Caso não haja nenhuma entrada, atribuímos o id 1
        novoId = 1;
      }

      // Extrair os dados do corpo da requisição
      const dadosEntrada = req.body;

      // Atribuir o novo ID aos dados da entrada
      dadosEntrada._id = novoId;

      // Criar uma nova instância do modelo com os dados fornecidos
      const novaEntrada = new Inquiricao(dadosEntrada);

      // Salvar a nova entrada no banco de dados
      novaEntrada.save()
        .then(entrada => {
          res.status(201).json({ message: 'Entrada adicionada com sucesso', entrada });
        })
        .catch(error => {
          console.error('Erro ao adicionar entrada:', error);
          res.status(500).json({ message: 'Erro ao adicionar entrada 1' });
        });
    })
    .catch(error => {
      console.error('Erro ao encontrar o maior ID:', error);
      res.status(500).json({ message: 'Erro ao adicionar entrada 2' });
    });
});

/* DELETE */
router.delete('/apagarEntrada/:id', function(req, res, next) {
  // Extrair o ID da entrada a ser deletada dos parâmetros da URL
  const entradaId = req.params.id;

  // Encontrar e deletar a entrada pelo ID
  Inquiricao.findByIdAndDelete(entradaId)
    .then(entradaDeletada => {
      if (!entradaDeletada) {
        return res.status(404).json({ message: 'Entrada não encontrada' });
      }
      res.status(200).json({ message: 'Entrada deletada com sucesso', entradaDeletada });
    })
    .catch(error => {
      console.error('Erro ao deletar entrada:', error);
      res.status(500).json({ message: 'Erro ao deletar entrada' });
    });
});


module.exports = router;
