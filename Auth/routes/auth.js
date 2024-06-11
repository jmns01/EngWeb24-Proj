import express from 'express'
import generate_token from '../token/generate.js'
import controller from '../controllers/auth.js'

const router = express.Router();

router.post('/signup', (req, res) => {
    controller.signup(req.body)
    .then(data => {
        const token = generate_token({id: data._id, name: data.name, level: data.level})
        res.jsonp({name: data.name, level: data.level, token: token})
    })
    .catch(error => res.jsonp(error));
})

router.post('/login', (req, res) => {
    controller.login(req.body)
    .then(data => {
        const token = generate_token({id: data._id, name: data.name, level: data.level})
        res.jsonp({name: data.name, level: data.level, token: token})
    })
    .catch(error => res.jsonp(error));
})

export default router;