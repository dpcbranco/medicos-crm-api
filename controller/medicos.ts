import { getMedicoByCrm } from '../services/database';
import { UF } from '../types/UF';
import { Request, Response } from 'express';
import { ApiError } from '../types/ApiError';
import { Medico } from '../types/Medico';
import { searchByCrm } from '../services/consultaCrm';

export const getMedico = async (
    req: Request,
    res: Response
): Promise<Response<ApiError|Medico>> => {
    if (!UF[req.params.uf])
        return res.status(400).send({ error: 'UF inválida' });
    if (isNaN(Number(req.params.crm)))
        return res.status(400).send({ error: 'CRM inválido' });
    
    const crm = Number(req.params.crm);
    const uf = UF[req.params.uf];

    const dbResponse = await getMedicoByCrm(crm, uf);
    if (dbResponse instanceof Error)
        return res.status(500).send({ error: dbResponse.message });
    if (dbResponse.length === 0){
        const apiResponse = await searchByCrm(crm, uf);
        if (apiResponse instanceof ApiError){
            return res
                .status(apiResponse.status ?? 500)
                .send({ error: apiResponse.error });
        }
        return res.send(apiResponse);
    }
    
    return res.send(dbResponse[0]);
};
