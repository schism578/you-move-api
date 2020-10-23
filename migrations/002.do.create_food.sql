CREATE TABLE food (
    date TIMESTAMPTZ DEFAULT now() NOT NULL,
    food_item TEXT,
    food_quantity TEXT
)