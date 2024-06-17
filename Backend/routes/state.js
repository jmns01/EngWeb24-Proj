import express from 'express'
import inquiries from '../controllers/inquiries.js'
import posts from '../controllers/posts.js'
import {is_admin} from '../authorization/auth.js'

const router = express.Router();

router.get('/import', is_admin, (req, res) => {

})

router.get('/export', is_admin, (req, res) => {

})

export default router;