
# Coisas a ter em atenção

## Processo de Ingestão
- Permitir fazer upload de pacotes
- Verificar uploads contra o manifesto

## Processo de Administração
- CRUD (listar, consultar, inserir novo, editar existente, apagar)
- Converter SIP num pacote AIP

## Processo de Disseminação
- Converter AIP em DIP
- DIP = SIP

### SIGLAS
- SIP = Submission Information Package: ficheiro zip que deve ter uma estrutura baseada em Baglt
- DIP = Dissemination Information Package: semelhante a SIP

### Objectivos
- Autenticação
- Exportar/Importar toda a informação

# Lista de coisas feitas

- As linhas 2 e 3 do dataset fazem parte todas do primeiro registo (coluna ScopeContent), para fazer um parser funcional temos de pôr tudo na mesma linha -> É possível que isto aconteça mais do que esta vez, por isso temos que arranjar uma solução
- As relações podem ser IDs mas isso torna o script muito ineficiente (alternativa melhor é usar os nomes e depois pensar no que fazer com as rotas)
- Ter os ids em relações significa que existem pessoas que, por não terem o seu inquerito na base de dados, não são incluídas nas relações.

# Rotas

## AUTH SERVER
```
localhost:27002/login
localhost:27002/register
```

## API SERVER
```
localhost:27001/inqueritos/*
localhost:27001/utilizadores/*
```

## FRONTEND
```
localhost:27000/*
```