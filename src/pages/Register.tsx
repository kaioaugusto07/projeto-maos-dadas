import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, UserRound } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [message, setMessage] = useState("");

  const sendCode = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    setError("");
    setMessage("");
    setSendingCode(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/email-verification/send-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: normalizedEmail }),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Não foi possível enviar o código.");
        return;
      }

      setEmail(normalizedEmail);
      setEmailCode("");
      setMessage(data.message);
    } catch (requestError) {
      console.error("Erro ao solicitar código de verificação:", requestError);
      setError("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setSendingCode(false);
    }
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: normalizedEmail,
          emailCode,
          password,
          passwordConfirmation: confirmation,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Não foi possível criar a conta.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      localStorage.setItem("autenticado", "true");
      navigate("/aguardando-aprovacao", { replace: true });
    } catch (requestError) {
      console.error("Erro no cadastro:", requestError);
      setError("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[hsl(var(--login-bg))] px-4 py-10">
      <section className="w-full max-w-md rounded-[var(--radius)] bg-card p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <UserRound className="h-8 w-8 text-primary-foreground" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold text-card-foreground">Criar cadastro</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Preencha seus dados para solicitar acesso
          </p>
        </div>

        <form onSubmit={handleRegister} noValidate className="space-y-4">
          <label className="block space-y-1.5 text-sm font-medium text-card-foreground">
            Nome completo
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              className="w-full rounded-lg border border-border bg-secondary px-4 py-3 font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Seu nome completo"
            />
          </label>

          <label className="block space-y-1.5 text-sm font-medium text-card-foreground">
            E-mail
            <input
              type="email"
              value={email}
              disabled={sendingCode || loading}
              onChange={(event) => {
                setEmail(event.target.value);
                setEmailCode("");
                setMessage("");
              }}
              autoComplete="email"
              className="w-full rounded-lg border border-border bg-secondary px-4 py-3 font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="voce@exemplo.com"
            />
            <button
              type="button"
              onClick={sendCode}
              disabled={sendingCode || loading}
              className="w-full rounded-lg border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sendingCode ? "Enviando código..." : "Enviar código de verificação"}
            </button>
          </label>

          <label className="block space-y-1.5 text-sm font-medium text-card-foreground">
            Código do e-mail
            <input
              type="text"
              value={emailCode}
              onChange={(event) => setEmailCode(event.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
              className="w-full rounded-lg border border-border bg-secondary px-4 py-3 font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Digite o código recebido"
            />
            <span className="block text-xs font-normal text-muted-foreground">
              O código expira em 10 minutos. É possível solicitar outro após 60 segundos.
            </span>
          </label>

          <label className="block space-y-1.5 text-sm font-medium text-card-foreground">
            Senha
            <span className="relative block">
              <LockKeyhole
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                className="w-full rounded-lg border border-border bg-secondary py-3 pl-10 pr-4 font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Mínimo de 8 caracteres"
              />
            </span>
          </label>

          <label className="block space-y-1.5 text-sm font-medium text-card-foreground">
            Confirmar senha
            <input
              type="password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              autoComplete="new-password"
              className="w-full rounded-lg border border-border bg-secondary px-4 py-3 font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Digite a senha novamente"
            />
          </label>

          {message && <p role="status" className="text-sm text-primary">{message}</p>}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Criando cadastro..." : "Solicitar acesso"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Já possui uma conta?{" "}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="font-semibold text-primary hover:underline"
          >
            Entrar
          </button>
        </p>
      </section>
    </main>
  );
};

export default Register;
