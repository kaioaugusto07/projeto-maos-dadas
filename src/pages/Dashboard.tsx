import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BookOpen, RefreshCw, HandHeart, LogOut } from "lucide-react";


interface CardItem {
  titulo: string;
  descricao: string;
  icon: React.ReactNode;
  rolesPermitidos: string[]; // roles que podem acessar
}

const cards: CardItem[] = [
  {
    titulo: "Leitura Diária",
    descricao: "Acompanhe as leituras programadas para o dia",
    icon: <BookOpen className="h-10 w-10" />,
    rolesPermitidos: ["admin", "mediador"],
  },
  {
    titulo: "Ressignificando",
    descricao: "Atividades de ressignificação pedagógica",
    icon: <RefreshCw className="h-10 w-10" />,
    rolesPermitidos: ["admin", "professor"],
  },
  {
    titulo: "Mãos Dadas",
    descricao: "Programa de acolhimento e integração",
    icon: <HandHeart className="h-10 w-10" />,
    rolesPermitidos: ["admin", "assessor"],
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [primeiroNome, setPrimeiroNome] = useState("");
  const [role, setRole] = useState(""); // <- adiciona aqui

  useEffect(() => {
    if (localStorage.getItem("autenticado") !== "true") {
      navigate("/");
      return;
    }

    const user = localStorage.getItem("user");
    if (user) {
    const { name , role} = JSON.parse(user);
    setPrimeiroNome(name.split(" ")[0]);
    setRole(role);
    } 
  
  }, [navigate]);

  const handleSair = () => {
    localStorage.removeItem("autenticado");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-card-foreground">
              Secretaria de Educação
            </h2>
            <p className="text-sm text-muted-foreground">
              Bem-vindo(a), <span className="font-medium text-card-foreground">{primeiroNome}</span>
            </p>
          </div>
          <button
            onClick={handleSair}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-card-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </header>

{/* Cards */}
<main className="mx-auto max-w-5xl px-6 py-12">
  <h3 className="mb-8 text-center text-2xl font-bold text-foreground">
    Programas Institucionais
  </h3>
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {cards.map((card) => {
      // Verifica se a role do usuário permite acessar o card
      const podeAcessar = card.rolesPermitidos.includes(role);

      return (
        <div
          key={card.titulo}
          className={`group rounded-[var(--radius)] border p-8 text-center transition-all duration-200 ${
            podeAcessar
              ? "cursor-pointer border-border bg-card shadow-md hover:-translate-y-1 hover:shadow-lg"
              : "cursor-not-allowed border-muted bg-muted opacity-60"
          }`}
          onClick={() => {
            if (!podeAcessar) return;
            console.log("clicou", card.titulo);

            if (card.titulo === "Leitura Diária") {
              navigate("/mediador");
            } else if(card.titulo === "Ressignificando") {
              navigate("/materiais");
              
            } else if (card.titulo === "Mãos Dadas") {
              navigate("/maos-dadas");
            }
              
          }}
          >
          <div
            className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${
              podeAcessar
                ? "bg-primary text-primary-foreground"
                : "bg-muted-foreground/20 text-muted-foreground"
            }`}
          >
            {card.icon}
          </div>
          <h4
            className={`text-lg font-bold ${
              podeAcessar ? "text-card-foreground" : "text-muted-foreground"
            }`}
          >
            {card.titulo}
          </h4>
          <p
            className={`mt-2 text-sm ${
              podeAcessar ? "text-muted-foreground" : "text-muted-foreground/70"
            }`}
          >
            {card.descricao}
          </p>
          {!podeAcessar && (
            <span className="mt-4 inline-block rounded-full bg-muted-foreground/10 px-3 py-1 text-xs font-medium text-muted-foreground">
              Sem acesso
            </span>
            )}
            </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
