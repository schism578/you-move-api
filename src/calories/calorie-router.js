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

calorieRouter
  .route('/:calories_id')
  .all(requireAuth)
  .all((req, res, next) => {
    caloriesService.getById(
      req.app.get('db'),
      req.params.calories_id
    )
      .then(calories => {
        if (!calories) {
          return res.status(404).json({
            error: { message: `Calories don't exist` }
          })
        }
        res.calories = calories
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeCalories(res.calories))
  })
  .delete((req, res, next) => {
    calorieService.deleteCalories(
      req.app.get('db'),
      req.params.calories_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { calories, date } = req.body
    const caloriesToUpdate = { calories, date }

    const numberOfValues = Object.values(caloriesToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'calories' or 'modified date'`
        }
      })

    caloriesService.updateCalories(
      req.app.get('db'),
      req.params.calories_id,
      caloriesToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = calorieRouter