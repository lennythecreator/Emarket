const express = require("express");

const cartRouter = express.Router();

//ROUTES TO FETCH ALL THE PRODUCTS FROM THE CART
cartRouter.get("/api/v1/cart", (req, res) => {
  res.status(200).json("See all the items in the cart");
});

//ROUTES TO ADD A PRODUCT TO THE CART
cartRouter.post("/api/v1/cart/:pid", (req, res) => {
  res.status(200).json("Route Successful");
});

//ROUTE TO DELETE A PRODUCT FROM CART
cartRouter.delete('/api/v1/cart/:pid', (req, res) => {
    res.status(200).json("Product Removed From Cart Successfully");
});

// ROUTE TO UPDATE THE QUANTITY OF AN ITEM IN THE CART
cartRouter.put('/api/v1/cart/:pid', (req, res) => {
    res.status(200).json("Cart Updated Successfully");
});



module.exports = cartRouter;
