const fetch = require('node-fetch');

const { ApiError } = require('../types/ApiError');
const { UF } = require('../types/UF');
const { insertMedico } = require('./database');

const searchByCrm = async (
    crm,
    uf
) => {
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
        const apiError = new ApiError();
        if (res.ok) {
            if (typeof(apiResponse) === 'object'){
                const medicoApi = {
                    api_consultas: apiResponse['api_consultas'],
                    api_limite: apiResponse['api_limite'],
                    item: apiResponse['item'],
                    mensagem: apiResponse['mensagem'],
                    status: apiResponse['status'],
                    total: apiResponse['total'],
                    url: apiResponse['url']
                };
                if (medicoApi.item.length !== 0){
                    const medicoDB = {
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

module.exports = { searchByCrm };