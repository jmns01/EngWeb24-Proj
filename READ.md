# EngWeb24-Proj

Trabalho Prático de EngWeb2024 realizado por :

- André Pimentel Filipe - A96890
- David da Silva Teixeira - A100554
- João Henrique Costa Ferreira - A96854
- João Manuel Novais da Silva - A91671

## Introdução

Este documento serve como relatório para o projeto da Unidade Curricular de Engenharia Web, do 3º ano da Licenciatura em Engenharia Informática.

Ao longo deste relatório vamos explicar o nosso raciocínio, as nossas interpretações e a nossa resolução do problema dado no enunciado.

O relatório está dividido em 4 partes, cada uma das pastas deste repositório representa uma divisão do trabalho.

- São elas respetivamente:
1. [Estrutura/Arquitetura da plataforma](https://github.com/jmns01/EngWeb24-Proj/blob/andre/arquitetura.png)
2. [Tratamento de dados](https://github.com/jmns01/EngWeb24-Proj/tree/main/Dataset)
3. [API de dados](https://github.com/jmns01/EngWeb24-Proj/tree/main/BackEnd)
4. [Front-end](https://github.com/jmns01/EngWeb24-Proj/tree/main/Frontend)
5. [Servidor de Autenticação](https://github.com/jmns01/EngWeb24-Proj/tree/main/Auth)

O tema escolhido pelo nosso grupo foi o [Inquirições de Génere](colocar link do git com o enunciado).

## Estrutura/Arquitetura da plataforma

Esta arquitetura é construída por 3 servidores: **Frontend**, **BackEnd** e **Auth**. Cada um serve um propósito bem definido e a comunicação entre eles é fundamental para conceber a plataforma pretendida.

![estrutura](https://github.com/jmns01/EngWeb24-Proj/blob/andre/arquitetura.png)

## [Tratamento de dados](https://github.com/jmns01/EngWeb24-Proj/tree/main/Dataset)

### Script *csv_json_parser.py*

Recebendo o ficheiro de dados em formato [.csv](https://github.com/jmns01/EngWeb24-Proj/blob/main/Dataset/PT-UM-ADB-DIO-MAB-006.CSV) teríamos não só de o tratar como passar para [.json](colocar o link do db.json) e para isso utilizamos uma ***[script](https://github.com/jmns01/EngWeb24-Proj/blob/main/Dataset/csv_json_parser.py)*** escrita na linguagem *python*, há semelhança do que já tínhamos feito em aulas da UC.

### Script *analise.py*

O arquivo **analise.py** contém um conjunto de funções para analisar um arquivo JSON e extrair valores únicos. Abaixo está uma descrição detalhada de suas funcionalidades:
- São elas respetivamente:
1. make_hashable: Converte listas em tuplas de forma recursiva para garantir que sejam "hashable" (ou seja, que possam ser usadas em conjuntos e como chaves de dicionários).
2. list_unique_values: Lê um arquivo JSON, extrai valores únicos de cada campo do JSON e armazena esses valores únicos em um dicionário onde as chaves são os nomes dos campos e os valores são conjuntos de valores únicos.
3. save_unique_values_to_json: Guarda o dicionário de valores únicos em um novo arquivo JSON.

## [API de dados](https://github.com/jmns01/EngWeb24-Proj/tree/main/BackEnd)

A resolução desta parte, à semelhança das outras, está de acordo com o feito nas aulas práticas. Sendo uma API de dados, serve principalmente para devolver os dados da base de dados de acordo com os vários critérios. Utilizando a base de dados guardada em mongoDB, utilizamos o módulo mongoose para conectarmo-nos à base de dados. De seguida, tratamos da criação dos [modelos](https://github.com/jmns01/EngWeb24-Proj/blob/main/BackEnd/models/inquiricao.js) dos vários objetos da BD.

## [Front-end(Frontend)](https://github.com/jmns01/EngWeb24-Proj/tree/main/Frontend)

O Frontend é o principal servidor na plataforma por ser o servidor que conecta todas as outras componentes e também por ser o servidor que comunica diretamente com o utilizador.

Este servidor trata de todos os pedidos do utilizador e usa como suporte os outros dois servidores (Auth e BackEnd) para dar resposta aos pedidos do utilizador.

Mais concretamente, este servidor faz pedidos ao BackEnd para obter informação sobre as inquirições, os comentários e posts. Faz pedidos ao Auth para obter informação sobre os utilizadores para puder fazer várias coisas como autenticar utilizadores, editar os perfis e ter níveis de acesso diferentes para cada utilizador (admin e default).

## [Servidor de Autenticação](https://github.com/jmns01/EngWeb24-Proj/tree/main/Auth)

O Auth é o servidor encarregado de administrar todas as informações sobre os utilizadores. A gestão dessas informações envolve: criar, editar, listar, desativar e ativar utilizadores. Para isso, foi criada uma coleção na base de dados para armazenar as informações dos diversos utilizadores.

Além disso, este servidor é responsável por gerar um JWT (Json Web Token) para cada utilizador que se autenticar com sucesso na plataforma. Este token é então enviado para o Frontend para que o cliente possa armazená-lo as suas cookies. Este token permite que todos os servidores verifiquem se um determinado utilizador está autenticado, além de conferir o nome de utilizador, nível de acesso e se está ativo (todos esses campos são armazenados no payload do token). Assim, a autenticação de utilizadores e os diferentes níveis de acesso são implementados.

Diferente do Frontend, este servidor não gera nenhum tipo de interface, apenas responde às solicitações deste servidor consultando o banco de dados.

## [Funcionalidades implementadas]

Para as inquirições, implementamos as seguintes funcionalidades:

### [Inquirição]

1. Adição de novas inquirições
2. Edição de inquirições
3. Eliminação de inquirições
4. Consulta de inquirições
5. Download de inquirições

Na adição de novas inquirições, é verificado se o id da inquirição já existe na plataforma ou não; só depois de haver validação é que este é adicionado à plataforma.

### [Posts]

Para os posts, implementamos as seguintes funcionalidades:

1. Adição de um post a uma inquirição
2. Edição de um post
3. Eliminação de um post
4. Consulta de um post
5. Comentar um post

## [Conclusão]

Agora concluído o trabalho prático da Unidade Curricular de Engenharia Web, achamos que cumprimos com a totalidade dos objetivos propostos. Concluimos que mesmo com os desafios que tivemos na realização deste projeto ainda assim conseguimos aprender e reforçar vários conceitos ensinados em aula, e melhoramos a nossa organização e capacidades em construir interfaces e servidores utilizando vários tipos de ferramentes, tais como docker, jwt e outros.

Acreditamos que o nosso projeto poderia servir como uma base sólida para algo orientado para o mundo real, sendo útil para ajudar profissionais a construir um trabalho útil, funcional e esteticamente apelativo.

Concluindo, ficamos satisfeitos com o resultado final do nosso projeto e das coisas que aprendemos.