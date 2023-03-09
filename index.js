const app = require('./app')
const connectDB = require('./config/Database')
require('dotenv').config()
require('colors')


// port number
const PORT  = process.env.PORT || 8080


// database configarations
connectDB()




app.listen(PORT, ()=> console.log(`Server listening on- ${PORT}`.yellow))

module.exports = app