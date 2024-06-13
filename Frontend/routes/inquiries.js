import express from 'express'
import axios from 'axios'
const router = express.Router();

const api = 'http://127.0.0.1:7777/api/'

router.get('/', function(req, res){
    var date = new Date().toISOString().substring(0, 16);
    var page = parseInt(req.query.page) || 1;
    var limit = 250;

    var level = ''
    var name = ''

    const cookie_user_data = req.cookies.cookie_user_data
    if(cookie_user_data){
        level = cookie_user_data.level
        name = cookie_user_data.name
    }

    if('name' in req.query){
        axios.get(api + 'inquiries?name=' + req.query.name + '&page=' + page + '&limit=' + limit)
        .then(response => {
            res.render('inquiries/list', {
                level: level,
                userName: name,
                filterType: "name",
                value: req.query.name,
                lista: response.data,
                date: date,
                page: page
            })
        })
        .catch(error => {
            res.status(500).render('error', {error: error})
        })
    }else if('date' in req.query){
        axios.get(api + 'inquiries?date=' + req.query.date + '&page=' + page + '&limit=' + limit)
        .then(response => {
            res.render('inquiries/list', {
                level: level,
                userName: name,
                filterType: "date",
                value: req.query.date,
                lista: response.data,
                date: date,
                page: page
            })
        })
        .catch(error => {
            res.status(500).render('error', {error: error})
        })
    }else if('local' in req.query){
        axios.get(api + 'inquiries?local=' + req.query.local + '&page=' + page + '&limit=' + limit)
        .then(response => {
            res.render('inquiries/list', {
                level: level,
                userName: name,
                filterType: "local",
                value: req.query.local,
                lista: response.data,
                date: date,
                page: page
            })
        })
        .catch(error => {
            res.status(500).render('error', {error: error})
        })
    }else{
        axios.get(api + 'inquiries?page=' + page + '&limit=' + limit)
        .then(response => {
            res.render('inquiries/list', {
                level: level,
                userName: name,
                filterType: "Not filtered",
                value: null,
                lista: response.data,
                date: date,
                page: page
            })
        })
        .catch(error => {
            res.status(500).render('error', {error: error})
        })
    }
})

router.get('/:id', function(req, res){
    axios.get(api + 'inquiries/' + req.params.id)
    .then(response => {
        res.render('inquiries/single', {})
    })
    .catch(error => {
        res.status(500).render('error', {error: error})
    })
})

router.get('/create', function(req, res){   
    res.render('inquiries/create', {})
})

router.post('/create', function(req, res){
    axios.post(api + 'inquiries')
    .then(response => {
        res.redirect('/inquiries')
    })
    .catch(error => {
        res.status(500).render('error', {error: error})
    })
})

router.get('/:id/edit', function(req, res){
    axios.get(api + 'inquiries/' + req.params.id)
    .then(response => {
        res.render('inquiries/edit', {})
    })
    .catch(error => {
        res.status(500).render('error', {error: error})
    })
})

router.post('/edit', function(req, res){
    axios.put(api + 'api/inquiries')
    .then(response => {
        //TODO - Após submeter, enviar de volta para a página da inquirição.
        id = 1
        res.redirect('/inquiries/' + id)
    })
    .catch(error => {
        res.status(500).render('error', {error: error})
    })
})

router.get('/:id/delete', function(req, res){
    axios.delete(api + 'inquiries/' + req.params.id)
    .then(response => {
        res.redirect('/inquiries')
    })
    .catch(error => {
        res.status(500).render('error', {error: error})
    })
})

export default router