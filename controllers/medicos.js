const { getMedicoByCrm, insertMedico } = require('../services/database');
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
        res.status(404).send({ error: 'File not found' })
    }
    
    return res.send(dbResponse[0]);
};

const createMedico = async (req, res) => {
    if (!req.body.nome)
        return res.status(400).send({ error: 'Nome do médico não informado' })
    if (!req.body.crm)
        return res.status(400).send({ error: 'CRM do médico não informado' })
    if (!req.body.uf)
        return res.status(400).send({ error: 'UF do CRM não informada' })
    if (!UF[req.body.uf])
        return res.status(400).send({ error: 'UF inválida' });
    if (isNaN(Number(req.body.crm)))
        return res.status(400).send({ error: 'CRM inválido' });

    const medicoDB = await getMedicoByCrm(req.body.crm, req.body.uf);
    if (medicoDB.length > 0)
        return res.status(409).send({ error: "Médico já cadastrado na base" });
    const dbResponse = await insertMedico(req.body);
    if (dbResponse.severity === 'ERROR')
        return res.status(500).send(dbResponse)
    return res.send({ id: dbResponse[0].id })
}

module.exports = { getMedico, createMedico };