const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const GenerateToken = require('../utility/generateToken')
const GeneraterefreshToken = require('../utility/refreshToken')

// Create a new user
exports.createUser = asyncHandler(async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req?.body

        if (!firstName || !lastName || !email || !phone || !password) {
            res.status(400).json({ message: 'Pls! Proper form full filled.' })
        } else {
            const userExists = await User.findOne({ email })
            if (userExists) {
                throw new Error('User already exists')
            } else {
                const user = new User({ firstName, lastName, email, phone, password })
                await user.save()
                res.status(201).json({ message: 'User create successfully' })
            }

        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message || 'Internal Server Error' })
    }
})


// User find by email
exports.getUserLogin = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req?.body

        if (!email) {
            res.status(400).json({ message: 'Pls! Proper form full filled.' })
        } else {
            const user = await User.findOne({ email })
            const refreshToken = await GeneraterefreshToken(user?._id)
            await User.findByIdAndUpdate(
                user.id,
                {
                    refreshToken: refreshToken
                },
                {
                    new: true
                }
            )
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 70 * 60 * 60 * 1000
            })
            if (user && await user.isPasswordMatched(password)) {

                res.status(200).json({ message: 'User Login successfully', token: GenerateToken(user?._id) })
            } else {
                throw new Error('Invalied Credentials')
            }
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message || 'Internal Server Error' })
    }
})



exports.getUser = asyncHandler(async (req, res) => {
    try {
        const data = await User.findOne(req.user?._id, { firstName: 1, lastName: 1, email: 1, phone: 1 })
        res.status(200).json(data)

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message || 'Internal Server Error' })
    }
})



exports.userUpdate = asyncHandler(async (req, res) => {
    try {
        const { firstName, lastName, phone } = req?.body
        const user = await User.aggregate([{ $match: { _id: req.user?._id } }])
        if (user.length === 1) {
            await User.findByIdAndUpdate(req.user?._id, { $set: { firstName, lastName, phone } })
            res.status(200).json({ message: 'User update successfully' })
        } else {
            res.status(404).json({ message: 'User update Fail' })
        }


    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message || 'Internal Server Error' })
    }
})


exports.userDelete = asyncHandler(async (req, res) => {
    console.log(req.user)
    try {
        const user = await User.aggregate([{ $match: { _id: req.user?._id } }])
        if (user.length === 1) {
            await User.findByIdAndDelete(req.user?._id)
            res.status(200).json({ message: 'User delete successfully' })
        } else {
            res.status(404).json({ message: 'User delete Fail' })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message || 'Internal Server Error' })
    }
})


exports.userBlock = asyncHandler(async (req, res) => {
    console.log(req.user)
    try {
        const user = await User.aggregate([{ $match: { _id: req.user?._id } }])
        if (user.length === 1) {
            await User.findByIdAndUpdate(req.user?._id, { $set: { isBlocked: true } })
            res.status(200).json({ message: 'User block successfully' })
        } else {
            res.status(404).json({ message: 'User block Fail' })
        }


    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message || 'Internal Server Error' })
    }
})



exports.userunBlock = asyncHandler(async (req, res) => {
    console.log(req.user)
    try {
        const user = await User.aggregate([{ $match: { _id: req.user?._id } }])
        if (user.length === 1) {
            await User.findByIdAndUpdate(req.user?._id, { $set: { isBlocked: false } })
            res.status(200).json({ message: 'User unblock successfully' })
        } else {
            res.status(404).json({ message: 'User unblock Fail' })
        }


    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message || 'Internal Server Error' })
    }
})





exports.getallUser = asyncHandler(async (req, res) => {
    try {
        const isAdmin = await User.aggregate([{ $match: { _id: req.user?._id, role: 'admin' } }])
        if (isAdmin.length === 1) {
            const user = await User.find()
            res.status(200).json(user)
        } else {
            res.status(404).json({ message: 'You are not an admin' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message || 'Internal Server Error' })
    }
})



exports.hendleRefreshToken = asyncHandler(async (req, res) => {
    try {
        const cookies = req.cookies
        if(!cookies.refreshToken) throw new Error('No Refresh Token found');
        const refreshToken = req.cookies.refreshToken
        const user = await User.findOne({ refreshToken})
        res.status(200).json(user)

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message || 'Internal Server Error' })

    }
})
