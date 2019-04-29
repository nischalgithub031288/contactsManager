const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = 3000

// DB CONFIGURATION
// telling mongoose to use es6's promise library
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/contact-manager-nov', { useNewUrlParser: true })
    .then(() => {
        console.log('connected to db')
    })
    .catch((err) => {
        console.log('Error connecting to DB', err)
    })


// common terminologies in MONGO DB
// DB - nothing a software used to store data 
// Collection - []
// Document - {}
// Field - nothing but a property

// to store information about a contact - like the name, email, mobile, website 
// const contacts = [ { id: 1, name: 'ani', email: 'ani@gmail.com', mobile: 1234, website: 'www.ab.com' } ]

// contacts = Collection
// { id: 1, name: 'ani', email: 'ani@gmail.com', mobile: 1234, website: 'www.ab.com' } = Document
// id = field
// name = field 
// mobile, email, website = field


app.get('/', (req, res) => {
    res.send('Welcome to the Contact Manager')
})

app.listen(port, () => {
    console.log('Listening to port 3000')
})