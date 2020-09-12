var mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message"}],
    email: String,
    interlocutorEmail: String
})

const messageSchema = new mongoose.Schema({
    email: String,
    author: [{type: mongoose.Schema.ObjectId, ref:'Chat'}],
    text: String,
    timestamp: {
        type: Date,
        default: Date.now()
    },
    firstName: String,
    lastName: String,
    imageUrl: String
})

const Chat = mongoose.model("Chat", chatSchema)
const Message = mongoose.model("Message", messageSchema)

module.exports = {
    Chat,
    Message
}
