const { query } = require('../postgres');

const getMedicoByCrm = async (crm, uf) => {
    return await query(
        'SELECT * FROM medicos WHERE crm = $1 AND uf = $2',
        [crm, uf]
    );
};

const insertMedico = async (medico) => {
    const dbResponse = await query(
        'INSERT INTO medicos (crm, uf, nome) VALUES ($1, $2, $3) RETURNING ID',
        [medico.crm, medico.uf, medico.nome]
    );

    if (dbResponse instanceof Error)
        console.error(dbResponse);
    return dbResponse;
};

module.exports = {
    getMedicoByCrm,
    insertMedico
};