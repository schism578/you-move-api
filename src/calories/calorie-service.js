const calorieService = {
    getCalories(knex) {
        return knex
            .select('*')
            .from('calories');
    },

    insertCalories(knex, newCalories) {
        return knex
            .insert(newCalories)
            .into('calories')
            .returning('*')
            .then(rows => rows[0]);
    },

    getById(knex, id) {
        return knex
            .from('calories')
            .select('*')
            .where('calories_id', id)
            .first();
    },

    deleteCalories(knex, id) {
        return knex('calories')
            .where('calories_id', id)
            .delete();
    },

    updateCalories(knex, id, newCalories) {
        return knex('calories')
            .where('calories_id', id)
            .update(newCalories);
    },

    getAllCalories(knex, user_id) {
        return knex
            .select('*')
            .from('calories')
            .where('user_id', user_id)
    }
};

module.exports = calorieService;