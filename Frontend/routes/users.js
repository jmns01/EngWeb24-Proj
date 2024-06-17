import express from 'express'
import axios from 'axios'
import {is_admin, is_logged} from '../includes/permissions.js'
import {retrieve_user_data} from '../includes/retrieve_data.js'

const router = express.Router();

const api = 'http://127.0.0.1:7777/api/'

// Apenas administradores podem ver a lista de utilizadores.
router.get('/', is_admin, function(req, res, next){
    const user_data = retrieve_user_data(req.cookies.cookie_user_data)
    var date = new Date().toISOString().substring(0, 16);
    axios.get(api + 'users')
    .then(response => {
        res.render('users/list', {
            user: user_data,
            lista: response.data,
            date: date
        })
    })
    .catch(error => {
        res.status(500).render('error', {error: error, message: error.message})
    })
})

router.get('/:id/edit', is_logged, function(req, res, next){
    const user_data = retrieve_user_data(req.cookies.cookie_user_data)
    var date = new Date().toISOString().substring(0, 16);
    axios.get(api + 'users/' + req.params.id)
    .then(response => {
        res.render('users/edit', {
            user: user_data,
            u: response.data,
            date: date
        })
    })
    .catch(error => {
        res.status(500).render('error', {error: error, message: error.message})
    })
})

router.post('/edit', is_logged, function(req, res, next){
    axios.put(api + 'users', req.body)
    .then(response => {
        res.redirect('/users')
    })
    .catch(error => {
        res.status(500).render('error', {error: error, message: error.message})
    })
})

router.get('/:id/delete', is_logged, function(req, res, next){
    axios.delete(api + 'users/' + req.params.id)
    .then(response => {
        res.redirect('/users')
    })
    .catch(error => {
        res.status(500).render('error', {error: error, message: error.message})
    })
})

export default router