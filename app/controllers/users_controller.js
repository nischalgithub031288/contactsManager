const express = require('express')
const router = express.Router()

const { User } = require('../models/user')

const { authenticateUser } = require('../middlewares/authenticate')


// (post method) localhost: 3000 / users / login
// (delete method) localhost: 3000 / users / logout


router.get('/', (req, res) => {
    User.find()
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            res.send(err)
        })
})

// (post method) localhost: 3000 / users / register

router.post('/register', (req, res) => {
    const body = req.body
    const user = new User(body)
    console.log('Register', user)

    //instance called as an object
    user.save()
        .then((user) => {
            res.send({
                user, //consise property like user : user
                notice: "Succesfully Registered"
            })
        })
        .catch((err) => {
            res.send(err)
        })

})

//to login
// (post method) localhost: 3000 / users / login

router.post('/login', (req, res) => {
    const body = req.body

    //instance method called in object 
    //static method is called on model /class
    //moongoose allow to define your own method
    User.findByEmailAndPassword(body.email, body.password)
        .then((user) => {
            //res.send(user)
            return user.generateToken() //generating the token for the user 2 it is instance method because we calling on the object
        })
        .then((token) => {
            //res.header('x-auth', token).send() note for axios we used in react not allowed header
            //token is send to the header not body 2 whenever we request the token is not available in body
            //this information sent to the client the client take token into local storage any request is made token check
            console.log('inside function', token)
            res.send({ token })
        })
        .catch((err) => {
            console.log(err)
            // res.status('404').send(err)
        })
})

//to logout
router.delete('/logoutall', authenticateUser, (req, res) => {
    const tokenData = req.token
    const user = req.user
    User.findByIdAndUpdate(user_id, {
        $set: {
            'tokens': []
        }
    })
        .then((user) => {
            res.send(user)
        })
        .catch((err) => {
            res.send(err)
        })
})







module.exports = {
    usersRouter: router
}