const express = require("express")
const router = express.Router()
const User = require("../models/User")

//for hashing passwords
const bcrypt = require("bcrypt")
const Profile = require("../models/Profile")
const Project = require("../models/Project")
const saltRounds = 10

async function passMatch(user, password) {
  //compares inputted password with hashed password in db
  const match = await bcrypt.compare(password, user.password)
  return match
}

router.get('/email', (req, res) => {
  console.log('hit')
  res.send("hi")
})

// register a user
// http://localhost:5000/user/register
router.post("/register", (req, res) => {

  const { email, firstName, lastName, password, student } = req.body
  console.log('body', req.body)
  //hash password
  bcrypt.hash(password, saltRounds, function (err, hash) {
    let hashedPassword = hash

    //create a user using the payload and hashed password
    const user = new User({
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: hashedPassword,
      student: student
    })

    User.find({ email: user.email }, (err, users) => {
      //if user already exists in database
      if (users.length > 0) {
        console.log('users :', user.email, users)
        res.send({success: false, message: "Email already exists"})
      } else {
        //add the user to the db
        user.save((err) => {
          if (err) {
            console.log(err)
            res.send({
              success: false,
              error: err
            })
          } else {
            console.log("user successfully added: ", user)
            res.send({
              success: true,
              message: "user successfully added"
            })
          }
        })
      }
    })
  })
})


async function passMatch(user, password) {
  //compares inputted password with hashed password in db
  const match = await bcrypt.compare(password, user.password)
  return match
}

// user login
// http://localhost:5000/user/login
// body: {email, password}
router.get("/login", (req, res) => {
  const { email, password } = req.query
  console.log('body', email, password)
  //find user with given email in the database
  User.findOne({ email: email }, async (err, user) => {
    //no user in database has specified email
    if (!user) {
      res.send({success: false, message: "User does not exist"})
    } else {
      //email exists but incorrect password
      let match = await passMatch(user, password)
      if (!match) {
        console.log("email exists but incorrect password")
        res.send({success: false, message: "Email exists but incorrect password"})
      } else {
        //email and passwords match
        console.log("Success: email and password match")
        res.send({success: true, message: "Successful login"})
      }
    }
  })
})

// create user profile
router.post('/email/:email/profile', (req, res) => {
  const { lastName, firstName, dateOfBirth, university,
    graduationDate, imageUrl, major, profileAvaliableToRecruiter,
    recieveMessageFromRecruiters } = req.body

  const { email } = req.params.email
  //create new profile
  const userProfile = new Profile({
    email, lastName, firstName, dateOfBirth, university,
    graduationDate, imageUrl, major, profileAvaliableToRecruiter,
    recieveMessageFromRecruiters
  })

  Profile.findOne({ email: email }, async (err, profile) => {
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
// http://localhost:5000/user/email/:email/profile
router.get('/email/:email/profile', async (req, res) => {
  var { email } = req.params
  //find profile with given email
  Profile.findOne({ email: req.params.email }, async (err, profile) => {
    if (profile) {
      res.send(profile)
    } else {
      res.send({ error: `Profile does not exist for ${email}` })
    }
  })
})

// create user project
// http://localhost:5000/user/email/:email/project
router.post('/email/:email/project', async (req, res) => {
  let { email } = req.params
  let { title, category, projectUrl, startDate, endDate, description,
    contributors } = req.body

  let project = new Project({
    email,
    title,
    category,
    projectUrl,
    startDate,
    endDate,
    description,
    contributors
  })

  project.save(err => {
    if (err) {
      res.send({
        success: false,
        error: err
      })
    } else {
      res.send({ success: true, msg: "User project successfully added" })
    }
  })
})

// get all projects created by user
// http://localhost:5000/user/email/:email/projects
router.get('/email/:email/projects', (req, res) => {
  let { email } = req.params
  Project.find({ email: email }, (err, projects) => {
    if (err) {
      res.send({ success: false, error: err })
    } else {
      res.send({ success: true, projects: projects })
    }
  })
})



module.exports = router;