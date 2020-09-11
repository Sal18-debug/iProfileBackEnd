var mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    email: String,
    message: String,
    timeStamp: {
        type: Date,
        value: Date.now()
    },
    projectId: String
})

module.exports = mongoose.model("Comment", commentSchema)
