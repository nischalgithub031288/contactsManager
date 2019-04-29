const { User } = require('../models/user')


function authenticateUser(req, res, next) {
    const token = req.header('x-auth')
    //console.log('1', token)
    if (token) {
        //console.log('2', token)
        User.findByToken(token)

            .then((user) => {
                //console.log('inside authenticate', user)
                req.user = user
                req.token = token
                next()
            })
            .catch((err) => {
                if (!err.loggedIn)
                    res.send({ notice: 'redirect to login page' })
                console.log('err of my logo')
            })
    } else {
        res.send('token not provided')
    }
}

module.exports = {
    authenticateUser
}