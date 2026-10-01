import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/publicLayout'
import AppLayout from './layouts/appLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Cadastro from './pages/Register'
import Inicio from './pages/Inicio'
import MinhasOcorrencias from './pages/MinhasOcorrencias'
import RegistrarOcorrencia from './pages/RegistrarOcorrencia'
import MeuConsumo from './pages/MeuConsumo'
import Notificacoes from './pages/Notificacoes'
import Perfil from './pages/Perfil'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
        </Route>

        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/ocorrencias" element={<MinhasOcorrencias />} />
          <Route path="/ocorrencias/nova" element={<RegistrarOcorrencia />} />
          <Route path="/consumo" element={<MeuConsumo />} />
          <Route path="/notificacoes" element={<Notificacoes />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}