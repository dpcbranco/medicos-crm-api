import { query } from '../postgres';
import { UF } from '../types/UF';

export const getMedicoByCrm = async (crm: number, uf: UF) => {
    return await query(
        'SELECT * FROM medicos WHERE crm = $1 AND uf = $2',
        [crm, uf]
    );
};