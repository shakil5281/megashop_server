const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')

const connectDB = asyncHandler(async (req, res) =>{
    try {
       await mongoose.connect(process.env.URL)
        console.log('Database connected'.cyan)

    }catch(err){
        console.error(err.message)
        new Error(err.message)
    }
})

module.exports = connectDB