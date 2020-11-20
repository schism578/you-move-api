const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Users Endpoints', function() {
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

    describe(`POST /user`, () => {
        context(`User Validation`, () => {
        beforeEach('insert users', () =>
            helpers.seedUsers(
            db,
            testUsers,
            )
        )

        const requiredFields = ['email', 'password', 'first_name', 'last_name']

        requiredFields.forEach(field => {
            const registerAttemptBody = {
            email: 'test email',
            password: 'test password',
            first_name: 'test first_name',
            last_name: 'test last_name',
            gender: 'test gender',
            height: 'test height',
            weight: 'test weight',
            age: 'test age',
            bmr: 'test bmr',
            }

            it(`responds with 400 required error when '${field}' is missing`, () => {
            delete registerAttemptBody[field]

            return supertest(app)
                .post('/user')
                .send(registerAttemptBody)
                .expect(400, {
                error: `Missing '${field}' in request body`,
                })
            })
            it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
                const userShortPassword = {
                    email: 'test email',
                    password: '1234567',
                    first_name: 'test first_name',
                    last_name: 'test last_name',
                    gender: 'test gender',
                    height: 'test height',
                    weight: 'test weight',
                    age: 'test age',
                    bmr: 'test bmr',
                }
                return supertest(app)
                .post('/user')
                .send(userShortPassword)
                .expect(400, { error: `Password must be longer than 8 characters` })
            })
            it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
                const userLongPassword = {
                    email: 'test email',
                    password: '*'.repeat(73),
                    first_name: 'test first_name',
                    last_name: 'test last_name',
                    gender: 'test gender',
                    height: 'test height',
                    weight: 'test weight',
                    age: 'test age',
                    bmr: 'test bmr',
                }
                // console.log(userLongPassword)
                // console.log(userLongPassword.password.length)
                return supertest(app)
                    .post('/user')
                    .send(userLongPassword)
                    .expect(400, { error: `Password must be less than 72 characters` })
            })
            it(`responds 400 error when password starts with spaces`, () => {
                const userPasswordStartsSpaces = {
                    email: 'test email',
                    password: ' 1Aa!2Bb@',
                    first_name: 'test first_name',
                    last_name: 'test last_name',
                    gender: 'test gender',
                    height: 'test height',
                    weight: 'test weight',
                    age: 'test age',
                    bmr: 'test bmr',
                }
                return supertest(app)
                    .post('/user')
                    .send(userPasswordStartsSpaces)
                    .expect(400, { error: `Password must not start or end with empty spaces` })
            })
            it(`responds 400 error when password ends with spaces`, () => {
                const userPasswordEndsSpaces = {
                    email: 'test email',
                    password: '1Aa!2Bb@ ',
                    first_name: 'test first_name',
                    last_name: 'test last_name',
                    gender: 'test gender',
                    height: 'test height',
                    weight: 'test weight',
                    age: 'test age',
                    bmr: 'test bmr',
                }
                return supertest(app)
                    .post('/user')
                    .send(userPasswordEndsSpaces)
                    .expect(400, { error: `Password must not start or end with empty spaces` })
            })
            it(`responds 400 error when password isn't complex enough`, () => {
                const userPasswordNotComplex = {
                    email: 'test email',
                    password: '11AAaabb',
                    first_name: 'test first_name',
                    last_name: 'test last_name',
                    gender: 'test gender',
                    height: 'test height',
                    weight: 'test weight',
                    age: 'test age',
                    bmr: 'test bmr',
                }
                return supertest(app)
                  .post('/user')
                  .send(userPasswordNotComplex)
                  .expect(400, { error: `Password must contain one upper case, lower case, number and special character` })
              })
        
              it(`responds 400 'Email already taken' when email isn't unique`, () => {
                const duplicateUser = {
                    email: testUser.email,
                    password: '11AAaa!!',
                    first_name: 'test first_name',
                    last_name: 'test last_name',
                    gender: 'test gender',
                    height: 'test height',
                    weight: 'test weight',
                    age: 'test age',
                    bmr: 'test bmr',
                }
                return supertest(app)
                  .post('/user')
                  .send(duplicateUser)
                  .expect(400, { error: `Email already taken` })
              })
            })
        
            context(`Happy path`, () => {
              it(`responds 201, serialized user, storing bcryped password`, () => {
                const newUser = {
                    email: 'test email',
                    password: '1Aa!2Bb@',
                    first_name: 'test first_name',
                    last_name: 'test last_name',
                    gender: 'test gender',
                    height: 'test height',
                    weight: 'test weight',
                    age: 'test age',
                    bmr: 'test bmr',
                }
                return supertest(app)
                  .post('/user')
                  .send(newUser)
                  .expect(201)
                  .expect(res => {
                    expect(res.body).to.have.property('user_id')
                    expect(res.body.email).to.eql(newUser.email)
                    expect(res.body.first_name).to.eql(newUser.first_name)
                    expect(res.body.last_name).to.eql(newUser.last_name)
                    expect(res.body).to.not.have.property('password')
                    expect(res.headers.location).to.eql(`/user/${res.body.user_id}`)
                    const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                    const actualDate = new Date(res.body.date_created).toLocaleString()
                    expect(actualDate).to.eql(expectedDate)
                  })
                  .expect(res =>
                    db
                      .from('user_profile')
                      .select('*')
                      .where({ user_id: res.body.user_id })
                      .first()
                      .then(row => {
                        expect(row.email).to.eql(newUser.email)
                        expect(row.first_name).to.eql(newUser.first_name)
                        expect(row.last_name).to.eql(newUser.last_name)
                        const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                        const actualDate = new Date(row.date_created).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)
        
                        return bcrypt.compare(newUser.password, row.password)
                      })
                      .then(compareMatch => {
                        expect(compareMatch).to.be.true
                      })
                    )
                })
            })
        })
    })
})