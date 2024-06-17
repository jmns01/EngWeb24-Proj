import express from 'express';
import mongoose from 'mongoose';

import inquiries from './routes/inquiries.js';
import users from './routes/users.js';
import posts from './routes/posts.js';
import state from './routes/state.js';

const mongodb_connection = 'mongodb://127.0.0.1/EngWeb';
mongoose.connect(mongodb_connection)
.then(() => console.log('Conexão ao MongoDB realizada com sucesso!'))
.catch((error) => console.log('Erro de conexão ao MongoDB: ', error))

const database = mongoose.connection;
database.on("error", console.error.bind(console, "Erro de conexão ao MongoDB"));

const app = express();
const port = 7777;

app.use(express.json());

app.use('/api/inquiries', inquiries);
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/state', state);

app.listen(port, () => {
    console.log('Backend API Server listening port ' + port);
})