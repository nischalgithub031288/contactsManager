const express = require('express')
const mongoose = require('./config/database')

const { contactsRouter } = require('./app/controllers/contacts_controller')
const { userRouter } = require('./app/controllers/user_controller')

const app = express()
const port = 3000
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome to the Contact Manager')
})

app.use('/contacts', contactsRouter)
app.use('/users', userRouter)


app.listen(port, () => {
    console.log('Listening to port 3000')
})