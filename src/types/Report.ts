export interface Report {
  id: number;
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