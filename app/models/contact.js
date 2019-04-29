const mongoose = require('mongoose')
const validator = require('validator') //it is only used to validate the string
//we can write also const Schema = mongoose.Schema (here Schema is a property)
const { Schema } = mongoose //es6 object destructuring from mongoose
const contactSchema = new Schema({
    // all the fields, its types, and its validations ID is provided by mongodb
    name: {
        type: String,
        required: true, //it is server type validation
        minlength: 3,
        maxlength: 128
    },
    mobile: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10,
        // custom validations
        //validation required for storing the relevant data into database
        //we define custom vailidation to suit us needs ex in flipkart we can not buy more than 2 same mobile
        //custom validation
        validate: {
            validator: function (value) {
                return validator.isNumeric(value)//if the format of mobile in correct form it return true
            },
            message: function () {
                return 'invalid mobile number format'
            }
        }
    },
    email: {
        type: String,
        validate: {
            validator: function (value) {
                //if(value.length == 0){
                //   return true
                // }

                //if the email is not passed
                if (validator.isEmpty(value)) {
                    return true
                }
                //if the email is passed it is for in exact format
                return validator.isEmail(value)
            },
            message: function () {
                return 'invalid email format'
            }
        }
    },
    website: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Contact = mongoose.model('Contact', contactSchema)
//if we want to Contact use globally we need to exports

module.exports = {
    Contact
}