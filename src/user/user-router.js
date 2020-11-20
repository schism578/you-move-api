const path = require('path')
const express = require('express')
const UserService = require('./user-service')
const xss = require('xss')
const { requireAuth } = require('../middleware/jwt-auth')


const userRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
    user_id: user.user_id,
    first_name: xss(user.first_name),
    last_name: xss(user.last_name),
    email: xss(user.email),
    password: user.password,
    gender: xss(user.gender),
    height: xss(user.height),
    weight: xss(user.weight),
    age: xss(user.age),
    bmr: xss(user.bmr),
})

userRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    UserService.getUser(knexInstance)
      .then(user => {
        res.json(user.map(serializeUser))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { first_name, last_name, email, password, gender, height, weight, age, bmr } = req.body
    const newUser = { first_name, last_name, email, password, gender, height, weight, age, bmr }

    for (const [key, value] of Object.entries(newUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
        
      const passwordError = UserService.validatePassword(password)

      if (passwordError)
        return res.status(400).json({ error: passwordError })
    
        UserService.hasUserWithEmail(
          req.app.get('db'),
          email
        )
        .then(hasUserWithEmail => {
            if (hasUserWithEmail)
              return res.status(400).json({ error: `Email already taken` })
            res.send('ok')
            .catch(next)

        return UserService.hashPassword(password)
        .then(hashedPassword => {
          newUser.password = hashedPassword
          
        return UserService.insertUser(
            req.app.get('db'),
            newUser
        )
        .then(user => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${user.user_id}`))
            .json(serializeUser(user))
        })
        })
        })
        .catch(next)
    })


userRouter
  .route('/:user_id')
  .all(requireAuth)
  .all((req, res, next) => {
    UserService.getById(
      req.app.get('db'),
      req.params.user_id
    )
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: `User doesn't exist`
          })
        }
        res.user = user
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeUser(res.user))
  })
  .delete((req, res, next) => {
    UserService.deleteUser(
      req.app.get('db'),
      req.params.user_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { email, password, height, weight, age, bmr } = req.body
    const userToUpdate = { email, password, height, weight, age, bmr }

    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: `Request body must contain data`
      })

    UserService.updateUser(
      req.app.get('db'),
      req.params.user_id,
      userToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = userRouter