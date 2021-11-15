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
        `${apiUrl}?tipo=crm&uf=${uf}&q=${crm}&chave=${apiKey}&destino=json`
    ).then(async (res) => {
        const apiResponse = await res.text().then(
            (strResponse) => {
                try {
                    return JSON.parse(strResponse);
                } catch (_) {
                    console.error(
                        `Erro chamando API com CRM-UF: ${crm}-$${uf}: 
                        ${strResponse}`
                    );
                    return strResponse;
                }
            }
        );
        const apiError: ApiError = new ApiError();
        if (res.ok) {
            if (typeof(apiResponse) === 'object'){
                const medicoApi: ConsultaCrmResponse = {
                    api_consultas: apiResponse['api_consultas'],
                    api_limite: apiResponse['api_limite'],
                    item: apiResponse['item'],
                    mensagem: apiResponse['mensagem'],
                    status: apiResponse['status'],
                    total: apiResponse['total'],
                    url: apiResponse['url']
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
                
                apiError.error =  'Médico não encontrado na API',
                apiError.status = 404;

                return apiError;
            }
            
            apiError.error = 'Erro na conversão da resposta da API';
            apiError.status = 500;

            return apiError;
        }

        apiError.error = 'Falha na chamada da API';
        apiError.status = 500;

        return apiError;
    });
};