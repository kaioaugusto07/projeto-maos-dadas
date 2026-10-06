import { useState, useEffect, useCallback } from "react";


interface User {
  id: string;
  name: string;
  role: string;
}

interface Report {
  id?: string;
  userId: string;
  date: string;
  school: string;
  studentName: string;
  grade: string;
  class: string;
  instrument: string;
  behavior: string;
  readingLevel: string;
  comprehension: string;
}

const SCHOOLS = [
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
];

const GRADES = ["2º ano", "4º ano"];
const CLASSES = ["A", "B", "C", "D"];
const INSTRUMENTS = ["Palavras", "Frase curta", "Texto curto", "Texto longo"];
const BEHAVIORS = [
  "Leitura fluente",
  "Leitura silabada",
  "Dificuldade em palavras simples",
  "Pausas frequentes",
  "Necessidade de ajuda",
];
const READING_LEVELS = [
  "Não leitor",
  "Leitor iniciante",
  "Leitor em desenvolvimento",
  "Leitor fluente",
];
const COMPREHENSIONS = ["Sim", "Parcialmente", "Não"];

const API_BASE = "http://localhost:3000/api";

const emptyForm = {
  date: "",
  school: "",
  studentName: "",
  grade: "",
  class: "",
  instrument: "",
  behavior: "",
  readingLevel: "",
  comprehension: "",
};

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR");
  } catch {
    return dateStr;
  }
}

export default function MediadorDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const fetchReports = useCallback(async (userId: string) => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/reports/${userId}`);
      if (!res.ok) {
        const text = await res.text();
        console.log("ERRO BACKEND:", text);
        throw new Error("Erro ao buscar relatórios");
      }

      const data = await res.json();
      const sorted = (data as Report[]).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setReports(sorted);
    } catch {
      setFeedback({ type: "error", msg: "Erro ao carregar relatórios." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed: User = JSON.parse(stored);
      setUser(parsed);
      fetchReports(parsed.id);
    } else {
      setLoading(false);
    }
  }, [fetchReports]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("USER:", user);

    if (!user) return;

    const missing = Object.entries(form).find(([, v]) => !v);
    if (missing) {
      setFeedback({ type: "error", msg: "Preencha todos os campos." });
      return;
    }

    try {
      setSubmitting(true);
      setFeedback(null);
      const res = await fetch(`${API_BASE}/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...form }),
      });
      if (!res.ok) throw new Error("Erro ao enviar relatório");
      setForm(emptyForm);
      setFeedback({ type: "success", msg: "Relatório criado com sucesso!" });
      await fetchReports(user.id);
    } catch {
      setFeedback({ type: "error", msg: "Erro ao criar relatório." });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (feedback) {
      const t = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(t);
    }
  }, [feedback]);

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Usuário não encontrado. Faça login novamente.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Secretaria de Educação</h1>
            <p className="text-sm opacity-80">Painel do Mediador</p>
          </div>
          {user && (
            <div className="text-right text-sm">
              <p className="font-medium">{user.name}</p>
              <p className="opacity-70 capitalize">{user.role}</p>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Feedback */}
        {feedback && (
          <div
            className={`mb-6 px-4 py-3 rounded-md text-sm font-medium ${
              feedback.type === "success"
                ? "bg-accent/15 text-accent border border-accent/30"
                : "bg-destructive/10 text-destructive border border-destructive/30"
            }`}
          >
            {feedback.msg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Reports List */}
          <section className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-primary rounded-full inline-block" />
              Meus Relatórios
            </h2>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card rounded-lg border border-border p-4 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2 mb-1" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                ))}
              </div>

              ) : reports.length === 0 ? (
              <div className="bg-card rounded-lg border border-border p-8 text-center">
                <p className="text-muted-foreground">Nenhum relatório encontrado</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                {reports.map((r, i) => (
                  <div
                    key={r.id || i}
                    onClick={() => setSelectedReport(r)}
                    className={`bg-card rounded-lg border p-4 hover:shadow-sm transition-all cursor-pointer ${
                      selectedReport?.id === r.id ? "border-primary ring-2 ring-primary/20" : "border-border"
                    }`}
                  >
                    <p className="font-medium text-card-foreground text-sm">{r.school}</p>
                    <p className="text-muted-foreground text-sm mt-1">{r.studentName}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(r.date)}</p>
                  </div>
                ))}
              </div>
            )}
            {selectedReport && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                onClick={() => setSelectedReport(null)}
              >
                <div
                  className="bg-card rounded-lg border border-border shadow-lg w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between p-5 border-b border-border">
                    <h3 className="text-base font-semibold text-foreground">
                      Detalhes do Relatório
                    </h3>
                    <button
                      onClick={() => setSelectedReport(null)}
                      className="text-muted-foreground hover:text-foreground text-lg"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-5 space-y-3">
                    <p><strong>Aluno:</strong> {selectedReport.studentName}</p>
                    <p><strong>Escola:</strong> {selectedReport.school}</p>
                    <p><strong>Série:</strong> {selectedReport.grade}</p>
                    <p><strong>Turma:</strong> {selectedReport.class}</p>
                    <p><strong>Data:</strong> {formatDate(selectedReport.date)}</p>
                    <p><strong>Instrumento:</strong> {selectedReport.instrument}</p>
                    <p><strong>Comportamento:</strong> {selectedReport.behavior}</p>
                    <p><strong>Nível de leitura:</strong> {selectedReport.readingLevel}</p>
                    <p><strong>Compreensão:</strong> {selectedReport.comprehension}</p>
                  </div>

                  <div className="p-5 border-t border-border">
                    <button
                      onClick={() => setSelectedReport(null)}
                      className="w-full px-4 py-2 bg-secondary rounded-md"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            )}

          </section>

          {/* Form */}
          <section className="lg:col-span-3">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-accent rounded-full inline-block" />
              Novo Relatório
            </h2>

            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-lg border border-border p-6 shadow-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Data" name="date" type="date" value={form.date} onChange={handleChange} />
                <SelectField label="Escola" name="school" value={form.school} options={SCHOOLS} onChange={handleChange} />
                <FormField label="Nome do Estudante" name="studentName" value={form.studentName} onChange={handleChange} />
                <SelectField label="Série" name="grade" value={form.grade} options={GRADES} onChange={handleChange} />
                <SelectField label="Turma" name="class" value={form.class} options={CLASSES} onChange={handleChange} />
                <SelectField label="Instrumento" name="instrument" value={form.instrument} options={INSTRUMENTS} onChange={handleChange} />
                <SelectField label="Comportamento" name="behavior" value={form.behavior} options={BEHAVIORS} onChange={handleChange} />
                <SelectField label="Nível de Leitura" name="readingLevel" value={form.readingLevel} options={READING_LEVELS} onChange={handleChange} />
                <SelectField label="Compreensão" name="comprehension" value={form.comprehension} options={COMPREHENSIONS} onChange={handleChange} />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full sm:w-auto px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Enviando..." : "Criar Relatório"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

function FormField({
  label, name, value, onChange, type = "text",
}: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-foreground mb-1">{label}</label>
      <input
        id={name} name={name} type={type} value={value} onChange={onChange} required
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function SelectField({
  label, name, value, options, onChange,
}: {
  label: string; name: string; value: string; options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-foreground mb-1">{label}</label>
      <select
        id={name} name={name} value={value} onChange={onChange} required
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">Selecione...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
