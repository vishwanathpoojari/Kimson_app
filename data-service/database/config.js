// const { Pool } = require('pg');
const sql = require('mssql/msnodesqlv8')


const pool = new sql.ConnectionPool({
connectionTimeout : 30000,
server: "LAPTOP-1ID45OJ1\\SQLEXPRESS",
database: "KimsonDatabase",
driver: "msnodesqlv8",
options: {
    trustedConnection: true,
}
    //connectionString: process.env.NODE_ENV === 'dev' ? process.env.DATABASE_URL : process.env.DATABASE_URL_PROD
});

(async () => {
    const client = await pool.connect()
    try {
        const res = await client.query('SELECT GETDATE()');                          
        console.log('DB Connected!', res.recordset[0]);
    } finally {
        client.release();
    }
})().catch(err => console.log(err.stack));

module.exports = { pool }