const mongoose = require('mongoose')
// DB CONFIGURATION

// jquery library ,blue bird package is used
// telling mongoose to use es6's promise library
mongoose.Promise = global.Promise//moongoose is a library and global is a universal object
mongoose.connect('mongodb://localhost:27017/contact-manager-nov', { useNewUrlParser: true })//to use new parser,pass option { useNewUrlParser: true }to mongoClient.connect
    .then(() => {
        console.log('connected to db')
    })
    .catch((err) => {
        console.log('Error connecting to DB', err)
    })
//mongoose file need to be exports

module.exports = {
    mongoose
}