import express from 'express';
import cookie_parser from 'cookie-parser';
import inquiries from './routes/inquiries.js';
import users from './routes/users.js';
import posts from './routes/posts.js';
import auth from './routes/auth.js';

const app = express();
const port = 8888;

app.set('views', './views');
app.set('view engine', 'pug');

app.use(cookie_parser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req, res) => {
    var level = ''
    var is_logged = false

    if(req.cookies.cookie_user_data){
        level = req.cookies.cookie_user_data.level
        is_logged = true
    }

    res.render('home', {
        level: level,
        is_logged: is_logged
    })
});

app.use('/inquiries', inquiries);
app.use('/users', users);
app.use('/posts', posts);
app.use('/auth', auth);

app.listen(port, () => {
    console.log('Server listening - port ' + port)
});
