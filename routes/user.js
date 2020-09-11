const express = require("express")
const router = express.Router()
const User = require("../models/User")

//for hashing passwords
const bcrypt = require("bcrypt")
const Profile = require("../models/Profile")
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

// create user profile
router.post('/loginId/:loginId/profile', (req, res) => {
  const { lastName, firstName, dateOfBirth, university,
    graduationDate, imageUrl, major, profileAvaliableToRecruiter,
    recieveMessageFromRecruiters } = req.body

  const {loginId} = req.params.loginId
  //create new profile
  const userProfile = new Profile({
    loginId, lastName, firstName, dateOfBirth, university,
    graduationDate, imageUrl, major, profileAvaliableToRecruiter,
    recieveMessageFromRecruiters
  })

  Profile.findOne({ loginId: loginId }, async (err, profile) => {
    if (profile) {
      res.send("Profile already exists")
    } else {
      userProfile.save(err => {
        if (err) {
          console.log(err)
        } else {
          console.log("user profile successfully added")
          res.send("User profile successfully added")
        }
      })
    }
  })
})

// get user profile
// http://localhost:5000/user/loginId/a/profile
router.get('/loginId/:loginId/profile', async (req, res) => {
  var {loginId} = req.params
  //find profile with given loginId
  Profile.findOne({ loginId: req.params.loginId}, async (err, profile) => {
    if (profile){
      res.send(profile)
    }else{
      res.send({error: `Profile does not exist for ${loginId}`})
    }
  })
})

module.exports = router;