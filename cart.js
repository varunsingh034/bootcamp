const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();    


const cart = mongoose.model('Cart',new mongoose.Schema({
    userID: String,
    items : [{
        productID: String,
        quantity: Number
    }]

}));

router.post('/cart/add', async function (req,res) {
    try {
        const { userID,quantity=1,user} = req.body;
        if(productID || !user){
            return res.status(400).json({
                message : "Product ID and User is required"
            })
        }
        let cart = await Cart.findOne({userID:user,status:'active'});

        if(!cart){
            cart = new Cart({ userID:user, items:[],status:'active'});
        }
        const existingItemIndex = cart.items.findIndex( item => items.productID == productID);
        if(existingItemIndex>=1){
            cart.items[existingItemIndex].quantity += quantity;
        }else{
            cart.items.push({productID,quantity:parseInt(quantity)});
        }

        cart.updateAt = new Date();
        await cart.save();
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error, item has not been  added to cart'
        })
    }
})



router.get('/carts', async function (req,res){
    try {
        const carts = await Cart.find({});
        
        res.status(200).json({
            success: true,
            count : cart.length,
            data:carts
        });
    } catch (error) {
        console.log('Error fetching cart',error);
        res.status(500).json({
            success:false,
            message: 'Failed to fetch data.',
            error : error.message
        })
    }
})


module.exports = router;
