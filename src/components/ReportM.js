import express from "express";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

// CRIAR RELATÓRIO
router.post("/", async (req, res) => {
try {
const body = req.body;


const report = await prisma.reportM.create({
    data: {
    userId: req.body.userId,
    nome: req.body.nome,
    dataNascimento: new Date(req.body.dataNascimento),
    data: new Date(req.body.data),
    escola: req.body.escola,
    serie: req.body.serie,
    turma: req.body.turma,
    responsavel: req.body.responsavel,
    endereco: req.body.endereco,
    telefone: req.body.telefone,
    motivosSinalizacao: req.body.motivosSinalizacao,
    intervencoes: req.body.intervencoes,
    encaminhamentos: req.body.encaminhamentos,
    observacoes: req.body.observacoes,
  }
});

res.status(200).json(report);


} catch (error) {
console.error("ERRO REAL:", error);
res.status(500).json({ message: "Erro ao salvar relatório" });
}
});

//  BUSCAR RELATÓRIOS
router.get("/", async (req, res) => {
try {
const reports = await prisma.reportM.findMany({
orderBy: { createdAt: "desc" },
});


const formatted = reports.map((r) => ({
  ...r,
  motivosSinalizacao: r.motivosSinalizacao
    ? r.motivosSinalizacao.split(",")
    : [],
  intervencoes: r.intervencoes
    ? r.intervencoes.split(",")
    : [],
  encaminhamentos: r.encaminhamentos
    ? r.encaminhamentos.split(",")
    : [],
}));

res.status(200).json(formatted);


} catch (error) {
console.error(error);
res.status(500).json({ message: "Erro ao buscar relatórios" });
}
});

export default router;
