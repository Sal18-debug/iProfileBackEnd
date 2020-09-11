const express = require("express")
const router = express.Router()
const User = require("../models/User")

//for hashing passwords
const bcrypt = require("bcrypt")
const saltRounds = 10

async function passMatch(user, password) {
    //compares inputted password with hashed password in db
    const match = await bcrypt.compare(password, user.password)
    return match
  }
  
router.get('/loginId', (req, res) => {
    console.log('hit')
    res.send("hi")
})

router.post("/register", (req, res) => {
    console.log(req.body)
    var { loginId, firstName, lastName, password, student} = req.body
    //hash password
    bcrypt.hash(password, saltRounds, function (err, hash) {
      let hashedPassword = hash
  
      //create a user using the payload and hashed password
      const user = new User({
        loginId: loginId,
        firstName: firstName,
        lastName: lastName,
        password: hashedPassword,
        student: student
    })
  
      User.find({ loginId: user.loginId }, (err, users) => {
        //if user already exists in database
        if (users.length) {
          res.send("Email already exists")
        } else {
          //add the user to the db
          user.save((err) => {
            if (err) {
              console.log(err)
            } else {
              console.log("user successfully added: ", user)
              res.send("User successfully added")
            }
          })
        }
      })
    })
  })

module.exports = router;