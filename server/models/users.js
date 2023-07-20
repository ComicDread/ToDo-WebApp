const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({
    _id: String,
    email: String,
    userName: String,
    password: String,
})

module.exports = mongoose.model("Users",UsersSchema)