var express = require('express');
var router = express.Router();
var Post = require('../controllers/posts');

router.get('/getPostsList', function(req, res, next) {
    var page = parseInt(req.query.page) || 1;
    var limit = parseInt(req.query.limit) || 250;
    var skip = (page - 1) * limit;
    
    if(req.query.inquiricaoId){
        Post.listByInquiricaoId(req.query.inquiricaoId, limit, skip)
        .then(dados => res.status(200).send(dados))
        .catch(erro => res.status(500).send(erro));
    }else{
        res.status(400).send('Missing inquiricaoId');
    }
});

router.get('/getAllPosts', function(req, res, next) {
    Post.getAll()
    .then(dados =>{console.log(dados); res.status(200).send(dados)})
    .catch(erro => res.status(500).send(erro));
});

router.delete('/deleteAllPosts', function(req, res, next) {
    Post.deleteAll()
    .then(dados => res.status(200).send(dados))
    .catch(erro => res.status(500).send(erro));
});

router.post('/addManyPosts', function(req, res, next) {
    Post.addManyPosts(req.body)
    .then(dados => res.status(200).send(dados))
    .catch(erro => res.status(500).send(erro));
});

router.get('/getComments/:id', function(req, res, next) {   
    if(req.params.id){
        Post.getComments(req.params.id)
        .then(dados => res.status(200).send(dados))
        .catch(erro => res.status(500).send(erro));
    }else{
        res.status(400).send('Missing postId');
    }
});

router.get('/getMaxId', function(req, res) {
    Post.getMaxId().then(id => {
        res.send(id.toString());
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});

router.post('/addPost/:id', function(req, res, next) {
    console.log(req.body);
    if(req.params.id){
        Post.addPost(req.params.id, req.body)
        .then(dados => res.status(200).send(dados))
        .catch(erro => res.status(500).send(erro));
    }else{
        res.status(400).send('Missing inquiricaoId');
    }
});

router.delete('/removePost/:postId/:inquiricaoId', function(req, res, next) {
    if(req.params.postId && req.params.inquiricaoId){
        Post.removePost(req.params.postId, req.params.inquiricaoId)
        .then(dados => res.status(200).send(dados))
        .catch(erro => res.status(500).send(erro));
    }else{
        res.status(400).send('Missing postId or inquiricaoId');
    }
});

router.post('/addComment/:id', function(req, res, next) {
    if(req.params.id){
        Post.addComment(req.params.id, req.body)
        .then(dados => res.status(200).send(dados))
        .catch(erro => res.status(500).send(erro));
    }else{
        res.status(400).send('Missing postId');
    }
});

module.exports = router;