import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Não foi possível entrar. Tente novamente.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      localStorage.setItem("autenticado", "true");
      navigate(data.user.status === "PENDING" ? "/aguardando-aprovacao" : "/dashboard");
    } catch (error) {
      console.error("Erro no login:", error);
      setErro("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--login-bg))]">
      <div className="w-full max-w-sm rounded-[var(--radius)] bg-card p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <LockKeyhole className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-card-foreground">
            Secretaria de Educação
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acesse sua conta institucional
          </p>
        </div>

        <form onSubmit={handleLogin} noValidate className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {erro && (
            <p role="alert" className="text-sm text-destructive">{erro}</p>
          )}
          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Ainda não tem acesso?{" "}
          <button
            type="button"
            onClick={() => navigate("/cadastro")}
            className="font-semibold text-primary hover:underline"
          >
            Criar conta
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
