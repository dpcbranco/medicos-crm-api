const { getMedicoByCrm } = require('../services/database');
const { UF } = require('../types/UF');
const { ApiError } = require('../types/ApiError');
const { searchByCrm } = require('../services/consultaCrm');

const getMedico = async (
    req,
    res
) => {
    if (!UF[req.params.uf])
        return res.status(400).send({ error: 'UF inválida' });
    if (isNaN(Number(req.params.crm)))
        return res.status(400).send({ error: 'CRM inválido' });
    
    const crm = Number(req.params.crm);
    const uf = UF[req.params.uf];

    const dbResponse = await getMedicoByCrm(crm, uf);
    if (dbResponse instanceof Error) {
        console.error(dbResponse)
        return res.status(500).send({ error: dbResponse.message });
    }
    if (dbResponse.length === 0){
        const apiResponse = await searchByCrm(crm, uf);
        if (apiResponse instanceof ApiError) {
            if (apiResponse.status === 500)
                console.error(apiResponse)
            return res
                .status(apiResponse.status ?? 500)
                .send({ error: apiResponse.error });
        }
        return res.send(apiResponse);
    }
    
    return res.send(dbResponse[0]);
};

module.exports = { getMedico };