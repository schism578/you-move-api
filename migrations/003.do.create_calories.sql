CREATE TABLE calories (
    date TIMESTAMPTZ DEFAULT now() NOT NULL,
    calories INTEGER NOT NULL
)