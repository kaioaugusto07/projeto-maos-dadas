import { useState } from "react";
import { ArrowLeft, HandHeart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReportList from "@/components/ReportList";
import ReportForm from "@/components/ReportForm";
import ReportDetail from "@/components/ReportDetail";
import type { Report } from "@/types/Report";
import { useEffect } from "react";
import { apiFetch } from "@/lib/api";

const Index = () => {
const navigate = useNavigate();
const [reports, setReports] = useState<Report[]>([]);
const [editingReport, setEditingReport] = useState<Report | null>(null);

useEffect(() => {
  const fetchReports = async () => {
    try {
      const res = await apiFetch("http://localhost:3000/api/reportsM");
      if (!res.ok) throw new Error("Erro ao buscar relatórios");
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error("Erro ao buscar relatórios:", err);
    }
  };

  fetchReports();
}, []);

const [selectedId, setSelectedId] = useState<string | null>(null);

const handleSave = (report: Report) => {
setReports((previous) =>
  previous.some((item) => item.id === report.id)
    ? previous.map((item) => item.id === report.id ? report : item)
    : [report, ...previous],
);
setEditingReport(null);
setSelectedId(report.id);
};

return ( <div className="flex h-screen flex-col">
{/* Header */} <header className="flex items-center justify-between gap-3 border-b bg-card px-6 py-3">
  <div className="flex items-center gap-3">
    <div className="flex items-center justify-center rounded-lg bg-primary p-2">
      <HandHeart className="h-5 w-5 text-primary-foreground" />
    </div>
    <div>
      <h1 className="text-xl font-bold leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
        Mãos Dadas
      </h1>
      <p className="text-xs text-muted-foreground">Sistema de Relatórios Educacionais</p>
    </div>
  </div>
  <button
    type="button"
    onClick={() => navigate("/dashboard")}
    className="flex items-center gap-1 rounded border border-border px-3 py-1.5 text-sm font-medium text-card-foreground transition-colors hover:bg-secondary"
  >
    <ArrowLeft className="h-4 w-4" />
    Voltar
  </button>
</header>


  {/* Main Content */}
  <div className="flex flex-1 overflow-hidden">
    {/* Left Panel - Report List */}
    <aside className="hidden w-80 flex-shrink-0 border-r bg-card md:flex md:flex-col lg:w-96">
      <ReportList
        reports={reports}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    </aside>

    {/* Right Panel - Form */}
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            {editingReport ? "Editar meu relatório" : "Novo Relatório"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Preencha os campos abaixo para registrar uma nova sinalização.
          </p>
        </div>
        {selectedId ? (
          <ReportDetail
            report={reports.find((r) => r.id === selectedId)}
            onBack={() => setSelectedId(null)}
            onEdit={() => {
              const report = reports.find((item) => item.id === selectedId);
              if (report) {
                setEditingReport(report);
                setSelectedId(null);
              }
            }}
          />
        ) : (
          <ReportForm
            key={editingReport?.id || "new-report"}
            onSave={handleSave}
            reportToEdit={editingReport || undefined}
            onCancel={() => setEditingReport(null)}
          />
        )}
      </div>
    </main>
  </div>
</div>


);
};

export default Index;
