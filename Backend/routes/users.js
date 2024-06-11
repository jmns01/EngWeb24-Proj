import express from 'express'
import controller from '../controllers/users.js'
import {verify_token, is_admin} from '../authorization/auth.js';

const router = express.Router();

router.get('/', (req, res) => {
    if('name' in req.query){
        controller.read_all_name(req.query.name)
        .then(data => res.jsonp(data))
        .catch(error => res.jsonp(error));
    }else{
        controller.read_all(req.query)
        .then(data => res.jsonp(data))
        .catch(error => res.jsonp(error));
    }
})

router.post('/', (req, res) => {
    controller.create(req.body)
    .then(() => res.sendStatus(201))
    .catch(error => res.jsonp(error));
})

router.get('/:id', (req, res) => {
    controller.read(req.params.id)
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error));
})

router.put('/:id', verify_token, (req, res) => {
    controller.update(req.params.id, req.body)
    .then(() => res.sendStatus(204))
    .catch(error => res.jsonp(error));
})

router.delete('/:id', is_admin, (req, res) => {
    controller.remove(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(error => res.jsonp(error));
})

export default router;