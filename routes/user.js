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

// register a user
// http://localhost:5000/user/register
router.post("/register", (req, res) => {
  const { loginId, firstName, lastName, password, student } = req.body
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


// user login
// http://localhost:5000/user/login
// body: {loginId, password}
router.get("/login", (req, res) => {
  const { loginId, password } = req.body

  //find user with given email in the database
  User.findOne({ loginId: loginId }, async (err, user) => {
    //no user in database has specified email
    if (!user) {
      res.send("User does not exist")
    } else {
      //email exists but incorrect password
      let match = await passMatch(user, password)
      if (!match) {
        console.log("email exists but incorrect password")
        res.send("email exists but incorrect password")
      } else {
        //email and passwords match
        console.log("Success: email and password match")
        res.send("Success: email and password match")
      }
    }
  })
})


module.exports = router;