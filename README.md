# 🦁 Zoozinho

### Administração de um zoologiquinho
<details>
<summary><strong>Resumo do Projeto</strong></summary>

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

13) Conecte-se ao servidor registrado crie um banco de dados com nome = postgres (meio de algum software como DBEAVER(de preferência)
    
14) Crie um script e coloque nele o script que que está no banco de dados, pegue todo ele com o mouse e dê ctrl+enter
    
15) Depois coloque os inserts no script, pegue todo ele com o mouse e dê ctrl+enter
    
16) Abra o Visual Studio 2022, dentro da pasta Zoozinho, tera um arquivo 'ZooConsole.sln', clique nele, você entrara no projeto
    
17) Na parte superior terá um uma engrenagem com os dois projetos, clique nela e escolha ZoozinhoAPI, e clique play logo ao lado
    
18) Após isso abrirá um swagger, caso queira fazer testes deixarei em outro aba json para teste
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

