const express = require("express")

const productRouter = express.Router()

//ROUTE TO MAKE A NEW PRODUCT
productRouter.post('/api/v1/products', (req, res) => {
    res.status(201).json("Product Created Successfully");
});

//ROUTE TO UPDATE A SPECIFIC PRODUCT
productRouter.put('/api/v1/products/:pid', (req, res) => {
    res.status(200).json("Product Updated Successfully");
});

//ROUTE TO DELETE A SPECIFIC PRODUCT
productRouter.delete('/api/v1/products/:pid', (req, res) => {
    res.status(200).json("Product Deleted Successfully");
});

//ROUTE TO SEARCH FOR PRODUCTS
productRouter.get('/api/v1/products/search', (req, res) => {
    const { query, category, priceMin, priceMax } = req.query;
    res.status(200).json(`Search results for ${query}`);
});

//ROUTES TO GET ALL PRODUCTS
productRouter.get('/api/v1/products/all', (req, res) => {
    res.status(200).json("Route Successful")
})
//ROUTES TO GET A SPECIFIC PRODUCT
productRouter.get('/api/v1/products/:pid', (req, res) => {
    res.status(200).json("Route Successful")
})

module.exports = productRouter