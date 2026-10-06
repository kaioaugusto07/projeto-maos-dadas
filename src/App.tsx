import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Login from "./pages/Login.tsx";
import MediadorDashboard from "./pages/MediadorDashboard";
import Materiais from "./pages/RessigDashboard";
import MaosDadas from "./pages/MaoDashboard.tsx";
import Register from "./pages/Register.tsx";
import PendingAcess from "./pages/PendingAcess.tsx";

const queryClient = new QueryClient();

const ProtectedRoute = ({
  children,
  pendingAllowed = false,
}: {
  children: JSX.Element;
  pendingAllowed?: boolean;
}) => {
  const authenticated = localStorage.getItem("autenticado") === "true";
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  if (!authenticated || !user || !token) {
    return <Navigate to="/" replace />;
  }

  if (user.status === "PENDING") {
    return pendingAllowed ? children : <Navigate to="/aguardando-aprovacao" replace />;
  }

  if (pendingAllowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/aguardando-aprovacao" element={<ProtectedRoute pendingAllowed><PendingAcess /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/mediador" element={<ProtectedRoute><MediadorDashboard /></ProtectedRoute>} />
          <Route path="/materiais" element={<ProtectedRoute><Materiais /></ProtectedRoute>} />
          <Route path="/maos-dadas" element={<ProtectedRoute><MaosDadas /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>  
  </QueryClientProvider>
);

export default App;
