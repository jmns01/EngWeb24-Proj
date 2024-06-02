import express from 'express'
import controller from '../controllers/inquiricoes.js'
import verify_jwt from '../authorization/auth.js'

const router = express.Router();

router.get('/', (req, res) => {
    var page = parseInt(req.query.page) || 1;
    var limit = parseInt(req.query.limit) || 250;
    var skip = (page - 1) * limit;

    if('name' in req.query){
        controller.read_all_name(req.query.name, limit, skip)
        .then(data => res.jsonp(data))
        .catch(error => res.jsonp(error));
    }else if('local' in req.query){
        controller.read_all_local(req.query.local, limit, skip)
        .then(data => res.jsonp(data))
        .catch(error => res.jsonp(error));
    }else if('date' in req.query){
        controller.read_all_date(req.query.date, limit, skip)
        .then(data => res.jsonp(data))
        .catch(error => res.jsonp(error));
    }else{
        controller.read_all(req.query, limit, skip)
        .then(data => res.jsonp(data))
        .catch(error => res.jsonp(error));
    }
})

router.post('/', verify_jwt, (req, res) => {
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