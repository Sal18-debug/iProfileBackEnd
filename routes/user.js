const express = require("express")
const router = express.Router()


router.get('/loginId', (req, res) => {
    console.log('hit')
    res.send("hi")
})

router.post("/register", (req, res) => {
    var { name, email, password, balance } = req.body.user
  
    //hash password
    bcrypt.hash(password, saltRounds, function (err, hash) {
      let hashedPassword = hash
  
      //create a user using the payload and hashed password
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        balance: balance,
      })
  
      User.find({ email: user.email }, (err, emails) => {
        //if user already exists in database
        if (emails.length) {
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