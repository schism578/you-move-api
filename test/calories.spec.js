const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Calories Endpoints', function () {
    let db

    const { testCalories } = helpers.makeCaloriesFixtures()
    const testCalorie = testCalories[0]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /log/:user_id`, () => {
        context(`User Validation`, () => {
            beforeEach('insert calories', () =>
                helpers.seedCalories(
                    db,
                    testCalories,
                )
            )

            const requiredFields = ['user_id', 'calories']

            requiredFields.forEach(field => {
                const registerAttemptBody = {
                    user_id: 'test userId',
                    calories: 'test calories',
                }
                it(`responds with 400 required error when '${field}' is missing`, () => {
                    delete registerAttemptBody[field]

                    return supertest(app)
                        .post('/log/:user_id')
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing '${field}' in request body`,
                        })
                })
            })
            it(`responds 201 and calories stored with user_id present`, () => {
                const userValidCreds = {
                    user_id: testCalorie.user_id,
                    calories: testCalorie.calories,
                }
                return supertest(app)
                    .post('/log/:user_id')
                    .send(userValidCreds)
                    .expect(201, {
                        calories: testCalorie.calories,
                    })
            })
        })
    })
})
