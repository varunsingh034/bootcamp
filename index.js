const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const {router : authRoutes, authenticateJWT} = require( './auth' );
const cartRoutes =  require('./cart');
app.use(authRoutes);
app.use(cartRoutes);

mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(function(){
        console.log('Connected to MongoDB')
});

app.get('/products', async(req,res)=>{
    try{
        const products = await Product.find({});
        res.json(products);

    }catch(error){
        res.status(500).json({error:'Internal server error'});
    }
})

app.get('/product/:id',async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({
                message: "The item that you were searching for daes not exist"
            })
        }else{
            res.json(product);
        }
    }catch(error){
        res.status(500).json({
            error: 'Server error'
        })
    }
})

app.listen(5500,function(){
    console.log('Server is running on port 5500')
})