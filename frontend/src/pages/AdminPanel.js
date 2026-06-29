import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InboxIcon from '@mui/icons-material/Inbox';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import StarIcon from '@mui/icons-material/Star';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useAuth } from '../context/AuthContext';
import { workerAPI, contactAPI } from '../api/endpoints';
import StarRating from '../components/StarRating';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user } = useAuth();
  const [worker, setWorker] = useState(null);
  const [requests, setRequests] = useState([]);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    workerAPI.me().then((r) => setWorker(r.data)).catch(() => setWorker(false));
    contactAPI.list().then((r) => setRequests(r.data.results ?? r.data)).catch(() => {});
  }, []);

  const changeStatus = (id, status) => {
    contactAPI.updateStatus(id, status).then(() => {
      setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    });
  };

  return (
    <div className="admin-page">
      <div className="container admin-layout">
        <aside className="admin-side">
          <div className="admin-user">
            <div className="admin-avatar">
              {(user?.first_name || user?.username || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{user?.full_name || user?.username}</strong>
              <span>{user?.role}</span>
            </div>
          </div>
          <nav className="admin-nav">
            <button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>
              <DashboardIcon sx={{ fontSize: 20 }} /> Resumen
            </button>
            <button className={tab === 'requests' ? 'active' : ''} onClick={() => setTab('requests')}>
              <InboxIcon sx={{ fontSize: 20 }} /> Solicitudes
            </button>
            <Link to="/subir-proyecto" className="admin-nav-link">
              <AddCircleIcon sx={{ fontSize: 20 }} /> Subir proyecto
            </Link>
            <Link to="/mi-perfil" className="admin-nav-link">
              <DashboardIcon sx={{ fontSize: 20 }} /> Editar perfil
            </Link>
          </nav>
        </aside>

        <section className="admin-content">
          {tab === 'overview' && (
            <>
              <h1>Resumen</h1>
              {worker ? (
                <>
                  <div className="admin-cards">
                    <div className="admin-card">
                      <PhotoLibraryIcon sx={{ fontSize: 28, color: '#0f2a47' }} />
                      <strong>{worker.projects_count}</strong>
                      <span>Proyectos</span>
                    </div>
                    <div className="admin-card">
                      <StarIcon sx={{ fontSize: 28, color: '#f5b301' }} />
                      <strong>{worker.average_rating}</strong>
                      <span>Calificación</span>
                    </div>
                    <div className="admin-card">
                      <InboxIcon sx={{ fontSize: 28, color: '#1e9e6a' }} />
                      <strong>{requests.length}</strong>
                      <span>Solicitudes</span>
                    </div>
                  </div>
                  <div className="admin-profile-card">
                    <h3>{worker.name}</h3>
                    <p>{worker.headline}</p>
                    <StarRating value={worker.average_rating} showValue count={worker.reviews_count} />
                    <Link to={`/maestros/${worker.id}`} className="btn btn-outline" style={{ marginTop: 16 }}>
                      Ver mi perfil público
                    </Link>
                  </div>
                </>
              ) : (
                <div className="admin-empty">
                  <p>Aún no tienes un perfil de trabajador configurado.</p>
                  <Link to="/registro" className="btn btn-primary">Crear perfil</Link>
                </div>
              )}
            </>
          )}

          {tab === 'requests' && (
            <>
              <h1>Solicitudes de contacto / cotización</h1>
              {requests.length === 0 ? (
                <div className="admin-empty"><p>No tienes solicitudes todavía.</p></div>
              ) : (
                <div className="admin-table">
                  <div className="admin-table-head">
                    <span>Cliente</span>
                    <span>Tipo</span>
                    <span>Teléfono</span>
                    <span>Zona</span>
                    <span>Estado</span>
                  </div>
                  {requests.map((r) => (
                    <div key={r.id} className="admin-table-row">
                      <span data-label="Cliente"><strong>{r.client_name}</strong><br /><small>{r.message}</small></span>
                      <span data-label="Tipo">{r.request_type_display}</span>
                      <span data-label="Teléfono">{r.client_phone}</span>
                      <span data-label="Zona">{r.zone || '—'}</span>
                      <span data-label="Estado">
                        <select className={`status status-${r.status}`} value={r.status}
                          onChange={(e) => changeStatus(r.id, e.target.value)}>
                          <option value="new">Nueva</option>
                          <option value="in_progress">En proceso</option>
                          <option value="closed">Cerrada</option>
                        </select>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;
