const express = require('express')
const router = express.Router()
//const jwt = require('jsonwebtoken')
const { Contact } = require('../models/contact')
const { validateID } = require('../middlewares/validate')
const { authenticateUser } = require('../middlewares/authenticate')
//const { User } = require('../models/user')

//public websites
//local host:3000/contacts?token=token

// function authenticateUser(req, res, next) {
//     const token = req.header('x-auth')
//     if (token) {
//         User.findByToken(token)
//             .then((user) => {
//                 req.user = user
//                 req.token = token
//                 console.log('authenticate')
//                 next()
//             })
//             .catch((err) => {
//                 res.send(err)
//             })
//     } else {
//         res.send('token not provided')
//     }


// }
// route - fetch all contacts from db and send it to client 

//more posibility of records that why we use contacts (plural)
//all find related method is static method




//we dont write /contacts because it is already assigned/mapping in index.js line no 14 contacts i
router.get('/', authenticateUser, (req, res) => {
    Contact.find({
        user: req.user._id
    })
        .then((contacts) => {
            res.send(contacts)
        })
        .catch((err) => {
            res.send(err)
        })
})

// route - to create a contact 
router.post('/', authenticateUser, (req, res) => {

    const body = req.body //it is in json format so we need to parse it by using    app.use(express.json()) it is write in index.js
    console.log('nis', body)

    const contact = new Contact(body) //Contact is object constructor function and contact is an object it is comes from model we have created 2)body will assign all field of contact like body.name,body.email etc
    contact.user = req.user._id
    //now here it is used object constructor function whatever we write in body it is assign to contact also

    //now we save the contact object in database by using save()method 
    //possibility to find one record we used contact
    //save() is basically object method or instance method

    contact.save()
        .then((contact) => {
            res.send(contact)
        })
        .catch((err) => {
            res.send(err)
        })
})

// route - to get a contact 
router.get('/:id', validateID, authenticateUser, (req, res) => {
    const id = req.params.id
    Contact.findById(id)
        .then((contact) => {
            if (contact) { // if the contact is present
                res.send(contact)
            } else { // if contact not present then value is null
                res.send({})
            }
        })
        .catch((err) => {
            res.send(err)
        })
})

// route - to delete a contact
router.delete('/:id', validateID, authenticateUser, (req, res) => {
    const id = req.params.id
    Contact.findByIdAndDelete(id)


        .then((contact) => {
            console.log(contact)

            if (contact) {
                res.send(contact)
            } else {
                res.send({})
            }
        })
        .catch((err) => {
            res.send(err)
        })
})

router.put('/:id', validateID, authenticateUser, (req, res) => {
    const _id = req.params.id
    const data = req.body
    Contact.findOneAndUpdate({ _id }, { $set: data })
        .then((contact) => {
            if (contact) {
                res.send(contact)
            } else {
                res.send({})
            }
        })
        .catch((err) => {
            res.send(err)
        })
})

module.exports = {
    contactsRouter: router
}