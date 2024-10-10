const express = require("express");
const cartRouter = require("./Routes/CartRoutes")
const userRouter = require("./Routes/UserRoutes")
const productRouter = require("./Routes/ProductRoutes")

const App = express();

App.use(express.json());

App.use(productRouter)
App.use(cartRouter)
App.use(userRouter)



module.exports = App;
