const userService = {
    getUser(knex) {
        return knex
            .select('*')
            .from('user');
    },

    insertUser(knex, newUser) {
        return knex
            .insert(newUser)
            .into('user')
            .returning('*')
            .then(rows => rows[0]);
    },

    getById(knex, id) {
        return knex
            .from('user')
            .select('*')
            .where('user_id', id)
            .first();
    },

    deleteUser(knex, id) {
        return knex('user')
            .where('user_id', id)
            .delete();
    },

    updateUser(knex, id, newUser) {
        return knex('user')
            .where('user_id', id)
            .update(newUser);
    }
};

module.exports = userService;