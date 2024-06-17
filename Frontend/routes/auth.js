import express from 'express'
import axios from 'axios'
const router = express.Router();

const auth = 'http://127.0.0.1:6666/auth/'

router.get('/register', function(req, res){
    const cookie_user_data = req.cookies.cookie_user_data
    if(cookie_user_data){
        res.redirect('/')
    }else{
        res.render('auth/register')
    }
})

router.post('/register', function(req, res){
    axios.post(auth + 'signup', req.body)
    .then(response => {
        if(response.status == 200){
            res.cookie('cookie_user_data', response.message)
            res.redirect('/')
        }else{
            res.render('error', {message: response.error})
        }
    })
    .catch(error => {
        res.render('error', {message: error.message})
    })
})

router.get('/login', function(req, res){
    const cookie_user_data = req.cookies.cookie_user_data
    if(cookie_user_data){
        res.redirect('/')
    }else{
        res.render('auth/login')
    }
})

router.post('/login', function(req, res){
    axios.post(auth + 'login', req.body)
    .then(response => {
        if(response.status == 200){
            res.cookie('cookie_user_data', response.data)
            res.redirect('/')
        }else{
            res.render('error', {message: response.message})
        }
    })
    .catch(error => {
        res.render('error', {message: error.message})
    })
})

router.get('/logout', function(req, res){
    res.clearCookie('cookie_user_data')
    res.redirect('/')
})

export default router