import express from 'express'
import axios from 'axios'
import {retrieve_user_data} from '../includes/retrieve_data.js'
import { is_logged } from '../includes/permissions.js';

const router = express.Router();

const api = 'http://127.0.0.1:7777/api/'

router.get('/', function(req, res){
    var date = new Date().toISOString().substring(0, 16);
    var page = parseInt(req.query.page) || 1;
    var limit = 250;

    const user_data = retrieve_user_data(req.cookies.cookie_user_data)

    if('name' in req.query){
        axios.get(api + 'inquiries?name=' + req.query.name + '&page=' + page + '&limit=' + limit)
        .then(response => {
            res.render('inquiries/list', {
                user: user_data,
                filterType: "name",
                value: req.query.name,
                lista: response.data,
                date: date,
                page: page
            })
        })
        .catch(error => {
            res.status(500).render('error', {error: error, message: error.message})
        })
    }else if('date' in req.query){
        axios.get(api + 'inquiries?date=' + req.query.date + '&page=' + page + '&limit=' + limit)
        .then(response => {
            res.render('inquiries/list', {
                user: user_data,
                filterType: "date",
                value: req.query.date,
                lista: response.data,
                date: date,
                page: page
            })
        })
        .catch(error => {
            res.status(500).render('error', {error: error, message: error.message})
        })
    }else if('local' in req.query){
        axios.get(api + 'inquiries?local=' + req.query.local + '&page=' + page + '&limit=' + limit)
        .then(response => {
            res.render('inquiries/list', {
                user: user_data,
                filterType: "local",
                value: req.query.local,
                lista: response.data,
                date: date,
                page: page
            })
        })
        .catch(error => {
            res.status(500).render('error', {error: error, message: error.message})
        })
    }else{
        axios.get(api + 'inquiries?page=' + page + '&limit=' + limit)
        .then(response => {
            res.render('inquiries/list', {
                user: user_data,
                filterType: "Not filtered",
                value: null,
                lista: response.data,
                date: date,
                page: page
            })
        })
        .catch(error => {
            res.status(500).render('error', {error: error, message: error.message})
        })
    }
})

router.get('/:id', function(req, res){
    const user_data = retrieve_user_data(req.cookies.cookie_user_data)
    var date = new Date().toISOString().substring(0, 16);
    axios.get(api + 'inquiries/' + req.params.id)
    .then(response => {
        res.render('inquiries/single', {
            user: user_data,
            inquiricao: response.data,
            date: date
        })
    })
    .catch(error => {
        res.status(500).render('error', {error: error, message: error.message})
    })
})

router.get('/create', is_logged, function(req, res){
    const user_data = retrieve_user_data(req.cookies.cookie_user_data)
    var date = new Date().toISOString().substring(0, 16);
    res.render('inquiries/create', {
        user: user_data,
        date: date
    })
})

router.post('/create', is_logged, function(req, res){
    axios.post(api + 'inquiries', req.body)
    .then(response => {
        res.redirect('/inquiries')
    })
    .catch(error => {
        res.status(500).render('error', {error: error, message: error.message})
    })
})

router.get('/:id/edit', is_logged, function(req, res){
    const user_data = retrieve_user_data(req.cookies.cookie_user_data)
    var date = new Date().toISOString().substring(0, 16);
    axios.get(api + 'inquiries/' + req.params.id)
    .then(response => {
        res.render('inquiries/edit', {
            user: user_data,
            inquiricao: response.data,
            date: date
        })
    })
    .catch(error => {
        res.status(500).render('error', {error: error, message: error.message})
    })
})

router.post('/edit', is_logged, function(req, res){
    axios.put(api + 'inquiries', req.body)
    .then(response => {
        res.redirect('/inquiries/' + req.body.id)
    })
    .catch(error => {
        res.status(500).render('error', {error: error, message: error.message})
    })
})

router.get('/:id/relations/:relationid', is_logged, function(req, res){
    const user_data = retrieve_user_data(req.cookies.cookie_user_data)
    var date = new Date().toISOString().substring(0, 16);
    axios.get(api + 'inquiries/' + req.params.id + '/relations/' + req.params.relationid)
    .then(response => {
        res.render('inquiries/relation', {
            user: user_data,
            inquiricao: response.data,
            date: date
        })
    })
    .catch(error => {
        res.status(500).render('error', {error: error, message: error.message})
    })
})

router.post('/:id/relations/:relationid', is_logged, function(req, res){
    axios.put(api + 'inquiries/' + req.params.id + '/relations/' + req.params.relationid, req.body)
    .then(response => {
        res.redirect('/inquiries/' + req.body.id + '/edit')
    })
    .catch(error => {
        res.status(500).render('error', {error: error, message: error.message})
    })
})

router.get('/:id/delete', is_logged, function(req, res){
    axios.delete(api + 'inquiries/' + req.params.id)
    .then(response => {
        res.redirect('/inquiries')
    })
    .catch(error => {
        res.status(500).render('error', {error: error, message: error.message})
    })
})

export default router