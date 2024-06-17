import express from 'express';
import cookie_parser from 'cookie-parser';
import inquiries from './routes/inquiries.js';
import users from './routes/users.js';
import posts from './routes/posts.js';
import auth from './routes/auth.js';
import {is_admin} from './includes/permissions.js'
import {retrieve_user_data} from './includes/retrieve_data.js'
import {state_import, state_export} from './includes/state.js'

const app = express();
const port = 8888;

app.set('views', './views');
app.set('view engine', 'pug');

app.use(cookie_parser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req, res) => {
    const user_data = retrieve_user_data(req.cookies.cookie_user_data)
    var date = new Date().toISOString().substring(0, 16);
    res.render('home', {
        user: user_data,
        date: date
    })
});

app.get('/dashboard', is_admin, (req, res, next) => {
    const user_data = retrieve_user_data(req.cookies.cookie_user_data)
    var date = new Date().toISOString().substring(0, 16);
    res.render('users/dashboard', {
        user: user_data,
        date: date
    })
})

app.get('/export', is_admin, (req, res, next) => {

})

app.get('/import', is_admin, (req, res, next) => {

})

app.use('/inquiries', inquiries);
app.use('/users', users);
app.use('/posts', posts);
app.use('/auth', auth);

app.listen(port, () => {
    console.log('Server listening - port ' + port)
});
