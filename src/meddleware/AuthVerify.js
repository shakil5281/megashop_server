const bycrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')



const authVerify = asyncHandler(async (req, res, next) => {
    let token
    if (req.headers.authorization &&
        req.headers.authorization?.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (err) {
            console.log(err.message)
            res.status(401)
            throw new Error('Invalid token')
        }
    }
    if (!token) {
        res.status(401)
        throw new Error('Invalid token')
    } 
})


const isAdmin = asyncHandler(async (req, res, next) =>{
    const {email} = req.user;
    const adminUser = await User.findOne({email});
    if(adminUser.role !== 'admin'){
        throw new Error('You are not an administrator');
    }else{
        next()
    }
})


module.exports = {authVerify, isAdmin}