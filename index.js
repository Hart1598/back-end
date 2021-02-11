const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const userRouter = require('./routes/user')
const postRouter = require('./routes/posts')
const app = express()

require('dotenv').config()


const PORT = process.env.PORT || 5000

app.use(express.json())

app.use(cors())

app.use('/api/user',userRouter)
app.use('/api/post', postRouter)

const start = async() => {
    try{
        await mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
        app.listen(PORT, () => console.log(`Server has been started on port: ${PORT}`))
    }
    catch(e){
        console.log(e)
    }
}

start()