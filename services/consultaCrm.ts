import fetch from 'node-fetch';
import { ApiError } from '../types/ApiError';
import { ConsultaCrmResponse } from '../types/ConsultaCrmResponse';
import { Medico } from '../types/Medico';
import { UF } from '../types/UF';
import { insertMedico } from './database';

export const searchByCrm = async (
    crm: number,
    uf: UF
): Promise<Medico|ApiError> => {
    const apiUrl = process.env.API_URL;
    const apiKey = process.env.API_KEY;
    return await fetch(
        `${apiUrl}?tipo=crm&uf=${uf}&q=${crm}&chave=${apiKey}&destino=json`,
    ).then(async (res) => {
        if (res.ok) {
            const medicoApiJson = await res.json();
            if (typeof(medicoApiJson) === 'object'){
                const medicoApi: ConsultaCrmResponse = {
                    api_consultas: medicoApiJson['api_consultas'],
                    api_limite: medicoApiJson['api_limite'],
                    item: medicoApiJson['item'],
                    mensagem: medicoApiJson['mensagem'],
                    status: medicoApiJson['status'],
                    total: medicoApiJson['total'],
                    url: medicoApiJson['url']
                };
                if (medicoApi.item.length !== 0){
                    const medicoDB: Medico = {
                        crm: Number(medicoApi.item[0].numero),
                        uf: UF[medicoApi.item[0].uf],
                        nome: medicoApi.item[0].nome
                    };
                    insertMedico(medicoDB);
                    return medicoDB;
                }
                const apiError: ApiError = {
                    error: 'Médico não encontrado na API',
                    status: 404
                };
                return apiError;
            }
            const apiError: ApiError = {
                error: 'Erro na conversão da resposta da API',
                status: 500
            }; 
            return apiError;
        }

        const apiError: ApiError = {
            error: 'Falha na chamada da API',
            status: 500
        }; 
        return apiError;
    });
};