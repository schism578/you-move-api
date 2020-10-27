CREATE TABLE user_profile (
    user_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    gender TEXT NOT NULL,
    height INTEGER NOT NULL,
    weight INTEGER NOT NULL,
    age INTEGER NOT NULL,
    bmr INTEGER NOT NULL
);