var mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({
  loginId: String,
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  university: String,
  graduation: Date,
  imageUrl: String,
  major: String,
  profileAvaliableToRecruiter: {
      type: Boolean,
      default: false
  },
  recieveMessageFromRecruiters: {
      type: Boolean,
      default: false
  }


})

module.exports = mongoose.model("Profile", profileSchema)
