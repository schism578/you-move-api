CREATE TABLE food (
    food_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    date TIMESTAMPTZ DEFAULT now() NOT NULL,
    food_item TEXT,
    food_quantity TEXT
);