INSERT INTO submissions (id, formid, data) VALUES ($1, $2, $3);
UPDATE submissions SET data = $2 WHERE id = $1;
