var mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({
    loginId: String,
    title: String,
    category: String,
    projectUrl: String,
    startDate: Date,
    endDate: Date,
    description: String,
    major: String,
    category: String,
    contributors: [String]
})

module.exports = mongoose.model("Project", projectSchema)
