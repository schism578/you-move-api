const path = require('path')
const express = require('express')
const userService = require('./user-service')

const userRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    password: user.password,
    gender: user.gender,
    height: user.height,
    weight: user.weight,
    age: user.age,
    bmr: user.bmr
})

userRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    userService.getUser(knexInstance)
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
          error: { message: `Missing '${key}' in request body` }
        })

    userService.insertUser(
      req.app.get('db'),
      newUser
    )
      .then(user => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.user_id}`))
          .json(serializeUser(user))
      })
      .catch(next)
  })

userRouter
  .route('/:user_id')
  .all((req, res, next) => {
    userService.getById(
      req.app.get('db'),
      req.params.user.user_id
    )
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: { message: `User doesn't exist` }
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
    userService.deleteUser(
      req.app.get('db'),
      req.params.user.user_id
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
        error: {
          message: `Request body must contain data`
        }
      })

    userService.updateUser(
      req.app.get('db'),
      req.params.user.user_id,
      userToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = userRouter