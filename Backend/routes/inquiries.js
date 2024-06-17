import express from 'express'
import controller from '../controllers/inquiries.js'
import relations from '../controllers/relations.js'
import {verify_token, is_admin} from '../authorization/auth.js'
import { is_logged } from '../../Frontend/includes/permissions.js';

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
        controller.read_all(limit, skip)
        .then(data => res.jsonp(data))
        .catch(error => res.jsonp(error));
    }
})

router.post('/', verify_token, (req, res) => {
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

router.get('/:id/relations', (req, res) => {
    relations.read_all(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(error => res.jsonp(error));
})

router.post('/:id/relations', is_logged, (req, res) => {
    relations.update(req.params.id, req.body)
    .then(() => res.sendStatus(204))
    .catch(error => res.jsonp(error));
})

export default router;