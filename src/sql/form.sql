INSERT INTO forms (id, userid, title, pages, questions, theme, plugins, data) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
SELECT * FROM forms WHERE id = $1;
SELECT * FROM forms WHERE userid = $1;
UPDATE forms SET title = $2, pages = $3, questions = $4, theme = $5, plugins = $6, data = $7 WHERE id = $1;
