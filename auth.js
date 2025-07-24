const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();



const User = mongoose.model(
    'User',
    new mongoose.Schema({
        email:String,
        password: String,
    })
)

// signup router

router.post('/auth/signup',async function (req,res){
    const {email,password} = req.body;
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            error: 'User already exists'
        })
    }
    const hashPassword = await bcrypt.hash( password, 10 );
    const user = new User ({
        email,
        password:hashPassword,
    })
    await user.save();
  
    const token = jwt.sign({
        userID:user._id
    },'secret',{expiresIn:'1h'});
    res.status(200).json({token});

})



//// login router

router.post('/auth/login',async function (req,res){
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(user && await bcrypt.compare(password,user.password)){
        const token = jwt.sign({userID:user._id},'secret',{expiresIn:'1h'});
        res.status(200).json({ token });
    }
    else{
        res.status(400).json({error:'Invalid credentials'})
    }
})


/// jwt middleware


function authenticationJWT(req,res,next){
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token,'secret',function(err,user){
            if(err){
                return res.sendStatus(403);
            }
            req.user =user;
            next();
        })
    }
    else{
        res.sendStatus(401);
    }
}


module.exports = {router,authenticationJWT}

