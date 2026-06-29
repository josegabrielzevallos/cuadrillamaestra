import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WorkerCard from '../components/WorkerCard';
import { catalogAPI, workerAPI } from '../api/endpoints';
import './SearchResults.css';

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    catalogAPI
      .services()
      .then((r) => {
        const list = r.data.results ?? r.data;
        const found = list.find((s) => s.slug === slug || String(s.id) === slug);
        setService(found || null);
        if (found) {
          return workerAPI.search({ service: found.id });
        }
        return { data: { results: [] } };
      })
      .then((r) => setWorkers(r.data.results ?? r.data))
      .catch(() => setWorkers([]))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="results-page">
      <div className="results-topbar">
        <div className="container" style={{ color: '#fff' }}>
          <h1 style={{ color: '#fff', fontSize: 26 }}>
            {service ? service.name : 'Servicio'}
          </h1>
          {service?.category_name && (
            <p style={{ color: '#cdd6e3', margin: '6px 0 0' }}>
              Categoría: {service.category_name}
            </p>
          )}
        </div>
      </div>
      <div className="container" style={{ paddingTop: 30, paddingBottom: 50 }}>
        {service?.description && (
          <p style={{ color: '#44505f', marginBottom: 24 }}>{service.description}</p>
        )}
        <div className="results-header">
          <h2>Profesionales que ofrecen este servicio</h2>
        </div>
        {loading ? (
          <div className="results-loading">Cargando...</div>
        ) : workers.length === 0 ? (
          <div className="results-empty">
            <h3>No hay profesionales disponibles</h3>
            <button className="btn btn-primary" onClick={() => navigate('/buscar')}>
              Ver todos los maestros
            </button>
          </div>
        ) : (
          <div className="results-grid">
            {workers.map((w) => (
              <WorkerCard key={w.id} worker={w} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetail;
