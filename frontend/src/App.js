import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import WorkerDetail from './pages/WorkerDetail';
import ServiceDetail from './pages/ServiceDetail';
import UploadProject from './pages/UploadProject';
import EditProfile from './pages/EditProfile';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buscar" element={<SearchResults />} />
            <Route path="/maestros/:id" element={<WorkerDetail />} />
            <Route path="/servicios/:slug" element={<ServiceDetail />} />
            <Route path="/contacto/:workerId" element={<Contact />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route
              path="/subir-proyecto"
              element={
                <ProtectedRoute>
                  <UploadProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mi-perfil"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
