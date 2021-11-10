import { getMedicoByCrm } from '../services/database';
import { UF } from '../types/UF';
import { Request, Response } from 'express';
import { ApiError } from '../types/ApiError';
import { Medico } from '../types/Medico';

export const getMedico = async (
    req: Request,
    res: Response
): Promise<Response<ApiError|Medico>> => {
    if (!UF[req.params.uf])
        return res.status(400).send({ error: 'UF inválida' });
    if (isNaN(Number(req.params.crm)))
        return res.status(400).send({ error: 'CRM inválido' });
    
    const dbResponse = await getMedicoByCrm(
        Number(req.params.crm),
        UF[req.params.uf]
    );
    if (dbResponse instanceof Error)
        return res.status(500).send({ error: dbResponse.message });
    if (dbResponse.length === 0)
        return res.status(404).send({ error: 'Médico não encontrado' });
    
    return res.send(dbResponse[0]);
};
