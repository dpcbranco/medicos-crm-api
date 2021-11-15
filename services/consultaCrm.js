const fetch = require('node-fetch');
const parser = require('xml2json');

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
        `${apiUrl}?tipo=crm&uf=${uf}&q=${crm}&chave=${apiKey}&destino=xml`
    ).then(async (res) => {
        const apiResponse = await res.text().then(
            (strResponse) => {
                try {
                    return JSON.parse(parser.toJson(strResponse));
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
                    api_consultas: apiResponse.rss.channel['api_consultas'],
                    api_limite: apiResponse.rss.channel['api_limite'],
                    item: apiResponse.rss.channel['item'],
                    mensagem: apiResponse.rss.channel['mensagem'],
                    status: apiResponse.rss.channel['status'],
                    total: apiResponse.rss.channel['total'],
                    url: apiResponse.rss.channel['url']
                };
                if (medicoApi.item){
                    const medicoDB = {
                        crm: Number(medicoApi.item.numero),
                        uf: UF[medicoApi.item.uf],
                        nome: medicoApi.item.nome
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