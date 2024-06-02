import express from 'express'
import controller from '../controllers/auth.js'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

function generate_access_token(data){
    return jwt.sign(data, process.env.JWT_SECRET_KEY, {expiresIn: '3000s'})
}

const router = express.Router();

router.post('/login', (req, res) => {
    controller.login(req.body)
    .then(data => {
        const token = generate_access_token({id: data._id, name: data.name, level: data.level})
        res.jsonp({name: data.name, level: data.level, token: token})
    })
    .catch(error => res.jsonp(error));
})

router.post('/register', (req, res) => {
    controller.create(req.body)
    .then(data => {
        const token = generate_access_token({id: data._id, name: data.name, level: data.level})
        res.jsonp({name: data.name, level: data.level, token: token})
    })
    .catch(error => res.jsonp(error));
})

export default router;