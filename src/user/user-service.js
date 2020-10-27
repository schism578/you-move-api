const userService = {
    getUser(knex) {
        return knex
            .select('*')
            .from('user_profile');
    },

    insertUser(knex, newUser) {
        return knex
            .insert(newUser)
            .into('user_profile')
            .returning('*')
            .then(rows => rows[0]);
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

    updateUser(knex, id, newUser) {
        return knex('user_profile')
            .where('user_id', id)
            .update(newUser);
    }
};

module.exports = userService;