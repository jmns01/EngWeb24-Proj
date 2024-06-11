# Docker e MongoDB

Para persistir dados é necessário importar os dois datasets (json):

```
docker compose up -d
docker exec -it web_database bash
mongoimport --db EngWeb --collection inquiries --file inquiricoes.json --jsonArray
mongoimport --db EngWeb --collection users --file utilizadores.json --jsonArray
```

# Explicação das rotas de API e de Auth

## API - localhost:7777

### Users

`GET /users` - Lista de todos os utilizadores.

`GET /users?` - Lista de todos os utilizadores consoante um termo.

`GET /users/{id}` - Informação de um utilizador.

`PUT /users/{id}`🔒 - Atualizar dados de utilizador.

`DELETE /users/{id}`🔒🔒 - Eliminar conta de utilizador.

### Inquiries

`GET /inquiries` - Lista de todas as inquirições.

`GET /inqueries?` - Lista de todas as inquirições consoante um termo.

`GET /inquiries/{id}` - Informação de uma inquirição.

`POST /inquiries`🔒 - Criar novo registo de inquirição.

`PUT /inquiries/{id}`🔒 - Atualizar dados de inquirição.

`DELETE /inquiries/{id}`🔒🔒 - Eliminar registo de inquirição.

## Auth - localhost:6666

`POST localhost:6666/signup` - Criar nova conta de utilizador.

`POST localhost:6666/login` - Iniciar sessão.