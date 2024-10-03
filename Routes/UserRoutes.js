const express = require("express")

const userRouter = express.Router()

userRouter.get('/api/v1/user/:uid', (req, res) => {
    res.status(200).json("Route Successful")
})

module.exports = userRouter