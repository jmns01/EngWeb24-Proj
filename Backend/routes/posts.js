import express from 'express'
import posts from '../controllers/posts.js'
import comments from '../controllers/comments.js'
import {verify_token, is_admin} from '../authorization/auth.js'

const router = express.Router();

router.get('/', (req, res) => {
    var page = parseInt(req.query.page) || 1;
    var limit = parseInt(req.query.limit) || 250;
    var skip = (page - 1) * limit;

    posts.read_all(limit, skip)
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error));
})

router.get('/:id', (req, res) => {
    posts.read(req.params.id)
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error));
})

router.post('/', verify_token, (req, res) => {
    posts.create(req.body)
    .then(() => res.sendStatus(201))
    .catch(error => res.jsonp(error));
})

router.delete('/:id', is_admin, (req, res) => {
    posts.remove(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(error => res.jsonp(error));
})

router.post('/:id/comments', verify_token, (req, res) => {
    comments.create(req.params.id, req.body)
    .then(() => res.sendStatus(201))
    .catch(error => res.jsonp(error))
})

export default router;