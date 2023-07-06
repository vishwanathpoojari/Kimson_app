const { pool } = require('../database/config');

module.exports = {
    addFilter: (filter, query, noPrint) => {
        let filterValues = [];
        let queryString;
        try {
            if (typeof query === 'object') { queryString = query.query; filterValues = query.values; }
            else queryString = query;

            if (Object.entries(filter).length !== 0 && filter.constructor === Object) {
                let keys = Object.keys(filter);
                keys.forEach((key, i) => {
                    let values = filter[key];
                    let valuesLength = filterValues.length;
                    if (values) {
                        if (i > 0) queryString += ` AND `
                        else queryString += ` WHERE `

                        let array = /\[(.*)\]/;
                        if (array.test(values)) {
                            values = values.match(array)[1];
                            if (/^\d+$/.test(values)) values = parseInt(values);
                            queryString += `$${valuesLength + 1} = ANY(${key})`; filterValues.push(values);
                        }
                        else if (values.includes(',')) {
                            queryString += `${key} IN (`
                            values.split(',').forEach((value, i) => {
                                queryString += `${i > 0 ? `,` : ``}$${valuesLength + 1}`;
                                filterValues.push(value);
                                valuesLength = filterValues.length;
                            })
                            queryString += `)`
                        }
                        else { queryString += `${key} IN ($${valuesLength + 1})`; filterValues.push(values); }
                    };
                })
            }
        }
        catch (error) {
            console.log('Add filter error:', error);
        }
        // if (!noPrint) console.log('Query: ' + query);
        return { query: queryString, values: filterValues };
    },


    genInsertQ: (table, columns, data) => {
        let values = [];
        let query = `INSERT INTO ${table}(${columns.join(',')}) VALUES(${columns.map((col, i) => `$${i + 1}`).join(',')})`;
        columns.forEach(col => values.push(data[col]));
        return { query: query, values: values };
    },

    genInsertFullQ: (table,columns, data) => {
        let values = [];
        columns.forEach(col => values.push(data[col]));
        console.log('val',values)
        let query = `INSERT INTO ${table}(${columns.join(',')}) VALUES(${values})`;
        return { query: query};
    },

    genUpdateQ: (table, data) => {
        let query = `UPDATE ${table} SET`;
        let values = [];
        Object.keys(data).forEach((key, i) => {
            query += `${i > 0 ? `, ` : ``} ${key} = $${i + 1}`
            values.push(data[key]);
        });
        return { query: query, values: values };
    },

    db: async (querys) => {
        //console.log('querys',querys)
        const client = await pool.connect()
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    //await pool.query('BEGIN');
                    if (!Array.isArray(querys)) querys = [querys];
                    let res;
                    for (let query of querys) {
                        console.log('here I am',query.query ,'and values',query.values)
                        res = await client.query(query.query, query.values);
                    }
                    //console.log('res',res)
                    //await pool.query('COMMIT');
                    resolve(res['recordset']);
                } catch (err) {
                    //await pool.query('ROLLBACK');
                    reject(err);
                }
            })();
        });
    },

    cleanInput: (data) => {
        Object.keys(data).forEach(key => {
            data[key] = exports.subClean(data[key]);
        })
        return data;
    },

    subClean: (input) => {
        if (['boolean', 'object'].includes(typeof input)) return input;
        else if (!input) return null;
        else if (isNaN(input)) return `${input.replace(/'/g, '')}`;
        else return `${input}`;
    },


    async insertIntoTable(querys){
        const client = await pool.connect()
        const res = await client.query('SELECT GETDATE()');                          
        console.log('DB Connected!', res.recordset[0]);
    }
}