const {Schema, model} = require('mongoose')

const Post = new Schema({
    title: {
        type: String,
        required: true
    },
    descripton: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    like:{
        type: Array,
        default: []
    },
    creater:{
        type: String,
        required: true
    }
})

module.exports = model('Post', Post)




