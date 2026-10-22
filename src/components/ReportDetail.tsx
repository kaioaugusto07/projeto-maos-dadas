import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  School,
  Home,
  AlertTriangle,
  ClipboardList,
  Send,
  Calendar,
  Phone,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import type { Report } from "@/types/Report";

interface ReportDetailProps {
  report: Report;
  onBack: () => void;
  onEdit?: () => void;
}

const formatDate = (dateStr: string) => {
  const parsedDate = new Date(dateStr);
  return Number.isNaN(parsedDate.getTime())
    ? dateStr
    : parsedDate.toLocaleDateString("pt-BR");
};

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 border-b pb-2 mb-3 mt-6 first:mt-0">
    <Icon className="h-4 w-4 text-primary" />
    <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">{title}</h3>
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-0.5 py-1.5">
    <span className="text-xs font-medium text-muted-foreground">{label}</span>
    <span className="text-sm text-foreground">{value}</span>
  </div>
);

const BadgeList = ({ items }: { items: string[] | string }) => {
  const parsedItems =
    typeof items === "string"
      ? items.split(",").filter(Boolean)
      : Array.isArray(items)
      ? items
      : [];

  return (
    <div className="flex flex-wrap gap-2">
      {parsedItems.map((item) => (
        <Badge key={item} variant="secondary" className="text-xs font-normal">
          {item}
        </Badge>
      ))}
    </div>
  );
};

const ReportDetail = ({ report, onBack, onEdit }: ReportDetailProps) => {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            {report.nome}
          </h2>
          <p className="text-sm text-muted-foreground">
            Relatório criado em {formatDate(report.data)}
          </p>
        </div>
        </div>
        {onEdit && (
          <Button type="button" variant="outline" onClick={onEdit} className="shrink-0">
            Editar meu relatório
          </Button>
        )}
      </div>

      <Separator />

      {/* Dados Básicos */}
      <SectionHeader icon={User} title="Dados Básicos" />
      <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
        <InfoRow label="Nome" value={report.nome} />
        <InfoRow label="Data de Nascimento" value={formatDate(report.dataNascimento)} />
        <InfoRow label="Data do Relatório" value={formatDate(report.data)} />
      </div>

      {/* Dados Escolares */}
      <SectionHeader icon={School} title="Dados Escolares" />
      <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
        <InfoRow label="Escola" value={report.escola} />
        <InfoRow label="Série" value={report.serie} />
        <InfoRow label="Turma" value={report.turma} />
      </div>

      {/* Informações Familiares */}
      <SectionHeader icon={Home} title="Informações Familiares" />
      <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
        <InfoRow label="Responsável Legal" value={report.responsavel} />
        <div className="flex flex-col gap-0.5 py-1.5">
          <span className="text-xs font-medium text-muted-foreground">Telefone</span>
          <span className="flex items-center gap-1.5 text-sm text-foreground">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            {report.telefone}
          </span>
        </div>
        <div className="sm:col-span-2 flex flex-col gap-0.5 py-1.5">
          <span className="text-xs font-medium text-muted-foreground">Endereço</span>
          <span className="flex items-center gap-1.5 text-sm text-foreground">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            {report.endereco}
          </span>
        </div>
      </div>

      {/* Motivo da Sinalização */}
      <SectionHeader icon={AlertTriangle} title="Motivo da Sinalização" />
      <BadgeList items={report.motivosSinalizacao} />

      {/* Intervenções */}
      <SectionHeader icon={ClipboardList} title="Intervenções Realizadas pela Escola" />
      <BadgeList items={report.intervencoes} />

      {/* Encaminhamentos */}
      <SectionHeader icon={Send} title="Encaminhamentos" />
      <BadgeList items={report.encaminhamentos} />

      {/* Observações */}
      <SectionHeader icon={ClipboardList} title="Observações" />
      <div className="rounded-lg border bg-muted/50 p-4">
        <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
          {report.observacoes}
        </p>
      </div>
    </div>
  );
};

export default ReportDetail;
