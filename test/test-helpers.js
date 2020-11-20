const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
    return [
      {
        user_id: 1,
        first_name: 'test-user-1',
        last_name: 'Test user 1',
        email: 'TU1',
        password: 'password',
        gender: 'male',
        height: '68',
        weight: '200',
        age: '45',
        bmr: '2000'
      },
      {
        user_id: 2,
        first_name: 'test-user-2',
        last_name: 'Test user 2',
        email: 'TU2',
        password: 'password',
        gender: 'female',
        height: '62',
        weight: '130',
        age: '30',
        bmr: '2000'
      },
      {
        user_id: 3,
        first_name: 'test-user-3',
        last_name: 'Test user 3',
        email: 'TU3',
        password: 'password',
        gender: 'female',
        height: '65',
        weight: '160',
        age: '35',
        bmr: '2000'
      },
      {
        user_id: 4,
        first_name: 'test-user-4',
        last_name: 'Test user 4',
        email: 'TU4',
        password: 'password',
        gender: 'male',
        height: '72',
        weight: '230',
        age: '40',
        bmr: '2000'
      },
    ]
  }
  
  function makeUsersFixtures() {
    const testUsers = makeUsersArray();
    return { testUsers }
  }
  
  function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
        `TRUNCATE
          user_profile
        `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE user_profile_user_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('user_profile_user_id_seq', 0)`),
        ])
      )
    )
  }
  
  function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('user_profile').insert(preppedUsers)
      .then(() =>
        // update the auto sequence to stay in sync
        db.raw(
          `SELECT setval('user_profile_user_id_seq', ?)`,
          [users[users.length - 1].user_id],
        )
      )
  }
  
  function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
      const token = jwt.sign({ user_id: user.user_id }, secret, {
        subject: user.email,
        algorithm: 'HS256',
      })
      return `Bearer ${token}`
  }
    
  module.exports = {
    makeUsersArray,
    makeUsersFixtures,
    cleanTables,
    seedUsers,
    makeAuthHeader
  }