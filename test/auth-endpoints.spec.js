const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Auth Endpoints', function() {
    let db

    const { testUsers } = helpers.makeUsersFixtures()
    const testUser = testUsers[0]

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

    describe(`POST /auth/login`, () => {
        beforeEach('insert users', () =>
            helpers.seedUsers(
                db,
                testUsers,
            )
        )

    const requiredFields = ['email', 'password']

        requiredFields.forEach(field => {
            const loginAttemptBody = {
                email: testUser.email,
                password: testUser.password,
            }

            it(`responds with 400 required error when '${field}' is missing`, () => {
                delete loginAttemptBody[field]

                return supertest(app)
                .post('/auth/login')
                .send(loginAttemptBody)
                .expect(400, {
                    error: `Missing '${field}' in request body`,
                })
            })
        })
            it(`responds 400 'invalid email or password' when bad email`, () => {
                const userInvalidEmail = { email: 'email-not', password: 'existy' }
                return supertest(app)
                .post('/auth/login')
                .send(userInvalidEmail)
                .expect(400, { error: `Incorrect email or password` })
            })
            it(`responds 400 'invalid email or password' when bad password`, () => {
                const userInvalidPass = { email: testUser.email, password: 'incorrect' }
                return supertest(app)
                .post('/auth/login')
                .send(userInvalidPass)
                .expect(400, { error: `Incorrect email or password` })
            })
            it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
                const userValidCreds = {
                  email: testUser.email,
                  password: testUser.password,
                }
                const expectedToken = jwt.sign(
                  { user_id: testUser.user_id },
                  process.env.JWT_SECRET,
                  {
                    subject: `${testUser.email}`,
                    algorithm: 'HS256',
                  }
                )
                return supertest(app)
                  .post('/auth/login')
                  .send(userValidCreds)
                  .expect(200, {
                    authToken: expectedToken,
                  })
              })
    })
})