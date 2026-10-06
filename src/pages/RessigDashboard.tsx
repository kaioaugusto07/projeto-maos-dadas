import { useState, useRef, useEffect } from "react";
import { ArrowLeft, FileText, Image, FileIcon, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Material {
  nome: string;
  data: string;
  tipo: string;
  url: string;
  target: "professores" | "infantis";
}

// Estado do usuário
const Materiais = () => {
  const [user, setUser] = useState<{ role: "admin" | "professor" } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({ role: parsed.role === "admin" ? "admin" : "professor" });
    }
  }, []);


  useEffect(() => {
  const fetchMateriais = async () => {
    if (!user) return;
    try {
      const res = await fetch("http://localhost:3000/api/materials");
      const data: Material[] = await res.json();
      setMateriaisProfessores(data.filter((m) => m.target === "professores"));
      setMateriaisInfantis(data.filter((m) => m.target === "infantis"));
    } catch (err) {
      console.error(err);
    }
  };

  fetchMateriais();
}, [user]);

  const [materiaisProfessores, setMateriaisProfessores] = useState<Material[]>([]);
  const [materiaisInfantis, setMateriaisInfantis] = useState<Material[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTarget, setDialogTarget] = useState<"professores" | "infantis">("professores");
  const [nomeNovo, setNomeNovo] = useState("");
  const [arquivoNovo, setArquivoNovo] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const abrirDialog = (target: "professores" | "infantis") => {
    setDialogTarget(target);
    setNomeNovo("");
    setArquivoNovo(null);
    setDialogOpen(true);
  };

  const handleCriar = async () => {
  if (!nomeNovo.trim() || !arquivoNovo) return;

  try {
    const formData = new FormData();
    formData.append("nome", nomeNovo);
    formData.append("target", dialogTarget);
    formData.append("file", arquivoNovo);

    const res = await fetch("http://localhost:3000/api/materials/create", {
      method: "POST",
      body: formData,
    });

    const novoMaterial = await res.json();

    if (dialogTarget === "professores") {
      setMateriaisProfessores((prev) => [novoMaterial, ...prev]);
    } else {
      setMateriaisInfantis((prev) => [novoMaterial, ...prev]);
    }

    setDialogOpen(false);
  } catch (err) {
    console.error("Erro ao enviar material:", err);
  }
};

  // Utils
  const getFileIcon = (tipo: string) => {
    switch (tipo) {
      case "PDF":
        return <FileText className="h-5 w-5 text-destructive" />;
      case "PNG":
      case "JPG":
      case "SVG":
        return <Image className="h-5 w-5 text-primary" />;
      case "DOC":
        return <FileIcon className="h-5 w-5 text-primary" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getExtension = (filename: string): string => {
    const ext = filename.split(".").pop()?.toUpperCase() || "";
    return ext;
  };

  const formatDate = (date: Date): string => {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const MaterialList = ({
    titulo,
    materiais,
    onCriar,
    userRole,
  }: {
    titulo: string;
    materiais: Material[];
    onCriar: () => void;
    userRole: "admin" | "professor";
  }) => (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      <div className="flex items-center justify-between bg-primary px-5 py-3 rounded-t-lg">
        <h2 className="text-lg font-semibold text-primary-foreground">{titulo}</h2>
        {userRole === "admin" && (
          <button
            onClick={onCriar}
            className="flex items-center gap-1 text-primary-foreground/90 hover:text-primary-foreground transition-colors border border-primary-foreground/30 rounded px-3 py-1.5 text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Criar Material
          </button>
        )}
      </div>
      <ul className="divide-y divide-border">
        {materiais.map((m, i) => (
          <li key={i}>
            <a
              href={`http://localhost:3000${m.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-4 hover:bg-secondary transition-colors"
            >
              {getFileIcon(m.tipo)}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{m.nome}</p>
                <p className="text-sm text-muted-foreground">{m.data}</p>
              </div>
              <span className="text-xs font-mono bg-secondary text-secondary-foreground px-2 py-1 rounded">
                {m.tipo}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between shadow border-b border-border">
        <h1 className="text-xl font-bold">Materiais Disponíveis</h1>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1 text-primary-foreground/80 hover:text-primary-foreground transition-colors border border-primary-foreground/30 rounded px-3 py-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Voltar</span>
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {user && (
          <>
            <MaterialList
              titulo="Materiais para Professores"
              materiais={materiaisProfessores}
              onCriar={() => abrirDialog("professores")}
              userRole={user.role}
            />
            <MaterialList
              titulo="Materiais para Professores Infantis"
              materiais={materiaisInfantis}
              onCriar={() => abrirDialog("infantis")}
              userRole={user.role}
            />
          </>
        )}
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Criar Material - {dialogTarget === "professores" ? "Professores" : "Infantis"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Nome do material</label>
              <Input
                placeholder="Ex: Apostila de Matemática"
                value={nomeNovo}
                onChange={(e) => setNomeNovo(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Documento</label>
              <input
                ref={fileInputRef}
                type="file"
                className="block w-full text-sm text-foreground file:mr-3 file:rounded file:border file:border-border file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-accent cursor-pointer"
                onChange={(e) => setArquivoNovo(e.target.files?.[0] || null)}
              />
            </div>
            <Button
              onClick={handleCriar}
              disabled={!nomeNovo.trim() || !arquivoNovo}
              className="w-full"
            >
              Adicionar Material
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Materiais;