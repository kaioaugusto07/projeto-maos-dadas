import { useState } from "react";
import { HandHeart } from "lucide-react";
import ReportList from "@/components/ReportList";
import ReportForm from "@/components/ReportForm";
import ReportDetail from "@/components/ReportDetail";
import { Report } from "@/types/Report";
import { useEffect } from "react";

const Index = () => {
const [reports, setReports] = useState<Report[]>([]);

useEffect(() => {
  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/reportsM");
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error("Erro ao buscar relatórios:", err);
    }
  };

  fetchReports();
}, []);

const [selectedId, setSelectedId] = useState<number | null>(null);

const handleSave = async (data: Report) => {
const res = await fetch("http://localhost:3000/api/reportsM", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(data),
});


const result = await res.json();

// 🔥 salva no estado (isso tava faltando também)
setReports((prev) => [result, ...prev]);
setSelectedId(result.id);


};

return ( <div className="flex h-screen flex-col">
{/* Header */} <header className="flex items-center gap-3 border-b bg-card px-6 py-3"> <div className="flex items-center justify-center rounded-lg bg-primary p-2"> <HandHeart className="h-5 w-5 text-primary-foreground" /> </div> <div>
<h1 className="text-xl font-bold leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
Mãos Dadas </h1> <p className="text-xs text-muted-foreground">Sistema de Relatórios Educacionais</p> </div> </header>


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
            Novo Relatório
          </h2>
          <p className="text-sm text-muted-foreground">
            Preencha os campos abaixo para registrar uma nova sinalização.
          </p>
        </div>
        {selectedId ? (
          <ReportDetail
            report={reports.find((r) => r.id === selectedId)}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <ReportForm onSave={handleSave} />
        )}
      </div>
    </main>
  </div>
</div>


);
};

export default Index;
