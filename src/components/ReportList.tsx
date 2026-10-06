import { useState } from "react";
import { Search, FileText, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Report } from "@/types/Report";

interface ReportListProps {
  reports: Report[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const ReportList = ({ reports, selectedId, onSelect }: ReportListProps) => {
  const [search, setSearch] = useState("");

  const filtered = reports.filter(
    (r) =>
      r.nome.toLowerCase().includes(search.toLowerCase()) ||
      r.escola.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h2 className="mb-3 text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
          Relatórios
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou escola..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filtered.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              Nenhum relatório encontrado.
            </p>
          ) : (
            filtered.map((report) => (
              <button
                key={report.id}
                onClick={() => onSelect(report.id)}
                className={cn(
                  "mb-1 w-full rounded-lg p-3 text-left transition-all hover:bg-secondary",
                  selectedId === report.id &&
                    "bg-primary/10 ring-1 ring-primary/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-md bg-primary/10 p-2">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {report.nome}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {report.escola}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(report.data)}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
      <div className="border-t p-3 text-center text-xs text-muted-foreground">
        {filtered.length} relatório{filtered.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

export default ReportList;
