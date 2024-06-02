import express from 'express'
import controller from '../controllers/utilizadores.js'
import verify_jwt from '../authorization/auth.js'

const router = express.Router();

// Trocar 'item' pelo nome do atributo desejado
router.get('/', (req, res) => {
    if('item' in req.query){
        controller.read_all_conditional(req.query.item)
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
    .then(data => res.jsonp(data[0] || {}))
    .catch(error => res.jsonp(error));
})

router.put('/:id', verify_jwt, (req, res) => {
    controller.update(req.params.id, req.body)
    .then(() => res.sendStatus(204))
    .catch(error => res.jsonp(error));
})

router.delete('/:id', verify_jwt, (req, res) => {
    controller.remove(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(error => res.jsonp(error));
})

export default router;