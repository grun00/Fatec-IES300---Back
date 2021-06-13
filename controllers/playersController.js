const {ObjectID} = require("mongodb")
const { listAll, updateOne, deleteOne, findDocuments, findOne, insertOne } = require("../common/database/db")
const collection = "players"

exports.listPlayers = async (req, res) => {
    try {
        if(req.query!=null){
            this.findPlayers(req,res)
        }else{
        result = await listAll(req.database, collection)
        res.send(result)
        }
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}

exports.updatePlayerByID = async (req, res) => {
    const {id} = req.params
    const data = req.body

    try {
        result = await updateOne(req.database, collection, {_id: ObjectID(id)}, data)
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}

exports.deletePlayerByID = async (req, res) => {
    const {id} = req.params
    try {
        result = await deleteOne(req.database, collection, {_id: ObjectID(id)})
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}

exports.findOnePlayerByID = async (req, res) => {
    const {id} = req.params
    try {
        result = await findOne(req.database, collection, {_id:  ObjectID(id)})
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}

exports.findPlayerByUsername = async (req, res) => {
    const {username} = req.params
  console.log(username)
    try {
        result = await findOne(req.database, collection, {username:  username})
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message }) }
}

exports.findPlayers = async (req, res) => {
    try {
        result = await findDocuments(req.database, collection, req.query)
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}

exports.insertPlayer = async (req, res) => {
    let date = new Date()
    let dia = date.getDate(), mes = date.getMonth() + 1, ano = date.getFullYear()
    req.body.dt_criacao = `${dia}/${mes}/${ano}`
    req.body.backpack = []
    req.body.money = 0
    req.body.wins = 0
    try{
        result = await insertOne(req.database, collection, req.body)
        res.send(result)
    }catch(error){
        res.status(401).send({message: error.message})
    }
}

exports.loginPlayer = async (req, res) => {
    const query = { email: req.body.email, password: req.body.password }

    try {
      result = await findOne(req.database, collection, query);
      res.send(result);
    }catch(error) {
        res.status(401).send({message: error.message});
    }
}

exports.addMoney = async (req, res) => {
    const {id} = req.params
    const data = req.body

    try {
        if(data.money && typeof data.money == 'number') {
            return findOne(req.database, collection, {_id:  ObjectID(id)})
            .then(resp => {
                data.money = resp.money + data.money
               return updateOne(req.database, collection, {_id: ObjectID(id)}, data)
                .then((resp) => {
                    resp.message = `Dinheiro adicionado ao usuário, saldo na carteira agora é de: R$ ${data.money}.`
                    res.send(resp)
                }) 
            })
        } else {
            res.send('Envie uma quantia correta')
        }
        
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}

exports.buyItems = async (req, res) => {
    const {id} = req.params
    const data = req.body

    try {
            let allPromises = []
            try {
                allPromises.push(findOne(req.database, "items", {_id:  ObjectID(data.item_id)}))
                allPromises.push(findOne(req.database, collection, {_id:  ObjectID(id)}))
            } catch(err) {
                res.send('ID do Item ou ID do usuário não encontrado(s).')
            }
            
            //allPromises.push(findOne(req.database, collection, {_id:  ObjectID(id)}))
            return Promise.all(allPromises)
            .then(resp => {
                //console.log(resp)
                const item = resp[0]
                const player = resp[1]
                if((item.value * data.quantity) < player.money) {
                    //console.log(item._id)
                    const oldMoney = player.money
                    player.backpack.push({item_id: item._id, quantity: data.quantity})
                    player.money = player.money - item.value * data.quantity
                    let newData
                    newData = {backpack: player.backpack, money: player.money}
                    return updateOne(req.database, collection, {_id: ObjectID(id)}, newData)
                    .then(() => {
                        const message = `Saldo anterior a compra era de: R$ ${oldMoney}, após a compra de ${data.quantity} itens no valor de R$ ${item.value} o seu saldo atual é de: R$ ${player.money}.`
                        res.send(message)
                    })
                } else{
                    const message = `Você não possui dinheiro suficente para comprar esse/esses itens, seu saldo atual é de R$ ${player.money} e a compra dará o valor de R$ ${item.value * data.quantity}.`
                    res.send(message)
                }
            })
            
        
        
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}
