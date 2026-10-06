export const ESCOLAS = [
  "Escola Municipal Amália Flores",
  "Escola Municipal Ana Maria Silva Roggia",
  "Escola Municipal Arthur da Costa e Silva",
  "Escola Municipal Aurea Del Cortez Benck",
  "Escola Municipal Duque de Caxias",
  "Escola Municipal Erik Andersen",
  "Escola Municipal João Ambrozio",
  "Escola Municipal José de Alencar",
  "Escola Municipal Irmã Maria Leônia",
  "Escola Municipal Mario Calmon Eppinghaus",
  "Escola Municipal Sebastião Camarini",
  "Escola Municipal Rita Ana de Cássia",
  "Escola Municipal Almirante Tamandaré",
  "Escola Municipal Tancredo Neves",
  "CMEI Adam Henrique Petry",
  "CMEI João Gracino",
  "CMEI José Darcizio Vain",
  "CMEI Lourival José de Carvalho",
  "CMEI Luiz Venâncio da Silva Junior",
  "CMEI Maria Amélia Vieira Beffa",
  "CMEI Maria de Lourdes Arantes Pereira",
  "CMEI Maria Aparecida Silva Pereira",
  "CMEI José Farias Ferraz",
  "CMEI São Francisco",
  "CMEI Therezinha da Silva e Souza",
];

export const SERIES = [
  "Infantil 1",
  "Infantil 2",
  "Infantil 3",
  "Infantil 4",
  "Infantil 5",
  "1º ano",
  "2º ano",
  "3º ano",
  "4º ano",
  "5º ano",
];

export const TURMAS = ["A", "B", "C", "D"];

export const MOTIVOS_SINALIZACAO = [
  "Infrequência Escolar Acentuada",
  "Baixo Rendimento Escolar / Dificuldades de Aprendizagem",
  "Vulnerabilidade Socioeconômica",
  "Necessidade de Suporte em Saúde",
  "Conflitos Familiares",
];

export const INTERVENCOES = [
  "Orientações sobre frequência escolar",
  "Dificuldades de aprendizagem (leitura/escrita)",
  "Escuta sobre vulnerabilidades",
  "Plano de intervenção pedagógica (PEI)",
];

export const ENCAMINHAMENTOS = [
  "Assistência social",
  "Unidade de saúde / SUS",
  "Iniciativa privada",
  "Reunião com responsáveis",
  "Busca ativa escolar",
];

export interface Report {
  id: string;
  nome: string;
  dataNascimento: string;
  data: string;
  escola: string;
  serie: string;
  turma: string;
  responsavel: string;
  endereco: string;
  telefone: string;
  motivosSinalizacao: string[];
  intervencoes: string[];
  encaminhamentos: string[];
  observacoes: string;
}