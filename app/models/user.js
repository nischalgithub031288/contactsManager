//Skiny controller , the code we write in the controller is just handling the request
//fat model , all the logic ,mechanism are write in model


const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs') // it is the algorithm which is used to encrypt our password we can only encrypt the password
const validator = require('validator')
const jwt = require('jsonwebtoken') //
const { Schema } = mongoose //object destructing property

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        minlength: 5
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value)
            },
            message: function () {
                return 'invalid Email'
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 128
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tokens: [
        {
            token: {
                type: String
            }
        }
    ]


})


// pre/post hooks - mongoose Middleware
//genSalt method is used to generate the salt value i.e encrypt the password 
//(salt) value generate the random with combination of number,alphabet,special char ect
//every time salt value give different value like "$2a$10$qqyroSQoLE/vAR.a"
//bcryptjs.hash() generate the mix value of saltvalue and password and it return hash password


//before saving the password we mixed the password to the hashed /saltvalue 
//it give the hashed password we need to save 
//next() then next method called hence the encrpted password save into the database



userSchema.pre('save', function (next) {
    //if the recoed is stored in the datbase it return true
    //if it is true the encrypted password is save
    if (this.isNew) {
        bcryptjs.genSalt(10).then((salt) => {

            //hash method mixup the password and salt value and generate the hash value
            bcryptjs.hash(this.password, salt).then((hashedPassword) => {
                this.password = hashedPassword
                next()
            })
        })
    }
    else {
        next()
    }
})

userSchema.statics.findByEmailAndPassword = function (email, password) {
    const User = this
    return User.findOne({ email })
        .then((user) => {
            if (user) {
                return bcryptjs.compare(password, user.password)
                    .then((result) => {
                        if (result) {
                            // return new Promise((resolve, reject) => {
                            //     resolve(user)
                            // })
                            return Promise.resolve(user)
                        }
                        else {
                            // return new Promise((resolve, reject) => {
                            //     //const err = 'invalid Password'
                            //     reject('invalid Password')
                            // })
                            return Promise.reject('invalid email or Password')
                        }
                    })
            } else {
                // return new Promise((resolve, reject) => {
                //     reject('Invalid email id and Password')
                // })
                return Promise.reject('invalid email or Password')
            }

        })
        .catch((err) => {
            // return new Promise((resolve, reject) => {
            //     reject(new Error('Invalid email Id and Password'))
            // })
            return Promise.reject(err)
        })
}


userSchema.statics.findByToken = function (token) {
    console.log('this is niscal', token)
    const User = this
    let tokenData
    try {
        tokenData = jwt.verify(token, 'dct@welt123')
        console.log('tokenData', tokenData)
    } catch (err) {
        return Promise.reject(err)
    }

    return User.findOne({
        _id: tokenData.userId,


    })
        .then((user) => {
            // console.log(user)
            //console.log('my ID', _id)
            var found = user.tokens.some(x => x.token === token)
            // return Promise.resolve(user)
            if (found) {
                return User.findOne({
                    '_id': tokenData.userId,
                    'tokens.token': token
                })
                    .then((user) => {
                        return Promise.resolve(user)
                    })
                    .catch((err) => {
                        return Promise.reject(err)
                    })

            }
            else {
                return Promise.reject({ notice: ' redirect to login page' })
            }
        })
        .catch((err) => {

            return Promise.reject(err)
        })


}

//static used in model level ex userSchema.statics
//instance used in object level ex userSchema.methods

userSchema.methods.generateToken = function () {
    const user = this
    //we generate some token data in tokenData object
    const tokenData = {
        userId: user._id,
        username: user.username,
        email: user.email
    }
    // now we generate token data
    //dct@welt123 is a secret value
    const token = jwt.sign(tokenData, 'dct@welt123')
    user.tokens.push({
        token        //token : token  consice method
    })
    //token i generated we push
    return user.save().then((user) => {
        return token
    }).catch((err) => {
        return err
    })

}

const User = mongoose.model('User', userSchema)

module.exports = {
    User
}