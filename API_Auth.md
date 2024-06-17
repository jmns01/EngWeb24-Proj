# Docker e MongoDB

Para persistir dados é necessário importar os dois datasets (json):

```
docker compose up -d
docker exec -it web_database bash
mongoimport --db EngWeb --collection inquiries --file inquiricoes.json --jsonArray
mongoimport --db EngWeb --collection users --file utilizadores.json --jsonArray
```

# Explicação das rotas

## Auth - localhost:6666

`POST localhost:6666/signup` - Criar nova conta de utilizador.

`POST localhost:6666/login` - Iniciar sessão.

## API - localhost:7777

### Users

`GET /api/users` - Lista de todos os utilizadores.

`GET /api/users?` - Lista de todos os utilizadores consoante um termo.

`GET /api/users/{id}` - Informação de um utilizador.

`PUT /api/users/{id}`🔒 - Atualizar dados de utilizador.

`DELETE /api/users/{id}`🔒🔒 - Eliminar conta de utilizador.

### Inquiries

`GET /api/inquiries` - Lista de todas as inquirições.

`GET /api/inquiries?` - Lista de todas as inquirições consoante um termo.

`GET /api/inquiries/{id}` - Informação de uma inquirição.

`POST /api/inquiries`🔒 - Criar novo registo de inquirição.

`PUT /api/inquiries/{id}`🔒 - Atualizar dados de inquirição.

`DELETE /api/inquiries/{id}`🔒🔒 - Eliminar registo de inquirição.

### Posts & Comments

`GET /api/posts` - Lista de todas as publicações.

`GET /api/posts/{id}` - Informação de uma publicação.

`POST /api/posts`🔒 - Criar novo registo de publicação.

`PUT /api/posts/{id}`🔒 - Atualizar dados de publicação.

`DELETE /api/posts/{id}`🔒🔒 - Eliminar registo de publicação.

`GET /api/posts/{id}/comments` - Lista de todos os comentários de uma publicação.

`POST /api/posts/{id}/comments`🔒 - Cria novo comentário na publicação.

## Frontend - localhost:8888

`GET localhost:8888/signup` - Criar nova conta de utilizador.

`GET localhost:8888/login` - Iniciar sessão.

`GET localhost:8888/inquiries` - Lista de inquirições.

`GET localhost:8888/inquiries/{id}` - Informação de uma inquirição.

`POST localhost:8888/inquiries` - Criar registo de inquirição.

`GET localhost:8888/inquiries/{id}/edit`- Página para editar registo de inquirição.

`POST localhost:8888/inquiries/edit` - Atualiza registo de inquirição.

`GET localhost:8888/inquiries/{id}/delete` - Elimina registo de inquirição.