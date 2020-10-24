const foodService = {
    getFood(knex) {
        return knex
            .select('*')
            .from('food');
    },

    insertFood(knex, newFood) {
        return knex
            .insert(newFood)
            .into('food')
            .returning('*')
            .then(rows => rows[0]);
    },

    getById(knex, id) {
        return knex
            .from('food')
            .select('*')
            .where('food_id', id)
            .first();
    },

    deleteFood(knex, id) {
        return knex('food')
            .where('food_id', id)
            .delete();
    },

    updateFood(knex, id, newFood) {
        return knex('food')
            .where('food_id', id)
            .update(newFood);
    }
};

module.exports = foodService;