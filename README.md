# About

Repositorio com o codigo do backend do projeto de IES300 da Fatec

# Instalando Dependências
```sh
> npm install
```

# Rodando o servidor em live reload (desenvolvimento)

```sh
> npm run dev
```

# Rodando o servidor (produção)

```sh
> npm start
```

O servidor usa a rota localhost:5000/ como padrão.

Obrigado aos membros do grupo.

# Endpoints 

                                        Cria player
Para criar um player, enviar um json conforme o exemplo abaixo:

Método: POST

Endereço do serviço: http://localhost:5000/players

Exemplo de json: {"name":"Thiago","netWorth":"300000000","email":"thiago@gmail.com","password":"123456"}

                                     Retorna um question aleatória
A question retornada é selecionada aleatóriamente no banco de dados e é de acordo com a category e difficulty informados.

Método: GET

Endereço do serviço: http://localhost:5000/questions

Exemplo: http://localhost:5000/questions?category=TI&difficulty=0&random=true


                                      Atualiza dados de um player
Não é necessário passar todos os dados do player. Só os dados que quer atualizar.

Método: PATCH

Endereço do serviço: http://localhost:5000/players/:id

Exemplo de json : {   "name": "Tiago",   "netWorth": "111111111",  "email": "thiago@gmail.com",  "password": "123456"
}

                                     Pesquisa player por parametros

Método: GET

Exemplo: http://localhost:5000/players?email=thiago@gmail.com


