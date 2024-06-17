import express from 'express';
import cookie_parser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import inquiries from './routes/inquiries.js';
import users from './routes/users.js';
import posts from './routes/posts.js';
import auth from './routes/auth.js';
import {is_admin} from './includes/permissions.js'
import {retrieve_user_data} from './includes/retrieve_data.js'

var multer = require('multer');
var upload = multer({dest: 'uploads'})
const Ajv = require('ajv');

// Coisas para upload de ficheiros
const ajv = new Ajv();

// Load the JSON schema
const schemaPath = path.join(__dirname, '../manifest.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const validate = ajv.compile(schema);

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
    let inquiricoes = [];
    let posts = [];
    let users = [];
    
    const inquiricoesRequest = axios.get('http://localhost:7777/inquiries/export')
    .then(response => {
        console.log('Dados de inquirições descarregados com sucesso');
        inquiricoes = response.data;
    })
        .catch(error => {
        console.error('Erro ao descarregar dados de inquirições:', error);
    });

    const postsRequest = axios.get('http://localhost:7777/posts/export')
    .then(response => {
        console.log('Dados de posts descarregados com sucesso');
        posts = response.data;
    })
        .catch(error => {
        console.error('Erro ao descarregar dados de posts:', error);
    });
    
    const usersRequest = axios.get('http://localhost:7777/users/export')
    .then(response => {
        console.log('Dados de usuários descarregados com sucesso');
        users = response.data;
    })
        .catch(error => {
        console.error('Erro ao descarregar dados de usuários:', error);
    });

    Promise.all([inquiricoesRequest, postsRequest, usersRequest])
    .then(() => {
        const data = { inquiricoes: inquiricoes, posts: posts, users: users };
        const jsonString = JSON.stringify(data, null, 2);
    
        const filePath = path.join(__dirname, '/../data/data.json');
        fs.writeFile(filePath, jsonString, function(err) {
            if (err) {
            console.error('Error writing file:', err);
            res.status(500).send('Error generating data file');
            } else {
            res.download(filePath);
            }
        })
    })
    .catch(error => {
        console.error('Error waiting for promises:', error);
        res.status(500).send('Error generating data file');
    });
})

app.get('/import', is_admin, (req, res, next) => {
    var date = new Date().toISOString().substring(0, 16);
    res.status(200).render('users/upload', {
        user: user_data,
        date: date
    });
});

app.post('/import', upload.single('myFile'), (req, res) => {
    console.log('cdir: ' + __dirname)
    let oldPath = __dirname + '/../' + req.file.path;
    console.log("old: " + oldPath)
    let newPath = __dirname + '/../public/fileStore/' + req.file.originalname
    console.log("new: " + newPath)

    fs.rename(oldPath, newPath, function(error){
        if(error) throw error
    })

    // Read and validate the uploaded file
    fs.readFile(newPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading uploaded file');
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            const valid = validate(jsonData);

            if (!valid) {
                console.log('Validation errors:', validate.errors);
                res.status(400).json({ errors: validate.errors });
            } else {
                console.log('Data is valid!');

                const addInquiricoesReq = axios.post('http://localhost:7777/import', jsonData.inquiricoes)
                .then(response => console.log('Inquirições adicionadas com sucesso'))
                .catch(error => console.error('Erro ao adicionar inquirições:', error));

                const addPostsReq = axios.post('http://localhost:7777/posts/import', jsonData.posts)
                .then(response => console.log('Posts adicionados com sucesso'))
                .catch(error => console.error('Erro ao adicionar posts:', error));

                const addUsersReq = axios.post('http://localhost:7777/users/import', jsonData.users)
                .then(response => console.log('Utilizadores adicionados com sucesso'))
                .catch(error => console.error('Erro ao adicionar utilizadores:', error));

                Promise.all([addInquiricoesReq, addPostsReq, addUsersReq])
                .then(() => {
                    console.log('Inquirições, posts e utilizadores adicionados com sucesso');
                    res.status(200).redirect('/getInquiricoesList');
                })
                .catch(error => {
                    console.error('Error adding data:', error);
                    res.status(500).send('Error adding data');
                });
            }
        } catch (parseError) {
            res.status(400).send('Invalid JSON format in uploaded file');
        }
    });
});

app.use('/inquiries', inquiries);
app.use('/users', users);
app.use('/posts', posts);
app.use('/auth', auth);

app.listen(port, () => {
    console.log('Server listening - port ' + port)
});
