import express from 'express';
import mongoose from 'mongoose';

import inquiricoes from './routes/inquiricoes.js';
import utilizadores from './routes/utilizadores.js';

const mongodb_connection = 'mongodb://127.0.0.1/inquiricoes';
mongoose.connect(mongodb_connection);

const database = mongoose.connection;
database.on("error", console.error.bind(console, "Erro de conexão ao MongoDB"));
database.once("open", () => {
    console.log("Conexão ao MongoDB realizada com sucesso");
});

const app = express();
const port = 7777;

app.use(express.json());

app.use('/inquiricoes', inquiricoes);
app.use('/utilizadores', utilizadores);

app.listen(port, () => {
    console.log('Backend API Server listening port ' + port);
})