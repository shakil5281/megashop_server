const express = require('express');
const userRouter = express.Router()
const userController = require('../controllers/userController')
const {authVerify, isAdmin} = require('../meddleware/AuthVerify')



userRouter.route('/create').post(userController.createUser)
userRouter.route('/login').post(userController.getUserLogin)


userRouter.route('/getuser').get(authVerify, userController.getUser)
userRouter.route('/getalluser').get(authVerify, userController.getallUser)
userRouter.route('/userupdate').post(authVerify, isAdmin, userController.userUpdate)
userRouter.route('/userdelete').get(authVerify, userController.userDelete)


userRouter.route('/userblock').get(authVerify, userController.userBlock)
userRouter.route('/userunblock').get(authVerify, userController.userunBlock)



userRouter.route('/hendleRefresh').get(authVerify, userController.hendleRefreshToken)


userRouter.get('/', (req, res) =>{
    res.send("Hello Megshop")
})

module.exports = userRouter