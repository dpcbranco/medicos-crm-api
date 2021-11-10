export type ConsultaCrmResponse = {
    url: string;
    total: number;
    status: boolean
    mensagem: string
    api_limite: number
    api_consultas: number,
    item: Array<MedicoApi>
}

type MedicoApi = {
    tipo: string;
    nome: string;
    numero: string;
    profissao: string;
    uf: string;
    situacao: string;
}
