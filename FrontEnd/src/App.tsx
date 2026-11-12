import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "./layouts/publicLayout";
import AppLayout from "./layouts/appLayout";
import AdminLayout from "./layouts/adminLayout";
import EmpresaLayout from "./layouts/empresaLayout";

import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Cadastro from "./pages/Register";

import Inicio from "./pages/Inicio";
import MinhasOcorrencias from "./pages/MinhasOcorrencias";
import RegistrarOcorrencia from "./pages/RegistrarOcorrencia";
import MeuConsumo from "./pages/MeuConsumo";
import Notificacoes from "./pages/Notificacoes";
import Perfil from "./pages/Perfil";
import DadosPessoais from "./pages/Perfil/DadosPessoais";
import Enderecos from "./pages/Perfil/Enderecos";
import PreferenciasNotificacao from "./pages/Perfil/PreferenciasNotificacao";
import Seguranca from "./pages/Perfil/Seguranca";
import Ajuda from "./pages/Perfil/Ajuda";
import Sobre from "./pages/Perfil/Sobre";

import AdminEmpresas from "./pages/AdminEmpresas";
import AdminDashboard from "./pages/AdminDashboards";

import EmpresaCidades from "./pages/EmpresaCidades";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
        </Route>

        {/* Área do morador */}
        <Route
          element={
            <ProtectedRoute tiposPermitidos={["MORADOR"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/ocorrencias" element={<MinhasOcorrencias />} />
          <Route path="/ocorrencias/nova" element={<RegistrarOcorrencia />} />
          <Route path="/consumo" element={<MeuConsumo />} />
          <Route path="/notificacoes" element={<Notificacoes />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/perfil/dados" element={<DadosPessoais />} />
          <Route path="/perfil/enderecos" element={<Enderecos />} />
          <Route
            path="/perfil/notificacoes"
            element={<PreferenciasNotificacao />}
          />
          <Route path="/perfil/seguranca" element={<Seguranca />} />
          <Route path="/perfil/ajuda" element={<Ajuda />} />
          <Route path="/perfil/sobre" element={<Sobre />} />
        </Route>

        {/* Área administrativa */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute tiposPermitidos={["ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="empresas" element={<AdminEmpresas />} />
        </Route>

        {/* Área da empresa */}
        <Route
          path="/empresa"
          element={
            <ProtectedRoute tiposPermitidos={["EMPRESA"]}>
              <EmpresaLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<div>Dashboard da empresa</div>} />
          <Route path="cidades" element={<EmpresaCidades />} />
          <Route
            path="ocorrencias"
            element={<div>Ocorrências recebidas</div>}
          />
          <Route path="consumo" element={<div>Indicadores de consumo</div>} />
          <Route path="notificacoes" element={<div>Notificações</div>} />
          <Route path="perfil" element={<div>Dados da empresa</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
