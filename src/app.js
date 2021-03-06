require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
//const logger = require('./logger');
const { NODE_ENV } = require('./config');
const userRouter = require('./user/user-router');
const calorieRouter = require('./calories/calorie-router');
const authRouter = require('./auth/auth-router');

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
    
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/log', calorieRouter)


/*app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        logger.error(`Unauthorized request to path: ${req.path}`);
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
})*/

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        console.error(error)
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
});

module.exports = app