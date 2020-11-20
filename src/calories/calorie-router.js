const path = require('path')
const express = require('express')
const calorieService = require('./calorie-service')
const { requireAuth } = require('../middleware/jwt-auth')

const calorieRouter = express.Router()
const jsonParser = express.json()

const serializeCalories = calories => ({
  id: calories.calories_id,
  date: calories.date,
  calories: calories.calories,
  userId: calories.user_id,
})

calorieRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    calorieService.getAllCalories(knexInstance)
      .then(calories => {
        res.json(calories.map(serializeCalories))
      })
      .catch(next)
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { id, date, calories, userId } = req.body
    const newCalories = { calories_id: id, calories, user_id: userId }

    for (const [key, value] of Object.entries(newCalories))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    newCalories.user_id = req.user.id;
    newCalories.date = date;

    calorieService.insertCalories(
      req.app.get('db'),
      newCalories
    )
      .then(calories => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${calories.calories_id}`))
          .json(serializeCalories(calories))
      })
      .catch(next)
  })

module.exports = calorieRouter