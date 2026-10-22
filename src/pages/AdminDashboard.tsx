import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, FileText, Trash2, X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const API = "http://localhost:3000/api/admin";
const roles = ["mediador", "professor", "assessor", "admin"];

interface AdminUser {
  id: string;
  name: string;
  email: string | null;
  role: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
}

interface UserReport {
  id: string;
  type: "leitura" | "maos-dadas";
  title: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

const formatDateTime = (value?: string) =>
  value
    ? new Date(value).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "—";

const labels: Record<string, string> = {
  nome: "Estudante",
  dataNascimento: "Data de nascimento",
  data: "Data do relatório",
  escola: "Escola",
  serie: "Série",
  turma: "Turma",
  responsavel: "Responsável",
  endereco: "Endereço",
  telefone: "Telefone",
  motivosSinalizacao: "Motivos da sinalização",
  intervencoes: "Intervenções",
  encaminhamentos: "Encaminhamentos",
  observacoes: "Observações",
  date: "Data do relatório",
  school: "Escola",
  studentName: "Estudante",
  grade: "Série",
  class: "Turma",
  instrument: "Instrumento",
  behavior: "Comportamento",
  readingLevel: "Nível de leitura",
  comprehension: "Compreensão",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isRequestsPage = location.pathname === "/administrar/solicitacoes";
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);
  const [pendingRoles, setPendingRoles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiFetch(
        `${API}/users${isRequestsPage ? "/pending" : ""}`,
      );
      const data = await response.json();
      if (response.status === 401 || response.status === 403) {
        navigate("/dashboard", { replace: true });
        return;
      }
      if (!response.ok) {
        throw new Error(data.error || "Não foi possível carregar os usuários.");
      }
      setUsers(data);
      if (isRequestsPage) {
        setPendingRoles(
          Object.fromEntries(data.map((user: AdminUser) => [user.id, "professor"])),
        );
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao carregar os usuários.",
      );
    } finally {
      setLoading(false);
    }
  }, [isRequestsPage, navigate]);

  useEffect(() => {
    setSelectedUser(null);
    setSelectedReport(null);
    setReports([]);
    setNotice("");
    void loadUsers();
  }, [loadUsers]);

  const openUser = async (user: AdminUser) => {
    setError("");
    setSelectedUser(user);
    setReports([]);
    setReportsLoading(true);
    setSelectedReport(null);
    try {
      const response = await apiFetch(`${API}/users/${user.id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Não foi possível carregar os relatórios.");
      }
      setSelectedUser(data.user);
      setReports(data.reports);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao carregar os relatórios.",
      );
    } finally {
      setReportsLoading(false);
    }
  };

  const closeUser = () => {
    setSelectedUser(null);
    setReports([]);
    setSelectedReport(null);
  };

  const decideRequest = async (
    user: AdminUser,
    decision: "approve" | "reject",
  ) => {
    const role = pendingRoles[user.id];
    if (decision === "reject" && !window.confirm(`Rejeitar e remover o pedido de ${user.name}?`)) {
      return;
    }

    setBusyId(user.id);
    setError("");
    setNotice("");
    try {
      const response = await apiFetch(`${API}/users/${user.id}/access`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, role }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Não foi possível processar a solicitação.");
      }
      setNotice(
        decision === "approve"
          ? `Acesso de ${user.name} aprovado como ${role}.`
          : `Solicitação de ${user.name} rejeitada.`,
      );
      await loadUsers();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao processar a solicitação.",
      );
    } finally {
      setBusyId("");
    }
  };

  const deleteReport = async (report: UserReport) => {
    if (!window.confirm(`Excluir permanentemente o relatório "${report.title}"?`)) {
      return;
    }

    setBusyId(report.id);
    setError("");
    try {
      const response = await apiFetch(
        `${API}/reports/${report.type}/${report.id}`,
        { method: "DELETE" },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Não foi possível excluir o relatório.");
      }
      setReports((current) => current.filter((item) => item.id !== report.id));
      setSelectedReport(null);
      setNotice("Relatório excluído.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao excluir o relatório.",
      );
    } finally {
      setBusyId("");
    }
  };

  const handleBack = () => {
    if (isRequestsPage) {
      navigate("/administrar");
    } else if (selectedReport) {
      setSelectedReport(null);
    } else if (selectedUser) {
      setSelectedUser(null);
      setReports([]);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-card px-5 py-4 shadow-sm sm:px-8">
        <div>
          <h1 className="text-xl font-bold text-card-foreground">Administração</h1>
          <p className="text-sm text-muted-foreground">
            Usuários e solicitações de acesso
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!isRequestsPage && (
            <button
              type="button"
              onClick={() => navigate("/administrar/solicitacoes")}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-card-foreground transition hover:bg-secondary"
            >
              Solicitações
            </button>
          )}
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-card-foreground transition hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {isRequestsPage ? "Solicitações pendentes" : "Usuários"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isRequestsPage
                ? "Defina a função antes de aprovar; rejeitar remove o pedido e a conta."
                : "Selecione um usuário para consultar seus relatórios."}
            </p>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
            {users.length}
          </span>
        </div>

        {error && (
          <p role="alert" className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="mb-4 rounded-lg bg-primary/10 p-3 text-sm text-primary">
            {notice}
          </p>
        )}

        {loading ? (
          <p className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            Carregando...
          </p>
        ) : users.length === 0 ? (
          <p className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            {isRequestsPage ? "Não há solicitações pendentes." : "Não há usuários aprovados."}
          </p>
        ) : isRequestsPage ? (
          <div className="space-y-3">
            {users.map((user) => (
              <article
                key={user.id}
                className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold text-card-foreground">{user.name}</h3>
                  <p className="break-all text-sm text-muted-foreground">{user.email}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Solicitado em {formatDateTime(user.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="sr-only" htmlFor={`role-${user.id}`}>Função</label>
                  <select
                    id={`role-${user.id}`}
                    value={pendingRoles[user.id] || "professor"}
                    onChange={(event) =>
                      setPendingRoles((current) => ({
                        ...current,
                        [user.id]: event.target.value,
                      }))
                    }
                    disabled={busyId === user.id}
                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => void decideRequest(user, "approve")}
                    disabled={busyId === user.id}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                  >
                    <Check className="h-4 w-4" />
                    Aprovar
                  </button>
                  <button
                    type="button"
                    onClick={() => void decideRequest(user, "reject")}
                    disabled={busyId === user.id}
                    className="inline-flex items-center gap-1 rounded-lg border border-destructive/40 px-3 py-2 text-sm font-semibold text-destructive disabled:opacity-60"
                  >
                    <X className="h-4 w-4" />
                    Rejeitar
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
              <table className="w-full min-w-[540px] text-left text-sm">
                <thead className="border-b bg-secondary/60 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Nome</th>
                    <th className="px-4 py-3 font-semibold">E-mail</th>
                    <th className="px-4 py-3 font-semibold">Função</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-secondary/50"
                    >
                      <td className="px-4 py-3 font-medium text-card-foreground">
                        <button
                          type="button"
                          onClick={() => void openUser(user)}
                          className="text-left hover:text-primary"
                        >
                          {user.name}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{user.email || "—"}</td>
                      <td className="px-4 py-3 capitalize text-card-foreground">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        )}
      </section>

      <Dialog
        open={selectedUser !== null}
        onOpenChange={(open) => {
          if (!open) closeUser();
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          {selectedUser && (
            <>
              <DialogHeader className="border-b pb-4 pr-8 text-left">
                <DialogTitle className="text-xl font-bold text-card-foreground">
                  {selectedUser.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedUser.email} · Função: {selectedUser.role}
                </DialogDescription>
                <p className="pt-2 text-xs text-muted-foreground">
                  Conta criada: {formatDateTime(selectedUser.createdAt)}
                  {" · "}
                  Última atualização: {formatDateTime(selectedUser.updatedAt)}
                </p>
              </DialogHeader>

              <section>
                <h3 className="mb-3 font-semibold text-card-foreground">
                  Relatórios feitos por este usuário ({reports.length})
                </h3>
                {reportsLoading ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Carregando relatórios...
                  </p>
                ) : reports.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum relatório encontrado.</p>
                ) : (
                  <div className="space-y-2">
                    {reports.map((report) => (
                      <article key={`${report.type}-${report.id}`} className="rounded-lg border p-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedReport(report)}
                            className="flex min-w-0 items-center gap-2 text-left"
                          >
                            <FileText className="h-4 w-4 shrink-0 text-primary" />
                            <span>
                              <span className="block font-medium text-card-foreground">{report.title}</span>
                              <span className="block text-xs text-muted-foreground">
                                {report.type === "leitura" ? "Leitura diária" : "Mãos Dadas"}
                                {" · Criado "}
                                {formatDateTime(report.createdAt)}
                              </span>
                              <span className="block text-xs text-muted-foreground">
                                Atualizado {formatDateTime(report.updatedAt)}
                              </span>
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => void deleteReport(report)}
                            disabled={busyId === report.id}
                            aria-label={`Excluir relatório ${report.title}`}
                            className="rounded p-2 text-destructive hover:bg-destructive/10 disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </DialogContent>
      </Dialog>

      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedReport(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-card p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3 border-b pb-4">
              <div>
                <h2 id="report-title" className="text-xl font-bold text-card-foreground">
                  {selectedReport.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedReport.type === "leitura" ? "Leitura diária" : "Mãos Dadas"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                aria-label="Fechar relatório"
                className="rounded p-2 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <p className="text-xs text-muted-foreground">
                Criado em <span className="block text-sm text-card-foreground">{formatDateTime(selectedReport.createdAt)}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Atualizado em <span className="block text-sm text-card-foreground">{formatDateTime(selectedReport.updatedAt)}</span>
              </p>
            </div>
            <dl className="grid gap-3 sm:grid-cols-2">
              {Object.entries(selectedReport)
                .filter(([key]) => !["id", "userId", "createdAt", "updatedAt", "type", "title"].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="rounded-lg border p-3">
                    <dt className="text-xs font-semibold text-muted-foreground">
                      {labels[key] || key}
                    </dt>
                    <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-card-foreground">
                      {Array.isArray(value)
                        ? value.join(", ")
                        : typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)
                          ? formatDateTime(value)
                          : String(value ?? "—")}
                    </dd>
                  </div>
                ))}
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">
              Relatório em modo de visualização. A administração não pode editá-lo.
            </p>
          </section>
        </div>
      )}
    </main>
  );
};

export default AdminDashboard;
