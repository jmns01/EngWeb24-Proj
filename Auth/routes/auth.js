import express from 'express'
import generate_token from '../includes/generate_token.js'
import encrypt_password from '../includes/encrypt_password.js'
import controller from '../controllers/auth.js'

const router = express.Router();

router.post('/signup', async (req, res) => {
    req.body.password = await encrypt_password(req.body.password)
    req.body.level = "Consumidor"
    req.body.dateCreated = new Date().toISOString().substring(0, 16);
    req.body.lastAccess = new Date().toISOString().substring(0, 16);
    controller.signup(req.body)
    .then(data => {
        const token = generate_token({id: data._id, name: data.name, username: data.username, level: data.level})
        res.jsonp({id: data._id, name: data.name, username: data.username, level: data.level, token: token})
    })
    .catch(error => res.jsonp(error));
})

router.post('/login', async (req, res) => {
    req.body.password = await encrypt_password(req.body.password)
    controller.login(req.body)
    .then(data => {
        if(data != null){
            const token = generate_token({id: data._id, name: data.name, username: data.username, level: data.level})
            res.jsonp({id: data._id, name: data.name, username: data.username, level: data.level, token: token})            
        }else{
            res.sendStatus(401)
        }
    })
    .catch(error => res.jsonp(error));
})

export default router;