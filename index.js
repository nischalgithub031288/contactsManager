const express = require('express')
const mongoose = require('./config/database')
const cors = require('cors')

const { contactsRouter } = require('./app/controllers/contacts_controller')//extracting contactsRouter from contacts_controller
const { usersRouter } = require('./app/controllers/users_controller')

const app = express()
const port = 3001
app.use(express.json()) //it is used to parse the data from  json format
app.use(cors())



app.use('/contacts', contactsRouter)//app.use is a general word if we dont know incoming method like get,post etc
//anything do with contacts router it is called or invoked
app.use('/users', usersRouter)

app.get('/', (req, res) => {
    res.send('Welcome to the Contact Manager')
})

app.listen(port, () => {
    console.log('Listening to port', port)
})