SELECT * FROM users WHERE id = $1;
UPDATE users SET settings = $2::jsonb WHERE id = $1;
DELETE FROM users WHERE id = $1;
INSERT INTO users (id, settings) VALUES ($1::character varying(32), $2::jsonb);
