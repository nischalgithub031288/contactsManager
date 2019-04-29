const express = require('express')
const mongoose = require('mongoose')
const useragent = require('useragent');
const port = 3000
var date = new Date

const { Bookmark } = require('./app/model/bookmark')
const app = express()
// app.use(useragent.express());
app.use(express.json())
require('./config/database')


const { urlRouter } = require('./app/controller/url_controller')
const { userRouter } = require('./app/controller/user_controller')


app.listen(port, function () {
    console.log('Connected to port 3000')
})
app.use('/bookmark', urlRouter)
app.use('/user', userRouter)

app.get('/:hash', (req, res) => {
    const hash = req.params.hash

    Bookmark.findOne({ hashed_url: hash })
        .then((bookmark) => {
            // console.log(bookmark)
            var agent = useragent.parse(req.headers['user-agent']);
            const clicked = {
                "clicked": `${date}`,
                "ip": req.connection.remoteAddress,
                "browser": agent.toAgent(),
                "os": agent.os.toString(),
                "device": agent.device.toString()
            }
            res.redirect('http://' + bookmark.original_url)
            console.log(bookmark)
            Bookmark.findByIdAndUpdate(bookmark._id, { $push: { click: clicked } }, { 'new': true })
                .then(() => {
                    console.log("Updated successfully")
                })
                .catch((err) => {
                    console.log(err);

                })


        })
        .catch((err) => {
            res.send(err)
        })

})


app.get('/', (req, res) => {
    res.send('WELCOME TO URL SHORTNER')
})




