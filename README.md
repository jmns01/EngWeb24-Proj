# Relatório

## Elementos do grupo de trabalho
. André Pimentel Filipe - A96890
. David da Silva Teixeira - A100554
. João Henrique Costa Ferreira - A96854
. João Manuel Novais da Silva - A91671

## Introdução

O nosso grupo, para o trabalho prático de Engenharia Web do 2024, escolheu a proposta 2 - Inquirições de Génere.

O objetivo para este tema é desenvolver uma plataforma que sirva para partilhar e gerir inquirições de testemunhas para comprovar a filiação, reputação, bom nome ou "limpeza de sangue" do requerente. Foi usado o modelo OAIS (Open Archival Information System) como sistema para divulgação, disseminação, gestão e armazenamento dos recursos.

Neste relatório vamos abordar como está organizada a aplicação, de que maneira os dados são guardados e geridos e as funcionalidades implementadas na plataforma.

## Estrutura/Arquitetura da plataforma

Começou-se por organizar os servidores em duas pastas, Backend (para servidores que respondem a pedidos diretamente sem recurso a uma interface) e Frontend (que premitem a interação direta com o utilizador). Os servidores relacionam-se para responder aos vários pedidos que um utilizador possa fazer.

### Backend

O Backend possui os servidores responsáveis por gerir toda a informação sobre os recursos (desde inquirições e utilizadores). Gerir esta informação inclui: criar, editar, listar e remover recursos. Para isso, foram criadas 2 coleções diferentes na base de dados da plataforma cada uma para cada tipo de entidade.

Para além disto, o servidor responsável pelos servidor é responsável por gerar um jwt (Json Web Token) para cada utilizador se autenticar com sucesso na plataforma. Este token é posteriormente passado para o servidor da plataforma ("App") para que o cliente possa-o guardar nas suas cookies. Este token serve para todos os servidores verificarem se um dado utilizador está autenticado ou não, e para além disso, verificarem, também, o username, password e nível de acesso (todos estes campos são guardados no payload do token). Desta forma, a autenticação de utilizadores e os diferentes níveis de acesso dos mesmos são implementados.

Este servidor não gera qualquer tipo de interface apenas responde aos pedidos deste servidor consultando a base de dados.

### Frontend

O Frontend contém a interface da plataforma que conecta todas as outras componentes (Backend) e também responsável por ser o servidor que comunica diretamente com o utilizador.

Este servidor trata de todos os pedidos do utilizador e usa como suporte os outros servidores para dar resposta aos pedidos do utilizador.

Mais concretamente, este servidor faz pedidos ao Backend para obter informação sobre os recursos, as notícias, os posts, autenticar utilizadores, editar os perfis e ter níveis de acesso diferentes para cada utilizador (Administrador, Produtor e Consumidor)

## Dados

Decidiu-se usar uma Base de Dados não relacional recorrendo ao MongoDB. A base de dados chama-se 'inquiricoes', nela criamos 2 coleções: users, inquiricoes.

Passamos agora à explicação de cada uma.

### Users

Esta coleção é responsável por guardar os dados de todos os utilizadores da plataforma. Mais concretamente, cada documento desta coleção tem a seguinte estrutura:

    .*name*: string que representa o nome do utilizador;
    .*username*: string que representa o nome do utilizador na plataforma;
    .*password*: string que guarda a palavra-passe do utilizador;
    .*level*: string que representa o tipo de utilizador (Administrador, Produtor e Consumidor);
    .*dateCreated*: string que guarda a data de criação da conta;
    .*lastAccess*: string que guarda a data de último acesso à plataforma;

Desta maneira, toda a informação de cada utilizador é guardada na Base de Dados. O ficheiro que é a foto de perfil do utilizador está guardado no file system, o campo "profilePic" apenas tem o nome desse ficheiro.

### Inquirições

As inquirições possuem demasiados campos. Então mostraremos somente aqueles que entendemos serem os mais importantes:

    .*UnitTitle*: String que guarda o nome da Inquirição;
    .*UnitDateInitial*: Data inicial da inquirição;
    .*UnitDateFinal*: Data da última alteração da inquirição;
    .*Repository*: String com o nome do repositório aonde está guardada a Inquirição
    .*Creator*: String que guarda o nome do criador;
    .*Relations*: Nomes de pessoas involvidas noutras inquirições relacionados com a que se está a analisar;

Desta maneira, toda a informação de cada recurso é guardada na Base de Dados. O recurso em si é guardado usando o file system, na Base de Dados apenas ficam guardados os meta-dados do recurso.

## Funcionalidades