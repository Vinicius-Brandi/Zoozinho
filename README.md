<div align="center">

# 🦁 Zoozinho

### Administração de um zoológicozinho

</div>

---

<details><summary align="center">Resumo do Projeto</summary>

- Interface web desenvolvida com **React.js**, utilizando **HTML**, **CSS** e **JavaScript**
- Uma **Web API REST**, desenvolvida com **ASP.NET em C#**
- Persistência de dados com banco de dados **PostgreSQL**
- Integração entre front-end e back-end utilizando **requisições HTTP**
- Mapeamento objeto-relacional feito com **NHibernate**
- Funcionalidades para cadastro, listagem, atualização e remoção de:
  - Categorias
  - Espécies
  - Recintos
  - Habitats
  - Galpão (apenas Leitura e edição)
  - Animais (com criação de movimentações no editar)
- Relatórios interativos (de Galpão e Recintos) com gráficos utilizando **Recharts**

</details>

---


<details><summary align="center">Instruções de Uso/Execução</summary>

1) Tenha o GIT instalado:

```
https://git-scm.com/download/win
```

2) Tenha o SDK do DOTNET 8.0 instalado:

```
https://dotnet.microsoft.com/pt-br/download
```

3) Tenha o NPM instalado:

```
https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
```

4) Tenha o driver do Postgresql instalado:

```
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
```

5) Tenha uma IDE para Postgresql instalada, recomendo o pgAdmin:

```
https://www.pgadmin.org/download/pgadmin-4-windows/
```

6) Caso tenha acabado de instalar algum dos itens acima, reinicie seu computador
7) Abra um terminal e clone o repositório:

```bash
git clone https://github.com/Vinicius-Brandi/Zoozinho.git
```

8) Acesse o diretório do repositório clonado:

```bash
cd .\Zoozinho\
```

9) Abra o diretório atual no Explorador de Arquivos pra facilitar a explicação:

```bash
explorer .
```

10) Existe uma pasta de script seguindo o caminho Zoozinho/ZooConsole/Database, abrir tanto o script como os inserts em bloco de notas

11) Abra sua IDE do Postgresql (pgAdmin)
12) Confirme que exista um servidor assim:

- Nome: localhost
- Host: 127.0.0.1
- Porta: 5432
- Senha: 1234 _(Tudo é padrão menos essa senha, garanta que esteja assim)_

13) Conecte-se ao servidor registrado crie um banco de dados com nome = postgres (por meio de algum software como DBEAVER(de preferência)
    
14) Crie um script e coloque nele o script que que está no banco de dados, pegue todo ele com o mouse e dê ctrl+enter
    
15) Depois coloque os inserts no script, pegue todo ele com o mouse e dê ctrl+enter
    
16) Abra o Visual Studio 2022, dentro da pasta Zoozinho, tera um arquivo 'ZooConsole.sln', clique nele, você entrara no projeto
    
17) Na parte superior terá um uma engrenagem com os dois projetos, clique nela e escolha ZoozinhoAPI, e clique play logo ao lado
    
18) Após isso abrirá um swagger
```
/localhost:7100/swagger/index.html
```
    
20) Volte para o explorador de arquivos, abra o terminal na pasta zoozinho-react

```bash
# Instale as dependências
npm install

# Rode o projeto localmente
npm run dev
```
20) Aparecerá um link, ctrl+clique e você está com meu projeto web rodando
</details>

---


<details>
    <summary align="center">Entidades</summary>

 Este projeto possui 7 entidades principais que representam a estrutura do sistema. Abaixo, você encontrará a descrição, regras e funcionalidades de cada uma delas.

---

## Categorias

A entidade **Categoria** representa um agrupamento geral(base de tudo) que pode estar associado a espécies e a um recinto.

### Regras e Características

- Nome único obrigatório.
- Pode conter uma lista de espécies associadas.
- Pode estar vinculada a um único recinto.
- Não pode ser excluída se vinculada a espécies ou recinto.
- Nome pesquisável e listável com paginação.


### Funcionalidades

- Cadastro (`Cadastrar`)
- Atualização (`Atualizar`)
- Busca por ID (`BuscarPorId`)
- Listagem paginada e com pesquisa (`Listar`)
- Exclusão com validações (`Deletar`)

---

## Recintos

O **Recinto** representa uma área física onde habitats são alocados, e vinculado.

### Regras e Características

- Vinculado a uma única categoria.
- Apenas um recinto por categoria.
- Possui capacidade máxima de habitats.
- Categoria não pode ser alterada se houver habitats vinculados.
- Não pode ser excluído se possuir habitats.
- Ao excluir, desvincula a categoria automaticamente.
- Nome pesquisável e listável com paginação.


### Funcionalidades

- Cadastrar (`Cadastrar`)
- Atualizar (`Atualizar`)
- Buscar por ID com detalhes (`BuscarPorId`)
- Listar com paginação e filtro (`Listar`)
- Excluir com validações (`Deletar`)
- Gerar relatório de animais e espécies (`Relatorio`)

---

## Espécies

A entidade **Espécie** representa um grupo de animais com características semelhantes.

### Regras e Características

- Nome único obrigatório.
- Vinculada a uma única categoria.
- Pode ter vários animais associados.
- Pode possuir um único habitat.
- Categoria não pode ser alterada se já possuir habitat.
- Exclusão proibida se houver animais ou habitat, exceto exclusão forçada(não recomendo, funciona, mas só deixei no backend, para não limpar tudo).
- Relatórios por categoria disponíveis(sem utilização no front).
- Nome pesquisável e listável com paginação.


### Funcionalidades

- Cadastrar (`Cadastrar`)
- Atualizar (`Atualizar`)
- Buscar por ID com habitat e animais (`BuscarPorId`)
- Listar com paginação, pesquisa e filtro por categoria (`Listar`)
- Excluir com validações e exclusão forçada (`Deletar`)
- Gerar relatório por categoria (`RelatorioPorCategoria`)

---

## Habitats

Representa o ambiente físico para uma espécie dentro de um recinto.

### Regras e Características

- Pertence a um recinto e a uma espécie.
- Espécie e recinto devem pertencer à mesma categoria.
- Limitação de número de habitats por recinto.
- Não pode ser excluído se possuir animais.
- Ao excluir, desvincula recinto e espécie.
- Nome pesquisável e listável com paginação.

### Funcionalidades

- Cadastrar (`Cadastrar`)
- Atualizar (`Atualizar`)
- Buscar por ID com dados completos (`BuscarPorId`)
- Listar com filtros (`Listar`)
- Excluir com validações (`Deletar`)

---

## Galpão

Espaço único para alocar animais excedentes ou sem habitat.

### Regras e Características
- Galpão adicionado somente via Insert.
- Apenas um galpão no sistema.
- Capacidade máxima: 30 animais.
- Nome definido automaticamente pela categoria.
- Capacidade não pode ser menor que o número de animais já possuida no galpão.
- Pode conter várias espécies.
- Não pode ser excluído.

### Funcionalidades

- Atualizar capacidade (`Atualizar`)
- Buscar galpão atual com animais (`Mostrar`)
- Listar animais presentes (`ListarAnimais`)
- Gerar relatório de ocupação por espécie (`Relatorio`)

---

## Animais

Representa cada animal sob os cuidados do zoológico.

### Regras e Características

- Pertence a uma única espécie.
- Pode estar em habitat ou galpão, nunca ambos.
- Sexo válido obrigatório.
- Obrigatório habitat ou galpão se a espécie possuir habitats.
- Se não houver habitats, deve ir para galpão.
- Não pode alocar em local com capacidade cheia.
- Registra movimentações de localização.
- Nome pesquisável e listável com paginação.


### Funcionalidades

- Cadastrar (`Cadastrar`)
- Atualizar dados e alocação (`Atualizar`)
- Buscar por ID com detalhes (`BuscarPorId`)
- Listar com filtros (`Listar`)
- Excluir (`Deletar`)
- Listar movimentações (`ListarMovimentacoes`)

---

## Movimentações

Registra deslocamentos dos animais entre habitats e galpão.

### Regras e Características

- Associada a um animal.
- Origem pode ser habitat, galpão ou nula (primeira movimentação, ou em caso de exclusão de um habitat).
- Destino obrigatório (habitat ou galpão).
- Armazena data e hora.
- Ordenação da mais recente para mais antiga.
- Rastreamento do histórico completo.

### Funcionalidades

- Registrar movimentação (`RegistrarMovimentacao`)
- Listar movimentações por animal com paginação (`ListarPorAnimal`)
</details>

---

<details><summary align="center">Justificativa de uso das Bibliotecas</summary>
<h2 align="center">💻 Tecnologias Utilizadas</h2>
Para desenvolver o **Zoozinho**, utilizei uma combinação de tecnologias no backend e frontend, garantindo uma aplicação eficiente e uma interface de usuário dinâmica e responsiva.

### Back-end

No backend, usamos bibliotecas para conexão com o banco de dados postgreSQL:

- **NHibernate**  
  Um ORM (Object-Relational Mapping) maduro e flexível que mapeia diretamente os objetos C# para as tabelas do banco de dados PostgreSQL.  
  Optamos pelo NHibernate pois ele permite realizar operações complexas, como consultas, inserções, atualizações e exclusões, sem necessidade de escrever SQL manualmente. Além disso, sua estabilidade se destaca frente ao Entity Framework, especialmente no suporte a migrações em PostgreSQL.

- **Npgsql**  
  Driver ADO.NET oficial para comunicação entre aplicações .NET e o banco PostgreSQL.  
  Ele assegura uma conexão eficiente e otimizada, facilitando as operações da API com o banco de dados.

### Front-end

Para a interface do usuário, utilizei biblioteca que facilitavam a reatividade da pagina:

- **React**  
  Biblioteca JavaScript para construção da interface web, que permite criar componentes reutilizáveis e gerenciar o estado da aplicação de forma eficiente, entregando uma experiência dinâmica e responsiva aos usuários, além de permitir fundir html e js com fluidez.

- **React Router DOM**  
  Responsável pelo gerenciamento da navegação interna da aplicação, possibilitando uma SPA (Single Page Application) onde as transições entre páginas ocorrem sem recarregamento, deixando a navegação rápida e fluida.

- **Recharts**  
  Biblioteca especializada em gráficos para React, utilizada para criar relatórios visuais e interativos, com gráficos de pizza. Isso facilita a interpretação dos dados dos galpões e recintos de forma clara e intuitiva.
</details>
