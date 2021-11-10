const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const connect = () => {
    return pool.connect((err) => {
        if (err) throw err;
    });
};

const query = async (query: string, values?: Array<string|number>) => {
    return await pool
        .query(query, values)
        .then((res) => {
            return res.rows;
        })
        .catch((err) => {
            return err;
        });
};

module.exports = {
    connect, query
};