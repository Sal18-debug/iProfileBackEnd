const express = require("express")
const router = express.Router()
const Comment = require("../models/Comment")

// add comments to a project
// 
// example project id: 5f5bd217da055024a9329a91

router.post("/:projectId/comment", (req, res) => {
    const { projectId } = req.params
    const { email, message } = req.body

    const comment = new Comment({
        email,
        message,
        projectId
    })

    comment.save(err => {
        if(err){
        console.log(err)
        res.send({error: err})
        }else{
            console.log("Comment successfully posted")
            res.send({success: true, message: "Comment successfully posted"})
        }
    })
})

module.exports = router;