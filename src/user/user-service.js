const bcrypt = require('bcryptjs');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UserService = {
    getUser(knex) {
        return knex
            .select('*')
            .from('user_profile');
    },

    hasUserWithEmail(db, email) {
        return db('user_profile')
          .where({ email })
          .first()
          .then(user => !!user)
    },

    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },

    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('user_profile')
            .returning('*')
            .then(([user]) => user)
    },

    validatePassword(password) {
        if (password.length < 8) {
          return 'Password must be longer than 8 characters'
        }
        if (password.length > 72) {
          return 'Password must be less than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
          return 'Password must not start or end with empty spaces'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
          return 'Password must contain one upper case, lower case, number and special character'
        }
        return null
    },

    getById(knex, id) {
        return knex
            .from('user_profile')
            .select('*')
            .where('user_id', id)
            .first();
    },

    deleteUser(knex, id) {
        return knex('user_profile')
            .where('user_id', id)
            .delete();
    },

    updateUser(knex, id, user) {
        return knex('user_profile')
            .where('user_id', id)
            .update(user);
    }
};

module.exports = UserService;