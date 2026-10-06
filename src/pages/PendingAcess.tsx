import { Clock3, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PendingAcess = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("autenticado");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[hsl(var(--login-bg))] px-4 py-10">
      <section className="w-full max-w-lg rounded-[var(--radius)] bg-card p-8 text-center shadow-2xl sm:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Clock3 className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-card-foreground">
          Cadastro aguardando aprovação
        </h1>
        <p className="mt-4 text-muted-foreground">
          Sua conta foi criada. Um administrador precisa aprovar seu acesso e
          definir sua função antes que você possa usar o sistema.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Você pode entrar novamente com seu e-mail e senha enquanto aguarda.
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-medium text-card-foreground transition hover:bg-secondary"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sair
        </button>
      </section>
    </main>
  );
};

export default PendingAcess;
