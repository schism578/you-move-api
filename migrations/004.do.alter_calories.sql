ALTER TABLE calories
    ADD COLUMN calories_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    ADD COLUMN food_id INTEGER REFERENCES food(food_id) ON DELETE CASCADE NOT NULL