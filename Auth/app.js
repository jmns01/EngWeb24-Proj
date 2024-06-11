import express from 'express';
import mongoose from 'mongoose';

import auth from './routes/auth.js';

const mongodb_connection = 'mongodb://127.0.0.1/EngWeb';
mongoose.connect(mongodb_connection)
.then(() => console.log('Conexão ao MongoDB realizada com sucesso!'))
.catch((error) => console.log('Erro de conexão ao MongoDB: ', error))

const database = mongoose.connection;
database.on("error", console.error.bind(console, "Erro de conexão ao MongoDB"));

const app = express();
const port = 6666;

app.use(express.json());

app.use('/auth', auth);

app.listen(port, () => {
    console.log('Auth Server listening port ' + port);
})