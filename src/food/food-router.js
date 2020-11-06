const path = require('path')
const express = require('express')
const foodService = require('./food-service')

const foodRouter = express.Router()
const jsonParser = express.json()

const serializeFood = food => ({
    food_id: food.food_id,
    date: food.date,
    item: food.food_item,
    quantity: food.food_quantity
})

foodRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    foodService.getFood(knexInstance)
      .then(food => {
        res.json(food.map(serializeFood))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { food_id, date, item, quantity } = req.body
    const newFood = { food_id, date, item, quantity }

    for (const [key, value] of Object.entries(newFood))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    foodService.insertFood(
      req.app.get('db'),
      newFood
    )
      .then(food => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${food_id}`))
          .json(serializeFood(food))
      })
      .catch(next)
  })

foodRouter
  .route('/:food_id')
  .all((req, res, next) => {
    foodService.getById(
      req.app.get('db'),
      req.params.food_id
    )
      .then(food => {
        if (!food) {
          return res.status(404).json({
            error: { message: `Food doesn't exist` }
          })
        }
        res.food = food
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeFood(res.food))
  })
  .delete((req, res, next) => {
    foodService.deleteFood(
      req.app.get('db'),
      req.params.food_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { item, quantity } = req.body
    const foodToUpdate = { item, quantity }

    const numberOfValues = Object.values(foodToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain data`
        }
      })

    foodService.updateFood(
      req.app.get('db'),
      req.params.food_id,
      foodToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = foodRouter