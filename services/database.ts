import { query } from '../postgres';
import { Medico } from '../types/Medico';
import { UF } from '../types/UF';

export const getMedicoByCrm = async (crm: number, uf: UF) => {
    return await query(
        'SELECT * FROM medicos WHERE crm = $1 AND uf = $2',
        [crm, uf]
    );
};

export const insertMedico = async (medico: Medico) => {
    const dbResponse = await query(
        'INSERT INTO medicos (crm, uf, nome) VALUES $1, $2, $3',
        [medico.crm, medico.uf, medico.nome]
    );

    if (dbResponse instanceof Error)
        console.error(dbResponse);
    return dbResponse;
};