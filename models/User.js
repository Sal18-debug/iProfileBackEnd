var mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    loginId: String,
    firstName: String,
    lastName: String,
    password: String,
    student: Boolean // student or recruiter
})

module.exports = mongoose.model('User', userSchema)