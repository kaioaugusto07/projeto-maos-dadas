import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Save, User, School, Home, AlertTriangle, ClipboardList, Send } from "lucide-react";
import {
  ESCOLAS,  
  SERIES,
  TURMAS,
  MOTIVOS_SINALIZACAO,
  INTERVENCOES,
  ENCAMINHAMENTOS,
} from "../../data/constants";
import type { Report } from "@/types/Report";

interface ReportFormProps {
  onSave: (report: Report) => void;
}

const initialForm = {
  nome: "",
  dataNascimento: "",
  data: "",
  escola: "",
  serie: "",
  turma: "",
  responsavel: "",
  endereco: "",
  telefone: "",
  motivosSinalizacao: [] as string[],
  intervencoes: [] as string[],
  encaminhamentos: [] as string[],
  observacoes: "",
};

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 border-b pb-2 mb-4 mt-6 first:mt-0">
    <Icon className="h-4 w-4 text-primary" />
    <h3 className="section-title mb-0">{title}</h3>
  </div>
);

const CheckboxGroup = ({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) => (
  <div className="space-y-2">
    {options.map((option) => (
      <label key={option} className="flex items-start gap-3 cursor-pointer group">
        <Checkbox
          checked={selected.includes(option)}
          onCheckedChange={(checked) =>
            onChange(
              checked
                ? [...selected, option]
                : selected.filter((v) => v !== option)
            )
          }
          className="mt-0.5"
        />
        <span className="text-sm text-foreground group-hover:text-primary transition-colors">{option}</span>
      </label>
    ))}
  </div>
);

const ReportForm = ({ onSave }: ReportFormProps) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const update = <K extends keyof typeof initialForm>(
    key: K,
    value: (typeof initialForm)[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const required: (keyof typeof initialForm)[] = [
    "nome", "dataNascimento", "data", "escola", "serie", "turma",
    "responsavel", "endereco", "telefone", "observacoes",
  ];
  const arrayRequired: (keyof typeof initialForm)[] = [
    "motivosSinalizacao", "intervencoes", "encaminhamentos",
  ];

  for (const key of required) {
  const value = form[key];

  if (typeof value === "string" && value.trim() === "") {
    toast.error(`Campo obrigatório: ${key}`);
    return;
    } 
  }
  for (const key of arrayRequired) {
  const value = form[key] as string[];

  if (!Array.isArray(value) || value.length === 0) {
    toast.error(`Selecione ao menos uma opção em: ${key}`);
    return;
  }
  console.log(form); // tetetet
}

  console.log("DADOS ENVIADOS:", form); //te  

  try {
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");


    const res = await fetch("http://localhost:3000/api/reportsM", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        userId: user.id,
        motivosSinalizacao: form.motivosSinalizacao.join(","), // <-- array para string
        intervencoes: form.intervencoes.join(","),             // <-- array para string
        encaminhamentos: form.encaminhamentos.join(","),       // <-- array para string
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("ERRO BACKEND:", err);
      toast.error("Erro ao salvar no banco");
      return;
    }

    const newReport = await res.json();

    onSave(newReport); // atualiza a lista no front
    setForm(initialForm);

    toast.success("Relatório salvo com sucesso!");
  } catch (error) {
    console.error(error);
    toast.error("Erro inesperado");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* Dados Básicos */}
      <SectionHeader icon={User} title="Dados Básicos" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="nome">Nome *</Label>
          <Input id="nome" placeholder="Nome completo do aluno" value={form.nome} onChange={(e) => update("nome", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dataNascimento">Data de nascimento *</Label>
          <Input id="dataNascimento" type="date" value={form.dataNascimento} onChange={(e) => update("dataNascimento", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="data">Data *</Label>
          <Input id="data" type="date" value={form.data} onChange={(e) => update("data", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Escola *</Label>
          <Select value={form.escola} onValueChange={(v) => update("escola", v)}>
            <SelectTrigger><SelectValue placeholder="Selecione a escola" /></SelectTrigger>
            <SelectContent>
              {ESCOLAS.map((e) => (
                <SelectItem key={e} value={e}>{e}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dados Escolares */}
      <SectionHeader icon={School} title="Dados Escolares" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Série *</Label>
          <Select value={form.serie} onValueChange={(v) => update("serie", v)}>
            <SelectTrigger><SelectValue placeholder="Selecione a série" /></SelectTrigger>
            <SelectContent>
              {SERIES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Turma *</Label>
          <Select value={form.turma} onValueChange={(v) => update("turma", v)}>
            <SelectTrigger><SelectValue placeholder="Selecione a turma" /></SelectTrigger>
            <SelectContent>
              {TURMAS.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Informações Familiares */}
      <SectionHeader icon={Home} title="Informações Familiares" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="responsavel">Responsável legal - Parentesco *</Label>
          <Input id="responsavel" placeholder="Ex: Mãe - Maria Silva" value={form.responsavel} onChange={(e) => update("responsavel", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="telefone">Telefone de contato *</Label>
          <Input id="telefone" placeholder="(00) 00000-0000" value={form.telefone} onChange={(e) => update("telefone", e.target.value)} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="endereco">Endereço *</Label>
          <Input id="endereco" placeholder="Rua, número, bairro" value={form.endereco} onChange={(e) => update("endereco", e.target.value)} />
        </div>
      </div>

      {/* Motivo da Sinalização */}
      <SectionHeader icon={AlertTriangle} title="Motivo da Sinalização" />
      <CheckboxGroup options={MOTIVOS_SINALIZACAO} selected={form.motivosSinalizacao} onChange={(v) => update("motivosSinalizacao", v)} />

      {/* Intervenções */}
      <SectionHeader icon={ClipboardList} title="Intervenções Realizadas pela Escola" />
      <CheckboxGroup options={INTERVENCOES} selected={form.intervencoes} onChange={(v) => update("intervencoes", v)} />

      {/* Encaminhamentos */}
      <SectionHeader icon={Send} title="Encaminhamentos" />
      <CheckboxGroup options={ENCAMINHAMENTOS} selected={form.encaminhamentos} onChange={(v) => update("encaminhamentos", v)} />

      {/* Observações */}
      <SectionHeader icon={ClipboardList} title="Observações" />
      <div className="space-y-1.5">
        <Label htmlFor="observacoes">Registro de informações *</Label>
        <Textarea
          id="observacoes"
          placeholder="Descreva detalhes relevantes sobre o caso..."
          rows={4}
          value={form.observacoes}
          onChange={(e) => update("observacoes", e.target.value)}
        />
      </div>

      {/* Submit */}
      <div className="pt-6">
        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar relatório
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ReportForm;
