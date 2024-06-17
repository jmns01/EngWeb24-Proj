import express from 'express'
import axios from 'axios'
import { is_logged } from '../includes/permissions.js';
import {retrieve_user_data} from '../includes/retrieve_data.js'
const router = express.Router();

const api = 'http://127.0.0.1:7777/api/'

router.get('/:id', function(req, res){
    const user_data = retrieve_user_data(req.cookies.cookie_user_data)
    var date = new Date().toISOString().substring(0, 16);
    var page = parseInt(req.query.page) || 1;
    var limit = 250;

    axios.get(api + 'posts/' + req.params.id + '?page=' + page + '&limit=' + limit)
    .then(response => {
        if(response.status = 200){
            res.render('posts/list', {
                user: user_data,
                posts: response.data,
                date: date
            })
        }else{
            res.status(response.status).render('error', {message: response.message})
        }
    })
    .catch(error => {
        res.status(500).render('error', {error: error, message: error.message})
    })
})

// posts/:id/create - id da inquirição
router.get('/:id/create', is_logged, function(req, res){
    const user_data = retrieve_user_data(req.cookies.cookie_user_data)
    var date = new Date().toISOString().substring(0, 16);
    res.render('posts/create', {
        user: user_data,
        inquiricaoId: req.params.id,
        date: date
    })
})

router.post('/create', is_logged, function(req, res){
    axios.post(api + 'posts', req.body)
    .then(response => {
        if(response.status = 201){
            res.redirect('/inquiries')
        }else{
            res.status(response.status).render('error', {message: response.message})
        }
    })
    .catch(error => {
        res.status(500).render('error', {error: error, message: error.message})
    })
})

// posts/:id/delete - id da publicação
router.get('/:id/delete', is_logged, function(req, res){
    axios.delete(api + 'posts/' + req.params.id)
    .then(response => {
        if(response.status = 204){
            res.redirect('/inquiries')
        }else{
            res.status(response.status).render('error', {message: response.message})
        }
    })
    .catch(error => {
        res.status(500).render('error', {error: error, message: error.message})
    })
})

// posts/:id/comments - id da publicação
router.post('/:id/comments', is_logged, function(req, res){
    axios.post(api + 'posts/' + req.params.id + '/comments', req.body)
    .then(response => {
        if(response.status = 201){
            res.redirect('/inquiries')
        }else{
            res.status(response.status).render('error', {message: response.message})
        }
    })
    .catch(error => {
        res.status(500).render('error', {error: error, message: error.message})
    })
})

export default router